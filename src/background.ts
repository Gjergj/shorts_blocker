chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.sync.get(['enabled'], (result) => {
    if (result.enabled === undefined) {
      chrome.storage.sync.set({ enabled: true });
    }
  });
  updateRules(true);
});

chrome.runtime.onMessage.addListener((message: { action: string; enabled: boolean }) => {
  if (message.action === 'toggleBlocking') {
    updateRules(message.enabled);
  }
});

async function updateRules(enabled: boolean): Promise<void> {
  if (enabled) {
    await chrome.declarativeNetRequest.updateEnabledRulesets({
      enableRulesetIds: ['ruleset_1']
    });
  } else {
    await chrome.declarativeNetRequest.updateEnabledRulesets({
      disableRulesetIds: ['ruleset_1']
    });
  }
}

chrome.storage.sync.get(['enabled'], (result) => {
  updateRules(result.enabled !== false);
});
