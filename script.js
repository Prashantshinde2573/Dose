// ================= DOSE Speciality Coffee =================
(() => {
  const I = n => `images/dose-${n}.jpg`;   // original Dose photos (Instagram + Google Maps)
  // Unsplash backup, used only if an original photo is missing from images/
  const UN = id => `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=900&q=80`;
  const FB = {
    "maps-pourover": "1757949921983-ab4c911cc3fe", "maps-sandwich-b": "1542372147193-a7aca54189cd",
    "ig-beans-cup": "1610632380989-680fe40816c6", "ig-duo": "1509042239860-f550ce710b93",
    "ig-brewing": "1563090308-5a7889e40542", "ig-scooter": "1495474472287-4d71bcdd2085",
    "ig-cup-hands": "1512568400610-62da28bc8a13", "ig-bigcup": "1517701550927-30cf4ba1dba5",
    "ig-chairs": "1511081692775-05d0f180a065", "ig-street": "1521017432531-fbd92d768814",
    "ig-cafe-render": "1567880905822-56f8e06fe630", "ig-selfie": "1764298490445-6add12301888",
    "ig-perfect-dose-text": "1447933601403-0c6688de566e", "ig-speciality-text": "1447933601403-0c6688de566e",
  };
  const fbFor = src => { const k = (src.match(/dose-(.+)\.jpg$/) || [])[1]; return UN(FB[k] || "1610632380989-680fe40816c6"); };
  const imgTag = (src, alt) => `<img src="${src}" alt="${alt}" loading="lazy" onerror="this.onerror=null;this.src='${fbFor(src)}'" />`;
  const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------- Menu highlights (real Dose photos) ---------- */
  const coffees = [
    { name: "Iced Cold Brew",        note: "Slow-steeped, over ice",       label: "Coffee",   tags: ["coffee", "togo"], img: I("maps-iced-coldbrew") },
    { name: "Hand Pour Over",        note: "Brewed at the Dose bar",       label: "Brew Bar", tags: ["brew", "coffee"], img: I("maps-pourover") },
    { name: "The Signature Dose",    note: "Freshly roasted beans",        label: "Coffee",   tags: ["coffee"],         img: I("ig-beans-cup") },
    { name: "Cappuccino & Croissant",note: "The duo you can afford",       label: "Coffee",   tags: ["coffee", "food"], img: I("ig-duo") },
    { name: "Dose Big Breakfast",    note: "Omelette, avocado & more",     label: "Food",     tags: ["food"],           img: I("maps-breakfast") },
    { name: "Grilled Sandwich",      note: "Toasted, with fresh greens",   label: "Food",     tags: ["food"],           img: I("maps-sandwich-b") },
    { name: "Something's Brewing",   note: "Slow coffee, done right",      label: "Brew Bar", tags: ["brew"],           img: I("ig-brewing") },
    { name: "Your Daily Dose To Go", note: "Grab it, sip it, ride on",     label: "On The Go",tags: ["togo"],           img: I("ig-scooter") },
  ];

  /* ---------- Spaces (real café photos) ---------- */
  const spaces = [
    { name: "The Main Hall",    note: "Bright, minimal seating",  label: "Indoor",  tags: ["indoor"],  img: I("maps-interior-pano") },
    { name: "Glass Terrace",    note: "Sunlit, open-air corner",  label: "Outdoor", tags: ["outdoor"], img: I("maps-terrace-pano") },
    { name: "The Lounge",       note: "Soft sofas, slow sips",    label: "Indoor",  tags: ["indoor"],  img: I("maps-lounge-pano") },
    { name: "Green Entrance",   note: "Plants all the way in",    label: "Outdoor", tags: ["outdoor"], img: I("maps-entrance-pano") },
    { name: "Mirror Corner",    note: "The selfie spot",          label: "Indoor",  tags: ["indoor"],  img: I("maps-mirror-pano") },
    { name: "The Café Front",   note: "Road No 11, Banjara Hills",label: "Outdoor", tags: ["outdoor"], img: I("maps-exterior") },
    { name: "Work-Friendly Hall", note: "Space to sit & focus",   label: "Indoor",  tags: ["indoor"],  img: I("maps-hall-pano") },
    { name: "Garden Walkway",   note: "A calm walk to your cup",  label: "Outdoor", tags: ["outdoor"], img: I("maps-walkway-pano") },
  ];

  /* ---------- Favourites ---------- */
  const favs = new Set();
  const favCount = document.getElementById("favCount");
  const updateFav = () => {
    favCount.textContent = favs.size;
    favCount.classList.toggle("show", favs.size > 0);
    favCount.classList.remove("bump"); void favCount.offsetWidth; favCount.classList.add("bump");
  };
  const heartSvg = '<svg viewBox="0 0 24 24"><path d="M12 20s-7-4.4-9.2-9C1.4 8 3.3 4.5 6.8 4.5c2 0 3.4 1.2 5.2 3 1.8-1.8 3.2-3 5.2-3 3.5 0 5.4 3.5 4 6.5C19 15.6 12 20 12 20z"/></svg>';

  const cardHTML = (p) => `
    <article class="card">
      <div class="card-media">
        ${imgTag(p.img, p.name)}
        <button class="heart ${favs.has(p.name) ? "on" : ""}" data-name="${p.name}" aria-label="Add ${p.name} to favourites">${heartSvg}</button>
      </div>
      <div class="card-body">
        <div><h3>${p.name}</h3><small>${p.note}</small></div>
        <span class="price">${p.label}</span>
      </div>
    </article>`;

  function render(grid, items, labelFn) {
    const old = grid.querySelectorAll(".card");
    old.forEach(c => c.classList.add("hide"));
    setTimeout(() => {
      grid.innerHTML = items.map(p => cardHTML(p)).join("");
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

  function setupTabs(tabsId, onPick) {
    const tabs = document.getElementById(tabsId);
    tabs.addEventListener("click", e => {
      const b = e.target.closest("button");
      if (!b || b.classList.contains("is-active")) return;
      tabs.querySelectorAll("button").forEach(x => x.classList.toggle("is-active", x === b));
      onPick(b.dataset.filter);
    });
  }
  const pick = (list, f) => f === "all" ? list : list.filter(c => c.tags.includes(f));
  setupTabs("coffeeTabs", f => render(coffeeGrid, pick(coffees, f)));
  setupTabs("flavourTabs", f => render(flavourGrid, pick(spaces, f)));

  // first render when grid scrolls into view (so the stagger is seen)
  const gridIO = new IntersectionObserver(entries => entries.forEach(en => {
    if (!en.isIntersecting) return;
    if (en.target === coffeeGrid) render(coffeeGrid, coffees);
    else render(flavourGrid, spaces);
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
    const end = +el.dataset.count, dec = +(el.dataset.dec || 0), dur = 1400, t0 = performance.now();
    const step = t => {
      const p = Math.min((t - t0) / dur, 1);
      el.textContent = (end * (1 - Math.pow(1 - p, 3))).toFixed(dec);
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

  /* ---------- Instagram strip (original Dose Instagram photos) ---------- */
  const insta = ["ig-cafe-render","ig-cup-hands","ig-beans-cup","ig-scooter","ig-chairs","ig-duo","ig-bigcup","ig-street","ig-brewing","ig-selfie","ig-perfect-dose-text","ig-speciality-text"].map(I);
  const igIcon = '<svg viewBox="0 0 24 24"><rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/></svg>';
  const row = document.getElementById("instaRow");
  const item = src => `<a class="insta-item" href="https://www.instagram.com/dose.specialitycoffee/" target="_blank" rel="noopener">${imgTag(src, "Dose Speciality Coffee on Instagram")}${igIcon}</a>`;
  row.innerHTML = insta.map(item).join("") + insta.map(item).join(""); // duplicated for seamless loop

  // backup for static <img> tags in the page
  document.querySelectorAll("img[src^='images/']").forEach(img => {
    const swap = () => { if (!img.dataset.swapped) { img.dataset.swapped = 1; img.src = fbFor(img.getAttribute("src")); } };
    img.addEventListener("error", swap, { once: true });
    if (img.complete && img.naturalWidth === 0) swap();
  });

  /* ---------- Newsletter (static — no backend) ---------- */
  document.getElementById("newsletter").addEventListener("submit", e => {
    e.preventDefault();
    document.getElementById("formMsg").textContent = "Thank you! Your next dose of news is on its way ☕";
    e.target.reset();
  });
})();
