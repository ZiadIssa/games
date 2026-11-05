
const LOGOS = [
  {src:'/assets/4e6457e15d.webp', alt:'Aladdin Video Games', cls:'dark wide'},
  {src:'/assets/e16b0ce784.webp', alt:'Deeb International', cls:'round'},
  {src:'/assets/9edea9ab91.webp', alt:'Cibo Gourmet', cls:''},
  {src:'/assets/0de1370984.webp', alt:'Karanfil', cls:'wide'},
  {src:'/assets/4b45b3513f.webp', alt:'Ferragosto Gelateria', cls:'big'},
  {src:'/assets/f6bbd4cce9.webp', alt:'Flick Mobile', cls:'big'},
  {src:'pest', alt:'Advanced Pest Control', cls:'wide'},
  {src:'/assets/a27834c19e.webp', alt:'Stowarzyszenie Nadzieja Rodzinie', cls:'big'}
];
const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;

/* logo strip */
(function(){
  const pestSvg = '<svg viewBox="185 74 380 438" style="height:100%;width:auto" aria-hidden="true"><path fill="#424242" d="M343 96 C352 78 380 78 389 96 L440.3 234 L395.9 328 L365.6 262.8 L330.6 351.5 L288.8 252.3 Z"/><path fill="#424242" d="M254.9 347.4 L308.1 419.4 L276.8 501.9 L196.4 501.9 Z"/><path fill="#424242" d="M484.6 362 L539.5 501.9 L458.5 501.9 L433.5 434 Z"/><path fill="#96C451" d="M287.8 262.8 L368.2 424.6 L511.8 117.6 L555 234 L368.2 497.8 L259 343.7 Z"/></svg><span style="font-weight:700;letter-spacing:.14em;font-size:22px;margin-left:12px;color:#2A2A2A">ADVANCED</span>';
  const one = LOGOS.map((l,i) => `<div class="lg ${l.cls}" title="${l.alt}">${l.src==='pest' ? pestSvg : `<img src="${l.src}" alt="${l.alt}">`}</div>`).join('');
  const t = document.getElementById('track'); if (!t) return;
  t.innerHTML = one + one;
  [...t.children].forEach((el,i)=>{ if(i>=LOGOS.length){ el.setAttribute('aria-hidden','true'); el.querySelectorAll('img').forEach(im=>im.alt=''); } });
})();

/* nav */
(function(){
  const nav = document.getElementById('nav'), btn = document.getElementById('menu-btn');
  btn.addEventListener('click', () => { const o = nav.classList.toggle('open'); btn.setAttribute('aria-expanded', o); btn.setAttribute('aria-label', o ? 'Close menu' : 'Open menu'); });
  document.querySelectorAll('#menu a').forEach(a => a.addEventListener('click', () => { nav.classList.remove('open'); btn.setAttribute('aria-expanded', false); }));
})();

/* reveals, only for things that start below the first screen */
(function(){
  if (reduce || !('IntersectionObserver' in window)) return;
  const els = document.querySelectorAll('.head, .tile, .svc, .g, .tl-item, .contact h2, .contact p');
  const io = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting){ e.target.classList.remove('pre'); io.unobserve(e.target); } }), {threshold:.15, rootMargin:'0px 0px -40px 0px'});
  els.forEach((el,i) => { if (el.getBoundingClientRect().top > innerHeight){ el.classList.add('pre','reveal'); el.style.transitionDelay = (el.matches('.svc,.g') ? (i%3)*90 : 0)+'ms'; io.observe(el); } });
})();

/* count-up stats */
(function(){
  if (reduce) return;
  const els = document.querySelectorAll('[data-count]');
  const io = new IntersectionObserver(es => es.forEach(e => {
    if (!e.isIntersecting) return; io.unobserve(e.target);
    const el = e.target, end = +el.dataset.count, suf = el.dataset.suffix || '', t0 = performance.now(), dur = 1200;
    const tick = now => { const p = Math.min((now - t0)/dur, 1), v = Math.round(end * (1 - Math.pow(1-p, 3))); el.textContent = (el.dataset.sep ? v.toLocaleString('en-US') : v) + (p === 1 ? suf : ''); if (p < 1) requestAnimationFrame(tick); };
    requestAnimationFrame(tick);
  }), {threshold:.6});
  els.forEach(el => { if (el.getBoundingClientRect().top > innerHeight) io.observe(el); });
})();

/* statement words light up as you scroll */
(function(){
  const p = document.getElementById('statement'); if (!p) return;
  p.innerHTML = p.textContent.trim().split(/\s+/).map(w => `<span class="w">${w}</span>`).join(' ');
  const words = [...p.querySelectorAll('.w')];
  if (reduce){ words.forEach(w=>w.classList.add('on')); return; }
  const upd = () => {
    const r = p.getBoundingClientRect(), start = innerHeight*0.85, end = innerHeight*0.35;
    const prog = Math.min(Math.max((start - r.top) / (start - end + r.height*0.6), 0), 1);
    const n = Math.round(prog * words.length);
    words.forEach((w,i) => w.classList.toggle('on', i < n));
  };
  addEventListener('scroll', () => requestAnimationFrame(upd), {passive:true}); upd();
})();

/* copy email */
(function(){
  const b = document.getElementById('copy-email'), out = document.getElementById('copied'), addr = 'info@donedifferent.net'; if (!b) return;
  b.addEventListener('click', async () => {
    try { await navigator.clipboard.writeText(addr); out.textContent = (window.DD_T||{}).copied || 'Copied'; }
    catch(e){ const r = document.createRange(); r.selectNodeContents(document.getElementById('email-text')); const sel = getSelection(); sel.removeAllRanges(); sel.addRange(r); out.textContent = 'Selected, press Ctrl+C'; }
    setTimeout(() => out.textContent = '', 2500);
  });
})();

/* timeline progress */
(function(){
  const tl = document.getElementById('tl'), fill = document.getElementById('tl-fill'); if (!tl) return; const items = [...tl.querySelectorAll('.tl-item')];
  if (reduce){ fill.style.height = 'calc(100% - 16px)'; items.forEach(i=>i.classList.add('on')); return; }
  const upd = () => {
    const r = tl.getBoundingClientRect(), mid = innerHeight*0.6;
    fill.style.height = Math.min(Math.max(mid - r.top, 0), r.height - 16) + 'px';
    items.forEach(it => it.classList.toggle('on', it.getBoundingClientRect().top + 12 < mid));
  };
  addEventListener('scroll', () => requestAnimationFrame(upd), {passive:true}); addEventListener('resize', upd); upd();
})();
/* ---------- router: #games and #systems are their own pages ---------- */
(function(){
  const PAGES = ['games','systems','sites','aladdin','solved','start'];
  const pages = [...document.querySelectorAll('.page')];
  let current = null;
  const navLinks = [...document.querySelectorAll('#menu a')];
  function show(page){
    pages.forEach(p => { const on = p.dataset.page === page; p.hidden = !on; if (on && current !== page){ p.classList.remove('enter'); void p.offsetWidth; p.classList.add('enter'); } });
    navLinks.forEach(a => a.classList.toggle('active', a.getAttribute('href') === '#' + page));
  }
  function route(){
    const h = location.hash.slice(1);
    const page = PAGES.includes(h) ? h : 'home';
    if (page !== current){ show(page); window.scrollTo(0,0); current = page; document.dispatchEvent(new CustomEvent('pagechange', {detail:page})); }
    if (page === 'home' && h && h !== 'home'){
      const el = document.getElementById(h);
      if (el) requestAnimationFrame(() => el.scrollIntoView({behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth'}));
    }
  }
  addEventListener('hashchange', route);
  route();
  document.querySelectorAll('[data-jump]').forEach(a => a.addEventListener('click', e => {
    e.preventDefault(); const el = document.getElementById(a.dataset.jump); if (el) el.scrollIntoView({behavior:'smooth'});
  }));
})();

/* ---------- animations that run per page ---------- */
(function(){
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  // split headings into words
  document.querySelectorAll('.split, .head h2, .contact h2').forEach(h => {
    if (h.dataset.split) return; h.dataset.split = 1; h.classList.add('split');
    const words = h.textContent.trim().split(/\s+/);
    h.innerHTML = words.map((w,i) => `<span class="wd"><span style="transition-delay:${i*60}ms">${w}</span></span>`).join(' ');
  });
  if (reduce || !('IntersectionObserver' in window)) return;
  const io = new IntersectionObserver(es => es.forEach(e => {
    if (!e.isIntersecting) return;
    const el = e.target; io.unobserve(el);
    el.classList.add('in'); el.classList.remove('pre');
    if (el.classList.contains('sys-art')) playArt(el);
  }), {threshold:.18, rootMargin:'0px 0px -40px 0px'});
  const SEL = '.q-card, .hub-node, .hub-core, .flow-steps li, .tier, .chip, .compare, .enq, .site-card, .cs-card, .cs-step, .cs-stat, .soc, .split, .steps li, .pipe li, .gen, .tool, .lang, .ft, .mg, .sl, .sys-copy, .sys-art, .badge, .jam-lead, .jam-ctas, .sys-nav a';
  const armed = new WeakSet();
  function arm(root){
    root.querySelectorAll(SEL).forEach((el,i) => {
      if (armed.has(el)) return;
      const r = el.getBoundingClientRect(); if (!r.height) return;
      armed.add(el);
      if (r.top < innerHeight*0.92){ el.classList.add('in'); if (el.classList.contains('sys-art')) playArt(el); return; }
      if (el.classList.contains('split')) el.classList.add('arm');
      else if (el.classList.contains('sys-art')) el.classList.add('arm');
      else { el.classList.add('pre','reveal'); el.style.transitionDelay = (i%4)*80 + 'ms'; }
      io.observe(el);
    });
  }
  function playArt(el){
    el.classList.remove('arm');
    el.querySelectorAll('.r-line, .r-total, .d-row').forEach((x,i) => x.style.transitionDelay = (i*140)+'ms');
  }
  document.addEventListener('pagechange', e => requestAnimationFrame(() => arm(document.querySelector(`.page[data-page="${e.detail}"]`))));
  arm(document.querySelector('.page:not([hidden])'));

  // brand logos drift slightly as tiles scroll past
  const brands = [...document.querySelectorAll('.tile .brand')];
  addEventListener('scroll', () => requestAnimationFrame(() => {
    brands.forEach(b => { const r = b.getBoundingClientRect(); if (r.bottom < 0 || r.top > innerHeight) return; const p = (r.top + r.height/2 - innerHeight/2) / innerHeight; b.style.transform = `translateY(${p * -26}px)`; });
  }), {passive:true});

  // a QR code that changes every couple of seconds, like the real one at the counter
  const qr = document.querySelector('.qr');
  if (qr){
    qr.innerHTML = Array.from({length:121}, () => '<i></i>').join('');
    const cells = [...qr.children], fixed = new Set();
    [[0,0],[0,8],[8,0]].forEach(([r0,c0]) => { for (let r=0;r<3;r++) for (let c=0;c<3;c++) fixed.add((r0+r)*11 + c0+c); });
    const shuffle = () => cells.forEach((c,i) => c.classList.toggle('off', !fixed.has(i) && Math.random() < .5));
    shuffle(); setInterval(shuffle, 2200);
  }
})();

/* ---------- beatmap generator visual ---------- */
(function(){
  const c = document.getElementById('gen-canvas'); if (!c) return;
  const ctx = c.getContext('2d'), reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const BPM = 124, BEAT = 60/BPM, LOOP = BEAT*32, STEP = 1/120, N = Math.round(LOOP/STEP);
  // a seeded sample "song": drums on the beat, a singer with phrases
  let seed = 7; const rnd = () => (seed = (seed*16807) % 2147483647) / 2147483647;
  const wave = new Float32Array(N), onset = new Float32Array(N), vocal = new Float32Array(N);
  const phrases = [[1.5,3.4],[4.2,4.9],[5.3,7.6],[8.6,9.2],[9.6,11.8],[12.6,14.9]];
  for (let i=0;i<N;i++){
    const t = i*STEP, bp = (t % BEAT)/BEAT, kick = Math.exp(-bp*9), hat = Math.exp(-(((t+BEAT/2)%BEAT)/BEAT)*14)*.35;
    let v = 0; for (const [a,b] of phrases){ if (t>=a && t<=b){ const x=(t-a)/(b-a); v = Math.max(v, Math.sin(Math.PI*Math.min(1,x*4))*.55 + .35 + Math.sin(t*9)*.08); } }
    vocal[i] = v; wave[i] = Math.min(1, kick*.7 + hat + v*.45 + rnd()*.18);
  }
  const clean = new Float32Array(N); for (let i=0;i<N;i++){ const t=i*STEP, bp=(t%BEAT)/BEAT; clean[i] = Math.exp(-bp*9)*.7 + Math.exp(-(((t+BEAT/2)%BEAT)/BEAT)*14)*.35; }
  let mx = 0; for (let i=1;i<N;i++){ onset[i] = Math.max(0, (clean[i]-clean[i-1])*5 + (vocal[i]-vocal[i-1])*14) + rnd()*.05; mx = Math.max(mx, onset[i]); }
  for (let i=0;i<N;i++) onset[i] = onset[i]/mx*1.8;
  // peaks above a threshold become onsets; vocal weight decides which become notes
  const notes = [], onsets = []; const TH = .55;
  for (let i=2;i<N-2;i++){
    if (onset[i] > TH && onset[i] >= onset[i-1] && onset[i] >= onset[i+1] && onset[i] >= onset[i-2] && onset[i] >= onset[i+2]){
      const t = i*STEP; onsets.push(t);
      const ph = phrases.find(([a,b]) => Math.abs(t-a) < .08);
      if (ph){ const len = ph[1]-ph[0]; notes.push({t, len: len > 1.2 ? len*.8 : 0, lane: notes.length % 3}); }
      else if (vocal[i] > .3 || (Math.round(t/BEAT) % 2 === 0 && rnd() < .6)) notes.push({t, len:0, lane:(notes.length*2) % 3});
    }
  }
  const elOn = document.getElementById('g-on'), elNo = document.getElementById('g-notes'), elHo = document.getElementById('g-holds');
  let W=0,H=0,dpr=1, vis=false, t0=performance.now();
  function size(){ dpr = Math.min(devicePixelRatio||1,2); const r = c.getBoundingClientRect(); W=r.width; H=r.height; c.width=W*dpr; c.height=H*dpr; ctx.setTransform(dpr,0,0,dpr,0,0); }
  size(); addEventListener('resize', size);
  const WIN = 6, PH = .32; // seconds visible, playhead position
  function draw(now){
    const T = reduce ? 6 : ((now - t0)/1000) % LOOP;
    ctx.clearRect(0,0,W,H);
    const tracks = [{y:.04,h:.26},{y:.34,h:.18},{y:.56,h:.16},{y:.76,h:.2}], pad = 14;
    const x = t => { let d = t - T; if (d < -LOOP/2) d += LOOP; if (d > LOOP/2) d -= LOOP; return pad + (PH + d/WIN)*(W-pad*2); };
    // grid: beats
    for (let k=-2;k<WIN/BEAT+2;k++){ const bt = Math.floor((T-PH*WIN)/BEAT+k)*BEAT, X = x(((bt%LOOP)+LOOP)%LOOP); ctx.fillStyle = (Math.round(bt/BEAT)%4===0) ? 'rgba(255,255,255,.08)' : 'rgba(255,255,255,.035)'; ctx.fillRect(X,0,1,H); }
    const val = (arr, t) => arr[Math.floor((((t%LOOP)+LOOP)%LOOP)/STEP) % N];
    const cols = W/2|0;
    // waveform
    let tr = tracks[0], mid = (tr.y+tr.h/2)*H;
    for (let p=0;p<cols;p++){ const px = pad + p*(W-pad*2)/cols, t = T + ((px-pad)/(W-pad*2) - PH)*WIN, a = val(wave,t)*tr.h*H*.5, past = px < pad+PH*(W-pad*2);
      ctx.fillStyle = past ? 'rgba(100,210,255,.95)' : 'rgba(100,210,255,.35)'; ctx.fillRect(px, mid-a, Math.max(1,(W-pad*2)/cols-.6), a*2); }
    // onset strength line + threshold
    tr = tracks[1]; const base = (tr.y+tr.h)*H;
    ctx.strokeStyle = 'rgba(255,214,10,.25)'; ctx.setLineDash([4,5]); ctx.beginPath(); ctx.moveTo(pad, base - TH/2.2*tr.h*H); ctx.lineTo(W-pad, base - TH/2.2*tr.h*H); ctx.stroke(); ctx.setLineDash([]);
    ctx.strokeStyle = '#FFD60A'; ctx.lineWidth = 1.6; ctx.beginPath();
    for (let p=0;p<cols;p++){ const px = pad + p*(W-pad*2)/cols, t = T + ((px-pad)/(W-pad*2) - PH)*WIN, y = base - Math.min(1, val(onset,t)/2.2)*tr.h*H; p ? ctx.lineTo(px,y) : ctx.moveTo(px,y); }
    ctx.stroke(); ctx.lineWidth = 1;
    let onCount = 0;
    onsets.forEach(t => { const X = x(t); if (X < -10 || X > W+10) return; if (X <= pad+PH*(W-pad*2)) onCount++; ctx.fillStyle='#FFD60A'; ctx.beginPath(); ctx.arc(X, base - Math.min(1,onset[Math.round(t/STEP)]/2.2)*tr.h*H, 3.2, 0, 7); ctx.fill(); });
    // vocal energy area
    tr = tracks[2]; const vb = (tr.y+tr.h)*H; const g = ctx.createLinearGradient(0,tr.y*H,0,vb); g.addColorStop(0,'rgba(255,111,196,.55)'); g.addColorStop(1,'rgba(255,111,196,.03)');
    ctx.fillStyle = g; ctx.beginPath(); ctx.moveTo(pad,vb);
    for (let p=0;p<=cols;p++){ const px = pad + p*(W-pad*2)/cols, t = T + ((px-pad)/(W-pad*2) - PH)*WIN; ctx.lineTo(px, vb - val(vocal,t)*tr.h*H); }
    ctx.lineTo(W-pad,vb); ctx.closePath(); ctx.fill();
    // chart lanes
    tr = tracks[3]; const lh = tr.h*H/3;
    for (let l=0;l<3;l++){ ctx.fillStyle = 'rgba(255,255,255,.04)'; ctx.fillRect(pad, tr.y*H + l*lh + 2, W-pad*2, lh-4); }
    let noteCount = 0, holdCount = 0; const phX = pad+PH*(W-pad*2);
    notes.forEach(n => { const X = x(n.t), Y = tr.y*H + n.lane*lh + lh/2; if (X > W+20) return; const w2 = n.len ? Math.max(10, n.len/WIN*(W-pad*2)) : 10;
      if (X + w2 < -20) return; const hit = X <= phX; if (hit){ noteCount++; if (n.len) holdCount++; }
      ctx.fillStyle = n.len ? 'rgba(48,209,88,.35)' : '#30D158'; ctx.beginPath(); ctx.roundRect ? ctx.roundRect(X-5, Y-lh*.32, w2, lh*.64, 5) : ctx.rect(X-5, Y-lh*.32, w2, lh*.64); ctx.fill();
      if (n.len){ ctx.fillStyle='#30D158'; ctx.fillRect(X-5, Y-lh*.32, 4, lh*.64); }
      if (hit && phX - X < 14){ ctx.strokeStyle='rgba(255,255,255,.8)'; ctx.lineWidth=2; ctx.beginPath(); ctx.arc(phX, Y, 12 + (phX-X), 0, 7); ctx.stroke(); ctx.lineWidth=1; }
    });
    // playhead
    ctx.fillStyle = 'rgba(255,255,255,.9)'; ctx.fillRect(phX-1, 0, 2, H);
    ctx.fillStyle = 'rgba(255,255,255,.06)'; ctx.fillRect(pad, 0, phX-pad, H);
    // labels
    ctx.font = '600 11px -apple-system, Inter, sans-serif'; ctx.fillStyle = 'rgba(255,255,255,.55)';
    [['WAVEFORM',0],['ONSETS',1],['VOCAL',2],['CHART',3]].forEach(([s,k]) => ctx.fillText(s, pad+6, tracks[k].y*H + 13));
    // counters: what has passed the playhead in this loop
    const totalOn = onsets.filter(t => t <= T).length, totalNo = notes.filter(n => n.t <= T).length, totalHo = notes.filter(n => n.len && n.t <= T).length;
    elOn.textContent = totalOn; elNo.textContent = totalNo; elHo.textContent = totalHo;
  }
  new IntersectionObserver(es => vis = es[0].isIntersecting).observe(c);
  const loop = now => { if (vis) draw(now); requestAnimationFrame(loop); };
  if (reduce) { requestAnimationFrame(() => draw(performance.now())); document.addEventListener('pagechange', () => requestAnimationFrame(() => { size(); draw(performance.now()); })); }
  else { requestAnimationFrame(loop); document.addEventListener('pagechange', () => requestAnimationFrame(size)); }
})();

/* ---------- floating nav: indicator, scroll spy, hide on scroll, mobile sheet ---------- */
(function(){
  const nav = document.getElementById('nav'), ul = document.getElementById('menu');
  const oldBtn = document.getElementById('menu-btn'), btn = oldBtn.cloneNode(true); oldBtn.replaceWith(btn); // drop the old handler
  const links = [...ul.querySelectorAll('a:not(.pill)')];
  ul.querySelector('a.pill')?.parentElement.classList.add('cta');
  const ind = document.createElement('li'); ind.className = 'nav-ind'; ind.setAttribute('aria-hidden','true'); ul.prepend(ind);
  const prog = document.createElement('span'); prog.className = 'nav-prog'; nav.appendChild(prog);
  // mobile sheet built from the same links
  const sheet = document.createElement('div'); sheet.className = 'sheet'; sheet.id = 'sheet';
  sheet.innerHTML = `<nav aria-label="Menu">${links.map((a,i) => `<a href="${a.getAttribute('href')}" style="transition-delay:${80+i*60}ms">${a.textContent}</a>`).join('')}</nav>
    <div class="sheet-foot"><a class="pill" href="#start">${(window.DD_T||{}).getin||'Get in touch'}</a><small>info@donedifferent.net</small></div>`;
  document.body.appendChild(sheet);
  const sheetLinks = [...sheet.querySelectorAll('nav a')];
  const setOpen = o => { nav.classList.toggle('open', o); sheet.classList.toggle('open', o); document.body.classList.toggle('locked', o); btn.setAttribute('aria-expanded', o); btn.setAttribute('aria-label', o ? 'Close menu' : 'Open menu'); if (o) nav.classList.remove('away'); };
  btn.addEventListener('click', () => setOpen(!sheet.classList.contains('open')));
  sheet.querySelectorAll('a').forEach(a => a.addEventListener('click', () => setOpen(false)));
  addEventListener('keydown', e => { if (e.key === 'Escape') setOpen(false); });

  let active = null;
  function moveTo(a){ if (!a){ ind.style.opacity = 0; return; } const r = a.getBoundingClientRect(), ur = ul.getBoundingClientRect(); ind.style.left = (r.left - ur.left) + 'px'; ind.style.width = r.width + 'px'; ind.style.opacity = 1; }
  function setActive(href){
    active = links.find(a => a.getAttribute('href') === href) || null;
    links.forEach(a => a.classList.toggle('active', a === active));
    sheetLinks.forEach(a => a.classList.toggle('active', a.getAttribute('href') === href));
    moveTo(active);
  }
  links.forEach(a => { a.addEventListener('mouseenter', () => moveTo(a)); });
  ul.addEventListener('mouseleave', () => moveTo(active));
  const page = () => document.querySelector('.page:not([hidden])')?.dataset.page || 'home';
  function spy(){
    const p = page();
    if (p !== 'home'){ setActive('#' + p); return; }
    const mid = innerHeight * 0.4; let hit = null;
    (window.DD_SPY || [['work','#work'],['services','#systems'],['jam','#games'],['journey','#journey']]).forEach(([id,href]) => { const el = document.getElementById(id); if (!el) return; const r = el.getBoundingClientRect(); if (r.top < mid && r.bottom > mid) hit = href; });
    setActive(hit);
  }
  let lastY = scrollY, ticking = false;
  addEventListener('scroll', () => { if (ticking) return; ticking = true; requestAnimationFrame(() => {
    const y = scrollY, max = document.documentElement.scrollHeight - innerHeight;
    nav.classList.toggle('scrolled', y > 24);
    const d = y - lastY;
    if (y < 320 || d < -6) { nav.classList.remove('away'); lastY = y; }
    else if (d > 6) { if (!sheet.classList.contains('open')) nav.classList.add('away'); lastY = y; } nav.style.setProperty('--p', max > 0 ? (y / max).toFixed(4) : 0);
    spy(); ticking = false;
  }); }, {passive:true});
  addEventListener('resize', () => moveTo(active));
  nav.addEventListener('transitionend', e => { if (e.propertyName === 'width') moveTo(active); });
  document.addEventListener('pagechange', () => requestAnimationFrame(() => { nav.classList.remove('away'); spy(); }));
  setTimeout(spy, 50);
})();

/* play game clips only while on screen */
(() => {
  const vids = document.querySelectorAll('.mg-vid'); if (!vids.length) return;
  const io = new IntersectionObserver(es => es.forEach(e => { const v = e.target; if (e.isIntersecting) { const p = v.play(); if (p) p.catch(() => {}); } else v.pause(); }), { threshold: .25 });
  vids.forEach(v => io.observe(v));
})();

/* ---------- hero: rotating line ---------- */
(() => {
  const box = document.getElementById('rot'); if (!box) return;
  const WORDS = (window.DD_T && DD_T.words) || ['real businesses.', 'online stores.', 'the shop counter.', 'the stockroom.', 'every shift.', 'games, too.'];
  const BYWORD = document.documentElement.lang === 'ar';
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const GRAD = 'linear-gradient(90deg,#0071E3,#7A5AF8 45%,#FF6B3D)';
  function make(text){
    const w = document.createElement('span'); w.className = 'rot-w js';
    w.innerHTML = BYWORD ? text.split(' ').map((c,i) => `<span class="ch" style="animation-delay:${i*90}ms">${c}</span>`).join('<span class="ch sp">&nbsp;</span>') : [...text].map((c,i) => `<span class="ch${c === ' ' ? ' sp' : ''}" style="animation-delay:${i*26}ms">${c === ' ' ? '&nbsp;' : c}</span>`).join('');
    box.appendChild(w);
    // one continuous gradient across the whole word
    const W = w.offsetWidth, L = w.getBoundingClientRect().left;
    w.querySelectorAll('.ch').forEach(ch => { ch.style.backgroundImage = GRAD; ch.style.backgroundSize = W + 'px 100%'; ch.style.backgroundPosition = (L - ch.getBoundingClientRect().left) + 'px 0'; });
    return w;
  }
  box.innerHTML = '';
  let i = 0, cur = make(WORDS[0]);
  cur.classList.add('in');
  if (reduce) return;
  const next = () => {
    if (document.hidden) return;
    const old = cur; old.classList.remove('in'); old.classList.add('out');
    [...old.children].forEach((c,k) => c.style.animationDelay = (k*14) + 'ms');
    setTimeout(() => old.remove(), 900);
    i = (i + 1) % WORDS.length;
    setTimeout(() => { cur = make(WORDS[i]); cur.classList.add('in'); }, 260);
  };
  setTimeout(() => setInterval(next, 2800), 1400);
  addEventListener('resize', () => { const t = WORDS[i]; cur.remove(); cur = make(t); });
})();

/* ---------- live sites page ---------- */
(() => {
  const grid = document.getElementById('sites-grid'); if (!grid) return;
  const seg = document.querySelector('.seg');
  const VIEWS = { desktop: [1440, 900], phone: [390, 780] };
  const cards = [...grid.querySelectorAll('.site-card[data-url]')];
  const fit = () => cards.forEach(c => {
    const f = c.querySelector('iframe'); if (!f) return;
    const [w, h] = VIEWS[grid.dataset.view], s = c.querySelector('.screen').clientWidth / w;
    f.style.width = w + 'px'; f.style.height = h + 'px'; f.style.transform = `scale(${s})`;
  });
  const load = c => {
    if (c.querySelector('iframe')) return;
    const scr = c.querySelector('.screen'), f = document.createElement('iframe');
    f.title = c.querySelector('h3').textContent + ' live preview';
    f.loading = 'lazy'; f.referrerPolicy = 'strict-origin-when-cross-origin';
    f.setAttribute('sandbox', 'allow-scripts allow-same-origin allow-forms');
    f.addEventListener('load', () => { f.classList.add('ready'); scr.classList.add('loaded'); });
    f.src = c.dataset.url; scr.prepend(f); fit();
  };
  const io = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting){ io.unobserve(e.target); load(e.target); } }), { rootMargin: '200px 0px' });
  document.addEventListener('pagechange', e => { if (e.detail === 'sites') requestAnimationFrame(() => { cards.forEach(c => io.observe(c)); fit(); }); });
  if (location.hash === '#sites') cards.forEach(c => io.observe(c));
  // click to explore, leave to release the page scroll
  cards.forEach(c => { const scr = c.querySelector('.screen');
    scr.addEventListener('click', () => { if (scr.classList.contains('loaded')) scr.classList.add('live'); });
    c.addEventListener('mouseleave', () => scr.classList.remove('live'));
  });
  seg.querySelectorAll('button').forEach(b => b.addEventListener('click', () => {
    const v = b.dataset.view; if (grid.dataset.view === v) return;
    seg.querySelectorAll('button').forEach(x => x.setAttribute('aria-selected', x === b));
    seg.classList.toggle('is-phone', v === 'phone');
    grid.style.opacity = 0;
    setTimeout(() => { grid.dataset.view = v; cards.forEach(c => c.querySelector('.screen').classList.remove('live')); fit(); grid.style.opacity = 1; }, 220);
  }));
  grid.style.transition = 'opacity .22s';
  new ResizeObserver(fit).observe(grid);
})();

/* ---------- case study counters ---------- */
(() => {
  const run = () => document.querySelectorAll('.cs-stat b[data-count]').forEach(el => {
    const end = +el.dataset.count, suf = el.dataset.suffix || '', t0 = performance.now();
    const tick = now => { const p = Math.min((now - t0) / 1300, 1); el.textContent = Math.round(end * (1 - Math.pow(1 - p, 3))) + (p === 1 ? suf : ''); if (p < 1) requestAnimationFrame(tick); };
    requestAnimationFrame(tick);
  });
  document.addEventListener('pagechange', e => { if (e.detail === 'aladdin') setTimeout(run, 300); });
  if (location.hash === '#aladdin') setTimeout(run, 300);
})();

document.querySelectorAll('.to-top').forEach(a => a.addEventListener('click', e => {
  e.preventDefault();
  if (location.hash && location.hash !== '#home' && ['#games','#systems','#sites','#aladdin','#solved','#start'].includes(location.hash)) location.hash = '#home';
  else scrollTo({top: 0, behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth'});
}));

/* ---------- services: colour follows the cursor ---------- */
document.querySelectorAll('.svc').forEach(c => c.addEventListener('pointermove', e => {
  const r = c.getBoundingClientRect(); c.style.setProperty('--mx', ((e.clientX - r.left) / r.width * 100) + '%'); c.style.setProperty('--my', ((e.clientY - r.top) / r.height * 100) + '%');
}));

/* ---------- selected work: dots for the phone swipe row ---------- */
(() => {
  const g = document.querySelector('.work-grid'), dots = document.getElementById('work-dots'); if (!g || !dots) return;
  const tiles = [...g.children]; dots.innerHTML = tiles.map(() => '<i></i>').join('');
  const ds = [...dots.children];
  const upd = () => { const x = Math.abs(g.scrollLeft), w = tiles[0].offsetWidth + 14; const k = Math.min(tiles.length - 1, Math.round(x / w)); ds.forEach((d,i) => d.classList.toggle('on', i === k)); };
  g.addEventListener('scroll', () => requestAnimationFrame(upd), {passive:true}); upd();
})();

/* ---------- problems page filters ---------- */
(() => {
  const grid = document.getElementById('pb-all'); if (!grid) return;
  const chips = [...document.querySelectorAll('.chips .chip')], cards = [...grid.querySelectorAll('.pb')];
  chips.forEach(c => c.addEventListener('click', () => {
    chips.forEach(x => x.classList.toggle('on', x === c));
    const f = c.dataset.f; let n = 0;
    cards.forEach(p => { const show = f === 'all' || p.dataset.cat === f; p.classList.toggle('hide', !show); p.classList.remove('flip','pre'); if (show){ void p.offsetWidth; p.style.animationDelay = (n++ * 45) + 'ms'; p.classList.add('flip'); } });
  }));
  const run = () => document.querySelectorAll('.solved-stats b[data-n]').forEach(el => { const end = +el.dataset.n, t0 = performance.now(); const t = now => { const p = Math.min((now - t0)/1100, 1); el.textContent = Math.round(end * (1 - Math.pow(1-p, 3))); if (p < 1) requestAnimationFrame(t); }; requestAnimationFrame(t); });
  document.addEventListener('pagechange', e => { if (e.detail === 'solved') setTimeout(run, 250); });
  if (location.hash === '#solved') setTimeout(run, 250);
})();

/* ---------- systems: one sale, everywhere ---------- */
(() => {
  const flow = document.querySelector('.flow'); if (!flow) return;
  const n = flow.querySelector('.fs-n'); let timer = null, on = false;
  const cycle = () => {
    flow.classList.remove('s1','s2','s3'); n.textContent = '3';
    setTimeout(() => flow.classList.add('s1'), 100);
    setTimeout(() => { flow.classList.add('s2'); n.textContent = '2'; }, 1500);
    setTimeout(() => flow.classList.add('s3'), 2700);
  };
  new IntersectionObserver(es => es.forEach(e => {
    if (e.isIntersecting && !on){ on = true; cycle(); timer = setInterval(cycle, 6000); }
    else if (!e.isIntersecting && on){ on = false; clearInterval(timer); }
  }), {threshold:.35}).observe(flow);
})();

/* ---------- packages + enquiry ---------- */
(() => {
  const form = document.getElementById('enq'); if (!form) return;
  const groups = [...form.querySelectorAll('.opts')];
  groups.forEach(g => g.addEventListener('click', e => {
    const b = e.target.closest('.opt'); if (!b) return;
    if (g.classList.contains('multi')) b.classList.toggle('on');
    else g.querySelectorAll('.opt').forEach(x => x.classList.toggle('on', x === b));
  }));
  document.querySelectorAll('.tier-cta').forEach(a => a.addEventListener('click', e => {
    e.preventDefault();
    const v = a.dataset.pick; form.querySelectorAll('[data-name="package"] .opt').forEach(x => x.classList.toggle('on', x.dataset.v === v));
    document.getElementById('enquire').scrollIntoView({behavior:'smooth'});
    setTimeout(() => form.querySelector('input[name="name"]').focus({preventScroll:true}), 700);
  }));
  const msg = document.getElementById('enq-msg');
  form.addEventListener('submit', e => {
    e.preventDefault();
    const f = new FormData(form), get = k => (f.get(k) || '').toString().trim();
    let ok = true;
    ['name','contact'].forEach(k => { const lab = form.querySelector(`[name="${k}"]`).closest('label'); const bad = !get(k); lab.classList.toggle('bad', bad); if (bad) ok = false; });
    if (!ok){ msg.classList.remove('ok'); msg.textContent = 'Please add your name and a way to reach you.'; return; }
    const pkg = form.querySelector('[data-name="package"] .opt.on')?.dataset.v || 'Not chosen';
    const needs = [...form.querySelectorAll('[data-name="needs"] .opt.on')].map(b => b.dataset.v).join(', ') || 'Not chosen';
    const body = `Hi Zeyad,\n\nName: ${get('name')}\nBusiness: ${get('business') || '-'}\nContact: ${get('contact')}\nPackage: ${pkg}\nNeeds: ${needs}\n\n${get('msg')}\n`;
    const subject = `Project enquiry${get('business') ? ' from ' + get('business') : ''}`;
    location.href = `mailto:info@donedifferent.net?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    msg.classList.add('ok'); msg.innerHTML = 'Your email app should open with everything filled in. If it doesn\'t, write to ';
  });
})();

/* ---------- enquiry wizard ---------- */
(() => {
  const wiz = document.getElementById('wiz'); if (!wiz) return;
  const steps = [...wiz.querySelectorAll('.wstep')], labels = [...wiz.querySelectorAll('.wiz-prog li')];
  const next = document.getElementById('wiz-next'), back = document.getElementById('wiz-back'), err = document.getElementById('wiz-err'), fill = document.getElementById('wiz-fill');
  const T = window.DD_T || {};
  const t = (k, d) => T[k] || d;
  let cur = 1;
  const val = name => [...wiz.querySelectorAll(`[data-name="${name}"] .on`)].map(b => b.dataset.v);
  const input = n => (wiz.querySelector(`[name="${n}"]`)?.value || '').trim();
  const sumSet = (k, v) => { const dd = document.querySelector(`#sum [data-s="${k}"]`); if (!dd) return; if (dd.textContent !== v){ dd.textContent = v; dd.classList.remove('pop'); void dd.offsetWidth; dd.classList.add('pop'); } };
  const estimate = () => {
    const n = val('needs'), e = document.getElementById('est');
    if (!n.length){ e.textContent = t('est0','Pick what you need'); return; }
    const sys = ['Point of sale','Store manager (ERP)'].some(x => n.includes(x));
    const big = ['Mobile app','HR and attendance'].some(x => n.includes(x));
    const P = usd => (window.DD_PRICE ? DD_PRICE.fmt(usd) : '$' + usd.toLocaleString('en-US'));
    e.textContent = (big ? t('est3','Complete suite, from {p}').replace('{p}', P(12430)) : sys ? t('est2','Website + POS or ERP, from {p}').replace('{p}', P(2875)) : t('est1','Website, from {p}').replace('{p}', P(1135)));
  };
  const refresh = () => {
    const n = val('needs'); sumSet('needs', n.length ? n.map(x => wiz.querySelector(`.ncard[data-v="${x}"] b`).textContent).join(', ') : t('none','Nothing picked yet'));
    sumSet('business', input('business') || '–');
    const pk = val('package')[0]; sumSet('package', pk ? wiz.querySelector(`[data-name="package"] .opt[data-v="${pk}"]`).textContent : '–');
    const w = val('when')[0]; sumSet('when', w ? wiz.querySelector(`[data-name="when"] .opt[data-v="${w}"]`).textContent : '–');
    estimate();
  };
  wiz.addEventListener('click', e => {
    const c = e.target.closest('.ncard'); if (c){ c.classList.toggle('on'); err.textContent = ''; refresh(); return; }
    const o = e.target.closest('.opt'); if (!o) return; const g = o.parentElement;
    if (g.classList.contains('multi')) o.classList.toggle('on'); else g.querySelectorAll('.opt').forEach(x => x.classList.toggle('on', x === o));
    refresh();
  });
  wiz.addEventListener('input', refresh);
  document.addEventListener('currency', refresh);
  const show = (n, dir) => {
    steps.forEach(s => { s.classList.toggle('on', +s.dataset.step === n); s.classList.toggle('rev', dir < 0); });
    labels.forEach((l,i) => l.classList.toggle('on', i < n));
    fill.style.width = Math.min(n, 4) * 25 + '%';
    back.style.visibility = n > 1 && n < 5 ? 'visible' : 'hidden';
    next.textContent = n === 4 ? t('send','Send enquiry') : t('cont','Continue');
    err.textContent = ''; cur = n;
    if (n > 1) wiz.scrollIntoView({behavior:'smooth', block:'start'});
  };
  const ok = () => {
    if (cur === 1 && !val('needs').length){ err.textContent = t('e1','Pick at least one thing to build.'); return false; }
    if (cur === 4){
      const name = input('name'), email = input('email');
      wiz.querySelector('[name="name"]').closest('label').classList.toggle('bad', !name);
      const goodMail = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email);
      wiz.querySelector('[name="email"]').closest('label').classList.toggle('bad', !goodMail);
      if (!name || !goodMail){ err.textContent = !name ? t('e2','Please add your name.') : t('e3','Please check your email address.'); return false; }
    }
    return true;
  };
  back.addEventListener('click', () => show(cur - 1, -1));
  next.addEventListener('click', () => { if (!ok()) return; if (cur < 4) show(cur + 1, 1); else send(); });
  const PACK = { 'Website': ['Website'], 'Website + POS or ERP': ['Website','Point of sale'], 'Complete business suite': ['Website','Online store','Point of sale','Store manager (ERP)','HR and attendance','Mobile app','Meta ads'] };
  const BUDGET = { 'Website': '$1,500 to $3,000', 'Website + POS or ERP': '$3,000 to $10,000', 'Complete business suite': 'Over $10,000' };
  const picked = document.getElementById('wiz-picked');
  document.querySelectorAll('.tier-cta').forEach(a => a.addEventListener('click', e => {
    e.preventDefault(); const v = a.dataset.pick;
    wiz.querySelectorAll('[data-name="package"] .opt').forEach(x => x.classList.toggle('on', x.dataset.v === v));
    wiz.querySelectorAll('.ncard').forEach(c => c.classList.toggle('on', (PACK[v] || []).includes(c.dataset.v)));
    wiz.querySelectorAll('[data-name="budget"] .opt').forEach(x => x.classList.toggle('on', x.dataset.v === BUDGET[v]));
    if (picked){ picked.querySelector('b').textContent = a.closest('.tier').querySelector('h3').textContent; picked.hidden = false; picked.classList.remove('pop'); void picked.offsetWidth; picked.classList.add('pop'); }
    if (!wiz.classList.contains('finished')) show(1, -1);
    refresh(); document.getElementById('enquire').scrollIntoView({behavior:'smooth'});
  }));
  const LANG = document.documentElement.lang || 'en';
  const collect = () => ({
    name: input('name'), email: input('email'), phone: input('phone') || '-', reply_by: val('reply')[0] || '-',
    business: input('business') || '-', business_type: val('type')[0] || '-', current_website: val('current')[0] || '-', languages: val('langs').join(', ') || '-',
    needs: val('needs').join(', '), package: val('package')[0] || '-', start: val('when')[0] || '-', budget: val('budget')[0] || '-',
    message: input('message') || '-', site_language: LANG,
    currency: (window.DD_PRICE || {}).cur || 'USD', budget_shown: (wiz.querySelector('[data-name="budget"] .opt.on') || {}).textContent || '-'
  });
  const subject = () => `New enquiry${input('business') ? ': ' + input('business') : ''} (${LANG.toUpperCase()})`;
  const plain = d => Object.entries(d).map(([k,v]) => `${k.replace(/_/g,' ')}: ${v}`).join('\n');
  const mailHref = () => `mailto:info@donedifferent.net?subject=${encodeURIComponent(subject())}&body=${encodeURIComponent('Hi Zeyad,\n\n' + plain(collect()))}`;
  // Your Google Apps Script mailer (sends from your Gmail, with the reply). FormSubmit is the backup.
  const MAIL = (window.DD_MAIL || {}).url || '';
  const fail = document.getElementById('wiz-fail');
  const tmo = (ms) => { const c = new AbortController(); setTimeout(() => c.abort(), ms); return c.signal; };
  async function viaScript(d){
    if (!MAIL) return false;
    const first = d.name.split(' ')[0];
    const recap = [...document.querySelectorAll('#sum > div')].map(x => [x.querySelector('dt').textContent, x.querySelector('dd').textContent]);
    const bud = wiz.querySelector('[data-name="budget"] .opt.on'); if (bud) recap.push([t('budgetL','Budget'), bud.textContent]);
    const body = Object.assign({}, d, { title: subject(), recap, recap_title: t('recap','What you sent'), dir: document.documentElement.dir || 'ltr',
      auto_subject: t('autosub', 'We got your enquiry, {n}').replace('{n}', first),
      auto_title: t('thanks','Thanks, {n}. Your enquiry is in.').replace('{n}', first),
      auto_message: t('auto', "Thanks for getting in touch with Done Different. I've got your enquiry and I'll read it myself. Expect a reply soon with a few questions and a time for a short call. Zeyad Issa"),
      _honey: input('_honey') });
    const r = await fetch(MAIL, { method: 'POST', body: JSON.stringify(body), redirect: 'follow', signal: tmo(20000) });
    const j = await r.json().catch(() => ({})); return !!j.ok;
  }
  async function viaFormSubmit(d){
    const r = await fetch('https://formsubmit.co/ajax/info@donedifferent.net', { method:'POST', signal: tmo(15000), headers:{'Content-Type':'application/json', Accept:'application/json'},
      body: JSON.stringify(Object.assign({ _subject: subject(), _template: 'table', _replyto: d.email }, d)) });
    const j = await r.json().catch(() => ({})); return r.ok && String(j.success) !== 'false';
  }
  async function send(){
    if (input('_honey')) return;
    const d = collect();
    try { sessionStorage.setItem('dd-enq', JSON.stringify({ subject: subject(), body: plain(d), sum: [...document.querySelectorAll('#sum dd')].map(x => x.textContent), est: document.getElementById('est').textContent })); } catch(e){}
    wiz.classList.add('sending'); next.textContent = t('sending','Sending…'); if (fail) fail.hidden = true;
    let sent = false, replied = false;
    try { sent = replied = await viaScript(d); } catch(e){}
    if (!sent){ try { sent = await viaFormSubmit(d); } catch(e){} }
    wiz.classList.remove('sending');
    if (sent){ finish(d.name.split(' ')[0], replied); return; }
    next.textContent = t('send','Send enquiry');
    if (fail){ fail.hidden = false; fail.classList.remove('pop'); void fail.offsetWidth; fail.classList.add('pop'); }
  }
  if (fail) fail.querySelector('[data-act="retry"]').addEventListener('click', () => send());
  // email fallback: open the mail app again, or copy everything
  const alt = document.getElementById('wiz-alt');
  if (alt){
    alt.querySelector('[data-act="mail"]').addEventListener('click', () => { const s = (() => { try { return JSON.parse(sessionStorage.getItem('dd-enq') || 'null'); } catch(e){ return null; } })(); location.href = s && !input('name') ? `mailto:info@donedifferent.net?subject=${encodeURIComponent(s.subject)}&body=${encodeURIComponent('Hi Zeyad,\n\n' + s.body)}` : mailHref(); });
    alt.querySelector('[data-act="copy"]').addEventListener('click', async e => {
      const s = (() => { try { return JSON.parse(sessionStorage.getItem('dd-enq') || 'null'); } catch(e){ return null; } })();
      const text = 'To: info@donedifferent.net\n' + (s && !input('name') ? `Subject: ${s.subject}\n\n${s.body}` : `Subject: ${subject()}\n\n${plain(collect())}`);
      try { await navigator.clipboard.writeText(text); e.currentTarget.textContent = t('copied2','Copied. Paste it into any email to info@donedifferent.net'); }
      catch(err){ e.currentTarget.textContent = 'info@donedifferent.net'; }
    });
  }
  function finish(name, replied){
    wiz.classList.add('finished');
    document.getElementById('done-title').textContent = t('thanks','Thanks, {n}. Your enquiry is in.').replace('{n}', name || '').replace(/^(\S+), \./,'$1.').replace(' ,', ',');
    document.getElementById('done-sub').textContent = replied === false ? t('noreply','I\'ll get back to you at the email you gave me.') : t('copy','A confirmation is on its way to your inbox.');
    show(5, 1);
  }
  // coming back from FormSubmit
  const qp = new URLSearchParams(location.search);
  if (qp.get('sent')){
    try { const s = JSON.parse(sessionStorage.getItem('dd-enq') || 'null'); if (s && s.sum){ setTimeout(() => { document.querySelectorAll('#sum dd').forEach((dd,i) => dd.textContent = s.sum[i] || dd.textContent); document.getElementById('est').textContent = s.est; }, 0); } } catch(e){}
    finish(qp.get('n') || '');
    history.replaceState(null, '', location.pathname + location.hash);
    setTimeout(() => document.getElementById('enquire').scrollIntoView({behavior:'smooth'}), 500);
  }
  refresh();
})();

/* ---------- language links keep the current page ---------- */
document.querySelectorAll('[data-lang-link]').forEach(a => a.addEventListener('click', e => { if (location.hash){ e.preventDefault(); location.href = a.getAttribute('href') + location.hash; } }));

/* ---------- language dropdown ---------- */
(() => {
  document.querySelectorAll('.lang-dd').forEach(dd => {
    const btn = dd.querySelector('.lang-btn');
    const set = o => { dd.classList.toggle('open', o); btn.setAttribute('aria-expanded', o); };
    btn.addEventListener('click', e => { e.stopPropagation(); set(!dd.classList.contains('open')); });
    document.addEventListener('click', e => { if (!dd.contains(e.target)) set(false); });
    document.addEventListener('keydown', e => { if (e.key === 'Escape') set(false); });
  });
})();

/* ---------- currency ---------- */
(() => {
  const PEG = { USD: 1, JOD: 0.709, AED: 3.6725 };           // pegged to the dollar
  const FALLBACK = { EUR: 0.87, PLN: 3.70 };                  // used if live rates can't load
  const lang = document.documentElement.lang || 'en';
  const LOC = { en: 'en-US', ar: 'ar-JO-u-nu-latn', pl: 'pl-PL' }[lang] || 'en-US';
  const DEF = { en: 'USD', ar: 'JOD', pl: 'PLN' }[lang] || 'USD';
  const store = { get(k){ try { return localStorage.getItem(k); } catch(e){ return null; } }, set(k,v){ try { localStorage.setItem(k,v); } catch(e){} } };
  let rates = Object.assign({}, PEG, FALLBACK);
  try { const c = JSON.parse(store.get('dd-rates') || 'null'); if (c && Date.now() - c.t < 864e5) Object.assign(rates, c.r); } catch(e){}
  let cur = store.get('dd-cur') || DEF; if (!(cur in rates)) cur = DEF;
  const step = (x, big) => big ? (x < 5000 ? 50 : 500) : (x < 1000 ? 5 : x < 10000 ? 10 : 50);
  const conv = (usd, big) => { const x = usd * rates[cur]; if (cur === 'USD') return usd; const s = step(x, big); return Math.round(x / s) * s; };
  const fmt = v => new Intl.NumberFormat(LOC, { style: 'currency', currency: cur, maximumFractionDigits: 0, minimumFractionDigits: 0 }).format(v);
  const T = window.DD_T || {};
  const B = { under: T.bUnder || 'Under {a}', range: T.bRange || '{a} to {b}', over: T.bOver || 'Over {a}' };
  function paint(anim){
    document.querySelectorAll('.tp[data-usd]').forEach(el => {
      const put = () => { el.textContent = fmt(conv(+el.dataset.usd)); el.classList.remove('swap'); };
      if (anim){ el.classList.add('swap'); setTimeout(put, 180); } else put();
    });
    document.querySelectorAll('.opt[data-usd]').forEach(el => {
      const [a, b] = el.dataset.usd.split('-').map(Number);
      el.textContent = !a ? B.under.replace('{a}', fmt(conv(b, true))) : !b ? B.over.replace('{a}', fmt(conv(a, true))) : B.range.replace('{a}', fmt(conv(a, true))).replace('{b}', fmt(conv(b, true)));
    });
    document.querySelectorAll('.cur-seg button').forEach(b => b.setAttribute('aria-checked', b.dataset.cur === cur));
    document.querySelectorAll('.cur-seg button').forEach(b => b.setAttribute('role', 'radio'));
    window.DD_PRICE = { cur, fmt: usd => fmt(conv(usd)) };
    document.dispatchEvent(new CustomEvent('currency'));
  }
  document.querySelectorAll('.cur-seg button').forEach(b => b.addEventListener('click', () => { cur = b.dataset.cur; store.set('dd-cur', cur); paint(true); }));
  paint(false);
  fetch('https://api.frankfurter.app/latest?from=USD&to=EUR,PLN').then(r => r.ok ? r.json() : null).then(j => {
    if (!j || !j.rates || !j.rates.EUR || !j.rates.PLN) return;
    rates.EUR = j.rates.EUR; rates.PLN = j.rates.PLN; store.set('dd-rates', JSON.stringify({ t: Date.now(), r: { EUR: rates.EUR, PLN: rates.PLN } })); paint(false);
  }).catch(() => {});
})();

