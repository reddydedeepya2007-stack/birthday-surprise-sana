const memories = [
  { image: "images/1.png", label: "the beginning of a favorite story", caption: "Some people make ordinary days feel special. You're one of them.", sticker: "♡" },
  { image: "images/2.png", label: "proof that we have too much fun", caption: "From our random talks to our unstoppable laughter — I treasure it all.", sticker: "✿" },
  { image: "images/3.png", label: "a little moment, a big memory", caption: "No matter how busy life gets, I hope we always make time for memories like these.", sticker: "✧" },
  { image: "images/4.png", label: "my partner in the silly stuff", caption: "Thank you for understanding my weirdness and bringing out my happiest self.", sticker: "♡" },
  { image: "images/5.png", label: "one for the scrapbook", caption: "If I could keep one thing from every year, it would be the moments we shared.", sticker: "✿" },
  { image: "images/6.png", label: "a friendship I am grateful for", caption: "You deserve the same warmth and kindness that you give to everyone around you.", sticker: "✧" },
  { image: "images/7.png", label: "more adventures, please", caption: "Here's to more photos, more inside jokes, and stories we'll tell for years.", sticker: "♡" },
  { image: "images/8.png", label: "and this is only the beginning", caption: "One last little reminder: you are loved, appreciated, and truly one of a kind.", sticker: "✿" }
];

const welcomeScreen = document.getElementById("welcomeScreen");
const memoryScreen = document.getElementById("memoryScreen");
const finalScreen = document.getElementById("finalScreen");
const bgMusic = document.getElementById("bgMusic");
const musicToggle = document.getElementById("musicToggle");
const musicToggleSmall = document.getElementById("musicToggleSmall");
const musicLabel = document.getElementById("musicLabel");
const photo = document.getElementById("memoryPhoto");
const polaroid = document.getElementById("polaroid");
let current = 0;
let slideshowTimer = null;
let slideshowOn = false;

function showScreen(screen) {
  [welcomeScreen, memoryScreen, finalScreen].forEach(s => s.classList.remove("active"));
  screen.classList.add("active");
  window.scrollTo({ top: 0, behavior: "smooth" });
}
function updateMusicUI() {
  musicLabel.textContent = bgMusic.paused ? "Music" : "Music on";
  musicToggle.classList.toggle("playing", !bgMusic.paused);
  musicToggleSmall.textContent = bgMusic.paused ? "♫" : "♪";
}
async function toggleMusic() {
  if (bgMusic.paused) {
    try { await bgMusic.play(); } catch (e) {
      alert("Add your own music file named music.mp3 to this folder first. Some browsers also require a tap before music can play.");
    }
  } else {
    bgMusic.pause();
  }
  updateMusicUI();
}
function renderMemory() {
  const item = memories[current];
  photo.src = item.image;
  photo.alt = `Birthday memory ${current + 1} for Sana`;
  document.getElementById("photoLabel").textContent = item.label;
  document.getElementById("memoryCaption").textContent = item.caption;
  document.getElementById("photoSticker").textContent = item.sticker;
  document.getElementById("memoryEyebrow").textContent = `little memory no. ${String(current + 1).padStart(2, "0")}`;
  document.getElementById("photoCounter").textContent = `${String(current + 1).padStart(2, "0")} / ${String(memories.length).padStart(2, "0")}`;
  document.getElementById("progressBar").style.width = `${((current + 1) / memories.length) * 100}%`;
  document.getElementById("prevBtn").disabled = current === 0;
  document.getElementById("prevBtn").style.opacity = current === 0 ? ".45" : "1";
  document.getElementById("nextBtn").innerHTML = current === memories.length - 1 ? "♡" : "→";
  document.getElementById("memoryHint").textContent = current === memories.length - 1 ? "one more little surprise after this ♡" : "take your time — there's more ♡";
  document.getElementById("dots").innerHTML = memories.map((_, i) => `<span class="dot ${i === current ? "active" : ""}"></span>`).join("");
  polaroid.classList.remove("animate");
  void polaroid.offsetWidth;
  polaroid.classList.add("animate");
}
function stopSlideshow() {
  slideshowOn = false;
  const slideshowBtn = document.getElementById("slideshowBtn");
  if (slideshowBtn) slideshowBtn.textContent = "▶ Play slideshow";
  if (slideshowTimer) clearInterval(slideshowTimer);
  slideshowTimer = null;
}
function nextMemory() {
  if (current < memories.length - 1) {
    current++;
    renderMemory();
  } else {
    stopSlideshow();
    showScreen(finalScreen);
    launchConfetti();
  }
}
function previousMemory() {
  if (current > 0) { current--; renderMemory(); }
}
function startSurprise() {
  current = 0;
  stopSlideshow();
  renderMemory();
  showScreen(memoryScreen);
  // Browsers only allow music after a user gesture; this click is a valid gesture.
  bgMusic.play().then(updateMusicUI).catch(updateMusicUI);
}
function launchConfetti() {
  const container = document.getElementById("confetti");
  container.innerHTML = "";
  const colors = ["#e77991", "#e8c7a5", "#b9c9b4", "#d9a7b8", "#f2c86b"];
  for (let i = 0; i < 38; i++) {
    const bit = document.createElement("span");
    bit.style.left = `${Math.random() * 100}%`;
    bit.style.background = colors[i % colors.length];
    bit.style.animationDelay = `${Math.random() * 2.5}s`;
    bit.style.animationDuration = `${2.5 + Math.random() * 2}s`;
    bit.style.transform = `rotate(${Math.random() * 180}deg)`;
    container.appendChild(bit);
  }
}
function toggleSlideshow() {
  const slideshowBtn = document.getElementById("slideshowBtn");
  if (slideshowOn) {
    stopSlideshow();
    if (slideshowBtn) slideshowBtn.textContent = "▶ Play slideshow";
    document.getElementById("memoryHint").textContent = "slideshow paused — tap next when ready ♡";
  } else {
    slideshowOn = true;
    if (slideshowBtn) slideshowBtn.textContent = "Ⅱ Pause slideshow";
    document.getElementById("memoryHint").textContent = "slideshow playing — enjoy the memories ✨";
    slideshowTimer = setInterval(() => {
      if (current < memories.length - 1) nextMemory();
      else { stopSlideshow(); nextMemory(); }
    }, 4000);
  }
}
document.getElementById("startBtn").addEventListener("click", startSurprise);
document.getElementById("nextBtn").addEventListener("click", nextMemory);
document.getElementById("prevBtn").addEventListener("click", previousMemory);
document.getElementById("homeBtn").addEventListener("click", () => { stopSlideshow(); showScreen(welcomeScreen); });
document.getElementById("replayBtn").addEventListener("click", startSurprise);
document.getElementById("slideshowBtn").addEventListener("click", toggleSlideshow);
musicToggle.addEventListener("click", toggleMusic);
musicToggleSmall.addEventListener("click", toggleMusic);

// Keyboard-friendly navigation.
document.addEventListener("keydown", e => {
  if (!memoryScreen.classList.contains("active")) return;
  if (e.key === "ArrowRight") nextMemory();
  if (e.key === "ArrowLeft") previousMemory();
});

// A double-click/tap on the photo toggles automatic slideshow mode.
polaroid.addEventListener("dblclick", toggleSlideshow);
let lastTap = 0;
polaroid.addEventListener("touchend", e => {
  const now = Date.now();
  if (now - lastTap < 320) toggleSlideshow();
  lastTap = now;
}, { passive: true });
updateMusicUI();
