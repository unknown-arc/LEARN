const labsEl=document.querySelector("#labs");
const panel=document.querySelector("#workspace");
const frame=document.querySelector("#playground-frame");
const title=document.querySelector("#workspace-title");
const github=document.querySelector("#github-link");
const open=document.querySelector("#open-link");
const repo="https://github.com/unknown-arc/LEARN/tree/main/ACADEMIC/204";

function showLab(lab){
  const path=encodeURIComponent(lab.folder);
  title.textContent=lab.name+" / COMPUTER ORGANIZATION";
  github.href=`${repo}/${lab.folder}`;
  open.href=`playgrounds/index.html?lab=${path}`;
  frame.src=`playgrounds/index.html?lab=${path}`;
  panel.classList.add("open");panel.setAttribute("aria-hidden","false");
}
function closeLab(){panel.classList.remove("open");panel.setAttribute("aria-hidden","true");frame.src="about:blank";}
document.querySelector("#close-workspace").addEventListener("click",closeLab);
document.addEventListener("keydown",e=>{if(e.key==="Escape")closeLab();});

(async()=>{
  try{
    const res=await fetch("labs.json");
    if(!res.ok)throw new Error("labs.json not found");
    const data=await res.json();
    document.querySelector("#lab-count").textContent=`${data.length} LABS`;
    labsEl.innerHTML="";
    if(!data.length){labsEl.innerHTML='<p>No LAB folders found. Add LAB-* folders and regenerate labs.json.</p>';return;}
    data.forEach(lab=>{
      const card=document.createElement("article");card.className="lab-card";
      const heading=document.createElement("h3");heading.textContent=lab.name;
      const desc=document.createElement("p");desc.textContent="Task · Architecture / Solution · Other files";
      const btn=document.createElement("button");btn.textContent="OPEN PLAYGROUND →";btn.addEventListener("click",()=>showLab(lab));
      card.append(heading,desc,btn);labsEl.append(card);
    });
  }catch(e){labsEl.innerHTML='<p>Labs could not be loaded. Run <code>get_204_labs.py</code> to generate labs.json.</p>';console.error(e);}
})();
