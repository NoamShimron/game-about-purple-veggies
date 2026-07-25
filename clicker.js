eggplant={
  html:document.querySelector('.eggplant'),
  normal:  ()=>{changeImage('download-good.jpg')},
  hard: ()=>{changeImage('download-hovered.jpg')},
  cumming: ()=>{changeImage('download-clicked.jpg')},
}
const defaultStats={Ejaculations:0, goons_per_click:1};
const defaultUpgrades =[
  {name:"enthusiastic midget",price:15, amount:0, gpm:0.1, img:"ching.jpg"}, 
  {name:"cosplayer", price:100, amount: 0, gpm:1, img:"zona.jpg"}, 
  {name:"business man",price:1150, amount: 0, gpm:8,img:"pimp.jpg"},
  {name:"complex Toy Store", price:13000, amount: 0, gpm:90, img:"shop.jpg"}, 
  {name:"Ben Zini",price:150000, amount: 0, gpm:650,img:"zini.jpg"},
  {name:"Yannaichuk", price:1700000, amount: 0, gpm:55000, img:"yannai.jpg"}, 
  {name:"Yair boxes the united nations",price:20000000, amount: 0, gpm:4000000,img:"yair.jpg"}] ;
const gps = document.querySelector('.gps');
const upgradeContainer = document.querySelector('.upgrades');
const countDisplay = document.querySelector('.points');
if(localStorage.getItem("global info")){
  global_info = {
    stats: JSON.parse(localStorage.getItem("global info")).stats ||defaultStats, 
    upgrades:  JSON.parse(localStorage.getItem("global info")).upgrades||defaultUpgrades}}
else{
    global_info = {
    stats: defaultStats, 
    upgrades: defaultUpgrades}
  }

const stats = global_info.stats;
const upgrades = global_info.upgrades;
console.log(global_info);
let global_gpm = getGlobalGPM();
updateUpgradeButtons();

eggplant.html.addEventListener('mouseenter', () =>{eggplant.hard();});
eggplant.html.addEventListener('mouseleave', () =>{eggplant.normal();});

function updateGlobalInfo(){
  global_info = {stats: stats, upgrades: upgrades}
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


function updateUpgradeButtons(){
  html='';
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
        upgrades[index].price = Math.floor(upgrades[index].price * 1.2);
        updateGlobalInfo();
        isEnough();
        sendToLocalStorage();
    }
    global_gpm = getGlobalGPM()      
    updateUpgradeButtons();
    });
  });
updateCount();
};

setInterval(()=>{
  addEjaculations(global_gpm)
  updateCount()
},1000);

function updateCount() {
  countDisplay.innerText = `${Math.round(stats.Ejaculations)} `;
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
    upgrades.length=0;
    defaultUpgrades.forEach((upgrade) => {
      upgrades.push({...upgrade});
    });
    global_gpm = getGlobalGPM();
    updateGlobalInfo();
    updateUpgradeButtons();
    updateCount();
    sendToLocalStorage();
  }
}
const resetbutton = document.querySelector('.header-button');
resetbutton.addEventListener('click', resetGame);


// Function to handle clicks
function addEjaculations(num){
  stats.Ejaculations = Math.round((stats.Ejaculations + num)*10) / 10
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
