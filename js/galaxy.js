/* GALAXY CANVAS — Celestial Theme
   ดาว + ช้างเผือก + ฝุ่นทอง + ดาวตก */
(function(){
  const cv=document.getElementById('galaxyCanvas');
  if(!cv)return;
  const ctx=cv.getContext('2d');
  let W,H,stars=[],nebulas=[],sparkles=[],dustParticles=[],shootingStars=[];
  const SC=['#ffffff','#e8f0ff','#c8d8ff','#ffeedd','#ffd8f0','#e0d0ff','#ffffc0'];
  const GOLD=['#c9a96e','#e8d5a3','#f0e0b0','#ffe8a0','#ffd060'];
  const NC=[[80,40,200],[40,80,220],[160,60,140],[60,140,220],[120,80,255],[200,100,180]];

  function resize(){W=cv.width=window.innerWidth;H=cv.height=window.innerHeight;init();}

  function init(){
    stars=[];nebulas=[];sparkles=[];dustParticles=[];shootingStars=[];

    // ดาวพื้นฐาน
    for(let i=0;i<600;i++)stars.push({x:Math.random()*W,y:Math.random()*H,r:.3+Math.random()*1.6,col:SC[~~(Math.random()*SC.length)],t:Math.random()*6.28,sp:.3+Math.random()*.8,base:.2+Math.random()*.55,band:false});

    // ดาวในแนวช้างเผือก
    for(let i=0;i<500;i++){
      const p=Math.random(),cx=W*(.1+p*.8),cy=H*(.15+p*.7);
      const sp=(Math.random()-.5)*W*.18,ox=Math.cos(-.4)*sp,oy=Math.sin(-.4)*sp;
      stars.push({x:cx+ox,y:cy+oy,r:.5+Math.random()*2,col:SC[~~(Math.random()*SC.length)],t:Math.random()*6.28,sp:.4+Math.random(),base:.35+Math.random()*.6,band:true});
    }

    // nebulas
    for(let i=0;i<18;i++){const c=NC[~~(Math.random()*NC.length)];nebulas.push({x:Math.random()*W,y:Math.random()*H,rx:80+Math.random()*160,ry:50+Math.random()*110,a:Math.random()*3.14,col:c,op:.05+Math.random()*.1,t:Math.random()*6.28,sp:.15+Math.random()*.3});}

    // sparkle 4-pointed
    for(let i=0;i<30;i++)sparkles.push({x:Math.random()*W,y:Math.random()*H,sz:3+Math.random()*10,t:Math.random()*6.28,sp:.5+Math.random()*.8,col:SC[~~(Math.random()*3)]});

    // ฝุ่นทอง
    for(let i=0;i<120;i++)dustParticles.push({
      x:Math.random()*W,y:Math.random()*H,
      vx:(Math.random()-.5)*.3,vy:-.1-Math.random()*.25,
      r:.8+Math.random()*2.5,
      op:Math.random()*.7,maxOp:.3+Math.random()*.7,
      col:GOLD[~~(Math.random()*GOLD.length)],
      t:Math.random()*6.28,life:Math.random(),decay:.002+Math.random()*.004
    });

    // ดาวตก (spawn ทีละดวง)
    spawnShootingStar();
  }

  function spawnShootingStar(){
    if(Math.random()<.6){
      shootingStars.push({
        x:Math.random()*W*.7,y:Math.random()*H*.4,
        len:80+Math.random()*200,
        angle:.4+Math.random()*.4,
        speed:8+Math.random()*14,
        op:0,fadeIn:true,alive:true,
        col:Math.random()<.5?'#ffffff':'#e8d5a3',
        tail:[]
      });
    }
    setTimeout(spawnShootingStar,2000+Math.random()*5000);
  }

  function drawSparkle(x,y,sz,alpha,col){
    ctx.save();ctx.globalAlpha=alpha;ctx.translate(x,y);
    for(let i=0;i<4;i++){
      ctx.save();ctx.rotate(i*Math.PI/2);
      ctx.beginPath();ctx.moveTo(0,-sz);ctx.quadraticCurveTo(sz*.18,0,0,sz*.38);ctx.quadraticCurveTo(-sz*.18,0,0,-sz);
      ctx.fillStyle=col;ctx.fill();ctx.restore();
    }
    const g=ctx.createRadialGradient(0,0,0,0,0,sz*3);
    g.addColorStop(0,col+'aa');g.addColorStop(1,'transparent');
    ctx.beginPath();ctx.arc(0,0,sz*3,0,6.28);ctx.fillStyle=g;ctx.fill();
    ctx.restore();
  }

  function draw(){
    ctx.clearRect(0,0,W,H);
    ctx.fillStyle='#04030e';ctx.fillRect(0,0,W,H);

    // milky way
    ctx.save();ctx.translate(W/2,H/2);ctx.rotate(-.22);ctx.translate(-W/2,-H/2);
    const mw=ctx.createLinearGradient(0,H*.1,W,H*.9);
    mw.addColorStop(0,'transparent');mw.addColorStop(.3,'rgba(90,55,180,.07)');
    mw.addColorStop(.45,'rgba(150,110,255,.16)');mw.addColorStop(.5,'rgba(180,150,255,.2)');
    mw.addColorStop(.55,'rgba(150,110,255,.16)');mw.addColorStop(.7,'rgba(90,55,180,.07)');mw.addColorStop(1,'transparent');
    ctx.fillStyle=mw;ctx.fillRect(0,0,W,H);
    const mw2=ctx.createLinearGradient(0,H*.3,W,H*.7);
    mw2.addColorStop(0,'transparent');mw2.addColorStop(.45,'rgba(220,200,255,.05)');
    mw2.addColorStop(.5,'rgba(235,220,255,.13)');mw2.addColorStop(.55,'rgba(220,200,255,.05)');mw2.addColorStop(1,'transparent');
    ctx.fillStyle=mw2;ctx.fillRect(0,0,W,H);
    ctx.restore();

    // nebulas
    nebulas.forEach(n=>{n.t+=n.sp*.009;const p=Math.sin(n.t)*.012;ctx.save();ctx.translate(n.x,n.y);ctx.rotate(n.a);const g=ctx.createRadialGradient(0,0,0,0,0,n.rx);g.addColorStop(0,`rgba(${n.col},${n.op+p})`);g.addColorStop(.5,`rgba(${n.col},${(n.op+p)*.35})`);g.addColorStop(1,'transparent');ctx.scale(1,n.ry/n.rx);ctx.beginPath();ctx.arc(0,0,n.rx,0,6.28);ctx.fillStyle=g;ctx.fill();ctx.restore();});

    // stars
    stars.forEach(s=>{s.t+=s.sp*.011;const tw=s.base+Math.sin(s.t)*(s.band?.32:.22);const a=Math.max(0,Math.min(1,tw));if(s.r>1){const g=ctx.createRadialGradient(s.x,s.y,0,s.x,s.y,s.r*4.5);g.addColorStop(0,s.col+'bb');g.addColorStop(1,'transparent');ctx.beginPath();ctx.arc(s.x,s.y,s.r*4.5,0,6.28);ctx.fillStyle=g;ctx.globalAlpha=a*.45;ctx.fill();}ctx.globalAlpha=a;ctx.beginPath();ctx.arc(s.x,s.y,s.r,0,6.28);ctx.fillStyle=s.col;ctx.fill();ctx.globalAlpha=1;});

    // sparkles
    sparkles.forEach(sp=>{sp.t+=sp.sp*.014;const a=Math.max(0,.25+Math.sin(sp.t)*.75);drawSparkle(sp.x,sp.y,sp.sz*(1+Math.sin(sp.t)*.12),a,sp.col);});

    // ดาวตก
    shootingStars.forEach((s,i)=>{
      if(!s.alive)return;
      if(s.fadeIn){s.op+=.06;if(s.op>=1){s.op=1;s.fadeIn=false;}}
      else{s.op-=.018;if(s.op<=0){s.alive=false;return;}}
      const dx=Math.cos(s.angle)*s.speed,dy=Math.sin(s.angle)*s.speed;
      s.x+=dx;s.y+=dy;
      s.tail.push({x:s.x,y:s.y});
      if(s.tail.length>20)s.tail.shift();
      // วาด tail
      if(s.tail.length>1){
        const gr=ctx.createLinearGradient(s.tail[0].x,s.tail[0].y,s.x,s.y);
        gr.addColorStop(0,'transparent');
        gr.addColorStop(1,s.col+(Math.floor(s.op*255).toString(16).padStart(2,'0')));
        ctx.beginPath();ctx.moveTo(s.tail[0].x,s.tail[0].y);
        s.tail.forEach(p=>ctx.lineTo(p.x,p.y));
        ctx.strokeStyle=gr;ctx.lineWidth=1.5;ctx.globalAlpha=s.op;ctx.stroke();
        ctx.globalAlpha=1;
      }
      // หัวดาวตก
      ctx.globalAlpha=s.op;
      const hg=ctx.createRadialGradient(s.x,s.y,0,s.x,s.y,4);
      hg.addColorStop(0,'#ffffff');hg.addColorStop(.4,s.col);hg.addColorStop(1,'transparent');
      ctx.beginPath();ctx.arc(s.x,s.y,4,0,6.28);ctx.fillStyle=hg;ctx.fill();
      ctx.globalAlpha=1;
    });
    shootingStars=shootingStars.filter(s=>s.alive||s.fadeIn);

    // ฝุ่นทอง
    dustParticles.forEach(d=>{
      d.t+=.02;d.x+=d.vx+Math.sin(d.t)*.3;d.y+=d.vy;d.life+=d.decay;
      if(d.life>1){d.x=Math.random()*W;d.y=H+10;d.life=0;d.op=0;}
      const pulse=Math.sin(d.t)*.15;
      const alpha=Math.min(d.maxOp,d.life<.1?d.life*10*d.maxOp:d.life>.8?(1-d.life)*5*d.maxOp:d.maxOp)+pulse*.1;
      if(d.r>1.5){
        const g=ctx.createRadialGradient(d.x,d.y,0,d.x,d.y,d.r*3);
        g.addColorStop(0,d.col+'cc');g.addColorStop(1,'transparent');
        ctx.beginPath();ctx.arc(d.x,d.y,d.r*3,0,6.28);
        ctx.fillStyle=g;ctx.globalAlpha=Math.max(0,alpha)*.5;ctx.fill();
      }
      ctx.globalAlpha=Math.max(0,alpha);
      ctx.beginPath();ctx.arc(d.x,d.y,d.r,0,6.28);
      ctx.fillStyle=d.col;ctx.fill();
      ctx.globalAlpha=1;
    });

    requestAnimationFrame(draw);
  }

  window.addEventListener('resize',resize);
  resize();
  requestAnimationFrame(draw);
})();

/* ── ZODIAC CONSTELLATIONS ── */
(function(){
  const cv=document.getElementById('galaxyCanvas');
  if(!cv)return;

  // 12 กลุ่มดาวจักราศี พิกัดสัมพัทธ์ (0-1)
  // แต่ละกลุ่มมี stars[] และ lines[] เชื่อมดาว
  const ZODIACS=[
    {name:'Aries',th:'เมษ',sx:.08,sy:.12,scale:.06,
     stars:[[0,0],[1.2,.8],[2.5,.3],[3.2,1.5],[2,.9]],
     lines:[[0,1],[1,2],[2,3],[1,4]]},
    {name:'Taurus',th:'พฤษภ',sx:.22,sy:.05,scale:.065,
     stars:[[0,0],[1,1.2],[2.5,1],[3.5,.2],[2,-.5],[1,-.3]],
     lines:[[0,1],[1,2],[2,3],[0,4],[4,5],[5,1]]},
    {name:'Gemini',th:'เมถุน',sx:.38,sy:.08,scale:.07,
     stars:[[0,0],[0,2],[0,3.5],[1,3.8],[1.8,2.5],[1.8,0],[1.8,-1]],
     lines:[[0,1],[1,2],[2,3],[5,4],[4,3],[0,5],[5,6]]},
    {name:'Cancer',th:'กรกฎ',sx:.54,sy:.06,scale:.055,
     stars:[[0,.5],[1,0],[2,.8],[1.5,2],[.5,1.8]],
     lines:[[0,1],[1,2],[2,3],[3,4],[4,0]]},
    {name:'Leo',th:'สิงห์',sx:.70,sy:.05,scale:.07,
     stars:[[0,0],[1.2,.5],[2.5,.2],[2,1.8],[.8,2],[-.2,1],[1,3.5]],
     lines:[[0,1],[1,2],[2,3],[3,4],[4,5],[5,0],[4,6]]},
    {name:'Virgo',th:'กันย์',sx:.86,sy:.1,scale:.065,
     stars:[[0,0],[1,1],[1.5,2.5],[.5,3.5],[1.8,3],[2.5,2],[2,0]],
     lines:[[0,1],[1,2],[2,3],[2,4],[4,5],[5,6],[6,0]]},
    {name:'Libra',th:'ตุลย์',sx:.05,sy:.5,scale:.06,
     stars:[[0,0],[2,0],[1,1.5],[0,3],[2,3]],
     lines:[[0,1],[0,2],[1,2],[2,3],[2,4],[3,4]]},
    {name:'Scorpio',th:'พิจิก',sx:.22,sy:.55,scale:.065,
     stars:[[0,0],[1,.5],[2,.3],[3,1],[3.5,2],[3,3],[2,3.5],[1.5,2.8],[1,3.5]],
     lines:[[0,1],[1,2],[2,3],[3,4],[4,5],[5,6],[6,7],[7,8]]},
    {name:'Sagittarius',th:'ธนู',sx:.40,sy:.52,scale:.07,
     stars:[[0,0],[1.5,1],[3,.5],[2.5,2],[1,2.5],[0,1.8],[2,3.5]],
     lines:[[0,1],[1,2],[1,3],[3,4],[4,5],[5,0],[3,6]]},
    {name:'Capricorn',th:'มังกร',sx:.58,sy:.55,scale:.06,
     stars:[[0,0],[1.5,.5],[3,0],[2.5,2],[1.2,2.5],[0,1.5]],
     lines:[[0,1],[1,2],[2,3],[3,4],[4,5],[5,0]]},
    {name:'Aquarius',th:'กุมภ์',sx:.75,sy:.50,scale:.065,
     stars:[[0,.5],[1,0],[2,.5],[3,0],[1,2],[2,2.5],[3,2]],
     lines:[[0,1],[1,2],[2,3],[1,4],[4,5],[5,6]]},
    {name:'Pisces',th:'มีน',sx:.88,sy:.52,scale:.055,
     stars:[[0,0],[1,1],[2,.5],[1.5,2.5],[.5,2.8],[0,2],[2,3]],
     lines:[[0,1],[1,2],[1,3],[3,4],[4,5],[5,1],[3,6]]}
  ];

  const canvas2=document.createElement('canvas');
  canvas2.style.cssText='position:fixed;inset:0;width:100%;height:100%;pointer-events:none;z-index:1;opacity:0;transition:opacity 2s ease 1s';
  canvas2.id='zodiacCanvas';
  document.body.appendChild(canvas2);

  const ctx2=canvas2.getContext('2d');
  let W2,H2,tick=0;
  let zodiacs=[];

  function resize2(){
    W2=canvas2.width=window.innerWidth;
    H2=canvas2.height=window.innerHeight;
    buildZodiacs();
  }

  function buildZodiacs(){
    zodiacs=ZODIACS.map(z=>{
      const px=z.sx*W2, py=z.sy*H2;
      const sc=Math.min(W2,H2)*z.scale;
      return {
        ...z,
        px,py,sc,
        twinkle:z.stars.map(()=>Math.random()*Math.PI*2),
        labelAlpha:0
      };
    });
  }

  function drawZodiac(){
    ctx2.clearRect(0,0,W2,H2);
    tick+=.008;

    zodiacs.forEach(z=>{
      const stars=z.stars.map(([x,y])=>({
        wx:z.px+x*z.sc, wy:z.py+y*z.sc
      }));

      // เส้นเชื่อมดาว
      ctx2.save();
      z.lines.forEach(([a,b])=>{
        const sa=stars[a],sb=stars[b];
        const gr=ctx2.createLinearGradient(sa.wx,sa.wy,sb.wx,sb.wy);
        gr.addColorStop(0,'rgba(180,160,255,.18)');
        gr.addColorStop(.5,'rgba(200,180,255,.28)');
        gr.addColorStop(1,'rgba(180,160,255,.18)');
        ctx2.beginPath();ctx2.moveTo(sa.wx,sa.wy);ctx2.lineTo(sb.wx,sb.wy);
        ctx2.strokeStyle=gr;ctx2.lineWidth=.8;ctx2.stroke();
      });

      // ดาวแต่ละดวง
      stars.forEach((s,i)=>{
        z.twinkle[i]+=.02+Math.random()*.01;
        const pulse=.5+.5*Math.sin(tick*1.2+z.twinkle[i]);
        const r=1.8+pulse*1.2;
        const alpha=.45+pulse*.5;

        // glow
        const g=ctx2.createRadialGradient(s.wx,s.wy,0,s.wx,s.wy,r*5);
        g.addColorStop(0,`rgba(200,180,255,${alpha*.5})`);
        g.addColorStop(.4,`rgba(160,130,255,${alpha*.2})`);
        g.addColorStop(1,'transparent');
        ctx2.beginPath();ctx2.arc(s.wx,s.wy,r*5,0,Math.PI*2);
        ctx2.fillStyle=g;ctx2.fill();

        // ดาว
        ctx2.beginPath();ctx2.arc(s.wx,s.wy,r,0,Math.PI*2);
        ctx2.fillStyle=`rgba(220,210,255,${alpha})`;
        ctx2.fill();
      });

      // ชื่อกลุ่มดาว
      const cx=stars.reduce((s,p)=>s+p.wx,0)/stars.length;
      const cy=stars.reduce((s,p)=>s+p.wy,0)/stars.length + z.sc*.8;
      ctx2.globalAlpha=.35+.1*Math.sin(tick+z.px);
      ctx2.font=`${Math.max(9,Math.min(12,W2*.012))}px Cinzel, serif`;
      ctx2.fillStyle='#c8b8f8';
      ctx2.textAlign='center';
      ctx2.fillText(z.th,cx,cy);
      ctx2.globalAlpha=1;

      ctx2.restore();
    });

    requestAnimationFrame(drawZodiac);
  }

  // แสดงกลุ่มดาวหลังเข้าห้อง
  const observer=new MutationObserver(()=>{
    if(document.getElementById('app').classList.contains('on')){
      canvas2.style.opacity='1';
      observer.disconnect();
    }
  });
  observer.observe(document.getElementById('app'),{attributes:true,attributeFilter:['class']});

  window.addEventListener('resize',resize2);
  resize2();
  requestAnimationFrame(drawZodiac);
})();
