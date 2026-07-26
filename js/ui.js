(function (G) {
  G.ui = G.ui || {};

  G.ui.elements = {
    gps: document.querySelector(".gps"),
    upgradeContainer: document.querySelector(".js-upgrades"),
    itemContainer: document.querySelector(".js-items"),
    countDisplay: document.querySelector(".points"),
    eggplantButton: document.querySelector(".eggplantButton"),
    resetButton: document.querySelector(".header-button"),
  };

  G.ui.updateGlobalInfo = function () {
    G.global_info = {
      stats: G.stats,
      upgrades: G.upgrades,
      boughtItems: G.boughtItems,
    };
  };

  G.ui.changeImage = function (image) {
    const img = G.ui.elements.eggplantButton.querySelector("img");
    if (img) img.src = image;
  };

  G.ui.formatNumber = function (num) {
    if (num >= 1e9) return (num / 1e9).toFixed(2) + "B";
    if (num >= 1e6) return (num / 1e6).toFixed(2) + "M";
    if (num >= 1e3) return (num / 1e3).toFixed(2) + "K";
    return Math.floor(num).toString();
  };

  G.ui.updateItemButtons = function () {
    let html = "";
    const visibleItems = G.items.filter((item) => !G.boughtItems.some((b) => b.name === item.name));

    visibleItems.forEach((item, displayIndex) => {
      const actualIndex = G.items.indexOf(item);
      const canAfford = G.stats.Ejaculations >= item.price;
      const priceColor = canAfford ? "#4CAF50" : "#FF6B6B";
      
      html += `
        <button class="item" data-item-id="${item.name}" data-index="${actualIndex}">
          <img src="${item.img}" alt="${item.name}" class="buttonimg" draggable="false"/>
          <span class="item-title">${item.name}</span>
          <span class="item-tooltip">
            <span class="tooltip-header">${item.name}</span>
            <span class="tooltip-description">${item.description}</span>
            <span class="tooltip-price" style="color: ${priceColor}">
              Price: ${G.ui.formatNumber(item.price)}
            </span>
          </span>
        </button>`;
    });

    G.ui.elements.itemContainer.innerHTML = html;

    G.ui.elements.itemContainer.querySelectorAll(".item").forEach((button) => {
      const tooltip = button.querySelector(".item-tooltip");
      
      // Update tooltip price color on hover
      button.addEventListener("mouseenter", () => {
        const idx = Number(button.dataset.index);
        const chosen = G.items[idx];
        const canAfford = G.stats.Ejaculations >= chosen.price;
        const priceElement = tooltip.querySelector(".tooltip-price");
        if (priceElement) {
          priceElement.style.color = canAfford ? "#4CAF50" : "#FF6B6B";
        }
      });

      button.addEventListener("click", () => {
        const idx = Number(button.dataset.index);
        const chosen = G.items[idx];
        if (!chosen) return;

        if (G.stats.Ejaculations >= chosen.price) {
          G.stats.Ejaculations -= chosen.price;
          chosen.applyItemEffect();
          G.boughtItems.push(chosen);
          G.items.splice(idx, 1);
          G.ui.updateGlobalInfo();
          G.ui.isEnough();
          G.storage.saveState();
          G.ui.updateItemButtons();
        }
        G.ui.updateCount();
      });
    });
  };

  G.ui.updateUpgradeButtons = function () {
    let html = "";
    G.upgrades.forEach((upgrade, index) => {
      html += `
        <button class="upgrade" data-upgrade-id="${upgrade.name}" data-index="${index}">
          <img src="${upgrade.img}" alt="${upgrade.name}" class="buttonimg" draggable="false"/>
          <div class="upgrade-info">
            <span class="upgrade-title">${upgrade.name}</span>
            <span class="upgrade-cost">Cost: ${G.ui.formatNumber(upgrade.price)}</span>
            <span class="upgrade-GPM">EPS: ${G.ui.formatNumber(upgrade.gpm)}</span>
          </div>
          <p class="upgrade-count">${upgrade.amount}</p>
        </button>`;
    });

    G.ui.elements.upgradeContainer.innerHTML = html;

    G.ui.elements.upgradeContainer.querySelectorAll(".upgrade").forEach((button) => {
      const index = Number(button.dataset.index);
      button.addEventListener("click", () => {
        const upgrade = G.upgrades[index];
        if (!upgrade) return;

        if (G.stats.Ejaculations >= upgrade.price) {
          G.stats.Ejaculations -= upgrade.price;
          upgrade.amount++;
          upgrade.price = Math.floor(upgrade.price * 1.1);

          G.boughtItems.forEach((it) => {
            if (
              it.type === G.itemType.perClick &&
              it.whichUpgrade === upgrade.name
            ) {
              G.stats.goons_per_click += it.modifier;
            }
          });

          G.ui.updateGlobalInfo();
          G.ui.isEnough();
          G.storage.saveState();
          G.global_gpm = G.getGlobalGPM();
          G.ui.updateUpgradeButtons();
        } else {
          button.classList.add("upgrade-denied");
          setTimeout(() => button.classList.remove("upgrade-denied"), 1000);
        }
      });
    });

    G.ui.updateCount();
  };

  G.ui.updateCount = function () {
    G.ui.elements.countDisplay.innerText = `${G.ui.formatNumber(G.stats.Ejaculations)}`;
    G.ui.elements.gps.innerText = `EPS: ${G.ui.formatNumber(G.global_gpm)}`;
    G.storage.saveState();
  };

  G.ui.isEnough = function () {
    G.upgrades.forEach((upgrade, idx) => {
      const button = G.ui.elements.upgradeContainer.querySelector(
        `.upgrade[data-index="${idx}"]`
      );
      if (!button) return;

      if (G.stats.Ejaculations >= upgrade.price) {
        button.classList.remove("disabled");
      } else {
        button.classList.add("disabled");
      }
    });
  };

  G.ui.resetGame = function () {
    if (!confirm("Are you sure you want to reset? All progress will be lost."))
      return;

    Object.assign(G.stats, G.defaultStats);
    G.upgrades.length = 0;
    G.defaultUpgrades.forEach((u) => G.upgrades.push({ ...u }));

    G.items.length = 0;
    G.defaultItems.forEach((itemData) =>
      G.items.push(
        new G.Item(
          itemData.name,
          itemData.price,
          itemData.type,
          itemData.img,
          itemData.modifier,
          itemData.whichUpgrade
        )
      )
    );

    G.boughtItems.length = 0;
    G.global_gpm = G.getGlobalGPM();
    G.ui.updateGlobalInfo();
    G.ui.updateUpgradeButtons();
    G.ui.updateItemButtons();
    G.ui.updateCount();
    G.storage.saveState();
  };
})(Game);
