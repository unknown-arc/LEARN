(function(){
  DQ.initHUD({home:false});
  const stage=document.getElementById('stage'),host=document.getElementById('objects'),bubble=document.getElementById('bubble');
  const QUOTES=['“Small steps every day beat big plans someday.”','“Done is better than perfect.”','“Future you says thanks for studying now.”','“Debug the problem, not yourself.”','“Every expert once wrote a bad first draft.”'];
  const O=[
    {id:'board',  x:666,y:138,w:274,h:309,main:true,icon:'pin', label:'To-Do List',url:'todo.html',tip:'<b>To-Do Board</b><br>Pin your tasks!'},
    {id:'desk',   x:189,y:344,w:321,h:321,main:true,icon:'calc',label:'Grade Calculator',url:'grade-calculator.html',tip:'<b>Grade Calculator</b><br>Work out your marks!'},
    {id:'clock',  x:131,y:284,w:62,h:76,egg:1,tip:()=>{const d=new Date();return '🕒 It is <b>'+d.toLocaleTimeString([],{hour:'2-digit',minute:'2-digit'})+'</b>. Time to focus!'}},
    {id:'shelf',  x:419,y:88,w:196,h:227,egg:1,tip:'🏆 <b>Trophy shelf</b> — your badges live here.',act:()=>DQ.openBadges()},
    {id:'trash',  x:570,y:362,w:104,h:146,egg:1,tip:()=>'🗑 The bin has eaten <b>'+DQ.state.stats.deleted+'</b> deleted tasks.'},
    {id:'cabinet',x:679,y:421,w:415,h:345,egg:1,tip:()=>{const s=DQ.state.stats;return '📋 <b>Quest log</b><br>Results: '+s.calcs+' · Tasks done: '+s.done+'/'+s.added+'<br>Best score: '+(s.bestPct?s.bestPct.toFixed(1)+'%':'—')}},
    {id:'frame',  x:973,y:262,w:87,h:163,egg:1,tip:()=>QUOTES[Math.floor(Math.random()*QUOTES.length)]}
  ];
  const TOTAL=O.filter(o=>o.egg).length;
  let hideT;
  function show(o,el,sticky){
    const tip=typeof o.tip==='function'?o.tip():o.tip;bubble.innerHTML=tip;
    bubble.style.setProperty('--bx',o.x+o.w/2);bubble.style.setProperty('--by',o.y-(o.main?34:4));bubble.classList.add('show');
    clearTimeout(hideT);if(sticky)hideT=setTimeout(()=>bubble.classList.remove('show'),3600)}
  O.forEach(o=>{
    const b=document.createElement('button');b.className='obj';b.dataset.id=o.id;
    b.style.cssText=`--x:${o.x};--y:${o.y};--w:${o.w};--h:${o.h}`;b.setAttribute('aria-label',o.label||o.id);
    const img=document.createElement('img');img.src='assets/overview/'+o.id+'.webp';img.alt='';b.appendChild(img);host.appendChild(b);
    if(o.main){const m=document.createElement('div');m.className='marker';m.style.cssText=b.style.cssText;m.innerHTML=DQ.icon(o.icon);host.appendChild(m);
      b.addEventListener('pointerenter',()=>show(o,b));b.addEventListener('focus',()=>show(o,b));
      b.addEventListener('pointerleave',()=>bubble.classList.remove('show'));b.addEventListener('blur',()=>bubble.classList.remove('show'));
      b.addEventListener('click',()=>{DQ.sfx('pop');DQ.confetti(innerWidth/2,innerHeight/2,14);
        DQ.go(o.url,stage,((o.x+o.w/2)/1234*100)+'% '+((o.y+o.h/2)/864*100)+'%')});
    }else{
      b.addEventListener('click',e=>{DQ.sfx('pop');b.classList.remove('wiggle');void b.offsetWidth;b.classList.add('wiggle');
        show(o,b,true);if(o.act)o.act();
        if(DQ.found(o.id,TOTAL)){DQ.confetti(e.clientX,e.clientY,18)}update()})}
  });
  function update(){document.getElementById('secrets').textContent=Object.keys(DQ.state.found).length+'/'+TOTAL}
  update();
  // sunlight particles in the light shaft + sparkles on the lit floor patch
  new Dust(document.getElementById('dust'),{count:70,poly:[[368,190],[830,385],[1000,590],[900,700],[368,485]],
    sparkles:[[640,630,90],[790,600,80],[900,520,45],[720,680,60]]});
})();
