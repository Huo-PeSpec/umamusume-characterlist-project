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

  const searchInput = document.getElementById("search-input");
  if (searchInput) {
    searchInput.addEventListener("input", function () {
      const keyword = this.value.toLowerCase().trim();
      const cards = document.querySelectorAll(".character-card");
      let visibleCount = 0;

      cards.forEach((card) => {
        const name = card.querySelector("h3")?.textContent.toLowerCase() || "";
        const jpName = card.querySelector(".jp-name")?.textContent.toLowerCase() || "";

        if (name.includes(keyword) || jpName.includes(keyword)) {
          card.style.display = "block";
          visibleCount++;
        } else {
          card.style.display = "none";
        }
      });

      updateItemCount(visibleCount);
    });
  }

  loadCharacters();
});