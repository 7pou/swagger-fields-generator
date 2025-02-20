import type { EventHandler } from "react";

export const uuid = (): string => {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
      // eslint-disable-next-line no-bitwise
      const r = (Math.random() * 16) | 0;
      // eslint-disable-next-line no-bitwise
      const v = c === 'x' ? r : (r & 0x3) | 0x8;
      return v.toString(16);
    });
};

export const multiLine2array = (str: string): string[] => {
  return str?.split('\n') || [];
}

export const isValid = (data) => {
  return typeof data !== 'undefined' && data !== null && data !== ''
}

export const stringSplit = (str: string, split: string = ','): string[] => {
  if (!str) return [];
  return str?.split(split) || [];
}
// 判断当前的url是否目标url
export const isTargetUrl = (target: string, url: string): boolean => {
  if (!url || !target) return false;
  url = decodeURIComponent(url);
  target = decodeURIComponent(target);
  if (url === target) return true;
  return target.indexOf(url) === 0;
}

export const findTarget = (e: Event, targetSelector: string): HTMLElement|null => {
  let current = e.target as HTMLElement || null;
  while (current && current !== document.body) {
    if (current.matches(targetSelector)) {
      return current;
    }
    current = current.parentElement;
  }
  return null;
};

export const findChild = (el: HTMLElement, targetSelector: string): HTMLElement|null => {
  if (el.matches(targetSelector)) {
    return el;
  }
  for (let i = 0; i < el.children.length; i++) {
    const element = el.children[i];
    const child = findChild(element as HTMLElement, targetSelector)
    if (child) return child
  }
  return null;
};


export const deepClone = (data, cache = new WeakMap()) => {
  if (!data) return data
  if (typeof(data) !== 'object') return data
  if (cache.has(data)) return data
  const cloneTarget = Array.isArray(data) ? [] : {}
  cache.set(data, cloneTarget)
  for (const key in data) {
      cloneTarget[key] = deepClone(data[key], cache)
  }
  return cloneTarget
}