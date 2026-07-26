(function (G) {
  G.storage = G.storage || {};

  G.storage.loadState = function () {
    const raw = localStorage.getItem("global info");
    if (!raw) return null;
    try {
      const parsed = JSON.parse(raw);
      return parsed;
    } catch (e) {
      console.warn("Failed to parse saved state, starting fresh", e);
      return null;
    }
  };

  G.storage.saveState = function () {
    const state = {
      stats: G.stats,
      upgrades: G.upgrades,
      boughtItems: G.boughtItems,
      rebirthUpgrades: G.rebirthUpgrades,
      highestEver: G.stats.highestEver,
    };
    localStorage.setItem("global info", JSON.stringify(state));
  };

  G.getGlobalGPM = function () {
    let temp_gpm = 0;
    G.upgrades.forEach((upgrade) => {
      temp_gpm += upgrade.gpm * upgrade.amount;
    });
    if (typeof G.getRebirthGpmMultiplier === "function") {
      temp_gpm *= G.getRebirthGpmMultiplier();
    }
    return temp_gpm;
  };
})(Game);
