document.addEventListener('DOMContentLoaded', () => {
  const powerSwitch = document.getElementById('powerSwitch');
  const intensitySelect = document.getElementById('intensity');
  const statusText = document.getElementById('statusText');

  // Load saved settings
  chrome.storage.local.get(['enabled', 'intensity'], (result) => {
    powerSwitch.checked = result.enabled !== false; // default to true
    intensitySelect.value = result.intensity || 'medium';
    updateStatusText(powerSwitch.checked);
  });

  powerSwitch.addEventListener('change', (e) => {
    const enabled = e.target.checked;
    chrome.storage.local.set({ enabled });
    updateStatusText(enabled);
  });

  intensitySelect.addEventListener('change', (e) => {
    chrome.storage.local.set({ intensity: e.target.value });
  });

  function updateStatusText(enabled) {
    statusText.textContent = enabled ? 'ON' : 'OFF';
    statusText.style.color = enabled ? '#4CAF50' : '#f44336';
  }
});
