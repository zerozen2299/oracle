/* LANDING */
(function(){
  const landing=document.getElementById('landing');
  const rope=document.getElementById('rope');
  const lantern=document.getElementById('lantern');
  const flash=document.getElementById('flash');
  let done=false;
  function enter(){
    if(done)return;done=true;
    rope.classList.add('pull');lantern.classList.add('lit');
    flash.classList.add('on');setTimeout(()=>flash.classList.remove('on'),200);
    // landing fade
    setTimeout(()=>landing.classList.add('gone'),400);
    // เปิดม่าน
    const curtain=document.getElementById('curtain');
    setTimeout(()=>curtain.classList.add('open'),500);
    // เข้า app
    setTimeout(()=>{
      document.getElementById('app').classList.add('on');
      setTimeout(()=>curtain.classList.add('hidden'),1800);
    },900);
  }
  landing.addEventListener('click',enter);
  let sy=0,drag=false;
  rope.addEventListener('mousedown',e=>{sy=e.clientY;drag=true;e.stopPropagation()});
  document.addEventListener('mousemove',e=>{if(drag&&e.clientY-sy>32)enter()});
  document.addEventListener('mouseup',()=>drag=false);
  rope.addEventListener('touchstart',e=>{sy=e.touches[0].clientY;drag=true},{passive:true});
  document.addEventListener('touchmove',e=>{if(drag&&e.touches[0].clientY-sy>32)enter()},{passive:true});
  document.addEventListener('touchend',()=>drag=false);
})();

let phase='idle',typeTimer=null;

/* DECK CLICK */
document.getElementById('deckZone').addEventListener('click',function(e){
  e.stopPropagation();
  if(phase!=='idle')return;
  phase='ov';
  document.getElementById('btnSh').style.display='';
  document.getElementById('btnDr').style.display='none';
  document.getElementById('ovHint').textContent='สำรับไพ่อยู่ในมือคุณแล้ว';
  document.getElementById('ov').classList.add('on');
});

/* SHUFFLE */
function doShuffle(){
  phase='shuf';
  document.getElementById('btnSh').style.display='none';
  document.getElementById('ovHint').textContent='กำลังสับไพ่...';
  // แม่มดสับไพ่ — เพิ่ม class ให้ SVG animation เร็วขึ้น
  const svg=document.getElementById('witchSvg');
  svg.classList.add('shuffling');
  const deck=document.getElementById('ovDeck');
  const anims=[
    {tx:'52px',ty:'-24px',r:'13deg',tx2:'-34px',ty2:'14px',r2:'-8deg'},
    {tx:'-44px',ty:'-15px',r:'-11deg',tx2:'28px',ty2:'12px',r2:'7deg'},
    {tx:'34px',ty:'22px',r:'17deg',tx2:'-24px',ty2:'-19px',r2:'-12deg'},
  ];
  let n=0;
  anims.forEach((a,i)=>setTimeout(()=>{
    const sc=document.createElement('div');sc.className='sc';sc.textContent='✦';
    sc.style.setProperty('--tx',a.tx);sc.style.setProperty('--ty',a.ty);sc.style.setProperty('--r',a.r);
    sc.style.setProperty('--tx2',a.tx2);sc.style.setProperty('--ty2',a.ty2);sc.style.setProperty('--r2',a.r2);
    deck.appendChild(sc);
    setTimeout(()=>{sc.remove();if(++n===3){
      svg.classList.remove('shuffling');
      phase='ready';
      document.getElementById('ovHint').textContent='จั่วไพ่ได้เลย...';
      document.getElementById('btnDr').style.display='';
    }},440);
  },i*200));
}

/* TYPEWRITER */
function typewrite(el,text,speed=26){
  if(typeTimer)clearInterval(typeTimer);
  el.innerHTML='<span class="cursor"></span>';
  let i=0;
  typeTimer=setInterval(()=>{
    if(i>=text.length){clearInterval(typeTimer);return;}
    el.innerHTML=text.slice(0,++i)+'<span class="cursor"></span>';
  },speed);
}

/* DRAW */
function doDraw(){
  if(phase!=='ready')return;
  phase='drawn';
  document.getElementById('ov').classList.remove('on');
  const card=CARDS[Math.floor(Math.random()*CARDS.length)];

  // วางไพ่บนโต๊ะ
  const dc=document.getElementById('drawnCard');
  document.getElementById('drawnNum').textContent=card.n;
  document.getElementById('drawnEmoji').textContent=card.e;
  dc.style.animation='none';dc.offsetHeight;dc.style.animation='';
  dc.classList.add('show');
  document.querySelector('.deck-stack').style.opacity='0';
  document.querySelector('.deck-lbl').style.opacity='0';

  // แม่มดพูด — speaking class ทำให้ปาก animate
  setTimeout(()=>{
    const svg=document.getElementById('witchSvg');
    svg.classList.add('speaking');
    const bubble=document.getElementById('bubble');
    document.getElementById('bubbleTitle').innerHTML=`${card.e} <strong style="color:var(--gold);font-family:'Cinzel',serif;font-size:.72rem">${card.name}</strong> <span style="color:rgba(201,169,110,.5);font-size:.6rem;font-family:'Sarabun',sans-serif">${card.th}</span>`;
    bubble.classList.add('on');
    typewrite(document.getElementById('bubbleText'),card.m,25);
    // หยุดพูดเมื่อพิมพ์เสร็จ
    setTimeout(()=>{svg.classList.remove('speaking')},card.m.length*25+500);
    setTimeout(()=>document.getElementById('btnAgain').classList.add('on'),card.m.length*25+800);
  },600);
}

/* RESET */
function reset(){
  if(typeTimer)clearInterval(typeTimer);
  phase='idle';
  document.getElementById('drawnCard').classList.remove('show');
  document.querySelector('.deck-stack').style.opacity='';
  document.querySelector('.deck-lbl').style.opacity='';
  document.getElementById('witchSvg').classList.remove('speaking','shuffling');
  document.getElementById('bubble').classList.remove('on');
  document.getElementById('bubbleText').innerHTML='<span class="cursor"></span>';
  document.getElementById('btnAgain').classList.remove('on');
  document.getElementById('ov').classList.remove('on');
}
