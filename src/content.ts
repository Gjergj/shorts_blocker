let isEnabled = true;
let hideComments = false;

chrome.storage.sync.get(['enabled', 'hideComments'], (result) => {
  isEnabled = result.enabled !== false;
  hideComments = result.hideComments === true;
  if (isEnabled) blockShorts();
  if (hideComments) blockComments();
});

chrome.storage.onChanged.addListener((changes) => {
  if (changes.enabled) {
    isEnabled = changes.enabled.newValue as boolean;
    if (isEnabled) {
      blockShorts();
    } else {
      location.reload();
    }
  }
  if (changes.hideComments) {
    hideComments = changes.hideComments.newValue as boolean;
    if (hideComments) {
      blockComments();
    } else {
      location.reload();
    }
  }
});

function blockShorts(): void {
  if (!isEnabled) return;

  const path = window.location.pathname;

  // Handle /@channel/shorts URLs -> redirect to channel page
  const channelShortsMatch = path.match(/^\/(@[^/]+)\/shorts/);
  if (channelShortsMatch) {
    window.location.href = `https://www.youtube.com/${channelShortsMatch[1]}`;
    return;
  }

  // Handle /shorts/videoId URLs -> redirect to homepage
  if (path.match(/^\/shorts\/.+/)) {
    window.location.href = 'https://www.youtube.com/';
    return;
  }

  // Remove shorts from feed
  const shortsLinks = document.querySelectorAll<HTMLAnchorElement>('a[href*="/shorts/"]');
  shortsLinks.forEach(link => {
    link.closest('ytd-rich-item-renderer, ytd-grid-video-renderer, ytd-reel-item-renderer, ytd-video-renderer')?.remove();
  });

  const shortsShelf = document.querySelectorAll('ytd-reel-shelf-renderer, ytd-rich-shelf-renderer[is-shorts]');
  shortsShelf.forEach(shelf => shelf.remove());

  const shortsSidebar = document.querySelectorAll('ytd-guide-entry-renderer a[title="Shorts"], ytd-mini-guide-entry-renderer[aria-label="Shorts"]');
  shortsSidebar.forEach(item => item.closest('ytd-guide-entry-renderer, ytd-mini-guide-entry-renderer')?.remove());
}

function blockComments(): void {
  if (!hideComments) return;

  const commentSections = document.querySelectorAll('ytd-comments, #comments');
  commentSections.forEach(section => (section as HTMLElement).style.display = 'none');
}

const observer = new MutationObserver(() => {
  if (isEnabled) blockShorts();
  if (hideComments) blockComments();
});

if (document.body) {
  observer.observe(document.body, { childList: true, subtree: true });
} else {
  document.addEventListener('DOMContentLoaded', () => {
    observer.observe(document.body, { childList: true, subtree: true });
  });
}

let lastUrl = location.href;
new MutationObserver(() => {
  if (location.href !== lastUrl) {
    lastUrl = location.href;
    if (isEnabled) blockShorts();
    if (hideComments) blockComments();
  }
}).observe(document, { subtree: true, childList: true });
