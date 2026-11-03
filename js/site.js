/* JamJam site: sky, nav, reveal, lazy video, living sprites */
(() => {
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const ROOT = document.documentElement.dataset.root || '';
  const SP = window.JJ_SPRITES;

  /* sky */
  const sky = document.createElement('div'); sky.className = 'sky'; sky.setAttribute('aria-hidden', 'true');
  for (let i = 0; i < 6; i++) { const c = document.createElement('i'); c.className = 'cloud'; const w = 220 + Math.random() * 320;
    Object.assign(c.style, { width: w + 'px', height: w * .32 + 'px', top: (4 + Math.random() * 60) + '%', animationDuration: (90 + Math.random() * 90) + 's', animationDelay: (-Math.random() * 180) + 's' }); sky.appendChild(c); }
  if (!reduce) for (let i = 0; i < 16; i++) { const b = document.createElement('i'); b.className = 'bub'; const s = 10 + Math.random() * 46;
    Object.assign(b.style, { width: s + 'px', height: s + 'px', left: Math.random() * 100 + '%', animationDuration: (14 + Math.random() * 22) + 's', animationDelay: (-Math.random() * 30) + 's' });
    b.style.setProperty('--dx', (Math.random() * 80 - 40) + 'px'); sky.appendChild(b); }
  document.body.prepend(sky);

  /* nav */
  const nav = document.querySelector('.nav'), burger = nav.querySelector('.burger');
  burger.addEventListener('click', () => { const o = nav.classList.toggle('open'); burger.setAttribute('aria-expanded', o); });
  let lastY = scrollY;
  addEventListener('scroll', () => { const y = scrollY, d = y - lastY;
    if (y < 200 || d < -6) { nav.classList.remove('away'); lastY = y; }
    else if (d > 6 && !nav.classList.contains('open')) { nav.classList.add('away'); lastY = y; } }, { passive: true });

  /* reveal */
  const rio = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); rio.unobserve(e.target); } }), { threshold: .14 });
  document.querySelectorAll('.rv').forEach(el => reduce ? el.classList.add('in') : rio.observe(el));

  /* videos: load and play only while visible */
  const vio = new IntersectionObserver(es => es.forEach(e => { const v = e.target;
    if (e.isIntersecting) { if (!v.src && v.dataset.src) v.src = v.dataset.src; if (!reduce && !v.dataset.held) v.play().catch(() => {}); }
    else v.pause(); }), { threshold: .2, rootMargin: '120px 0px' });
  document.querySelectorAll('video[data-src]').forEach(v => vio.observe(v));

  /* sprite engine */
  class Sprite {
    constructor(scale = 4, state = 'idle') { this.el = document.createElement('div'); this.el.className = 'sp'; this.scale = scale; this.f = 0; this.t = 0; this.set(state); this.loop(); }
    set(state, once) { if (!SP[state]) return; this.state = state; this.once = once || null; this.f = 0; const m = SP[state], s = this.scale;
      Object.assign(this.el.style, { width: m.w * s + 'px', height: m.h * s + 'px', backgroundImage: `url(${ROOT}sprites/aria-${state}.png)`, backgroundSize: `${m.w * m.frames * s}px ${m.h * s}px` }); this.draw(); }
    draw() { const m = SP[this.state]; this.el.style.backgroundPosition = `${-this.f * m.w * this.scale}px 0`; }
    loop() { const tick = now => { if (now - this.t > SP[this.state].ms) { this.t = now; this.f++;
        if (this.f >= SP[this.state].frames) { if (this.once) { const n = this.once; this.once = null; this.set(n); } else this.f = 0; }
        this.draw(); } requestAnimationFrame(tick); }; if (!reduce) requestAnimationFrame(tick); }
    face(dir) { this.el.style.transform = dir < 0 ? 'scaleX(-1)' : ''; }
  }
  window.JJSprite = Sprite;

  /* Aria walks along the bottom of the screen; click her to flip */
  if (SP && !reduce) {
    const W = document.createElement('div'); W.className = 'walker'; W.setAttribute('role', 'button'); W.setAttribute('tabindex', '0'); W.setAttribute('aria-label', 'Aria. Click for a flip.');
    const sp = new Sprite(innerWidth < 600 ? 2.4 : 3, 'idle'); W.appendChild(sp.el);
    const bub = document.createElement('span'); bub.className = 'bubble'; W.appendChild(bub); document.body.appendChild(W);
    const lines = ['hi!', 'load a song!', 'every song is a level', 'catch the beat', 'wanna race?', 'boss up ahead!', 'coming soon to steam'];
    let x = -200, target = 40, dir = 1, moving = false, last = performance.now(), pause = 0;
    const say = t => { bub.textContent = t; W.classList.add('talk'); clearTimeout(say.k); say.k = setTimeout(() => W.classList.remove('talk'), 2200); };
    const pick = () => { const max = innerWidth - 160; target = 20 + Math.random() * Math.max(80, max); };
    const step = now => { const dt = Math.min(64, now - last) / 1000; last = now;
      if (pause > 0) { pause -= dt; }
      else { const d = target - x;
        if (Math.abs(d) < 4) { if (moving) { moving = false; sp.set('idle'); pause = 3 + Math.random() * 5; if (Math.random() < .5) say(lines[Math.random() * lines.length | 0]); } else pick(); }
        else { if (!moving) { moving = true; sp.set('run'); } dir = Math.sign(d); sp.face(dir); x += dir * Math.min(Math.abs(d), 150 * dt); } }
      W.style.transform = `translateX(${x}px)`; requestAnimationFrame(step); };
    requestAnimationFrame(step);
    const flip = () => { pause = 1.2; moving = false; sp.set('flip', 'idle'); say(['wheee!', 'perfect!', 'combo!'][Math.random() * 3 | 0]); };
    W.addEventListener('click', flip); W.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); flip(); } });
    setTimeout(() => say('hi!'), 1600);
  }

  /* peek: Aria pops up over cards on hover */
  if (SP) document.querySelectorAll('[data-peek]').forEach(card => {
    const clip = document.createElement('div'); clip.className = 'peek-clip'; const p = new Sprite(2.6, 'idle'); p.el.classList.add('peek');
    p.el.style.setProperty('--px', (30 + Math.random() * 45) + '%'); clip.appendChild(p.el); card.appendChild(clip);
    card.addEventListener('mouseenter', () => { p.el.classList.add('up'); p.set('flip', 'idle'); });
    card.addEventListener('mouseleave', () => p.el.classList.remove('up'));
  });

  /* character page: Aria on a stage with state buttons */
  const stage = document.getElementById('aria-stage');
  if (stage && SP) { const a = new Sprite(innerWidth < 600 ? 5 : 6, 'idle'); stage.appendChild(a.el);
    document.querySelectorAll('.states button').forEach(b => b.addEventListener('click', () => {
      document.querySelectorAll('.states button').forEach(x => x.setAttribute('aria-pressed', x === b));
      const s = b.dataset.state; a.set(s, s === 'flip' ? 'idle' : null);
      if (s === 'flip') setTimeout(() => document.querySelectorAll('.states button').forEach(x => x.setAttribute('aria-pressed', x.dataset.state === 'idle')), 600);
    })); }

  /* modes page: tabs + lane demo */
  const tabs = [...document.querySelectorAll('.mode-tabs button')];
  tabs.forEach(t => t.addEventListener('click', () => { tabs.forEach(x => x.setAttribute('aria-selected', x === t)); document.querySelectorAll('.mode-panel').forEach(p => p.hidden = p.id !== t.dataset.panel); }));
  document.querySelectorAll('.lane').forEach((lane, i) => {
    if (SP) { const r = new Sprite(1.9, 'run'); r.el.classList.add('runner'); r.el.style.position = 'absolute'; r.el.style.left = '44px'; r.el.style.bottom = '6px'; lane.appendChild(r.el);
      const notes = lane.querySelectorAll('.note'); const pop = lane.querySelector('.pop'), sc = lane.querySelector('.score'); let score = 0;
      notes.forEach(n => n.addEventListener('animationiteration', () => {
        if (Math.random() < .25) r.set('flip', 'run');
        pop.textContent = Math.random() < .8 ? 'PERFECT' : 'GOOD'; pop.classList.remove('on'); void pop.offsetWidth; pop.classList.add('on');
        if (sc) { score += pop.textContent === 'PERFECT' ? 300 : 100; sc.textContent = score.toLocaleString('en-US'); } })); }
  });

  /* music page: player controls drive the clip */
  const pl = document.querySelector('.player'), pv = document.getElementById('player-video');
  if (pl && pv) {
    const sync = () => pl.classList.toggle('paused', pv.paused);
    pv.addEventListener('play', sync); pv.addEventListener('pause', sync); sync();
    pl.querySelector('[data-a="play"]').addEventListener('click', () => { if (pv.paused) { delete pv.dataset.held; pv.play(); } else { pv.dataset.held = 1; pv.pause(); } });
    pl.querySelector('[data-a="back"]').addEventListener('click', () => pv.currentTime = Math.max(0, pv.currentTime - 3));
    pl.querySelector('[data-a="fwd"]').addEventListener('click', () => pv.currentTime = Math.min(pv.duration || 0, pv.currentTime + 3));
  }
})();
