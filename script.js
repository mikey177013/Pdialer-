const ring = document.getElementById("ring");
const thumb = document.getElementById("thumb");
const track = document.getElementById("track");
const swipe = document.getElementById("swipe");
const controls = document.getElementById("controls");
const callType = document.getElementById("callType");

let startX = 0;
let dragging = false;
let seconds = 1;
let timerInt;
let vibeInt;

/*
  IMPORTANT REALITY CHECK:
  Browsers DO NOT allow vibration or audio
  without a user gesture.
  This is the earliest legally possible trigger.
*/

function heartbeatVibe() {
  if (!navigator.vibrate) return;
  navigator.vibrate([120, 80, 120, 800]);
}

/* First user interaction unlock */
window.addEventListener("touchstart", () => {
  ring.play().catch(() => {});
  heartbeatVibe();
  vibeInt = setInterval(heartbeatVibe, 1100);
}, { once: true });

/* Swipe logic */
thumb.addEventListener("touchstart", e => {
  dragging = true;
  startX = e.touches[0].clientX;
}, { passive: false });

window.addEventListener("touchmove", e => {
  if (!dragging) return;
  e.preventDefault();

  let dx = e.touches[0].clientX - startX;
  const max = track.clientWidth - thumb.clientWidth - 8;

  dx = Math.max(0, Math.min(dx, max));
  thumb.style.transform = `translateX(${dx}px)`;

  if (dx >= max - 6) acceptCall();
}, { passive: false });

window.addEventListener("touchend", () => {
  dragging = false;
  thumb.style.transform = "";
});

function acceptCall() {
  ring.pause();
  clearInterval(vibeInt);

  swipe.style.display = "none";
  controls.style.opacity = "1";
  controls.style.pointerEvents = "auto";

  timerInt = setInterval(() => {
    const m = String(Math.floor(seconds / 60)).padStart(2, "0");
    const s = String(seconds % 60).padStart(2, "0");
    callType.textContent = `${m}:${s}`;
    seconds++;
  }, 1000);
}

function endCall() {
  clearInterval(timerInt);
  document.body.innerHTML =
    "<div style='height:100vh;display:flex;align-items:center;justify-content:center;background:black;color:white;font-size:22px'>Call ended</div>";
  setTimeout(() => location.reload(), 900);
}