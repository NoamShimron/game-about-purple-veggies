// Data and model definitions (namespaced under Game)
var Game = window.Game || {};
(function (G) {
  G.itemType = {
    double: "double",
    perClick: "perClick",
    price: "price",
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
          return `Doubles the earnings per second of ${this.whichUpgrade}`;
        case G.itemType.perClick:
          return `Increases earnings per click by ${this.modifier} per ${this.whichUpgrade}`;
        case G.itemType.price:
          const discount = Math.round((1 - this.modifier) * 100);
          return `Reduces ${this.whichUpgrade} cost by ${discount}%`;
        default:
          return "Upgrade your earnings";
      }
    }

    applyItemEffect() {
      const upgrade = G.upgrades.find((u) => u.name === this.whichUpgrade);
      if (!upgrade) return;

      switch (this.type) {
        case G.itemType.double:
          upgrade.gpm *= this.modifier;
          break;
        case G.itemType.perClick:
          G.stats.goons_per_click += upgrade.amount * this.modifier;
          break;
        case G.itemType.price:
          upgrade.price = Math.floor(upgrade.price * this.modifier);
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
  G.defaultStats = { Ejaculations: 0, goons_per_click: 1 };
  G.defaultUpgrades = [
    { name: "Chinese Kid", price: 15, amount: 0, gpm: 0.5, img: "ching.jpg" },
    { name: "Hooker", price: 100, amount: 0, gpm: 5, img: "zona.jpg" },
    { name: "Pimp", price: 1150, amount: 0, gpm: 40, img: "pimp.jpg" },
    { name: "Sex Toy Store", price: 13000, amount: 0, gpm: 450, img: "shop.jpg" },
    { name: "Ben Zini", price: 150000, amount: 0, gpm: 3250, img: "zini.jpg" },
    { name: "Yannai", price: 1700000, amount: 0, gpm: 55000, img: "yannai.jpg" },
    { name: "Yair", price: 20000000, amount: 0, gpm: 400000, img: "yair.jpg" },
  ];

  G.defaultItems = [
    { name: "ching gps doubled", price: 100, type: G.itemType.double, img: "ching.jpg", modifier: 2, whichUpgrade: "Chinese Kid" },
    { name: "golden ching gps doubled", price: 5000, type: G.itemType.double, img: "ching.jpg", modifier: 2, whichUpgrade: "Chinese Kid" },
    { name: "hooker gps doubled", price: 700, type: G.itemType.double, img: "zona.jpg", modifier: 2, whichUpgrade: "Hooker" },
    { name: "golden hooker gps doubled", price: 35000, type: G.itemType.double, img: "zona.jpg", modifier: 2, whichUpgrade: "Hooker" },
    { name: "gpc increased per ching", price: 3000, type: G.itemType.perClick, img: "ching.jpg", modifier: 1, whichUpgrade: "Chinese Kid" },
    { name: "golden gpc increased per ching", price: 150000, type: G.itemType.perClick, img: "ching.jpg", modifier: 0.5, whichUpgrade: "Chinese Kid" },
    { name: "pimp gps doubled", price: 10000, type: G.itemType.double, img: "pimp.jpg", modifier: 2, whichUpgrade: "Pimp" },
    { name: "golden pimp gps doubled", price: 500000, type: G.itemType.double, img: "pimp.jpg", modifier: 2, whichUpgrade: "Pimp" },
    { name: "gpc increased per hooker", price: 15000, type: G.itemType.perClick, img: "zona.jpg", modifier: 0.5, whichUpgrade: "Pimp" },
    { name: "golden gpc increased per hooker", price: 750000, type: G.itemType.perClick, img: "zona.jpg", modifier: 0.5, whichUpgrade: "Pimp" },
    { name: "gpc increased per pimp", price: 100000, type: G.itemType.perClick, img: "pimp.jpg", modifier: 1, whichUpgrade: "Pimp" },
    { name: "golden gpc increased per pimp", price: 5000000, type: G.itemType.perClick, img: "pimp.jpg", modifier: 1, whichUpgrade: "Pimp" },
    { name: "shop gps doubled", price: 120000, type: G.itemType.double, img: "shop.jpg", modifier: 2, whichUpgrade: "Sex Toy Store" },
    { name: "golden shop gps doubled", price: 6000000, type: G.itemType.double, img: "shop.jpg", modifier: 2, whichUpgrade: "Sex Toy Store" },
    { name: "gpc increased per shop", price: 150000, type: G.itemType.perClick, img: "shop.jpg", modifier: 2, whichUpgrade: "Sex Toy Store" },
    { name: "golden gpc increased per shop", price: 7500000, type: G.itemType.perClick, img: "shop.jpg", modifier: 2, whichUpgrade: "Sex Toy Store" },
    { name: "price of ching majorly decreased", price: 300000, type: G.itemType.price, img: "ching.jpg", modifier: 0.6, whichUpgrade: "Chinese Kid" },
    { name: "golden price of ching majorly decreased", price: 15000000, type: G.itemType.price, img: "ching.jpg", modifier: 0.8, whichUpgrade: "Chinese Kid" },
    { name: "price of hooker majorly decreased", price: 700000, type: G.itemType.price, img: "zona.jpg", modifier: 0.6, whichUpgrade: "Hooker" },
    { name: "golden price of hooker majorly decreased", price: 35000000, type: G.itemType.price, img: "zona.jpg", modifier: 0.8, whichUpgrade: "Hooker" },
    { name: "zini gps doubled", price: 1500000, type: G.itemType.double, img: "zini.jpg", modifier: 2, whichUpgrade: "Ben Zini" },
    { name: "golden zini gps doubled", price: 75000000, type: G.itemType.double, img: "zini.jpg", modifier: 2, whichUpgrade: "Ben Zini" },
    { name: "gpc increased per zini", price: 2000000, type: G.itemType.perClick, img: "zini.jpg", modifier: 2, whichUpgrade: "Ben Zini" },
    { name: "golden gpc increased per zini", price: 100000000, type: G.itemType.perClick, img: "zini.jpg", modifier: 2, whichUpgrade: "Ben Zini" },
    { name: "price of pimp majorly decreased", price: 3000000, type: G.itemType.price, img: "pimp.jpg", modifier: 0.6, whichUpgrade: "Pimp" },
    { name: "golden price of pimp majorly decreased", price: 150000000, type: G.itemType.price, img: "pimp.jpg", modifier: 0.8, whichUpgrade: "Pimp" },
    { name: "price of shop majorly decreased", price: 5000000, type: G.itemType.price, img: "shop.jpg", modifier: 0.6, whichUpgrade: "Sex Toy Store" },
    { name: "golden price of shop majorly decreased", price: 250000000, type: G.itemType.price, img: "shop.jpg", modifier: 0.8, whichUpgrade: "Sex Toy Store" },
    { name: "yannai gps doubled", price: 18000000, type: G.itemType.double, img: "yannai.jpg", modifier: 2, whichUpgrade: "Yannai" },
    { name: "golden yannai gps doubled", price: 900000000, type: G.itemType.double, img: "yannai.jpg", modifier: 2, whichUpgrade: "Yannai" },
    { name: "gpc increased per yannai", price: 19000000, type: G.itemType.perClick, img: "yannai.jpg", modifier: 2, whichUpgrade: "Yannai" },
    { name: "golden gpc increased per yannai", price: 950000000, type: G.itemType.perClick, img: "yannai.jpg", modifier: 2, whichUpgrade: "Yannai" },
    { name: "price of zini majorly decreased", price: 20000000, type: G.itemType.price, img: "zini.jpg", modifier: 0.6, whichUpgrade: "Ben Zini" },
    { name: "golden price of zini majorly decreased", price: 1000000000, type: G.itemType.price, img: "zini.jpg", modifier: 0.8, whichUpgrade: "Ben Zini" },
    { name: "yair gps doubled", price: 50000000, type: G.itemType.double, img: "yair.jpg", modifier: 2, whichUpgrade: "Yair" },
    { name: "golden yair gps doubled", price: 2500000000, type: G.itemType.double, img: "yair.jpg", modifier: 2, whichUpgrade: "Yair" },
    { name: "price of yannai majorly decreased", price: 100000000, type: G.itemType.price, img: "yannai.jpg", modifier: 0.6, whichUpgrade: "Yannai" },
    { name: "golden price of yannai majorly decreased", price: 5000000000, type: G.itemType.price, img: "yannai.jpg", modifier: 0.8, whichUpgrade: "Yannai" },
    { name: "price of yair majorly decreased", price: 200000000, type: G.itemType.price, img: "yair.jpg", modifier: 0.6, whichUpgrade: "Yair" },
    { name: "golden price of yair majorly decreased", price: 10000000000, type: G.itemType.price, img: "yair.jpg", modifier: 0.8, whichUpgrade: "Yair" },
  ].sort((a, b) => a.price - b.price);
})(Game);
