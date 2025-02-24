/****************************************
 *           LYRICS SETUP
 ****************************************/
const lyricsData = [
    { time: 341, text: "HO..." },
    { time: 343, text: "APNE HI RANG MEIN" },
    { time: 345, text: "MUJHKO RANG DE" },
    { time: 346, text: "DHEEME-DHEEME" },
    { time: 347, text: "RANG MEIN" },
    { time: 349, text: "MUJHKO RANG DE" },
    { time: 350, text: "SAUNDHE-SAUNDHE" },
    { time: 351, text: "RANG MEIN"},
    { time: 352.5, text: "MUJHKO RANG DE" },
    { time: 353.5, text: "RANG DE NA," },
    { time: 356, text: "RANG DE NAA" },
    { time: 357.5, text: "RANG DE NAAA..." }
];

// Get DOM elements safely
const audio = document.getElementById('audio');
const startButton = document.getElementById('startButton');
const lyricsDiv = document.getElementById('lyricsContainer');
const balloonContainer = document.getElementById('balloonsContainer');

if (!audio || !startButton || !lyricsDiv || !balloonContainer) {
    console.error("Missing required elements in the HTML.");
}

let currentLyricIndex = 0;
let currentGroupCount = 0;
let pendingLyric = null;
let isFadingOut = false;

// Balloon Speed Settings
let spawnInterval = 2000;
let balloonIntervalId = null;
let currentFloatDuration = 8.0;

/****************************************
 *           EVENT LISTENERS
 ****************************************/
startButton.addEventListener('click', () => {
    currentLyricIndex = 0;
    lyricsDiv.innerHTML = "";
    currentGroupCount = 0;
    pendingLyric = null;
    isFadingOut = false;

    // Ensure audio plays correctly
    audio.currentTime = 341; // Jump to 5:41
    audio.muted = true; // Mute initially to bypass autoplay restriction
    audio.play().then(() => {
        audio.muted = false; // Unmute after playing starts
    }).catch(error => {
        console.error("Audio playback failed:", error);
    });

    if (balloonIntervalId) clearInterval(balloonIntervalId);
    balloonIntervalId = setInterval(createBalloon, spawnInterval);
});

audio.addEventListener('timeupdate', () => {
    if (currentLyricIndex < lyricsData.length) {
        const nextLyric = lyricsData[currentLyricIndex];
        if (audio.currentTime >= nextLyric.time) {
            processLyric(nextLyric);
        }
    }
    requestAnimationFrame(() => adjustBalloonSpeed(audio.currentTime));
});

/****************************************
 *   PROCESS LYRIC WITH GROUPING
 ****************************************/
function processLyric(lyricObj) {
    if (currentGroupCount < 3) {
        appendLyric(lyricObj);
        currentGroupCount++;
        currentLyricIndex++;
    } else {
        if (!isFadingOut) {
            pendingLyric = lyricObj;
            isFadingOut = true;
            fadeOutCurrentGroup(() => {
                lyricsDiv.innerHTML = "";
                currentGroupCount = 0;
                isFadingOut = false;
                if (pendingLyric) {
                    appendLyric(pendingLyric);
                    currentGroupCount++;
                    pendingLyric = null;
                    currentLyricIndex++;
                }
            });
        }
    }
}

/****************************************
 *   APPEND LYRIC (Fade or Typing Effect)
 ****************************************/
function appendLyric(lyricObj) {
    if (lyricObj.time >= 354) {
        typeLyric(lyricObj.text);
    } else {
        displayFadeLyric(lyricObj.text);
    }
}

/****************************************
 *   FADE OUT CURRENT GROUP
 ****************************************/
function fadeOutCurrentGroup(callback) {
    const children = Array.from(lyricsDiv.children);
    children.forEach(child => child.classList.add('fade-out'));
    setTimeout(callback, 800);
}

/****************************************
 *   LYRICS DISPLAY (Fade Effect)
 ****************************************/
function displayFadeLyric(text) {
    const newEl = document.createElement('div');
    newEl.className = 'lyric-line';
    newEl.innerHTML = text.replace(/\n/g, '<br>');
    newEl.style.animation = 'fadeIn 0.8s ease forwards';
    lyricsDiv.appendChild(newEl);
}

/****************************************
 *   LYRICS DISPLAY WITH TYPING EFFECT
 ****************************************/
function typeLyric(text) {
    const newEl = document.createElement('div');
    newEl.className = 'lyric-line';
    lyricsDiv.appendChild(newEl);

    let i = 0;
    function typeNext() {
        if (i < text.length) {
            newEl.innerHTML += text[i] === "\n" ? "<br>" : text[i];
            i++;
            setTimeout(typeNext, 50);
        } else {
            newEl.style.animation = 'fadeIn 0.8s ease forwards';
        }
    }
    typeNext();
}
window.addEventListener("beforeunload", () => {
    sessionStorage.setItem("audioTime", audio.currentTime);
    sessionStorage.setItem("audioPlaying", !audio.paused);
});
document.addEventListener("DOMContentLoaded", () => {
    const savedTime = sessionStorage.getItem("audioTime");
    const wasPlaying = sessionStorage.getItem("audioPlaying") === "true";

    if (savedTime) {
        audio.currentTime = parseFloat(savedTime);
    }
    if (wasPlaying) {
        audio.play();
    }
});

/****************************************
 *         BALLOON CREATION
 ****************************************/
document.addEventListener("DOMContentLoaded", function () {
    function createBalloon() {
        const balloon = document.createElement("div");
        balloon.className = "balloon";

        balloon.style.left = Math.random() * 90 + "vw";
        balloon.style.animationDuration = (Math.random() * 3 + 3) + "s"; 

        const shape = document.createElement("div");
        shape.className = "balloon-shape";
        shape.style.backgroundColor = `hsl(${Math.random() * 360}, 80%, 70%)`;

        const string = document.createElement("div");
        string.className = "balloon-string";

        balloon.appendChild(shape);
        balloon.appendChild(string);
        balloonContainer.appendChild(balloon);

        balloon.addEventListener("click", () => popBalloon(balloon));

        setTimeout(() => balloon.remove(), 6000);
    }

    setInterval(createBalloon, 1000);
});

/****************************************
 *         BALLOON POP
 ****************************************/
function popBalloon(balloonWrapper) {
    if (!balloonWrapper.parentNode) return;
    balloonWrapper.remove();
    triggerConfetti();
}

/****************************************
 *       DYNAMIC SPEED ADJUSTMENT
 ****************************************/
function adjustBalloonSpeed(currentTime) {
    const startTime = 341;
    const endTime = 345;
    if (currentTime < startTime) {
        currentFloatDuration = 8.0;
        return;
    }
    if (currentTime > endTime) {
        currentFloatDuration = 4.0;
        return;
    }
    currentFloatDuration = 8.0 - 4.0 * ((currentTime - startTime) / (endTime - startTime));
}

/****************************************
 *         CONFETTI EFFECT
 ****************************************/
function triggerConfetti() {
    if (typeof confetti === "function") {
        confetti({
            particleCount: 100,
            spread: 70,
            origin: { y: 0.8 }
        });
    } else {
        console.log("Confetti function not found!");
    }
}
