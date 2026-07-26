eggplant={
  html:document.querySelector('.eggplant'),
  normal:  ()=>{changeImage('download-good.jpg')},
  hard: ()=>{changeImage('download-hovered.jpg')},
  cumming: ()=>{changeImage('download-clicked.jpg')},
}
const itemType = {
  double: "double",
  perClick: "perClick",
  price: "price"
}
class item{
  
  constructor(name, price, type, img, modifier, whichUpgrade) {
    this.name = name;
    this.price = price;
    this.type = type;
    this.modifier = modifier;
    this.img = img;
    this.whichUpgrade = whichUpgrade;
  }
  applyItemEffect() {
    const upgrade = upgrades.find(upgrade => upgrade.name === this.whichUpgrade);
    if (upgrade) {
      switch (this.type) {
        case itemType.double:
          upgrade.gpm *= this.modifier;
          break;
        case itemType.perClick:
          // Dynamically increase goons_per_click based on the upgrade amount
          stats.goons_per_click += upgrade.amount * this.modifier;
          break;
        case itemType.price:
          upgrade.price = Math.floor(upgrade.price * this.modifier);
          break;
      }
      global_gpm = getGlobalGPM(); // Update global_gpm after applying the item effect
      updateGlobalInfo();
      updateUpgradeButtons();
      updateCount();
      updateItemButtons(); // Re-render the item buttons to reflect changes
      sendToLocalStorage(); // Save the updated state to localStorage
    }
  }

}
const defaultStats={Ejaculations:0, goons_per_click:1};
const defaultUpgrades =[
  {name:"Chinese Kid",price:15, amount:0, gpm:0.5, img:"ching.jpg"}, 
  {name:"Hooker", price:100, amount: 0, gpm:5, img:"zona.jpg"}, 
  {name:"Pimp",price:1150, amount: 0, gpm:40,img:"pimp.jpg"},
  {name:"Sex Toy Store", price:13000, amount: 0, gpm:450, img:"shop.jpg"}, 
  {name:"Ben Zini",price:150000, amount: 0, gpm:3250,img:"zini.jpg"},
  {name:"Yannai", price:1700000, amount: 0, gpm:55000, img:"yannai.jpg"}, 
  {name:"Yair",price:20000000, amount: 0, gpm:400000,img:"yair.jpg"}] ;
const gps = document.querySelector('.gps');
const upgradeContainer = document.querySelector('.js-upgrades');
const itemContainer = document.querySelector('.js-items');
const countDisplay = document.querySelector('.points');
const items = []; // Initialize an empty items array
const defaultItems = [
  { name: "ching gps doubled", price: 100, type: itemType.double, img: "ching.jpg", modifier: 2, whichUpgrade: "Chinese Kid" },
  { name: "golden ching gps doubled", price: 5000, type: itemType.double, img: "ching.jpg", modifier: 2, whichUpgrade: "Chinese Kid" },
  { name: "hooker gps doubled", price: 700, type: itemType.double, img: "zona.jpg", modifier: 2, whichUpgrade: "Hooker" },
  { name: "golden hooker gps doubled", price: 35000, type: itemType.double, img: "zona.jpg", modifier: 2, whichUpgrade: "Hooker" },
  { name: "gpc increased per ching", price: 3000, type: itemType.perClick, img: "ching.jpg", modifier: 1, whichUpgrade: "Chinese Kid" },
  { name: "golden gpc increased per ching", price: 150000, type: itemType.perClick, img: "ching.jpg", modifier: 0.5, whichUpgrade: "Chinese Kid" },
  { name: "pimp gps doubled", price: 10000, type: itemType.double, img: "pimp.jpg", modifier: 2, whichUpgrade: "Pimp" },
  { name: "golden pimp gps doubled", price: 500000, type: itemType.double, img: "pimp.jpg", modifier: 2, whichUpgrade: "Pimp" },
  { name: "gpc increased per hooker", price: 15000, type: itemType.perClick, img: "zona.jpg", modifier: 0.5, whichUpgrade: "Pimp" },
  { name: "golden gpc increased per hooker", price: 750000, type: itemType.perClick, img: "zona.jpg", modifier: 0.5, whichUpgrade: "Pimp" },
  { name: "gpc increased per pimp", price: 100000, type: itemType.perClick, img: "pimp.jpg", modifier: 1, whichUpgrade: "Pimp" },
  { name: "golden gpc increased per pimp", price: 5000000, type: itemType.perClick, img: "pimp.jpg", modifier: 1, whichUpgrade: "Pimp" },
  { name: "shop gps doubled", price: 120000, type: itemType.double, img: "shop.jpg", modifier: 2, whichUpgrade: "Sex Toy Store" },
  { name: "golden shop gps doubled", price: 6000000, type: itemType.double, img: "shop.jpg", modifier: 2, whichUpgrade: "Sex Toy Store" },
  { name: "gpc increased per shop", price: 150000, type: itemType.perClick, img: "shop.jpg", modifier: 2, whichUpgrade: "Sex Toy Store" },
  { name: "golden gpc increased per shop", price: 7500000, type: itemType.perClick, img: "shop.jpg", modifier: 2, whichUpgrade: "Sex Toy Store" },
  { name: "price of ching majorly decreased", price: 300000, type: itemType.price, img: "ching.jpg", modifier: 0.6, whichUpgrade: "Chinese Kid" },
  { name: "golden price of ching majorly decreased", price: 15000000, type: itemType.price, img: "ching.jpg", modifier: 0.8, whichUpgrade: "Chinese Kid" },
  { name: "price of hooker majorly decreased", price: 700000, type: itemType.price, img: "zona.jpg", modifier: 0.6, whichUpgrade: "Hooker" },
  { name: "golden price of hooker majorly decreased", price: 35000000, type: itemType.price, img: "zona.jpg", modifier: 0.8, whichUpgrade: "Hooker" },
  { name: "zini gps doubled", price: 1500000, type: itemType.double, img: "zini.jpg", modifier: 2, whichUpgrade: "Ben Zini" },
  { name: "golden zini gps doubled", price: 75000000, type: itemType.double, img: "zini.jpg", modifier: 2, whichUpgrade: "Ben Zini" },
  { name: "gpc increased per zini", price: 2000000, type: itemType.perClick, img: "zini.jpg", modifier: 2, whichUpgrade: "Ben Zini" },
  { name: "golden gpc increased per zini", price: 100000000, type: itemType.perClick, img: "zini.jpg", modifier: 2, whichUpgrade: "Ben Zini" },
  { name: "price of pimp majorly decreased", price: 3000000, type: itemType.price, img: "pimp.jpg", modifier: 0.6, whichUpgrade: "Pimp" },
  { name: "golden price of pimp majorly decreased", price: 150000000, type: itemType.price, img: "pimp.jpg", modifier: 0.8, whichUpgrade: "Pimp" },
  { name: "price of shop majorly decreased", price: 5000000, type: itemType.price, img: "shop.jpg", modifier: 0.6, whichUpgrade: "Sex Toy Store" },
  { name: "golden price of shop majorly decreased", price: 250000000, type: itemType.price, img: "shop.jpg", modifier: 0.8, whichUpgrade: "Sex Toy Store" },
  { name: "yannai gps doubled", price: 18000000, type: itemType.double, img: "yannai.jpg", modifier: 2, whichUpgrade: "Yannai" },
  { name: "golden yannai gps doubled", price: 900000000, type: itemType.double, img: "yannai.jpg", modifier: 2, whichUpgrade: "Yannai" },
  { name: "gpc increased per yannai", price: 19000000, type: itemType.perClick, img: "yannai.jpg", modifier: 2, whichUpgrade: "Yannai" },
  { name: "golden gpc increased per yannai", price: 950000000, type: itemType.perClick, img: "yannai.jpg", modifier: 2, whichUpgrade: "Yannai" },
  { name: "price of zini majorly decreased", price: 20000000, type: itemType.price, img: "zini.jpg", modifier: 0.6, whichUpgrade: "Ben Zini" },
  { name: "golden price of zini majorly decreased", price: 1000000000, type: itemType.price, img: "zini.jpg", modifier: 0.8, whichUpgrade: "Ben Zini" },
  { name: "yair gps doubled", price: 50000000, type: itemType.double, img: "yair.jpg", modifier: 2, whichUpgrade: "Yair" },
  { name: "golden yair gps doubled", price: 2500000000, type: itemType.double, img: "yair.jpg", modifier: 2, whichUpgrade: "Yair" },
  { name: "price of yannai majorly decreased", price: 100000000, type: itemType.price, img: "yannai.jpg", modifier: 0.6, whichUpgrade: "Yannai" },
  { name: "golden price of yannai majorly decreased", price: 5000000000, type: itemType.price, img: "yannai.jpg", modifier: 0.8, whichUpgrade: "Yannai" },
  { name: "price of yair majorly decreased", price: 200000000, type: itemType.price, img: "yair.jpg", modifier: 0.6, whichUpgrade: "Yair" },
  { name: "golden price of yair majorly decreased", price: 10000000000, type: itemType.price, img: "yair.jpg", modifier: 0.8, whichUpgrade: "Yair" }
].sort((a, b) => a.price - b.price);
// On game load, populate items with defaultItems
if (localStorage.getItem("global info")) {
  global_info = {
    stats: JSON.parse(localStorage.getItem("global info")).stats || defaultStats,
    upgrades: JSON.parse(localStorage.getItem("global info")).upgrades || defaultUpgrades,
    boughtItems: JSON.parse(localStorage.getItem("global info")).boughtItems || [],
  };

  // Restore items from defaultItems, excluding already bought items
  defaultItems.forEach((itemData) => {
    if (!global_info.boughtItems.some((boughtItem) => boughtItem.name === itemData.name)) {
      items.push(new item(itemData.name, itemData.price, itemData.type, itemData.img, itemData.modifier, itemData.whichUpgrade));
    }
  });
} else {
  global_info = {
    stats: defaultStats,
    upgrades: defaultUpgrades,
    boughtItems: [],
  };

  // Initialize items with defaultItems
  defaultItems.forEach((itemData) => {
    items.push(new item(itemData.name, itemData.price, itemData.type, itemData.img, itemData.modifier, itemData.whichUpgrade));
  });
}
const boughtItems = global_info.boughtItems; // Stores items that have been purchased

const stats = global_info.stats;
const upgrades = global_info.upgrades;
console.log(global_info);
let global_gpm = getGlobalGPM();
updateUpgradeButtons();
updateItemButtons();
eggplant.html.addEventListener('mouseenter', () =>{eggplant.hard();});
eggplant.html.addEventListener('mouseleave', () =>{eggplant.normal();});

function updateGlobalInfo(){
  global_info = {stats: stats, upgrades: upgrades, boughtItems: boughtItems}
};
function sendToLocalStorage(){
  localStorage.setItem("global info", JSON.stringify(global_info))
};
function changeImage(image) {
  eggplant.html.src = image;
};
function getGlobalGPM(){
  temp_gpm=0
  upgrades.forEach((upgrade)=>{
      temp_gpm += upgrade.gpm * upgrade.amount
  })
  return temp_gpm
};

function addEjaculations(num){
  stats.Ejaculations = Math.round((stats.Ejaculations + num)*10) / 10
}

function updateItemButtons() {
  let html = '';
  items.forEach((item, index) => {
    // Skip items that have already been bought
    if (boughtItems.some((boughtItem) => boughtItem.name === item.name)) {
      return;
    }

    html += `
      <button class="item" id="${item.name}">
        <img src="${item.img}" alt="${item.name}" class='buttonimg' draggable='false'/>
        <span class="item-title">${item.name}</span>
        <span class="item-cost">Cost: ${item.price} </span>
      </button>`;
  });

  itemContainer.innerHTML = html; // Update the item container with the new HTML

  document.querySelectorAll('.item').forEach((button, index) => {
    button.addEventListener('click', () => {
      if (stats.Ejaculations >= items[index].price) {
        stats.Ejaculations -= items[index].price;

        // Apply the item's effect
        items[index].applyItemEffect();

        // Move the item to the boughtItems array
        boughtItems.push(items[index]);
        items.splice(index, 1); // Remove the item from the items array

        updateGlobalInfo();
        isEnough();
        sendToLocalStorage();
        updateItemButtons(); // Re-render the item buttons
      }
      updateCount();
    });
  });
}
function updateUpgradeButtons() {
  let html = '';
  upgrades.forEach((upgrade, index) => {
    html += `
      <button class="upgrade" id="${upgrade.name}" >
        <img src="${upgrade.img}" alt="${upgrade.name}" class='buttonimg' draggable='false'/>
        <span class="upgrade-title">${upgrade.name}</span>
        <span class="upgrade-cost">Cost: ${upgrade.price} </span>
        <span class="upgrade-GPM">EPS: ${upgrade.gpm} </span>
        <p class="upgrade-count">${upgrade.amount}</p>
      </button>`;
  });
  upgradeContainer.innerHTML = html; // Update the upgrade container with the new HTML

  document.querySelectorAll('.upgrade').forEach((button, index) => {
    button.addEventListener('click', () => {
      if (stats.Ejaculations >= upgrades[index].price) {
        stats.Ejaculations -= upgrades[index].price;
        upgrades[index].amount++;
        upgrades[index].price = Math.floor(upgrades[index].price * 1.1);

        // Check the boughtItems array for gpc items and apply their effects
        boughtItems.forEach((item) => {
          if (item.type === itemType.perClick && item.whichUpgrade === upgrades[index].name) {
            stats.goons_per_click += item.modifier; // Add the modifier for each new upgrade
          }
        });

        updateGlobalInfo();
        isEnough();
        sendToLocalStorage();
      }
      global_gpm = getGlobalGPM();
      updateUpgradeButtons();
    });
  });
  updateCount();
}

setInterval(()=>{
  addEjaculations(global_gpm/10)
  updateCount()
},100);

function updateCount() {
  countDisplay.innerText = `${Math.round(stats.Ejaculations*10)/10} `;
  gps.innerText = `Ejaculations Per Second ${(Math.round(global_gpm*100)/100)}` 
  sendToLocalStorage()


};
function isEnough(){
  upgrades.forEach((upgrade, index) => {
    const button = document.getElementById(upgrade.name);
    if (stats.Ejaculations >= upgrade.price) {
      button.classList.remove('disabled');
    } else {
      button.classList.add('disabled');
    }
  });
}

function resetGame() {
  if (confirm("Are you sure you want to reset the game? This will erase all your progress.")) {
    Object.assign(stats, defaultStats);
    upgrades.length = 0;
    defaultUpgrades.forEach((upgrade) => {
      upgrades.push({ ...upgrade });
    });

    // Reset items
    items.length = 0;
    defaultItems.forEach((itemData) => {
      items.push(new item(itemData.name, itemData.price, itemData.type, itemData.img, itemData.modifier, itemData.whichUpgrade));
    });

    stats.Ejaculations = 0;
    stats.goons_per_click = 1;

    // Clear bought items
    boughtItems.length = 0;
    global_gpm = getGlobalGPM();
    updateGlobalInfo();
    updateUpgradeButtons();
    updateItemButtons();
    updateCount();
    sendToLocalStorage();
  }
}
const resetbutton = document.querySelector('.header-button');
resetbutton.addEventListener('click', resetGame);


// Function to handle clicks
function addEjaculations(num){
  stats.Ejaculations = Math.round((stats.Ejaculations + num)*100) / 100
};

function click_eggplant() {
  addEjaculations(stats.goons_per_click)
  updateCount();
  eggplant.cumming();
};
eggplant.html.addEventListener("click", () => {
  
  updateCount();
  click_eggplant();
}
);
// Initialize the count display
updateCount();

// Start generating points from upgrades every second
