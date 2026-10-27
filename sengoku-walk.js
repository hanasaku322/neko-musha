(() => {
  "use strict";
  const TAU = Math.PI * 2;
  const root = "assets/characters/";
  const profiles = {
    ashigaru: { stride:52, file:"ashigaru" },
    shinobi: { stride:60, file:"shinobi" },
    senryoThief: { stride:62, file:"senryo-thief" },
    armored: { stride:72, file:"armored", facesRight:true },
    boss: { stride:100, file:"oni-elite", facesRight:true },
    oniElite: { stride:104, reuse:"oniElite" },
    overlord: { stride:132, reuse:"overlord" }
  };
  const sheets = {};
  let heavySheets = {};
  const clamp = (v,a,b) => Math.max(a,Math.min(b,v));
  const ready = image => image?.complete && image.naturalWidth > 0;
  function load(existing = {}) {
    heavySheets = existing;
    const mobile = typeof navigator !== "undefined" && navigator.maxTouchPoints > 0;
    for (const [type,p] of Object.entries(profiles)) {
      if (!p.file || sheets[type]) continue;
      const image = new Image();
      image.src = `${root}walk-${p.file}-v2${mobile ? "-mobile" : ""}.webp`;
      sheets[type] = image;
    }
  }
  function prepare(enemy) {
    const p = profiles[enemy.type];
    if (!p) return;
    enemy.gaitStride = p.stride;
    if (Math.abs(enemy.vx || 0) > 8) enemy.walkFacing = enemy.vx > 0;
  }
  function pose(enemy, alpha = 1) {
    const p = profiles[enemy.type];
    if (!p) return null;
    const speed = enemy.motionSpeed || 0;
    const distance = Math.max(0,(enemy.marchDistance || 0) - speed / 30 * (1-clamp(alpha,0,1)));
    const phase = distance / p.stride * TAU + (enemy.phase || 0);
    const cycle = (phase / TAU % 1 + 1) % 1;
    const bracing = enemy.windup > 0 || enemy.castTimer > 0 || ["windup","strike","recover","cast"].includes(enemy.heavyState);
    const moving = speed > 3 && !bracing;
    return { phase, moving, frame:moving ? Math.floor(cycle*8) : cycle < .5 ? 0 : 4, stride:p.stride };
  }
  function visual(enemy, alpha = 1) {
    const p = profiles[enemy.type];
    if (!p) return null;
    // Keep the existing dedicated anticipation, attack and casting poses for large enemies.
    if (enemy.heavyState && enemy.heavyState !== "walk") return null;
    const image = p.reuse ? heavySheets[p.reuse] : sheets[enemy.type];
    if (!ready(image)) return null;
    return { image, columns:4, rows:p.reuse ? 4 : 2, index:pose(enemy,alpha).frame,
      baseline:p.reuse ? 476/512 : 240/256, facesRight:!!p.facesRight, facingRight:enemy.walkFacing };
  }
  function applyMotion(ctx,enemy,alpha=1) {
    const gait = pose(enemy,alpha);
    if (!gait) return;
    const foot = enemy.r*1.2;
    ctx.translate(0,foot);
    ctx.scale(1,1-(gait.moving ? Math.abs(Math.sin(gait.phase))*.006 : 0));
    ctx.translate(0,-foot);
  }
  window.SengokuWalk = { load,prepare,pose,visual,applyMotion,profile:type=>profiles[type] };
})();
