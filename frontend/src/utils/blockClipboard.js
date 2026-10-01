const SHORTCUTS = {
  paste: (e) =>
    ((e.ctrlKey || e.metaKey) &&
      !e.shiftKey &&
      !e.altKey &&
      e.code === "KeyV") ||
    (e.shiftKey && !e.ctrlKey && !e.metaKey && e.code === "Insert"),
  copy: (e) =>
    ((e.ctrlKey || e.metaKey) &&
      !e.shiftKey &&
      !e.altKey &&
      e.code === "KeyC") ||
    (e.ctrlKey && !e.shiftKey && !e.altKey && e.code === "Insert"),
  cut: (e) =>
    ((e.ctrlKey || e.metaKey) &&
      !e.shiftKey &&
      !e.altKey &&
      e.code === "KeyX") ||
    (e.shiftKey && !e.ctrlKey && !e.metaKey && e.code === "Delete"),
};

export function blockClipboard(
  element,
  { events = ["copy", "cut", "paste", "drop"], onBlocked } = {},
) {
  if (!element) return () => {};

  const handler = (e) => {
    e.preventDefault();
    e.stopPropagation();
    e.stopImmediatePropagation();
    onBlocked?.(e.type);
  };

  const keyHandler = (e) => {
    if (events.some((name) => SHORTCUTS[name]?.(e))) handler(e);
  };

  const inputHandler = (e) => {
    if (
      typeof e.inputType === "string" &&
      e.inputType.startsWith("insertFrom")
    ) {
      handler(e);
    }
  };
  events.forEach((name) => element.addEventListener(name, handler, true));
  element.addEventListener("keydown", keyHandler, true);
  element.addEventListener("beforeinput", inputHandler, true);

  return () => {
    events.forEach((name) => element.removeEventListener(name, handler, true));
    element.removeEventListener("keydown", keyHandler, true);
    element.removeEventListener("beforeinput", inputHandler, true);
  };
}
