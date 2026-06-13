(function () {
  var isSubdir = window.location.pathname.replace(/\\/g, '/').indexOf('/perfume-pages/') !== -1;
  var root = isSubdir ? '../' : '';
  var page = window.location.pathname.replace(/\\/g, '/').split('/').pop() || 'index.html';

  function active(name) {
    return page === name ? ' nav-link-active' : '';
  }

  document.addEventListener('DOMContentLoaded', function () {

    // ── Inject navbar ────────────────────────────────────────────
    var nav = document.createElement('nav');
    nav.className = 'navbar';
    nav.id = 'siteNav';
    nav.innerHTML =
      '<a class="logo-brand" href="' + root + 'index.html">Parfum Enchanté</a>' +
      '<div class="navbar-links">' +
        '<a class="nav-link' + active('index.html') + '" href="' + root + 'index.html">Home</a>' +
        '<a class="nav-link" href="' + root + 'index.html#products">Products</a>' +
        '<a class="nav-link' + active('about-us.html') + '" href="' + root + 'about-us.html">About Us</a>' +
        '<a class="nav-link' + active('contact-us.html') + '" href="' + root + 'contact-us.html">Contact</a>' +
      '</div>' +
      '<div class="navbar-actions">' +
        '<div id="navbarBasic"></div>' +
        '<button class="nav-hamburger" id="navHamburger" aria-label="Toggle menu" aria-expanded="false">' +
          '<span></span><span></span>' +
        '</button>' +
      '</div>';

    document.body.insertBefore(nav, document.body.firstChild);

    // ── Inject overlay ───────────────────────────────────────────
    var overlay = document.createElement('div');
    overlay.className = 'nav-overlay';
    overlay.id = 'navOverlay';
    overlay.setAttribute('aria-hidden', 'true');
    overlay.innerHTML =
      '<div class="nav-overlay-inner">' +
        '<a class="nav-overlay-link" href="' + root + 'index.html">Home</a>' +
        '<a class="nav-overlay-link" href="' + root + 'index.html#products">Products</a>' +
        '<a class="nav-overlay-link" href="' + root + 'about-us.html">About Us</a>' +
        '<a class="nav-overlay-link" href="' + root + 'contact-us.html">Contact</a>' +
      '</div>';
    document.body.appendChild(overlay);

    // ── Toggle logic ─────────────────────────────────────────────
    var hamburger = document.getElementById('navHamburger');
    var isOpen = false;

    function openMenu() {
      isOpen = true;
      hamburger.classList.add('open');
      hamburger.setAttribute('aria-expanded', 'true');
      overlay.classList.add('open');
      overlay.setAttribute('aria-hidden', 'false');
      document.body.classList.add('nav-overlay-open');
      if (window.locoScroll) window.locoScroll.stop();
    }

    function closeMenu() {
      isOpen = false;
      hamburger.classList.remove('open');
      hamburger.setAttribute('aria-expanded', 'false');
      overlay.classList.remove('open');
      overlay.setAttribute('aria-hidden', 'true');
      document.body.classList.remove('nav-overlay-open');
      if (window.locoScroll) window.locoScroll.start();
    }

    hamburger.addEventListener('click', function () {
      isOpen ? closeMenu() : openMenu();
    });

    overlay.querySelectorAll('.nav-overlay-link').forEach(function (link) {
      link.addEventListener('click', closeMenu);
    });

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && isOpen) closeMenu();
    });
  });
})();
