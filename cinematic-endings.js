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
  function scriptFor(stage, character, reason) {
    const def=definitions[stage] || definitions.sengoku;
    return { ...def, stage:stage === "shrine" ? "shrine" : "sengoku",
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
      <div class="cinema-roll" aria-label="スタッフロール"><div class="cinema-roll-track"><section><p>HanaSaku ENTERTAINMENT</p><small>PRESENTS</small></section><section><small>DEVELOPED BY</small><p>HanaSaku PRODUCTIONS</p></section><section class="cinema-cast"><div class="cinema-cast-sprite" data-cast="hero-samurai"></div><small>隻眼の猫武者</small><p>ぴぃ丸</p><span>拾われたぬくもりを、誰かを守る力に。<br>小さな体に、折れない心を宿す。</span></section><section class="cinema-cast"><div class="cinema-cast-sprite" data-cast="denkichi"></div><small>ぴぃ丸の家族</small><p>伝吉</p><span>雨の中の小さな命を拾った、心優しき青年。<br>帰りを待つ灯りが、二人の強さになる。</span></section><section><small>ENDING MUSIC</small><p class="cinema-roll-song"></p></section><section><p>A HanaSaku GAME</p></section><section><p>HanaSaku©2026</p></section></div></div><div class="cinema-final-card">HanaSaku©2026</div><div class="cinema-dock"><div class="cinema-progress" role="progressbar" aria-label="物語の進行" aria-valuemin="0" aria-valuemax="100"><i></i></div>
      <div class="cinema-controls"><span class="cinema-count"></span><button type="button" data-cinema="prev" aria-label="前の場面" title="前の場面">‹</button><button type="button" data-cinema="pause">一時停止</button><button type="button" data-cinema="next" aria-label="次の場面" title="次の場面">›</button><button type="button" data-cinema="replay" aria-label="最初から見る" title="最初から見る">↻</button><span class="cinema-spacer"></span></div><p class="cinema-music"></p></div>`;
    screen.prepend(panel);
    const castSprites=[...panel.querySelectorAll("[data-cast]")];
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
    function updateProgress(){
      const roll=Math.max(0,Math.min(1,(time-storyDuration())/rollDuration()));
      const track=q(".cinema-roll-track");
      for(const holder of castSprites){const count=holder.dataset.cast==="denkichi"?3:4;holder.style.backgroundPosition=`${Math.floor(time*6)%count/3*100}% ${count===3?100:0}%`;}
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
      q(".cinema-roll-song").textContent=data.track;q(".cinema-controls").append(resultButton);token++;active=true;paused=false;time=0;index=-1;progressMark=-1;
      screen.classList.add("cinema-active");screen.dataset.endingStage=data.stage;panel.classList.remove("is-paused");pause.textContent="一時停止";resultButton.textContent=options.returnLabel || "戦果へ";show(0);updateProgress();
    }
    function stop(){token++;imageToken++;active=false;paused=false;preload=null;screen.classList.remove("cinema-active");screen.append(resultButton);for(const image of images){image.onload=null;image.onerror=null;image.classList.remove("is-visible");image.removeAttribute("src");}}
    function update(dt){if(!active||paused||document.hidden)return;time=Math.min(duration(),time+Math.max(0,Math.min(dt,.2)));let next=0,at=0;for(const chapter of data.chapters){at+=chapter.duration;if(time>=at)next++;}if(next!==index)show(next);updateProgress();}
    return { start,stop,update,togglePause,jump,get active(){return active;},get paused(){return paused;},snapshot:()=>({active,paused,index,time,duration:duration(),stage:data?.stage}) };
  }
  window.CinematicEndings={create,scriptFor,musicFor:stage=>(definitions[stage]||definitions.sengoku).music};
})();
