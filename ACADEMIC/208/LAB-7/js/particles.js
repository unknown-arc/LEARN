/* Sunlight dust + sparkles. Logical space = 1234x864 scene canvas. */
(function(){
  const W=1234,H=864,reduce=matchMedia('(prefers-reduced-motion: reduce)').matches;
  const sprite=(function(){const c=document.createElement('canvas');c.width=c.height=64;const x=c.getContext('2d');
    const g=x.createRadialGradient(32,32,0,32,32,32);g.addColorStop(0,'rgba(255,248,220,1)');g.addColorStop(.25,'rgba(255,230,170,.55)');g.addColorStop(1,'rgba(255,210,120,0)');
    x.fillStyle=g;x.fillRect(0,0,64,64);return c})();
  function inside(poly,x,y){let r=false;for(let i=0,j=poly.length-1;i<poly.length;j=i++){const a=poly[i],b=poly[j];
    if((a[1]>y)!==(b[1]>y)&&x<(b[0]-a[0])*(y-a[1])/(b[1]-a[1])+a[0])r=!r}return r}
  window.Dust=function(canvas,o){
    const ctx=canvas.getContext('2d'),poly=o.poly,N=reduce?Math.round(o.count/3):o.count,sparks=o.sparkles||[];
    const xs=poly.map(p=>p[0]),ys=poly.map(p=>p[1]),bx=[Math.min(...xs),Math.max(...xs)],by=[Math.min(...ys),Math.max(...ys)];
    let k=1,P=[],S=[],mouse={x:-999,y:-999},t0=performance.now();
    function size(){const d=Math.min(devicePixelRatio||1,2),w=canvas.clientWidth;canvas.width=w*d;canvas.height=w*H/W*d;k=canvas.width/W}
    function rnd(a,b){return a+Math.random()*(b-a)}
    function spawn(p,first){let x,y,n=0;do{x=rnd(bx[0],bx[1]);y=rnd(by[0],by[1]);n++}while(!inside(poly,x,y)&&n<30);
      Object.assign(p,{x,y,r:rnd(.8,2.6),vx:rnd(-.05,.16),vy:rnd(-.16,.03),ph:rnd(0,6.28),f:rnd(.4,1.3),a:first?Math.random():0,max:rnd(.35,.95),fade:1});return p}
    for(let i=0;i<N;i++)P.push(spawn({},true));
    for(let i=0;i<(reduce?2:sparks.length*2);i++)S.push({z:sparks[i%sparks.length],t:Math.random()*4,d:rnd(2.5,4.5),x:0,y:0,s:0,fresh:true});
    addEventListener('resize',size);size();
    canvas.parentElement.addEventListener('pointermove',e=>{const r=canvas.getBoundingClientRect();mouse.x=(e.clientX-r.left)/r.width*W;mouse.y=(e.clientY-r.top)/r.height*H});
    function star(x,y,s,a){ctx.save();ctx.translate(x*k,y*k);ctx.globalAlpha=a;ctx.drawImage(sprite,-s*k*1.4,-s*k*1.4,s*k*2.8,s*k*2.8);
      ctx.strokeStyle='rgba(255,250,225,.95)';ctx.lineWidth=1.3*k;ctx.beginPath();ctx.moveTo(-s*k,0);ctx.lineTo(s*k,0);ctx.moveTo(0,-s*k);ctx.lineTo(0,s*k);ctx.stroke();ctx.restore()}
    function frame(now){
      const t=(now-t0)/1000;ctx.clearRect(0,0,canvas.width,canvas.height);ctx.globalCompositeOperation='lighter';
      for(const p of P){
        if(!reduce){p.x+=p.vx+Math.sin(t*p.f+p.ph)*.22;p.y+=p.vy+Math.cos(t*p.f*.8+p.ph)*.14;
          const dx=p.x-mouse.x,dy=p.y-mouse.y,d2=dx*dx+dy*dy;if(d2<5200){const d=Math.sqrt(d2)||1,f=(72-d)/72*1.8;p.x+=dx/d*f;p.y+=dy/d*f}}
        const ins=inside(poly,p.x,p.y);p.a+=ins?(p.max-p.a)*.02:-.03;
        if(!ins&&p.a<=.02)spawn(p);
        const tw=.65+.35*Math.sin(t*p.f*2+p.ph);ctx.globalAlpha=Math.max(0,p.a*tw);const s=p.r*7*k;
        ctx.drawImage(sprite,p.x*k-s/2,p.y*k-s/2,s,s)}
      for(const s of S){s.t+=1/60;if(s.t>s.d||s.fresh){const z=s.z;s.x=z[0]+rnd(-z[2],z[2]);s.y=z[1]+rnd(-z[2]*.5,z[2]*.5);s.t=0;s.d=rnd(2.5,4.5);s.s=rnd(5,10);s.fresh=false}
        const q=s.t/s.d,a=Math.sin(Math.PI*q);star(s.x,s.y,s.s*a,a*.9)}
      ctx.globalCompositeOperation='source-over';requestAnimationFrame(frame)}
    requestAnimationFrame(frame);
  };
})();
