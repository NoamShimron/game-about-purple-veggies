(function (G) {
  G.ui = G.ui || {};

  G.ui.elements = {
    gps: document.querySelector(".gps"),
    clickValueDisplay: document.querySelector(".click-value-number"),
    rebirthCount: document.querySelector(".rebirth-count"),
    rebirthButton: document.querySelector(".rebirth-button"),
    nextRebirthValue: document.querySelector(".next-rebirth-value"),
    upgradeContainer: document.querySelector(".js-upgrades"),
    rebirthContainer: document.querySelector(".js-rebirth"),
    itemContainer: document.querySelector(".js-items"),
    countDisplay: document.querySelector(".points"),
    eggplantButton: document.querySelector(".eggplantButton"),
    resetButton: document.querySelector(".header-button"),
  };
  G.ui.nextItemRevealCost = Infinity;

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
    if (!Number.isFinite(num)) return "0";
    return num % 1 === 0 ? num.toString() : num.toFixed(1);
  };

  G.ui.updateItemButtons = function () {
    if (!G.ui.elements.itemContainer) return;
    let html = "";
    const maxCost = Math.max(100, G.stats.highestEver * 10);
    const visibleItems = G.items
      .filter(
        (item) =>
          !G.boughtItems.some((b) => b.name === item.name) &&
          item.price <= maxCost
      )
      .sort((a, b) => a.price - b.price);

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
    const hiddenItems = G.items.filter(
      (item) =>
        !G.boughtItems.some((b) => b.name === item.name) &&
        item.price > maxCost
    );
    G.ui.nextItemRevealCost = hiddenItems.length
      ? Math.min(...hiddenItems.map((item) => item.price))
      : Infinity;

    G.ui.elements.itemContainer.querySelectorAll(".item").forEach((button) => {
      const tooltip = button.querySelector(".item-tooltip");
      if (!tooltip) return;

      button.addEventListener("mouseenter", () => {
        const idx = Number(button.dataset.index);
        const chosen = G.items[idx];
        if (!chosen) return;
        const canAfford = G.stats.Ejaculations >= chosen.price;
        const priceElement = tooltip.querySelector(".tooltip-price");
        if (priceElement) {
          priceElement.style.color = canAfford ? "#4CAF50" : "#FF6B6B";
        }

        const rect = button.getBoundingClientRect();
        tooltip.style.left = `${rect.left + rect.width / 2}px`;
        tooltip.style.top = `${rect.top}px`;
        tooltip.classList.add("visible");
      });

      button.addEventListener("mouseleave", () => {
        tooltip.classList.remove("visible");
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
    if (!G.ui.elements.upgradeContainer) return;
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

  G.ui.updateRebirthButtons = function () {
    if (!G.ui.elements.rebirthContainer) return;

    let html = "";
    G.rebirthUpgrades.forEach((rebirth, index) => {
      const canAfford = G.stats.rebirthPoints >= rebirth.price;
      html += `
        <button class="upgrade ${canAfford ? "" : "disabled"}" data-rebirth-index="${index}">
          <div class="upgrade-info">
            <span class="upgrade-title">${rebirth.name}</span>
            <span class="upgrade-cost">Cost: ${G.ui.formatNumber(rebirth.price)} RP</span>
            <span class="upgrade-GPM">Owned: ${rebirth.amount}</span>
            <span class="upgrade-description">${rebirth.description || "Permanent bonus for future runs."}</span>
          </div>
          <p class="upgrade-count">x${rebirth.effect}</p>
        </button>`;
    });

    G.ui.elements.rebirthContainer.innerHTML = html;

    G.ui.elements.rebirthContainer.querySelectorAll(".upgrade").forEach((button) => {
      const index = Number(button.dataset.rebirthIndex);
      button.addEventListener("click", () => {
        const rebirth = G.rebirthUpgrades[index];
        if (!rebirth) return;

        if (G.stats.rebirthPoints >= rebirth.price) {
          G.stats.rebirthPoints -= rebirth.price;
          rebirth.amount++;
          G.ui.updateCount();
          G.ui.updateRebirthButtons();
          G.storage.saveState();
        } else {
          button.classList.add("upgrade-denied");
          setTimeout(() => button.classList.remove("upgrade-denied"), 1000);
        }
      });
    });
  };

  G.ui.performRebirth = function () {
    const available = G.getRebirthPoints();
    const total = G.stats.rebirthPointsTotal || 0;
    const earned = Math.max(0, available - total);
    if (earned <= 0) return;

    G.stats.rebirthPoints = (G.stats.rebirthPoints || 0) + earned;
    G.stats.rebirthPointsTotal = total + earned;
    G.stats.totalRebirths += 1;

    const keepHighest = G.stats.highestEver;
    const keepRebirthPoints = G.stats.rebirthPoints;
    const keepTotalRebirths = G.stats.totalRebirths;
    const keepRebirthPointsTotal = G.stats.rebirthPointsTotal;

    G.stats = {
      ...G.defaultStats,
      highestEver: keepHighest,
      rebirthPoints: keepRebirthPoints,
      totalRebirths: keepTotalRebirths,
      rebirthPointsTotal: keepRebirthPointsTotal,
    };

    G.upgrades.length = 0;
    G.defaultUpgrades.forEach((u) => G.upgrades.push({ ...u }));

    G.boughtItems.length = 0;
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

    G.global_gpm = G.getGlobalGPM();
    G.ui.updateGlobalInfo();
    G.ui.updateUpgradeButtons();
    G.ui.updateItemButtons();
    G.ui.updateCount();
    G.storage.saveState();
  };

  G.ui.updateCount = function () {
    if (G.stats.Ejaculations > G.stats.highestEver) {
      G.stats.highestEver = G.stats.Ejaculations;
    }

    if (G.ui.elements.countDisplay) {
      G.ui.elements.countDisplay.innerText = `${G.ui.formatNumber(G.stats.Ejaculations)}`;
    }
    if (G.ui.elements.gps) {
      G.ui.elements.gps.innerText = `EPS: ${G.ui.formatNumber(G.global_gpm)}`;
    }
    if (G.ui.elements.clickValueDisplay) {
      G.ui.elements.clickValueDisplay.innerText = `${G.ui.formatNumber(G.getClickValue())}`;
    }
    if (G.ui.elements.rebirthCount) {
      G.ui.elements.rebirthCount.innerText = `${G.ui.formatNumber(G.stats.rebirthPoints)}`;
    }
    if (G.ui.elements.nextRebirthValue) {
      const total = G.stats.rebirthPointsTotal || 0;
      const nextThreshold = Math.pow(total + 1, 2) * 100000;
      G.ui.elements.nextRebirthValue.innerText = `${G.ui.formatNumber(nextThreshold)}`;
    }
    if (G.ui.elements.rebirthButton) {
      const nextPoints = G.getRebirthPoints();
      const earnedPoints = Math.max(0, nextPoints - (G.stats.rebirthPointsTotal || 0));
      G.ui.elements.rebirthButton.disabled = earnedPoints <= 0;
    }
    if (G.ui.elements.rebirthContainer) {
      G.ui.updateRebirthButtons();
    }
    if (G.ui.elements.itemContainer) {
      const maxCost = Math.max(100, G.stats.highestEver * 10);
      if (maxCost >= G.ui.nextItemRevealCost) {
        G.ui.updateItemButtons();
      }
    }
    G.storage.saveState();
  };

  G.ui.isEnough = function () {
    if (!G.ui.elements.upgradeContainer) return;
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
