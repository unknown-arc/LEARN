/* Desk Quest — shared game layer: state, XP, badges, sound, HUD. Plain script (works from file://). */
(function(){
  const KEY='deskquest.v1';
  const defaults={xp:0,badges:{},found:{},sound:true,
    stats:{calcs:0,added:0,done:0,deleted:0,bestPct:0,aCount:0},todos:[],seeded:false,history:[],lastResult:null};
  let state;
  try{state=Object.assign({},defaults,JSON.parse(localStorage.getItem(KEY)||'{}'));
      state.stats=Object.assign({},defaults.stats,state.stats)}catch(e){state=JSON.parse(JSON.stringify(defaults))}
  const DQ=window.DQ={state};
  DQ.save=function(){try{localStorage.setItem(KEY,JSON.stringify(state))}catch(e){}};

  /* ---------- icons ---------- */
  const I={
    home:'<path d="M3 11l9-8 9 8v9a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1z" fill="currentColor"/>',
    trophy:'<path d="M7 3h10v5a5 5 0 0 1-10 0zM4 4h3v3a2 2 0 0 1-3-2zM20 4h-3v3a2 2 0 0 0 3-2zM11 13h2v4h3v3H8v-3h3z" fill="currentColor"/>',
    sound:'<path d="M4 9v6h4l5 4V5L8 9zM16 8a5 5 0 0 1 0 8M18.5 5.5a9 9 0 0 1 0 13" fill="currentColor" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/>',
    mute:'<path d="M4 9v6h4l5 4V5L8 9z" fill="currentColor"/><path d="M16 9l5 6M21 9l-5 6" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>',
    calc:'<path d="M6 2h12a2 2 0 0 1 2 2v16a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2zm1 3v4h10V5zm1 7a1.3 1.3 0 1 0 .01 0zm4 0a1.3 1.3 0 1 0 .01 0zm4 0a1.3 1.3 0 1 0 .01 0zM8 16a1.3 1.3 0 1 0 .01 0zm4 0a1.3 1.3 0 1 0 .01 0zm4 0a1.3 1.3 0 1 0 .01 0z" fill="currentColor"/>',
    pin:'<path d="M14 2l8 8-3 1-4 4 .5 5-2 2-4.5-4.5L3 22l-1-1 4.5-5.5L2 11l2-2 5 .5 4-4z" fill="currentColor"/>',
    star:'<path d="M12 2l3 7 7.5.6-5.7 4.9 1.8 7.4L12 18l-6.6 3.9 1.8-7.4L1.5 9.6 9 9z" fill="currentColor"/>'
  };
  DQ.icon=n=>'<svg viewBox="0 0 24 24" aria-hidden="true">'+I[n]+'</svg>';

  /* ---------- sound (tiny WebAudio blips) ---------- */
  let ac;
  function tone(f,t0,d,type,vol){
    const o=ac.createOscillator(),g=ac.createGain();o.type=type||'sine';o.frequency.setValueAtTime(f,ac.currentTime+t0);
    g.gain.setValueAtTime(0,ac.currentTime+t0);g.gain.linearRampToValueAtTime(vol||.12,ac.currentTime+t0+.012);
    g.gain.exponentialRampToValueAtTime(.0001,ac.currentTime+t0+d);o.connect(g).connect(ac.destination);o.start(ac.currentTime+t0);o.stop(ac.currentTime+t0+d+.02)}
  const S={click:[[520,0,.08,'triangle']],pop:[[380,0,.06,'square',.07],[700,.05,.09,'triangle']],
    ding:[[880,0,.2,'sine'],[1320,.09,.3,'sine']],add:[[330,0,.07,'square',.07],[660,.06,.14,'triangle']],
    done:[[523,0,.1,'triangle'],[659,.08,.1,'triangle'],[784,.16,.2,'triangle']],
    del:[[400,0,.08,'sawtooth',.06],[220,.07,.14,'sawtooth',.06]],err:[[160,0,.18,'sawtooth',.09],[140,.1,.18,'sawtooth',.09]],
    level:[[523,0,.12,'triangle'],[659,.1,.12,'triangle'],[784,.2,.12,'triangle'],[1047,.3,.4,'triangle']],
    stamp:[[120,0,.18,'square',.16],[90,.02,.25,'sawtooth',.08]],whoosh:[[300,0,.3,'sine',.06],[600,.1,.3,'sine',.05]]};
  DQ.sfx=function(n){ if(!state.sound||!S[n])return; try{ac=ac||new (window.AudioContext||window.webkitAudioContext)();if(ac.state==='suspended')ac.resume();S[n].forEach(a=>tone(a[0],a[1],a[2],a[3],a[4]))}catch(e){} };

  /* ---------- levels / xp ---------- */
  const TITLES=['Rookie Student','Note Taker','Desk Warrior','Study Ninja','Honor Scholar','Grand Scholar'];
  DQ.levelInfo=function(xp){let l=1,need=100,rest=xp;while(rest>=need){rest-=need;l++;need=100+(l-1)*50}return{level:l,into:rest,need,title:TITLES[Math.min(l-1,TITLES.length-1)]}};
  DQ.toast=function(html,cls){const w=document.querySelector('.toasts');if(!w)return;const t=document.createElement('div');t.className='toast '+(cls||'');t.innerHTML=html;w.appendChild(t);setTimeout(()=>t.remove(),2700)};
  DQ.addXP=function(n,why,ev,quiet){
    const before=DQ.levelInfo(state.xp).level;state.xp+=n;DQ.save();
    if(!quiet)DQ.toast('<span class="xp">+'+n+' XP</span> '+(why||''));
    if(ev&&ev.clientX!=null){const f=document.createElement('div');f.className='floatxp';f.textContent='+'+n;f.style.left=ev.clientX+'px';f.style.top=ev.clientY+'px';document.body.appendChild(f);setTimeout(()=>f.remove(),1300)}
    const after=DQ.levelInfo(state.xp).level;DQ.renderHUD();
    if(after>before){DQ.sfx('level');DQ.confetti();const L=document.createElement('div');L.className='levelup';
      L.innerHTML='<div>LEVEL UP!<small>Level '+after+' · '+DQ.levelInfo(state.xp).title+'</small></div>';document.body.appendChild(L);setTimeout(()=>L.remove(),2300)}
  };
  DQ.confetti=function(x,y,n){x=x==null?innerWidth/2:x;y=y==null?innerHeight/2:y;const cols=['#ff6b6b','#ffd36b','#6fd17b','#5aa9ff','#c58bff'];
    for(let i=0;i<(n||36);i++){const c=document.createElement('i');c.className='confetti';c.style.left=x+'px';c.style.top=y+'px';c.style.background=cols[i%5];document.body.appendChild(c);
      const a=Math.random()*Math.PI*2,v=120+Math.random()*260;
      c.animate([{transform:'translate(0,0) rotate(0)',opacity:1},{transform:`translate(${Math.cos(a)*v}px,${Math.sin(a)*v+260}px) rotate(${Math.random()*720}deg)`,opacity:0}],{duration:1100+Math.random()*700,easing:'cubic-bezier(.2,.7,.4,1)'}).onfinish=()=>c.remove()}};

  /* ---------- badges ---------- */
  const BADGES={
    first_sheet:['First Sheet','Calculate your first result','✎'],honor_roll:['Honor Roll','Earn an A grade','★'],
    perfect:['Perfectionist','Score 100%','♛'],hat_trick:['Hat-trick','Calculate 3 results','3'],
    first_task:['Sticky Starter','Add your first task','＋'],five_done:['Board Boss','Complete 5 tasks','✔'],
    clean_board:['Clean Slate','Finish every task (3+)','✿'],tidy:['Tidy Up','Delete a task','✂'],
    explorer:['Room Explorer','Find all 5 secrets in the room','⌕']};
  DQ.BADGES=BADGES;
  DQ.unlock=function(id){if(state.badges[id]||!BADGES[id])return;state.badges[id]=Date.now();DQ.save();DQ.sfx('ding');
    DQ.toast('🏅 Badge: <b>'+BADGES[id][0]+'</b> · +15 XP','badge');DQ.addXP(15,'',null,true);DQ.renderHUD()};
  DQ.openBadges=function(){const m=document.getElementById('badgeModal');const g=m.querySelector('.badges');g.innerHTML='';
    Object.keys(BADGES).forEach(k=>{const b=BADGES[k],d=document.createElement('div');d.className='badge'+(state.badges[k]?'':' locked');
      d.innerHTML='<div class="ico">'+b[2]+'</div><b>'+b[0]+'</b><span>'+b[1]+'</span>';g.appendChild(d)});
    m.classList.add('open');m.querySelector('button.close').focus()};
  DQ.found=function(id,total){if(state.found[id])return false;state.found[id]=1;DQ.save();const n=Object.keys(state.found).length;
    DQ.addXP(5,'secret found '+n+'/'+total);if(n>=total)DQ.unlock('explorer');return true};

  /* ---------- HUD ---------- */
  DQ.renderHUD=function(){const li=DQ.levelInfo(state.xp),h=document.querySelector('.hud');if(!h)return;
    h.querySelector('.lvl').textContent=li.level;h.querySelector('.ptitle').textContent=li.title;
    h.querySelector('.xpbar i').style.width=(li.into/li.need*100)+'%';h.querySelector('.xptext').textContent=li.into+' / '+li.need+' XP';
    h.querySelector('.count').textContent=Object.keys(state.badges).length;
    const s=h.querySelector('.snd');s.innerHTML=DQ.icon(state.sound?'sound':'mute');s.classList.toggle('off',!state.sound)};
  DQ.initHUD=function(opts){opts=opts||{};
    const hud=document.createElement('header');hud.className='hud';
    hud.innerHTML='<div class="player"><div class="lvl">1</div><div class="pinfo"><span class="ptitle"></span><div class="xpbar"><i></i></div><span class="xptext"></span></div></div>'+
      '<div class="hbtns">'+(opts.home?'<a class="ibtn" href="index.html" id="homeBtn" aria-label="Back to the room" title="Back to the room">'+DQ.icon('home')+'</a>':'')+
      '<button class="ibtn" id="badgeBtn" aria-label="Badges" title="Badges">'+DQ.icon('trophy')+'<span class="count">0</span></button>'+
      '<button class="ibtn snd" id="sndBtn" aria-label="Toggle sound" title="Sound"></button></div>';
    document.body.append(hud);
    const tw=document.createElement('div');tw.className='toasts';tw.setAttribute('aria-live','polite');document.body.append(tw);
    const m=document.createElement('div');m.className='modal';m.id='badgeModal';
    m.innerHTML='<div class="card" role="dialog" aria-label="Badges"><h2>Your Badges</h2><p class="sub">Unlock them by using the room!</p><div class="badges"></div><button class="btn close">Close</button></div>';
    document.body.append(m);
    m.addEventListener('click',e=>{if(e.target===m||e.target.classList.contains('close'))m.classList.remove('open')});
    document.addEventListener('keydown',e=>{if(e.key==='Escape')m.classList.remove('open')});
    hud.querySelector('#badgeBtn').onclick=()=>{DQ.sfx('click');DQ.openBadges()};
    hud.querySelector('#sndBtn').onclick=()=>{state.sound=!state.sound;DQ.save();DQ.renderHUD();DQ.sfx('click')};
    const f=document.createElement('div');f.className='fade';document.body.append(f);DQ.fade=f;
    DQ.renderHUD();
    addEventListener('pageshow',e=>{if(e.persisted){f.classList.remove('on');document.querySelector('.stage')?.classList.remove('zoom')}});
  };
  DQ.go=function(url,stage,origin){DQ.sfx('whoosh');if(stage&&origin){stage.style.transformOrigin=origin;stage.classList.add('zoom')}
    setTimeout(()=>DQ.fade.classList.add('on'),380);setTimeout(()=>{location.href=url},820)};
  DQ.pad=n=>String(n).padStart(2,'0');
})();
