const audio = document.getElementById("audioPlayer");

const playButtons = document.querySelectorAll(".play-btn");
const mainPlayBtn = document.getElementById("mainPlay");
const nextBtn = document.getElementById("next");
const prevBtn = document.getElementById("prev");

const progressBar = document.getElementById("progressBar");
const currentTimeEl = document.getElementById("currentTime");
const durationEl = document.getElementById("duration");
const nowPlayingEl = document.getElementById("nowPlaying");

const volumeBar = document.getElementById("volumeBar");
const muteBtn = document.getElementById("muteBtn");

let currentIndex = -1;
let lastVolume = 0.8;

// default volume
audio.volume = lastVolume;

// format time
function formatTime(time) {
  const min = Math.floor(time / 60);
  const sec = Math.floor(time % 60).toString().padStart(2, "0");
  return `${min}:${sec}`;
}

// play song by index
function playSong(index) {
  const btn = playButtons[index];
  if (!btn) return;

  playButtons.forEach(b => b.innerText = "▶");

  currentIndex = index;
  audio.src = btn.dataset.song;
  audio.play();

  btn.innerText = "⏸";
  mainPlayBtn.innerText = "⏸";

  nowPlayingEl.innerText =
    `🎵 ${btn.dataset.title} — ${btn.dataset.artist}`;
}

// card click
playButtons.forEach((btn, index) => {
  btn.addEventListener("click", () => {
    if (currentIndex === index && !audio.paused) {
      audio.pause();
      btn.innerText = "▶";
      mainPlayBtn.innerText = "▶";
    } else {
      playSong(index);
    }
  });
});

// main play
mainPlayBtn.addEventListener("click", () => {
  if (currentIndex === -1) {
    playSong(0);
    return;
  }
  if (audio.paused) {
    audio.play();
    mainPlayBtn.innerText = "⏸";
  } else {
    audio.pause();
    mainPlayBtn.innerText = "▶";
  }
});

// next / prev
nextBtn.addEventListener("click", () => {
  playSong((currentIndex + 1) % playButtons.length);
});
prevBtn.addEventListener("click", () => {
  playSong((currentIndex - 1 + playButtons.length) % playButtons.length);
});

// progress update
audio.addEventListener("timeupdate", () => {
  progressBar.value = (audio.currentTime / audio.duration) * 100 || 0;
  currentTimeEl.innerText = formatTime(audio.currentTime);
  durationEl.innerText = formatTime(audio.duration || 0);
});

// seek
progressBar.addEventListener("input", () => {
  audio.currentTime = (progressBar.value / 100) * audio.duration;
});

// auto next
audio.addEventListener("ended", () => nextBtn.click());

// volume change
volumeBar.addEventListener("input", () => {
  audio.volume = volumeBar.value / 100;
  lastVolume = audio.volume;
  muteBtn.innerText = audio.volume === 0 ? "🔇" : "🔊";
});

// mute / unmute
muteBtn.addEventListener("click", () => {
  if (audio.volume > 0) {
    lastVolume = audio.volume;
    audio.volume = 0;
    volumeBar.value = 0;
    muteBtn.innerText = "🔇";
  } else {
    audio.volume = lastVolume || 0.8;
    volumeBar.value = audio.volume * 100;
    muteBtn.innerText = "🔊";
  }
});
