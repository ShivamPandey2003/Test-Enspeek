export const MODAL_CLOSE_FOCUS_CHAT_EVENT = "modal-close-focus-chat";
export const FOCUS_CHAT_INPUT_EVENT = "focus-chat-input";

export const focusChatInput = () => {
  window.dispatchEvent(new Event(FOCUS_CHAT_INPUT_EVENT));
};
