/* GALAXY CANVAS */
(function(){
  const cv=document.getElementById('galaxyCanvas');
  if(!cv)return;
  const ctx=cv.getContext('2d');
  let W,H,stars=[],nebulas=[],sparkles=[];
  const SC=['#ffffff','#e8f0ff','#c8d8ff','#ffeedd','#ffd8f0','#e0d0ff'];
  const NC=[[80,40,200],[40,80,220],[160,60,140],[60,140,220],[120,80,255],[200,100,180]];
  function resize(){W=cv.width=window.innerWidth;H=cv.height=window.innerHeight;init();}
  function init(){
    stars=[];nebulas=[];sparkles=[];
    for(let i=0;i<600;i++)stars.push({x:Math.random()*W,y:Math.random()*H,r:.3+Math.random()*1.6,col:SC[Math.floor(Math.random()*SC.length)],t:Math.random()*6.28,sp:.3+Math.random()*.8,base:.2+Math.random()*.55,band:false});
    for(let i=0;i<500;i++){const p=Math.random(),cx=W*(.1+p*.8),cy=H*(.15+p*.7),sp=(Math.random()-.5)*W*.18,ox=Math.cos(-.4)*sp,oy=Math.sin(-.4)*sp;stars.push({x:cx+ox,y:cy+oy,r:.5+Math.random()*2,col:SC[Math.floor(Math.random()*SC.length)],t:Math.random()*6.28,sp:.4+Math.random(),base:.35+Math.random()*.6,band:true});}
    for(let i=0;i<18;i++){const c=NC[Math.floor(Math.random()*NC.length)];nebulas.push({x:Math.random()*W,y:Math.random()*H,rx:80+Math.random()*160,ry:50+Math.random()*110,a:Math.random()*3.14,col:c,op:.05+Math.random()*.1,t:Math.random()*6.28,sp:.15+Math.random()*.3});}
    for(let i=0;i<28;i++)sparkles.push({x:Math.random()*W,y:Math.random()*H,sz:3+Math.random()*9,t:Math.random()*6.28,sp:.5+Math.random()*.8,col:SC[Math.floor(Math.random()*3)]});
  }
  function sparkle(x,y,sz,alpha,col){
    ctx.save();ctx.globalAlpha=alpha;ctx.translate(x,y);
    for(let i=0;i<4;i++){ctx.save();ctx.rotate(i*Math.PI/2);ctx.beginPath();ctx.moveTo(0,-sz);ctx.quadraticCurveTo(sz*.18,0,0,sz*.38);ctx.quadraticCurveTo(-sz*.18,0,0,-sz);ctx.fillStyle=col;ctx.fill();ctx.restore();}
    const g=ctx.createRadialGradient(0,0,0,0,0,sz*3);g.addColorStop(0,col+'99');g.addColorStop(1,'transparent');ctx.beginPath();ctx.arc(0,0,sz*3,0,6.28);ctx.fillStyle=g;ctx.fill();
    ctx.restore();
  }
  function draw(){
    ctx.clearRect(0,0,W,H);
    ctx.fillStyle='#080818';ctx.fillRect(0,0,W,H);
    // milky way band
    ctx.save();ctx.translate(W/2,H/2);ctx.rotate(-.22);ctx.translate(-W/2,-H/2);
    const mw=ctx.createLinearGradient(0,H*.1,W,H*.9);
    mw.addColorStop(0,'transparent');mw.addColorStop(.3,'rgba(90,55,180,.07)');mw.addColorStop(.45,'rgba(150,110,255,.16)');mw.addColorStop(.5,'rgba(180,150,255,.2)');mw.addColorStop(.55,'rgba(150,110,255,.16)');mw.addColorStop(.7,'rgba(90,55,180,.07)');mw.addColorStop(1,'transparent');
    ctx.fillStyle=mw;ctx.fillRect(0,0,W,H);
    const mw2=ctx.createLinearGradient(0,H*.3,W,H*.7);
    mw2.addColorStop(0,'transparent');mw2.addColorStop(.45,'rgba(220,200,255,.05)');mw2.addColorStop(.5,'rgba(235,220,255,.12)');mw2.addColorStop(.55,'rgba(220,200,255,.05)');mw2.addColorStop(1,'transparent');
    ctx.fillStyle=mw2;ctx.fillRect(0,0,W,H);
    ctx.restore();
    // nebulas
    nebulas.forEach(n=>{n.t+=n.sp*.009;const p=Math.sin(n.t)*.012;ctx.save();ctx.translate(n.x,n.y);ctx.rotate(n.a);const g=ctx.createRadialGradient(0,0,0,0,0,n.rx);g.addColorStop(0,`rgba(${n.col},${n.op+p})`);g.addColorStop(.5,`rgba(${n.col},${(n.op+p)*.35})`);g.addColorStop(1,'transparent');ctx.scale(1,n.ry/n.rx);ctx.beginPath();ctx.arc(0,0,n.rx,0,6.28);ctx.fillStyle=g;ctx.fill();ctx.restore();});
    // stars
    stars.forEach(s=>{s.t+=s.sp*.011;const tw=s.base+Math.sin(s.t)*(s.band?.32:.22);const a=Math.max(0,Math.min(1,tw));if(s.r>1){const g=ctx.createRadialGradient(s.x,s.y,0,s.x,s.y,s.r*4.5);g.addColorStop(0,s.col+'bb');g.addColorStop(1,'transparent');ctx.beginPath();ctx.arc(s.x,s.y,s.r*4.5,0,6.28);ctx.fillStyle=g;ctx.globalAlpha=a*.45;ctx.fill();}ctx.globalAlpha=a;ctx.beginPath();ctx.arc(s.x,s.y,s.r,0,6.28);ctx.fillStyle=s.col;ctx.fill();ctx.globalAlpha=1;});
    // sparkles
    sparkles.forEach(sp=>{sp.t+=sp.sp*.014;const a=Math.max(0,.25+Math.sin(sp.t)*.75);const sz=sp.sz*(1+Math.sin(sp.t)*.12);sparkle(sp.x,sp.y,sz,a,sp.col);});
    requestAnimationFrame(draw);
  }
  window.addEventListener('resize',resize);resize();requestAnimationFrame(draw);
})();