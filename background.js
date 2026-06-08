const RULESETS = {
  light: ['ruleset_light'],
  medium: ['ruleset_light'],
  severe: ['ruleset_light', 'ruleset_severe']
};

chrome.storage.onChanged.addListener((changes, namespace) => {
  if (namespace === 'local') {
    chrome.storage.local.get(['enabled', 'intensity'], (result) => {
      updateRulesets(result.enabled !== false, result.intensity || 'medium');
      // Notify tabs so content scripts can update immediately without reload
      chrome.tabs.query({}, (tabs) => {
        tabs.forEach(tab => {
          chrome.tabs.sendMessage(tab.id, {
            type: 'UPDATE_SETTINGS',
            enabled: result.enabled !== false,
            intensity: result.intensity || 'medium'
          }).catch(() => {});
        });
      });
    });
  }
});

function updateRulesets(enabled, intensity) {
  const allRulesets = ['ruleset_light', 'ruleset_severe'];
  let enableRulesets = [];
  let disableRulesets = [];

  if (!enabled) {
    disableRulesets = allRulesets;
  } else {
    enableRulesets = RULESETS[intensity] || [];
    disableRulesets = allRulesets.filter(id => !enableRulesets.includes(id));
  }

  chrome.declarativeNetRequest.updateEnabledRulesets({
    enableRulesetIds: enableRulesets,
    disableRulesetIds: disableRulesets
  });
}

// Initialize on install
chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.local.set({ enabled: true, intensity: 'medium' });
  updateRulesets(true, 'medium');
});
