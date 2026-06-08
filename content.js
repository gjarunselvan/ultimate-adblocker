const aggressiveCss = `
    .ad-container, .ad-wrapper, .ad-banner, .ad-zone, .ad-space,
    [id^="google_ads_"], [id="ad"], [class="ad"], 
    [class*="popup-ad"], [id*="popup-ad"],
    [id*="banner-ad"], [class*="banner-ad"],
    [class*="modal-ad"], [id*="modal-ad"],
    [class*="sponsored"], [id*="sponsored"],
    [class*="taboola"], [id*="taboola"],
    [class*="outbrain"], [id*="outbrain"],
    [class*="mgid"], [id*="mgid"],
    [class*="revcontent"], [id*="revcontent"],
    ins.adsbygoogle, div[data-ad-client],
    ytd-promoted-video-renderer, ytd-display-ad-renderer,
    .video-ads, .ytp-ad-module
    {
        display: none !important;
        opacity: 0 !important;
        visibility: hidden !important;
        pointer-events: none !important;
    }
`;

const style = document.createElement('style');
style.textContent = aggressiveCss;
if (document.documentElement) document.documentElement.appendChild(style);

let enabled = true;
chrome.storage.local.get(['enabled'], (res) => { if (res.enabled === false) enabled = false; });

document.addEventListener('click', (e) => {
    if (!enabled) return;
    let el = e.target;
    const css = window.getComputedStyle(el);
    const opacity = parseFloat(css.opacity || 1);
    const bg = css.backgroundColor;
    
    if (opacity < 0.05 || bg === 'rgba(0, 0, 0, 0)' || bg === 'transparent') {
        if (css.position === 'absolute' || css.position === 'fixed') {
            e.preventDefault();
            e.stopImmediatePropagation();
            el.remove();
            return false;
        }
    }
}, true);

setInterval(() => {
    if (!enabled) return;

    // 1. Brutal Iframe Sweeper (Silent)
    document.querySelectorAll('iframe').forEach(iframe => {
        const src = (iframe.src || "").toLowerCase();
        if (src.includes('youtube.com') || 
            src.includes('vimeo.com') || 
            src.includes('recaptcha') || 
            src.includes('disqus.com') || 
            src.includes('player') || 
            src.includes('video') || 
            src.includes('stream')) {
            return;
        }
        iframe.remove();
    });

    // 2. Scam Phrase Destroyer (Silent)
    const scamPhrases = ['confirm you are not a robot', 'click allow', 'your computer is infected', 'prove you are human', 'click here to verify', 'you are not a robot'];
    document.querySelectorAll('div, dialog, section, aside').forEach(el => {
        const css = window.getComputedStyle(el);
        if (css.position === 'fixed' || css.position === 'absolute' || el.tagName === 'DIALOG' || parseInt(css.zIndex || 0) > 100) {
            const text = (el.textContent || "").toLowerCase();
            for (let phrase of scamPhrases) {
                if (text.includes(phrase)) {
                    el.remove();
                    break;
                }
            }
        }
    });

    // 3. YouTube Video Ad Killer
    const playerContainer = document.querySelector('.html5-video-player');
    if ((playerContainer && playerContainer.classList.contains('ad-showing')) || document.querySelector('.ytp-ad-player-overlay')) {
        const video = document.querySelector('video');
        if (video) {
            video.muted = true;
            if (video.duration > 0) video.currentTime = video.duration - 0.1;
            video.playbackRate = 16.0;
        }
        document.querySelectorAll('.ytp-ad-skip-button, .ytp-ad-skip-button-modern, .ytp-skip-ad-button, .ytp-ad-text[class*="skip"]').forEach(b => b.click());
    }
    document.querySelectorAll('ytd-ad-slot-renderer, ytd-banner-promo-renderer, ytd-player-legacy-desktop-watch-ads-renderer, .ytd-in-feed-ad-layout-renderer, ytd-promoted-sparkles-web-renderer').forEach(el => el.remove());

    const errorScreen = document.querySelector('ytd-enforcement-message-view-model');
    if (errorScreen) {
        const dialog = errorScreen.closest('tp-yt-paper-dialog');
        if (dialog) dialog.remove();
        errorScreen.remove();
        const v = document.querySelector('video');
        if (v && v.paused) v.play();
    }

    // 4. Generic Popup Close Button Auto-Clicker
    document.querySelectorAll('[aria-label*="Close"], [class*="close-ad"], .close').forEach(b => {
        if (b.offsetWidth > 0 && b.offsetHeight > 0) {
             const c = (b.className || '').toString().toLowerCase();
             const a = (b.getAttribute('aria-label') || '').toLowerCase();
             if(c.includes('popup') || a.includes('ad')) b.click();
        }
    });

}, 250);

chrome.runtime.onMessage.addListener((message) => {
  if (message.type === 'UPDATE_SETTINGS') {
      enabled = message.enabled;
      if (!enabled && style.parentNode) {
          style.remove();
      } else if (enabled && !style.parentNode && document.documentElement) {
          document.documentElement.appendChild(style);
      }
  }
});
