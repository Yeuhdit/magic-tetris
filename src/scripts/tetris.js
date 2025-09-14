//src/scripts/tetris.js
(() => {
  const canvas = document.getElementById('tetris');
  const ctx = canvas.getContext('2d');
  const scoreElem = document.getElementById('score');
  const highscoreElem = document.getElementById('highscore');
  const stepsElem = document.getElementById('steps');
  const startBtn = document.getElementById('startBtn');
  const popup = document.getElementById('endPopup');
  const popupMessage = document.getElementById('popupMessage');
  const confettiContainer = document.getElementById('confetti-container');

  const BLOCK_SIZE = 20, COLS = 12, ROWS = 20;
  const COLORS = [null, '#FF5E5B', '#FFD93D', '#6EFACC', '#FF9CEE', '#FFB347', '#A29BFE', '#7BED9F', '#FF6B81', '#F8EFBA'];
  const SHAPES = [
    [],
    [[1,1,1],[0,1,0]],
    [[0,2,2],[2,2,0]],
    [[3,3,0],[0,3,3]],
    [[4,0,0],[4,4,4]],
    [[0,0,5],[5,5,5]],
    [[6,6,6,6]],
    [[7,7],[7,7]],
    [[0,8,0],[0,8,0]],
    [[9,0,0,0]]
  ];

  class Piece {
    constructor(typeId) {
      this.typeId = typeId;
      this.shape = SHAPES[typeId];
      this.pos = { x: Math.floor(COLS/2)-Math.floor(this.shape[0].length/2), y:0 };
    }
    rotate() {
      this.shape = this.shape[0].map((val,index) =>
        this.shape.map(row => row[index]).reverse()
      );
    }
  }

  const arena = Array.from({ length: ROWS }, () => new Array(COLS).fill(0));
  const userData = JSON.parse(localStorage.getItem('gameUser')) || { level:'medium' };
  let level = userData.level;
  let dropInterval = (level==='hard')?500:1000;

  document.getElementById('levelLabel').textContent = 'Level: ' + (level==='hard'?'Hard':'Medium');

  let currentPiece = null, dropCounter = 0, lastTime = 0, score=0, steps=0;
  let highscore = JSON.parse(localStorage.getItem('tetrisHighscore'))||0;
  highscoreElem.textContent = highscore;
  let gameOver = false, isPaused=false;

  function drawBlock(x,y,colorId){
    ctx.fillStyle = COLORS[colorId];
    ctx.fillRect(x*BLOCK_SIZE,y*BLOCK_SIZE,BLOCK_SIZE,BLOCK_SIZE);
    ctx.strokeStyle = '#222';
    ctx.lineWidth = 2;
    ctx.strokeRect(x*BLOCK_SIZE,y*BLOCK_SIZE,BLOCK_SIZE,BLOCK_SIZE);
  }

  function draw(){
    ctx.fillStyle='#222';
    ctx.fillRect(0,0,canvas.width,canvas.height);
    arena.forEach((row,y)=>row.forEach((val,x)=>{if(val!==0)drawBlock(x,y,val);}));    
    if(currentPiece) {
      currentPiece.shape.forEach((row,y)=>row.forEach((val,x)=>{if(val!==0)drawBlock(currentPiece.pos.x+x,currentPiece.pos.y+y,val);}));    
    }
  }

  function collide(arena,piece){
    const m=piece.shape, o=piece.pos;
    for(let y=0;y<m.length;y++){
      for(let x=0;x<m[y].length;x++){
        if(m[y][x]!==0 && (arena[y+o.y] && arena[y+o.y][x+o.x])!==0) return true;
      }
    }
    return false;
  }

  // mergePartial ממלא רק תאים פנויים
  function mergePartial(arena, piece) {
    for (let y = 0; y < piece.shape.length; y++) {
      for (let x = 0; x < piece.shape[y].length; x++) {
        if (piece.shape[y][x] !== 0) {
          const ax = piece.pos.x + x;
          const ay = piece.pos.y + y;
          if (arena[ay] && arena[ay][ax] === 0) {
            arena[ay][ax] = piece.shape[y][x];
          }
        }
      }
    }
  }

  function triggerExplosion(rowY) {
    for (let i = 0; i < 25; i++) {
      const particle = document.createElement("span");
      particle.classList.add("particle");
      const size = Math.random() * 8 + 4;
      const angle = Math.random() * 2 * Math.PI;
      const distance = Math.random() * 80 + 40;
      const color = COLORS[Math.floor(Math.random() * (COLORS.length-1)) + 1];
      particle.style.width = `${size}px`;
      particle.style.height = `${size}px`;
      particle.style.background = color;
      particle.style.left = `${canvas.offsetLeft + canvas.width/2}px`;
      particle.style.top = `${canvas.offsetTop + rowY*BLOCK_SIZE}px`;
      particle.style.position = "absolute";
      particle.style.borderRadius = "50%";
      confettiContainer.appendChild(particle);
      particle.animate([
        { transform: "translate(0,0)", opacity: 1 },
        { transform: `translate(${Math.cos(angle) * distance}px, ${Math.sin(angle) * distance}px)`, opacity: 0 }
      ], {
        duration: 1000 + Math.random() * 500,
        easing: "ease-out"
      });
      setTimeout(() => particle.remove(), 1500);
    }
  }

  function sweep(){
    let rowCount=0;
    outer: for(let y=arena.length-1;y>=0;y--){
      if(arena[y].every(val=>val!==0)){
        arena.splice(y,1);
        arena.unshift(new Array(COLS).fill(0));
        rowCount++;
        triggerExplosion(y);
        y++;
      }
    }
    if(rowCount>0){
      score += rowCount*rowCount*10;
      scoreElem.textContent = score;
      dropInterval = Math.max(100, dropInterval - rowCount*20);
    }
  }

  function createPiece(){ return new Piece(Math.floor(Math.random()*(SHAPES.length-1))+1); }
  function move(dir){ currentPiece.pos.x+=dir; if(collide(arena,currentPiece))currentPiece.pos.x-=dir; }
  function rotatePiece(){ const posX=currentPiece.pos.x; currentPiece.rotate(); if(collide(arena,currentPiece)){currentPiece.rotate();currentPiece.rotate();currentPiece.rotate();currentPiece.pos.x=posX;} }

  function saveGameData(score,steps,level){
    let games = JSON.parse(localStorage.getItem('tetrisGamesHistory'))||[];
    const gameData = { score, steps, level, timestamp: Date.now() };
    games.push(gameData);
    games.sort((a,b)=>b.score-a.score);
    localStorage.setItem('tetrisGamesHistory',JSON.stringify(games));
    localStorage.setItem('tetrisGameData',JSON.stringify(gameData));
  }

  function drop() {
    currentPiece.pos.y++;
    steps++;
    stepsElem.textContent = steps;

    if (collide(arena, currentPiece)) {
      currentPiece.pos.y--;
      mergePartial(arena, currentPiece); // כאן משתמשים בגרסה החלקית
      sweep();

      currentPiece = createPiece();

      // בדיקה אם יש לפחות חלק אחד פנוי
      let anyPartFits = false;
      for (let y = 0; y < currentPiece.shape.length; y++) {
        for (let x = 0; x < currentPiece.shape[y].length; x++) {
          if (currentPiece.shape[y][x] !== 0) {
            const ax = currentPiece.pos.x + x;
            const ay = currentPiece.pos.y + y;
            if (arena[ay] && arena[ay][ax] === 0) {
              anyPartFits = true;
              break;
            }
          }
        }
        if (anyPartFits) break;
      }

      if (!anyPartFits) {
        gameOver = true;
        if (score > highscore) {
          highscore = score;
          localStorage.setItem('tetrisHighscore', JSON.stringify(score));
          highscoreElem.textContent = highscore;
          showPopup('Game Over! New High Score: ' + score);
        } else {
          showPopup('Game Over! Score: ' + score);
        }
        saveGameData(score, steps, level);
      }
    }

    dropCounter = 0;
  }

  function showPopup(message){
    popupMessage.innerText = message;
    popup.style.display='block';
  }

  function update(time=0){
    if(gameOver||isPaused)return;
    const deltaTime = time-lastTime;
    lastTime=time;
    dropCounter+=deltaTime;
    if(dropCounter>dropInterval)drop();
    draw();
    requestAnimationFrame(update);
  }

  document.addEventListener('keydown',e=>{
    if(gameOver||isPaused)return;
    if(e.key==='ArrowLeft') move(-1);
    else if(e.key==='ArrowRight') move(1);
    else if(e.key==='ArrowDown') drop();
    else if(e.key==='ArrowUp') rotatePiece();
  });

  document.getElementById('backBtn').addEventListener('click', () => {
    window.location.href = 'login.html';
  });

  startBtn.addEventListener('click',e=>{
    e.preventDefault();
    for(let y=0;y<arena.length;y++) arena[y].fill(0);
    score=0; steps=0; gameOver=false; isPaused=false; currentPiece=createPiece();
    scoreElem.textContent=0; stepsElem.textContent=0;
    dropInterval=(level==='hard')?500:1000;
    update();
  });

})();
