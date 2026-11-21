
function updateResetTimers() {
  const now = new Date();

  function getTimeUntil(hourUTC) {
    const target = new Date(now);
    target.setUTCHours(hourUTC, 0, 0, 0);

    if (target <= now) {
      target.setUTCDate(target.getUTCDate() + 1);
    }

    const diff = target - now;
    const h = String(Math.floor(diff / 3600000)).padStart(2, "0");
    const m = String(Math.floor((diff % 3600000) / 60000)).padStart(2, "0");
    const s = String(Math.floor((diff % 60000) / 1000)).padStart(2, "0");
    return `${h}:${m}:${s}`;
  }

  document.getElementById("jp-login").textContent = getTimeUntil(20);
  document.getElementById("jp-content").textContent = getTimeUntil(20);
  document.getElementById("en-login").textContent = getTimeUntil(13);
  document.getElementById("en-content").textContent = getTimeUntil(13);
}

updateResetTimers();
setInterval(updateResetTimers, 1000);

async function loadBirthdayCharacter() {
  try {
    const res = await fetch("https://umapyoi.net/api/v1/character/list");
    const characters = await res.json();

    const kris = characters.find(c => 
      c.name_en === "Symboli Kris S" || 
      c.name_en_internal === "symbolikriss"
    );

    if (kris) {
      const img = document.querySelector(".birthday-character img");
      const name = document.querySelector(".birthday-character span");

      if (img) img.src = kris.thumb_img;
      if (name) name.textContent = kris.name_en;
    }
  } catch (err) {
    console.error("Không tải được nhân vật sinh nhật:", err);
  }
}

loadBirthdayCharacter();

async function loadGachaBanners() {
  const grid = document.getElementById("gacha-grid");
  if (!grid) return;

  try {
    grid.innerHTML = `<p style="text-align:center; color:#888;">Loading Gacha Banners...</p>`;

    const response = await fetch("https://umapyoi.net/api/v1/gacha/current");

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    console.log("Gacha data:", data);

    const banners = Array.isArray(data) ? data : [data];

    if (!banners || banners.length === 0) {
      grid.innerHTML = `<p style="text-align:center;">Không có banner nào đang diễn ra.</p>`;
      return;
    }

    grid.innerHTML = banners.map((banner) => {
      const name = banner.name || banner.title || "Unknown Banner";
      const endTime = banner.end_time || banner.end || banner.end_date || "N/A";
      const image = banner.image || banner.banner_img || banner.img || "";

      return `
        <div class="gacha-card">
          ${image ? `<img src="${image}" alt="${name}" class="gacha-img">` : ""}
          <div class="gacha-info">
            <h3>${name}</h3>
            <p class="gacha-end">Ends: ${endTime}</p>
          </div>
        </div>
      `;
    }).join("");

  } catch (error) {
    console.error("Lỗi khi tải Gacha:", error);
    grid.innerHTML = `<p style="text-align:center; color:#ff6b9d;">Không tải được Gacha Banners.</p>`;
  }
}

document.addEventListener("DOMContentLoaded", () => {
  loadGachaBanners();
});