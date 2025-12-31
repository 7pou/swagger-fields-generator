/* 跨上下文（background/content/popup/options）事件总线
 * 设计说明：
 * - 任一上下文调用 emit(event, payload) 即可；
 * - 背景页（service worker）作为路由中枢，负责广播到 tabs 与扩展页面；
 * - 避免回环：使用实例级 originId；默认不回送给事件发起上下文；
 * - API：
 *   - on(event, handler): () => void
 *   - off(event, handler): void
 *   - once(event, handler): () => void
 *   - emit(event, payload, options?)
 */

type ContextType = "background" | "content" | "extension";

type EventHandler = (payload: any, meta: { from: ContextType }) => void;

type EmitTarget = "all" | "background" | "tabs" | "extension";

interface EmitOptions {
  target?: EmitTarget;
  tabId?: number; // 当 target === 'tabs' 指定单个 tab
  includeSelf?: boolean; // 是否将消息回送给自己（默认 false）
}

interface BusMessage {
  __eventBus: true;
  action: "emit";
  event: string;
  payload: any;
  from: ContextType;
  target: EmitTarget;
  meta?: { tabId?: number };
  forwarded?: boolean; // 背景页转发后打标，避免再次转发
  originId: string; // 事件发起方实例 id，用于避免回送
}

class CrossContextEventBus {
  private listeners: Map<string, Set<EventHandler>> = new Map();
  private context: ContextType;
  private originId: string;

  constructor() {
    this.context = this.detectContext();
    this.originId = self.crypto?.randomUUID?.() ?? `${Date.now()}_${Math.random()}`;
    this.bindRuntimeListener();
  }

  on(event: string, handler: EventHandler) {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, new Set());
    }
    this.listeners.get(event)!.add(handler);
    return () => this.off(event, handler);
  }

  once(event: string, handler: EventHandler) {
    const off = this.on(event, (payload, meta) => {
      try {
        handler(payload, meta);
      } finally {
        off();
      }
    });
    return off;
  }

  off(event: string, handler: EventHandler) {
    this.listeners.get(event)?.delete(handler);
  }

  async emit(event: string, payload?: any, options: EmitOptions = {}) {
    const { target = "all", includeSelf = false, tabId } = options;
    // 先本地触发（可选）
    if (includeSelf) {
      this.dispatchLocal(event, payload, { from: this.context });
    }

    const message: BusMessage = {
      __eventBus: true,
      action: "emit",
      event,
      payload,
      from: this.context,
      target,
      meta: tabId ? { tabId } : undefined,
      forwarded: false,
      originId: this.originId
    };

    if (this.context === "background") {
      await this.forwardFromBackground(message);
    } else {
      // 非背景页统一走 runtime -> 由背景页路由分发
      try {
        await chrome.runtime.sendMessage(message);
      } catch {
        // 忽略发送失败（例如背景未激活时，Chrome 会自动唤醒）
      }
    }
  }

  // --- internal ---

  private detectContext(): ContextType {
    // MV3 背景为 service worker：没有 window
    if (typeof window === "undefined") {
      return "background";
    }
    // 扩展页面（如 popup/options）其 URL 以 chrome.runtime.getURL("") 开头
    const extBase = chrome?.runtime?.getURL?.("") ?? "";
    if (extBase && window.location?.href?.startsWith(extBase)) {
      return "extension";
    }
    return "content";
  }

  private bindRuntimeListener() {
    try {
      chrome.runtime.onMessage.addListener((message: any) => {
        const msg = message as Partial<BusMessage>;
        if (msg && msg.__eventBus === true && msg.action === "emit") {
          this.handleIncomingMessage(msg as BusMessage);
        }
      });
    } catch {
      // 某些极端环境下没有 chrome.runtime
    }
  }

  private handleIncomingMessage(message: BusMessage) {
    // 背景页收到来自其它上下文的 emit：分发给自己，再转发
    if (this.context === "background") {
      // 背景本地分发
      this.dispatchLocal(message.event, message.payload, { from: message.from });
      // 转发到目标
      if (!message.forwarded) {
        this.forwardFromBackground({ ...message, forwarded: true }).catch(() => void 0);
      }
      return;
    }

    // 其他上下文：只处理从背景转发的消息，且不回送给事件发起者
    if (message.forwarded && message.originId !== this.originId) {
      this.dispatchLocal(message.event, message.payload, { from: message.from });
    }
  }

  private async forwardFromBackground(message: BusMessage) {
    const { target, meta } = message;
    // 广播到扩展页面（popup/options）
    const sendToExtensionPages = async () => {
      try {
        await chrome.runtime.sendMessage(message);
      } catch {
        // 没有打开的扩展页面时会抛错，忽略
      }
    };
    // 广播到标签页（content scripts）
    const sendToTabs = async () => {
      try {
        if (meta?.tabId != null) {
          await chrome.tabs.sendMessage(meta.tabId, message);
          return;
        }
        const tabs = await chrome.tabs.query({});
        await Promise.all(
          tabs.map((t) => (t.id != null ? chrome.tabs.sendMessage(t.id, message).catch(() => void 0) : Promise.resolve()))
        );
      } catch {
        // 无权限或无匹配的 content，忽略
      }
    };

    if (target === "background") {
      // 仅背景本地
      return;
    }
    if (target === "extension") {
      await sendToExtensionPages();
      return;
    }
    if (target === "tabs") {
      await sendToTabs();
      return;
    }
    // 默认 'all'
    await Promise.all([sendToExtensionPages(), sendToTabs()]);
  }

  private dispatchLocal(event: string, payload: any, meta: { from: ContextType }) {
    const set = this.listeners.get(event);
    if (!set || set.size === 0) return;
    set.forEach((handler) => {
      try {
        handler(payload, meta);
      } catch {
        // 忽略单个监听器异常
      }
    });
  }
}

const eventBus = new CrossContextEventBus();

export default eventBus;
export const on = eventBus.on.bind(eventBus);
export const once = eventBus.once.bind(eventBus);
export const off = eventBus.off.bind(eventBus);
export const emit = eventBus.emit.bind(eventBus);


