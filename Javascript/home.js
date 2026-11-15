document.addEventListener("DOMContentLoaded", () => {
  const grid = document.getElementById("character-grid");

  if (!grid) {
    console.error("Không tìm thấy #character-grid");
    return;
  }

  async function loadCharacters() {
    try {
      grid.innerHTML = `<p style="grid-column: 1 / -1; text-align: center; color: #888;">Loading characters...</p>`;

      const response = await fetch("https://umapyoi.net/api/v1/character/list");

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const characters = await response.json();
      console.log("Số nhân vật nhận được:", characters.length);

      if (!Array.isArray(characters) || characters.length === 0) {
        grid.innerHTML = `<p style="grid-column: 1 / -1; text-align: center;">Không tìm thấy nhân vật nào.</p>`;
        updateItemCount(0);
        return;
      }

      grid.innerHTML = characters
        .map(
          (char) => `
        <div class="character-card" onclick="goToDetail(${char.id})">
          <img 
            src="${char.thumb_img || ''}" 
            alt="${char.name_en || 'Character'}"
            loading="lazy"
            onerror="this.src='https://via.placeholder.com/200x240?text=No+Image'"
          >
          <div class="info">
            <h3>${char.name_en || "Unknown"}</h3>
            <p class="jp-name">${char.name_jp || ""}</p>
          </div>
        </div>
      `
        )
        .join("");

      updateItemCount(characters.length);
    } catch (error) {
      console.error("Lỗi khi tải nhân vật:", error);
      grid.innerHTML = `
        <p style="grid-column: 1 / -1; text-align: center; color: #ff6b9d;">
          Lỗi tải dữ liệu: ${error.message}
        </p>
      `;
      updateItemCount(0);
    }
  }

  function goToDetail(id) {
    window.location.href = `detail.html?id=${id}`;
  }

  function updateItemCount(count) {
    const countEl = document.getElementById("item-count");
    if (countEl) countEl.textContent = count;
  }

  loadCharacters();
});

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