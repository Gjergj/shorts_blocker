(function () {
  const toggle = document.getElementById('toggle') as HTMLInputElement;
  const commentsToggle = document.getElementById('commentsToggle') as HTMLInputElement;
  const statusEl = document.getElementById('status') as HTMLElement;

  chrome.storage.sync.get(['enabled', 'hideComments'], (result) => {
    const enabled = result.enabled !== false;
    const hideComments = result.hideComments === true;
    toggle.checked = enabled;
    commentsToggle.checked = hideComments;
    updateStatus(enabled, hideComments);
  });

  toggle.addEventListener('change', () => {
    const enabled = toggle.checked;
    chrome.storage.sync.set({ enabled }, () => {
      updateStatus(enabled, commentsToggle.checked);
      chrome.runtime.sendMessage({ action: 'toggleBlocking', enabled });
    });
  });

  commentsToggle.addEventListener('change', () => {
    const hideComments = commentsToggle.checked;
    chrome.storage.sync.set({ hideComments }, () => {
      updateStatus(toggle.checked, hideComments);
      chrome.runtime.sendMessage({ action: 'toggleComments', hideComments });
    });
  });

  function updateStatus(enabled: boolean, hideComments: boolean): void {
    const parts: string[] = [];
    if (enabled) parts.push('Shorts blocked');
    if (hideComments) parts.push('Comments hidden');
    statusEl.textContent = parts.length > 0 ? parts.join(', ') : 'All features disabled';
  }
})();
