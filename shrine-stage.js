(() => {
  const TAU = Math.PI * 2;
  const root = "assets/shrine/";
  const roster = {
    wraith: { id: "shikigami", name: "破れ式神", line: "この札の恨み、受けてみろ。", desc: "破れた札に宿る妖。群れを成して境内を漂う。", color: "#eee0bc" },
    ashigaru: { id: "kappa", name: "槍河童", line: "雨の境内は、俺たちのものだ！", desc: "竹槍を携えた河童。横へ回り込みながら距離を詰める。", color: "#8abd75" },
    tengu: { id: "lantern", name: "化け提灯", line: "足元ばかり見ていると、食べちまうぞ。", desc: "雨の中を跳ねる一つ目の提灯。揺れながら素早く迫る。", color: "#ed7251" },
    shinobi: { id: "kamaitachi", name: "鎌鼬", line: "風より速く、斬れるか？", desc: "白い毛並みの鎌使い。接近すると一気に飛び込む。", color: "#dce8e8" },
    armored: { id: "stone", name: "苔岩入道", line: "幾百年の石を、その刀で割るつもりか。", desc: "苔むす石が動き出した妖。重い体と高い耐久力を持つ。", color: "#aab795" },
    oniElite: { id: "monk", name: "雷法師", line: "空の怒りを、ここへ落とそう。", desc: "雷を呼ぶ修行僧。足元に刻まれる落雷の予兆に注意。", color: "#77d8cb" },
    boss: { id: "guardian", name: "古社の荒守", line: "ここより先、踏み込むことは許さぬ。", desc: "大槌を振るう古社の守護者。重い足取りで追い詰める。", color: "#d5af65" },
    overlord: { id: "raijin", name: "天鼓の雷神", line: "天鼓が鳴る。逃げ場は見つけたか。", desc: "古社の雷雨を操る主。三つの雷印を結び、大地を撃つ。", color: "#ffe492" },
    senryoThief: { id: "magpie", name: "小判さらい", line: "光るものは、全部いただき！", desc: "小判袋を抱えた盗賊。すばしこく逃げるが、倒せば両を落とす。", color: "#ffca5a" }
  };
  for (const def of Object.values(roster)) def.src = `${root}${def.id}.webp`;
  const images = {};
  const walkSheets = {};
  const walkStrides = { ashigaru:54, tengu:48, shinobi:72, armored:64, boss:100, oniElite:88, senryoThief:50 };
  let terrain = null;
  let pattern = null;
  let lanterns = [];
  let strikes = [];
  let stormTimer = 7;
  let nextMonkStrike = 0;
  let protectedNow = false;

  function load() {
    if (terrain) return;
    terrain = new Image();
    terrain.onload = () => { pattern = null; floorVersion++; };
    terrain.src = `${root}terrain-storm.webp`;
    for (const [type, def] of Object.entries(roster)) {
      images[type] = new Image();
      images[type].src = def.src;
    }
    const mobile = typeof navigator !== "undefined" && navigator.maxTouchPoints > 0;
    for (const type of Object.keys(walkStrides)) {
      const image = new Image();
      image.src = `${root}walk-${roster[type].id}-v2${mobile ? "-mobile" : ""}.webp`;
      walkSheets[type] = image;
    }
    for (const name of ["torii", "stone-lantern"]) {
      images[name] = new Image();
      images[name].src = `${root}${name}.webp`;
    }
  }

  function reset() {
    strikes = [];
    stormTimer = 7;
    nextMonkStrike = 0;
    protectedNow = false;
    clock = 0;
    // Fixed count across the larger map; lamps are traversable, with no collision mesh.
    lanterns = [
      [210, 100], [-530, -240], [610, -460], [-1020, 650], [1250, 580],
      [-1960, -880], [2050, -1050], [-2850, 1240], [2930, 1270], [0, -1660], [150, 1650]
    ].map(([x, y]) => ({ x, y, active: 0, cooldown: 0, kind: "shrineProp", type: "lamp", r: 0 }));
  }

  function queueStrike(x, y, elapsed, radius = 78) {
    if (strikes.length >= 3) return;
    const bolt = Array.from({length:11}, (_,i) => [i===10?0:(Math.sin((x+y)*.1+i*4.7)*19+(10-i)*1.6),-420+i*42]);
    strikes.push({ bolt, x, y, r: radius, age: 0, warn: 1.6, fired: false, damage: 12 + Math.min(8, Math.floor(elapsed / 90)) });
  }

  function summonStorm(player, elapsed, count = 3) {
    for (let i = 0; i < count; i++) {
      const angle = i * TAU / count + elapsed * 0.13;
      const distance = i === 0 ? 0 : 135;
      queueStrike(player.x + Math.cos(angle) * distance, player.y + Math.sin(angle) * distance, elapsed, 80);
    }
  }

  function enemyAction(enemy, player, elapsed) {
    if (walkStrides[enemy.type]) enemy.gaitStride = walkStrides[enemy.type];
    if (Math.abs(enemy.vx || 0) > 8) enemy.shrineFacing = enemy.vx > 0;
    if (enemy.type !== "oniElite" || elapsed < nextMonkStrike) return;
    const dx = enemy.x - player.x;
    const dy = enemy.y - player.y;
    if (dx * dx + dy * dy > 700 * 700) return;
    queueStrike(player.x, player.y, elapsed, 70);
    nextMonkStrike = elapsed + 7;
  }

  function update(dt, api) {
    const { player, elapsed, enemies } = api;
    clock += dt;
    protectedNow = false;
    for (const lamp of lanterns) {
      lamp.active = Math.max(0, lamp.active - dt);
      lamp.cooldown = Math.max(0, lamp.cooldown - dt);
      const distance = (player.x - lamp.x) ** 2 + (player.y - lamp.y) ** 2;
      if (!lamp.cooldown && distance < 65 ** 2) {
        lamp.active = 8;
        lamp.cooldown = 38;
        api.announce("石灯籠の結界が灯った");
      }
      if (lamp.active && distance < 155 ** 2) protectedNow = true;
    }
    stormTimer -= dt;
    if (stormTimer <= 0) {
      summonStorm(player, elapsed, elapsed < 180 ? 1 : elapsed < 420 ? 2 : 3);
      stormTimer = elapsed < 180 ? 9 : 7;
    }
    for (let i = strikes.length - 1; i >= 0; i--) {
      const strike = strikes[i];
      strike.age += dt;
      if (!strike.fired && strike.age >= strike.warn) {
        strike.fired = true;
        const hitPlayer = (player.x - strike.x) ** 2 + (player.y - strike.y) ** 2 < (strike.r + player.r * 0.6) ** 2;
        if (hitPlayer && !protectedNow) {
          api.hurt(strike.damage);
          if (!api.playing()) return;
        }
        // Lightning can be lured onto enemies, once per strike rather than every frame.
        for (const enemy of [...enemies]) {
          if ((enemy.x - strike.x) ** 2 + (enemy.y - strike.y) ** 2 < (strike.r + enemy.r) ** 2) {
            api.damageEnemy(enemy, 45 + elapsed * 0.12);
            if (!api.playing()) return;
          }
        }
      }
      if (strike.age > strike.warn + 0.38) strikes.splice(i, 1);
    }
  }

  // Static floor and lighting are baked in a bounded viewport cache, never a map-sized canvas.
  let floorCache = null, floorVersion = 0, clock = 0, groundBuilds = 0;
  const gates = [[0,-70],[0,-1250],[-1750,370],[1780,380]].map(([x,y])=>({kind:"shrineProp",type:"torii",x,y,r:0}));
  const clamp = (v,a,b)=>Math.max(a,Math.min(b,v));
  const inView = (p,v,m=180)=>p.x>=v.x-m&&p.x<=v.x+v.w+m&&p.y>=v.y-m&&p.y<=v.y+v.h+m;
  const ready = im=>im?.complete&&im.naturalWidth;
  const noise = (x,y=0)=>{const n=Math.sin(x*12.9898+y*78.233)*43758.5453;return n-Math.floor(n);};
  const cached = new Map();
  function sprite(key,size,paint) {
    if(cached.has(key))return cached.get(key);
    const c=document.createElement("canvas");c.width=c.height=size;
    paint(c.getContext("2d"),size);cached.set(key,c);return c;
  }
  function glow(ctx,x,y,r,color,alpha) {
    const image=sprite("glow-"+color,128,(g,s)=>{
      const grad=g.createRadialGradient(s/2,s/2,0,s/2,s/2,s/2);
      grad.addColorStop(0,color);grad.addColorStop(.15,color);grad.addColorStop(1,"rgba(0,0,0,0)");
      g.fillStyle=grad;g.fillRect(0,0,s,s);
    });
    ctx.save();ctx.globalAlpha*=alpha;ctx.drawImage(image,x-r,y-r,r*2,r*2);ctx.restore();
  }
  function paintFloor(g,area,map) {
    g.save();g.beginPath();g.rect(map.x,map.y,map.w,map.h);g.clip();
    if(!pattern&&ready(terrain))pattern=g.createPattern(terrain,"repeat");
    g.save();g.scale(.58,.58);g.fillStyle=pattern||"#343e42";g.fillRect(area.x/.58,area.y/.58,area.w/.58,area.h/.58);g.restore();
    g.fillStyle="rgba(12,26,35,.18)";g.fillRect(area.x,area.y,area.w,area.h);
    // Subdued approach stones create a continuous route instead of repeated emblems.
    if(area.x<172&&area.x+area.w>-172) {
      g.fillStyle="rgba(136,146,140,.075)";g.fillRect(-162,area.y,324,area.h);
      g.strokeStyle="rgba(14,23,28,.44)";g.lineWidth=3;
      g.beginPath();g.moveTo(-164,area.y);g.lineTo(-164,area.y+area.h);g.moveTo(164,area.y);g.lineTo(164,area.y+area.h);g.stroke();
      g.lineWidth=1;g.strokeStyle="rgba(173,185,178,.12)";g.beginPath();
      for(let row=Math.floor(area.y/118);row<Math.ceil((area.y+area.h)/118);row++){
        const y=row*118,offset=(row%2?1:-1)*27;
        g.moveTo(-159,y);g.lineTo(159,y);g.moveTo(offset,y);g.lineTo(offset,y+118);
      }g.stroke();
    }
    g.strokeStyle="#344345";g.lineWidth=14;g.strokeRect(map.x+65,map.y+65,map.w-130,map.h-130);g.restore();
  }
  function drawGround(ctx,visible,map,options={}) {
    const scale=Math.min(options.quality>=2?.55:.85,1600/(Math.max(visible.w,visible.h)+512));
    const key=Math.round(scale*10),pad=256;
    if(!floorCache||floorCache.key!==key||floorCache.version!==floorVersion||visible.x<floorCache.x||visible.y<floorCache.y||visible.x+visible.w>floorCache.x+floorCache.w||visible.y+visible.h>floorCache.y+floorCache.h){
      const area={x:Math.floor((visible.x-pad)/128)*128,y:Math.floor((visible.y-pad)/128)*128,w:visible.w+pad*2+128,h:visible.h+pad*2+128};
      const c=floorCache?.canvas||document.createElement("canvas");c.width=Math.ceil(area.w*scale);c.height=Math.ceil(area.h*scale);
      const g=c.getContext("2d",{alpha:false});g.setTransform(scale,0,0,scale,-area.x*scale,-area.y*scale);g.fillStyle="#142127";g.fillRect(area.x,area.y,area.w,area.h);paintFloor(g,area,map);
      floorCache={...area,key,canvas:c,version:floorVersion};groundBuilds++;
    }
    ctx.drawImage(floorCache.canvas,floorCache.x,floorCache.y,floorCache.w,floorCache.h);
  }
  function props(visible) {
    const visibleProps=[];
    for(const p of gates)if(inView(p,visible,290))visibleProps.push(p);
    for(const p of lanterns)if(inView(p,visible,140))visibleProps.push(p);
    return visibleProps;
  }
  function drawHit(ctx,type,height,bottom,strength) {
    const im=images[type];if(!ready(im))return;
    const key="hit-"+type;
    let flash=cached.get(key);
    if(!flash){
      flash=document.createElement("canvas");flash.width=im.naturalWidth;flash.height=im.naturalHeight;
      const g=flash.getContext("2d");g.drawImage(im,0,0);g.globalCompositeOperation="source-atop";g.fillStyle="#d9e5da";g.fillRect(0,0,flash.width,flash.height);cached.set(key,flash);
    }
    const w=height*flash.width/flash.height;
    ctx.save();ctx.globalAlpha*=clamp(strength*.5,0,.45);ctx.drawImage(flash,-w/2,-height+bottom,w,height);ctx.restore();
  }
  function drawProp(ctx,p) {
    ctx.save();ctx.translate(p.x,p.y);
    if(p.type==="torii") {
      if(ready(images.torii))ctx.drawImage(images.torii,-140,-250,280,280);
    } else {
      if(p.cooldown&&!p.active)ctx.globalAlpha*=.58;
      if(ready(images["stone-lantern"]))ctx.drawImage(images["stone-lantern"],-38,-106,76,128);
      // Warm lamp light is anchored to the aperture, distinct from the blue protective seal.
      if(!p.cooldown||p.active)glow(ctx,0,-56,p.active?42:27,p.active?"#80d8cf":"#edb96e",p.active?.32:.24);
    }ctx.restore();
  }
  function drawSeal(ctx,lamp,quality) {
    const r=155,fade=Math.min(1,lamp.active/.6),pulse=.9+Math.sin(clock*2)*.1;
    ctx.save();ctx.translate(lamp.x,lamp.y);ctx.globalAlpha*=fade;
    glow(ctx,0,0,r*1.18,"#68c6bd",.11);
    ctx.strokeStyle="#9bddcf";ctx.lineWidth=1.5;ctx.globalAlpha*=pulse;
    ctx.beginPath();ctx.arc(0,0,r,0,TAU);ctx.stroke();
    ctx.strokeStyle="rgba(150,218,208,.32)";ctx.lineWidth=1;ctx.beginPath();ctx.arc(0,0,r-7,0,TAU);ctx.stroke();
    ctx.strokeStyle="#b3ede0";ctx.beginPath();
    for(let i=0;i<8;i++){const a=i*TAU/8;const x=Math.cos(a)*r,y=Math.sin(a)*r;ctx.moveTo(x-4*Math.sin(a),y+4*Math.cos(a));ctx.lineTo(x+4*Math.sin(a),y-4*Math.cos(a));}
    ctx.stroke();ctx.restore();
  }
  function drawWarning(ctx,s) {
    const progress=clamp(s.age/s.warn,0,1),r=s.r;
    ctx.save();ctx.translate(s.x,s.y);
    ctx.fillStyle="rgba(43,23,18,.3)";ctx.beginPath();ctx.arc(0,0,r,0,TAU);ctx.fill();
    ctx.strokeStyle="#e9b66a";ctx.lineWidth=2.2;ctx.beginPath();ctx.arc(0,0,r,0,TAU);ctx.stroke();
    // Fixed outer boundary is the actual hit area; the inner arc is a countdown.
    ctx.strokeStyle="#ffdb98";ctx.lineWidth=2.8;ctx.beginPath();ctx.arc(0,0,r-7,-Math.PI/2,-Math.PI/2+TAU*progress);ctx.stroke();
    ctx.strokeStyle="rgba(238,193,121,.65)";ctx.lineWidth=1;ctx.beginPath();
    for(let i=0;i<8;i++){const a=i*TAU/8,c=Math.cos(a),n=Math.sin(a);ctx.moveTo(c*(r-16),n*(r-16));ctx.lineTo(c*(r-23),n*(r-23));}
    ctx.moveTo(-9,0);ctx.lineTo(9,0);ctx.moveTo(0,-9);ctx.lineTo(0,9);ctx.stroke();
    if(progress>.72){ctx.globalAlpha=.12+(progress-.72)*.4;ctx.fillStyle="#f8c86b";ctx.beginPath();ctx.arc(0,0,r-2,0,TAU);ctx.fill();}
    ctx.restore();
  }
  function boltPath(ctx,points){ctx.beginPath();points.forEach(([x,y],i)=>i?ctx.lineTo(x,y):ctx.moveTo(x,y));ctx.stroke();}
  function draw(ctx,visible,options={}) {
    const quality=options.quality||0;ctx.save();
    for(const gate of gates)if(inView(gate,visible,260)) {
      ctx.fillStyle="rgba(5,14,18,.22)";ctx.beginPath();ctx.ellipse(gate.x,gate.y+15,148,14,0,0,TAU);ctx.fill();
    }
    for(const lamp of lanterns){if(!inView(lamp,visible))continue;
      ctx.fillStyle="rgba(4,13,16,.27)";ctx.beginPath();ctx.ellipse(lamp.x,lamp.y+15,29,9,0,0,TAU);ctx.fill();
      if(lamp.active)drawSeal(ctx,lamp,quality);
    }
    for(const s of strikes){if(!inView(s,visible,250))continue;
      if(!s.fired)drawWarning(ctx,s);
      else{
        const t=clamp((s.age-s.warn)/.38,0,1);
        glow(ctx,s.x,s.y,s.r*(.85+t*.4),"#90dbe3",(1-t)*.4);
        ctx.globalAlpha=1-t;ctx.strokeStyle="#d7f5e8";ctx.lineWidth=2*(1-t)+.5;ctx.beginPath();ctx.ellipse(s.x,s.y,s.r*(.25+t*.8),s.r*(.12+t*.28),0,0,TAU);ctx.stroke();ctx.globalAlpha=1;
      }
    }ctx.restore();
  }
  function drawBolts(ctx,visible,options={}) {
    for(const s of strikes){if(!s.fired||!inView(s,visible,450))continue;
      const t=(s.age-s.warn)/.38,alpha=clamp(1-t,0,1);ctx.save();ctx.translate(s.x,s.y);ctx.lineJoin="bevel";ctx.globalAlpha=alpha;
      const points=s.bolt;
      if(options.quality<2){ctx.strokeStyle="rgba(87,181,209,.28)";ctx.lineWidth=13;boltPath(ctx,points);}
      ctx.strokeStyle="#89cddf";ctx.lineWidth=5;boltPath(ctx,points);
      ctx.strokeStyle="#f2fff2";ctx.lineWidth=1.7;boltPath(ctx,points);
      if(options.quality<2){ctx.strokeStyle="#a4dae5";ctx.lineWidth=1;boltPath(ctx,[points[4],[points[4][0]+48,points[4][1]-24],[points[4][0]+76,points[4][1]-15]]);}
      ctx.restore();
    }
  }
  function weather(ctx,w,h,options={}) {
    if(options.reducedMotion)return;
    const quality=options.quality||0,count=quality>=2?10:quality?22:38;
    ctx.save();ctx.strokeStyle="rgba(179,205,212,.24)";ctx.lineWidth=.85;ctx.beginPath();
    for(let i=0;i<count;i++){
      const x=((i*193.7+clock*43)%(w+80)+w+80)%(w+80)-40;
      const y=((i*117.3+clock*(380+i%4*30))%(h+100)+h+100)%(h+100)-50;
      ctx.moveTo(x,y);ctx.lineTo(x-5,y+16+i%3*3);
    }ctx.stroke();
    if(quality<2){ctx.strokeStyle="rgba(163,194,202,.17)";ctx.lineWidth=.8;ctx.beginPath();
      for(let i=0;i<5;i++){const t=(clock*.7+i*.23)%1,x=noise(i+8)*w,y=(.3+noise(i+7)*.65)*h;const r=3+t*9;ctx.moveTo(x+r,y);ctx.ellipse(x,y,r,r*.32,0,0,TAU);}
      ctx.stroke();
    }ctx.restore();
  }
  function walkingPose(enemy, alpha = 1) {
    const stride = walkStrides[enemy.type];
    if (!stride) return null;
    // Match the same interpolated displacement as the rendered actor, never wall time.
    const speed = enemy.motionSpeed || 0;
    const distance = Math.max(0, (enemy.marchDistance || 0) - speed / 30 * (1 - clamp(alpha, 0, 1)));
    const phase = distance / stride * TAU + (enemy.phase || 0);
    const cycle = ((phase / TAU) % 1 + 1) % 1;
    const bracing = enemy.windup > 0 || enemy.castTimer > 0 || ["windup", "cast", "recover"].includes(enemy.heavyState);
    const moving = speed > 3 && !bracing;
    const frame = moving ? Math.floor(cycle * 8) : cycle < .5 ? 0 : 4;
    return { frame, phase, moving, stride };
  }
  function walkingVisual(enemy, alpha = 1) {
    const image = walkSheets[enemy.type], pose = walkingPose(enemy, alpha);
    if (!pose || !ready(image)) return null;
    return { image, columns:4, rows:2, index:pose.frame, baseline:240/256, facingRight:enemy.shrineFacing, facesRight:enemy.type === "ashigaru" || enemy.type === "senryoThief", gait:pose };
  }
  function applyMotion(ctx,e,time,alpha=1) {
    if (["armored","boss","oniElite","overlord"].includes(e.type)) return;
    const gait = walkingPose(e,alpha);
    if (gait && ready(walkSheets[e.type])) {
      // Leg articulation comes from the atlas; retain only a subtle planted weight shift.
      const foot=e.r*1.2;
      ctx.translate(0,foot);
      ctx.scale(1,1-(gait.moving?Math.abs(Math.sin(gait.phase))*.006:0));
      ctx.translate(0,-foot);
      return;
    }
    if(e.type === "wraith") {
      ctx.translate(Math.sin(time*1.9+e.phase)*1.2,Math.sin(time*2.4+e.phase)*3-4);
      ctx.rotate(Math.sin(time*2+e.phase)*.035);
    }
  }
  window.ShrineStage = {
    roster,load,reset,update,draw,drawGround,enemyAction,summonStorm,props,drawProp,drawBolts,weather,applyMotion,drawHit,walkingPose,walkingVisual,
    image:type=>images[type],
    clear:()=>{strikes=[];protectedNow=false;},
    snapshot:()=>({lanterns:lanterns.map(p=>({...p})),strikes:strikes.map(p=>({...p})),protectedNow,groundBuilds,cachePixels:floorCache?floorCache.canvas.width*floorCache.canvas.height:0})
  };
})();
