(() => {
  "use strict";
  const root = "assets/endings/";
  const definitions = {
    sengoku: {
      label:"一ノ陣 · 戦国の夜", title:"帰る灯を、消さないために", track:"片月のうた", music:"assets/bgm/ending-theme.mp3",
      length:243.05, shots:["sengoku-dawn","sengoku-road","sengoku-home"],
      chapters:[
        { title:"刃をおろす朝", duration:12,
          boss:["黒角王は、膝をついた。","ぴぃ丸は、振り下ろしかけた刃を鞘に戻した。","救われた命は、救う側になれる。"],
          survive:["黒角王はまだ、夜の向こうにいる。","それでも、朝まで守り抜いた命があった。","その重みを抱いて、二人は帰路についた。"] },
        { title:"灯りの続く道", duration:14,
          lines:["閉ざされていた戸が、ひとつずつ開く。","誰かのために灯された明かりが、道になっていた。","二人の腕の中で、小さな命が眠っている。"] },
        { title:"帰る場所を、守る", duration:17,
          lines:["古い寺を直し、行き場のない命を迎えよう。","傷があっても、欠けていても、ここにいていい。","あの夜、拾ってもらったぬくもりを、今度は誰かへ。"],
          denkichi:["ぴぃ丸が、静かに額を押しつけてきた。","そのぬくもりが、伝吉には何よりの褒美だった。","二人の寺には、今日も新しい家族がやってくる。"] }
      ],
      afterword:"遠くで、助けを待つ声がする。\n「行ってこい、ぴぃ丸。帰りは、ここだ」"
    },
    shrine: {
      label:"二ノ陣 · 雷雨の古社", title:"あなたの「おかえり」", track:"あなたの「おかえり」", music:"assets/bgm/shrine-homecoming-ending.mp3",
      length:241.63, shots:["shrine-dawn","shrine-lantern","shrine-home"],
      chapters:[
        { title:"雨がほどける", duration:12,
          boss:["天鼓の音が、雲の向こうへ遠ざかった。","境内には、雨だれの音だけが残っている。","ぴぃ丸は、ようやく刀をしまった。"],
          survive:["雷はまだ、雲の向こうで鳴っている。","それでも、古社に朝が差した。","帰りを待つ声を思い出し、二人は歩きだす。"] },
        { title:"祈りの灯", duration:14,
          lines:["倒れた灯籠を起こし、ほどけた注連縄を結ぶ。","灯した火のそばで、震えていた小さな命が眠った。","祈りとは、誰かを待つ明かりなのかもしれない。"] },
        { title:"たった、ひと言", duration:18,
          lines:["戸口で待っていたのは、勝どきではなかった。","「おかえり」――その声に、強がりがほどけていく。","ぴぃ丸は、濡れた頬をその手にあずけた。"],
          denkichi:["「おかえり」と伝吉が言うと、ぴぃ丸は小さく喉を鳴らした。","いつか拾いあげた命が、今日も誰かを守って帰ってきた。","伝吉もまた、そのぬくもりに救われていた。"] }
      ],
      afterword:"帰れる場所がある。\nその灯りを、二人で守っていこう。"
    }
  };
  const castDefinitions = {"sengoku": [{"id": "piimaru", "name": "ぴぃ丸", "label": "隻眼の猫武者", "desc": "拾われたぬくもりを、誰かを守る力に。小さな体に、折れない心を宿す。", "src": "assets/endings/cast-v2-piimaru.webp", "frames": 1, "motion": "idle"}, {"id": "denkichi", "name": "伝吉", "label": "ぴぃ丸の家族", "desc": "雨の中の小さな命を拾った、心優しき青年。帰りを待つ灯りが、二人の強さになる。", "src": "assets/endings/cast-v2-denkichi.webp", "frames": 1, "motion": "idle"}, {"id": "sengoku-wraith", "name": "怨霊", "label": "雑兵", "desc": "戦国の夜をさまよう怨念。群れとなり、生きる者のぬくもりを追う。", "src": "assets/endings/cast-v2-sengoku-wraith.webp", "frames": 1, "motion": "hover"}, {"id": "sengoku-ashigaru", "name": "落武者足軽", "label": "雑兵", "desc": "戦場に置き去りにされた亡者。古びた武具を構え、夜道をふさぐ。", "src": "assets/endings/cast-v2-sengoku-ashigaru.webp", "frames": 8, "motion": "walk"}, {"id": "sengoku-tengu", "name": "夜天狗", "label": "飛行敵", "desc": "闇の上空を舞う天狗。翼の音もなく、旅人の前へ降り立つ。", "src": "assets/endings/cast-v2-sengoku-tengu.webp", "frames": 1, "motion": "hover"}, {"id": "sengoku-shinobi", "name": "影忍", "label": "俊足敵", "desc": "夜陰に紛れる影の忍び。気配を消し、音もなく間合いを奪う。", "src": "assets/endings/cast-v2-sengoku-shinobi.webp", "frames": 8, "motion": "walk"}, {"id": "sengoku-armored", "name": "骸鬼", "label": "重装敵", "desc": "朽ちた鎧をまとった鬼。重い一歩が、戦場の静けさを砕く。", "src": "assets/endings/cast-v2-sengoku-armored.webp", "frames": 8, "motion": "walk"}, {"id": "sengoku-oniElite", "name": "青角王", "label": "中ボス", "desc": "青い角を掲げる大鬼。冷たい妖気をまとい、二人の前に立ちはだかる。", "src": "assets/endings/cast-v2-sengoku-oniElite.webp", "frames": 8, "motion": "walk"}, {"id": "sengoku-boss", "name": "赤角鬼将", "label": "中ボス", "desc": "赤い角の鬼将。身の丈ほどの武器を振るい、夜の軍勢を率いる。", "src": "assets/endings/cast-v2-sengoku-boss.webp", "frames": 8, "motion": "walk"}, {"id": "sengoku-overlord", "name": "終焉の黒角王", "label": "最終ボス", "desc": "戦国の夜を統べる鬼の王。その黒き角に、戦場の怨念が集う。", "src": "assets/endings/cast-v2-sengoku-overlord.webp", "frames": 8, "motion": "walk"}, {"id": "sengoku-senryoThief", "name": "千両泥棒", "label": "希少敵", "desc": "小判袋を抱えて駆ける泥棒。誰よりも目ざとく、誰よりも逃げ足が速い。", "src": "assets/endings/cast-v2-sengoku-senryoThief.webp", "frames": 8, "motion": "walk"}], "shrine": [{"id": "piimaru", "name": "ぴぃ丸", "label": "隻眼の猫武者", "desc": "拾われたぬくもりを、誰かを守る力に。小さな体に、折れない心を宿す。", "src": "assets/endings/cast-v2-piimaru.webp", "frames": 1, "motion": "idle"}, {"id": "denkichi", "name": "伝吉", "label": "ぴぃ丸の家族", "desc": "雨の中の小さな命を拾った、心優しき青年。帰りを待つ灯りが、二人の強さになる。", "src": "assets/endings/cast-v2-denkichi.webp", "frames": 1, "motion": "idle"}, {"id": "shrine-shikigami", "name": "破れ式神", "label": "古社の妖怪", "desc": "破れた札に宿る妖。群れを成して境内を漂う。", "src": "assets/endings/cast-v2-shrine-shikigami.webp", "frames": 1, "motion": "hover"}, {"id": "shrine-kappa", "name": "槍河童", "label": "古社の妖怪", "desc": "竹槍を携えた河童。横へ回り込みながら距離を詰める。", "src": "assets/endings/cast-v2-shrine-kappa.webp", "frames": 8, "motion": "walk"}, {"id": "shrine-lantern", "name": "化け提灯", "label": "古社の妖怪", "desc": "雨の中を跳ねる一つ目の提灯。揺れながら素早く迫る。", "src": "assets/endings/cast-v2-shrine-lantern.webp", "frames": 8, "motion": "walk"}, {"id": "shrine-kamaitachi", "name": "鎌鼬", "label": "古社の妖怪", "desc": "白い毛並みの鎌使い。接近すると一気に飛び込む。", "src": "assets/endings/cast-v2-shrine-kamaitachi.webp", "frames": 8, "motion": "walk"}, {"id": "shrine-stone", "name": "苔岩入道", "label": "古社の妖怪", "desc": "苔むす石が動き出した妖。重い体と高い耐久力を持つ。", "src": "assets/endings/cast-v2-shrine-stone.webp", "frames": 8, "motion": "walk"}, {"id": "shrine-monk", "name": "雷法師", "label": "古社の妖怪", "desc": "雷を呼ぶ修行僧。足元に刻まれる落雷の予兆に注意。", "src": "assets/endings/cast-v2-shrine-monk.webp", "frames": 8, "motion": "walk"}, {"id": "shrine-guardian", "name": "古社の荒守", "label": "古社の守護者", "desc": "大槌を振るう古社の守護者。重い足取りで追い詰める。", "src": "assets/endings/cast-v2-shrine-guardian.webp", "frames": 8, "motion": "walk"}, {"id": "shrine-raijin", "name": "天鼓の雷神", "label": "古社の主", "desc": "古社の雷雨を操る主。三つの雷印を結び、大地を撃つ。", "src": "assets/endings/cast-v2-shrine-raijin.webp", "frames": 1, "motion": "hover"}, {"id": "shrine-magpie", "name": "小判さらい", "label": "古社の妖怪", "desc": "小判袋を抱えた盗賊。すばしこく逃げるが、倒せば両を落とす。", "src": "assets/endings/cast-v2-shrine-magpie.webp", "frames": 8, "motion": "walk"}]};
  function scriptFor(stage, character, reason) {
    const def=definitions[stage] || definitions.sengoku;
    return { ...def, cast:castDefinitions[stage] || castDefinitions.sengoku, stage:stage === "shrine" ? "shrine" : "sengoku",
      chapters:def.chapters.map((chapter,index)=>({ ...chapter,
        image:root+def.shots[index]+".webp",
        lines:index===0 ? chapter[reason === "survive" ? "survive" : "boss"] : character === "denkichi" && chapter.denkichi ? chapter.denkichi : chapter.lines
      })) };
  }
  function create({ screen, resultButton, onPause=()=>{}, onReplay=()=>{} }) {
    const panel=document.createElement("div");panel.className="cinema";
    panel.innerHTML=`
      <div class="cinema-art" aria-hidden="true"><img class="cinema-shot" alt=""><img class="cinema-shot" alt=""></div>
      <div class="cinema-shade"></div><div class="cinema-grain"></div>
      <header class="cinema-header"><span class="cinema-brand">猫武者</span><span class="cinema-stage"></span></header>
      <div class="cinema-caption" aria-live="polite" aria-atomic="true"><p class="cinema-kicker"></p><h2></h2><div class="cinema-lines"></div></div>
      <div class="cinema-roll" aria-label="スタッフロール"><div class="cinema-roll-track"><section><p>HanaSaku ENTERTAINMENT</p><small>PRESENTS</small></section><section><small>DEVELOPED BY</small><p>HanaSaku PRODUCTIONS</p></section><div class="cinema-cast-list"></div><section><small>ENDING MUSIC</small><p class="cinema-roll-song"></p></section><section><p>A HanaSaku GAME</p></section><section><p>©2026 HanaSaku</p></section></div></div><div class="cinema-final-card">©2026 HanaSaku</div><div class="cinema-dock"><div class="cinema-progress" role="progressbar" aria-label="物語の進行" aria-valuemin="0" aria-valuemax="100"><i></i></div>
      <div class="cinema-controls"><span class="cinema-count"></span><button type="button" data-cinema="prev" aria-label="前の場面" title="前の場面">‹</button><button type="button" data-cinema="pause">一時停止</button><button type="button" data-cinema="next" aria-label="次の場面" title="次の場面">›</button><button type="button" data-cinema="replay" aria-label="最初から見る" title="最初から見る">↻</button><span class="cinema-spacer"></span></div><p class="cinema-music"></p></div>`;
    screen.prepend(panel);
    let castSprites=[];
    const q=s=>panel.querySelector(s), images=[...panel.querySelectorAll(".cinema-shot")];
    const caption=q(".cinema-caption"), lines=q(".cinema-lines"), progress=q(".cinema-progress"), progressFill=q(".cinema-progress i"), pause=q('[data-cinema="pause"]');

    let active=false, paused=false, data=null, options=null, time=0, index=-1, front=1, token=0, imageToken=0, preload=null, progressMark=-1;
    function rollDuration(){return (data?.length || 242)-storyDuration();}
    function storyDuration(){return data ? data.chapters.reduce((n,c)=>n+c.duration,0) : 0;}
    function duration(){return storyDuration()+rollDuration();}
    function startAt(i){return data.chapters.slice(0,i).reduce((n,c)=>n+c.duration,0);}
    function setImage(src){
      const request=++imageToken, target=images[1-front];let revealed=false;target.style.animation="none";void target.offsetWidth;target.style.animation="";target.src=src;
      const reveal=()=>{if(!active||request!==imageToken||revealed)return;revealed=true;images[front].classList.remove("is-visible");target.classList.add("is-visible");front=1-front;};
      if(target.complete&&target.naturalWidth)reveal();else {target.onload=reveal;target.onerror=()=>{if(request!==imageToken)return;panel.classList.add("image-unavailable");};}
      target.decode?.().then(reveal).catch(()=>{});
    }
    function show(i){
      index=Math.max(0,Math.min(data.chapters.length,i));
      const final=index===data.chapters.length, chapter=data.chapters[Math.min(index,data.chapters.length-1)];
      panel.classList.toggle("is-epilogue",final);panel.classList.remove("image-unavailable");
      q(".cinema-stage").textContent=data.label;
      q(".cinema-kicker").textContent=final ? "STAFF CREDITS" : `CHAPTER ${String(index+1).padStart(2,"0")} / 帰り道の物語`;
      q("h2").textContent=final ? data.title : chapter.title;
      lines.replaceChildren();
      const copy=final ? data.afterword.split("\n") : chapter.lines;
      for(const text of copy){const p=document.createElement("p");p.textContent=text;lines.append(p);}

      q(".cinema-count").textContent=final ? "CREDITS" : `${String(index+1).padStart(2,"0")} / 03`;
      q(".cinema-music").textContent="ENDING MUSIC · "+data.track;
      q('[data-cinema="prev"]').disabled=index===0;q('[data-cinema="next"]').disabled=final;
      caption.classList.remove("is-entering");void caption.offsetWidth;caption.classList.add("is-entering");
      if(!final||!images[front].src.endsWith(chapter.image))setImage(chapter.image);
      preload=null;if(index+1<data.chapters.length){preload=new Image();preload.src=data.chapters[index+1].image;}
    }
    function buildCast(){
      for(const sprite of castSprites)if(sprite.image){sprite.image.onload=null;sprite.image.removeAttribute("src");}
      q(".cinema-cast-list").innerHTML=data.cast.map(c=>`<section class="cinema-cast"><canvas class="cinema-cast-sprite" width="224" height="224" aria-hidden="true"></canvas><div class="cinema-cast-copy"><small>${c.label}</small><p>${c.name}</p><span>${c.desc}</span></div></section>`).join("");
      castSprites=[...panel.querySelectorAll(".cinema-cast")].map((row,i)=>({row,canvas:row.querySelector("canvas"),def:data.cast[i],image:null}));
    }
    function drawCast(){
      if(index!==data.chapters.length)return;
      const view=q(".cinema-roll").getBoundingClientRect();
      for(const sprite of castSprites){
        const bounds=sprite.row.getBoundingClientRect();
        if(bounds.bottom<view.top-250||bounds.top>view.bottom+250)continue;
        if(!sprite.image){sprite.image=new Image();sprite.image.onload=()=>{if(active&&castSprites.includes(sprite))drawCast();};sprite.image.src=sprite.def.src;}
        if(!sprite.image.complete||!sprite.image.naturalWidth)continue;
        const frame=Math.floor(time*7)%sprite.def.frames;
        const ctx=sprite.canvas.getContext("2d");
        ctx.clearRect(0,0,224,224);ctx.save();
        if(sprite.def.frames===1){
          // One full-body pose: translation and a small sway only, never a changing scale.
          const phase=time*(sprite.def.motion==="hover"?2.2:1.8);
          ctx.translate(112,208+Math.sin(phase)*(sprite.def.motion==="hover"?3:1.2));
          ctx.rotate(Math.sin(phase)*.008);ctx.translate(-112,-208);
        }
        // Explicit source rectangles isolate every frame, so a sword can never wrap into a neighbour.
        ctx.drawImage(sprite.image,(frame%4)*224,Math.floor(frame/4)*224,224,224,0,0,224,224);ctx.restore();
      }
    }
    function updateProgress(){
      const roll=Math.max(0,Math.min(1,(time-storyDuration())/rollDuration()));
      const track=q(".cinema-roll-track");
      drawCast();
      const distance=track.offsetHeight+q(".cinema-roll").offsetHeight;
      track.style.transform=`translate3d(0,${-roll*distance}px,0)`;
      panel.classList.toggle("roll-complete",index===data.chapters.length&&roll>=1);
      const percent=Math.min(100,time/Math.max(1,duration())*100);progressFill.style.transform=`scaleX(${percent/100})`;const rounded=Math.floor(percent);if(rounded!==progressMark){progress.setAttribute("aria-valuenow",String(rounded));progressMark=rounded;}}
    function jump(i){if(!active)return;time=i>=data.chapters.length?storyDuration():startAt(Math.max(0,i));show(i);updateProgress();}
    function togglePause(){if(!active)return;paused=!paused;pause.textContent=paused?"続きを見る":"一時停止";panel.classList.toggle("is-paused",paused);onPause(paused);}
    panel.addEventListener("click",event=>{const button=event.target.closest("[data-cinema]");if(!button)return;const action=button.dataset.cinema;if(action==="pause")togglePause();else if(action==="prev")jump(index-1);else if(action==="next")jump(index+1);else if(action==="replay"){start(options);onReplay();}});
    function start(nextOptions){
      options={...nextOptions};data=scriptFor(options.stage,options.character,options.reason);
      if(window.innerWidth<=700 || typeof navigator!=="undefined"&&navigator.maxTouchPoints>0) data.chapters=data.chapters.map(c=>({...c,image:c.image.replace(".webp","-mobile.webp")}));
      buildCast();q(".cinema-roll-song").textContent=data.track;q(".cinema-controls").append(resultButton);token++;active=true;paused=false;time=0;index=-1;progressMark=-1;
      screen.classList.add("cinema-active");screen.dataset.endingStage=data.stage;panel.classList.remove("is-paused");pause.textContent="一時停止";resultButton.textContent=options.returnLabel || "戦果へ";show(0);updateProgress();
    }
    function stop(){for(const sprite of castSprites)if(sprite.image){sprite.image.onload=null;sprite.image.removeAttribute("src");}castSprites=[];token++;imageToken++;active=false;paused=false;preload=null;screen.classList.remove("cinema-active");screen.append(resultButton);for(const image of images){image.onload=null;image.onerror=null;image.classList.remove("is-visible");image.removeAttribute("src");}}
    function update(dt){if(!active||paused||document.hidden)return;time=Math.min(duration(),time+Math.max(0,Math.min(dt,.2)));let next=0,at=0;for(const chapter of data.chapters){at+=chapter.duration;if(time>=at)next++;}if(next!==index)show(next);updateProgress();}
    return { start,stop,update,togglePause,jump,get active(){return active;},get paused(){return paused;},snapshot:()=>({active,paused,index,time,duration:duration(),stage:data?.stage}) };
  }
  window.CinematicEndings={create,scriptFor,musicFor:stage=>(definitions[stage]||definitions.sengoku).music};
})();
