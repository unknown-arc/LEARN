/* Assignment 2 — Interactive To-Do List Manager (sticky notes on a cork board) */
(function(){
  DQ.initHUD({home:true});
  const list=document.getElementById('taskList'),form=document.getElementById('addForm'),input=document.getElementById('taskInput'),errBox=document.getElementById('taskErr');
  const totalEl=document.getElementById('total'),doneEl=document.getElementById('doneCount'),prog=document.getElementById('prog');
  const st=DQ.state.stats;

  /* ---- data: an ARRAY of task objects, kept in sync with the DOM ---- */
  let tasks=DQ.state.todos;                       // [{id,text,done,note,rot,xp}]
  // sticky-note artwork: [file,width,height] — the right size is chosen from the text length
  const NOTES={n01:[179,272],n02:[149,157],n03:[124,153],n04:[173,179],n05:[127,157],n06:[199,139],n07:[267,199],n08:[240,105],n09:[131,160],n10:[100,270],n11:[188,266],n12:[159,161]};
  const POOLS={s:['02','03','05','09','12'],m:['04','06','08','12','02'],l:['07','01','11']};
  function sizeClass(t){return t.length<=12?'s':t.length<=34?'m':'l'}
  function makeTask(text){
    const pool=POOLS[sizeClass(text)];
    return {id:Date.now().toString(36)+Math.random().toString(36).slice(2,6),text:text,done:false,
            note:pool[Math.floor(Math.random()*pool.length)],rot:+(Math.random()*6-3).toFixed(1),xp:false};
  }

  /* ---- DOM: build each note with createElement() ---- */
  function createNote(task,isNew){
    const dims=NOTES['n'+task.note];
    const li=document.createElement('li');
    li.className='note '+sizeClass(task.text)+(task.done?' done':'')+(isNew?' new':'');
    li.dataset.id=task.id;
    li.style.cssText='--w:'+dims[0]+';--h:'+dims[1]+';--r:'+task.rot+'deg';
    li.style.backgroundImage='url(assets/todo/note'+task.note+'.webp)';

    const inner=document.createElement('div');inner.className='in';
    const txt=document.createElement('div');txt.className='txt';
    const span=document.createElement('span');span.textContent=task.text;txt.appendChild(span);

    const row=document.createElement('div');row.className='row';
    const lab=document.createElement('label');lab.className='chk';
    const cb=document.createElement('input');cb.type='checkbox';cb.checked=task.done;cb.setAttribute('aria-label','Mark "'+task.text+'" as completed');
    const lbl=document.createElement('span');lbl.className='lbl';lbl.textContent='Done';lab.append(cb,lbl);
    const del=document.createElement('button');del.type='button';del.className='del';del.setAttribute('aria-label','Delete "'+task.text+'"');
    del.innerHTML='<svg viewBox="0 0 24 24"><path d="M6 6l12 12M18 6L6 18" stroke="#3b2f26" stroke-width="3.2" stroke-linecap="round"/></svg>';
    row.append(lab,del);inner.append(txt,row);li.appendChild(inner);
    if(task.done)addStamp(li);

    cb.addEventListener('change',e=>toggleTask(task,li,cb.checked,e));
    del.addEventListener('click',e=>deleteTask(task,li));
    return li;
  }
  function addStamp(li){if(li.querySelector('.stampdone'))return;const s=document.createElement('div');s.className='stampdone';s.textContent='DONE';li.appendChild(s)}

  function renderAll(){
    list.innerHTML='';
    tasks.forEach(t=>list.appendChild(createNote(t,false)));
    updateEmpty();updateCounts();
  }
  function updateEmpty(){
    let e=list.querySelector('.empty');
    if(tasks.length===0&&!e){e=document.createElement('li');e.className='empty';e.textContent='The board is empty! Write your first task below ↓';list.appendChild(e)}
    else if(tasks.length>0&&e)e.remove();
  }
  function updateCounts(){
    const done=tasks.filter(t=>t.done).length;
    totalEl.textContent=tasks.length;doneEl.textContent=done;
    prog.style.width=(tasks.length?done/tasks.length*100:0)+'%';
  }
  const persist=()=>{DQ.state.todos=tasks;DQ.save()};

  /* ---- actions ---- */
  function showError(msg){
    errBox.textContent=msg;input.classList.remove('bad');void input.offsetWidth;input.classList.add('bad');DQ.sfx('err');
    setTimeout(()=>{errBox.textContent='';input.classList.remove('bad')},2200);
  }
  function addTask(text,ev){
    text=text.trim();
    if(text===''){showError('Write something on the note first!');input.focus();return}
    const task=makeTask(text);tasks.push(task);persist();
    updateEmpty();
    const li=createNote(task,true);list.appendChild(li);updateCounts();
    li.scrollIntoView({block:'nearest',behavior:'smooth'});
    DQ.sfx('add');st.added++;DQ.save();
    DQ.addXP(5,'new sticky note',ev);DQ.unlock('first_task');
  }
  function toggleTask(task,li,checked,ev){
    task.done=checked;li.classList.toggle('done',checked);
    if(checked){
      addStamp(li);DQ.sfx('done');
      if(!task.xp){task.xp=true;st.done++;DQ.save();const r=li.getBoundingClientRect();DQ.confetti(r.left+r.width/2,r.top+r.height/2,16);DQ.addXP(10,'task completed',{clientX:r.left+r.width/2,clientY:r.top})}
    }else{const s=li.querySelector('.stampdone');if(s)s.remove();DQ.sfx('click')}
    persist();updateCounts();
    if(st.done>=5)DQ.unlock('five_done');
    if(tasks.length>=3&&tasks.every(t=>t.done)){DQ.unlock('clean_board');DQ.confetti()}
  }
  function deleteTask(task,li){
    DQ.sfx('del');li.classList.add('rip');
    tasks=tasks.filter(t=>t.id!==task.id);persist();
    st.deleted++;DQ.save();DQ.unlock('tidy');
    setTimeout(()=>{li.remove();updateEmpty();updateCounts()},480);
    updateCounts();
  }

  form.addEventListener('submit',e=>{e.preventDefault();const r=document.getElementById('addBtn').getBoundingClientRect();
    addTask(input.value,{clientX:r.left+r.width/2,clientY:r.top});input.value='';input.focus()});
  document.getElementById('clearDone').addEventListener('click',()=>{
    const gone=tasks.filter(t=>t.done);if(!gone.length){showError('No completed tasks to clear yet.');return}
    gone.forEach(t=>{const li=list.querySelector('[data-id="'+t.id+'"]');if(li)deleteTask(t,li)});
  });

  if(!DQ.state.seeded&&tasks.length===0){
    ['Build the Grade Calculator','Build the To-Do list','Submit Lab-7'].forEach((t,i)=>tasks.push(makeTask(t)));
    DQ.state.seeded=true;DQ.save();
  }
  renderAll();
  // sunlight dust drifting across the board + sparkles in the lit patch
  new Dust(document.getElementById('dust'),{count:60,poly:[[140,0],[520,0],[1060,864],[700,864]],sparkles:[[820,730,70],[760,640,60],[300,200,80]]});
})();
