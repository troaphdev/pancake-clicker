// ------------------------
// Background Blobs (same as original)
// ------------------------
const blobsContainer = document.querySelector('.blobs-container');
for (let i = 0; i < 4; i++) {
  const blob = document.createElement('div');
  blob.className = 'blob';
  const size = Math.floor(Math.random() * 300) + 200;
  blob.style.width = size + 'px';
  blob.style.height = size + 'px';
  blob.style.left = i < 2 ? Math.random() * 50 + '%' : (50 + Math.random() * 50) + '%';
  blob.style.top = Math.random() * 100 + '%';
  blob.style.background = `rgba(${Math.floor(Math.random()*255)}, ${Math.floor(Math.random()*255)}, ${Math.floor(Math.random()*255)}, 0.6)`;
  blobsContainer.appendChild(blob);
  setInterval(() => {
    blob.style.left = i < 2 ? Math.random() * 50 + '%' : (50 + Math.random() * 50) + '%';
    blob.style.top = Math.random() * 100 + '%';
  }, 4000);
}

// ------------------------
// Global Variables & State
// ------------------------
let pancakes = 0;
let clickValue = 1;
let goldenClickActive = false;
let instantMultiplierClicks = 0;
let cosmicBoostActive = false;
let passivePPS = 0;  // Passive pancakes per second

// New globals for extra effects and tracking
let clickTimestamps = []; // For active click rate calculation
let pinwheelCount = 0;    // Count of active pinwheel generators
let ultraClickBonus = 0;  // Bonus for "Ultra Click" upgrade
let rainbowClickActive = false; // For "Rainbow Click" upgrade
let criticalHitActive = false;  // For "Critical Hit" upgrade

// Expanded emoji pool
const allEmojis = ["😀","😃","😄","😁","😆","😅","😂","🤣","😊","😇","🙂","🙃","😉","😌","😍","🥰","😘",
"😗","😙","😚","🤗","🤩","🥳","😎","🤓","🧐","🤠","😏","😒","😞","😔","😟","😕","🙁","☹️",
"😣","😖","😫","😩","🥺","😢","😭","😤","😠","😡","🤬","🤯","😳","🥵","🥶","😱","😨","😰",
"😥","😓","🤔","🤭","🤫","🤥","😶","😐","😑","😬","🙄","😯","😦","😧","😮","😲","🥱","😴",
"🤤","😪","😵","🤐","🥴","🤢","🤮","🤧","😷","🤒","🤕","🤑","👻","👽","👾","🤖","🎃","🌟","✨",
"⚡","🔥","💥","🎆","🎇","🌈","☀️","🌤️","⛅","☁️","🌧️","⛈️","🌩️","❄️","💨","🌪️","🌊",
"🍎","🍌","🍒","🍇","🍉","🍓","🍑","🍍","🥝","📈","🌀","➕"];

// ------------------------
// DOM Elements
// ------------------------
const pancakesDisplay = document.getElementById('pancakes');
const clickerBtn = document.getElementById('clicker-btn');
const instantUpgradesContainer = document.getElementById('instant-upgrades-container');
const permanentUpgradesContainer = document.getElementById('permanent-upgrades-container');
const themeToggleContainer = document.getElementById('theme-toggle-container');
const themeToggle = document.getElementById('theme-toggle');
const productionIndicators = document.getElementById('production-indicators');
const ppsDisplay = document.getElementById('pps-display');
const activeEffectsContainer = document.getElementById('active-effects');

// ------------------------
// Sidebar Expand/Collapse
// ------------------------
const sidebar = document.querySelector('.sidebar');
const expandSidebarBtn = document.querySelector('.expand-sidebar-btn');
expandSidebarBtn.addEventListener('click', () => {
  sidebar.classList.toggle('expanded');
});

// ------------------------
// Theme Toggle Event
// ------------------------
themeToggle.addEventListener('change', () => {
  if (themeToggle.checked) {
    document.body.classList.add('light-theme');
  } else {
    document.body.classList.remove('light-theme');
  }
});

// ------------------------
// Utility functions for click tracking
// ------------------------
function recordClick() {
  const now = Date.now();
  clickTimestamps.push(now);
  // Keep only clicks from the last 5 seconds
  clickTimestamps = clickTimestamps.filter(ts => now - ts <= 5000);
}

function calculateActiveClickRate() {
  const now = Date.now();
  clickTimestamps = clickTimestamps.filter(ts => now - ts <= 5000);
  return clickTimestamps.length / 5;
}

// ------------------------
// Calculate overall PPS (from all sources)
// ------------------------
function calculateOverallPPS() {
  const activeClickRate = calculateActiveClickRate();
  const bouncyEmojiCount = (permanentUpgradesData.find(u => u.id === "perm-bouncy-emoji")?.count) || 0;
  const activeClickIncome = activeClickRate * clickValue;
  return passivePPS + (pinwheelCount * 0.5) + (bouncyEmojiCount * 1) + activeClickIncome;
}

function updatePPSDisplay() {
  const overallPPS = calculateOverallPPS();
  ppsDisplay.textContent = `PPS: ${passivePPS}/s | Total: ${overallPPS.toFixed(2)}/s`;
}

// ------------------------
// Passive Pancakes per Second & Updater Interval
// ------------------------
setInterval(() => {
  pancakes += passivePPS;
  updatePancakesDisplay();
  updatePPSDisplay();
  checkForNewUpgrades();
}, 1000);

// ------------------------
// Update Pancakes Display & Floating Gain
// ------------------------
function updatePancakesDisplay() {
  pancakesDisplay.textContent = pancakes;
}

function showFloatingGain(gain) {
  const gainElem = document.createElement('div');
  gainElem.className = 'floating-gain';
  gainElem.textContent = `+${gain}`;
  
  const btnRect = clickerBtn.getBoundingClientRect();
  const containerRect = clickerBtn.parentElement.getBoundingClientRect();
  const btnLeft = btnRect.left - containerRect.left;
  const btnTop = btnRect.top - containerRect.top;
  const btnWidth = btnRect.width;
  const btnHeight = btnRect.height;
  
  const options = ["left", "right", "below"];
  const choice = options[Math.floor(Math.random() * options.length)];
  let offsetX, offsetY;
  if (choice === "left") {
    offsetX = btnLeft - (Math.random() * 30 + 10);
    offsetY = btnTop + Math.random() * btnHeight;
  } else if (choice === "right") {
    offsetX = btnLeft + btnWidth + (Math.random() * 30 + 10);
    offsetY = btnTop + Math.random() * btnHeight;
  } else {
    offsetX = btnLeft + Math.random() * btnWidth;
    offsetY = btnTop + btnHeight + (Math.random() * 30 + 10);
  }
  
  gainElem.style.position = 'absolute';
  gainElem.style.left = offsetX + 'px';
  gainElem.style.top = offsetY + 'px';
  
  clickerBtn.parentElement.appendChild(gainElem);
  setTimeout(() => { gainElem.remove(); }, 1000);
}

// ------------------------
// Active Effects: spawn a persistent icon
// ------------------------
function spawnActiveEffect(icon) {
  const effectElem = document.createElement('div');
  effectElem.className = 'active-effect';
  effectElem.textContent = icon;
  activeEffectsContainer.appendChild(effectElem);
  // Effects persist; add removal logic if desired
}

// ------------------------
// Golden Click Animation (modified to last 5 seconds)
// ------------------------
function goldenClickAnimation() {
  clickerBtn.classList.add('golden');
  // Keep golden effect for up to 5000ms if not used
  setTimeout(() => {
    if (goldenClickActive) {
      clickerBtn.classList.remove('golden');
      goldenClickActive = false;
    }
  }, 5000);
}

// ------------------------
// New Upgrade: Pinwheel
// ------------------------
function spawnPinwheel() {
  const pinwheel = document.createElement('div');
  pinwheel.className = 'pinwheel';
  pinwheel.textContent = "🌀";
  pinwheel.style.position = 'fixed';
  pinwheel.style.left = Math.random() * (window.innerWidth - 50) + 'px';
  pinwheel.style.top = Math.random() * (window.innerHeight - 50) + 'px';
  pinwheel.style.fontSize = '3rem';
  document.body.appendChild(pinwheel);
  
  pinwheelCount++;
  setInterval(() => {
    pancakes++;
    updatePancakesDisplay();
  }, 2000);
  
  pinwheel.style.animation = "spin 4s linear infinite";
  spawnActiveEffect("🌀");
}

// ------------------------
// Upgrade Data Structures
// ------------------------

// Instant Upgrades (original + new upgrades)
const instantUpgradesQueue = [
  { id: "inst-toggle-theme", emoji: "🎨", cost: 20, unlockAt: 20, title: "Toggle Theme", description: "Unlock dark/light switch", effect: () => { themeToggleContainer.style.display = "block"; spawnActiveEffect("🎨"); } },
  { id: "inst-play-music", emoji: "🎵", cost: 30, unlockAt: 30, title: "Play Music", description: "Start background music", effect: () => { const bgMusic = document.getElementById('background-music'); bgMusic.style.display = "block"; bgMusic.play(); spawnActiveEffect("🎵"); } },
  { id: "inst-pinwheel", emoji: "🌀", cost: 50, unlockAt: 50, title: "Pinwheel Generator", description: "Spawns a pinwheel", effect: () => { spawnPinwheel(); } },
  { id: "inst-pancake-bonus", emoji: "🍴", cost: 15, unlockAt: 15, title: "Pancake Bonus", description: "Gain 10 pancakes", effect: () => { pancakes += 10; updatePancakesDisplay(); spawnActiveEffect("🍴"); } },
  { id: "inst-golden-click", emoji: "🏅", cost: 25, unlockAt: 30, title: "Golden Click", description: "Next click +10", effect: () => { goldenClickAnimation(); goldenClickActive = true; spawnActiveEffect("🏅"); } },
  { id: "inst-lucky-draw", emoji: "🍀", cost: 30, unlockAt: 40, title: "Lucky Draw", description: "Random bonus", effect: () => { const bonus = Math.floor(Math.random()*16)+5; pancakes += bonus; updatePancakesDisplay(); spawnActiveEffect("🍀"); } },
  { id: "inst-instant-multiplier", emoji: "✖️", cost: 50, unlockAt: 70, title: "Instant Multiplier", description: "Double next 10 clicks", effect: () => { instantMultiplierClicks = 10; spawnActiveEffect("✖️"); } },
  { id: "inst-speed-boost", emoji: "⚡", cost: 35, unlockAt: 80, title: "Speed Boost", description: "Boost click speed", effect: () => { spawnActiveEffect("⚡"); } },
  { id: "inst-mystery-box", emoji: "❓", cost: 30, unlockAt: 100, title: "Mystery Box", description: "Open for reward", effect: () => { spawnMysteryBox(); } },
  { id: "inst-fireworks-bonus", emoji: "🎆", cost: 55, unlockAt: 120, title: "Fireworks Bonus", description: "Gain 25 pancakes", effect: () => { pancakes += 25; updatePancakesDisplay(); spawnActiveEffect("🎆"); } },
  { id: "inst-emoji-rain", emoji: "🌧️", cost: 40, unlockAt: 130, title: "Emoji Rain", description: "Spawn falling emojis", effect: () => { for(let i=0;i<5;i++){ spawnFallingEmoji(); } } },
  { id: "inst-pancake-multiplier", emoji: "🔺", cost: 70, unlockAt: 150, title: "Pancake Multiplier", description: "Increase click value", effect: () => { clickValue++; spawnActiveEffect("🔺"); } },
  { id: "inst-adrenaline-rush", emoji: "💥", cost: 80, unlockAt: 180, title: "Adrenaline Rush", description: "Triple next 15 clicks", effect: () => { goldenClickAnimation(); goldenClickActive = true; instantMultiplierClicks = 15; spawnActiveEffect("💥"); } },
  { id: "inst-mega-bonus", emoji: "💰", cost: 100, unlockAt: 220, title: "Mega Bonus", description: "Gain 100 pancakes", effect: () => { pancakes += 100; updatePancakesDisplay(); spawnActiveEffect("💰"); } },
  { id: "inst-time-warp", emoji: "⏳", cost: 65, unlockAt: 250, title: "Time Warp", description: "Boost auto-clickers", effect: () => { cosmicBoostActive = true; setTimeout(()=>{ cosmicBoostActive = false; },10000); spawnActiveEffect("⏳"); } },
  { id: "inst-fortune-cookie", emoji: "🥠", cost: 50, unlockAt: 300, title: "Fortune Cookie", description: "Random bonus", effect: () => { const bonus = Math.floor(Math.random()*31)+20; pancakes += bonus; updatePancakesDisplay(); spawnActiveEffect("🥠"); } },
  { id: "inst-cosmic-boost", emoji: "🌌", cost: 90, unlockAt: 350, title: "Cosmic Boost", description: "50% more gains", effect: () => { cosmicBoostActive = true; setTimeout(()=>{ cosmicBoostActive = false; },20000); spawnActiveEffect("🌌"); } },
  { id: "inst-mystery-upgrade", emoji: "🌀", cost: 60, unlockAt: 450, title: "Mystery Upgrade", description: "Spawn bonus element", effect: () => { spawnBonusElement(); spawnActiveEffect("🌀"); } },
  { id: "inst-pps-booster", emoji: "📈", cost: 85, unlockAt: 500, title: "PPS Booster", description: "Increase PPS by 2", effect: () => { passivePPS += 2; spawnProductionIndicator("📈"); updatePPSDisplay(); spawnActiveEffect("📈"); } },
  // --- New 20 Upgrades ---
  { id: "inst-double-pinwheel", emoji: "🌪️", cost: 110, unlockAt: 520, title: "Double Pinwheel", description: "Spawn 2 pinwheels", effect: () => { spawnPinwheel(); spawnPinwheel(); } },
  { id: "inst-ultra-click", emoji: "⚡", cost: 130, unlockAt: 550, title: "Ultra Click", description: "Next click +20", effect: () => { ultraClickBonus = 20; goldenClickAnimation(); spawnActiveEffect("⚡"); } },
  { id: "inst-super-click", emoji: "🔥", cost: 150, unlockAt: 600, title: "Super Click", description: "Triple next click", effect: () => { goldenClickAnimation(); instantMultiplierClicks = 1; spawnActiveEffect("🔥"); } },
  { id: "inst-extra-bonus", emoji: "🎁", cost: 160, unlockAt: 630, title: "Extra Bonus", description: "Gain 50-100 pancakes", effect: () => { const bonus = Math.floor(Math.random()*51)+50; pancakes += bonus; updatePancakesDisplay(); spawnActiveEffect("🎁"); } },
  { id: "inst-time-slow", emoji: "🐢", cost: 170, unlockAt: 670, title: "Time Slow", description: "Double passive gains for 10 sec", effect: () => { const original = passivePPS; passivePPS *= 2; spawnActiveEffect("🐢"); setTimeout(() => { passivePPS = original; updatePPSDisplay(); }, 10000); } },
  { id: "inst-bouncy-bonus", emoji: "🤸", cost: 180, unlockAt: 700, title: "Bouncy Bonus", description: "Gain pancakes equal to bouncy emoji count", effect: () => { const count = (permanentUpgradesData.find(u => u.id === "perm-bouncy-emoji")?.count) || 0; pancakes += count; updatePancakesDisplay(); spawnActiveEffect("🤸"); } },
  { id: "inst-auto-collector", emoji: "📡", cost: 200, unlockAt: 730, title: "Auto Collector", description: "Gain 5 pancakes every 3 sec for 30 sec", effect: () => { let times = 0; const interval = setInterval(() => { pancakes += 5; updatePancakesDisplay(); times++; if(times>=10){ clearInterval(interval); } }, 3000); spawnActiveEffect("📡"); } },
  { id: "inst-riches", emoji: "💎", cost: 220, unlockAt: 760, title: "Riches", description: "Gain 200 pancakes instantly", effect: () => { pancakes += 200; updatePancakesDisplay(); spawnActiveEffect("💎"); } },
  { id: "inst-frenzy-click", emoji: "🤩", cost: 250, unlockAt: 800, title: "Frenzy Click", description: "Double click value for 10 sec", effect: () => { const original = clickValue; clickValue *= 2; spawnActiveEffect("🤩"); setTimeout(() => { clickValue = original; updatePancakesDisplay(); }, 10000); } },
  { id: "inst-psychedelic", emoji: "🌈", cost: 270, unlockAt: 850, title: "Psychedelic", description: "Randomize background for 15 sec", effect: () => { const originalBg = document.body.style.background; const interval = setInterval(() => { document.body.style.background = '#' + Math.floor(Math.random()*16777215).toString(16); }, 1000); spawnActiveEffect("🌈"); setTimeout(() => { clearInterval(interval); document.body.style.background = originalBg; }, 15000); } },
  { id: "inst-lucky-number", emoji: "🔢", cost: 300, unlockAt: 880, title: "Lucky Number", description: "If pancake count is even, double it", effect: () => { if(pancakes % 2 === 0){ pancakes *= 2; } else { pancakes += 50; } updatePancakesDisplay(); spawnActiveEffect("🔢"); } },
  { id: "inst-magnetic", emoji: "🧲", cost: 320, unlockAt: 920, title: "Magnetic", description: "Gain 10 pancakes every 2 sec for 20 sec", effect: () => { let times = 0; const interval = setInterval(() => { pancakes += 10; updatePancakesDisplay(); times++; if(times>=10){ clearInterval(interval); } }, 2000); spawnActiveEffect("🧲"); } },
  { id: "inst-solar-flare", emoji: "☀️", cost: 350, unlockAt: 960, title: "Solar Flare", description: "Boost click value by 50% for 15 sec", effect: () => { const original = clickValue; clickValue = Math.floor(clickValue * 1.5); spawnActiveEffect("☀️"); setTimeout(() => { clickValue = original; updatePancakesDisplay(); }, 15000); } },
  { id: "inst-moonlight", emoji: "🌙", cost: 380, unlockAt: 1000, title: "Moonlight", description: "Increase passive PPS by 5 for 30 sec", effect: () => { const original = passivePPS; passivePPS += 5; spawnActiveEffect("🌙"); setTimeout(() => { passivePPS = original; updatePPSDisplay(); }, 30000); } },
  { id: "inst-night-owl", emoji: "🦉", cost: 400, unlockAt: 1050, title: "Night Owl", description: "Every 5 sec, gain bonus based on recent clicks for 30 sec", effect: () => { let times = 0; const interval = setInterval(() => { pancakes += Math.floor(calculateActiveClickRate()*10); updatePancakesDisplay(); times++; if(times>=6){ clearInterval(interval); } }, 5000); spawnActiveEffect("🦉"); } },
  { id: "inst-rainbow-click", emoji: "🌈", cost: 420, unlockAt: 1100, title: "Rainbow Click", description: "Clicks yield random 1-3× multiplier for 20 sec", effect: () => { rainbowClickActive = true; spawnActiveEffect("🌈"); setTimeout(() => { rainbowClickActive = false; }, 20000); } },
  { id: "inst-critical-hit", emoji: "💥", cost: 450, unlockAt: 1150, title: "Critical Hit", description: "Next click has 25% chance for 5× bonus", effect: () => { criticalHitActive = true; spawnActiveEffect("💥"); } },
  { id: "inst-chaos", emoji: "🎲", cost: 480, unlockAt: 1200, title: "Chaos", description: "Shuffle upgrade costs by ±20%", effect: () => { 
      instantUpgradesQueue.forEach(u => { u.cost = Math.ceil(u.cost * (0.8 + Math.random() * 0.4)); });
      permanentUpgradesData.forEach(u => { u.cost = Math.ceil(u.cost * (0.8 + Math.random() * 0.4)); });
      spawnActiveEffect("🎲"); 
    } 
  },
  { id: "inst-refund", emoji: "💸", cost: 500, unlockAt: 1250, title: "Refund", description: "Refund 50 pancakes", effect: () => { pancakes += 50; updatePancakesDisplay(); spawnActiveEffect("💸"); } },
  { id: "inst-grand-finale", emoji: "🎇", cost: 550, unlockAt: 1300, title: "Grand Finale", description: "Gain 500 pancakes + fireworks", effect: () => { pancakes += 500; updatePancakesDisplay(); for(let i=0;i<5;i++){ spawnProductionIndicator("🎇"); } spawnActiveEffect("🎇"); } }
];

// Permanent Upgrades (existing)
const permanentUpgradesData = [
  { id: "perm-bouncy-emoji", emoji: "🤹", baseCost: 25, cost: 25, unlockAt: 100, title: "Bouncy Emoji", description: "Each bounce +1 pancake", count: 0, multiplier: 1.5, effect: () => { spawnBouncyEmoji(); } },
  { id: "perm-auto-clicker", emoji: "🤖", baseCost: 50, cost: 50, unlockAt: 150, title: "Auto Clicker", description: "Generates 1 pancake/sec", count: 0, multiplier: 1.5, effect: (card) => { passivePPS++; spawnProductionIndicator("🤖"); updatePermanentCard(card); } },
  { id: "perm-click-power", emoji: "💪", baseCost: 40, cost: 40, unlockAt: 200, title: "Click Power", description: "Increase click value", count: 0, multiplier: 1.5, effect: (card) => { clickValue++; spawnProductionIndicator("💪"); updatePermanentCard(card); } }
];

// Maximum visible instant upgrades (set to 5)
const MAX_VISIBLE = 5;
let visibleInstantUpgrades = [];

// ------------------------
// Instant Upgrades Functions
// ------------------------
function renderInstantUpgrades() {
  instantUpgradesContainer.innerHTML = "";
  visibleInstantUpgrades.forEach(card => {
    instantUpgradesContainer.appendChild(card);
  });
}

function addNextInstantUpgrade() {
  if (visibleInstantUpgrades.length < MAX_VISIBLE && instantUpgradesQueue.length > 0) {
    if (instantUpgradesQueue[0].unlockAt <= pancakes) {
      const upgData = instantUpgradesQueue.shift();
      const card = createUpgradeCard(upgData, false);
      visibleInstantUpgrades.push(card);
      renderInstantUpgrades();
      setTimeout(() => { card.classList.add('visible'); }, 100);
    }
  }
}

function removeInstantUpgrade(card) {
  card.classList.add('purchased');
  setTimeout(() => {
    visibleInstantUpgrades = visibleInstantUpgrades.filter(c => c !== card);
    renderInstantUpgrades();
    addNextInstantUpgrade();
  }, 500);
}

function checkForNewUpgrades() {
  addNextInstantUpgrade();
  renderNewPermanentUpgrades();
}

// ------------------------
// Permanent Upgrades Functions (Modified)
// ------------------------
const permanentCards = {};
function renderNewPermanentUpgrades() {
  permanentUpgradesData.forEach(upg => {
    if (pancakes >= upg.unlockAt && !permanentCards[upg.id]) {
      const card = createUpgradeCard(upg, true);
      permanentCards[upg.id] = card;
      card.addEventListener('click', () => {
        if (pancakes >= upg.cost) {
          pancakes -= upg.cost;
          updatePancakesDisplay();
          upg.count++;
          upg.effect(card);
          upg.cost = Math.ceil(upg.baseCost * Math.pow(upg.multiplier, upg.count));
          updatePermanentCard(card);
        }
      });
      permanentUpgradesContainer.appendChild(card);
      card.classList.add('visible');
    }
  });
}

function updatePermanentCard(card) {
  const upg = permanentUpgradesData.find(u => u.id === card.id);
  if (upg) {
    card.querySelector('.upgrade-cost').textContent = upg.cost + " Pancakes (x" + (upg.count+1) + ")";
  }
}

// ------------------------
// Create Upgrade Card Element
// ------------------------
function createUpgradeCard(upgrade, isPermanent) {
  const card = document.createElement('div');
  card.className = 'upgrade-card';
  card.id = upgrade.id;
  card.innerHTML = `
    <div class="upgrade-icon">${upgrade.emoji}</div>
    <div class="upgrade-info">
      <div class="upgrade-title">${upgrade.title}</div>
      <div class="upgrade-description">${upgrade.description}</div>
      <div class="upgrade-cost">${upgrade.cost} Pancakes${isPermanent ? " (x" + (upgrade.count+1) + ")" : ""}</div>
    </div>
  `;
  if (!isPermanent) {
    card.addEventListener('click', () => {
      if (pancakes >= upgrade.cost) {
        pancakes -= upgrade.cost;
        updatePancakesDisplay();
        upgrade.effect();
        removeInstantUpgrade(card);
      }
      checkForNewUpgrades();
    });
  }
  return card;
}

// ------------------------
// Main Clicker Button Event with Extra Effects
// ------------------------
clickerBtn.addEventListener('click', () => {
  recordClick();
  let gain = clickValue;
  if (goldenClickActive) {
    gain += 10;
    goldenClickActive = false;
    clickerBtn.classList.remove('golden'); // remove effect upon use
  }
  if (instantMultiplierClicks > 0) {
    gain *= 2;
    instantMultiplierClicks--;
  }
  if (ultraClickBonus > 0) {
    gain += ultraClickBonus;
    ultraClickBonus = 0;
  }
  if (rainbowClickActive) {
    gain = Math.floor(gain * (1 + Math.random() * 2));
  }
  if (cosmicBoostActive) {
    gain = Math.floor(gain * 1.5);
  }
  if (criticalHitActive) {
    if (Math.random() < 0.25) {
      gain = gain * 5;
    }
    criticalHitActive = false;
  }
  pancakes += gain;
  updatePancakesDisplay();
  showFloatingGain(gain);
  checkForNewUpgrades();
});

// ------------------------
// Production Indicator (Visual Cue)
// ------------------------
function spawnProductionIndicator(icon) {
  const indicator = document.createElement('div');
  indicator.textContent = icon;
  indicator.style.fontSize = '2rem';
  indicator.className = 'production-indicator';
  productionIndicators.appendChild(indicator);
  setTimeout(() => {
    productionIndicators.removeChild(indicator);
  }, 3000);
}

// ------------------------
// Bouncy Emoji (Permanent Upgrade Effect)
// ------------------------
function spawnBouncyEmoji() {
  const emoji = allEmojis[Math.floor(Math.random() * allEmojis.length)];
  const bounceDiv = document.createElement('div');
  bounceDiv.className = 'bouncy-emoji';
  bounceDiv.textContent = emoji;
  let posX = Math.random() * (window.innerWidth - 50);
  let posY = Math.random() * (window.innerHeight - 50);
  let velX = (Math.random() * 4) + 1;
  let velY = (Math.random() * 4) + 1;
  bounceDiv.style.left = posX + 'px';
  bounceDiv.style.top = posY + 'px';
  document.body.appendChild(bounceDiv);
  setInterval(() => {
    posX += velX;
    posY += velY;
    if (posX <= 0 || posX >= window.innerWidth - 50) {
      velX *= -1;
      pancakes++;
      updatePancakesDisplay();
    }
    if (posY <= 0 || posY >= window.innerHeight - 50) {
      velY *= -1;
      pancakes++;
      updatePancakesDisplay();
    }
    bounceDiv.style.left = posX + 'px';
    bounceDiv.style.top = posY + 'px';
  }, 20);
}

// ------------------------
// Falling Emoji for "Emoji Rain"
// ------------------------
function spawnFallingEmoji() {
  const emoji = allEmojis[Math.floor(Math.random() * allEmojis.length)];
  const fallDiv = document.createElement('div');
  fallDiv.className = 'falling-emoji';
  fallDiv.textContent = emoji;
  let posX = Math.random() * (window.innerWidth - 50);
  let posY = -50;
  fallDiv.style.left = posX + 'px';
  fallDiv.style.top = posY + 'px';
  document.body.appendChild(fallDiv);
  fallDiv.addEventListener('click', () => {
    pancakes++;
    updatePancakesDisplay();
    fallDiv.remove();
  });
  let velY = 3;
  setInterval(() => {
    posY += velY;
    if (posY > window.innerHeight - 50) {
      posY = window.innerHeight - 50;
      pancakes++;
      updatePancakesDisplay();
      velY = -velY;
    }
    fallDiv.style.top = posY + 'px';
  }, 30);
}

// ------------------------
// Mystery Box for "Mystery Box" Upgrade
// ------------------------
function spawnMysteryBox() {
  const box = document.createElement('div');
  box.className = 'mystery-box';
  box.textContent = "📦";
  box.style.position = 'fixed';
  box.style.left = Math.random() * (window.innerWidth - 50) + 'px';
  box.style.top = Math.random() * (window.innerHeight - 50) + 'px';
  box.style.fontSize = '3rem';
  box.style.cursor = 'pointer';
  document.body.appendChild(box);
  box.addEventListener('click', () => {
    const reward = Math.floor(Math.random() * 31) + 20;
    pancakes += reward;
    updatePancakesDisplay();
    box.remove();
  });
  setTimeout(() => { if (document.body.contains(box)) box.remove(); }, 5000);
}

// ------------------------
// Mystery Upgrade for "Mystery Upgrade"
// ------------------------
function spawnBonusElement() {
  const bonus = document.createElement('div');
  bonus.className = 'bonus-element';
  bonus.textContent = "⭐";
  bonus.style.position = 'fixed';
  bonus.style.left = Math.random() * (window.innerWidth - 50) + 'px';
  bonus.style.top = Math.random() * (window.innerHeight - 50) + 'px';
  bonus.style.fontSize = '3rem';
  document.body.appendChild(bonus);
  let posX = Math.random() * (window.innerWidth - 50);
  let posY = Math.random() * (window.innerHeight - 50);
  let velX = (Math.random() * 4) + 1;
  let velY = (Math.random() * 4) + 1;
  setInterval(() => {
    posX += velX;
    posY += velY;
    if (posX <= 0 || posX >= window.innerWidth - 50) {
      velX *= -1;
      pancakes++;
      updatePancakesDisplay();
    }
    if (posY <= 0 || posY >= window.innerHeight - 50) {
      velY *= -1;
      pancakes++;
      updatePancakesDisplay();
    }
    bonus.style.left = posX + 'px';
    bonus.style.top = posY + 'px';
  }, 20);
}

// ------------------------
// Initial Updates
// ------------------------
updatePancakesDisplay();
updatePPSDisplay();
checkForNewUpgrades();
renderNewPermanentUpgrades();
