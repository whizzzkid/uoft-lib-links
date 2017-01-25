/**
 * Namespace
 * @type {Object}
 */
UofTLibApp = {};

/**
 * Override the following links.
 * @type {Object}
 */
UofTLibApp.LINKS = {
  'dl.acm.org': 'dl.acm.org.myaccess.library.utoronto.ca',
  'ieeexplore.ieee.org': 'ieeexplore.ieee.org.myaccess.library.utoronto.ca',
  'www.engineeringvillage.com': 'www-engineeringvillage-com.myaccess.library.utoronto.ca',
  'www.scopus.com': 'www-scopus-com.myaccess.library.utoronto.ca',
  'apps.webofknowledge.com': 'apps.webofknowledge.com.myaccess.library.utoronto.ca',
  'search.proquest.com': 'search.proquest.com.myaccess.library.utoronto.ca'
};

/**
 * Generates the callack handler function.
 * @param {string} link
 * @return {function} callback.
 */
UofTLibApp.redirectCallBack = function (link) {
  return function (details) {
    this.analyticTrack('Redirect', details.url, link);
    return { redirectUrl: details.url.replace(link, this.LINKS[link]) };
  }.bind(this);
};

/**
 * Sets Up Redirect Listeners.
 */
UofTLibApp.setUpListeners = function () {
  for (var link in this.LINKS) {
    chrome.webRequest.onBeforeRequest.addListener(
      this.redirectCallBack(link),
      // Applies to following url patterns
      { urls: ['*://' + link + '/*'] },
      // In request blocking mode
      ['blocking']
    );
  }
};

/**
 * Loads Google Analytics source.
 * The new universal tracking is painful to set up.
 */
UofTLibApp.LoadGoogleAnalytics = function () {
  if (!window.ga) {
    // Load ga code.
    (function () {
      window.ga = function() {
        (window.ga.q = window.ga.q || []).push(arguments);
      }, window.ga.l = 1 * new Date();
      var tag = 'script';
      var a = document.createElement(tag);
      var m = document.getElementsByTagName(tag)[0];
      a.async = 1;
      a.src = 'https://www.google-analytics.com/analytics.js';
      m.parentNode.insertBefore(a, m);
    })();
    // Setup account.
    ga('create', 'UA-90932606-1', 'auto');
    // The need this for some reason.
    ga('set', 'checkProtocolTask', null);
    // I don't even know wtf does this do.
    ga('require', 'displayfeatures');
    // I need to override this manually because GA will reject urls beginning
    // with chrome://... wtf!
    ga('send', 'pageview', '/background.html');
    // For personal tracking.
    this.analyticTrack('Load', 'Background', 'Active');
  }
};

/**
 * Reports event to GA.
 * @param {String} category
 * @param {String} action
 * @param {String} label
 */
UofTLibApp.analyticTrack = function (category, action, label) {
  ga('send', {
    hitType: 'event',
    eventCategory: category,
    eventAction: action,
    eventLabel: label
  });
};

/**
 * Init code.
 */
UofTLibApp.init = function () {
  this.setUpListeners();
  this.LoadGoogleAnalytics();
};

// Init
UofTLibApp.init();