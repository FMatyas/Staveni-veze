const blockWidth = 300; // šířka bloku na začátku hry
const blockHeight = 30; // výška jednoho bloku
let currentBlock; // aktuální pohybující se blok

let blockDir; // směr pohybu aktuálního bloku (1 = doprava, -1 = doleva)
let blockSpeed; // rychlost pohybu aktuálního bloku

let placedBlocks = []; // pole obsahující již umístěné bloky

const statePlaying = "playing"; // stav hry: právě se hraje
const stateLose = "lose"; // stav hry: hráč prohrál
const stateWin = "win"; // stav hry: hráč vyhrál

let menuState = statePlaying; // aktuální stav hry
let backgroundMusic; // pozadí hudby
let placeBlockSound; // zvuk při pokládání bloku
let loseSound; // zvuk při prohře
let winSound; // zvuk při výhře
let hasWon = false; // jestli hráč vyhral

let gameOverScreen; // obrazovka při prohře
let winScreen; // obrazovka při výhře

function preload() {
  backgroundMusic = loadSound('suits-you-69233.mp3'); // načte hudbu na pozadí
  placeBlockSound = loadSound('coin-recieved-230517.mp3'); // načte zvuk pro pokládání
  loseSound = loadSound('mixkit-retro-arcade-game-over-470.wav'); // načte zvuk při prohře
  winSound = loadSound('yippee-147032.mp3'); // načte zvuk při výhře
  gameOverScreen = loadImage('cfeb1-17307905668565.jpg'); // načte obrazovku při prohře
  winScreen = loadImage('36777-90.jpg'); // načte obrazovku při výhře
  
}

function setup() {
  createCanvas(600, 600); // vytvoří herní plátno o velikosti 600x600 px
  textAlign(CENTER, CENTER); // nastaví zarovnání textu na střed
  newGame(); // spustí novou hru
  backgroundMusic.loop(); // spustí hudbu na pozadí
}

function draw() {
  background(220); // nastaví šedé pozadí
  
  if(menuState === statePlaying) { 
    textSize(blockHeight); // nastaví velikost textu na výšku bloku
    updateBlock(); // aktualizuje pozici pohybujícího se bloku
    drawBlocks(); // vykreslí všechny bloky
  } else if(menuState === stateLose) {
    if (gameOverScreen){ //nastaví obrazovku pro prohru
    imageMode(CORNER);
    image(gameOverScreen, 0, 0, width, height)
  } else {
    background(20);
  }
    
    textSize(blockHeight * 2); // zvýrazní text při prohře
    fill(220); // nastaví červenou barvu pro text
    text("Game over", width/2, height/2); // zobrazí zprávu o prohře
    textSize(blockHeight); 
    text("Zmačkni mezerník, aby si začal novou hru!", width/2, height * 3/4);
    
    backgroundMusic.stop(); // zastaví hudbu při prohře
  } else if(menuState === stateWin) {
    if (winScreen){ // nastaví obrazovku pro výhru
    imageMode(CORNER);
    image(winScreen, 0, 0, width, height)
  } else {
    background(20);
  }
    textSize(blockHeight * 2); // zvýrazní text při výhře
    fill(20); // nastaví šedou barvu pro text
    text("Vyhrál jsi !", width/2, height/2); // zobrazí zprávu o výhře
    textSize(blockHeight);
    text("Zmačkni mezerník, aby si začal novou hru!", width/2, height * 3/4);
    backgroundMusic.stop(); // zastaví hudbu při výhře
   
    if (!hasWon) { // pokud hráč ještě nevyhrál
      winSound.play(); // přehrát zvuk výhry
      hasWon = true; // nastaví, že hráč vyhrál
    }
  }  
}

function keyReleased() {
  if(key === " ") { // reaguje na uvolnění mezerníku
    if(menuState === statePlaying) {
      placeBlock(); // umístí blok, pokud hra běží
    } else {
      newGame(); // restartuje hru, pokud je hra v jiném stavu
      menuState = statePlaying;
      backgroundMusic.loop(); // spustí hudbu na pozadí při restartu
      hasWon = false; // nastaví, že hráč nevyhrál
    }
  }
}

function newGame() {
  currentBlock = createVector(0, height-blockHeight, blockWidth); // vybere nový pohybující se blok
  blockDir = 1; // blok se začne pohybovat doprava
  blockSpeed = 2; // rychlost pohybu bloku
  placedBlocks = []; // vyprázdní pole umístěných bloků
}

function updateBlock() {
  currentBlock.x += blockDir * blockSpeed; // posunuje blok podle směru a rychlosti.
  
  if(currentBlock.x < 0) { // pokud blok narazí na levou hranu
    blockDir = 1; // změní směr doprava
  }
  if(currentBlock.x + currentBlock.z > width) { // pokud blok narazí na pravou hranu
    blockDir = -1; // změní směr doleva
  }  
}

function drawBlocks() {
  fill(255, 0, 0); // červená barva pro aktuální blok
  rect(currentBlock.x, currentBlock.y, currentBlock.z, blockHeight); // vykreslí aktuální blok
  
  fill(80); // šedá barva pro umístěné bloky
  for(let block of placedBlocks) {
    rect(block.x, block.y, block.z, blockHeight); // vykreslí každý blok v poli umístěných bloků
  }
  
  text(placedBlocks.length, blockHeight, blockHeight); // zobrazí počet umístěných bloků
}

function placeBlock() {
  const prevBlock = placedBlocks[placedBlocks.length - 1]; // poslední umístěný blok
  let newWidth = blockWidth; // výchozí šířka nového bloku
  
  if(prevBlock) {
    const leftEdge = max(prevBlock.x, currentBlock.x); // levý okraj překryvu
    const rightEdge = min(prevBlock.x + prevBlock.z, currentBlock.x + currentBlock.z); // pravý okraj překryvu
    newWidth = rightEdge - leftEdge; // šířka nového bloku podle překryvu
    currentBlock.x = leftEdge; // posune blok na správnou pozici
    currentBlock.z = newWidth; // aktualizuje šířku bloku
  }
  
  if(newWidth < 0) { // pokud není žádný překryv
    menuState = stateLose; // nastaví stav hry na prohru
    loseSound.play();
    return;
  }
  
  placedBlocks.push(currentBlock); // přidá aktuální blok do pole umístěných bloků
  placeBlockSound.play();
  blockSpeed *= 1.1; // zvyšuje rychlost pohybu
  newBlock(newWidth); // vytvoří nový pohybující se blok
}

function newBlock(newWidth) {
  const blockStackHeight = (placedBlocks.length + 1) * blockHeight; // celková výška stohu bloků
  
  if(blockStackHeight > height) { // pokud bloky dosáhnou vrcholu obrazovky
    menuState = stateWin; // nastaví stav hry na výhru
    return;
  }
  
  currentBlock = createVector(0, height - blockStackHeight, newWidth); // vybere nový pohybující se blok
}
