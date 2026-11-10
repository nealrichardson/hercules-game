const container = document.getElementById('game-container');
const playfield = document.getElementById('playfield');
const bg = document.getElementById('space-bg');
let gameState = {
running: false,
level: 1,
score: { hercules: 0, momo: 0, peach: 0, taro: 0 },
squadHealth: { momo: 100, peach: 100, taro: 100 },
playerShield: 100,
currentWeapon: 'laser', // or 'sword'
lastShotTime: 0,
bossActive: false,
mouseX: window.innerWidth/2,
mouseY: window.innerHeight/2
};
// Generate Space Environment
for (let i = 0; i < 60; i++) {
let star = document.createElement('div');
star.className = 'star';
star.style.left = Math.random() * 100 + '%';
star.style.top = Math.random() * 100 + '%';
star.style.width = star.style.height = (Math.random() * 2 + 1) + 'px';
bg.appendChild(star);
}
// Update Mouse Tracking
container.addEventListener('mousemove', (e) => {
const rect = container.getBoundingClientRect();
gameState.mouseX = e.clientX - rect.left;
gameState.mouseY = e.clientY - rect.top;
document.getElementById('crosshair').style.left = gameState.mouseX + 'px';
document.getElementById('crosshair').style.top = gameState.mouseY + 'px';
});
// Weapon Swapping Matrix & Attack Mapping
window.addEventListener('keydown', (e) => {
if (!gameState.running) return;
if (e.key === 'Shift') {
e.preventDefault();
gameState.currentWeapon = gameState.currentWeapon === 'laser' ? 'sword' : 'laser';
const hudWep = document.getElementById('hud-weapon');
hudWep.textContent = gameState.currentWeapon === 'laser' ? 'ENERGY LASER' : 'ENERGY SWORD';
hudWep.style.color = gameState.currentWeapon === 'laser' ? '#0ffff0' : '#ffaa00';
}
if (e.key === ' ' || e.code === 'Space') {
e.preventDefault();
executeWeaponAttack();
}
});
function executeWeaponAttack() {
const now = Date.now();
if (gameState.currentWeapon === 'laser') {
if (now - gameState.lastShotTime >= 200) { // Locked to 5 shots per second max
gameState.lastShotTime = now;
fireLaserInstance();
}
} else {
fireSwordInstance();
}
}
function fireLaserInstance() {
let l = document.createElement('div');
l.className = 'laser';
l.style.left = '50%';
l.style.bottom = '40px';
l.style.width = '4px';
l.style.height = '20px';
playfield.appendChild(l);
let targetX = gameState.mouseX;
let targetY = gameState.mouseY;
let startX = container.offsetWidth / 2;
let startY = container.offsetHeight - 40;
let pct = 0;
let anim = setInterval(() => {
pct += 0.08;
let curX = startX + (targetX - startX) * pct;
let curY = startY + (targetY - startY) * pct;
l.style.left = curX + 'px';
l.style.top = curY + 'px';
if (pct >= 1) {
clearInterval(anim);
l.remove();
checkImpact(targetX, targetY, 25);
}
}, 16);
}
function fireSwordInstance() {
const fx = document.getElementById('sword-fx');
fx.style.display = 'block';
setTimeout(() => fx.style.display = 'none', 150);
checkImpact(gameState.mouseX, gameState.mouseY, 70);
}
function checkImpact(x, y, radius) {
const targets = document.querySelectorAll('.game-object');
targets.forEach(t => {
if (t.classList.contains('destroyed')) return;
let tx = parseFloat(t.style.left);
let ty = parseFloat(t.style.top);
let dist = Math.hypot(x - tx, y - ty);
if (dist < radius) {
if (t.classList.contains('boss-weakpoint')) {
t.classList.add('destroyed');
t.style.background = '#222';
checkBossCondition();
} else {
t.remove();
gameState.score.hercules++;
document.getElementById('score-hercules').textContent = gameState.score.hercules;
}
}
});
}
function spawnEnemyUnit() {
if (!gameState.running || gameState.bossActive) return;
let type = (gameState.level === 1 && Math.random() * 10 > 6) ? 'asteroid' : 'gundam-enemy';
let obj = document.createElement('div');
obj.className = game-object ${type};
if (type === 'gundam-enemy') {
document.getElementById('alert-banner').style.visibility = 'visible';
setTimeout(() => { document.getElementById('alert-banner').style.visibility = 'hidden'; }, 800);
}
obj.style.left = Math.random() * (container.offsetWidth - 100) + 50 + 'px';
obj.style.top = '0px';
obj.style.width = '20px';
obj.style.height = '20px';
playfield.appendChild(obj);
let size = 20;
let speed = Math.random() * 2 + 1;
let movement = setInterval(() => {
if (!gameState.running) { clearInterval(movement); return; }
let currTop = parseFloat(obj.style.top) || 0;
size += 0.4;
obj.style.width = size + 'px';
obj.style.height = size + 'px';
obj.style.top = (currTop + speed) + 'px';
// Random squadmate shooting sim
if (type === 'gundam-enemy' && Math.random() * 1000 > 994) {
let pilots = ['momo', 'peach', 'taro'];
let shooter = pilots[Math.floor(Math.random() * pilots.length)];
gameState.score[shooter]++;
document.getElementById(score-${shooter}).textContent = gameState.score[shooter];
obj.remove();
clearInterval(movement);
}
if (currTop > container.offsetHeight - 100) {
clearInterval(movement);
if (obj.parentNode) {
obj.remove();
if (type === 'gundam-enemy') damagePlayer(15);
}
}
}, 30);
}
function damagePlayer(amt) {
gameState.playerShield = Math.max(0, gameState.playerShield - amt);
document.getElementById('player-shield').style.width = gameState.playerShield + '%';
// Ally Auto Shield-Recharge Drop Mechanic
if (gameState.playerShield < 30 && gameState.playerShield > 0) {
setTimeout(() => {
gameState.playerShield = Math.min(100, gameState.playerShield + 40);
document.getElementById('player-shield').style.width = gameState.playerShield + '%';
}, 1000);
}
}
function initializeLevelTwo() {
gameState.level = 2;
document.getElementById('hud-level').textContent = 'STAGE 2: ORBIT OF GREATDANIEA';
document.getElementById('planet-target').style.display = 'block';
// Background squad positioning display
['momo', 'peach', 'taro'].forEach((name, idx) => {
let wing = document.createElement('div');
wing.className = game-object squad-wingman ${name};
wing.style.left = (20 + idx * 30) + '%';
wing.style.top = '75%';
wing.style.width = '45px';
wing.style.height = '35px';
playfield.appendChild(wing);
});
setTimeout(() => {
triggerBossEncounter();
}, 8000);
}
function triggerBossEncounter() {
gameState.bossActive = true;
let b = document.createElement('div');
b.className = 'game-object boss-ship';
b.style.left = '50%';
b.style.top = '25%';
b.style.width = '350px';
b.style.height = '90px';
// Build 3 breakable target points
for(let i=0; i<3; i++) {
let wp = document.createElement('div');
wp.className = 'game-object boss-weakpoint';
wp.style.left = (50 + (i - 1) * 90) + 'px';
wp.style.top = '45px';
b.appendChild(wp);
}
playfield.appendChild(b);
}
function checkBossCondition() {
const remaining = document.querySelectorAll('.boss-weakpoint:not(.destroyed)');
if (remaining.length === 0) {
gameState.running = false;
document.getElementById('victory-screen').style.display = 'flex';
}
}
function loopSquadHealth() {
if (!gameState.running) return;
['momo', 'peach', 'taro'].forEach(s => {
gameState.squadHealth[s] = Math.max(20, gameState.squadHealth[s] - (Math.random() * 4));
if (gameState.squadHealth[s] < 40) gameState.squadHealth[s] = 95; // Squad self-repairs to remain operational
document.getElementById(hp-${s}).style.width = gameState.squadHealth[s] + '%';
});
setTimeout(loopSquadHealth, 2000);
}
function startGame() {
document.getElementById('start-screen').style.display = 'none';
gameState.running = true;
// Main loop timers
let spawnTimer = setInterval(spawnEnemyUnit, 900);
loopSquadHealth();
// Standard Progression Timeline
setTimeout(() => {
if (gameState.level === 1) {
clearInterval(spawnTimer);
initializeLevelTwo();
spawnTimer = setInterval(spawnEnemyUnit, 700);
}
}, 15000);
}
