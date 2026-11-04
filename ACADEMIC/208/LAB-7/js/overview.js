(function(){
  DQ.initHUD({home:false});
  const stage=document.getElementById('stage'),rig=stage.querySelector('.rig'),host=document.getElementById('objects'),bubble=document.getElementById('bubble');
  const QUOTES=['Small steps every day beat big plans someday.','Done is better than perfect.','Future you says thanks for studying now.','Debug the problem, not yourself.','Every expert once wrote a bad first draft.'];
  // order = priority when cutouts overlap
  const O=[
    {id:'desk',   main:true,label:'Grade Calculator',url:'grade-calculator.html'},
    {id:'board',  main:true,label:'To-Do Board',url:'todo.html'},
    {id:'cabinet',name:'Storage Unit',tip:()=>{const s=DQ.state.stats;return '<b>Activity log</b>Results calculated: '+s.calcs+'<br>Tasks completed: '+s.done+' of '+s.added+' added<br>Best score: '+(s.bestPct?s.bestPct.toFixed(1)+'%':'none yet')}},
    {id:'shelf',  name:'Wall Shelf',tip:'<b>Wall shelf</b>Opening the Explore panel.',act:()=>setTimeout(()=>DQ.openExplore(),350)},
    {id:'trash',  name:'Waste Bin',tip:()=>'<b>Waste bin</b>'+DQ.state.stats.deleted+' deleted task'+(DQ.state.stats.deleted===1?'':'s')+' so far.'},
    {id:'frame',  name:'Framed Print',tip:()=>'<b>Framed print</b>'+QUOTES[Math.floor(Math.random()*QUOTES.length)]},
    {id:'clock',  name:'Wall Clock',tip:()=>{const t=new Date().toLocaleTimeString([],{hour:'2-digit',minute:'2-digit'});return '<b>Wall clock</b>It is '+t+'.'}}
  ];
  const bits=b64=>{const s=atob(b64),u=new Uint8Array(s.length);for(let i=0;i<s.length;i++)u[i]=s.charCodeAt(i);return u};
  let cur=null,hideT;

  O.forEach(o=>{
    const m=HIT[o.id];Object.assign(o,{x:m.x,y:m.y,w:m.w,h:m.h,gw:m.gw,gh:m.gh,bits:bits(m.b)});
    const pos='--x:'+o.x+';--y:'+o.y+';--w:'+o.w+';--h:'+o.h;
    const b=document.createElement('button');b.className='obj';b.dataset.id=o.id;b.style.cssText=pos;b.setAttribute('aria-label',o.label||o.name);
    const img=document.createElement('img');img.src='assets/overview/'+o.id+'.webp';img.alt='';b.appendChild(img);host.appendChild(b);o.btn=b;
    b.addEventListener('click',()=>activate(o));                       // keyboard (Enter/Space)
    b.addEventListener('focus',()=>setHot(o,true));b.addEventListener('blur',()=>setHot(null));
    if(o.main){const mk=document.createElement('div');mk.className='marker';mk.style.cssText=pos;
      mk.innerHTML='<div class="tag"><i class="dot"></i><span>'+o.label+'</span></div><i class="stem"></i>';host.appendChild(mk)}
  });

  // alpha-accurate hit test (only the visible shape of an object reacts, not its bounding box)
  function hit(cx,cy){
    const r=rig.getBoundingClientRect(),x=(cx-r.left)/r.width*1234,y=(cy-r.top)/r.height*864;
    for(const o of O){
      if(x<o.x||y<o.y||x>=o.x+o.w||y>=o.y+o.h)continue;
      const gx=Math.floor((x-o.x)/4),gy=Math.floor((y-o.y)/4),i=gy*o.gw+gx;
      if(o.bits[i>>3]&(128>>(i&7)))return o;
    }
    return null;
  }
  function setHot(o,fromFocus){
    if(o===cur)return;
    if(cur)cur.btn.classList.remove('hot');
    cur=o;
    rig.classList.toggle('focus',!!o);stage.classList.toggle('pick',!!o&&!fromFocus);
    if(o){o.btn.classList.add('hot');if(!o.main)show(o)}else bubble.classList.remove('show');
  }
  function show(o,sticky){const tip=typeof o.tip==='function'?o.tip():o.tip;
    bubble.innerHTML=tip;bubble.style.setProperty('--bx',o.x+o.w/2);bubble.style.setProperty('--by',o.y-6);bubble.classList.add('show');
    clearTimeout(hideT);if(sticky)hideT=setTimeout(()=>{if(!cur)bubble.classList.remove('show')},3800)}
  function activate(o){
    DQ.sfx('pop');
    if(o.main){DQ.go(o.url,stage,((o.x+o.w/2)/1234*100)+'% '+((o.y+o.h/2)/864*100)+'%');return}
    const img=o.btn.firstChild;img.parentNode.classList.remove('wiggle');void o.btn.offsetWidth;o.btn.classList.add('wiggle');
    show(o,true);if(o.act)o.act();DQ.discover(o.id,o.name);update();
  }
  stage.addEventListener('pointermove',e=>setHot(hit(e.clientX,e.clientY)));
  stage.addEventListener('pointerdown',e=>setHot(hit(e.clientX,e.clientY)));
  stage.addEventListener('pointerleave',()=>setHot(null));
  stage.addEventListener('click',e=>{if(e.target.closest('.obj'))return;const o=hit(e.clientX,e.clientY);if(o)activate(o)});
  function update(){document.getElementById('secrets').textContent=DQ.foundCount()+'/'+DQ.TOTAL}
  update();
})();
