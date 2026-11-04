/* Shared layer: saved state, sound, HUD title bar, Explore panel. Plain script (works from file://). */
(function(){
  const KEY='deskquest.v1';
  const defaults={found:{},sound:true,stats:{calcs:0,added:0,done:0,deleted:0,bestPct:0,aCount:0},todos:[],seeded:false,history:[],lastResult:null};
  let state;
  try{state=Object.assign({},defaults,JSON.parse(localStorage.getItem(KEY)||'{}'));state.stats=Object.assign({},defaults.stats,state.stats)}
  catch(e){state=JSON.parse(JSON.stringify(defaults))}
  const DQ=window.DQ={state};
  DQ.save=function(){try{localStorage.setItem(KEY,JSON.stringify(state))}catch(e){}};

  /* ---------- line icons ---------- */
  const S='fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"';
  const I={
    home:'<path d="M3 11l9-8 9 8M5 10v10h5v-6h4v6h5V10"/>',
    explore:'<circle cx="12" cy="12" r="9"/><path d="M15.5 8.5l-2 5-5 2 2-5z"/>',
    sound:'<path d="M4 9v6h4l5 4V5L8 9z"/><path d="M16.5 8.5a5 5 0 0 1 0 7M19 6a9 9 0 0 1 0 12"/>',
    mute:'<path d="M4 9v6h4l5 4V5L8 9z"/><path d="M17 9l4 6M21 9l-4 6"/>',
    calc:'<rect x="5" y="3" width="14" height="18" rx="2"/><path d="M8 7h8M8 11h2M12 11h2M16 11h0M8 15h2M12 15h2M16 15h0M8 18h0"/>',
    pin:'<path d="M9 3h6l-1 6 3 3H7l3-3zM12 12v9"/>',
    clock:'<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
    shelf:'<path d="M4 4h16v16H4zM4 12h16M12 4v16"/>',
    bin:'<path d="M5 7h14M10 7V4h4v3M7 7l1 13h8l1-13"/>',
    cabinet:'<path d="M3 8h18v12H3zM3 12h18M10 10h4M10 16h4"/>',
    frame:'<rect x="5" y="3" width="14" height="18" rx="1"/><path d="M8 15c2-5 6-7 9-8-1 4-3 8-9 8z"/>'
  };
  DQ.icon=n=>'<svg viewBox="0 0 24 24" '+S+' aria-hidden="true">'+I[n]+'</svg>';

  /* ---------- sound ---------- */
  let ac;
  function tone(f,t0,d,type,vol){const o=ac.createOscillator(),g=ac.createGain();o.type=type||'sine';o.frequency.setValueAtTime(f,ac.currentTime+t0);
    g.gain.setValueAtTime(0,ac.currentTime+t0);g.gain.linearRampToValueAtTime(vol||.09,ac.currentTime+t0+.01);
    g.gain.exponentialRampToValueAtTime(.0001,ac.currentTime+t0+d);o.connect(g).connect(ac.destination);o.start(ac.currentTime+t0);o.stop(ac.currentTime+t0+d+.02)}
  const SFX={click:[[620,0,.05,'sine',.07]],pop:[[420,0,.05,'sine',.07],[640,.04,.08,'sine',.06]],ding:[[880,0,.18,'sine'],[1320,.08,.26,'sine']],
    add:[[360,0,.06,'triangle',.07],[620,.05,.1,'triangle',.07]],done:[[523,0,.09,'sine'],[659,.07,.09,'sine'],[784,.14,.18,'sine']],
    del:[[320,0,.07,'triangle',.06],[200,.06,.12,'triangle',.06]],err:[[170,0,.16,'sawtooth',.05],[150,.09,.16,'sawtooth',.05]],
    stamp:[[110,0,.16,'square',.1],[80,.02,.2,'sawtooth',.05]],whoosh:[[300,0,.3,'sine',.05],[560,.1,.3,'sine',.04]]};
  DQ.sfx=function(n){if(!state.sound||!SFX[n])return;try{ac=ac||new (window.AudioContext||window.webkitAudioContext)();if(ac.state==='suspended')ac.resume();SFX[n].forEach(a=>tone(a[0],a[1],a[2],a[3],a[4]))}catch(e){}};

  DQ.toast=function(title,text){const w=document.querySelector('.toasts');if(!w)return;const t=document.createElement('div');t.className='toast';
    t.innerHTML='<b></b><span></span>';t.querySelector('b').textContent=title;t.querySelector('span').textContent=text||'';w.appendChild(t);setTimeout(()=>t.remove(),3100)};

  /* ---------- Explore ---------- */
  const PLACES=[
    {id:'calc',name:'Grade Calculator',desc:'Assignment 1 · total, percentage and grade',url:'grade-calculator.html',icon:'calc'},
    {id:'todo',name:'To-Do Board',desc:'Assignment 2 · add, complete and delete tasks',url:'todo.html',icon:'pin'}];
  const SECRETS=[
    {id:'clock',name:'Wall Clock',desc:'Check the time without leaving your desk.',icon:'clock'},
    {id:'shelf',name:'Wall Shelf',desc:'Opens the Explore panel.',icon:'shelf'},
    {id:'trash',name:'Waste Bin',desc:'Keeps count of every task you delete.',icon:'bin'},
    {id:'cabinet',name:'Storage Unit',desc:'Your activity log for this session.',icon:'cabinet'},
    {id:'frame',name:'Framed Print',desc:'A quote to keep you going.',icon:'frame'}];
  DQ.TOTAL=PLACES.length+SECRETS.length;
  DQ.foundCount=()=>Object.keys(state.found).length;
  DQ.discover=function(id,label){if(state.found[id])return false;state.found[id]=Date.now();DQ.save();
    DQ.toast('Discovered',label+'  ·  '+DQ.foundCount()+' / '+DQ.TOTAL);DQ.sfx('ding');DQ.renderHUD();return true};
  function row(o,isPlace){
    const on=!!state.found[o.id],li=document.createElement('li');li.className='xitem'+(on||isPlace?' on':'');
    const ic=document.createElement('div');ic.className='ic';ic.innerHTML=DQ.icon(on||isPlace?o.icon:'explore');
    const mid=document.createElement('div');const b=document.createElement('b'),s=document.createElement('small');
    b.textContent=on||isPlace?o.name:'Undiscovered';s.textContent=on||isPlace?o.desc:'Look around the room — something is hidden here.';mid.append(b,s);
    li.append(ic,mid);
    if(isPlace){const a=document.createElement('a');a.className='go';a.href=o.url;a.textContent=on?'Open':'Enter';li.appendChild(a)}
    else{const st=document.createElement('span');st.className='st';st.textContent=on?'Discovered':'Locked';li.appendChild(st)}
    return li}
  DQ.openExplore=function(){const m=document.getElementById('exploreModal'),n=DQ.foundCount();
    m.querySelector('.meter i').style.width=(n/DQ.TOTAL*100)+'%';m.querySelector('.count').textContent=n+' / '+DQ.TOTAL+' discovered';
    const L=m.querySelector('#xPlaces'),T=m.querySelector('#xSecrets');L.innerHTML='';T.innerHTML='';
    PLACES.forEach(p=>L.appendChild(row(p,true)));SECRETS.forEach(p=>T.appendChild(row(p,false)));
    m.classList.add('open');m.querySelector('button.close').focus({preventScroll:true});m.querySelector('.explore').scrollTop=0};

  /* ---------- HUD ---------- */
  DQ.renderHUD=function(){const h=document.querySelector('.hud');if(!h)return;
    const c=h.querySelector('#exploreBtn em');if(c)c.textContent=DQ.foundCount()+'/'+DQ.TOTAL;
    const s=h.querySelector('.snd');s.innerHTML=DQ.icon(state.sound?'sound':'mute');s.classList.toggle('off',!state.sound)};
  DQ.initHUD=function(opts){opts=opts||{};
    const hud=document.createElement('header');hud.className='hud';
    hud.innerHTML='<div class="titlebar"><span class="tag">[ARC]</span><span>Practice set</span><span class="sep">|</span><span>LAB - 7</span></div>'+
      '<nav class="hbtns">'+(opts.home?'<a class="hbtn" href="index.html" id="homeBtn" aria-label="Back to the room" title="Back to the room">'+DQ.icon('home')+'<span>Room</span></a>':'')+
      '<button class="hbtn" id="exploreBtn" aria-label="Explore" title="Explore">'+DQ.icon('explore')+'<span>Explore</span><em>0/0</em></button>'+
      '<button class="hbtn snd" id="sndBtn" aria-label="Toggle sound" title="Sound"></button></nav>';
    document.body.append(hud);
    const tw=document.createElement('div');tw.className='toasts';tw.setAttribute('aria-live','polite');document.body.append(tw);
    const m=document.createElement('div');m.className='modal';m.id='exploreModal';
    m.innerHTML='<div class="explore" role="dialog" aria-label="Explore"><h2>Explore</h2><p class="sub">Find every location and hidden object in the study room.</p>'+
      '<div class="meter"><i></i></div><div class="count"></div><h3>Locations</h3><ul class="xlist" id="xPlaces"></ul><h3>Hidden objects</h3><ul class="xlist" id="xSecrets"></ul>'+
      '<button class="btn close" type="button">Close</button></div>';
    document.body.append(m);
    m.addEventListener('click',e=>{if(e.target===m||e.target.classList.contains('close'))m.classList.remove('open')});
    document.addEventListener('keydown',e=>{if(e.key==='Escape')m.classList.remove('open')});
    hud.querySelector('#exploreBtn').onclick=()=>{DQ.sfx('click');DQ.openExplore()};
    hud.querySelector('#sndBtn').onclick=()=>{state.sound=!state.sound;DQ.save();DQ.renderHUD();DQ.sfx('click')};
    const f=document.createElement('div');f.className='fade';document.body.append(f);DQ.fade=f;
    if(opts.visit)DQ.discover(opts.visit.id,opts.visit.name);
    DQ.renderHUD();
    addEventListener('pageshow',e=>{if(e.persisted){f.classList.remove('on');document.querySelector('.stage')?.classList.remove('zoom')}});
  };
  DQ.go=function(url,stage,origin){DQ.sfx('whoosh');if(stage&&origin){stage.style.transformOrigin=origin;stage.classList.add('zoom')}
    setTimeout(()=>DQ.fade.classList.add('on'),380);setTimeout(()=>{location.href=url},820)};
})();
