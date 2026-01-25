(function(window) {
  const ONE_DAY_MS = 24 * 60 * 60 * 1000;
  const MODES = {
    COOKIES: 'cookies',
    LOCAL_STORAGE: 'localStorage'
  };

  function setCookie(name, value, days) {
    const maxAge = days * 24 * 60 * 60;
    document.cookie = `${name}=${value}; path=/; max-age=${maxAge}; SameSite=Lax`;
    const expiryTs = Date.now() + days * ONE_DAY_MS;
    try {
      localStorage.setItem(`pivotphp-cookie-expiry-${name}`, String(expiryTs));
    } catch (e) {
      // ignore quota errors
    }
  }

  function getCookie(name) {
    const cookies = document.cookie ? document.cookie.split('; ') : [];
    for (const c of cookies) {
      const [k, v] = c.split('=');
      if (k === name) return v;
    }
    return null;
  }

  function autoRenewIfExpiring(name, days = 7, thresholdDays = 3) {
    let expiry = null;
    try {
      expiry = parseInt(localStorage.getItem(`pivotphp-cookie-expiry-${name}`), 10);
    } catch (e) {
      expiry = null;
    }
    if (!expiry || Number.isNaN(expiry)) return;
    const remaining = (expiry - Date.now()) / ONE_DAY_MS;
    if (remaining <= thresholdDays) {
      const currentVal = getCookie(name) || 'true';
      setCookie(name, currentVal, days);
    }
  }

  function getCookiesMode() {
    try {
      return localStorage.getItem('pivotphp-cookies-mode') || MODES.COOKIES;
    } catch (e) {
      return MODES.COOKIES;
    }
  }

  function setCookiesMode(mode) {
    try {
      localStorage.setItem('pivotphp-cookies-mode', mode);
    } catch (e) {
      // ignore
    }
  }

  function scheduleRenewal(name, days = 7, thresholdDays = 3) {
    const runner = () => autoRenewIfExpiring(name, days, thresholdDays);
    if (typeof window.requestIdleCallback === 'function') {
      window.requestIdleCallback(runner, { timeout: 2000 });
    } else {
      setTimeout(runner, 500);
    }
  }

  window.CookieManager = {
    setCookie,
    getCookie,
    autoRenewIfExpiring,
    scheduleRenewal,
    getCookiesMode,
    setCookiesMode,
    MODES,
  };
})(window);
