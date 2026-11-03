/* Assignment 1 — Interactive Student Grade Calculator (+ gamified desk scene) */
(function(){
  DQ.initHUD({home:true});
  const $=s=>document.querySelector(s),$$=s=>[...document.querySelectorAll(s)];
  const stage=$('#stage'),sheet=$('#sheet'),history=$('#history'),form=$('#gradeForm'),resultBox=$('#result'),bubble=$('#bubble'),lcd=$('#lcd');
  const calcObj=$('[data-id=calculator]');
  const MAX=100,SUBJECTS=3;

  /* ---------- core logic (Assignment 1 requirements) ---------- */
  function getGrade(pct){            // A 80-100, B 60-79, C 40-59, F below 40
    if(pct>=80)return 'A';
    if(pct>=60)return 'B';
    if(pct>=40)return 'C';
    return 'F';
  }
  const REMARKS={A:'Outstanding work! 🌟',B:'Great job — keep climbing!',C:'You passed — a bit more practice!',F:'Don\'t give up — try again!'};
  const COLORS={A:'#4caf62',B:'#4a90d9',C:'#f0a020',F:'#e5533d'};
  function validateMark(raw){        // returns error text or '' (empty = valid)
    if(raw.trim()==='')return 'Please enter the marks.';
    const n=Number(raw);
    if(!Number.isFinite(n))return 'Enter a valid number.';
    if(n<0||n>MAX)return 'Marks must be between 0 and 100.';
    return '';
  }
  function setError(input,msg){
    const e=$('#e-'+(input.id==='sname'?'name':input.id));
    if(!e)return true;            // optional subject-name boxes have no error slot
    e.textContent=msg;
    input.setAttribute('aria-invalid',msg?'true':'false');
    if(msg){input.parentElement.classList.remove('shake');void input.offsetWidth;input.parentElement.classList.add('shake')}
    return !msg;
  }
  function validateAll(){
    let ok=true,first=null;
    const name=$('#sname');
    if(!setError(name,name.value.trim()===''?'Please enter the student name.':'')){ok=false;first=first||name}
    for(let i=1;i<=SUBJECTS;i++){
      const m=$('#m'+i);
      if(!setError(m,validateMark(m.value))){ok=false;first=first||m}
    }
    if(first)first.focus();
    return ok;
  }
  function computeResult(){
    const marks=[],names=[];
    for(let i=1;i<=SUBJECTS;i++){marks.push(Number($('#m'+i).value));names.push($('#n'+i).value.trim()||'Subject '+i)}
    const total=marks.reduce((a,b)=>a+b,0);
    const pct=Math.round(total/(MAX*SUBJECTS)*10000)/100;
    return {name:$('#sname').value.trim(),marks,names,total,pct,grade:getGrade(pct),at:Date.now()};
  }
  const fmt=n=>Number.isInteger(n)?String(n):n.toFixed(2).replace(/0+$/,'').replace(/\.$/,'');
  function esc(s){const d=document.createElement('div');d.textContent=s;return d.innerHTML}

  function showResult(r,saved){
    resultBox.hidden=false;
    resultBox.innerHTML=
      '<div class="stamp g-'+r.grade+'" aria-label="Grade '+r.grade+'">'+r.grade+'</div>'+
      '<h3>'+esc(r.name)+'</h3>'+
      '<div class="line"><div class="stat"><small>Total marks</small><b>'+fmt(r.total)+' / '+(MAX*SUBJECTS)+'</b></div>'+
      '<div class="stat"><small>Percentage</small><b>'+fmt(r.pct)+'%</b></div></div>'+
      '<div class="bar"><i style="background:'+COLORS[r.grade]+'"></i></div>'+
      '<div class="subbars">'+r.marks.map((m,i)=>'<div><span>'+esc(r.names[i])+'</span><div class="bar"><i style="background:'+COLORS[getGrade(m)]+'" data-w="'+m+'"></i></div><b>'+fmt(m)+'</b></div>').join('')+'</div>'+
      '<p class="remark">'+REMARKS[r.grade]+'</p>'+(saved?'<span class="saved">Saved to your previous calculations.</span>':'');
    requestAnimationFrame(()=>requestAnimationFrame(()=>{resultBox.querySelector('.bar i').style.width=r.pct+'%';resultBox.querySelectorAll('.subbars i').forEach(i=>i.style.width=i.dataset.w+'%')}));
    setTimeout(()=>DQ.sfx('stamp'),200);
    resultBox.scrollIntoView({behavior:'smooth',block:'nearest'});
  }

  /* ---------- LCD on the calculator ---------- */
  function lcdShow(v,animate){
    if(!animate){lcd.textContent=v;return}
    calcObj.classList.add('busy');let n=0;const t=setInterval(()=>{lcd.textContent=(Math.random()*100).toFixed(2);if(++n>8){clearInterval(t);lcd.textContent=v;calcObj.classList.remove('busy')}},55);
  }
  const last=DQ.state.lastResult;lcdShow(last?fmt(last.pct):'0.');

  /* ---------- submit ---------- */
  form.addEventListener('submit',e=>{
    e.preventDefault();
    if(!validateAll()){DQ.sfx('err');say('Check the highlighted fields ✏️',calcObj);return}
    const r=computeResult(),st=DQ.state.stats;
    showResult(r,true);lcdShow(fmt(r.pct),true);
    DQ.state.history.unshift(r);DQ.state.history=DQ.state.history.slice(0,30);DQ.state.lastResult=r;
    st.calcs++;if(r.grade==='A')st.aCount++;if(r.pct>st.bestPct)st.bestPct=r.pct;DQ.save();
    DQ.addXP(r.grade==='A'?30:20,r.grade==='A'?'result + grade A bonus':'result calculated');
    if(r.grade==='A'){DQ.unlock('honor_roll');DQ.confetti()}
    if(r.pct===100)DQ.unlock('perfect');
    DQ.unlock('first_sheet');if(st.calcs>=3)DQ.unlock('hat_trick');
  });
  form.addEventListener('reset',()=>{setTimeout(()=>{$$('#gradeForm input').forEach(i=>setError(i,''));resultBox.hidden=true;DQ.sfx('click');$('#sname').focus()},0)});
  // live validation: clear the error as soon as the value becomes valid; check marks when leaving a field
  $$('#gradeForm input.mk').forEach(i=>{
    i.addEventListener('input',()=>{if(i.getAttribute('aria-invalid')==='true'&&!validateMark(i.value))setError(i,'')});
    i.addEventListener('blur',()=>{if(i.value!=='')setError(i,validateMark(i.value))});
  });
  $('#sname').addEventListener('input',e=>{if(e.target.value.trim())setError(e.target,'')});

  /* ---------- panels ---------- */
  let openPanel=null;
  function open(p,originObj){
    closePanels(true);const o=originObj.dataset?originObj:null;
    p.style.transformOrigin=o?'20% 90%':'50% 50%';p.hidden=false;openPanel=p;DQ.sfx('pop');
    $$('.marker').forEach(m=>m.style.display='none');
    if(p===sheet)setTimeout(()=>$('#sname').focus({preventScroll:true}),350);
  }
  function closePanels(silent){[sheet,history].forEach(p=>p.hidden=true);openPanel=null;$$('.marker').forEach(m=>m.style.display='');if(!silent)DQ.sfx('click')}
  $$('[data-close]').forEach(b=>b.addEventListener('click',()=>closePanels()));
  document.addEventListener('keydown',e=>{if(e.key==='Escape'&&openPanel)closePanels()});

  function renderHistory(){
    const list=$('#histList'),h=DQ.state.history;list.innerHTML='';
    $('#histMeta').textContent=h.length?h.length+' saved · tap one to view it again':'';
    if(!h.length){const li=document.createElement('li');li.className='empty';li.style.display='block';li.textContent='Nothing here yet — click the blank paper stack to write your first sheet!';list.appendChild(li);return}
    h.forEach((r,idx)=>{
      const li=document.createElement('li');
      const g=document.createElement('div');g.className='g g-'+r.grade;g.textContent=r.grade;
      const mid=document.createElement('div');const b=document.createElement('b');b.textContent=r.name;
      const s=document.createElement('small');s.textContent=fmt(r.pct)+'% · '+fmt(r.total)+'/300 · '+new Date(r.at).toLocaleDateString([],{day:'numeric',month:'short'})+' '+new Date(r.at).toLocaleTimeString([],{hour:'2-digit',minute:'2-digit'});
      mid.append(b,s);
      const act=document.createElement('div');
      const view=document.createElement('button');view.className='mini';view.textContent='View';view.type='button';
      view.addEventListener('click',()=>{open(sheet,$('[data-id=documents]'));$('#sname').value=r.name;r.marks.forEach((m,i)=>{$('#m'+(i+1)).value=m;$('#n'+(i+1)).value=/^Subject \d$/.test(r.names[i])?'':r.names[i]});$$('#gradeForm input').forEach(i=>setError(i,''));showResult(r,false);lcdShow(fmt(r.pct))});
      const del=document.createElement('button');del.className='mini del';del.textContent='✕';del.type='button';del.setAttribute('aria-label','Delete '+r.name);
      del.addEventListener('click',()=>{DQ.state.history.splice(idx,1);DQ.save();DQ.sfx('del');renderHistory()});
      act.append(view,del);li.append(g,mid,act);list.appendChild(li);
    });
  }
  $('#clearHist').addEventListener('click',()=>{if(DQ.state.history.length&&confirm('Delete all previous calculations?')){DQ.state.history=[];DQ.state.lastResult=null;DQ.save();DQ.sfx('del');lcdShow('0.');renderHistory()}});
  $('#newFromHist').addEventListener('click',()=>{open(sheet,$('[data-id=papers]'))});

  /* ---------- scene interactions ---------- */
  let bt;function say(html,obj,ms){const d=obj.dataset;const x=+getComputedStyle(obj).getPropertyValue('--x'),y=+getComputedStyle(obj).getPropertyValue('--y'),w=+getComputedStyle(obj).getPropertyValue('--w');
    bubble.innerHTML=html;bubble.style.setProperty('--bx',x+w/2);bubble.style.setProperty('--by',y-6);bubble.classList.add('show');clearTimeout(bt);if(ms!==0)bt=setTimeout(()=>bubble.classList.remove('show'),ms||3200)}
  const hide=()=>bubble.classList.remove('show');
  function wiggle(el){el.classList.remove('wiggle');void el.offsetWidth;el.classList.add('wiggle')}
  const TIPS=['Study tip: 25 min focus, 5 min break.','Always double-check your marks!','A tidy desk is a tidy mind ✏️','Tip: press Esc to close a sheet.'];
  const hover={papers:'<b>New sheet</b><br>Write a fresh result',documents:'<b>Previous results</b><br>See your history',calculator:'<b>Calculator</b><br>Tap to calculate'};
  Object.keys(hover).forEach(k=>{const el=$('[data-id='+k+']');
    el.addEventListener('pointerenter',()=>say(hover[k],el,0));el.addEventListener('focus',()=>say(hover[k],el,0));
    el.addEventListener('pointerleave',hide);el.addEventListener('blur',hide)});
  $('[data-id=papers]').addEventListener('click',e=>{hide();open(sheet,e.currentTarget)});
  $('[data-id=documents]').addEventListener('click',e=>{hide();renderHistory();open(history,e.currentTarget)});
  calcObj.addEventListener('click',e=>{
    wiggle(calcObj);DQ.sfx('click');
    if(!sheet.hidden){form.requestSubmit()}
    else{say('Fill in a sheet first!<br>Opening one for you…',calcObj);setTimeout(()=>{hide();open(sheet,$('[data-id=papers]'))},650)}
  });
  $('[data-id=lamp]').addEventListener('click',()=>{const on=stage.classList.toggle('lamp-on');DQ.sfx(on?'ding':'click');say(on?'Lamp on 💡 cosy mode':'Lamp off ☀️',$('[data-id=lamp]'),1800)});
  $('[data-id=pencup]').addEventListener('click',e=>{const el=e.currentTarget;wiggle(el);DQ.sfx('pop');say(TIPS[Math.floor(Math.random()*TIPS.length)],el)});
  $('[data-id=notes]').addEventListener('click',e=>{const el=e.currentTarget;wiggle(el);DQ.sfx('pop');say('<b>Grade key</b><br>A 80–100 · B 60–79<br>C 40–59 · F below 40',el,4500)});
  ['clip1','clip2'].forEach(id=>$('[data-id='+id+']').addEventListener('click',e=>{wiggle(e.currentTarget);DQ.sfx('click')}));

  // markers
  [['papers','star'],['documents','trophy'],['calculator','calc']].forEach(([k,ic])=>{$('#mk-'+k).innerHTML=DQ.icon(ic)});

  // sunlight particles from the window onto the desk
  new Dust($('#dust'),{count:75,poly:[[360,130],[930,130],[1090,560],[230,660]],sparkles:[[560,520,100],[430,590,70],[760,470,60]]});
})();
