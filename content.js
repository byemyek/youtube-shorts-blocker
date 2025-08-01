// content.js
chrome.storage.local.get({ enabled: true }, prefs => {
  if (!prefs.enabled) return;
  (function () {

  // if we open Shorts video it's instantly reopened in "normal" video format
  function checkAndRedirect(){
    const p = location.pathname;
    if (p.startsWith('/shorts/')){
      const videoId = p.split('/')[2];
      location.replace(`/watch?v=${videoId}`);
      return true;
    }
    return false;
  }

  // hides all Shorts on the main page
  function removeShortsOnFrontPage(){
    //hides shorts on the left menu
    document.querySelectorAll('a[title="Shorts"]').forEach(link => {
      const c = link.closest('style-scope ytd-guide-section-renderer') || link;
      c.style.display = 'none';
    });
    
    //if we are not on the main
    if (location.pathname !== '/') return;

    // hides all previews
    document.querySelectorAll('a[href*="/shorts"]').forEach(link => {
    const c = link.closest('ytd-mini-guide-entry-renderer')
           || link.closest('ytd-guide-entry-renderer')
           || link.closest('ytd-compact-video-renderer')
           || link.closest('ytd-rich-item-renderer')
           || link.closest('ytd-rich-shelf-renderer')
           || link;
    c.style.display = 'none';
    });

    // deleting all titles shorts.
    document.querySelectorAll('#rich-shelf-header-container').forEach(header => {
      const titleSpan = header.querySelector('#title');
      if (titleSpan && /shorts/i.test(titleSpan.textContent)) {
        const shelf = header.closest('ytd-rich-shelf-renderer');
        if (shelf) shelf.style.display = 'none';
      }
    });

  }


  function runAll() {
    // if it was /shorts/, we are redirected already — skip hiding
    if (!checkAndRedirect()) {
      removeShortsOnFrontPage();
    }
  }

  runAll();

  ['pushState','replaceState'].forEach(fn => {
    const orig = history[fn];
    history[fn] = function(...args) {
      const res = orig.apply(this, args);
      setTimeout(runAll, 50);
      return res;
    };
  });

  window.addEventListener('popstate', runAll);

  setInterval(runAll, 1000);
  })();
});


