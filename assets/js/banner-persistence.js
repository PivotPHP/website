(function(window, document) {
  const COOKIE_PREFIX = 'banner-dismissed-';
  const DAYS = 7;
  const THRESHOLD = 3;

  function isDismissed(version) {
    const mode = window.CookieManager ? window.CookieManager.getCookiesMode() : 'cookies';
    const key = `${COOKIE_PREFIX}${version}`;
    if (mode === window.CookieManager?.MODES.LOCAL_STORAGE) {
      try {
        return localStorage.getItem(key) === 'true';
      } catch (e) {
        return false;
      }
    }
    return window.CookieManager?.getCookie(key) === 'true';
  }

  function dismiss(version) {
    const mode = window.CookieManager ? window.CookieManager.getCookiesMode() : 'cookies';
    const key = `${COOKIE_PREFIX}${version}`;
    if (mode === window.CookieManager?.MODES.LOCAL_STORAGE) {
      try {
        localStorage.setItem(key, 'true');
      } catch (e) {
        // ignore
      }
      return;
    }
    window.CookieManager?.setCookie(key, 'true', DAYS);
    window.CookieManager?.scheduleRenewal(key, DAYS, THRESHOLD);
  }

  function attachVisibilityRenewal(banners) {
    const handler = () => {
      if (!window.CookieManager) return;
      banners.forEach((banner) => {
        const version = banner.dataset.version;
        if (!version) return;
        const mode = window.CookieManager.getCookiesMode();
        if (mode === window.CookieManager.MODES.LOCAL_STORAGE) return;
        window.CookieManager.scheduleRenewal(`${COOKIE_PREFIX}${version}`, DAYS, THRESHOLD);
      });
    };
    document.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'visible') handler();
    });
    handler();
  }

  document.addEventListener('DOMContentLoaded', () => {
    const banners = Array.from(document.querySelectorAll('.version-banner'));
    if (!banners.length) return;

    banners.forEach((banner) => {
      const version = banner.dataset.version;
      if (!version) return;
      if (isDismissed(version)) {
        banner.remove();
        return;
      }
      const btn = banner.querySelector('[data-version-dismiss]');
      if (btn) {
        btn.addEventListener('click', () => {
          dismiss(version);
          banner.remove();
        });
      }
    });

    attachVisibilityRenewal(banners);
  });
})(window, document);
