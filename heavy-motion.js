(() => {
  "use strict";
  const TAU = Math.PI * 2;
  const clamp = (x,a,b) => Math.max(a,Math.min(b,x));
  const profiles = {
    armored: { stride:108, pace:1.18, turn:1.8, windup:.82, strike:.22, recover:.58, charge:180, reach:190, cooldown:4.2, minTime:0, walk:[0,1,0,1], brace:2, attack:3 },
    boss: { stride:136, pace:1.44, turn:2, windup:.76, strike:.27, recover:.53, charge:280, reach:265, cooldown:4.4, minTime:0, walk:[1,1,1,1], brace:3, attack:2 },
    oniElite: { stride:146, pace:.93, turn:1.8, windup:.82, strike:.28, recover:.52, charge:360, reach:350, cooldown:4.1, minTime:450, walk:[0], brace:1, attack:2 },
    overlord: { stride:174, pace:1.5, turn:1.45, windup:.9, strike:.31, recover:.6, charge:410, reach:410, cooldown:4.5, minTime:450, walk:[0], brace:3, attack:3 }
  };
  const isHeavy = enemy => Boolean(profiles[enemy.type]);
  function enter(enemy,state,duration=0) {
    enemy.heavyState=state; enemy.heavyAge=0; enemy.heavyRemaining=duration;
    if(state!=="windup")enemy.windup=0;
  }
  function update(enemy,dt,angle,distance,elapsed) {
    const p=profiles[enemy.type];if(!p)return;
    if(!enemy.heavyState) {enter(enemy,"walk");enemy.heavyHeading=angle;enemy.heavyFacing=Math.cos(angle)>0;enemy.heavyStepAge=1;enemy.heavyImpactSerial=0;}
    enemy.heavyAge+=dt;enemy.heavyStepAge=(enemy.heavyStepAge||0)+dt;enemy.heavyHurtAge=(enemy.heavyHurtAge??1)+dt;
    const slow=Math.min(enemy.slow>0?(enemy.type==="overlord"?.82:.54):1,enemy.sakeSlow>0?(enemy.type==="overlord"?.72:.38):1);
    const casting=enemy.type==="overlord"&&enemy.castTimer>0;
    if(casting) {
      if(enemy.heavyState!=="cast")enter(enemy,"cast");
      enemy.vx*=Math.exp(-dt*18);enemy.vy*=Math.exp(-dt*18);enemy.windup=0;return;
    }
    if(enemy.heavyState==="cast")enter(enemy,"recover",.35);
    const phase=(enemy.marchDistance||0)/(enemy.gaitStride || p.stride)*TAU+(enemy.phase||0);
    if(enemy.heavyState==="walk") {
      const delta=Math.atan2(Math.sin(angle-enemy.heavyHeading),Math.cos(angle-enemy.heavyHeading));
      enemy.heavyHeading+=clamp(delta,-p.turn*dt,p.turn*dt);
      if(Math.abs(Math.cos(enemy.heavyHeading))>.35 && Math.abs(Math.sin(phase))<.42)enemy.heavyFacing=Math.cos(enemy.heavyHeading)>0;
      const close=distance<280?1.18+clamp(elapsed/360,0,1)*.75:1;
      const drive=(.38+1.12*Math.abs(Math.sin(phase)))/1.09;
      const speed=enemy.speed*p.pace*close*slow*drive;
      const blend=1-Math.exp(-dt*7.5);
      enemy.vx+=(Math.cos(enemy.heavyHeading)*speed-enemy.vx)*blend;
      enemy.vy+=(Math.sin(enemy.heavyHeading)*speed-enemy.vy)*blend;
      const foot=Math.floor(phase/Math.PI);
      if(enemy.heavyFoot!==undefined&&foot!==enemy.heavyFoot&&(enemy.motionSpeed||0)>8){enemy.heavyStepAge=0;enemy.heavyImpactSerial++;}
      enemy.heavyFoot=foot;
      if(elapsed>p.minTime&&enemy.dashCd<=0&&distance<p.reach) {
        enemy.rushAngle=angle;enemy.heavyFacing=Math.cos(angle)>0;
        enemy.windupMax=p.windup;enter(enemy,"windup",p.windup);enemy.windup=p.windup;enemy.dashCd=p.cooldown;
      }
    } else if(enemy.heavyState==="windup") {
      enemy.heavyRemaining=Math.max(0,enemy.heavyRemaining-dt);enemy.windup=enemy.heavyRemaining;
      enemy.vx*=Math.exp(-dt*20);enemy.vy*=Math.exp(-dt*20);
      if(enemy.heavyRemaining<=0)enter(enemy,"strike",p.strike);
    } else if(enemy.heavyState==="strike") {
      const progress=clamp(enemy.heavyAge/p.strike,0,1),speed=p.charge*(.32+.68*Math.sin(progress*Math.PI))*slow;
      enemy.vx=Math.cos(enemy.rushAngle)*speed;enemy.vy=Math.sin(enemy.rushAngle)*speed;
      enemy.heavyRemaining-=dt;
      if(enemy.heavyRemaining<=0){enter(enemy,"recover",p.recover);enemy.heavyStepAge=0;enemy.heavyImpactSerial++;}
    } else {
      enemy.heavyRemaining-=dt;enemy.vx*=Math.exp(-dt*14);enemy.vy*=Math.exp(-dt*14);
      if(enemy.heavyRemaining<=0)enter(enemy,"walk");
    }
  }
  function pose(enemy,extra=0) {
    const p=profiles[enemy.type];if(!p)return null;
    const mode=enemy.heavyState||"walk",age=(enemy.heavyAge||0)+extra;
    const phase=(enemy.marchDistance||0)/(enemy.gaitStride || p.stride)*TAU+(enemy.phase||0);
    const land=clamp(((enemy.heavyStepAge??1)+extra)/.2,0,1);
    let frame=0,fallback=0,sink=Math.sin(land*Math.PI)*2.4,lean=0;
    if(mode==="walk") {frame=Math.floor((phase/TAU%1+1)%1*8);fallback=(enemy.motionSpeed||0)>5?p.walk[frame%p.walk.length]:0;lean=Math.sin(phase)*.006;if((enemy.motionSpeed||0)<5)frame=0;}
    else if(mode==="cast"){frame=8;fallback=2;sink=2;}
    else if(mode==="windup"){const progress=clamp(age/p.windup,0,1);frame=8+Math.min(2,Math.floor(progress*3));fallback=p.brace;sink=4*progress;lean=-Math.cos(enemy.rushAngle||0)*.022*progress;}
    else if(mode==="strike"){const progress=clamp(age/p.strike,0,1);frame=11+Math.min(2,Math.floor(progress*3));fallback=p.attack;lean=Math.cos(enemy.rushAngle||0)*.035;}
    else {const progress=clamp(age/p.recover,0,1);frame=14+Math.min(1,Math.floor(progress*2));fallback=progress<.55?p.attack:0;sink=Math.sin(progress*Math.PI)*3.5;lean=Math.cos(enemy.rushAngle||0)*.018*(1-progress);}
    const hurt=clamp(1-((enemy.heavyHurtAge??1)+extra)/.14,0,1);
    return {frame,fallback,mode,phase,sink,lean,flip:enemy.heavyFacing??false,hurt};
  }
  window.HeavyMotion={isHeavy,update,pose,profile:type=>profiles[type]};
})();
