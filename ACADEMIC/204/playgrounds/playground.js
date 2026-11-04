const params=new URLSearchParams(location.search);
const lab=params.get("lab")||"";
const root=`../${decodeURIComponent(lab)}/`;
const repo="https://github.com/unknown-arc/LEARN/tree/main/ACADEMIC/204/";
const $=s=>document.querySelector(s);
const esc=s=>String(s).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));

function renderText(src){
  let s=esc(src.replace(/\r/g,""));
  s=s.replace(/^### (.+)$/gm,"<h3>$1</h3>").replace(/^## (.+)$/gm,"<h2>$1</h2>").replace(/^# (.+)$/gm,"<h1>$1</h1>");
  s=s.replace(/\*\*(.+?)\*\*/g,"<strong>$1</strong>").replace(/\*(.+?)\*/g,"<em>$1</em>");
  s=s.replace(/^(?:[-*] .+(?:\n|$))+/gm,block=>"<ul>"+block.trim().split("\n").map(x=>"<li>"+x.replace(/^[-*] /,"")+"</li>").join("")+"</ul>");
  return s.split(/\n{2,}/).map(part=>/^(<h[1-3]|<ul)/.test(part.trim())?part:"<p>"+part.replace(/\n/g,"<br>")+"</p>").join("");
}
function tab(name){
  document.querySelectorAll(".tabs button").forEach(b=>b.classList.toggle("active",b.dataset.tab===name));
  document.querySelectorAll(".pane").forEach(p=>p.classList.toggle("active",p.id===`${name}-pane`));
}
$("#tabs").addEventListener("click",e=>{const b=e.target.closest("button[data-tab]");if(b)tab(b.dataset.tab);});

async function load(){
  $("#lab-name").textContent=lab||"LAB NOT SPECIFIED";
  $("#github-url").href=repo+encodeURIComponent(decodeURIComponent(lab));
  if(!lab){$("#task-content").textContent="No lab selected.";return;}
  try{
    const r=await fetch(root+"Task.txt");if(!r.ok)throw new Error("Task.txt not found");
    $("#task-content").innerHTML=renderText(await r.text());
  }catch(e){$("#task-content").innerHTML='<p class="empty">Task.txt was not found in this LAB folder.</p>';}
  try{
    const r=await fetch("../labs.json");const labs=await r.json();
    const item=labs.find(x=>x.folder===decodeURIComponent(lab));
    if(!item)throw new Error("Lab metadata missing");
    renderCircuits(item.circuits||[]);
    renderOthers(item.other_files||[]);
  }catch(e){$("#circuit-list").innerHTML='<p class="empty">Run get_204_labs.py to generate resource metadata.</p>';}
}
function renderCircuits(names){
  const el=$("#circuit-list");el.innerHTML="";
  if(!names.length){el.innerHTML='<p class="empty">No .circ files found in this lab.</p>';return;}
  names.forEach((name,i)=>{
    const b=document.createElement("button");b.className="file-button";b.textContent=name;
    b.addEventListener("click",()=>{el.querySelectorAll("button").forEach(x=>x.classList.remove("selected"));b.classList.add("selected");showCircuit(name);});
    el.append(b);if(i===0)b.click();
  });
}
async function showCircuit(name){
  const box=$("#circuit-view");box.innerHTML='<p class="empty">Loading circuit...</p>';
  const url=root+name.split("/").map(encodeURIComponent).join("/");
  try{
    const r=await fetch(url);if(!r.ok)throw new Error("Could not load circuit");
    const raw=await r.text();
    const parser=new DOMParser(),doc=parser.parseFromString(raw,"application/xml");
    if(doc.querySelector("parsererror"))throw new Error("Unrecognized circuit XML");

    const circuit=doc.querySelector("circuit");
    const comps=circuit?[...circuit.querySelectorAll(":scope > comp")]:[...doc.querySelectorAll("comp")];
    const wires=circuit?[...circuit.querySelectorAll(":scope > wire")]:[...doc.querySelectorAll("wire")];
    const parsePoint=v=>{const m=(v||"").match(/\(\s*(-?\d+)\s*,\s*(-?\d+)\s*\)/);return m?{x:+m[1],y:+m[2]}:null;};
    const items=comps.map(c=>({node:c,name:c.getAttribute("name")||"Component",p:parsePoint(c.getAttribute("loc")),attrs:[...c.querySelectorAll(":scope > a")].map(a=>`${a.getAttribute("name")}=${a.getAttribute("val")}`).join(", ")})).filter(x=>x.p);
    const segments=wires.map(w=>({a:parsePoint(w.getAttribute("from")),b:parsePoint(w.getAttribute("to"))})).filter(w=>w.a&&w.b);
    const pts=[...items.map(x=>x.p),...segments.flatMap(w=>[w.a,w.b])];
    if(!pts.length)throw new Error("No positioned circuit components or wires were found in this file.");
    const minX=Math.min(...pts.map(p=>p.x))-50,maxX=Math.max(...pts.map(p=>p.x))+70;
    const minY=Math.min(...pts.map(p=>p.y))-50,maxY=Math.max(...pts.map(p=>p.y))+50;
    const width=Math.max(300,maxX-minX),height=Math.max(180,maxY-minY);
    const ns="http://www.w3.org/2000/svg";
    const svg=document.createElementNS(ns,"svg");
    svg.setAttribute("viewBox",`${minX} ${minY} ${width} ${height}`);
    svg.setAttribute("width",width);svg.setAttribute("height",height);
    svg.style.cssText="display:block;max-width:100%;height:auto;background-color:#fff;background-image:radial-gradient(#d5d1c7 1px,transparent 1px);background-size:10px 10px";
    const add=(tag,attrs,parent=svg)=>{const n=document.createElementNS(ns,tag);Object.entries(attrs).forEach(([k,v])=>n.setAttribute(k,v));parent.append(n);return n;};

    // Draw wire segments first so components sit above them.
    segments.forEach(w=>add("line",{x1:w.a.x,y1:w.a.y,x2:w.b.x,y2:w.b.y,stroke:"#171717","stroke-width":2}));
    items.forEach(item=>{
      const x=item.p.x,y=item.p.y,label=item.name;
      const group=add("g",{});
      const pin=/pin/i.test(label),gate=/and|or|xor|not|nand|nor|xnor/i.test(label);
      const w=pin?18:gate?42:54,h=pin?18:gate?32:28;
      add("rect",{x:x-w/2,y:y-h/2,width:w,height:h,rx:pin?0:2,fill:pin?"#c8f169":gate?"#ff8fc7":"#9bd8ff",stroke:"#171717","stroke-width":2},group);
      const t=add("text",{x,y:y+4,"text-anchor":"middle","font-size":pin?8:9,"font-family":"monospace","font-weight":"bold",fill:"#171717"},group);
      t.textContent=label.length>9?label.slice(0,8)+"…":label;
      const attrs=item.attrs;
      if(attrs){const small=add("text",{x:x+ w/2+5,y:y+3,"font-size":7,"font-family":"monospace",fill:"#555"},group);small.textContent=attrs.slice(0,48);}
    });
    box.innerHTML=`<div style="display:flex;justify-content:space-between;gap:12px;align-items:center;flex-wrap:wrap"><strong>${esc(name)}</strong><a class="file-button" href="${url}" download>DOWNLOAD .CIRC ↓</a></div><p class="empty">${items.length} positioned components · ${segments.length} wire segments. This diagram is a lightweight layout preview; use Logisim Evolution for exact symbols, pin behavior and simulation.</p>`;
    box.append(svg);
    const key=document.createElement("p");key.className="empty";key.textContent="Green: pins · Pink: recognized logic gates · Blue: other components. Component names and positions are taken from the Logisim circuit file.";
    box.append(key);
    const list=document.createElement("details");list.style.marginTop="14px";list.innerHTML=`<summary style="cursor:pointer;font-weight:bold">COMPONENT INVENTORY (${items.length})</summary>`;
    const ul=document.createElement("ul");ul.style.fontSize="12px";
    items.forEach(item=>{const li=document.createElement("li");li.textContent=`${item.name} at (${item.p.x}, ${item.p.y})${item.attrs?" — "+item.attrs:""}`;ul.append(li);});
    list.append(ul);box.append(list);
    const xml=document.createElement("details");xml.style.marginTop="10px";xml.innerHTML="<summary style='cursor:pointer;font-weight:bold'>VIEW CIRCUIT XML</summary>";const pre=document.createElement("pre");pre.textContent=raw;xml.append(pre);box.append(xml);
  }catch(e){box.innerHTML=`<p class="empty">${esc(e.message)}. Download and open the circuit in Logisim Evolution.</p><a class="file-button" href="${url}" download>DOWNLOAD ${esc(name)} ↓</a>`;}
}
function renderOthers(names){
  const el=$("#other-list");el.innerHTML="";
  if(!names.length){el.innerHTML='<p class="empty">No additional files in this lab.</p>';return;}
  names.forEach(name=>{const a=document.createElement("a");a.className="file-button";a.textContent="DOWNLOAD "+name;a.href=root+name.split("/").map(encodeURIComponent).join("/");a.download=name.split("/").pop();el.append(a);});
}
load();
