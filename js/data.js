// Data and model definitions (namespaced under Game)
var Game = window.Game || {};
(function (G) {
  G.itemType = {
    double: "double",
    perUpgrade: "perUpgrade",
    gpmToClick: "gpmToClick",
  };

  G.getOwnedUpgradeCount = function () {
    return G.upgrades.reduce((sum, upgrade) => sum + (upgrade.amount || 0), 0);
  };

  G.getRebirthGpmMultiplier = function () {
    return (
      1 +
      G.rebirthUpgrades.reduce(
        (sum, upgrade) =>
          sum + (upgrade.type === "gpm" ? upgrade.amount * upgrade.effect : 0),
        0
      )
    );
  };

  G.getRebirthClickMultiplier = function () {
    return (
      1 +
      G.rebirthUpgrades.reduce(
        (sum, upgrade) =>
          sum + (upgrade.type === "click" ? upgrade.amount * upgrade.effect : 0),
        0
      )
    );
  };

  G.getRebirthClickPerUpgrade = function () {
    return G.rebirthUpgrades.reduce(
      (sum, upgrade) =>
        sum + (upgrade.type === "upgradeClick" ? upgrade.amount * upgrade.effect : 0),
      0
    );
  };

  G.getRebirthGpmToClick = function () {
    return G.rebirthUpgrades.reduce(
      (sum, upgrade) =>
        sum + (upgrade.type === "gpmToClick" ? upgrade.amount * upgrade.effect : 0),
      0
    );
  };

  G.getRebirthPoints = function () {
    return Math.max(0, Math.floor(Math.sqrt(G.stats.highestEver / 100000)));
  };

  G.getClickValue = function () {
    const baseClick =
      G.stats.goons_per_click +
      G.stats.upgradeClickBonus * G.getOwnedUpgradeCount() +
      G.getOwnedUpgradeCount() * G.getRebirthClickPerUpgrade();
    const gpmBonus = G.stats.gpmClickPercent * G.global_gpm;
    const rebirthGpmClick = G.global_gpm * G.getRebirthGpmToClick();
    return Math.max(
      1,
      Math.round(
        (baseClick + gpmBonus + rebirthGpmClick) *
          G.getRebirthClickMultiplier() *
          100
      ) / 100
    );
  };

  class Item {
    constructor(name, price, type, img, modifier, whichUpgrade) {
      this.name = name;
      this.price = price;
      this.type = type;
      this.modifier = modifier;
      this.img = img;
      this.whichUpgrade = whichUpgrade;
      this.description = this.getDescription();
    }

    getDescription() {
      switch (this.type) {
        case G.itemType.double:
          return `Multiplies the earnings per second of ${this.whichUpgrade} by ${this.modifier}x.`;
        case G.itemType.perUpgrade:
          return `Each upgrade you own now adds ${this.modifier} extra click.`;
        case G.itemType.gpmToClick:
          return `Adds ${Math.round(this.modifier * 100)}% of your current GPM to each click.`;
        default:
          return "Upgrade your earnings";
      }
    }

    applyItemEffect() {
      const upgrade = G.upgrades.find((u) => u.name === this.whichUpgrade);

      switch (this.type) {
        case G.itemType.double:
          if (!upgrade) return;
          upgrade.gpm *= this.modifier;
          break;
        case G.itemType.perUpgrade:
          G.stats.upgradeClickBonus += this.modifier;
          break;
        case G.itemType.gpmToClick:
          G.stats.gpmClickPercent += this.modifier;
          break;
      }

      G.global_gpm = G.getGlobalGPM();
      G.ui.updateGlobalInfo();
      G.ui.updateUpgradeButtons();
      G.ui.updateCount();
      G.ui.updateItemButtons();
      G.storage.saveState();
    }
  }

  G.Item = Item;

  // Default data
  G.defaultStats = {
    Ejaculations: 0,
    goons_per_click: 1,
    highestEver: 0,
    rebirthPoints: 0,
    rebirthPointsTotal: 0,
    totalRebirths: 0,
    upgradeClickBonus: 0,
    gpmClickPercent: 0,
  };

  G.defaultRebirthUpgrades = [
    {
      name: "Soul Resonance",
      price: 2,
      amount: 0,
      type: "gpm",
      effect: 0.1,
      description: "All GPM is increased by 10%.",
    },
    {
      name: "Stellar Insight",
      price: 4,
      amount: 0,
      type: "click",
      effect: 0.1,
      description: "Clicks are 10% stronger.",
    },
    {
      name: "Ascension Beacon",
      price: 8,
      amount: 0,
      type: "gpmToClick",
      effect: 0.01,
      description: "Add 1% of your GPM to each click.",
    },
    {
      name: "Fundamental Echo",
      price: 12,
      amount: 0,
      type: "upgradeClick",
      effect: 0.5,
      description: "Each owned upgrade adds +0.5 click.",
    },
    {
      name: "Quantum Archive",
      price: 20,
      amount: 0,
      type: "gpm",
      effect: 0.25,
      description: "All GPM is increased by 25%.",
    },
  ];

  G.defaultUpgrades = [
    { name: "Chinese Kid", price: 15, amount: 0, gpm: 0.5, img: "ching.jpg" },
    { name: "Hooker", price: 120, amount: 0, gpm: 5, img: "zona.jpg" },
    { name: "Pimp", price: 1500, amount: 0, gpm: 40, img: "pimp.jpg" },
    { name: "Sex Toy Store", price: 18000, amount: 0, gpm: 450, img: "shop.jpg" },
    { name: "Ben Zini", price: 220000, amount: 0, gpm: 3250, img: "zini.jpg" },
    { name: "Yannai", price: 2500000, amount: 0, gpm: 55000, img: "yannai.jpg" },
    { name: "Yair", price: 30000000, amount: 0, gpm: 400000, img: "yair.jpg" },
  ];

  const additionalUpgrades = [
    { name: "Amber Echo", price: 330000000, amount: 0, gpm: 950000, img: "placeholder.jpg" },
    { name: "Lunar Flux", price: 4000000000, amount: 0, gpm: 4200000, img: "placeholder.jpg" },
    { name: "Crimson Drift", price: 48000000000, amount: 0, gpm: 19000000, img: "placeholder.jpg" },
    { name: "Neon Cascade", price: 520000000000, amount: 0, gpm: 85000000, img: "placeholder.jpg" },
    { name: "Velvet Pulse", price: 6200000000000, amount: 0, gpm: 360000000, img: "placeholder.jpg" },
    { name: "Solar Glitch", price: 75000000000000, amount: 0, gpm: 1500000000, img: "placeholder.jpg" },
    { name: "Obsidian Spiral", price: 920000000000000, amount: 0, gpm: 6600000000, img: "placeholder.jpg" },
    { name: "Emerald Orbit", price: 11000000000000000, amount: 0, gpm: 32000000000, img: "placeholder.jpg" },
    { name: "Sapphire Surge", price: 130000000000000000, amount: 0, gpm: 150000000000, img: "placeholder.jpg" },
    { name: "Iron Whisper", price: 1500000000000000000, amount: 0, gpm: 750000000000, img: "placeholder.jpg" },
  ];

  G.defaultUpgrades = G.defaultUpgrades.concat(additionalUpgrades);

  G.generateItemsForUpgrade = function (upgrade) {
    const items = [];
    const doublerMultipliers = [2, 2.5, 3, 4, 5];
    const doublerPriceFactors = [10, 250, 6250, 156250, 3906250];
    const boosterMultipliers = [5, 7.5, 10, 15, 20];
    const boosterPriceFactors = [10, 250, 6250, 156250, 3906250];

    doublerMultipliers.forEach((modifier, index) => {
      items.push(
        new G.Item(
          `${upgrade.name} Doubler ${index + 1}`,
          Math.ceil(upgrade.price * doublerPriceFactors[index]),
          G.itemType.double,
          "placeholder.jpg",
          modifier,
          upgrade.name
        )
      );
    });

    return items;
  };

  G.defaultItems = [];
  G.defaultUpgrades.forEach((upgrade) => {
    G.defaultItems.push(...G.generateItemsForUpgrade(upgrade));
  });

  G.defaultItems.push(
    new G.Item(
      "Augmentation Array",
      2500,
      G.itemType.perUpgrade,
      "placeholder.jpg",
      1,
      ""
    )
  );

  const gpmToClickCosts = [
    60000,
    1500000,
    37500000,
    937500000,
    23437500000,
    585937500000,
    14648437500000,
    366210937500000,
    9155273437500000,
    228881835937500000,
  ];
  gpmToClickCosts.forEach((price, index) => {
    G.defaultItems.push(
      new G.Item(
        `Kinetic Feedback ${index + 1}`,
        price,
        G.itemType.gpmToClick,
        "placeholder.jpg",
        0.01,
        ""
      )
    );
  });

  G.defaultItems.sort((a, b) => a.price - b.price);
})(Game);
