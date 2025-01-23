const blockWidth = 300; // Šířka bloku na začátku hry.
const blockHeight = 30; // Výška jednoho bloku.
let currentBlock; // Aktuální pohybující se blok.

let blockDir; // Směr pohybu aktuálního bloku (1 = doprava, -1 = doleva).
let blockSpeed; // Rychlost pohybu aktuálního bloku.

let placedBlocks = []; // Pole obsahující již umístěné bloky.

const statePlaying = "playing"; // Stav hry: právě se hraje.
const stateLose = "lose"; // Stav hry: hráč prohrál.
const stateWin = "win"; // Stav hry: hráč vyhrál.

let menuState = statePlaying; // Aktuální stav hry.
let backgroundMusic; // Pozadí hudby.
let placeBlockSound; //Zvuk při pokládání bloku
let loseSound; //Zvuk při prohře.
let winSound; //Zvuk při výhře.
let hasWon = false; //Jestli hráč vyhral.

let gameOverScreen; //Obrazovka při prohře.
let winScreen; //Obrazovka při výhře.

function preload() {
  backgroundMusic = loadSound('suits-you-69233.mp3'); // Načte hudbu na pozadí.
  placeBlockSound = loadSound('coin-recieved-230517.mp3'); //Načte zvuk pro pokládání.
  loseSound = loadSound('mixkit-retro-arcade-game-over-470.wav'); //Načte zvuk při prohře.
  winSound = loadSound('yippee-147032.mp3'); //Načte zvuk při výhře.
  gameOverScreen = loadImage('cfeb1-17307905668565.jpg'); //Načte obrazovku při prohře.
  winScreen = loadImage('36777-90.jpg'); //Načte obrazovku při výhře.
  
}

function setup() {
  createCanvas(600, 600); // Vytvoří herní plátno o velikosti 600x600 px.
  textAlign(CENTER, CENTER); // Nastaví zarovnání textu na střed.
  newGame(); // Spustí novou hru.
  backgroundMusic.loop(); // Spustí hudbu na pozadí.
}

function draw() {
  background(220); // Nastaví šedé pozadí.
  
  if(menuState === statePlaying) { 
    textSize(blockHeight); // Nastaví velikost textu na výšku bloku.
    updateBlock(); // Aktualizuje pozici pohybujícího se bloku.
    drawBlocks(); // Vykreslí všechny bloky.
  } else if(menuState === stateLose) {
    if (gameOverScreen){ //Nastaví obrazovku pro prohru.
    imageMode(CORNER);
    image(gameOverScreen, 0, 0, width, height)
  } else {
    background(20);
  }
    
    textSize(blockHeight * 2); // Zvýrazní text při prohře.
    fill(220); // Nastaví červenou barvu pro text.
    text("Game over", width/2, height/2); // Zobrazí zprávu o prohře.
    textSize(blockHeight); 
    text("Zmačkni mezerník, aby si začal novou hru!", width/2, height * 3/4);
    
    backgroundMusic.stop(); // Zastaví hudbu při prohře.
  } else if(menuState === stateWin) {
    if (winScreen){ //NAstaví obrazovku pro výhru
    imageMode(CORNER);
    image(winScreen, 0, 0, width, height)
  } else {
    background(20);
  }
    textSize(blockHeight * 2); // Zvýrazní text při výhře.
    fill(20); // Nastaví šedou barvu pro text.
    text("Vyhrál jsi !", width/2, height/2); // Zobrazí zprávu o výhře.
    textSize(blockHeight);
    text("Zmačkni mezerník, aby si začal novou hru!", width/2, height * 3/4);
    backgroundMusic.stop(); // Zastaví hudbu při výhře.
   
    if (!hasWon) { // Pokud hráč ještě nevyhrál.
      winSound.play(); // Přehrát zvuk výhry.
      hasWon = true; // Nastaví, že hráč vyhrál.
    }
  }  
}

function keyReleased() {
  if(key === " ") { // Reaguje na uvolnění mezerníku.
    if(menuState === statePlaying) {
      placeBlock(); // Umístí blok, pokud hra běží.
    } else {
      newGame(); // Restartuje hru, pokud je hra v jiném stavu.
      menuState = statePlaying;
      backgroundMusic.loop(); // Spustí hudbu na pozadí při restartu.
      hasWon = false; // Nastaví, že hráč nevyhrál
    }
  }
}

function newGame() {
  currentBlock = createVector(0, height-blockHeight, blockWidth); // Inicializuje nový pohybující se blok.
  blockDir = 1; // Blok se začne pohybovat doprava.
  blockSpeed = 2; // Rychlost pohybu bloku.
  placedBlocks = []; // Vyprázdní pole umístěných bloků.
}

function updateBlock() {
  currentBlock.x += blockDir * blockSpeed; // Posunuje blok podle směru a rychlosti.
  
  if(currentBlock.x < 0) { // Pokud blok narazí na levou hranu.
    blockDir = 1; // Změní směr doprava.
  }
  if(currentBlock.x + currentBlock.z > width) { // Pokud blok narazí na pravou hranu.
    blockDir = -1; // Změní směr doleva.
  }  
}

function drawBlocks() {
  fill(255, 0, 0); // Červená barva pro aktuální blok.
  rect(currentBlock.x, currentBlock.y, currentBlock.z, blockHeight); // Vykreslí aktuální blok.
  
  fill(80); // Šedá barva pro umístěné bloky.
  for(let block of placedBlocks) {
    rect(block.x, block.y, block.z, blockHeight); // Vykreslí každý blok v poli umístěných bloků.
  }
  
  text(placedBlocks.length, blockHeight, blockHeight); // Zobrazí počet umístěných bloků.
}

function placeBlock() {
  const prevBlock = placedBlocks[placedBlocks.length - 1]; // Poslední umístěný blok.
  let newWidth = blockWidth; // Výchozí šířka nového bloku.
  
  if(prevBlock) {
    const leftEdge = max(prevBlock.x, currentBlock.x); // Levý okraj překryvu.
    const rightEdge = min(prevBlock.x + prevBlock.z, currentBlock.x + currentBlock.z); // Pravý okraj překryvu.
    newWidth = rightEdge - leftEdge; // Šířka nového bloku podle překryvu.
    currentBlock.x = leftEdge; // Posune blok na správnou pozici.
    currentBlock.z = newWidth; // Aktualizuje šířku bloku.
  }
  
  if(newWidth < 0) { // Pokud není žádný překryv.
    menuState = stateLose; // Nastaví stav hry na prohru.
    loseSound.play();
    return;
  }
  
  placedBlocks.push(currentBlock); // Přidá aktuální blok do pole umístěných bloků.
  placeBlockSound.play();
  blockSpeed *= 1.1; // Zvyšuje rychlost pohybu.
  newBlock(newWidth); // Vytvoří nový pohybující se blok.
}

function newBlock(newWidth) {
  const blockStackHeight = (placedBlocks.length + 1) * blockHeight; // Celková výška stohu bloků.
  
  if(blockStackHeight > height) { // Pokud bloky dosáhnou vrcholu obrazovky.
    menuState = stateWin; // Nastaví stav hry na výhru.
    return;
  }
  
  currentBlock = createVector(0, height - blockStackHeight, newWidth); // Inicializuje nový pohybující se blok.
}
