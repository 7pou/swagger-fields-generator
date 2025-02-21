import { MessageType } from "~common/messageType";

export {}
console.log("HELLO WORLD FROM BGSCRIPTS")
chrome.runtime.onMessage.addListener((message: any) => {
        console.log(message);

  if (message?.type === MessageType.OPTIONS_PARAMS) {
    // setTab(tabmap[message.data.tab])
  }
})
