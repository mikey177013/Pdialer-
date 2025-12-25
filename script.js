const ring = document.getElementById("ring");
const thumb = document.getElementById("thumb");
const track = document.getElementById("track");
const swipe = document.getElementById("swipe");
const controls = document.getElementById("controls");
const callType = document.getElementById("callType");

let startX = 0;
let drag = false;
let vibeInt;

/* VIBRATION */
function startVibration(){
  if(!navigator.vibrate) return;
  navigator.vibrate([120,80,120,800]);
  vibeInt = setInterval(()=>{
    navigator.vibrate([120,80,120,800]);
  },1100);
}

function stopVibration(){
  clearInterval(vibeInt);
  navigator.vibrate(0);
}

/* FIRST TOUCH */
document.addEventListener("touchstart",()=>{
  ring.play().catch(()=>{});
  startVibration();
},{once:true});

/* SWIPE LOGIC */
thumb.addEventListener("touchstart",e=>{
  drag = true;
  startX = e.touches[0].clientX;
  thumb.style.transition = "none";
},{passive:false});

window.addEventListener("touchmove",e=>{
  if(!drag) return;
  e.preventDefault();

  let dx = e.touches[0].clientX - startX;
  const max = track.clientWidth - thumb.clientWidth - 8;
  dx = Math.max(0, Math.min(dx, max));

  thumb.style.transform = `translateX(${dx}px)`;

  if(dx >= max - 2){
    drag = false;
    acceptCall();
  }
},{passive:false});

window.addEventListener("touchend",()=>{
  if(!drag) return;
  drag = false;
  thumb.style.transition = "transform .25s cubic-bezier(.4,0,.2,1)";
  thumb.style.transform = "translateX(0)";
});

/* ACCEPT */
function acceptCall(){
  ring.pause();
  stopVibration();

  callType.textContent = "00:01";
  swipe.style.opacity = "0";

  controls.style.opacity = "1";
  controls.style.transform = "translateY(0)";
  controls.style.pointerEvents = "auto";
}

/* END */
function endCall(){
  document.body.innerHTML =
    "<div style='height:100vh;display:flex;align-items:center;justify-content:center;color:white;font-size:22px'>Call ended</div>";
  setTimeout(()=>location.reload(),900);
}