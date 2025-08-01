const toggle = document.getElementById('enableToggle');
const btn = document.getElementById('reload');

// Load the state
chrome.storage.local.get({ enabled: true }, prefs => {
  toggle.checked = prefs.enabled;
});

// Saving of the state
toggle.addEventListener('change', () => {
  chrome.storage.local.set({ enabled: toggle.checked });
});

// Reload current Youtube page
btn.addEventListener('click', () => {
  chrome.tabs.query({ url: '*://www.youtube.com/*' }, tabs => {
    tabs.forEach(t => chrome.tabs.reload(t.id));
  });
});
