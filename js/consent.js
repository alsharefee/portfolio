/**
 * Mohammed Marzouq — Portfolio
 * Privacy & Analytics Consent Manager (Google Consent Mode v2 compliant)
 */
(function () {
  'use strict';

  var GA_MEASUREMENT_ID = 'G-DNRMDZQ2GC';
  var STORAGE_KEY = 'portfolio_ga_consent';

  function isLocalEnv() {
    var host = location.hostname;
    return host === 'localhost' || host === '127.0.0.1' || host.endsWith('.local');
  }

  function getStoredConsent() {
    try {
      return localStorage.getItem(STORAGE_KEY);
    } catch (e) {
      return null;
    }
  }

  function setStoredConsent(val) {
    try {
      localStorage.setItem(STORAGE_KEY, val);
    } catch (e) {
      // Ignore private browsing storage quota exceptions
    }
  }

  function clearGaCookies() {
    var hostname = location.hostname;
    var domainParts = hostname.split('.');
    var cookies = document.cookie.split(';');
    for (var i = 0; i < cookies.length; i++) {
      var c = cookies[i].trim();
      var eqIdx = c.indexOf('=');
      var name = eqIdx > -1 ? c.substring(0, eqIdx) : c;
      if (name.indexOf('_ga') === 0 || name.indexOf('_gid') === 0) {
        document.cookie = name + '=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
        document.cookie = name + '=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=' + hostname + ';';
        if (domainParts.length > 1) {
          document.cookie = name + '=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=.' + domainParts.slice(-2).join('.') + ';';
        }
      }
    }
  }

  function loadGoogleAnalytics() {
    if (isLocalEnv()) {
      return;
    }
    if (document.getElementById('ga-gtag-script')) {
      return;
    }

    var s = document.createElement('script');
    s.id = 'ga-gtag-script';
    s.async = true;
    s.src = 'https://www.googletagmanager.com/gtag/js?id=' + GA_MEASUREMENT_ID;
    document.head.appendChild(s);

    if (typeof gtag === 'function') {
      gtag('js', new Date());
      gtag('config', GA_MEASUREMENT_ID, {
        anonymize_ip: true,
        allow_google_signals: false,
        allow_ad_personalization_signals: false
      });
    }
  }

  function updateStatusBadge(statusText) {
    var statusEl = document.getElementById('consent-status');
    if (!statusEl) return;
    if (statusText === 'granted') {
      statusEl.textContent = 'Status: Allowed';
      statusEl.classList.remove('status-denied');
      statusEl.classList.add('status-granted');
    } else if (statusText === 'denied') {
      statusEl.textContent = 'Status: Denied';
      statusEl.classList.remove('status-granted');
      statusEl.classList.add('status-denied');
    } else {
      statusEl.textContent = 'Status: Not Set';
      statusEl.classList.remove('status-granted', 'status-denied');
    }
  }

  function showBanner() {
    var banner = document.getElementById('consent-banner');
    if (!banner) return;
    updateStatusBadge(getStoredConsent());
    banner.classList.add('is-visible');
    banner.setAttribute('aria-hidden', 'false');

    // Focus the accept button for accessibility when user opens manually
    var acceptBtn = document.getElementById('consent-accept-btn');
    if (acceptBtn && document.activeElement === document.getElementById('cookie-settings-btn')) {
      acceptBtn.focus();
    }
  }

  function hideBanner() {
    var banner = document.getElementById('consent-banner');
    if (!banner) return;
    banner.classList.remove('is-visible');
    banner.setAttribute('aria-hidden', 'true');
  }

  function handleAccept() {
    setStoredConsent('granted');
    if (typeof gtag === 'function') {
      gtag('consent', 'update', {
        analytics_storage: 'granted'
      });
    }
    loadGoogleAnalytics();
    updateStatusBadge('granted');
    hideBanner();
  }

  function handleDecline() {
    setStoredConsent('denied');
    if (typeof gtag === 'function') {
      gtag('consent', 'update', {
        analytics_storage: 'denied'
      });
    }
    clearGaCookies();
    updateStatusBadge('denied');
    hideBanner();
  }

  function initConsent() {
    var acceptBtn = document.getElementById('consent-accept-btn');
    var declineBtn = document.getElementById('consent-decline-btn');
    var openBtn = document.getElementById('cookie-settings-btn');
    var banner = document.getElementById('consent-banner');

    if (acceptBtn) {
      acceptBtn.addEventListener('click', handleAccept);
    }
    if (declineBtn) {
      declineBtn.addEventListener('click', handleDecline);
    }
    if (openBtn) {
      openBtn.addEventListener('click', function (e) {
        e.preventDefault();
        showBanner();
      });
    }

    // Keyboard support: Escape closes banner if already decided
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && banner && banner.classList.contains('is-visible')) {
        if (getStoredConsent()) {
          hideBanner();
        }
      }
    });

    var currentConsent = getStoredConsent();
    if (!currentConsent) {
      // No decision yet -> show banner with slight delay for smooth entry
      setTimeout(showBanner, 700);
    } else if (currentConsent === 'granted') {
      loadGoogleAnalytics();
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initConsent);
  } else {
    initConsent();
  }
})();
