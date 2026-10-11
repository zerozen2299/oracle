/* ================================================================
   ORACLE — Galaxy Canvas
   1. starfield + milky way + nebula + dust + shooting stars
   2. zodiac constellations (12 กลุ่ม วางรอบขอบ ไม่ทับตรงกลาง)
   ================================================================ */

/* ── 1. STARFIELD ── */
(function(){
  const cv = document.getElementById('galaxyCanvas');
  if(!cv) return;
  const ctx = cv.getContext('2d');
  let W, H, stars=[], nebulas=[], sparkles=[], dust=[], shooting=[];

  const SC = ['#ffffff','#eef2ff','#ccdcff','#ffeedd','#ffe0f5','#e2d8ff','#fffacc'];
  const GOLD = ['#c9a96e','#e8d5a3','#f0e0b0','#ffe8a0','#ffd870'];
  const NC = [[80,40,200],[40,80,220],[160,60,140],[60,140,220],[120,80,255],[200,100,180]];

  function resize(){ W=cv.width=innerWidth; H=cv.height=innerHeight; init(); }

  function init(){
    stars=[]; nebulas=[]; sparkles=[]; dust=[]; shooting=[];

    // ดาวพื้นฐาน — กระจายทั่ว
    for(let i=0;i<700;i++) push_star(Math.random()*W, Math.random()*H, false);

    // ดาวแนวช้างเผือก — แถบเฉียง
    for(let i=0;i<600;i++){
      const p=Math.random();
      const cx=W*(.05+p*.9), cy=H*(.1+p*.8);
      const spread=(Math.random()-.5)*W*.16;
      const ox=Math.cos(-.38)*spread, oy=Math.sin(-.38)*spread;
      push_star(cx+ox, cy+oy, true);
    }

    function push_star(x,y,band){
      stars.push({x,y,r:.35+Math.random()*(band?2:1.5),
        col:SC[~~(Math.random()*SC.length)],
        t:Math.random()*6.28, sp:.25+Math.random()*.9,
        base:band?.32+Math.random()*.55 : .18+Math.random()*.45, band});
    }

    // nebula blobs
    for(let i=0;i<20;i++){
      const c=NC[~~(Math.random()*NC.length)];
      nebulas.push({x:Math.random()*W,y:Math.random()*H,
        rx:70+Math.random()*150,ry:45+Math.random()*100,
        a:Math.random()*Math.PI,col:c,op:.04+Math.random()*.09,
        t:Math.random()*6.28,sp:.1+Math.random()*.25});
    }

    // sparkle 4-pointed
    for(let i=0;i<35;i++)
      sparkles.push({x:Math.random()*W,y:Math.random()*H,
        sz:2.5+Math.random()*9,t:Math.random()*6.28,
        sp:.4+Math.random()*.9,col:SC[~~(Math.random()*3)]});

    // ฝุ่นทอง
    for(let i=0;i<150;i++)
      dust.push({x:Math.random()*W,y:Math.random()*H,
        vx:(Math.random()-.5)*.25,vy:-.08-Math.random()*.2,
        r:.7+Math.random()*2.2,op:0,maxOp:.25+Math.random()*.65,
        col:GOLD[~~(Math.random()*GOLD.length)],
        t:Math.random()*6.28,life:Math.random(),decay:.0015+Math.random()*.003});

    spawnShoot();
  }

  function spawnShoot(){
    if(Math.random()<.65)
      shooting.push({x:Math.random()*W*.65,y:Math.random()*H*.35,
        len:100+Math.random()*220,angle:.35+Math.random()*.45,
        speed:9+Math.random()*13,op:0,fadeIn:true,alive:true,
        col:Math.random()<.5?'#ffffff':'#e8d5a3',tail:[]});
    setTimeout(spawnShoot,2500+Math.random()*6000);
  }

  function sp4(x,y,sz,a,col){
    ctx.save();ctx.globalAlpha=a;ctx.translate(x,y);
    for(let i=0;i<4;i++){
      ctx.save();ctx.rotate(i*Math.PI/2);
      ctx.beginPath();ctx.moveTo(0,-sz);
      ctx.quadraticCurveTo(sz*.16,0,0,sz*.35);
      ctx.quadraticCurveTo(-sz*.16,0,0,-sz);
      ctx.fillStyle=col;ctx.fill();ctx.restore();
    }
    const g=ctx.createRadialGradient(0,0,0,0,0,sz*3);
    g.addColorStop(0,col+'99');g.addColorStop(1,'transparent');
    ctx.beginPath();ctx.arc(0,0,sz*3,0,6.28);
    ctx.fillStyle=g;ctx.fill();ctx.restore();
  }

  function draw(){
    ctx.clearRect(0,0,W,H);
    ctx.fillStyle='#04030e';ctx.fillRect(0,0,W,H);

    // milky way band
    ctx.save();ctx.translate(W/2,H/2);ctx.rotate(-.22);ctx.translate(-W/2,-H/2);
    const mw=ctx.createLinearGradient(0,H*.08,W,H*.92);
    mw.addColorStop(0,'transparent');
    mw.addColorStop(.28,'rgba(85,55,185,.07)');
    mw.addColorStop(.44,'rgba(145,110,255,.17)');
    mw.addColorStop(.5,'rgba(175,148,255,.21)');
    mw.addColorStop(.56,'rgba(145,110,255,.17)');
    mw.addColorStop(.72,'rgba(85,55,185,.07)');
    mw.addColorStop(1,'transparent');
    ctx.fillStyle=mw;ctx.fillRect(0,0,W,H);
    const mw2=ctx.createLinearGradient(0,H*.32,W,H*.68);
    mw2.addColorStop(0,'transparent');
    mw2.addColorStop(.48,'rgba(215,200,255,.04)');
    mw2.addColorStop(.5,'rgba(230,218,255,.11)');
    mw2.addColorStop(.52,'rgba(215,200,255,.04)');
    mw2.addColorStop(1,'transparent');
    ctx.fillStyle=mw2;ctx.fillRect(0,0,W,H);
    ctx.restore();

    // nebulas
    nebulas.forEach(n=>{
      n.t+=n.sp*.009;const p=Math.sin(n.t)*.011;
      ctx.save();ctx.translate(n.x,n.y);ctx.rotate(n.a);
      const g=ctx.createRadialGradient(0,0,0,0,0,n.rx);
      g.addColorStop(0,`rgba(${n.col},${n.op+p})`);
      g.addColorStop(.5,`rgba(${n.col},${(n.op+p)*.3})`);
      g.addColorStop(1,'transparent');
      ctx.scale(1,n.ry/n.rx);ctx.beginPath();ctx.arc(0,0,n.rx,0,6.28);
      ctx.fillStyle=g;ctx.fill();ctx.restore();
    });

    // stars
    stars.forEach(s=>{
      s.t+=s.sp*.011;
      const tw=s.base+Math.sin(s.t)*(s.band?.31:.2);
      const a=Math.max(0,Math.min(1,tw));
      if(s.r>1.2){
        const g=ctx.createRadialGradient(s.x,s.y,0,s.x,s.y,s.r*4.5);
        g.addColorStop(0,s.col+'bb');g.addColorStop(1,'transparent');
        ctx.beginPath();ctx.arc(s.x,s.y,s.r*4.5,0,6.28);
        ctx.fillStyle=g;ctx.globalAlpha=a*.42;ctx.fill();
      }
      ctx.globalAlpha=a;
      ctx.beginPath();ctx.arc(s.x,s.y,s.r,0,6.28);
      ctx.fillStyle=s.col;ctx.fill();
      ctx.globalAlpha=1;
    });

    // sparkles
    sparkles.forEach(sp=>{
      sp.t+=sp.sp*.013;
      sp4(sp.x,sp.y,sp.sz*(1+Math.sin(sp.t)*.1),Math.max(0,.2+Math.sin(sp.t)*.8),sp.col);
    });

    // ดาวตก
    shooting.forEach((s,i)=>{
      if(!s.alive)return;
      s.fadeIn?s.op=Math.min(1,s.op+.06):(s.op-=.016);
      if(s.op<=0){s.alive=false;return;}
      const dx=Math.cos(s.angle)*s.speed,dy=Math.sin(s.angle)*s.speed;
      s.x+=dx;s.y+=dy;s.tail.push({x:s.x,y:s.y});
      if(s.tail.length>22)s.tail.shift();
      if(!s.fadeIn&&s.tail.length>0){
        const hex=Math.floor(s.op*255).toString(16).padStart(2,'0');
        const gr=ctx.createLinearGradient(s.tail[0].x,s.tail[0].y,s.x,s.y);
        gr.addColorStop(0,'transparent');gr.addColorStop(1,s.col+hex);
        ctx.beginPath();ctx.moveTo(s.tail[0].x,s.tail[0].y);
        s.tail.forEach(p=>ctx.lineTo(p.x,p.y));
        ctx.strokeStyle=gr;ctx.lineWidth=1.6;ctx.globalAlpha=s.op;ctx.stroke();
        ctx.globalAlpha=1;
      }else s.fadeIn=false;
      const hg=ctx.createRadialGradient(s.x,s.y,0,s.x,s.y,4.5);
      hg.addColorStop(0,'#fff');hg.addColorStop(.4,s.col);hg.addColorStop(1,'transparent');
      ctx.beginPath();ctx.arc(s.x,s.y,4.5,0,6.28);
      ctx.fillStyle=hg;ctx.globalAlpha=s.op;ctx.fill();ctx.globalAlpha=1;
    });
    shooting=shooting.filter(s=>s.alive||s.fadeIn);

    // ฝุ่นทอง
    dust.forEach(d=>{
      d.t+=.018;d.x+=d.vx+Math.sin(d.t)*.28;d.y+=d.vy;d.life+=d.decay;
      if(d.life>1){d.x=Math.random()*W;d.y=H+8;d.life=0;d.op=0;}
      const a=Math.max(0,d.life<.12?d.life/.12*d.maxOp : d.life>.8?(1-d.life)/.2*d.maxOp : d.maxOp);
      if(d.r>1.4){
        const g=ctx.createRadialGradient(d.x,d.y,0,d.x,d.y,d.r*3);
        g.addColorStop(0,d.col+'cc');g.addColorStop(1,'transparent');
        ctx.beginPath();ctx.arc(d.x,d.y,d.r*3,0,6.28);
        ctx.fillStyle=g;ctx.globalAlpha=a*.5;ctx.fill();
      }
      ctx.globalAlpha=Math.max(0,a);
      ctx.beginPath();ctx.arc(d.x,d.y,d.r,0,6.28);
      ctx.fillStyle=d.col;ctx.fill();ctx.globalAlpha=1;
    });

    requestAnimationFrame(draw);
  }

  window.addEventListener('resize',resize);
  resize();
  requestAnimationFrame(draw);
})();


/* ── 2. ZODIAC CONSTELLATIONS ── */
(function(){
  /* ไม่ทับเขตกลาง: หลีก x 28%-70%, y 18%-85%
     วางกลุ่มดาว 12 กลุ่มรอบขอบอย่างสมมาตร
     sx,sy = จุดอ้างอิงซ้ายบนของกลุ่มดาว (สัดส่วน 0-1)
     scale  = ขนาดในหน่วย min(W,H)*scale
     stars  = [[dx,dy],...] offset จาก sx,sy
     lines  = [[a,b],...] index ของ stars */
  const ZD=[
    // ── มุมซ้ายบน ──
    {n:'Aries',th:'♈ เมษ',sx:.02,sy:.03,sc:.062,
     s:[[0,0],[1.8,.7],[3.5,.2],[4.2,1.6],[2.8,1.1]],
     l:[[0,1],[1,2],[2,3],[1,4],[3,4]]},

    // ── บนซ้าย ──
    {n:'Taurus',th:'♉ พฤษภ',sx:.16,sy:.02,sc:.065,
     s:[[0,1.2],[1.5,0],[3,.6],[4.5,.1],[3,2.2],[1.5,2.5]],
     l:[[0,1],[1,2],[2,3],[0,4],[4,5],[5,1],[2,4]]},

    // ── บนกลาง (ขยับขึ้นบนสุด) ──
    {n:'Gemini',th:'♊ เมถุน',sx:.38,sy:.01,sc:.06,
     s:[[0,0],[0,2.2],[.4,3.8],[1.8,3.5],[1.8,2],[1.8,0]],
     l:[[0,1],[1,2],[2,3],[5,4],[4,3],[0,5]]},

    // ── มุมขวาบน ──
    {n:'Leo',th:'♌ สิงห์',sx:.72,sy:.02,sc:.062,
     s:[[0,.8],[1.5,0],[3,.5],[4,.2],[3,2],[1.5,2.2],[.5,1.8]],
     l:[[0,1],[1,2],[2,3],[0,5],[5,4],[4,3],[5,6],[6,0]]},

    // ── ขวาบน ──
    {n:'Virgo',th:'♍ กันย์',sx:.87,sy:.05,sc:.058,
     s:[[0,0],[1.2,1],[2,2.8],[.8,3.8],[2.5,3.2],[2.2,1.5]],
     l:[[0,1],[1,2],[2,3],[2,4],[4,5],[5,1]]},

    // ── ขวากลาง ──
    {n:'Libra',th:'♎ ตุลย์',sx:.88,sy:.36,sc:.058,
     s:[[0,0],[2.5,0],[1.5,1.6],[0,3.2],[2.5,3.2],[1.5,3.8]],
     l:[[0,1],[0,2],[1,2],[2,3],[2,4],[3,4],[4,5]]},

    // ── มุมขวาล่าง ──
    {n:'Scorpio',th:'♏ พิจิก',sx:.86,sy:.62,sc:.058,
     s:[[0,0],[1.2,.5],[2.5,.2],[3.5,1],[3.8,2.2],[3.2,3.2],[2,3.8],[1,3.2]],
     l:[[0,1],[1,2],[2,3],[3,4],[4,5],[5,6],[6,7]]},

    // ── ล่างขวา ──
    {n:'Sagittarius',th:'♐ ธนู',sx:.62,sy:.84,sc:.062,
     s:[[0,0],[1.8,.6],[3.5,0],[3,1.8],[1.5,2.2],[0,1.5],[2,2.8]],
     l:[[0,1],[1,2],[1,3],[3,4],[4,5],[5,0],[3,6]]},

    // ── ล่างกลาง ──
    {n:'Capricorn',th:'♑ มังกร',sx:.36,sy:.86,sc:.062,
     s:[[0,0],[2,.4],[4,0],[3.5,2],[2,2.5],[.5,2],[2,3.5]],
     l:[[0,1],[1,2],[2,3],[3,4],[4,5],[5,0],[4,6]]},

    // ── ล่างซ้าย ──
    {n:'Aquarius',th:'♒ กุมภ์',sx:.1,sy:.84,sc:.062,
     s:[[0,.8],[1.5,0],[3,.8],[4.5,0],[1.5,2.2],[3,2.8],[4.5,2.2]],
     l:[[0,1],[1,2],[2,3],[1,4],[4,5],[5,6],[6,2]]},

    // ── ซ้ายล่าง ──
    {n:'Pisces',th:'♓ มีน',sx:.02,sy:.62,sc:.06,
     s:[[0,0],[1.5,.5],[3,.2],[2.5,2],[1,2.3],[0,1.5],[1.8,3.2]],
     l:[[0,1],[1,2],[1,3],[3,4],[4,5],[5,0],[3,6]]},

    // ── ซ้ายกลาง ──
    {n:'Cancer',th:'♋ กรกฎ',sx:.02,sy:.33,sc:.058,
     s:[[0,.8],[1.8,0],[3.5,.6],[3,2.4],[1.5,2.8],[.5,2]],
     l:[[0,1],[1,2],[2,3],[3,4],[4,5],[5,0],[1,4]]},
  ];

  const cv2=document.createElement('canvas');
  cv2.style.cssText='position:fixed;inset:0;width:100%;height:100%;pointer-events:none;z-index:1;opacity:0;transition:opacity 2.5s ease 1.2s';
  cv2.id='zodiacCanvas';
  document.body.appendChild(cv2);
  const ctx2=cv2.getContext('2d');

  let W2,H2,tick=0,built=[];

  function resize2(){
    W2=cv2.width=innerWidth;H2=cv2.height=innerHeight;build();
  }

  function build(){
    built=ZD.map(z=>{
      const px=z.sx*W2, py=z.sy*H2;
      const sc=Math.min(W2,H2)*z.sc;
      const pts=z.s.map(([dx,dy])=>({wx:px+dx*sc,wy:py+dy*sc}));
      return{...z,px,py,sc,pts,tw:z.s.map(()=>Math.random()*6.28)};
    });
  }

  function drawZod(){
    ctx2.clearRect(0,0,W2,H2);
    tick+=.007;

    built.forEach(z=>{
      const breathe=.72+.28*Math.sin(tick*.55+z.px*.008);

      /* เส้นเชื่อม */
      z.l.forEach(([a,b])=>{
        const A=z.pts[a],B=z.pts[b];
        // glow หนา
        const g1=ctx2.createLinearGradient(A.wx,A.wy,B.wx,B.wy);
        g1.addColorStop(0,`rgba(155,130,255,${.1*breathe})`);
        g1.addColorStop(.5,`rgba(190,165,255,${.2*breathe})`);
        g1.addColorStop(1,`rgba(155,130,255,${.1*breathe})`);
        ctx2.beginPath();ctx2.moveTo(A.wx,A.wy);ctx2.lineTo(B.wx,B.wy);
        ctx2.strokeStyle=g1;ctx2.lineWidth=5;ctx2.stroke();
        // เส้นหลัก
        const g2=ctx2.createLinearGradient(A.wx,A.wy,B.wx,B.wy);
        g2.addColorStop(0,`rgba(210,195,255,${.38*breathe})`);
        g2.addColorStop(.5,`rgba(240,230,255,${.6*breathe})`);
        g2.addColorStop(1,`rgba(210,195,255,${.38*breathe})`);
        ctx2.beginPath();ctx2.moveTo(A.wx,A.wy);ctx2.lineTo(B.wx,B.wy);
        ctx2.strokeStyle=g2;ctx2.lineWidth=.9;ctx2.stroke();
      });

      /* ดาวแต่ละดวง */
      z.pts.forEach((p,i)=>{
        z.tw[i]+=.017+Math.random()*.007;
        const pulse=.5+.5*Math.sin(tick*1.05+z.tw[i]);
        const r=2+pulse*1.8;
        const a=.5+pulse*.5;

        // outer glow
        const go=ctx2.createRadialGradient(p.wx,p.wy,0,p.wx,p.wy,r*9);
        go.addColorStop(0,`rgba(175,155,255,${a*.28*breathe})`);
        go.addColorStop(.45,`rgba(130,105,255,${a*.1})`);
        go.addColorStop(1,'transparent');
        ctx2.beginPath();ctx2.arc(p.wx,p.wy,r*9,0,6.28);
        ctx2.fillStyle=go;ctx2.fill();

        // inner glow
        const gi=ctx2.createRadialGradient(p.wx,p.wy,0,p.wx,p.wy,r*3.2);
        gi.addColorStop(0,`rgba(245,238,255,${a})`);
        gi.addColorStop(.4,`rgba(205,190,255,${a*.6})`);
        gi.addColorStop(1,'transparent');
        ctx2.beginPath();ctx2.arc(p.wx,p.wy,r*3.2,0,6.28);
        ctx2.fillStyle=gi;ctx2.fill();

        // core
        ctx2.beginPath();ctx2.arc(p.wx,p.wy,r,0,6.28);
        ctx2.fillStyle=`rgba(255,254,255,${a})`;ctx2.fill();

        // cross sparkle
        if(pulse>.65){
          const sp=r*(pulse-.65)*5;
          ctx2.save();ctx2.translate(p.wx,p.wy);
          ctx2.globalAlpha=(pulse-.65)*1.8*a;
          ctx2.strokeStyle='rgba(255,252,255,.95)';ctx2.lineWidth=.7;
          ctx2.beginPath();ctx2.moveTo(-sp,0);ctx2.lineTo(sp,0);ctx2.stroke();
          ctx2.beginPath();ctx2.moveTo(0,-sp);ctx2.lineTo(0,sp);ctx2.stroke();
          ctx2.restore();
        }
      });

      /* label */
      const cx=z.pts.reduce((s,p)=>s+p.wx,0)/z.pts.length;
      const maxY=Math.max(...z.pts.map(p=>p.wy));
      const fs=Math.max(9,Math.min(12,W2*.0115));
      const lA=(.38+.14*Math.sin(tick*.7+z.px*.009))*breathe;
      ctx2.font=`${fs}px "Cinzel",serif`;
      const tw=ctx2.measureText(z.th).width;
      // pill bg
      ctx2.globalAlpha=lA*.55;
      ctx2.fillStyle='rgba(15,8,40,.8)';
      const rx2=cx-tw/2-7,ry2=maxY+10,rw2=tw+14,rh2=fs+8,rr2=4;
      ctx2.beginPath();
      ctx2.moveTo(rx2+rr2,ry2);ctx2.lineTo(rx2+rw2-rr2,ry2);
      ctx2.arcTo(rx2+rw2,ry2,rx2+rw2,ry2+rr2,rr2);
      ctx2.lineTo(rx2+rw2,ry2+rh2-rr2);
      ctx2.arcTo(rx2+rw2,ry2+rh2,rx2+rw2-rr2,ry2+rh2,rr2);
      ctx2.lineTo(rx2+rr2,ry2+rh2);
      ctx2.arcTo(rx2,ry2+rh2,rx2,ry2+rh2-rr2,rr2);
      ctx2.lineTo(rx2,ry2+rr2);
      ctx2.arcTo(rx2,ry2,rx2+rr2,ry2,rr2);
      ctx2.closePath();ctx2.fill();
      // text glow
      ctx2.globalAlpha=lA*.4;
      ctx2.fillStyle='#a090e8';
      ctx2.textAlign='center';
      ctx2.fillText(z.th,cx+1,maxY+fs+12);
      // text
      ctx2.globalAlpha=lA;
      ctx2.fillStyle='#ddd4ff';
      ctx2.fillText(z.th,cx,maxY+fs+11);
      ctx2.globalAlpha=1;
    });

    requestAnimationFrame(drawZod);
  }

  // fade in เมื่อเข้าห้อง — ตรวจทั้ง MutationObserver และ polling
  function checkShow(){
    if(document.getElementById('app').classList.contains('on')){
      cv2.style.opacity='1';
    } else { setTimeout(checkShow,200); }
  }
  try{
    new MutationObserver((m,obs)=>{
      if(document.getElementById('app').classList.contains('on')){
        cv2.style.opacity='1';obs.disconnect();
      }
    }).observe(document.getElementById('app'),{attributes:true,attributeFilter:['class']});
  }catch(e){}
  // fallback polling
  setTimeout(checkShow,1000);

  window.addEventListener('resize',resize2);
  resize2();
  requestAnimationFrame(drawZod);
})();
