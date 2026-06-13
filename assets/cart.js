var Cart = (function () {
  var CATALOG = {
    'vanilla':         { name: 'Vanilla Perfume',                price: 45,  img: 'assets/perfume-image/vanilla.webp' },
    'bombshell':       { name: "Victoria's Secret Bombshell",    price: 65,  img: 'assets/perfume-image/bombshell.jpg' },
    'scandalous':      { name: "Victoria's Secret Scandalous",   price: 60,  img: 'assets/perfume-image/sweetscandalous.jpeg' },
    'coco-chanel':     { name: 'COCO Chanel',                   price: 85,  img: 'assets/perfume-image/chanel.webp' },
    'la-vie':          { name: 'Lancôme La Vie Est Belle',      price: 80,  img: 'assets/perfume-image/la vie est belle.jpg' },
    'strawberry':      { name: 'The Body Shop Strawberry',      price: 45,  img: 'assets/perfume-image/strawberry.webp' },
    'white-musk':      { name: 'The Body Shop White Musk',      price: 50,  img: 'assets/perfume-image/white musk.webp' },
    'apple-blossom':   { name: 'The Body Shop Apple Blossom',   price: 45,  img: 'assets/perfume-image/appleblossom.jpeg' },
    'burberry-hero':   { name: 'Burberry Hero',                 price: 90,  img: 'assets/perfume-image/burberryhero.png' },
    'tom-ford':        { name: 'Tom Ford Ombre Leather',        price: 110, img: 'assets/perfume-image/tomfordleather.webp' },
    'cherry-blossom':  { name: 'The Body Shop Cherry Blossom',  price: 45,  img: 'assets/perfume-image/japaneseblossom.webp' },
    'honeydew':        { name: 'Honeydew Perfume',              price: 40,  img: 'assets/perfume-image/honeydew.jpeg' },
    'aqua-kiss':       { name: "Victoria's Secret Aqua Kiss",   price: 60,  img: 'assets/perfume-image/aquakiss.jpeg' },
    'velvet-petals':   { name: 'Victoria Secret Velvet Petals', price: 65,  img: 'assets/perfume-image/velvetpetals.jpg' },
    'jasmine-dream':   { name: 'Victoria Secret Jasmine Dream', price: 60,  img: 'assets/perfume-image/jasminedream.webp' }
  };

  var items = JSON.parse(localStorage.getItem('pe_cart') || '[]');
  var isSubdir = window.location.pathname.includes('/perfume-pages/');

  function resolveImg(path) {
    return isSubdir ? '../' + path : path;
  }

  function save() {
    localStorage.setItem('pe_cart', JSON.stringify(items));
  }

  function getCount() {
    return items.reduce(function (s, i) { return s + i.qty; }, 0);
  }

  function getTotal() {
    return items.reduce(function (s, i) { return s + i.price * i.qty; }, 0);
  }

  function updateBadge() {
    var badge = document.getElementById('cartBadge');
    if (!badge) return;
    var count = getCount();
    badge.textContent = count;
    badge.style.display = count > 0 ? 'flex' : 'none';
  }

  function showToast(name) {
    var t = document.createElement('div');
    t.className = 'cart-toast';
    t.textContent = '✓ ' + name + ' added to cart';
    document.body.appendChild(t);
    requestAnimationFrame(function () {
      requestAnimationFrame(function () { t.classList.add('show'); });
    });
    setTimeout(function () {
      t.classList.remove('show');
      setTimeout(function () { t.remove(); }, 400);
    }, 2400);
  }

  function renderDrawer() {
    var body = document.getElementById('cartDrawerBody');
    var footer = document.getElementById('cartDrawerFooter');
    if (!body) return;

    if (items.length === 0) {
      body.innerHTML = '<p class="cart-empty">Your cart is empty.</p>';
      if (footer) footer.innerHTML = '';
      return;
    }

    body.innerHTML = items.map(function (item) {
      return '<div class="cart-item">' +
        '<img src="' + resolveImg(item.img) + '" alt="' + item.name + '" onerror="this.style.display=\'none\'">' +
        '<div class="cart-item-info">' +
          '<p class="cart-item-name">' + item.name + '</p>' +
          '<p class="cart-item-price">RM ' + item.price + '</p>' +
          '<div class="cart-item-qty">' +
            '<button onclick="Cart.setQty(\'' + item.id + '\',' + (item.qty - 1) + ')">&#8722;</button>' +
            '<span>' + item.qty + '</span>' +
            '<button onclick="Cart.setQty(\'' + item.id + '\',' + (item.qty + 1) + ')">+</button>' +
          '</div>' +
        '</div>' +
        '<button class="cart-item-remove" onclick="Cart.remove(\'' + item.id + '\')" aria-label="Remove">&#x2715;</button>' +
      '</div>';
    }).join('');

    if (footer) {
      var checkoutPath = isSubdir ? '../checkout.html' : 'checkout.html';
      footer.innerHTML =
        '<div class="cart-total">Total: <strong>RM ' + getTotal() + '</strong></div>' +
        '<a href="' + checkoutPath + '" class="cart-checkout-btn">Proceed to Checkout</a>';
    }
  }

  function openDrawer() {
    var drawer = document.getElementById('cartDrawer');
    var overlay = document.getElementById('cartOverlay');
    if (drawer) drawer.classList.add('open');
    if (overlay) overlay.classList.add('show');
  }

  function closeDrawer() {
    var drawer = document.getElementById('cartDrawer');
    var overlay = document.getElementById('cartOverlay');
    if (drawer) drawer.classList.remove('open');
    if (overlay) overlay.classList.remove('show');
  }

  function add(id) {
    var product = CATALOG[id];
    if (!product) return;
    var existing = items.find(function (i) { return i.id === id; });
    if (existing) {
      existing.qty += 1;
    } else {
      items.push({ id: id, name: product.name, price: product.price, img: product.img, qty: 1 });
    }
    save();
    updateBadge();
    renderDrawer();
    openDrawer();
    showToast(product.name);
  }

  function remove(id) {
    items = items.filter(function (i) { return i.id !== id; });
    save();
    updateBadge();
    renderDrawer();
  }

  function setQty(id, qty) {
    qty = parseInt(qty, 10);
    if (isNaN(qty) || qty < 1) { remove(id); return; }
    var item = items.find(function (i) { return i.id === id; });
    if (item) item.qty = qty;
    save();
    updateBadge();
    renderDrawer();
  }

  function injectCartIcon() {
    var navCollapse = document.getElementById('navbarBasic');
    if (!navCollapse || document.getElementById('cartIconBtn')) return;

    var btn = document.createElement('button');
    btn.className = 'cart-icon-btn';
    btn.id = 'cartIconBtn';
    btn.setAttribute('aria-label', 'Open cart');
    btn.innerHTML =
      '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">' +
        '<path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/>' +
        '<line x1="3" y1="6" x2="21" y2="6"/>' +
        '<path d="M16 10a4 4 0 01-8 0"/>' +
      '</svg>' +
      '<span class="cart-badge" id="cartBadge" style="display:none">0</span>';
    btn.addEventListener('click', openDrawer);
    navCollapse.appendChild(btn);
  }

  function injectDrawer() {
    if (document.getElementById('cartDrawer')) return;

    var overlay = document.createElement('div');
    overlay.id = 'cartOverlay';
    overlay.className = 'cart-overlay';
    overlay.addEventListener('click', closeDrawer);

    var drawer = document.createElement('div');
    drawer.id = 'cartDrawer';
    drawer.className = 'cart-drawer';
    drawer.innerHTML =
      '<div class="cart-drawer-header">' +
        '<h3>Your Cart</h3>' +
        '<button class="cart-close-btn" id="cartCloseBtn" aria-label="Close">&#x2715;</button>' +
      '</div>' +
      '<div class="cart-drawer-body" id="cartDrawerBody"></div>' +
      '<div class="cart-drawer-footer" id="cartDrawerFooter"></div>';

    document.body.appendChild(overlay);
    document.body.appendChild(drawer);
    document.getElementById('cartCloseBtn').addEventListener('click', closeDrawer);
  }

  function setupProductPage() {
    var productId = document.body.dataset.productId;
    if (!productId || !CATALOG[productId]) return;

    var product = CATALOG[productId];

    var nameEl = document.querySelector('.perfume-info-name');
    if (nameEl && !document.querySelector('.product-page-price')) {
      var priceEl = document.createElement('p');
      priceEl.className = 'product-page-price';
      priceEl.textContent = 'RM ' + product.price;
      nameEl.after(priceEl);
    }

    if (!document.querySelector('.product-page-add')) {
      var addBtn = document.createElement('button');
      addBtn.className = 'add-to-cart-btn product-page-add';
      addBtn.textContent = 'Add to Cart';
      addBtn.addEventListener('click', function () { add(productId); });

      var perfumeInfo = document.querySelector('.perfume-info');
      if (perfumeInfo) {
        perfumeInfo.appendChild(addBtn);
      } else {
        var infoPanel = document.querySelector('.perfume-page-info:last-child');
        if (infoPanel) infoPanel.appendChild(addBtn);
      }
    }
  }

  function init() {
    injectCartIcon();
    injectDrawer();
    updateBadge();
    renderDrawer();
    setupProductPage();
  }

  document.addEventListener('DOMContentLoaded', init);

  return { add: add, remove: remove, setQty: setQty, openDrawer: openDrawer, closeDrawer: closeDrawer };
})();
