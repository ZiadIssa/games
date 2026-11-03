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
  if (reduce) { requestAnimationFrame(() => draw(performance.now()));  }
  else { requestAnimationFrame(loop);  }
})();
