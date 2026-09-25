// ==========================================
// XANTER MP3 - ROBUST INFINITE SCROLL & DYNAMIC TRENDS
// ==========================================

let page = 1;
let loading = false;

document.addEventListener("DOMContentLoaded", function () {
    const trendsContainer = document.querySelector('.trends-section, #trends-container, .song-list'); 
    
    if (!trendsContainer) return;

    // Safisha kwanza kisha uweke mzigo wa kwanza
    trendsContainer.innerHTML = '';
    appendMoreSongs(trendsContainer, 4);

    // Sikiliza wakati mtumiaji anaposend/kuteremka chini (Infinite Scroll)
    window.addEventListener('scroll', () => {
        const scrollableHeight = document.documentElement.scrollHeight - window.innerHeight;
        const currentScroll = window.scrollY;

        // Kama mtumiaji amefika karibu na chini (pixel 50 za mwisho)
        if (currentScroll >= scrollableHeight - 50) {
            if (!loading) {
                loading = true;
                
                // Ongeza kiashiria cha kuloadi chini
                let loader = document.getElementById('loader-indicator');
                if (!loader) {
                    loader = document.createElement('div');
                    loader.id = 'loader-indicator';
                    loader.style.cssText = "text-align: center; color: #888; padding: 15px; font-size: 13px;";
                    loader.innerHTML = "Inaloadi nyimbo zaidi...";
                    trendsContainer.appendChild(loader);
                }

                // Tumia muda mfupi kuiga mtandao kisha leta nyimbo mpya
                setTimeout(() => {
                    if (loader) loader.remove();
                    appendMoreSongs(trendsContainer, 4);
                    loading = false;
                    page++;
                }, 1000);
            }
        }
    });
});

// Orodha kubwa ya nyimbo zinazozunguka na kujizalisha zenyewe
function appendMoreSongs(container, count) {
    const songLibrary = [
        { title: "Until It Hits", artist: "newkaib", duration: "3:05", image: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=100", audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3", source: "Jamendo" },
        { title: "Travis Scott Best Mix", artist: "Rap Trap Radio", duration: "70:44", image: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=100", audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3", source: "Audius" },
        { title: "Duck Hits The Gates", artist: "Carson's Workshop", duration: "1:10", image: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=100", audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3", source: "Archive" },
        { title: "Best Remixes Of Popular", artist: "Christopher Davies", duration: "51:54", image: "https://images.unsplash.com/photo-1465847899084-d164df4dedc6?w=100", audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3", source: "Apple Music" },
        { title: "Neon Cyber Vibe", artist: "Xanter Sound", duration: "3:40", image: "https://images.unsplash.com/photo-1518495973542-4542c06a5843?w=100", audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3", source: "Jamendo" },
        { title: "Acoustic Morning", artist: "Global Beats", duration: "2:55", image: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=100", audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-6.mp3", source: "Audius" }
    ];

    // Tunazungusha na kuchanganya kulingana na ukurasa ili zionekane mpya kila ukiteremka
    for (let i = 0; i < count; i++) {
        const randomIndex = Math.floor(Math.random() * songLibrary.length);
        const song = songLibrary[randomIndex];

        const songDiv = document.createElement('div');
        songDiv.className = 'song-item';
        songDiv.style.cssText = "display: flex; align-items: center; justify-content: space-between; background: #161616; margin-bottom: 10px; padding: 10px; border-radius: 12px;";

        songDiv.innerHTML = `
            <div style="display: flex; align-items: center; gap: 12px; overflow: hidden;">
                <img src="${song.image}" alt="${song.title}" style="width: 50px; height: 50px; border-radius: 8px; object-fit: cover; background: #333;">
                <div style="overflow: hidden;">
                    <h4 style="color: #fff; font-size: 14px; margin: 0 0 4px 0; white-space: nowrap; text-overflow: ellipsis; overflow: hidden;">${song.title}</h4>
                    <p style="color: #aaa; font-size: 12px; margin: 0 0 6px 0; white-space: nowrap; text-overflow: ellipsis; overflow: hidden;">${song.artist} • ${song.duration}</p>
                    <div style="display: flex; gap: 10px; font-size: 10px; color: #4CAF50; font-weight: bold;">
                        <span>🎧 ${Math.floor(Math.random() * 15)} Plays</span>
                        <span>📥 ${Math.floor(Math.random() * 5)} Downloads</span>
                        <span style="color: #888;">[${song.source}]</span>
                    </div>
                </div>
            </div>
            <div style="display: flex; gap: 8px;">
                <button class="play-btn" style="background: #222; border: none; color: #fff; width: 35px; height: 35px; border-radius: 50%; cursor: pointer; display: flex; align-items: center; justify-content: center;" title="Play">▶</button>
                <button class="download-btn" style="background: #222; border: none; color: #ff4d4d; width: 35px; height: 35px; border-radius: 50%; cursor: pointer; display: flex; align-items: center; justify-content: center;" title="Download">⬇</button>
            </div>
        `;

        // Kitendo cha kubonyeza Play
        const playBtn = songDiv.querySelector('.play-btn');
        playBtn.addEventListener('click', () => {
            const audio = new Audio(song.audioUrl);
            audio.play().catch(e => console.log("Play error:", e));
            alert(`Inacheza: ${song.title} - ${song.artist}`);
        });

        container.appendChild(songDiv);
    }
}
