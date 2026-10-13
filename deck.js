/* Builder Session Jujuy · motor del deck + interacciones */
(() => {
  "use strict";

  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const store = {
    get(k, d) { try { const v = localStorage.getItem("bsj:" + k); return v == null ? d : JSON.parse(v); } catch { return d; } },
    set(k, v) { try { localStorage.setItem("bsj:" + k, JSON.stringify(v)); } catch {} },
  };
  const fmt = (n, d = 0) => n.toLocaleString("es-AR", { minimumFractionDigits: d, maximumFractionDigits: d });
  const mobile = matchMedia("(orientation: portrait) and (max-width: 820px)");

  const stage = $("#stage");
  const slides = $$(".slide", stage);
  const total = slides.length;

  /* ---------- Secciones ---------- */
  const SECTIONS = [
    null,
    { name: "01 Intro", color: "var(--cyan)" },
    { name: "02 Celo", color: "var(--yellow)" },
    { name: "03 Hackathon", color: "#fff" },
    { name: "04 Tracks", color: "var(--green)", multi: true },
    { name: "05 Construir", color: "var(--pink)" },
    { name: "06 Cierre", color: "var(--yellow)" },
  ];
  const sectionOf = (i) => +slides[i].dataset.section;

  const progress = $("#progress");
  SECTIONS.forEach((s, k) => {
    if (!s) return;
    const b = document.createElement("button");
    b.style.setProperty("--c", s.color);
    if (s.multi) b.dataset.multi = "";
    b.innerHTML = `<span>${s.name}</span>`;
    b.setAttribute("aria-label", s.name);
    b.onclick = () => go(slides.findIndex((_, i) => sectionOf(i) === k));
    progress.appendChild(b);
  });

  /* ---------- Escalado (960×540 → viewport) ---------- */
  function fit() {
    if (mobile.matches) { stage.style.transform = ""; return; }
    const s = Math.min(innerWidth / 960, innerHeight / 540);
    stage.style.transform = `translate(-50%, -50%) scale(${s})`;
  }
  addEventListener("resize", fit);
  mobile.addEventListener("change", fit);
  fit();

  slides.forEach((sl) => $$("[data-in]", sl).forEach((el, i) => el.style.setProperty("--i", i)));

  /* ---------- Navegación ---------- */
  let cur = -1;
  const enterHooks = {};
  const onEnter = (sel, f) => { const i = slides.findIndex((s) => s.matches(sel)); (enterHooks[i] ||= []).push(f); };

  function go(n, { replace = false } = {}) {
    n = Math.max(0, Math.min(total - 1, n));
    if (n === cur) return;
    slides.forEach((sl, i) => {
      sl.classList.toggle("active", i === n);
      sl.classList.toggle("past", i < n);
      sl.setAttribute("aria-hidden", i !== n);
    });
    cur = n;
    const sec = sectionOf(n);
    stage.dataset.cover = sec === 0;
    stage.style.setProperty("--accent", sec === 3 ? "var(--green)" : SECTIONS[sec]?.color || "var(--green)");
    $("#counter").innerHTML = `<b>${String(n + 1).padStart(2, "0")}</b> / ${total}`;
    $$("button", progress).forEach((b, k) => { const s = k + 1; b.dataset.state = s < sec ? "done" : s === sec ? "current" : "todo"; });
    $$(".thumb").forEach((t, i) => t.classList.toggle("cur", i === n));
    const hash = `#/${n + 1}`;
    if (location.hash !== hash) history[replace ? "replaceState" : "pushState"](null, "", hash);
    if (mobile.matches) scrollTo({ top: 0, behavior: "instant" });
    enterHooks[n]?.forEach((f) => f());
  }
  const next = () => go(cur + 1);
  const prev = () => go(cur - 1);
  const fromHash = () => { const m = location.hash.match(/^#\/(\d+)/); return m ? +m[1] - 1 : 0; };
  const onHash = () => { toggleOverview(false); go(fromHash(), { replace: true }); };
  addEventListener("popstate", onHash);
  addEventListener("hashchange", onHash);

  const isField = (el) => el && (el.matches("input, textarea, select") || el.isContentEditable);
  addEventListener("keydown", (e) => {
    if (e.metaKey || e.ctrlKey || e.altKey) return;
    if (isField(document.activeElement)) { if (e.key === "Escape") document.activeElement.blur(); return; }
    const ov = $("#overview").classList.contains("open");
    switch (e.key) {
      case "ArrowRight": case "PageDown": case " ": case "Enter":
        if (e.key === "Enter" && document.activeElement?.matches("button, a, [tabindex]")) return;
        e.preventDefault(); if (!ov) next(); break;
      case "ArrowLeft": case "PageUp": case "Backspace":
        e.preventDefault(); if (!ov) prev(); break;
      case "Home": go(0); break;
      case "End": go(total - 1); break;
      case "o": case "O": toggleOverview(); break;
      case "f": case "F": toggleFull(); break;
      case "Escape": if (ov) toggleOverview(false); break;
      default: if (/^[1-9]$/.test(e.key)) go(+e.key - 1);
    }
    hideHint();
  });

  let tx = null, ty = null;
  stage.addEventListener("touchstart", (e) => { tx = e.touches[0].clientX; ty = e.touches[0].clientY; }, { passive: true });
  stage.addEventListener("touchend", (e) => {
    if (tx == null) return;
    const dx = e.changedTouches[0].clientX - tx, dy = e.changedTouches[0].clientY - ty;
    if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy) * 1.4) (dx < 0 ? next : prev)();
    tx = null;
  });

  $("#next").onclick = next;
  $("#prev").onclick = prev;
  $("#grid").onclick = () => toggleOverview();
  $("#full").onclick = () => toggleFull();
  function toggleFull() {
    if (!document.fullscreenElement) document.documentElement.requestFullscreen?.().catch(() => {});
    else document.exitFullscreen?.();
  }
  let hintTimer = setTimeout(hideHint, 9000);
  function hideHint() { clearTimeout(hintTimer); $("#hint").classList.add("gone"); }

  /* ---------- Índice ---------- */
  const thumbs = $("#thumbs");
  slides.forEach((sl, i) => {
    const s = SECTIONS[sectionOf(i)];
    const t = document.createElement("button");
    t.className = "thumb";
    t.style.setProperty("--c", s?.color || "var(--green)");
    t.innerHTML = `<small>${s ? s.name : "Portada"}</small><span>${sl.dataset.title}</span><b>${String(i + 1).padStart(2, "0")}</b>`;
    t.onclick = () => { go(i); toggleOverview(false); };
    thumbs.appendChild(t);
  });
  function toggleOverview(force) {
    const o = $("#overview");
    const open = force ?? !o.classList.contains("open");
    o.classList.toggle("open", open);
    o.setAttribute("aria-hidden", !open);
  }

  let toastT;
  function toast(msg) {
    const t = $("#toast");
    t.textContent = msg; t.classList.add("show");
    clearTimeout(toastT); toastT = setTimeout(() => t.classList.remove("show"), 1800);
  }

  /* ============================================================
     Interacciones
     ============================================================ */

  $$("[data-pick]").forEach((g) => {
    const items = $$(".tap", g);
    items.forEach((it) => it.addEventListener("click", () => items.forEach((x) => x.classList.toggle("hot", x === it))));
  });

  $$("[data-check]").forEach((g) => {
    const key = "check:" + g.dataset.check;
    const items = $$(".step, .rule", g);
    const state = store.get(key, []);
    const render = () => { items.forEach((it, i) => it.classList.toggle("done", !!state[i])); g.dispatchEvent(new CustomEvent("change")); };
    items.forEach((it, i) => {
      it.setAttribute("role", "checkbox"); it.tabIndex = 0;
      const flip = () => { state[i] = !state[i]; it.setAttribute("aria-checked", !!state[i]); store.set(key, state); render(); };
      it.addEventListener("click", flip);
      it.addEventListener("keydown", (e) => { if (e.key === " " || e.key === "Enter") { e.preventDefault(); e.stopPropagation(); flip(); } });
    });
    render();
  });
  const rules = $('[data-check="rules"]');
  const syncRules = () => { $("#rules-ready b").textContent = $$(".rule.done", rules).length; };
  rules.addEventListener("change", syncRules);
  syncRules();

  /* 04 · cadena editable */
  (() => {
    const box = $("#ledger .blocks");
    const SEED = ["Ana → Beto · 5.000 wARS", "Beto → Caro · 1.200 wARS", "Caro → Dani · 300 wARS"];
    const h = (str) => {
      const one = (s, seed) => {
        let a = 0xdeadbeef ^ seed, b = 0x41c6ce57 ^ seed;
        for (let i = 0; i < s.length; i++) { const c = s.charCodeAt(i); a = Math.imul(a ^ c, 2654435761); b = Math.imul(b ^ c, 1597334677); }
        a = Math.imul(a ^ (a >>> 16), 2246822507) ^ Math.imul(b ^ (b >>> 13), 3266489909);
        b = Math.imul(b ^ (b >>> 16), 2246822507) ^ Math.imul(a ^ (a >>> 13), 3266489909);
        return (b >>> 0).toString(16).padStart(8, "0") + (a >>> 0).toString(16).padStart(8, "0");
      };
      return "0x" + one(str, 1) + one(str, 7);
    };
    let sealed = [];
    function seal() {
      sealed = []; let prevH = "0x" + "0".repeat(32);
      SEED.forEach((d, i) => { const hash = h(prevH + "|" + d + "|" + i); sealed.push({ data: d, prev: prevH, hash }); prevH = hash; });
    }
    function build() {
      box.innerHTML = "";
      sealed.forEach((b, i) => {
        const el = document.createElement("div");
        el.className = "block";
        el.innerHTML = `<div class="row"><span>Bloque #${1024 + i}</span><span class="status">✓ válido</span></div>
          <input value="${b.data}" aria-label="Movimiento del bloque ${i + 1}" spellcheck="false">
          <div class="hashes"><span>prev</span><code class="prev">${b.prev}</code><span>hash</span><code class="hash">${b.hash}</code></div>`;
        $("input", el).addEventListener("input", check);
        box.appendChild(el);
      });
      check();
    }
    function check() {
      let broken = false, prevH = "0x" + "0".repeat(32);
      $$(".block", box).forEach((el, i) => {
        const stored = sealed[i];
        const hash = h(stored.prev + "|" + $("input", el).value + "|" + i);
        const ok = hash === stored.hash && stored.prev === prevH && !broken;
        $(".hash", el).textContent = hash;
        el.classList.toggle("broken", !ok);
        $(".status", el).textContent = ok ? "✓ válido" : hash !== stored.hash ? "✗ alterado" : "✗ cadena rota";
        if (!ok) broken = true;
        prevH = hash;
      });
      $("#ledger .ledger-foot").innerHTML = broken
        ? "<b>La cadena se rompió.</b> El hash cambió y ya no coincide con el que guardó el bloque siguiente: toda la red lo detecta al instante."
        : "Cada bloque guarda la huella (hash) del anterior. Editá un movimiento y mirá qué pasa.";
    }
    $("#ledger [data-reset]").onclick = () => { seal(); build(); };
    seal(); build();
  })();

  /* 05 · clave, peg, gas */
  (() => {
    const pk = $("#pk");
    $("button", pk).onclick = () => {
      pk.classList.remove("nope"); void pk.offsetWidth; pk.classList.add("nope");
      $("code", pk).textContent = "Nunca se comparte 🔒"; $("button", pk).textContent = "Ok";
      setTimeout(() => { pk.classList.remove("nope"); $("code", pk).textContent = "•••• •••• •••• •••• ••••"; $("button", pk).textContent = "Mostrar"; }, 2600);
    };
    const ars = $("#ars");
    ars.oninput = () => { $("#wars").textContent = fmt(Math.max(0, +ars.value || 0)); };
    ars.oninput();
    const g = $("#gasn");
    g.oninput = () => { const usd = +g.value * 0.0005; $("#gasn-o").textContent = fmt(+g.value); $("#gasn-r").textContent = fmt(usd, usd < 0.01 ? 4 : usd < 1 ? 3 : 2); };
    g.oninput();
  })();

  /* 06 · comparar */
  (() => {
    const sl = $(".s-why");
    const set = (m) => { stage.dataset.mode = m; $$("[data-vs]", sl).forEach((b) => b.classList.toggle("on", b.dataset.vs === m)); };
    $$("[data-vs]", sl).forEach((b) => (b.onclick = () => set(b.dataset.vs)));
    onEnter(".s-why", () => set("web3"));
  })();

  /* 07 · acordeón */
  (() => {
    const items = $$("#reasons .reason");
    items.forEach((it) => ($(".r-head", it).onclick = () => { const open = !it.classList.contains("open"); items.forEach((x) => x.classList.toggle("open", open && x === it)); }));
  })();

  /* 09 · count-up + calculadora */
  (() => {
    const els = $$("[data-count]");
    onEnter(".s-nums", () => els.forEach((el) => {
      const to = +el.dataset.count, suf = el.dataset.suffix || "", t0 = performance.now(), D = 1400;
      const step = (t) => { const p = Math.min(1, (t - t0) / D), e = 1 - Math.pow(1 - p, 4); el.textContent = fmt(Math.round(to * e)) + suf; if (p < 1) requestAnimationFrame(step); };
      el.textContent = "0" + suf;
      setTimeout(() => requestAnimationFrame(step), 300);
    }));
    const r = $("#calc");
    r.oninput = () => {
      const raw = 10 ** (1 + (+r.value / 100) * 5);
      const mag = Math.max(1, 10 ** Math.floor(Math.log10(raw)) / 10);
      const n = Math.round(raw / mag) * mag, usd = n * 0.0005;
      $("#calc-n").textContent = fmt(n); $("#calc-r").textContent = fmt(usd, usd < 1 ? 3 : 2);
    };
    r.oninput();
  })();

  /* 10 / 19 · countdown */
  (() => {
    const END = new Date("2026-11-09T06:00:00-03:00").getTime();
    const boxes = $$("[data-countdown]");
    boxes.forEach((b) => { b.innerHTML = ["días", "horas", "min", "seg"].map((l) => `<div class="cd"><b>00</b><span>${l}</span></div>`).join(""); });
    const tick = () => {
      const s = Math.max(0, Math.floor((END - Date.now()) / 1000));
      const v = [Math.floor(s / 86400), Math.floor((s % 86400) / 3600), Math.floor((s % 3600) / 60), s % 60];
      boxes.forEach((b) => $$("b", b).forEach((x, i) => { x.textContent = String(v[i]).padStart(2, "0"); }));
    };
    tick(); setInterval(tick, 1000);
  })();

  /* 11 · ruta de la plata */
  (() => {
    const route = $("#route");
    const MODES = {
      hoy: { html: `<span class="node">ARS</span><i class="edge fee"><em>comisión</em></i><span class="node usd">USD</span><i class="edge fee"><em>comisión</em></i><span class="node">BRL</span>`, cap: "Dos conversiones, dos comisiones y días de espera." },
      onchain: { html: `<span class="node">wARS</span><i class="edge"></i><span class="node celo">Celo</span><i class="edge"></i><span class="node">wBRL</span>`, cap: "Moneda local a moneda local, onchain, en segundos." },
    };
    const set = (m) => { $$("[data-mode]", route).forEach((b) => b.classList.toggle("on", b.dataset.mode === m)); $(".path", route).innerHTML = MODES[m].html; $(".cap", route).textContent = MODES[m].cap; };
    $$("[data-mode]", route).forEach((b) => (b.onclick = () => set(b.dataset.mode)));
    set("hoy");
  })();
  $$(".fiat").forEach((f) => f.addEventListener("click", () => f.classList.toggle("hot")));

  /* 12 · tracks */
  (() => {
    const grid = $("#tracks"), cards = $$(".track", grid), btns = $$(".split button");
    const focus = (i) => {
      const on = i != null && !cards[i].classList.contains("hot");
      cards.forEach((c, k) => c.classList.toggle("hot", on && k === i));
      btns.forEach((b, k) => b.classList.toggle("on", on && k === i));
      grid.classList.toggle("dim", on);
    };
    btns.forEach((b, i) => (b.onclick = () => focus(i)));
    cards.forEach((c, i) => c.addEventListener("click", () => {
      if (c.dataset.go && c.classList.contains("hot")) return go(slides.findIndex((s) => s.matches(c.dataset.go)));
      focus(i);
    }));
    onEnter(".s-tracks", () => focus(null));
  })();

  /* 14 · autoevaluación */
  (() => {
    const crits = $$("#crits .crit");
    const vals = store.get("eval", [0, 0, 0, 0, 0]);
    const MSG = [[0, "Puntuá tu proyecto de 1 a 5 en cada criterio."], [40, "Arrancando. Enfocate en que funcione en mainnet con tu tag."], [70, "Va bien. Revisá UX y que el impacto sea concreto."], [90, "Muy sólido. Pulí la demo y el pitch."], [101, "Listo para ganar. 🚀"]];
    const render = () => {
      crits.forEach((c, i) => $$(".rate button", c).forEach((b, k) => b.classList.toggle("on", k < vals[i])));
      const pct = Math.round(vals.reduce((a, v) => a + (v / 5) * 20, 0));
      $("#score").textContent = pct; $("#meter").style.width = pct + "%";
      $("#score-msg").textContent = !vals.some(Boolean) ? MSG[0][1] : MSG.find(([t]) => pct < t)?.[1] ?? MSG.at(-1)[1];
      store.set("eval", vals);
    };
    crits.forEach((c, i) => {
      const r = $(".rate", c);
      for (let k = 1; k <= 5; k++) { const b = document.createElement("button"); b.setAttribute("aria-label", `${k} de 5`); b.onclick = () => { vals[i] = vals[i] === k ? k - 1 : k; render(); }; r.appendChild(b); }
    });
    $("#score-reset").onclick = () => { vals.fill(0); render(); };
    render();
  })();

  /* 16 · al azar */
  (() => {
    const ideas = $$("#ideas .idea");
    let last = -1, busy = false;
    $("#dice").onclick = () => {
      if (busy) return; busy = true;
      let n = 0; const spins = 10 + Math.floor(Math.random() * 6);
      const spin = () => {
        let i; do { i = Math.floor(Math.random() * ideas.length); } while (i === last);
        last = i; ideas.forEach((x, k) => x.classList.toggle("hot", k === i));
        if (++n < spins) setTimeout(spin, 50 + n * 12); else busy = false;
      };
      spin();
    };
  })();

  /* 17 · copiar */
  $$("[data-copy]").forEach((b) => b.addEventListener("click", async () => {
    const txt = b.dataset.copy;
    try { await navigator.clipboard.writeText(txt); }
    catch { const t = document.createElement("textarea"); t.value = txt; document.body.appendChild(t); t.select(); try { document.execCommand("copy"); } catch {} t.remove(); }
    const s = $("small", b), old = s.textContent;
    b.classList.add("copied"); s.textContent = "✓ Copiado"; toast("Copiado al portapapeles");
    setTimeout(() => { b.classList.remove("copied"); s.textContent = old; }, 1600);
  }));

  /* 18 · sedes */
  (() => {
    const CITIES = [
      { city: "Jujuy", host: "Franco Durán (jujuy.dev)", x: 51.8, y: 11.5, me: true },
      { city: "Salta", host: "Artu Grande y Fermín Rodriguez", x: 48.6, y: 13.9 },
      { city: "Córdoba", host: "Joaquín Giorgis", x: 47.2, y: 39.8 },
      { city: "Rosario", host: "Alejandro Repetto", x: 53.9, y: 49.7 },
      { city: "Buenos Aires", host: "Artu Grande y Fermín Rodriguez", x: 61.5, y: 59.2 },
      { city: "Mar del Plata", host: "Matías Celiz", x: 61.6, y: 70.6 },
    ];
    const map = $("#sedes-map"), list = $("#cities"), pins = [], pills = [];
    const select = (i) => {
      const c = CITIES[i];
      $("#venue-label").textContent = c.me ? "Tu sede" : "Sede";
      $("#venue-city").textContent = c.city; $("#venue-host").textContent = c.host;
      pins.forEach((p, k) => p.classList.toggle("sel", k === i));
      pills.forEach((p, k) => p.classList.toggle("on", k === i));
    };
    CITIES.forEach((c, i) => {
      const p = document.createElement("button");
      p.className = "pin"; p.style.cssText = `left:${c.x}%;top:${c.y}%;--d:${i * 0.35}s`; p.setAttribute("aria-label", c.city); p.onclick = () => select(i);
      map.appendChild(p); pins.push(p);
      const b = document.createElement("button");
      b.className = "pill"; b.textContent = c.city; b.onclick = () => select(i);
      list.appendChild(b); pills.push(b);
    });
    select(0);
  })();

  go(fromHash(), { replace: true });
})();
