(() => {
  const stage = document.getElementById('stage');
  const slides = [...stage.querySelectorAll('.slide')];
  const total = slides.length;
  let current = 0;

  /* ───────── Canvas scaling (fixed 1920×1080, letterboxed) ───────── */
  function fit() {
    const s = Math.min(window.innerWidth / 1920, window.innerHeight / 1080);
    stage.style.transform = `scale(${s}) translate(-50%, -50%)`;
  }
  window.addEventListener('resize', fit);
  fit();

  /* ───────── Slide 1 · the eight weeks ───────── */
  const weekStarts = ['Nov 1', 'Nov 8', 'Nov 15', 'Nov 22', 'Nov 29', 'Dec 6', 'Dec 13', 'Dec 20'];
  document.getElementById('weeksRow').innerHTML = weekStarts
    .map((d, i) => `<li style="--i:${i}"><b>Week ${i + 1}</b><span>${d}</span></li>`).join('');
  document.getElementById('statusWeeks').innerHTML = weekStarts
    .map((d, i) => `<li title="Week ${i + 1} · ${d}"></li>`).join('');

  /* ───────── Slide 4 · sample week ───────── */
  const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const START = 7, END = 23;               // visible window: 7:00 – 23:00
  // [day, from, to, type, label, sublabel]
  const blocks = [];
  for (let d = 0; d <= 4; d++) {
    blocks.push(
      [d, 8, 14, 'school', 'School', 'approx. hours'],
      [d, 14, 15, 'rest', 'Break'],
      [d, 15, 19, 'work', 'Nx iD', '4 h'],
      [d, 19, 20, 'rest', 'Dinner'],
      [d, 20, 21.5, 'homework', 'Homework', '1.5 h'],
      [d, 21.5, 23, 'rest', 'Free time'],
    );
  }
  blocks.push(
    [5, 9, 14, 'work', 'Nx iD', '5 h'],
    [5, 14, 16, 'rest', 'Lunch, break'],
    [5, 16, 17.5, 'practice', 'Practice', '1.5 h'],
    [5, 17.5, 23, 'rest', 'Free evening'],
    [6, 10, 11.5, 'practice', 'Practice', '1.5 h'],
    [6, 11.5, 13, 'rest', 'Free time'],
    [6, 13, 16, 'flex', 'Nx iD flex', 'only if needed'],
    [6, 16, 16.75, 'planning', 'Review + plan'],
    [6, 16.75, 23, 'rest', 'Free time'],
  );

  const cal = document.getElementById('cal');
  const GRID_H = 790 - 52, COL_W = (1180 - 72) / 7, HOUR_H = GRID_H / (END - START);
  const fmt = h => `${String(Math.floor(h)).padStart(2, '0')}:${h % 1 ? String(Math.round((h % 1) * 60)).padStart(2, '0') : '00'}`;

  let html = '<div class="hours">';
  for (let h = START; h <= END; h += 2) html += `<span style="top:${(h - START) * HOUR_H}px">${fmt(h)}</span>`;
  html += '</div><div class="grid">';
  html += `<div class="weekend-band" style="left:${5 * COL_W}px;width:${2 * COL_W}px"></div>`;
  for (let h = START; h <= END; h++) html += `<div class="gridline" style="top:${(h - START) * HOUR_H}px"></div>`;
  DAYS.forEach((d, i) => {
    html += `<div class="dayhead" style="left:${i * COL_W}px;width:${COL_W}px;top:-52px">${d}${i >= 5 ? '<small>wknd</small>' : ''}</div>`;
  });
  blocks.forEach(([d, a, b, type, label, sub], i) => {
    const top = (a - START) * HOUR_H + 2, h = (b - a) * HOUR_H - 4;
    const tiny = h < 50 ? ' tiny' : '';
    const showSub = sub && h >= 60;
    html += `<div class="blk ${type}${tiny}" style="--i:${d * 2 + (i % 6)};left:${d * COL_W + 3}px;top:${top}px;width:${COL_W - 6}px;height:${h}px" title="${DAYS[d]} ${fmt(a)}–${fmt(b)} · ${label}">${label}${showSub ? `<small>${sub}</small>` : ''}</div>`;
  });
  html += '</div>';
  cal.innerHTML = html;

  // Totals are computed from the same block data, so the chart and the numbers can't drift apart.
  const sum = t => blocks.filter(b => b[3] === t).reduce((s, b) => s + (b[2] - b[1]), 0);
  const rows = [
    ['School', sum('school'), 'var(--school)', '≈ 30 h'],
    ['Nx iD work', sum('work'), 'var(--work)', `${sum('work')} h + up to ${sum('flex')} flex`],
    ['Homework', sum('homework'), 'var(--avoid)', `${sum('homework')} h`],
    ['Programming practice', sum('practice'), 'var(--skill)', `${sum('practice')} h`],
    ['Review + planning', sum('planning'), 'var(--habit)', '45 min'],
    ['Free time + breaks', sum('rest'), '#D8D4CA', `≈ ${Math.round(sum('rest'))} h`],
  ];
  const max = 35;
  document.getElementById('totals').innerHTML = rows.map(([name, h, color, val], i) => `
    <li style="--i:${i}">
      <span class="lbl"><span class="key" style="background:${color}"></span>${name}</span>
      <span class="val">${val}</span>
      <span class="meter"><span style="--w:${Math.max(1.5, (h / max) * 100)}%;background:${color}"></span></span>
    </li>`).join('');

  /* ───────── Slide 5 · essay breakdown ───────── */
  const TRACK_W = 1500;
  const milestones = [
    [0, 'Brief + outline', 'started within 24 h'],
    [3, 'Research'],
    [6, 'First draft'],
    [10, 'Revise'],
    [13, 'Submit', '1 day early'],
  ];
  document.getElementById('essay').innerHTML =
    `<div class="axis" style="width:${TRACK_W}px"></div><div class="fill" style="--w:${(13 / 14) * TRACK_W}px"></div>` +
    milestones.map(([d, t, e]) =>
      `<div class="ms${d === 0 ? ' first' : ''}" style="left:${(d / 14) * TRACK_W}px;width:200px"><span class="day">Day ${d}</span><span class="pin"></span><b>${t}</b>${e ? `<em>${e}</em>` : ''}</div>`
    ).join('') +
    `<div class="due" style="left:${TRACK_W}px"><span class="day">Day 14</span><span class="tick"></span><b>Deadline</b></div>`;

  /* ───────── Slide 6 · practice-hours illustration ───────── */
  // planned (solid) + make-up (hatched); week 3 shows the missed hours as a ghost outline.
  const weeks = [
    { done: 3 }, { done: 3 }, { done: 1, missed: 2 }, { done: 3, makeup: 1 },
    { done: 3, makeup: 1 }, { done: 3 }, { done: 3 }, { done: 3 },
  ];
  const BH = 560, YMAX = 5, PX = BH / YMAX, PLOT_L = 44, PLOT_W = 850 - PLOT_L;
  const colW = PLOT_W / weeks.length;
  let bars = '';
  for (let y = 0; y <= YMAX; y++) {
    bars += `<div class="bgrid${y === 0 ? ' base' : ''}" style="bottom:${y * PX}px"></div>`;
    bars += `<div class="ylab" style="bottom:${y * PX}px;transform:translateY(50%)">${y}h</div>`;
  }
  bars += `<div class="target" style="bottom:${3 * PX}px"><span>3 h / week pace</span></div>`;
  let running = 0;
  weeks.forEach((w, i) => {
    const h = w.done + (w.makeup || 0);
    running += h;
    const x = PLOT_L + colW * i + colW / 2;
    bars += `<div class="col" style="left:${x - 27}px" title="Week ${i + 1}: ${h} h, running total ${running} h">
      <span class="val">${h}h</span>
      ${w.missed ? `<div class="ghost r" style="--d:10;height:${w.missed * PX - 2}px"></div>` : ''}
      ${w.makeup ? `<div class="bar make" style="--i:${i};--h:${w.makeup * PX - 2}px"></div>` : ''}
      <div class="bar" style="--i:${i};--h:${w.done * PX}px"></div>
    </div>
    <div class="xl" style="left:${x}px"><b>Wk ${i + 1}</b><span>Σ ${running}</span></div>`;
  });
  bars += `<div class="note r" style="--d:12;left:${PLOT_L + colW * 5 + 6}px;top:20px;width:${colW * 3 - 10}px">
      Wk 3: work crunch, only 1 h.<br>Wk 4–5: +1 h each to catch up.</div>`;
  document.getElementById('bars').innerHTML = bars;

  /* ───────── Navigation ───────── */
  const counter = document.getElementById('counter');
  const progressBar = document.getElementById('progressBar');
  const notesPanel = document.getElementById('notesPanel');
  let presenter = null;

  function go(n) {
    n = Math.max(0, Math.min(total - 1, n));
    current = n;
    slides.forEach((s, i) => {
      s.classList.toggle('is-active', i === n);
      s.classList.toggle('is-before', i < n);
      s.setAttribute('aria-hidden', i === n ? 'false' : 'true');
    });
    counter.textContent = `${String(n + 1).padStart(2, '0')} / ${String(total).padStart(2, '0')}`;
    progressBar.style.width = `${((n + 1) / total) * 100}%`;
    history.replaceState(null, '', `#${n + 1}`);
    renderNotes();
    if (presenter && !presenter.closed) presenter.postMessage({ type: 'slide', index: n, total }, '*');
  }
  const next = () => go(current + 1);
  const prev = () => go(current - 1);

  function renderNotes() {
    const n = (window.SPEAKER_NOTES || [])[current];
    if (!n) return;
    document.getElementById('notesTitle').textContent = `${current + 1} · ${n.title}`;
    document.getElementById('notesTime').textContent = `≈ ${n.time}`;
    document.getElementById('notesText').innerHTML = n.text.map(p => `<p>${p}</p>`).join('');
  }

  function toggleFullscreen() {
    if (!document.fullscreenElement) document.documentElement.requestFullscreen?.().catch(() => {});
    else document.exitFullscreen?.();
  }
  function toggleNotes() {
    const open = notesPanel.classList.toggle('open');
    notesPanel.setAttribute('aria-hidden', open ? 'false' : 'true');
  }
  function openPresenter() {
    presenter = window.open('presenter.html', 'presenter', 'width=1100,height=720');
    // presenter.html asks for the current slide once it loads ('ready' message below)
  }

  document.addEventListener('keydown', e => {
    if (e.metaKey || e.ctrlKey || e.altKey) return;
    switch (e.key) {
      case 'ArrowRight': case 'ArrowDown': case 'PageDown': case ' ': case 'Enter':
        e.preventDefault(); next(); break;
      case 'ArrowLeft': case 'ArrowUp': case 'PageUp': case 'Backspace':
        e.preventDefault(); prev(); break;
      case 'Home': go(0); break;
      case 'End': go(total - 1); break;
      case 'f': case 'F': toggleFullscreen(); break;
      case 'n': case 'N': toggleNotes(); break;
      case 'p': case 'P': openPresenter(); break;
      default:
        if (/^[1-9]$/.test(e.key) && +e.key <= total) go(+e.key - 1);
    }
  });

  window.addEventListener('message', e => {
    const m = e.data || {};
    if (m.type === 'ready' && e.source) { presenter = e.source; go(current); }
    if (m.type === 'next') next();
    if (m.type === 'prev') prev();
  });

  document.getElementById('nextBtn').onclick = next;
  document.getElementById('prevBtn').onclick = prev;
  document.getElementById('fsBtn').onclick = toggleFullscreen;
  document.getElementById('notesBtn').onclick = toggleNotes;
  document.querySelectorAll('.controls button').forEach(b => b.addEventListener('keydown', e => {
    if (e.key === ' ' || e.key === 'Enter') e.stopPropagation(); // let focused buttons act normally
  }));

  // Touch swipe
  let tx = null;
  window.addEventListener('touchstart', e => { tx = e.touches[0].clientX; }, { passive: true });
  window.addEventListener('touchend', e => {
    if (tx === null) return;
    const dx = e.changedTouches[0].clientX - tx;
    if (Math.abs(dx) > 50) (dx < 0 ? next : prev)();
    tx = null;
  });

  // Hide cursor + controls when idle
  let idleT;
  const wake = () => {
    document.body.classList.remove('idle');
    clearTimeout(idleT);
    idleT = setTimeout(() => document.body.classList.add('idle'), 2500);
  };
  window.addEventListener('mousemove', wake);
  wake();

  const start = parseInt(location.hash.slice(1), 10);
  // Two frames so the first slide's entrance animation actually plays.
  requestAnimationFrame(() => requestAnimationFrame(() => go(Number.isFinite(start) ? start - 1 : 0)));
})();
