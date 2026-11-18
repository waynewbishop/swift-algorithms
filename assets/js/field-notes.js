/**
 * Field Notes design behaviour: chapter drawer, theme toggle, on-page contents and copy buttons.
 * Plain JavaScript with no dependencies; every feature degrades to a readable page without it.
 */
(function () {
  'use strict';

  var root = document.documentElement;

  // Reads a saved value without failing when storage is blocked.
  function readStorage(key) {
    try { return localStorage.getItem(key); } catch (e) { return null; }
  }

  // Saves a value without failing when storage is blocked.
  function writeStorage(key, value) {
    try { localStorage.setItem(key, value); } catch (e) {}
  }

  // ---- Theme toggle ----
  var themeButton = document.querySelector('.fn-theme-button');

  // Applies a theme and updates the toggle's pressed state and label.
  function applyTheme(theme) {
    root.setAttribute('data-theme', theme);
    if (themeButton) {
      var dark = theme === 'dark';
      themeButton.setAttribute('aria-pressed', dark ? 'true' : 'false');
    }
  }

  applyTheme(readStorage('fn-theme') === 'dark' ? 'dark' : 'light');

  if (themeButton) {
    themeButton.addEventListener('click', function () {
      var next = root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
      applyTheme(next);
      writeStorage('fn-theme', next);
    });
  }

  // ---- Chapter drawer on small screens ----
  var menuButton = document.querySelector('.fn-menu-button');
  var sidebar = document.getElementById('fn-sidebar');
  var overlay = document.querySelector('.fn-overlay');

  // Opens the chapter drawer and moves focus into it.
  function openDrawer() {
    sidebar.classList.add('is-open');
    overlay.hidden = false;
    menuButton.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
    var current = sidebar.querySelector('[aria-current="page"]') || sidebar.querySelector('a');
    if (current) current.focus();
  }

  // Closes the chapter drawer and returns focus to the menu button.
  function closeDrawer(restoreFocus) {
    sidebar.classList.remove('is-open');
    overlay.hidden = true;
    menuButton.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
    if (restoreFocus) menuButton.focus();
  }

  if (menuButton && sidebar && overlay) {
    menuButton.addEventListener('click', function () {
      if (sidebar.classList.contains('is-open')) closeDrawer(true); else openDrawer();
    });
    overlay.addEventListener('click', function () { closeDrawer(true); });
    document.addEventListener('keydown', function (event) {
      if (event.key === 'Escape' && sidebar.classList.contains('is-open')) closeDrawer(true);
    });
    window.addEventListener('resize', function () {
      if (window.innerWidth > 960 && sidebar.classList.contains('is-open')) closeDrawer(false);
    });
  }

  // ---- On-page contents built from the chapter's h2 headings ----
  var article = document.querySelector('.fn-article');
  var headings = article ? Array.prototype.slice.call(article.querySelectorAll('h2[id]')) : [];
  var tocLinks = [];

  if (headings.length > 1) {
    document.querySelectorAll('.fn-toc-list').forEach(function (list) {
      headings.forEach(function (heading) {
        var item = document.createElement('li');
        var link = document.createElement('a');
        link.href = '#' + heading.id;
        link.textContent = heading.textContent;
        link.setAttribute('data-target', heading.id);
        item.appendChild(link);
        list.appendChild(item);
        tocLinks.push(link);
      });
    });
    document.querySelectorAll('.fn-toc, .fn-toc-mobile').forEach(function (panel) { panel.hidden = false; });

    // Closes the mobile panel after a reader picks a section.
    document.querySelectorAll('.fn-toc-mobile a').forEach(function (link) {
      link.addEventListener('click', function () { link.closest('details').open = false; });
    });

    // Marks the section currently being read.
    var setCurrent = function (id) {
      tocLinks.forEach(function (link) {
        if (link.getAttribute('data-target') === id) link.setAttribute('aria-current', 'true');
        else link.removeAttribute('aria-current');
      });
    };

    if ('IntersectionObserver' in window) {
      var observer = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) setCurrent(entry.target.id);
        });
      }, { rootMargin: '-80px 0px -70% 0px', threshold: 0 });
      headings.forEach(function (heading) { observer.observe(heading); });
    }
    setCurrent(headings[0].id);
  }

  // ---- Home page: Continue button and "You are here" pin ----
  var lastChapter = null;
  try { lastChapter = JSON.parse(readStorage('fn-last-chapter') || 'null'); } catch (e) {}

  var continueButton = document.querySelector('.fn-continue');
  if (continueButton && lastChapter && lastChapter.slug && lastChapter.number > 1) {
    var start = document.querySelector('.fn-button-primary');
    if (start) continueButton.href = start.getAttribute('href').replace(/[^/]*$/, lastChapter.slug);
    continueButton.textContent = 'Continue · Ch ' + lastChapter.number;
    continueButton.hidden = false;
  }

  var pin = document.querySelector('.fn-route-pin');
  if (pin && lastChapter && lastChapter.number) {
    var mark = document.querySelector('.fn-route-mark[data-chapter="' + lastChapter.number + '"]');
    if (mark) {
      mark.classList.add('is-here');
      var dot = mark.querySelector('circle');
      if (dot) dot.setAttribute('r', '8');
      var pinX = parseFloat(mark.getAttribute('data-x'));
      pin.setAttribute('transform', 'translate(' + pinX + ' ' + mark.getAttribute('data-y') + ')');
      // Slide the label sideways near either end so it stays inside the drawing; the stem stays on the marker.
      var shift = Math.max(6 - (pinX - 50), Math.min(0, 1154 - (pinX + 50)));
      var label = pin.querySelector('rect');
      var labelText = pin.querySelector('text');
      if (label) label.setAttribute('x', String(-50 + shift));
      if (labelText) labelText.setAttribute('x', String(shift));
      pin.classList.add('is-shown');
    }
  }

  // ---- Copy buttons on code listings ----
  // Briefly shows a label on the copy button, then restores it.
  function flash(button, label) {
    button.textContent = label;
    button.classList.add('is-copied');
    setTimeout(function () {
      button.textContent = 'Copy';
      button.classList.remove('is-copied');
    }, 2000);
  }

  if (article && navigator.clipboard) {
    article.querySelectorAll('div.highlighter-rouge').forEach(function (block) {
      var code = block.querySelector('pre code');
      if (!code) return;
      var button = document.createElement('button');
      button.type = 'button';
      button.className = 'fn-copy';
      button.textContent = 'Copy';
      button.setAttribute('aria-label', 'Copy code');
      button.addEventListener('click', function () {
        navigator.clipboard.writeText(code.textContent).then(function () {
          flash(button, 'Copied');
        }, function () {
          flash(button, 'Press ⌘C');
        });
      });
      block.appendChild(button);
    });
  }
})();
