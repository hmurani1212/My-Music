console.log("Hi i am Listen audio stream");

const Song = [
    "http://127.0.0.1:5500/Songs/AUD-20230612-WA0002.mp3",
    "http://127.0.0.1:5500/Songs/AUD-20230612-WA0001.mp3",
    "http://127.0.0.1:5500/Songs/AUD-20230612-WA0003.mp3",
    "http://127.0.0.1:5500/Songs/AUD-20230612-WA0004.mp3",
    "http://127.0.0.1:5500/Songs/AUD-20230612-WA0005.mp3",
    "http://127.0.0.1:5500/Songs/AUD-20230612-WA0006.mp3",
    "http://127.0.0.1:5500/Songs/AUD-20230612-WA0007.mp3",
    
    
];

const audio = new Audio();
const song = document.getElementById("mysong");
const allsong = document.getElementById("allsong");
const playSong = document.getElementById("playSong");
const NextSongs = document.getElementById("NextSongs");
const PreviousSongs = document.getElementById("PreviousSongs");
const PauseSongs = document.getElementById("PauseSongs");
const progress = document.getElementById("progress")
PauseSongs.style.display = "none";
let currentIndex = 0; // Index to keep track of the current playing song
let pausedTime = 0; // Variable to store the paused time

// Populate the song list
Song.forEach((songUrl, index) => {
    allsong.innerHTML += `<div id="song-${index}" class="song">${songUrl.slice(28)}</div>`;
});

playSong.addEventListener('click', () => {
    playToggle();
});

PauseSongs.addEventListener("click", () => {
    audio.pause();
    playSong.style.display = "block";
    PauseSongs.style.display = "none";
    pausedTime = audio.currentTime; // Save the current playback position
});

NextSongs.addEventListener('click', () => {
    playNextSong();
});

function playToggle() {
    if (audio.paused) {
        playCurrentSong();
        PauseSongs.style.display = "block";
        // progress.classList.add("bg-red-600")
        // progress.classList.remove("bg-white")
        PauseSongs.classList.add("mx-5");
        playSong.style.display = "none";
    } else {
        audio.pause();
        playSong.style.display = "block";
        PauseSongs.style.display = "none";
    }
}

function playCurrentSong() {
    if (Song.length === 0) {
        console.error("No songs available.");
        return;
    }

    // Remove 'bg-red-600' class from all songs
    for (let i = 0; i < Song.length; i++) {
        const songElement = document.getElementById(`song-${i}`);
        if (songElement) {
            songElement.classList.remove('bg-red-600', 'playing');
        }
    }

    audio.src = Song[currentIndex];

    // Ensure metadata is loaded before accessing duration
    audio.addEventListener('loadedmetadata', () => {
        // Set the playback position to the saved paused time
        audio.currentTime = pausedTime;

        audio.play();

        // Add 'bg-red-600' and 'playing' class to the current song
        const currentSongElement = document.getElementById(`song-${currentIndex}`);
        if (currentSongElement) {
            currentSongElement.classList.add('bg-red-600', 'playing');
        }

        // Display total time and current time
        const totalTime = formatTime(audio.duration);
        document.getElementById('time').innerHTML = `${formatTime(pausedTime)} / ${totalTime}`;

        // Update time and progress bar as the song progresses
        audio.addEventListener('timeupdate', () => {
            const currentTime = formatTime(audio.currentTime);
            document.getElementById('time').innerHTML = `${currentTime} / ${totalTime}`;
            updateProgressBar();
        });

        audio.addEventListener('ended', () => {
            updateProgressBar(100);
        });

        song.innerHTML = Song[currentIndex].slice(28);
    });
}

function updateProgressBar() {
    const progressBar = document.querySelector('.progress-bar .bg-blue-600');
    const percentComplete = (audio.currentTime / audio.duration) * 100;
    progressBar.style.width = `${percentComplete}%`;
}

function formatTime(timeInSeconds) {
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = Math.floor(timeInSeconds % 60);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
}

function playNextSong() {
    if (Song.length === 0) {
        console.error("No songs available.");
        return;
    }
    currentIndex = (currentIndex + 1) % Song.length;
    pausedTime = 0; // Reset paused time when changing songs
    playCurrentSong();
}

document.querySelector('.progress-bar').addEventListener('click', (e) => {
    const progressBar = document.querySelector('.progress-bar');
    const percentClicked = (e.clientX - progressBar.offsetLeft) / progressBar.clientWidth;
    const newTime = percentClicked * audio.duration;
    audio.currentTime = newTime;
    updateProgressBar();
});

const songElements = document.querySelectorAll('.song');
console.log(songElements)
songElements.forEach((element, index) => {
    element.addEventListener('click', () => {
        playSong.style.display = "none";
        PauseSongs.style.display = "block";
        currentIndex = index;
        pausedTime = 0; // Reset paused time when changing songs
        playCurrentSong();
    });
});
