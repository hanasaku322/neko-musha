(() => {
  "use strict";
  const atlas = typeof Image !== "undefined" ? new Image() : null;
  if (atlas) atlas.src = "assets/vfx/combat-atlas.png";
  window.CombatVFX = { create({ ctx, quality = () => 0 }) {
    const fx = [], glows = new Map();
    const TAU = Math.PI * 2;
    const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
    const noise = (seed, n) => { const x = Math.sin(seed * 12.9898 + n * 78.233) * 43758.5453; return x - Math.floor(x); };
    const cap = () => quality() >= 2 ? 20 : quality() ? 32 : 48;
    function push(effect) {
      while (fx.length >= cap()) fx.shift();
      fx.push({ age: 0, seed: effect.x * .17 + effect.y * .31, ...effect });
    }
    function glow(x, y, radius, color, alpha) {
      if (quality() >= 2 || alpha <= 0) return;
      let sprite = glows.get(color);
      if (!sprite) {
        sprite = document.createElement("canvas"); sprite.width = sprite.height = 64;
        const g = sprite.getContext("2d"), gradient = g.createRadialGradient(32,32,0,32,32,32);
        gradient.addColorStop(0,color); gradient.addColorStop(.22,color); gradient.addColorStop(1,"rgba(0,0,0,0)");
        g.fillStyle=gradient; g.fillRect(0,0,64,64);
        if (glows.size >= 24) glows.delete(glows.keys().next().value);
        glows.set(color,sprite);
      }
      ctx.save(); ctx.globalCompositeOperation="lighter"; ctx.globalAlpha*=alpha;
      ctx.drawImage(sprite,x-radius,y-radius,radius*2,radius*2); ctx.restore();
    }
    function texture(index,x,y,w,h,alpha=1) {
      if (!atlas?.complete || !atlas.naturalWidth) return;
      ctx.save();ctx.translate(x,y);ctx.globalCompositeOperation="lighter";ctx.globalAlpha*=alpha;
      const cw=atlas.naturalWidth/4,ch=atlas.naturalHeight/2;
      ctx.drawImage(atlas,index%4*cw,Math.floor(index/4)*ch,cw,ch,-w/2,-h/2,w,h);ctx.restore();
    }
    function line(points, color, width, alpha=1) {
      ctx.save(); ctx.globalAlpha*=alpha; ctx.strokeStyle=color; ctx.lineWidth=width;
      ctx.lineCap="round"; ctx.lineJoin="round"; ctx.beginPath();
      points.forEach((p,i)=>i?ctx.lineTo(p[0],p[1]):ctx.moveTo(p[0],p[1])); ctx.stroke(); ctx.restore();
    }
    function star(x,y,size,color,alpha=1,angle=0) {
      ctx.save();ctx.translate(x,y);ctx.rotate(angle);ctx.globalAlpha*=alpha;ctx.fillStyle=color;
      ctx.beginPath();ctx.moveTo(-size,0);ctx.lineTo(-size*.12,-size*.12);ctx.lineTo(0,-size*.54);ctx.lineTo(size*.12,-size*.12);ctx.lineTo(size,0);ctx.lineTo(size*.12,size*.12);ctx.lineTo(0,size*.54);ctx.lineTo(-size*.12,size*.12);ctx.closePath();ctx.fill();ctx.restore();
    }
    function track(p) {
      if (!Number.isFinite(p.x) || !Number.isFinite(p.y)) return;
      const trail=p.fxTrail || (p.fxTrail=[]);
      trail.unshift({x:p.x,y:p.y});
      const limit=quality() >= 2 ? 3 : quality() ? 5 : 7;
      if(trail.length>limit)trail.length=limit;
    }
    function trail(p,color,hostile) {
      const points=[{x:p.x,y:p.y},...(p.fxTrail||[])];
      if(points.length<2)return;
      const r=Math.min(p.r||10,16)*(hostile?.35:.5), n=points.length;
      // Two edges form one tapered ribbon following the real, possibly curved, trajectory.
      const edge=(sign)=>points.map((v,i)=>{
        const next=points[Math.min(i+1,n-1)],prev=points[Math.max(0,i-1)];
        const a=Math.atan2(next.y-prev.y,next.x-prev.x)+Math.PI/2;
        const width=r*Math.pow(1-i/(n-1),1.7)*sign;
        return [v.x+Math.cos(a)*width,v.y+Math.sin(a)*width];
      });
      ctx.save();ctx.globalCompositeOperation="lighter";ctx.globalAlpha=hostile?.3:.32;
      const polygon=[...edge(1),...edge(-1).reverse()];ctx.fillStyle=color;ctx.beginPath();polygon.forEach((v,i)=>i?ctx.lineTo(...v):ctx.moveTo(...v));ctx.closePath();ctx.fill();
      if(quality()<2)for(let i=0;i<n-1;i++)line([[points[i].x,points[i].y],[points[i+1].x,points[i+1].y]],"#fff6d9",Math.max(.4,1.4*(1-i/n)),.38*(1-i/n));
      ctx.restore();
    }
    function projectile(p,time) {
      const hostile=p.kind==="overlordBullet" || p.hostile;
      const color=hostile?"#ff583f":p.color||"#93ede0", r=Math.max(3,p.r||10);
      ctx.save();
      if(!["crane","shuriken","arrow"].includes(p.kind)||quality()===0)trail(p,color,hostile);
      ctx.translate(p.x,p.y);ctx.rotate(Math.atan2(p.vy||0,p.vx||1));
      if(hostile) {
        texture(6,-r*.85,0,r*4.6,r*3.2,.68);
        glow(0,0,r*2.4,color,.16);
        ctx.fillStyle="#34171e";ctx.strokeStyle="#ffb074";ctx.lineWidth=1.6;
        ctx.beginPath();ctx.arc(0,0,r,0,TAU);ctx.fill();ctx.stroke();
        ctx.fillStyle="#ff694c";ctx.beginPath();ctx.arc(1,0,r*.56,0,TAU);ctx.fill();
        ctx.fillStyle="#fff3bf";ctx.beginPath();ctx.ellipse(r*.18,-r*.15,r*.18,r*.34,.3,0,TAU);ctx.fill();
        ctx.rotate(time*1.8);for(let i=0;i<3;i++){ctx.rotate(TAU/3);line([[r*1.2,-3],[r*1.45,0],[r*1.2,3]],"#ffbf8d",1,.75);}
      } else if(p.kind==="shuriken"||p.kind==="shadowShuriken") {
        const evolved=p.kind==="shadowShuriken";
        ctx.rotate(time*(evolved?19:14));
        texture(2,0,0,r*4.4,r*4.4,.85);
        if(evolved)glow(0,0,r*2.7,"#a18bff",.16);
        ctx.fillStyle="#22333d";ctx.strokeStyle=evolved?"#d8c9ff":"#cce9e8";ctx.lineWidth=1.2;
        ctx.beginPath();for(let i=0;i<8;i++){const a=i*TAU/8,rr=i%2?r*.37:r*1.5;const x=Math.cos(a)*rr,y=Math.sin(a)*rr;i?ctx.lineTo(x,y):ctx.moveTo(x,y);}ctx.closePath();ctx.fill();ctx.stroke();
        for(let i=0;i<4;i++){const a=i*TAU/4;line([[0,0],[Math.cos(a)*r*1.35,Math.sin(a)*r*1.35]],"#ecfffb",.8,.65);}
        ctx.fillStyle="#101c26";ctx.beginPath();ctx.arc(0,0,r*.2,0,TAU);ctx.fill();
      } else if(p.kind==="arrow"||p.kind==="heavenArrow") {
        const evolved=p.kind==="heavenArrow";
        texture(1,-8,0,76,43,evolved?.88:.6);
        if(evolved)glow(7,0,28,"#ffd38b",.18);
        line([[-25,0],[18,0]],"#18232b",5);line([[-25,0],[17,0]],"#caad7c",2);
        ctx.fillStyle=evolved?"#fff1b5":"#dceae3";ctx.beginPath();ctx.moveTo(26,0);ctx.lineTo(12,-5);ctx.lineTo(15,0);ctx.lineTo(12,5);ctx.closePath();ctx.fill();
        ctx.fillStyle="#efe1bf";ctx.beginPath();ctx.moveTo(-17,-1);ctx.lineTo(-29,-7);ctx.lineTo(-27,-1);ctx.lineTo(-17,1);ctx.lineTo(-29,7);ctx.lineTo(-27,1);ctx.closePath();ctx.fill();
        if(evolved)line([[-38,0],[10,0]],"#fff2bb",1.4,.65);
      } else if(p.kind==="crane") {
        const flap=Math.sin(time*16)*6;
        ctx.fillStyle="#f4ecda";ctx.strokeStyle="#8d7e78";ctx.lineWidth=.7;
        for(const sign of [-1,1]){ctx.beginPath();ctx.moveTo(13,0);ctx.lineTo(-12,sign*(17+flap));ctx.lineTo(-5,sign*2);ctx.lineTo(-19,0);ctx.closePath();ctx.fill();ctx.stroke();}
        line([[-7,0],[15,0],[11,-5]],"#fffbe9",1.5);
      } else if(p.kind==="thunder") {
        texture(3,-8,0,r*7.3,r*4.4,.76);
        glow(0,0,r*2.5,color,.2);
        for(let branch=0;branch<(quality()>=2?1:3);branch++){
          const points=[];for(let i=0;i<6;i++)points.push([-28+i*8,Math.sin(i*2.3+time*19+branch)*r*.55*(1-i/6)+branch*2-2]);
          line(points,color,3.2,.65);line(points,"#f1ffff",1.1,.95);
        }
        star(8,0,r*.8,"#ffffff",1,time*2);
      } else if(p.kind==="sickle"||p.kind==="eclipseBullet") {
        const eclipse=p.kind==="eclipseBullet";
        texture(4,-r*.3,0,r*4,r*3,.32);
        glow(0,0,r*2.7,color,.15);ctx.rotate(Math.sin(time*5)*.08);
        ctx.fillStyle=eclipse?"#2c1527":"#223f48";ctx.strokeStyle=color;ctx.lineWidth=1.2;
        ctx.beginPath();ctx.moveTo(-r*1.7,-r*.9);ctx.bezierCurveTo(r*1.8,-r*1.4,r*2.1,r*.9,-r*1.7,r*.9);ctx.bezierCurveTo(r*.1,r*.3,r*.1,-r*.3,-r*1.7,-r*.9);ctx.fill();ctx.stroke();
        ctx.strokeStyle="#fff4ce";ctx.lineWidth=1.1;ctx.beginPath();ctx.moveTo(-r,-r*.85);ctx.quadraticCurveTo(r*2,-r,r*1.3,r*.2);ctx.stroke();
      } else {
        const laser=p.kind==="laser",len=laser?40:r*2.1,body=laser?Math.max(3,r*.3):Math.max(3,r*.4);
        texture(0,-8,0,laser?128:r*7,laser?52:r*4.4,.78);
        glow(2,0,r*(laser?2.4:2),color,.2);
        ctx.fillStyle="#1b3640";ctx.strokeStyle=color;ctx.lineWidth=1;
        ctx.beginPath();ctx.moveTo(len,0);ctx.bezierCurveTo(len*.45,-body*1.5,-len*.65,-body*.8,-len*.8,0);ctx.bezierCurveTo(-len*.65,body*.8,len*.45,body*1.5,len,0);ctx.fill();ctx.stroke();
        ctx.fillStyle="#fffbea";ctx.beginPath();ctx.moveTo(len,0);ctx.lineTo(-len*.55,-body*.3);ctx.lineTo(-len*.2,0);ctx.lineTo(-len*.55,body*.3);ctx.closePath();ctx.fill();
        line([[-len*1.1,0],[len*.55,0]],color,1.1,.8);
        if(laser)for(const side of [-1,1])line([[-28,side*body*1.5],[-5,side*body*1.1]],"#b7fff5",.7,.6);
      }
      ctx.restore();
    }
    function slash(s) {
      const t=clamp(1-s.life/s.max,0,1),alpha=Math.pow(1-t,1.5);
      if(alpha<=0)return;
      const color=s.kind==="sakuraMoon"?"#ee92bd":s.kind==="eclipseFang"?"#ff5964":"#e2bf7d";
      const start=-1.05, end=start+2.1*(1-Math.pow(1-clamp(t*2.6,0,1),3)),radius=s.r*(.95+t*.09);
      ctx.save();ctx.translate(s.x,s.y);ctx.rotate(s.angle);ctx.globalAlpha=alpha;
      if(end-start>.08){
        ctx.save();ctx.beginPath();ctx.moveTo(0,0);ctx.arc(0,0,radius*1.7,start,end);ctx.closePath();ctx.clip();
        texture(4,0,0,radius*2.6,radius*2.6,.76);ctx.restore();
      }
      const count=20,outer=[],inner=[];
      for(let i=0;i<=count;i++){
        const u=i/count,a=start+(end-start)*u,width=Math.sin(Math.PI*u)*Math.min(17,s.r*.19)*(1-t*.7);
        outer.push([Math.cos(a)*(radius+width*.2),Math.sin(a)*(radius+width*.2)]);
        inner.push([Math.cos(a)*(radius-width),Math.sin(a)*(radius-width)]);
      }
      const polygon=[...outer,...inner.reverse()];
      ctx.fillStyle=s.kind==="eclipseFang"?"#48202f":"#39433f";ctx.strokeStyle="#171d23";ctx.lineWidth=2.2;
      ctx.beginPath();polygon.forEach((p,i)=>i?ctx.lineTo(...p):ctx.moveTo(...p));ctx.closePath();ctx.fill();ctx.stroke();
      ctx.globalCompositeOperation="lighter";ctx.fillStyle=color;ctx.globalAlpha=alpha*.6;ctx.fill();
      ctx.globalAlpha=alpha;line(outer,"#fff9e8",2.3);line(outer,color,5,.28);
      const tip=outer[outer.length-1];glow(tip[0],tip[1],16,color,.19);
      if(quality()<2 && end-start>.3){
        ctx.strokeStyle=color;ctx.lineWidth=.8;ctx.globalAlpha=alpha*.45;ctx.beginPath();ctx.arc(0,0,radius*.81,start+.12,end-.07);ctx.stroke();
        if(s.kind==="sakuraMoon")for(let i=0;i<5;i++){const a=start+i*.39+t*.6;ctx.save();ctx.translate(Math.cos(a)*radius*.8,Math.sin(a)*radius*.8);ctx.rotate(a+t*3);ctx.fillStyle="#ffccdf";ctx.beginPath();ctx.ellipse(0,0,4,1.6,0,0,TAU);ctx.fill();ctx.restore();}
      }
      ctx.restore();
    }
    function muzzle(x,y,angle,color) {
      push({kind:"muzzle",x,y,angle,color:color||"#96eadf",size:16,duration:.11});
    }
    function hit(x,y,angle,color,strong=false) {
      push({kind:"hit",x,y,angle,color:color||"#e6c388",size:strong?26:17,duration:strong?.25:.19});
    }
    function death(enemy,sprite,strong,flip=false) {
      push({kind:"death",x:enemy.x,y:enemy.y,angle:enemy.hitAngle||0,color:enemy.color||"#d8be8e",size:strong?enemy.r*1.5:enemy.r*.9,duration:strong?.48:.31,sprite,flip,height:enemy.r*(["boss","oniElite","overlord"].includes(enemy.type)?4.25:4.55),bottom:enemy.r*1.35});
    }
    function update(dt) {while(fx.length>cap())fx.shift();for(let i=fx.length-1;i>=0;i--){fx[i].age+=dt;if(fx[i].age>=fx[i].duration)fx.splice(i,1);}}
    function draw(extra=0) {
      for(const f of fx){
        const age=Math.min(f.duration,f.age+extra),t=clamp(age/f.duration,0,1),fade=Math.pow(1-t,1.7);
        ctx.save();ctx.translate(f.x,f.y);ctx.rotate(f.angle||0);
        if(f.kind==="muzzle") {
          glow(0,0,24,f.color,fade*.22);
          star(3,0,18*(1-t),"#fff5d8",fade,0);
          line([[-10,-6],[3,-2],[12,0]],f.color,1,fade);
          line([[-10,6],[3,2],[12,0]],f.color,1,fade);
        } else if(f.kind==="death") {
          ctx.rotate(-(f.angle||0));
          if(f.sprite?.complete&&f.sprite.naturalWidth&&quality()<2){
            ctx.save();ctx.globalAlpha=fade*.52;ctx.filter="brightness(0.35) saturate(0.5)";
            const w=f.height*f.sprite.naturalWidth/f.sprite.naturalHeight;
            if(f.flip)ctx.scale(-1,1);
            ctx.drawImage(f.sprite,-w/2,-f.height+f.bottom-t*10,w,f.height);ctx.restore();
          }
          glow(0,-f.size*.5,f.size*1.8,f.color,fade*.11);
          for(let i=0;i<(quality()>=2?3:6);i++){
            const x=(noise(f.seed,i)-.5)*f.size*2,y=-t*(28+noise(f.seed,i+20)*30);
            line([[x,y+8],[x+Math.sin(t*4+i)*3,y-5]],f.color,1.4,fade*.65);
          }
        } else {
          if(t<.64)texture(f.size>20?7:5,0,0,f.size*4.4,f.size*4.4,Math.pow(1-t/.64,1.4)*.8);
          if(t<.3){star(0,0,f.size*(1-t*.8),"#fff9de",(1-t/.3)*.9,.15);glow(0,0,f.size*1.8,f.color,(1-t/.3)*.24);}
          const count=quality()>=2?3:quality()?4:7;
          for(let i=0;i<count;i++){
            const a=(noise(f.seed,i)-.5)*2.1,travel=(8+noise(f.seed,i+11)*f.size*2)*(1-Math.pow(1-t,2));
            const x=Math.cos(a)*travel,y=Math.sin(a)*travel+t*t*14;
            const length=(3+noise(f.seed,i+30)*8)*(1-t);
            line([[x,y],[x-Math.cos(a)*length,y-Math.sin(a)*length]],i%3?f.color:"#fff4d3",i%2?1:1.6,fade);
          }
          if(quality()<2){ctx.strokeStyle=f.color;ctx.lineWidth=1;ctx.globalAlpha=fade*.5;ctx.beginPath();ctx.ellipse(0,0,f.size*(.35+t),f.size*(.18+t*.4),0,-.7,1.7);ctx.stroke();}
        }
        ctx.restore();
      }
    }
    function particle(p) {
      const a=clamp(p.life/p.max,0,1),dust=p.color==="#a8997e";
      ctx.save();ctx.globalAlpha=dust?a*.24:a*a;ctx.fillStyle=p.color;
      if(dust){ctx.beginPath();ctx.ellipse(p.x,p.y,p.r*(2-a),p.r*.6,0,0,TAU);ctx.fill();}
      else {
        const speed=Math.hypot(p.vx||0,p.vy||0)||1,length=clamp(speed*.025,2,12),angle=Math.atan2(p.vy||0,p.vx||0);
        ctx.translate(p.x,p.y);ctx.rotate(angle);ctx.fillStyle=p.color;
        ctx.beginPath();ctx.moveTo(length,0);ctx.lineTo(-length*.5,-Math.min(1.4,p.r*.35));ctx.lineTo(-length*.8,0);ctx.lineTo(-length*.5,Math.min(1.4,p.r*.35));ctx.closePath();ctx.fill();
        if(a>.7&&quality()===0)line([[0,0],[length*.6,0]],"#fff4d8",.6);
      }
      ctx.restore();
    }
    function shockwave(w) {
      const t=clamp(1-w.life/w.max,0,1),fade=Math.pow(1-t,1.8),radius=w.r+(1-Math.pow(1-t,3))*115;
      ctx.save();ctx.translate(w.x,w.y);ctx.scale(1,.62);ctx.globalAlpha=fade;
      const segments=quality()>=2?3:5;
      for(let i=0;i<segments;i++){
        const a=i*TAU/segments+t*.2;
        ctx.strokeStyle=w.color||"#e5c28b";ctx.lineWidth=1.2+2*(1-t);ctx.beginPath();ctx.arc(0,0,radius,a,a+TAU/segments*.64);ctx.stroke();
      }
      if(w.kind==="warThunder")for(let i=0;i<(quality()>=2?4:8);i++){
        const a=i*TAU/8;line([[Math.cos(a)*w.r,Math.sin(a)*w.r],[Math.cos(a+.08)*radius*.72,Math.sin(a+.08)*radius*.72],[Math.cos(a)*radius,Math.sin(a)*radius]],"#c8fff1",1.3,fade);
      }
      ctx.restore();
    }
    return {track,projectile,slash,muzzle,hit,death,particle,shockwave,update,draw,clear(){fx.length=0;},stats(){return {effects:fx.length,glows:glows.size,limit:cap()};}};
  }};
})();
