// Orodha ya nyimbo za mtandaoni (Unaweza kuongeza nyingine zaidi hapa)
const onlineSongs = [
    { title: "Chagua Wimbo", artist: "Xanter MP3", url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3", img: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4" },
    { title: "Mzigo Mpya", artist: "Tanzania Artist", url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3", img: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745" },
    { title: "Vibe la Leo", artist: "East Africa", url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3", img: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819" }
];

const searchInput = document.getElementById("searchInput");
const searchBtn = document.getElementById("searchBtn");
const searchResultsContainer = document.getElementById("searchResults");

// Kutengeneza kicheza sauti cha nyuma ya pazia
const audioPlayer = document.createElement("audio");
document.body.appendChild(audioPlayer);

function performSearch() {
    const query = searchInput.value.toLowerCase().trim();
    searchResultsContainer.innerHTML = ""; // Safisha matokeo ya awali

    if (query === "") return;

    // Kuchuja nyimbo kupitia mtandao/orodha iliyopo
    const results = onlineSongs.filter(song => 
        song.title.toLowerCase().includes(query) || 
        song.artist.toLowerCase().includes(query)
    );

    if (results.length > 0) {
        results.forEach(song => {
            const item = document.createElement("div");
            item.className = "search-item";
            item.innerHTML = `
                <div class="search-item-info">
                    <img src="${song.img}" alt="Cover">
                    <div>
                        <h5>${song.title}</h5>
                        <p>${song.artist}</p>
                    </div>
                </div>
                <button class="select-song-btn">Sikiliza</button>
            `;

            // Kitendo cha kubonyeza "Sikiliza" kwenye wimbo uliochaguliwa
            const selectBtn = item.querySelector(".select-song-btn");
            selectBtn.addEventListener("click", () => {
                audioPlayer.src = song.url;
                audioPlayer.play();

                // Kubadilisha taarifa kwenye player ya chini
                document.querySelector(".song-info h4").textContent = song.title;
                document.querySelector(".song-info p").textContent = song.artist;
                document.querySelector(".song-info img").src = song.img;

                document.querySelector(".play-btn").textContent = "⏸";
            });

            searchResultsContainer.appendChild(item);
        });
    } else {
        searchResultsContainer.innerHTML = `<p style="color: #9ca3af; text-align:center; padding: 10px;">Hakuna wimbo uliopatikana kwa jina hilo.</p>`;
    }
}

// Kusikiliza uandikaji au kitufe cha search
searchBtn.addEventListener("click", performSearch);
searchInput.addEventListener("input", performSearch);

// Kazi ya kitufe cha Play/Pause chini
const playBtn = document.querySelector(".play-btn");
playBtn.addEventListener("click", () => {
    if (audioPlayer.src) {
        if (audioPlayer.paused) {
            audioPlayer.play();
            playBtn.textContent = "⏸";
        } else {
            audioPlayer.pause();
            playBtn.textContent = "▶";
        }
    } else {
        alert("Tafadhali tafuta na uchague wimbo kwanza!");
    }
});
