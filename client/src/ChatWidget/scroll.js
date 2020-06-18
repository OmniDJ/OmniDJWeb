export const MESSAGE_BOX_SCROLL_DURATION = 400;

function sinEaseOut(timestamp, begining, change, duration) {
  return (
    change *
      ((timestamp = timestamp / duration - 1) * timestamp * timestamp + 1) +
    begining
  );
}

function scrollWithSlowMotion(target, scrollStart, scroll) {
  const raf = window?.requestAnimationFrame;
  let start = 0;
  const step = (timestamp) => {
    if (!start) {
      start = timestamp;
    }
    let stepScroll = sinEaseOut(
      timestamp - start,
      0,
      scroll,
      MESSAGE_BOX_SCROLL_DURATION
    );
    let total = scrollStart + stepScroll;
    target.scrollTop = total;
    if (total < scrollStart + scroll) {
      raf(step);
    }
  };
  raf(step);
}

export function scrollToBottom(messagesDiv) {
  if (!messagesDiv) return;
  const screenHeight = messagesDiv.clientHeight;
  const scrollTop = messagesDiv.scrollTop;
  const scrollOffset = messagesDiv.scrollHeight - (scrollTop + screenHeight);
  if (scrollOffset) scrollWithSlowMotion(messagesDiv, scrollTop, scrollOffset);
}
