(function (G) {
  const saved = G.storage.loadState();

  if (saved && saved.stats && saved.upgrades) {
    G.stats = saved.stats;
    G.upgrades = saved.upgrades;
    G.boughtItems = saved.boughtItems || [];
    G.rebirthUpgrades = saved.rebirthUpgrades || G.defaultRebirthUpgrades.map((u) => ({ ...u }));

    G.items = [];
    G.defaultItems.forEach((it) => {
      if (!G.boughtItems.some((b) => b.name === it.name)) {
        G.items.push(
          new G.Item(
            it.name,
            it.price,
            it.type,
            it.img,
            it.modifier,
            it.whichUpgrade
          )
        );
      }
    });
  } else {
    G.stats = { ...G.defaultStats };
    G.upgrades = G.defaultUpgrades.map((u) => ({ ...u }));
    G.rebirthUpgrades = G.defaultRebirthUpgrades.map((u) => ({ ...u }));
    G.boughtItems = [];
    G.items = G.defaultItems.map(
      (it) =>
        new G.Item(
          it.name,
          it.price,
          it.type,
          it.img,
          it.modifier,
          it.whichUpgrade
        )
    );
  }

  G.global_info = {
    stats: G.stats,
    upgrades: G.upgrades,
    boughtItems: G.boughtItems,
  };
  G.global_gpm = G.getGlobalGPM();

  G.ui.updateUpgradeButtons();
  G.ui.updateRebirthButtons();
  G.ui.updateItemButtons();
  G.ui.isEnough();

  const eggplantBtn = G.ui.elements.eggplantButton;
  if (eggplantBtn) {
    eggplantBtn.addEventListener("mouseenter", () => {
      G.ui.changeImage("download-hovered.jpg");
    });

    eggplantBtn.addEventListener("mouseleave", () => {
      G.ui.changeImage("download-good.jpg");
    });

    eggplantBtn.addEventListener("click", () => {
      G.stats.Ejaculations += G.getClickValue();
      G.ui.updateCount();
      G.ui.changeImage("download-clicked.jpg");
      setTimeout(() => G.ui.changeImage("download-good.jpg"), 150);
    });
  }

  if (G.ui.elements.rebirthButton) {
    G.ui.elements.rebirthButton.addEventListener("click", () => G.ui.performRebirth());
  }

  if (G.ui.elements.resetButton) {
    G.ui.elements.resetButton.addEventListener("click", () => G.ui.resetGame());
  }

  setInterval(() => {
    if (G.global_gpm > 0) {
      G.stats.Ejaculations = Math.round((G.stats.Ejaculations + G.global_gpm / 20) * 100) / 100;
      G.ui.updateCount();
    }
  }, 100);

  G.ui.updateCount();
  console.log("Game initialized successfully");
})(Game);
