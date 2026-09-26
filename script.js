// ==========================================
// XANTER MP3 - AUDIUS LIVE API + KIZA FALLBACK ONLY
// ==========================================

let audiusOffset = 0;
let isFetchingLive = false;

document.addEventListener("DOMContentLoaded", function () {
    const trendsContainer = document.querySelector('.trends-section, #trends-container, .song-list'); 
    const seeAllBtn = document.querySelector('.see-all-btn, #see-all');
    
    if (!trendsContainer) return;

    // Safisha na anza kujaribu kupakia kupitia Audius API
    trendsContainer.innerHTML = '';
    fetchLiveAudiusSongs(trendsContainer, 5);

    // Kitufe cha "See All"
    if (seeAllBtn) {
        seeAllBtn.addEventListener('click', (e) => {
            e.preventDefault();
            fetchLiveAudiusSongs(trendsContainer, 5);
        });
    }

    // Mfumo wa Infinite Scroll (Ukisogea chini)
    window.addEventListener('scroll', () => {
        const scrollableHeight = document.documentElement.scrollHeight - window.innerHeight;
        const currentScroll = window.scrollY;

        if (currentScroll >= scrollableHeight - 50) {
            if (!isFetchingLive) {
                fetchLiveAudiusSongs(trendsContainer, 5);
            }
        }
    });
});

// Wimbo pekee wa akiba (Fallback) ukiwa na jina "Kiza" kama API ikigoma
const fallbackSong = {
    id: "kiza_fallback",
    title: "Kiza",
    artist: "Xanter Master",
    duration: "3:30",
    image: "https://images.unsplash.com/photo-1518495973542-4542c06a5843?w=100",
    audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
    source: "Fallback (API Imegoma)"
};

// Kazi ya kupiga moja kwa moja kwenye Audius API
async function fetchLiveAudiusSongs(container, limit) {
    if (isFetchingLive) return;
    isFetchingLive = true;

    let loader = document.getElementById('live-api-loader');
    if (!loader) {
        loader = document.createElement('div');
        loader.id = 'live-api-loader';
        loader.style.cssText = "text-align: center; color: #888; padding: 12px; font-size: 13px;";
        loader.innerHTML = "Inatafuta nyimbo mpya mtandaoni kutoka Audius...";
        container.appendChild(loader);
    } else {
        loader.style.display = 'block';
    }

    try {
        const liveApiUrl = `https://api.audius.co/v1/tracks/trending?app_name=XanterMP3&limit=${limit}&offset=${audiusOffset}`;
        const response = await fetch(liveApiUrl);
        
        if (!response.ok) {
            throw new Error("Audius API imegoma kujibu.");
        }

        const data = await response.json();
        if (loader) loader.style.display = 'none';

        if (data && data.data && data.data.length > 0) {
            // API Imesoma vizuri! Tunaonyesha nyimbo za Audius
            data.data.forEach(track => {
                const title = track.title;
                const artist = track.user.name;
                const duration = formatDuration(track.duration);
                const image = (track.artwork && track.artwork['480x480']) ? track.artwork['480x480'] : 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=100';
                const audioUrl = `https://audius-metadata.cultur3stake.com/v1/tracks/${track.id}/stream`;
                const plays = track.play_count || Math.floor(Math.random() * 50) + 10;

                renderSongItem(container, title, artist, duration, image, audioUrl, plays, "Audius Live");
            });

            audiusOffset += limit;
        } else {
            // Kama hakuna data zilizorudi, onyesha wimbo wa Kiza
            renderFallback(container);
        }

        isFetchingLive = false;

    } catch (error) {
        console.error("Hitilafu ya API:", error);
        if (loader) loader.style.display = 'none';
        
        // API imeshindwa kusoma, tunaleta wimbo wa "Kiza"
        renderFallback(container);
        isFetchingLive = false;
    }
}

function renderFallback(container) {
    if (!document.getElementById(fallbackSong.id)) {
        renderSongItem(
            container, 
            fallbackSong.title, 
            fallbackSong.artist, 
            fallbackSong.duration, 
            fallbackSong.image, 
            fallbackSong.audioUrl, 
            15, 
            fallbackSong.source, 
            fallbackSong.id
        );
    }
}

function renderSongItem(container, title, artist, duration, image, audioUrl, plays, sourceTag, customId = '') {
    const songDiv = document.createElement('div');
    songDiv.className = 'song-item';
    if (customId) songDiv.id = customId;
    songDiv.style.cssText = "display: flex; align-items: center; justify-content: space-between; background: #161616; margin-bottom: 10px; padding: 10px; border-radius: 12px;";

    songDiv.innerHTML = `
        <div style="display: flex; align-items: center; gap: 12px; overflow: hidden;">
            <img src="${image}" alt="${title}" style="width: 50px; height: 50px; border-radius: 8px; object-fit: cover; background: #333;">
            <div style="overflow: hidden;">
                <h4 style="color: #fff; font-size: 14px; margin: 0 0 4px 0; white-space: nowrap; text-overflow: ellipsis; overflow: hidden;">${title}</h4>
                <p style="color: #aaa; font-size: 12px; margin: 0 0 6px 0; white-space: nowrap; text-overflow: ellipsis; overflow: hidden;">${artist} • ${duration}</p>
                <div style="display: flex; gap: 10px; font-size: 10px; color: #4CAF50; font-weight: bold;">
                    <span>🎧 ${plays} Plays</span>
                    <span style="color: #00bcd4;">[${sourceTag}]</span>
                </div>
            </div>
        </div>
        <div style="display: flex; gap: 8px;">
            <button class="play-btn" style="background: #222; border: none; color: #fff; width: 35px; height: 35px; border-radius: 50%; cursor: pointer; display: flex; align-items: center; justify-content: center;" title="Play">▶</button>
            <button class="download-btn" style="background: #222; border: none; color: #ff4d4d; width: 35px; height: 35px; border-radius: 50%; cursor: pointer; display: flex; align-items: center; justify-content: center;" title="Download">⬇</button>
        </div>
    `;

    const playBtn = songDiv.querySelector('.play-btn');
    playBtn.addEventListener('click', () => {
        const audio = new Audio(audioUrl);
        audio.play().catch(err => console.log("Play error:", err));
        alert(`Inacheza: ${title} - ${artist}`);
    });

    container.appendChild(songDiv);
}

function formatDuration(seconds) {
    if (!seconds || isNaN(seconds)) return "3:00";
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
}
