/* ==========================================================================
   SPORTIVA — Aplicação principal (UI, navegação, filtros, checkout)
   ========================================================================== */

/* ---------------------------------------------------------------------- */
/* Utilitários gerais                                                     */
/* ---------------------------------------------------------------------- */

function qs(sel, ctx = document) { return ctx.querySelector(sel); }
function qsa(sel, ctx = document) { return [...ctx.querySelectorAll(sel)]; }

function showToast(message, type = "success") {
  let wrap = qs(".toast-wrap");
  if (!wrap) {
    wrap = document.createElement("div");
    wrap.className = "toast-wrap";
    document.body.appendChild(wrap);
  }
  const toast = document.createElement("div");
  toast.className = `toast ${type}`;
  toast.innerHTML = `<span class="toast-icon">${type === "success" ? "✅" : "⚠️"}</span><span>${message}</span>`;
  wrap.appendChild(toast);
  setTimeout(() => {
    toast.classList.add("leaving");
    setTimeout(() => toast.remove(), 250);
  }, 2800);
}

function highlightActiveNav() {
  const page = location.pathname.split("/").pop() || "index.html";
  qsa(".nav-links a, .mobile-menu a").forEach((a) => {
    const href = a.getAttribute("href");
    if (href === page || (page === "" && href === "index.html")) a.classList.add("active");
  });
}

/* ---------------------------------------------------------------------- */
/* Navbar: scroll state, pesquisa, menu mobile                            */
/* ---------------------------------------------------------------------- */

function initNavbar() {
  const navbar = qs(".navbar");
  window.addEventListener("scroll", () => {
    if (!navbar) return;
    navbar.classList.toggle("scrolled", window.scrollY > 10);
  });

  const searchToggle = qs("[data-search-toggle]");
  const searchFlyout = qs(".search-flyout");
  if (searchToggle && searchFlyout) {
    searchToggle.addEventListener("click", () => {
      searchFlyout.classList.toggle("open");
      if (searchFlyout.classList.contains("open")) qs("input", searchFlyout).focus();
    });
    const flyoutInput = qs("input", searchFlyout);
    flyoutInput.addEventListener("keydown", (e) => {
      if (e.key === "Enter" && flyoutInput.value.trim()) {
        location.href = `products.html?search=${encodeURIComponent(flyoutInput.value.trim())}`;
      }
    });
  }

  const hamburger = qs("[data-hamburger]");
  const mobileMenu = qs(".mobile-menu");
  if (hamburger && mobileMenu) {
    hamburger.addEventListener("click", () => {
      mobileMenu.classList.toggle("open");
      hamburger.innerHTML = mobileMenu.classList.contains("open") ? iconClose() : iconMenu();
    });
    qsa("a", mobileMenu).forEach((a) => a.addEventListener("click", () => {
      mobileMenu.classList.remove("open");
      hamburger.innerHTML = iconMenu();
    }));
  }

  const favToggle = qs("[data-user-toggle]");
  if (favToggle) favToggle.addEventListener("click", () => showToast("Área de utilizador em modo de demonstração."));
}

function iconMenu() { return `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></svg>`; }
function iconClose() { return `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>`; }

/* ---------------------------------------------------------------------- */
/* Cartão de produto (usado na home, catálogo, relacionados)              */
/* ---------------------------------------------------------------------- */

function productCardHTML(p) {
  const isFav = Favorites.has(p.id);
  const badge = p.badge ? `<span class="badge ${badgeClass(p.badge)}">${badgeLabel(p.badge)}</span>` : "";
  const oldPrice = p.oldPrice ? `<span class="price-old">${formatKz(p.oldPrice)}</span>` : "";
  const lowStock = p.stock > 0 && p.stock <= 10 ? `<span class="stock-low">Últimas ${p.stock} unidades</span>` : "";
  return `
  <article class="product-card" data-id="${p.id}">
    <div class="product-thumb">
      ${badge}
      <button class="fav-btn ${isFav ? "active" : ""}" data-fav="${p.id}" aria-label="Adicionar aos favoritos" aria-pressed="${isFav}">
        <svg viewBox="0 0 24 24" fill="${isFav ? "currentColor" : "none"}" stroke="currentColor" stroke-width="2"><path d="M12 21s-7.5-4.6-10-9.2C.5 8.1 2.4 4 6.4 4 8.8 4 10.7 5.3 12 7c1.3-1.7 3.2-3 5.6-3 4 0 5.9 4.1 4.4 7.8C19.5 16.4 12 21 12 21z"/></svg>
      </button>
      <a href="product.html?id=${p.id}"><img src="${p.images[0]}" alt="${p.name}" loading="lazy"></a>
    </div>
    <div class="product-info">
      <span class="product-cat">${CATEGORY_META[p.category]?.label || p.category}</span>
      <h3 class="product-name"><a href="product.html?id=${p.id}">${p.name}</a></h3>
      <div class="stars"><span class="star-icons">${renderStars(p.rating)}</span> ${p.rating.toFixed(1)} (${p.reviews})</div>
      <div class="price-row"><span class="price">${formatKz(p.price)}</span>${oldPrice}</div>
      ${lowStock}
      <button class="add-cart-btn" data-add="${p.id}">
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.7 13.4a2 2 0 0 0 2 1.6h9.7a2 2 0 0 0 2-1.6L23 6H6"/></svg>
        Adicionar
      </button>
    </div>
  </article>`;
}

function bindProductCardEvents(container) {
  qsa("[data-add]", container).forEach((btn) => {
    btn.addEventListener("click", (e) => {
      e.preventDefault();
      const product = getProductById(btn.dataset.add);
      if (!product) return;
      Cart.add(product, 1, null);
      btn.classList.add("added");
      btn.innerHTML = "✓ Adicionado";
      showToast(`${product.name} adicionado ao carrinho.`);
      setTimeout(() => {
        btn.classList.remove("added");
        btn.innerHTML = `<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.7 13.4a2 2 0 0 0 2 1.6h9.7a2 2 0 0 0 2-1.6L23 6H6"/></svg> Adicionar`;
      }, 1600);
    });
  });
  qsa("[data-fav]", container).forEach((btn) => {
    btn.addEventListener("click", (e) => {
      e.preventDefault();
      const active = Favorites.toggle(Number(btn.dataset.fav));
      btn.classList.toggle("active", active);
      btn.setAttribute("aria-pressed", active);
      btn.querySelector("svg").setAttribute("fill", active ? "currentColor" : "none");
      showToast(active ? "Adicionado aos favoritos." : "Removido dos favoritos.");
    });
  });
}

/* ---------------------------------------------------------------------- */
/* HOME                                                                    */
/* ---------------------------------------------------------------------- */

function initHomePage() {
  const featuredEl = qs("#featured-products");
  const bestsellersEl = qs("#bestseller-products");
  if (featuredEl) {
    const featured = [...PRODUCTS].sort((a, b) => b.popularity - a.popularity).slice(0, 8);
    featuredEl.innerHTML = featured.map(productCardHTML).join("");
    bindProductCardEvents(featuredEl);
  }
  if (bestsellersEl) {
    const bestsellers = PRODUCTS.filter((p) => p.badge === "mais vendido").slice(0, 4);
    bestsellersEl.innerHTML = bestsellers.map(productCardHTML).join("");
    bindProductCardEvents(bestsellersEl);
  }

  const newsletterForm = qs("#newsletter-form");
  if (newsletterForm) {
    newsletterForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const input = qs("input", newsletterForm);
      const msg = qs(".form-msg", newsletterForm.parentElement);
      const isValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input.value.trim());
      if (!isValid) {
        msg.textContent = "Insere um e-mail válido para continuar.";
        msg.className = "form-msg error";
        return;
      }
      msg.textContent = "Subscrição confirmada! Obrigado por te juntares à Sportiva.";
      msg.className = "form-msg success";
      input.value = "";
    });
  }
}

/* ---------------------------------------------------------------------- */
/* CATÁLOGO — filtros, pesquisa, ordenação                                */
/* ---------------------------------------------------------------------- */

const CatalogState = {
  search: "",
  categories: [],
  maxPrice: 90000,
  sort: "relevance",
};

function readCatalogStateFromURL() {
  const params = new URLSearchParams(location.search);
  if (params.get("search")) CatalogState.search = params.get("search");
  if (params.get("category")) CatalogState.categories = [params.get("category")];
}

function applyCatalogFilters() {
  let list = [...PRODUCTS];

  if (CatalogState.search.trim()) {
    const q = CatalogState.search.trim().toLowerCase();
    list = list.filter((p) => p.name.toLowerCase().includes(q) || (CATEGORY_META[p.category]?.label || "").toLowerCase().includes(q));
  }
  if (CatalogState.categories.length) {
    list = list.filter((p) => CatalogState.categories.includes(p.category));
  }
  list = list.filter((p) => p.price <= CatalogState.maxPrice);

  switch (CatalogState.sort) {
    case "price-asc": list.sort((a, b) => a.price - b.price); break;
    case "price-desc": list.sort((a, b) => b.price - a.price); break;
    case "popularity": list.sort((a, b) => b.popularity - a.popularity); break;
    default: break;
  }
  return list;
}

function renderCatalogChips() {
  const wrap = qs("#active-chips");
  if (!wrap) return;
  const chips = [];
  if (CatalogState.search.trim()) chips.push({ label: `“${CatalogState.search}”`, key: "search" });
  CatalogState.categories.forEach((c) => chips.push({ label: CATEGORY_META[c]?.label || c, key: `cat:${c}` }));
  if (CatalogState.maxPrice < 90000) chips.push({ label: `Até ${formatKz(CatalogState.maxPrice)}`, key: "price" });

  wrap.innerHTML = chips.map((c) => `<span class="chip">${c.label}<button data-chip="${c.key}" aria-label="Remover filtro">✕</button></span>`).join("");
  qsa("[data-chip]", wrap).forEach((btn) => {
    btn.addEventListener("click", () => {
      const key = btn.dataset.chip;
      if (key === "search") { CatalogState.search = ""; qs("#toolbar-search-input").value = ""; }
      else if (key === "price") { CatalogState.maxPrice = 90000; qs("#price-range").value = 90000; qs("#price-range-value").textContent = formatKz(90000); }
      else if (key.startsWith("cat:")) {
        const cat = key.slice(4);
        CatalogState.categories = CatalogState.categories.filter((c) => c !== cat);
        const cb = qs(`.filter-option input[value="${cat}"]`);
        if (cb) cb.checked = false;
      }
      renderCatalog();
    });
  });
}

function renderCatalog() {
  const grid = qs("#product-grid");
  const countEl = qs("#results-count");
  const emptyState = qs("#empty-state");
  if (!grid) return;

  const list = applyCatalogFilters();
  renderCatalogChips();

  if (countEl) countEl.textContent = `${list.length} produto${list.length !== 1 ? "s" : ""} encontrado${list.length !== 1 ? "s" : ""}`;

  if (list.length === 0) {
    grid.innerHTML = "";
    if (emptyState) emptyState.style.display = "block";
    return;
  }
  if (emptyState) emptyState.style.display = "none";
  grid.innerHTML = list.map(productCardHTML).join("");
  bindProductCardEvents(grid);
}

function initProductsPage() {
  const grid = qs("#product-grid");
  if (!grid) return;

  readCatalogStateFromURL();

  const searchInput = qs("#toolbar-search-input");
  if (searchInput) {
    searchInput.value = CatalogState.search;
    searchInput.addEventListener("input", () => {
      CatalogState.search = searchInput.value;
      renderCatalog();
    });
  }

  qsa(".filter-option input[type=checkbox]").forEach((cb) => {
    if (CatalogState.categories.includes(cb.value)) cb.checked = true;
    cb.addEventListener("change", () => {
      CatalogState.categories = qsa(".filter-option input:checked").map((c) => c.value);
      renderCatalog();
    });
  });

  const priceRange = qs("#price-range");
  const priceRangeValue = qs("#price-range-value");
  if (priceRange) {
    priceRange.addEventListener("input", () => {
      CatalogState.maxPrice = Number(priceRange.value);
      priceRangeValue.textContent = formatKz(CatalogState.maxPrice);
      renderCatalog();
    });
  }

  const sortSelect = qs("#sort-select");
  if (sortSelect) {
    sortSelect.addEventListener("change", () => {
      CatalogState.sort = sortSelect.value;
      renderCatalog();
    });
  }

  const clearBtn = qs("#clear-filters");
  if (clearBtn) {
    clearBtn.addEventListener("click", () => {
      CatalogState.search = ""; CatalogState.categories = []; CatalogState.maxPrice = 90000; CatalogState.sort = "relevance";
      if (searchInput) searchInput.value = "";
      qsa(".filter-option input").forEach((cb) => (cb.checked = false));
      if (priceRange) { priceRange.value = 90000; priceRangeValue.textContent = formatKz(90000); }
      if (sortSelect) sortSelect.value = "relevance";
      renderCatalog();
    });
  }

  renderCatalog();
}

/* ---------------------------------------------------------------------- */
/* PÁGINA DE PRODUTO                                                       */
/* ---------------------------------------------------------------------- */

function initProductPage() {
  const wrap = qs("#product-detail-wrap");
  if (!wrap) return;

  const params = new URLSearchParams(location.search);
  const product = getProductById(params.get("id"));
  if (!product) {
    wrap.innerHTML = `<div class="empty-state"><div class="empty-emoji">🔍</div><h3>Produto não encontrado</h3><p>O produto que procuras pode ter sido removido.</p><a class="btn btn-primary" href="products.html" style="margin-top:18px;display:inline-flex;">Ver produtos</a></div>`;
    return;
  }

  document.title = `${product.name} — Sportiva`;
  qs("#breadcrumb-current").textContent = product.name;
  qs("#breadcrumb-cat").textContent = CATEGORY_META[product.category]?.label || product.category;
  qs("#breadcrumb-cat").href = `products.html?category=${product.category}`;

  let selectedSize = product.sizes ? product.sizes[0] : null;
  let qty = 1;

  function renderGallery() {
    qs("#pd-main-img").src = product.images[0];
    qs("#pd-main-img").alt = product.name;
    qs("#pd-thumbs").innerHTML = product.images.map((img, i) =>
      `<button class="pd-thumb ${i === 0 ? "active" : ""}" data-thumb="${i}"><img src="${img}" alt="Miniatura ${i + 1}"></button>`
    ).join("");
    qsa("#pd-thumbs .pd-thumb").forEach((btn) => {
      btn.addEventListener("click", () => {
        qsa("#pd-thumbs .pd-thumb").forEach((b) => b.classList.remove("active"));
        btn.classList.add("active");
        qs("#pd-main-img").src = product.images[Number(btn.dataset.thumb)];
      });
    });
  }

  wrap.innerHTML = `
    <div class="pd-gallery">
      <div class="pd-gallery-main"><img id="pd-main-img" alt=""></div>
      <div class="pd-thumbs" id="pd-thumbs"></div>
    </div>
    <div class="pd-info">
      <span class="product-cat">${CATEGORY_META[product.category]?.label || product.category}</span>
      <h1>${product.name}</h1>
      <div class="stars"><span class="star-icons">${renderStars(product.rating)}</span> ${product.rating.toFixed(1)} · ${product.reviews} avaliações</div>
      <div class="pd-price-row">
        <span class="price">${formatKz(product.price)}</span>
        ${product.oldPrice ? `<span class="price-old">${formatKz(product.oldPrice)}</span>` : ""}
      </div>
      <div class="pd-availability ${product.stock === 0 ? "out" : ""}">
        <span class="dot"></span> ${product.stock === 0 ? "Esgotado" : `Em stock (${product.stock} disponíveis)`}
      </div>
      <p class="pd-desc">${product.description}</p>
      ${product.sizes ? `
      <div class="pd-option-group">
        <h4>Tamanho</h4>
        <div class="size-options" id="size-options">
          ${product.sizes.map((s, i) => `<button class="size-opt ${i === 0 ? "selected" : ""}" data-size="${s}">${s}</button>`).join("")}
        </div>
      </div>` : ""}
      <div class="pd-option-group">
        <h4>Quantidade</h4>
        <div class="qty-selector">
          <button id="qty-minus" aria-label="Diminuir quantidade">−</button>
          <span id="qty-value">1</span>
          <button id="qty-plus" aria-label="Aumentar quantidade">+</button>
        </div>
      </div>
      <div class="pd-actions">
        <button class="btn btn-outline" id="pd-add-cart" ${product.stock === 0 ? "disabled" : ""}>Adicionar ao carrinho</button>
        <button class="btn btn-primary" id="pd-buy-now" ${product.stock === 0 ? "disabled" : ""}>Comprar agora</button>
      </div>
      <ul class="pd-meta-list">
        <li><b>Categoria:</b> ${CATEGORY_META[product.category]?.label || product.category}</li>
        <li><b>Disponibilidade:</b> ${product.stock === 0 ? "Esgotado" : "Pronta entrega"}</li>
        <li><b>Entrega:</b> 2 a 5 dias úteis em Luanda</li>
      </ul>
    </div>`;

  renderGallery();

  qsa("#size-options .size-opt").forEach((btn) => {
    btn.addEventListener("click", () => {
      qsa("#size-options .size-opt").forEach((b) => b.classList.remove("selected"));
      btn.classList.add("selected");
      selectedSize = btn.dataset.size;
    });
  });

  qs("#qty-minus").addEventListener("click", () => {
    qty = Math.max(1, qty - 1);
    qs("#qty-value").textContent = qty;
  });
  qs("#qty-plus").addEventListener("click", () => {
    qty = Math.min(product.stock || 99, qty + 1);
    qs("#qty-value").textContent = qty;
  });

  qs("#pd-add-cart").addEventListener("click", () => {
    Cart.add(product, qty, selectedSize);
    showToast(`${product.name} adicionado ao carrinho.`);
  });
  qs("#pd-buy-now").addEventListener("click", () => {
    Cart.add(product, qty, selectedSize);
    location.href = "cart.html";
  });

  const relatedEl = qs("#related-products");
  if (relatedEl) {
    const related = getRelatedProducts(product);
    relatedEl.innerHTML = related.map(productCardHTML).join("");
    bindProductCardEvents(relatedEl);
    qs("#related-section").style.display = related.length ? "block" : "none";
  }
}

/* ---------------------------------------------------------------------- */
/* CARRINHO                                                                */
/* ---------------------------------------------------------------------- */

function cartItemHTML(item) {
  return `
  <div class="cart-item" data-key="${item.id}::${item.size || "unico"}">
    <img src="${item.image}" alt="${item.name}">
    <div>
      <div class="cart-item-name">${item.name}</div>
      <div class="cart-item-cat">${item.category}</div>
      ${item.size ? `<div class="cart-item-size">Tamanho: ${item.size}</div>` : ""}
      <div class="cart-item-price">${formatKz(item.price)}</div>
    </div>
    <div class="qty-selector">
      <button data-qty-minus aria-label="Diminuir quantidade">−</button>
      <span>${item.qty}</span>
      <button data-qty-plus aria-label="Aumentar quantidade">+</button>
    </div>
    <div class="cart-item-actions">
      <div style="font-weight:800;">${formatKz(item.price * item.qty)}</div>
      <button class="cart-item-remove" data-remove>Remover</button>
    </div>
  </div>`;
}

function renderCartPage() {
  const container = qs("#cart-items");
  const emptyEl = qs("#cart-empty");
  const summaryEl = qs("#cart-summary");
  if (!container) return;

  const items = Cart.read();
  if (items.length === 0) {
    container.style.display = "none";
    if (summaryEl) summaryEl.style.display = "none";
    if (emptyEl) emptyEl.style.display = "block";
    return;
  }
  container.style.display = "flex";
  if (summaryEl) summaryEl.style.display = "block";
  if (emptyEl) emptyEl.style.display = "none";

  container.innerHTML = items.map(cartItemHTML).join("");

  qsa(".cart-item", container).forEach((el) => {
    const [id, sizeRaw] = el.dataset.key.split("::");
    const size = sizeRaw === "unico" ? null : sizeRaw;
    qs("[data-qty-plus]", el).addEventListener("click", () => {
      const item = Cart.read().find((i) => Cart.cartKey(i.id, i.size) === el.dataset.key);
      Cart.setQty(id, size, (item?.qty || 1) + 1);
      renderCartPage();
    });
    qs("[data-qty-minus]", el).addEventListener("click", () => {
      const item = Cart.read().find((i) => Cart.cartKey(i.id, i.size) === el.dataset.key);
      if ((item?.qty || 1) <= 1) return;
      Cart.setQty(id, size, item.qty - 1);
      renderCartPage();
    });
    qs("[data-remove]", el).addEventListener("click", () => {
      openConfirmModal("Remover produto?", "Este produto será removido do teu carrinho.", () => {
        Cart.remove(id, size);
        renderCartPage();
        showToast("Produto removido do carrinho.");
      });
    });
  });

  updateCartSummary();
}

function updateCartSummary() {
  const subtotalEl = qs("#summary-subtotal");
  const shippingEl = qs("#summary-shipping");
  const totalEl = qs("#summary-total");
  if (!subtotalEl) return;
  const sub = Cart.subtotal();
  const ship = Cart.shipping();
  subtotalEl.textContent = formatKz(sub);
  shippingEl.textContent = ship === 0 ? "Grátis" : formatKz(ship);
  totalEl.textContent = formatKz(sub + ship);
}

function initCartPage() {
  if (!qs("#cart-items")) return;
  renderCartPage();
  const clearLink = qs("#clear-cart-link");
  if (clearLink) {
    clearLink.addEventListener("click", (e) => {
      e.preventDefault();
      if (Cart.read().length === 0) return;
      openConfirmModal("Limpar carrinho?", "Todos os produtos serão removidos do carrinho.", () => {
        Cart.clear();
        renderCartPage();
        showToast("Carrinho esvaziado.");
      });
    });
  }
}

/* ---------------------------------------------------------------------- */
/* MODAL DE CONFIRMAÇÃO                                                    */
/* ---------------------------------------------------------------------- */

function openConfirmModal(title, message, onConfirm) {
  let overlay = qs("#confirm-modal");
  if (!overlay) {
    overlay = document.createElement("div");
    overlay.id = "confirm-modal";
    overlay.className = "modal-overlay";
    overlay.innerHTML = `
      <div class="modal-box">
        <h3 id="confirm-title"></h3>
        <p id="confirm-message"></p>
        <div class="modal-actions">
          <button class="btn btn-outline" id="confirm-cancel">Cancelar</button>
          <button class="btn btn-primary" id="confirm-ok" style="background:var(--danger);box-shadow:none;">Remover</button>
        </div>
      </div>`;
    document.body.appendChild(overlay);
    overlay.addEventListener("click", (e) => { if (e.target === overlay) overlay.classList.remove("open"); });
  }
  qs("#confirm-title", overlay).textContent = title;
  qs("#confirm-message", overlay).textContent = message;
  overlay.classList.add("open");

  const okBtn = qs("#confirm-ok", overlay);
  const cancelBtn = qs("#confirm-cancel", overlay);
  const newOk = okBtn.cloneNode(true);
  okBtn.parentNode.replaceChild(newOk, okBtn);
  newOk.addEventListener("click", () => { overlay.classList.remove("open"); onConfirm(); });
  cancelBtn.onclick = () => overlay.classList.remove("open");
}

/* ---------------------------------------------------------------------- */
/* CHECKOUT — carrinho → dados → pagamento → confirmação                  */
/* ---------------------------------------------------------------------- */

const CheckoutState = { step: 1, customer: {}, payment: null };

function initCheckoutPage() {
  const stepper = qs("#checkout-stepper");
  if (!stepper) return;

  if (Cart.read().length === 0) {
    location.href = "cart.html";
    return;
  }

  renderCheckoutReview();
  goToStep(1);

  qs("#to-step-2").addEventListener("click", () => goToStep(2));
  qs("#back-to-1").addEventListener("click", () => goToStep(1));

  qs("#customer-form").addEventListener("submit", (e) => {
    e.preventDefault();
    if (validateCustomerForm()) goToStep(3);
  });
  qs("#back-to-2").addEventListener("click", () => goToStep(2));

  qsa(".payment-opt").forEach((opt) => {
    opt.addEventListener("click", () => {
      qsa(".payment-opt").forEach((o) => o.classList.remove("selected"));
      opt.classList.add("selected");
      qs("input", opt).checked = true;
      CheckoutState.payment = opt.dataset.payment;
      qs("#to-confirm").disabled = false;
    });
  });
  qs("#back-to-3").addEventListener("click", () => goToStep(3));

  qs("#to-confirm").addEventListener("click", () => {
    if (!CheckoutState.payment) return;
    completeOrder();
  });
}

function goToStep(step) {
  CheckoutState.step = step;
  qsa(".checkout-step").forEach((el) => (el.style.display = "none"));
  qs(`#checkout-step-${step}`).style.display = "block";

  qsa(".progress-step").forEach((el, i) => {
    const n = i + 1;
    el.classList.toggle("done", n < step);
    el.classList.toggle("active", n === step);
  });

  if (step === 4) renderReviewSummary();
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function renderCheckoutReview() {
  const items = Cart.read();
  const list = qs("#checkout-cart-summary");
  if (list) {
    list.innerHTML = items.map((i) => `
      <div class="review-item"><span>${i.name} ${i.size ? `(${i.size})` : ""} × ${i.qty}</span><span>${formatKz(i.price * i.qty)}</span></div>
    `).join("");
  }
  updateCheckoutTotals();
}

function updateCheckoutTotals() {
  const sub = Cart.subtotal();
  const ship = Cart.shipping();
  qsa(".co-subtotal").forEach((el) => (el.textContent = formatKz(sub)));
  qsa(".co-shipping").forEach((el) => (el.textContent = ship === 0 ? "Grátis" : formatKz(ship)));
  qsa(".co-total").forEach((el) => (el.textContent = formatKz(sub + ship)));
}

function validateCustomerForm() {
  const fields = [
    { id: "cf-name", test: (v) => v.trim().length >= 3, msg: "Indica o teu nome completo." },
    { id: "cf-phone", test: (v) => /^[+\d][\d\s]{7,}$/.test(v.trim()), msg: "Indica um número de telefone válido." },
    { id: "cf-email", test: (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim()), msg: "Indica um e-mail válido." },
    { id: "cf-province", test: (v) => v.trim().length > 0, msg: "Seleciona a tua província." },
    { id: "cf-municipality", test: (v) => v.trim().length >= 2, msg: "Indica o teu município." },
    { id: "cf-address", test: (v) => v.trim().length >= 5, msg: "Indica o endereço de entrega completo." },
  ];
  let valid = true;
  fields.forEach(({ id, test, msg }) => {
    const input = qs(`#${id}`);
    const errorEl = qs(`#${id}-error`);
    if (!test(input.value)) {
      input.classList.add("invalid");
      if (errorEl) { errorEl.textContent = msg; errorEl.classList.add("show"); }
      valid = false;
    } else {
      input.classList.remove("invalid");
      if (errorEl) errorEl.classList.remove("show");
    }
  });
  if (valid) {
    CheckoutState.customer = {
      name: qs("#cf-name").value.trim(),
      phone: qs("#cf-phone").value.trim(),
      email: qs("#cf-email").value.trim(),
      province: qs("#cf-province").value,
      municipality: qs("#cf-municipality").value.trim(),
      address: qs("#cf-address").value.trim(),
    };
  }
  return valid;
}

function renderReviewSummary() {
  const wrap = qs("#review-summary");
  if (!wrap) return;
  const c = CheckoutState.customer;
  const paymentLabels = { multicaixa: "Multicaixa Express", transferencia: "Transferência bancária", entrega: "Pagamento na entrega" };
  wrap.innerHTML = `
    <div class="review-item"><span>Nome</span><span>${c.name}</span></div>
    <div class="review-item"><span>Telefone</span><span>${c.phone}</span></div>
    <div class="review-item"><span>E-mail</span><span>${c.email}</span></div>
    <div class="review-item"><span>Entrega</span><span>${c.address}, ${c.municipality}, ${c.province}</span></div>
    <div class="review-item"><span>Pagamento</span><span>${paymentLabels[CheckoutState.payment] || ""}</span></div>
  `;
}

function completeOrder() {
  const orderId = "SPT-" + Date.now().toString().slice(-8);
  const order = {
    id: orderId,
    items: Cart.read(),
    subtotal: Cart.subtotal(),
    shipping: Cart.shipping(),
    total: Cart.total(),
    customer: CheckoutState.customer,
    payment: CheckoutState.payment,
    date: new Date().toISOString(),
  };
  sessionStorage.setItem("sportiva_last_order", JSON.stringify(order));
  Cart.clear();
  location.href = "success.html";
}

/* ---------------------------------------------------------------------- */
/* PÁGINA DE SUCESSO                                                       */
/* ---------------------------------------------------------------------- */

function initSuccessPage() {
  const wrap = qs("#order-summary");
  if (!wrap) return;
  const raw = sessionStorage.getItem("sportiva_last_order");
  if (!raw) {
    wrap.innerHTML = `<p>Não encontrámos detalhes de nenhuma encomenda recente.</p>`;
    return;
  }
  const order = JSON.parse(raw);
  const paymentLabels = { multicaixa: "Multicaixa Express", transferencia: "Transferência bancária", entrega: "Pagamento na entrega" };
  const date = new Date(order.date);
  const dateStr = date.toLocaleDateString("pt-PT", { day: "2-digit", month: "long", year: "numeric" });

  wrap.innerHTML = `
    <div class="order-id">Número do pedido: <b>${order.id}</b> · ${dateStr}</div>
    ${order.items.map((i) => `<div class="order-line"><span>${i.name} ${i.size ? `(${i.size})` : ""} × ${i.qty}</span><span>${formatKz(i.price * i.qty)}</span></div>`).join("")}
    <div class="order-divider"></div>
    <div class="order-line"><span>Subtotal</span><span>${formatKz(order.subtotal)}</span></div>
    <div class="order-line"><span>Entrega</span><span>${order.shipping === 0 ? "Grátis" : formatKz(order.shipping)}</span></div>
    <div class="order-line" style="font-size:16px;"><span>Total</span><span>${formatKz(order.total)}</span></div>
    <div class="order-divider"></div>
    <div class="order-line"><span>Método de pagamento</span><span>${paymentLabels[order.payment] || ""}</span></div>
    <div class="order-line"><span>Entregar a</span><span>${order.customer.name}</span></div>
    <div class="order-line"><span>Endereço</span><span>${order.customer.address}, ${order.customer.municipality}, ${order.customer.province}</span></div>
  `;
}

/* ---------------------------------------------------------------------- */
/* Categorias na home                                                      */
/* ---------------------------------------------------------------------- */

function bindCategoryLinks() {
  qsa("[data-category-link]").forEach((el) => {
    el.addEventListener("click", () => {
      location.href = `products.html?category=${el.dataset.categoryLink}`;
    });
  });
}

/* ---------------------------------------------------------------------- */
/* Init geral                                                              */
/* ---------------------------------------------------------------------- */

document.addEventListener("DOMContentLoaded", () => {
  initNavbar();
  highlightActiveNav();
  bindCategoryLinks();
  initHomePage();
  initProductsPage();
  initProductPage();
  initCartPage();
  initCheckoutPage();
  initSuccessPage();
});
