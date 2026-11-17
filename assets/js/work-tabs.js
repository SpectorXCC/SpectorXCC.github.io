(function () {
  'use strict';

  var section = document.getElementById('featured-work');
  if (!section) return;

  var tabs = Array.prototype.slice.call(section.querySelectorAll('.work-tab[role="tab"]'));
  var panels = Array.prototype.slice.call(section.querySelectorAll('.work-tabpanel[role="tabpanel"]'));
  var moreLink = document.getElementById('featured-work-more');
  if (!tabs.length || tabs.length !== panels.length) return;

  function activateTab(nextTab, moveFocus) {
    var targetId = nextTab.getAttribute('data-work-target');
    var detailUrl = nextTab.getAttribute('data-detail-url');

    tabs.forEach(function (tab) {
      var selected = tab === nextTab;
      tab.setAttribute('aria-selected', selected ? 'true' : 'false');
      tab.setAttribute('tabindex', selected ? '0' : '-1');
    });

    panels.forEach(function (panel) {
      var match = panel.getAttribute('data-work-panel') === targetId;
      if (match) {
        panel.removeAttribute('hidden');
      } else {
        panel.setAttribute('hidden', 'until-found');
      }
    });

    if (moreLink && detailUrl) {
      moreLink.setAttribute('href', detailUrl);
    }

    if (typeof nextTab.scrollIntoView === 'function') {
      nextTab.scrollIntoView({ block: 'nearest', inline: 'nearest' });
    }

    if (moveFocus) {
      nextTab.focus();
    }
  }

  tabs.forEach(function (tab, index) {
    tab.addEventListener('click', function () {
      activateTab(tab, false);
    });

    tab.addEventListener('keydown', function (event) {
      var nextIndex = -1;
      if (event.key === 'ArrowRight') {
        nextIndex = (index + 1) % tabs.length;
      } else if (event.key === 'ArrowLeft') {
        nextIndex = (index - 1 + tabs.length) % tabs.length;
      } else if (event.key === 'Home') {
        nextIndex = 0;
      } else if (event.key === 'End') {
        nextIndex = tabs.length - 1;
      }
      if (nextIndex >= 0) {
        event.preventDefault();
        activateTab(tabs[nextIndex], true);
      }
    });
  });

  panels.forEach(function (panel) {
    panel.addEventListener('beforematch', function () {
      var targetId = panel.getAttribute('data-work-panel');
      var matchingTab = tabs.find(function (t) {
        return t.getAttribute('data-work-target') === targetId;
      });
      if (matchingTab) {
        activateTab(matchingTab, false);
      }
    });
  });
})();
