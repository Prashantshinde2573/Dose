// ================= DOSE Speciality Coffee =================
(() => {
  const U = (id, w = 700) => `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${w}&h=${w}&q=80`;
  const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------- Menu data (sample prices — edit as per real menu) ---------- */
  const coffees = [
    { name: "Cappuccino",     note: "Espresso · steamed milk",  price: 220, tags: ["hot", "milk"],    img: U("1509042239860-f550ce710b93") },
    { name: "Café Latte",     note: "Silky & smooth",           price: 240, tags: ["hot", "milk"],    img: U("1563090308-5a7889e40542") },
    { name: "Iced Latte",     note: "Over ice, slow pour",      price: 260, tags: ["iced", "milk"],   img: U("1517701550927-30cf4ba1dba5") },
    { name: "Affogato",       note: "Espresso over gelato",     price: 280, tags: ["dessert"],        img: U("1612197127729-c623fa1d0360") },
    { name: "Espresso",       note: "Double shot",              price: 160, tags: ["hot", "black"],   img: U("1610632380989-680fe40816c6") },
    { name: "Spanish Latte",  note: "Condensed milk, layered",  price: 280, tags: ["iced", "milk"],   img: U("1764298490445-6add12301888") },
    { name: "Cold Brew",      note: "Steeped 18 hours",         price: 250, tags: ["iced", "black"],  img: U("1759259639354-830bc3120807") },
    { name: "Flat White",     note: "Ristretto · micro-foam",   price: 230, tags: ["hot", "milk"],    img: U("1502462041640-b3d7e50d0662") },
  ];

  const flavours = {
    chocolate: [
      { name: "Mocha Frappe",      note: "Whipped & blended", price: 290, img: U("1718267050202-9b1b6bfb8545") },
      { name: "Choco Shake",       note: "Thick & indulgent", price: 300, img: U("1696487773677-c0c8061fe3d2") },
      { name: "Iced Mocha",        note: "Cold & cocoa-rich", price: 280, img: U("1598831745385-0c404c7034a9") },
      { name: "Dark Hot Chocolate",note: "70% dark cocoa",    price: 260, img: U("1592505746058-2c74be3c2155") },
    ],
    caramel: [
      { name: "Caramel Frappe",    note: "Drizzled caramel",  price: 290, img: U("1579888071069-c107a6f79d82") },
      { name: "Caramel Iced Latte",note: "Sweet & cold",      price: 270, img: U("1728978096068-0f15dc964c4c") },
      { name: "Caramel Cortado",   note: "Short & bold",      price: 240, img: U("1747103217713-43b8a7a3e3ba") },
      { name: "Caramel Macchiato", note: "Marked with foam",  price: 270, img: U("1461023058943-07fcbe16d735") },
    ],
    hazelnut: [
      { name: "Hazelnut Cappuccino", note: "Nutty & warm",    price: 250, img: U("1512568400610-62da28bc8a13") },
      { name: "Hazelnut Iced Latte", note: "Toasted notes",   price: 270, img: U("1527156231393-7023794f363c") },
      { name: "Hazelnut Flat White", note: "Velvety micro-foam", price: 250, img: U("1495474472287-4d71bcdd2085") },
      { name: "Hazelnut Espresso",   note: "Single shot + syrup", price: 190, img: U("1559496417-e7f25cb247f3") },
    ],
    vanilla: [
      { name: "Vanilla Float",       note: "Ice cream topped", price: 290, img: U("1653122025451-ec76a73f8a08") },
      { name: "Vanilla Affogato",    note: "Bean gelato",      price: 280, img: U("1594631661960-34762327295a") },
      { name: "Vanilla Cold Brew",   note: "Sweet cream",      price: 270, img: U("1759259639354-830bc3120807") },
      { name: "Vanilla Bean Latte",  note: "Real vanilla",     price: 250, img: U("1563090308-5a7889e40542") },
    ],
    cinnamon: [
      { name: "Cinnamon Iced Coffee",note: "Spiced & chilled", price: 260, img: U("1761673930163-8d3d6d73cd7a") },
      { name: "Cinnamon Cappuccino", note: "Dusted on foam",   price: 240, img: U("1509042239860-f550ce710b93") },
      { name: "Cinnamon Flat White", note: "Warm spice",       price: 240, img: U("1502462041640-b3d7e50d0662") },
      { name: "Cinnamon Latte",      note: "Cosy classic",     price: 250, img: U("1764298490445-6add12301888") },
    ],
  };

  /* ---------- Favourites ---------- */
  const favs = new Set();
  const favCount = document.getElementById("favCount");
  const updateFav = () => {
    favCount.textContent = favs.size;
    favCount.classList.toggle("show", favs.size > 0);
    favCount.classList.remove("bump"); void favCount.offsetWidth; favCount.classList.add("bump");
  };
  const heartSvg = '<svg viewBox="0 0 24 24"><path d="M12 20s-7-4.4-9.2-9C1.4 8 3.3 4.5 6.8 4.5c2 0 3.4 1.2 5.2 3 1.8-1.8 3.2-3 5.2-3 3.5 0 5.4 3.5 4 6.5C19 15.6 12 20 12 20z"/></svg>';

  const cardHTML = (p, label) => `
    <article class="card">
      <div class="card-media">
        <img src="${p.img}" alt="${p.name}" loading="lazy" />
        ${label ? `<span class="card-tag">${label}</span>` : ""}
        <button class="heart ${favs.has(p.name) ? "on" : ""}" data-name="${p.name}" aria-label="Add ${p.name} to favourites">${heartSvg}</button>
      </div>
      <div class="card-body">
        <div><h3>${p.name}</h3><small>${p.note}</small></div>
        <span class="price">₹${p.price}</span>
      </div>
    </article>`;

  function render(grid, items, labelFn) {
    const old = grid.querySelectorAll(".card");
    old.forEach(c => c.classList.add("hide"));
    setTimeout(() => {
      grid.innerHTML = items.map(p => cardHTML(p, labelFn && labelFn(p))).join("");
      grid.querySelectorAll(".card").forEach((c, i) => setTimeout(() => c.classList.add("show"), 70 * i));
    }, old.length ? 280 : 0);
  }

  document.addEventListener("click", e => {
    const h = e.target.closest(".heart");
    if (!h) return;
    const n = h.dataset.name;
    favs.has(n) ? favs.delete(n) : favs.add(n);
    document.querySelectorAll(`.heart[data-name="${CSS.escape(n)}"]`).forEach(b => b.classList.toggle("on", favs.has(n)));
    updateFav();
  });

  const coffeeGrid = document.getElementById("coffeeGrid");
  const flavourGrid = document.getElementById("flavourGrid");
  const tagLabel = p => p.tags.includes("iced") ? "Iced" : p.tags.includes("dessert") ? "Dessert" : "Hot";

  function setupTabs(tabsId, onPick) {
    const tabs = document.getElementById(tabsId);
    tabs.addEventListener("click", e => {
      const b = e.target.closest("button");
      if (!b || b.classList.contains("is-active")) return;
      tabs.querySelectorAll("button").forEach(x => x.classList.toggle("is-active", x === b));
      onPick(b.dataset.filter);
    });
  }
  setupTabs("coffeeTabs", f => render(coffeeGrid, f === "all" ? coffees : coffees.filter(c => c.tags.includes(f)), tagLabel));
  setupTabs("flavourTabs", f => render(flavourGrid, flavours[f]));

  // first render when grid scrolls into view (so the stagger is seen)
  const gridIO = new IntersectionObserver(entries => entries.forEach(en => {
    if (!en.isIntersecting) return;
    if (en.target === coffeeGrid) render(coffeeGrid, coffees, tagLabel);
    else render(flavourGrid, flavours.chocolate);
    gridIO.unobserve(en.target);
  }), { rootMargin: "0px 0px -10% 0px" });
  gridIO.observe(coffeeGrid);
  gridIO.observe(flavourGrid);

  /* ---------- Hero slider ---------- */
  const slides = document.querySelectorAll(".slide");
  const dots = document.querySelectorAll("#heroDots button");
  let cur = 0, timer;
  const go = i => {
    slides[cur].classList.remove("is-active"); dots[cur].classList.remove("is-active");
    cur = (i + slides.length) % slides.length;
    slides[cur].classList.add("is-active"); dots[cur].classList.add("is-active");
    clearInterval(timer); timer = setInterval(() => go(cur + 1), 6000);
  };
  dots.forEach((d, i) => d.addEventListener("click", () => go(i)));
  timer = setInterval(() => go(cur + 1), 6000);

  /* ---------- Nav ---------- */
  const nav = document.getElementById("nav");
  const burger = document.getElementById("burger");
  const links = document.getElementById("navLinks");
  const toggleMenu = open => {
    burger.classList.toggle("open", open); links.classList.toggle("open", open); nav.classList.toggle("menu-open", open);
  };
  burger.addEventListener("click", () => toggleMenu(!links.classList.contains("open")));
  links.querySelectorAll("a").forEach(a => a.addEventListener("click", () => toggleMenu(false)));
  document.getElementById("favBtn").addEventListener("click", () => document.getElementById("menu").scrollIntoView({ behavior: "smooth" }));

  /* ---------- Scroll reveal + counters ---------- */
  const io = new IntersectionObserver(entries => entries.forEach(en => {
    if (!en.isIntersecting) return;
    en.target.classList.add("in");
    const num = en.target.querySelector("[data-count]");
    if (num) countUp(num);
    io.unobserve(en.target);
  }), { threshold: 0.2 });
  document.querySelectorAll(".reveal, .footer-giant").forEach(el => io.observe(el));

  function countUp(el) {
    const end = +el.dataset.count, dur = 1400, t0 = performance.now();
    const step = t => {
      const p = Math.min((t - t0) / dur, 1);
      el.textContent = Math.round(end * (1 - Math.pow(1 - p, 3)));
      if (p < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }

  /* ---------- Parallax image (environment) ---------- */
  const px = document.querySelector(".parallax");
  const onScroll = () => {
    nav.classList.toggle("scrolled", scrollY > 60);
    if (px && !reduce) {
      const r = px.parentElement.getBoundingClientRect();
      const p = (r.top + r.height / 2 - innerHeight / 2) / innerHeight;
      px.style.transform = `translateY(${p * -60}px)`;
    }
  };
  addEventListener("scroll", () => requestAnimationFrame(onScroll), { passive: true });
  onScroll();

  /* ---------- Falling coffee beans (quality section) ---------- */
  const layer = document.getElementById("beansLayer");
  if (!reduce) {
    const n = innerWidth < 640 ? 10 : 18;
    for (let i = 0; i < n; i++) {
      const b = document.createElement("span");
      b.className = "bean";
      b.style.left = Math.random() * 100 + "%";
      b.style.setProperty("--s", 14 + Math.random() * 18 + "px");
      b.style.setProperty("--d", 7 + Math.random() * 7 + "s");
      b.style.setProperty("--delay", -Math.random() * 12 + "s");
      b.style.setProperty("--drift", (Math.random() * 120 - 60) + "px");
      b.style.setProperty("--rot", (Math.random() > .5 ? 1 : -1) * (300 + Math.random() * 400) + "deg");
      layer.appendChild(b);
    }
  }

  /* ---------- Instagram strip (local Instagram photos, Unsplash fallback) ---------- */
  const insta = [
    ["images/dose-ig-cafe.jpg",         U("1567880905822-56f8e06fe630", 600)],
    ["images/dose-ig-bigcup.jpg",       U("1495474472287-4d71bcdd2085", 600)],
    ["images/dose-ig-beans-cup.jpg",    U("1610632380989-680fe40816c6", 600)],
    ["images/dose-ig-scooter.jpg",      U("1757949921983-ab4c911cc3fe", 600)],
    ["images/dose-ig-perfect-dose.jpg", U("1511081692775-05d0f180a065", 600)],
    ["images/dose-ig-duo.jpg",          U("1512568400610-62da28bc8a13", 600)],
    ["images/dose-ig-iced.jpg",         U("1517701550927-30cf4ba1dba5", 600)],
    ["images/dose-ig-street.jpg",       U("1521017432531-fbd92d768814", 600)],
  ];
  const igIcon = '<svg viewBox="0 0 24 24"><rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/></svg>';
  const row = document.getElementById("instaRow");
  const item = ([src, fb]) => `<a class="insta-item" href="https://www.instagram.com/dose.specialitycoffee/" target="_blank" rel="noopener"><img src="${src}" data-fallback="${fb}" alt="Dose Speciality Coffee on Instagram" loading="lazy" />${igIcon}</a>`;
  row.innerHTML = insta.map(item).join("") + insta.map(item).join(""); // duplicated for seamless loop

  // swap to fallback if a local image is missing
  const fallback = img => { if (img.dataset.fallback && img.src !== img.dataset.fallback) img.src = img.dataset.fallback; };
  document.querySelectorAll("img[data-fallback]").forEach(img => {
    img.addEventListener("error", () => fallback(img), { once: true });
    if (img.complete && img.naturalWidth === 0) fallback(img);
  });

  /* ---------- Newsletter (static — no backend) ---------- */
  document.getElementById("newsletter").addEventListener("submit", e => {
    e.preventDefault();
    document.getElementById("formMsg").textContent = "Thank you! Your next dose of news is on its way ☕";
    e.target.reset();
  });
})();
