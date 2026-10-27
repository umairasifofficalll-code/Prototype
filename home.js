/* ==========================================================================
   Lahore Digital — homepage behaviour
   ========================================================================== */

/* ---- Studio settings: replace the placeholder number before going live ---- */
const STUDIO = {
  whatsapp: '923001234567',        // international format, digits only (placeholder)
  display: '+92 300 1234567',
  name: 'Lahore Digital'
};

const waLink = (text) => `https://wa.me/${STUDIO.whatsapp}?text=${encodeURIComponent(text)}`;
const rs = (n) => 'Rs ' + n.toLocaleString('en-PK');
const $ = (sel, root = document) => root.querySelector(sel);
const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));

/* ---------- Theme ---------- */
(function theme() {
  const root = document.documentElement;
  const btn = $('#themeToggle');
  const sync = () => {
    const isDark = root.getAttribute('data-theme') !== 'light';
    btn.setAttribute('aria-label', isDark ? 'Switch to light theme' : 'Switch to dark theme');
  };
  btn.addEventListener('click', () => {
    const next = root.getAttribute('data-theme') === 'light' ? 'dark' : 'light';
    root.setAttribute('data-theme', next);
    try { localStorage.setItem('ld-theme', next); } catch (e) { /* storage unavailable */ }
    sync();
  });
  sync();
})();

/* ---------- Mobile menu ---------- */
(function mobileMenu() {
  const toggle = $('#menuToggle');
  const nav = $('#mobileNav');
  const set = (open) => {
    nav.hidden = !open;
    toggle.setAttribute('aria-expanded', String(open));
    toggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
  };
  toggle.addEventListener('click', () => set(nav.hidden));
  $$('a', nav).forEach((a) => a.addEventListener('click', () => set(false)));
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && !nav.hidden) { set(false); toggle.focus(); } });
  window.matchMedia('(min-width: 861px)').addEventListener('change', (e) => { if (e.matches) set(false); });
})();

/* ---------- Studio contact details ---------- */
$$('[data-studio-phone]').forEach((el) => { el.textContent = STUDIO.display; });
$('#directWhatsApp').href = waLink(`Hello ${STUDIO.name}, I'd like to talk about a website for my business.`);

/* ---------- Lahore clock & year ---------- */
(function clock() {
  const el = $('#lahoreClock');
  let fmt;
  try {
    fmt = new Intl.DateTimeFormat('en-GB', { timeZone: 'Asia/Karachi', hour: '2-digit', minute: '2-digit', hour12: true });
  } catch (e) { return; }
  const tick = () => { el.textContent = fmt.format(new Date()).toUpperCase(); };
  tick();
  setInterval(tick, 15000);
  $('#year').textContent = new Date().getFullYear();
})();

/* ---------- Reveal on scroll ---------- */
(function reveal() {
  const items = $$('.reveal');
  if (!('IntersectionObserver' in window)) { items.forEach((el) => el.classList.add('is-visible')); return; }
  const io = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) { entry.target.classList.add('is-visible'); io.unobserve(entry.target); }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
  items.forEach((el) => io.observe(el));
})();

/* ==========================================================================
   Interactive demos
   Each demo renders controls into the dialog, keeps its own state, and
   rebuilds a WhatsApp message preview whenever something changes.
   ========================================================================== */

const dialog = $('#demoDialog');
const body = $('#demoBody');
const actions = $('#demoActions');

function preview(sender) {
  return `
    <div>
      <span class="demo-label">WhatsApp message preview</span>
      <div class="preview">
        <div class="preview-head"><i aria-hidden="true">${sender.charAt(0)}</i>${sender}</div>
        <div class="preview-body"><div class="bubble" id="bubble" aria-live="polite"></div></div>
      </div>
    </div>`;
}

function setMessage(text, ready, emptyText) {
  const bubble = $('#bubble');
  const send = $('#sendWa');
  bubble.textContent = ready ? text : emptyText;
  bubble.classList.toggle('empty', !ready);
  send.href = ready ? waLink(text) : '#';
  send.setAttribute('aria-disabled', String(!ready));
  send.tabIndex = ready ? 0 : -1;
}

function sendButton(label) {
  return `<a class="btn btn--sm wa-btn" id="sendWa" href="#" target="_blank" rel="noopener noreferrer" aria-disabled="true">${label}</a>`;
}

/* ---- Demo 1: restaurant order ---- */
const karahi = {
  category: 'Restaurant · Live menu',
  title: 'Karahi & Co. — build a table order',
  accent: 'var(--amber)',
  items: [
    { id: 'mk-half', name: 'Shinwari Mutton Karahi (Half)', note: 'Charcoal, black pepper, ginger', price: 1850 },
    { id: 'mk-full', name: 'Shinwari Mutton Karahi (Full)', note: 'Serves 3–4', price: 3600 },
    { id: 'ck-full', name: 'Chicken White Karahi (Full)', note: 'Cream, green chilli', price: 2400 },
    { id: 'seekh', name: 'Seekh Kebab (4 pcs)', note: 'Beef, mint chutney', price: 950 },
    { id: 'naan', name: 'Roghani Naan', note: 'Fresh from the tandoor', price: 90 },
    { id: 'raita', name: 'Mint Raita', note: 'Cooling, with cucumber', price: 100 }
  ],
  render(signal) {
    const qty = {};
    body.innerHTML = `
      <div>
        <span class="demo-label">Menu · sample prices</span>
        <div class="menu-list">
          ${this.items.map((it) => `
            <div class="menu-item" data-id="${it.id}">
              <div><b>${it.name}</b><small>${it.note} · <em>${rs(it.price)}</em></small></div>
              <div class="stepper" role="group" aria-label="Quantity of ${it.name}">
                <button type="button" data-step="-1" aria-label="Remove one ${it.name}">−</button>
                <output aria-live="polite">0</output>
                <button type="button" data-step="1" aria-label="Add one ${it.name}">+</button>
              </div>
            </div>`).join('')}
        </div>
      </div>
      <div>
        <span class="demo-label">Spice level</span>
        <div class="chips">
          ${['Mild', 'Medium', 'Lahori hot'].map((s, i) => `<label class="chip"><input type="radio" name="spice" value="${s}" ${i === 1 ? 'checked' : ''}><span>${s}</span></label>`).join('')}
        </div>
      </div>
      <div class="demo-fields">
        <div class="field"><label for="k-mode">Order type</label>
          <select id="k-mode"><option>Dine-in</option><option>Takeaway</option></select></div>
        <div class="field"><label for="k-table">Table number</label>
          <input id="k-table" type="text" inputmode="numeric" value="14" maxlength="4"></div>
      </div>
      <div class="total-bar"><span>Subtotal</span><strong id="k-total">${rs(0)}</strong></div>
      ${preview('Karahi & Co. Kitchen')}`;
    actions.innerHTML = sendButton('Send order on WhatsApp ↗');

    const update = () => {
      let total = 0;
      const lines = [];
      this.items.forEach((it) => {
        const q = qty[it.id] || 0;
        const row = $(`[data-id="${it.id}"]`, body);
        $('output', row).textContent = q;
        row.classList.toggle('has-qty', q > 0);
        if (q) { total += q * it.price; lines.push(`• ${q} × ${it.name} — ${rs(q * it.price)}`); }
      });
      $('#k-total').textContent = rs(total);
      const mode = $('#k-mode').value;
      const tableField = $('#k-table');
      tableField.disabled = mode !== 'Dine-in';
      const spice = $('input[name="spice"]:checked', body).value;
      const where = mode === 'Dine-in' ? `Table ${tableField.value.trim() || '—'}` : 'Takeaway';
      const msg = `New order — Karahi & Co.\n${where}\n\n${lines.join('\n')}\n\nSpice: ${spice}\nSubtotal: ${rs(total)}`;
      setMessage(msg, lines.length > 0, 'Add a dish with + to start your order…');
    };

    body.addEventListener('click', (e) => {
      const b = e.target.closest('[data-step]');
      if (!b) return;
      const id = b.closest('.menu-item').dataset.id;
      qty[id] = Math.max(0, Math.min(20, (qty[id] || 0) + Number(b.dataset.step)));
      update();
    }, { signal });
    body.addEventListener('input', update, { signal });
    body.addEventListener('change', update, { signal });
    update();
  }
};

/* ---- Demo 2: salon booking ---- */
const salon = {
  category: 'Salon · Booking',
  title: 'Ghazal’s Salon — pick a slot',
  accent: 'var(--rose)',
  services: [
    { name: 'Haircut & blow-dry', mins: 60, price: 3500 },
    { name: 'Keratin treatment', mins: 150, price: 18000 },
    { name: 'Hydrating facial', mins: 45, price: 4500 },
    { name: 'Bridal consultation', mins: 60, price: 0 }
  ],
  stylists: ['Any available', 'Ayesha M. (senior)', 'Sana R.', 'Mehwish K.'],
  times: ['11:00 AM', '12:00 PM', '1:30 PM', '3:00 PM', '4:00 PM', '5:30 PM', '7:00 PM'],
  // Deterministic "already booked" pattern so the demo feels real without a server.
  isBooked(dayIdx, stylist, timeIdx) {
    if (stylist === 0) return (dayIdx + timeIdx) % 7 === 3;
    return (dayIdx * 3 + stylist * 5 + timeIdx * 2) % 5 === 0;
  },
  render(signal) {
    const days = [];
    const d = new Date();
    for (let i = 1; days.length < 6; i++) {
      const day = new Date(d.getFullYear(), d.getMonth(), d.getDate() + i);
      if (day.getDay() === 1) continue; // closed Mondays
      days.push(day);
    }
    const dayLabel = (day) => day.toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short' });

    body.innerHTML = `
      <div>
        <span class="demo-label">Treatment · sample prices</span>
        <div class="chips">
          ${this.services.map((s, i) => `<label class="chip"><input type="radio" name="svc" value="${i}" ${i === 0 ? 'checked' : ''}><span>${s.name}<small>${s.mins} min · ${s.price ? rs(s.price) : 'Free'}</small></span></label>`).join('')}
        </div>
      </div>
      <div class="demo-fields">
        <div class="field"><label for="s-stylist">Stylist</label>
          <select id="s-stylist">${this.stylists.map((s, i) => `<option value="${i}">${s}</option>`).join('')}</select></div>
        <div class="field"><label for="s-name">Your name</label>
          <input id="s-name" type="text" placeholder="e.g. Hira" autocomplete="name"></div>
      </div>
      <div>
        <span class="demo-label">Day <span style="text-transform:none;letter-spacing:0">(closed Mondays)</span></span>
        <div class="chips">
          ${days.map((day, i) => `<label class="chip"><input type="radio" name="day" value="${i}" ${i === 0 ? 'checked' : ''}><span>${dayLabel(day)}</span></label>`).join('')}
        </div>
      </div>
      <div>
        <span class="demo-label">Open times</span>
        <div class="chips" id="s-times"></div>
      </div>
      ${preview('Ghazal’s Salon')}`;
    actions.innerHTML = sendButton('Request booking on WhatsApp ↗');

    const renderTimes = () => {
      const dayIdx = Number($('input[name="day"]:checked', body).value);
      const stylist = Number($('#s-stylist').value);
      const prev = $('input[name="time"]:checked', body);
      const prevVal = prev ? prev.value : null;
      $('#s-times').innerHTML = this.times.map((t, i) => {
        const booked = this.isBooked(dayIdx, stylist, i);
        const checked = !booked && t === prevVal ? 'checked' : '';
        return `<label class="chip"><input type="radio" name="time" value="${t}" ${booked ? 'disabled' : ''} ${checked}><span>${t}${booked ? '<small>Booked</small>' : ''}</span></label>`;
      }).join('');
    };

    const update = (e) => {
      if (!e || e.target.name === 'day' || e.target.id === 's-stylist') renderTimes();
      const svc = this.services[Number($('input[name="svc"]:checked', body).value)];
      const stylist = this.stylists[Number($('#s-stylist').value)];
      const day = days[Number($('input[name="day"]:checked', body).value)];
      const time = $('input[name="time"]:checked', body);
      const name = $('#s-name').value.trim();
      const msg = `Booking request — Ghazal’s Salon\n\nTreatment: ${svc.name} (${svc.mins} min)\nStylist: ${stylist}\nWhen: ${day.toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long' })}, ${time ? time.value : ''}${name ? `\nName: ${name}` : ''}\n\nPlease confirm. Thank you!`;
      setMessage(msg, !!time, 'Choose an open time to see your booking message…');
    };

    body.addEventListener('change', update, { signal });
    body.addEventListener('input', (e) => { if (e.target.id === 's-name') update(e); }, { signal });
    update();
  }
};

/* ---- Demo 3: workshop quote / breakdown ---- */
const auto = {
  category: 'Auto workshop · Quote request',
  title: 'Punjab Auto Works — describe the problem',
  accent: 'var(--cyan)',
  makes: ['Suzuki', 'Toyota', 'Honda', 'Kia', 'Hyundai', 'Changan', 'MG', 'Other'],
  issues: ['Check-engine light', 'Won’t start', 'Overheating', 'Brakes / ABS', 'AC not cooling', 'Strange noise', 'Oil change / service'],
  render(signal) {
    let locationUrl = '';
    body.innerHTML = `
      <div class="demo-fields">
        <div class="field"><label for="a-make">Make</label>
          <select id="a-make">${this.makes.map((m) => `<option ${m === 'Toyota' ? 'selected' : ''}>${m}</option>`).join('')}</select></div>
        <div class="field"><label for="a-model">Model &amp; year</label>
          <input id="a-model" type="text" value="Corolla 2019" placeholder="e.g. Civic 2021"></div>
      </div>
      <div>
        <span class="demo-label">What’s wrong? (tick all that apply)</span>
        <div class="chips">
          ${this.issues.map((s, i) => `<label class="chip"><input type="checkbox" name="issue" value="${s}" ${i === 0 ? 'checked' : ''}><span>${s}</span></label>`).join('')}
        </div>
      </div>
      <div>
        <span class="demo-label">How urgent?</span>
        <div class="chips">
          <label class="chip"><input type="radio" name="urgency" value="Broken down — need help now"><span>Broken down now</span></label>
          <label class="chip"><input type="radio" name="urgency" value="Bring it in today" checked><span>Bring in today</span></label>
          <label class="chip"><input type="radio" name="urgency" value="Book for later this week"><span>Later this week</span></label>
        </div>
      </div>
      <div>
        <button class="btn btn--ghost btn--sm" type="button" id="a-loc">📍 Add my location</button>
        <p class="note" id="a-loc-note" style="margin-top:8px">Optional — adds a Google Maps link so the mechanic can find you.</p>
      </div>
      ${preview('Punjab Auto Works')}`;
    actions.innerHTML = `<a class="btn btn--ghost btn--sm" href="tel:+${STUDIO.whatsapp}">Call workshop</a>${sendButton('Send to workshop ↗')}`;

    const update = () => {
      const issues = $$('input[name="issue"]:checked', body).map((i) => i.value);
      const urgency = $('input[name="urgency"]:checked', body).value;
      const car = `${$('#a-make').value} ${$('#a-model').value.trim()}`.trim();
      const msg = `${urgency.startsWith('Broken') ? '🚨 BREAKDOWN — ' : ''}Repair request — Punjab Auto Works\n\nCar: ${car}\nProblem: ${issues.join(', ')}\nUrgency: ${urgency}${locationUrl ? `\nLocation: ${locationUrl}` : ''}\n\nPlease send an estimate.`;
      setMessage(msg, issues.length > 0, 'Tick at least one problem to build your request…');
    };

    $('#a-loc').addEventListener('click', () => {
      const note = $('#a-loc-note');
      if (!navigator.geolocation) { note.textContent = 'Location is not available in this browser.'; return; }
      note.textContent = 'Getting your location…';
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const { latitude, longitude } = pos.coords;
          locationUrl = `https://maps.google.com/?q=${latitude.toFixed(5)},${longitude.toFixed(5)}`;
          note.textContent = 'Location added to the message.';
          update();
        },
        () => { note.textContent = 'Location was not shared — you can describe where you are instead.'; },
        { enableHighAccuracy: true, timeout: 10000 }
      );
    });
    body.addEventListener('input', update, { signal });
    body.addEventListener('change', update, { signal });
    update();
  }
};

const demos = { karahi, salon, auto };
let lastTrigger = null;
let demoListeners = null;

function openDemo(key, trigger) {
  const demo = demos[key];
  if (!demo) return;
  lastTrigger = trigger || null;
  // Drop the previous demo's listeners before rendering a new one.
  if (demoListeners) demoListeners.abort();
  demoListeners = new AbortController();
  dialog.style.setProperty('--accent', demo.accent);
  $('#demoCategory').textContent = demo.category;
  $('#demoTitle').textContent = demo.title;
  demo.render(demoListeners.signal);
  if (typeof dialog.showModal === 'function') dialog.showModal(); else dialog.setAttribute('open', '');
  body.scrollTop = 0;
}

function closeDemo() {
  if (typeof dialog.close === 'function') dialog.close(); else dialog.removeAttribute('open');
}

dialog.addEventListener('close', () => { if (lastTrigger) lastTrigger.focus(); });
dialog.addEventListener('click', (e) => {
  if (e.target === dialog || e.target.closest('[data-close]')) closeDemo();
});
$$('[data-demo]').forEach((btn) => btn.addEventListener('click', () => openDemo(btn.dataset.demo, btn)));

/* ==========================================================================
   Lead form → WhatsApp
   ========================================================================== */
(function leadForm() {
  const form = $('#leadForm');
  const status = $('#formStatus');
  const phoneField = $('#phoneField');
  const normalisePhone = (v) => {
    const digits = v.replace(/\D/g, '');
    if (/^03\d{9}$/.test(digits)) return '+92 ' + digits.slice(1, 4) + ' ' + digits.slice(4);
    if (/^923\d{9}$/.test(digits)) return '+92 ' + digits.slice(2, 5) + ' ' + digits.slice(5);
    if (/^00923\d{9}$/.test(digits)) return '+92 ' + digits.slice(4, 7) + ' ' + digits.slice(7);
    return null;
  };

  $('#phone').addEventListener('input', () => phoneField.classList.remove('invalid'));

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(form).entries());
    const phone = normalisePhone(data.phone || '');
    let firstInvalid = null;

    ['name', 'bizName'].forEach((id) => {
      const input = $('#' + id);
      const empty = !input.value.trim();
      input.setAttribute('aria-invalid', String(empty));
      if (empty && !firstInvalid) firstInvalid = input;
    });
    if (!phone) {
      phoneField.classList.add('invalid');
      $('#phone').setAttribute('aria-invalid', 'true');
      $('#phoneHint').textContent = 'Please enter a Pakistani mobile number, e.g. 0300 1234567';
      if (!firstInvalid) firstInvalid = $('#phone');
    } else {
      $('#phone').setAttribute('aria-invalid', 'false');
      $('#phoneHint').textContent = 'Pakistani mobile, e.g. 0300 1234567';
    }
    if (firstInvalid) {
      status.hidden = false;
      status.textContent = 'Please fill in the highlighted fields.';
      firstInvalid.focus();
      return;
    }

    const text = [
      `Hi ${STUDIO.name}! I'd like a free website review.`,
      '',
      `Name: ${data.name.trim()}`,
      `Business: ${data.business.trim()}`,
      `Area: ${data.area}`,
      `WhatsApp: ${phone}`,
      `Need: ${data.need}`,
      data.link.trim() ? `Current page: ${data.link.trim()}` : null
    ].filter((l) => l !== null).join('\n');

    const url = waLink(text);
    // Open directly inside the submit handler so popup blockers allow it.
    // ('noopener' would make window.open return null even on success, so detach manually.)
    const win = window.open(url, '_blank');
    if (win) { try { win.opener = null; } catch (err) { /* cross-origin */ } }
    status.hidden = false;
    status.innerHTML = win
      ? 'WhatsApp is opening with your details — just press send. ✓'
      : `Your browser blocked the new tab. <a href="${url}" target="_blank" rel="noopener noreferrer">Open WhatsApp</a> to send your details.`;
  });
})();
