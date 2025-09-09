function showLeafGame() {
  const container = document.getElementById('leafGameContainer');
  // Clear previous content
  container.innerHTML = `
    <div style="position:fixed;top:0;left:0;width:100vw;height:100vh;background:rgba(60,30,10,0.97);z-index:9999;display:flex;justify-content:center;align-items:center;">
      <div style="text-align:center;">
        <div style="font-family:'Lilita One',cursive;font-size:2rem;color:#FFD700;margin-bottom:10px;">Mini Leaf Game 🌱</div>
        <canvas id="gameCanvas" width="400" height="600" style="border-radius:16px;box-shadow:0 6px 22px #A0522D;border:2px solid #FFD700;"></canvas>
        <div style="color:#FFD700;font-size:1.1rem;margin-top:10px;" id="score">Score: 0</div>
        <button style="margin-top:10px;padding:10px 28px;border-radius:8px;border:2px solid #FFD700;background:rgba(255,255,255,0.12);color:#FFD700;font-weight:bold;cursor:pointer;" id="restartBtn">Restart</button>
        <div style="font-size:1.5rem;color:#FF6347;margin-top:16px;font-family:'Lilita One',cursive;" id="gameOver"></div>
        <button style="margin-top:18px;padding:8px 22px;border-radius:8px;border:2px solid #FFD700;background:rgba(255,255,255,0.12);color:#FFD700;font-weight:bold;cursor:pointer;" onclick="hideLeafGame()">Close</button>
      </div>
    </div>
  `;
  container.style.display = "block";

  // Paste the game JS code here, but replace all getElementById references to use container.querySelector
  // For brevity, here's a simplified version:
  (function(){
    const canvas = container.querySelector('#gameCanvas');
    const ctx = canvas.getContext('2d');
    const leafImg = new Image();
    leafImg.src = "https://randyvz205.github.io/leafs/leaves1.png";

    const GRAVITY = 0.32;
    const JUMP = -6.2;
    const PIPE_GAP = 145;
    const PIPE_WIDTH = 68;
    const PIPE_SPEED = 2.7;
    let leaf = { x: 70, y: 300, w: 40, h: 40, velocity: 0 };
    let pipes = [];
    let score = 0;
    let gameActive = true;
    let gameStarted = false;

    function resetGame() {
      leaf.y = 300; leaf.velocity = 0;
      score = 0;
      pipes = [];
      gameActive = true;
      gameStarted = false;
      container.querySelector('#score').textContent = "Score: 0";
      container.querySelector('#gameOver').textContent = "";
      container.querySelector('#restartBtn').style.display = "none";
    }
    function spawnPipe() {
      let topPipeHeight = Math.floor(80 + Math.random() * 250);
      pipes.push({
        x: canvas.width,
        top: topPipeHeight,
        bottom: topPipeHeight + PIPE_GAP
      });
    }
    function drawLeaf() {
      ctx.save();
      ctx.translate(leaf.x + leaf.w/2, leaf.y + leaf.h/2);
      ctx.rotate(leaf.velocity * 0.06);
      ctx.drawImage(leafImg, -leaf.w/2, -leaf.h/2, leaf.w, leaf.h);
      ctx.restore();
    }
    function drawPipes() {
      ctx.fillStyle = "#228B22";
      pipes.forEach(pipe => {
        ctx.fillRect(pipe.x, 0, PIPE_WIDTH, pipe.top);
        ctx.fillRect(pipe.x, pipe.bottom, PIPE_WIDTH, canvas.height - pipe.bottom);
      });
    }
    function drawBackground() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.globalAlpha = 0.1;
      for (let i = 0; i < 12; i++) {
        ctx.drawImage(leafImg, (i * 33 + score * 5) % canvas.width, (i * 45 + score * 7) % canvas.height, 38, 38);
      }
      ctx.globalAlpha = 1.0;
    }
    function update() {
      if (!gameActive) return;
      drawBackground();
      leaf.velocity += GRAVITY;
      leaf.y += leaf.velocity;

      if (gameStarted) {
        if (pipes.length === 0 || pipes[pipes.length - 1].x < canvas.width - 220) spawnPipe();
        pipes.forEach(pipe => pipe.x -= PIPE_SPEED);
        if (pipes.length && pipes[0].x < -PIPE_WIDTH) pipes.shift();
      }
      drawPipes();
      drawLeaf();
      pipes.forEach(pipe => {
        if (
          leaf.x + leaf.w > pipe.x && leaf.x < pipe.x + PIPE_WIDTH &&
          (leaf.y < pipe.top || leaf.y + leaf.h > pipe.bottom)
        ) {
          endGame();
        }
        if (!pipe.scored && pipe.x + PIPE_WIDTH < leaf.x) {
          score++;
          pipe.scored = true;
          container.querySelector('#score').textContent = "Score: " + score;
        }
      });
      if (leaf.y + leaf.h > canvas.height || leaf.y < 0) endGame();
      if (gameActive) requestAnimationFrame(update);
    }
    function flap() {
      if (!gameActive) return;
      leaf.velocity = JUMP;
      gameStarted = true;
    }
    function endGame() {
      gameActive = false;
      container.querySelector('#gameOver').textContent = "Game Over!";
      container.querySelector('#restartBtn').style.display = "inline-block";
    }
    canvas.addEventListener('mousedown', flap);
    canvas.addEventListener('touchstart', flap);
    document.addEventListener('keydown', function(e) {
      if (e.code === "Space" || e.code === "ArrowUp") flap();
    });
    container.querySelector('#restartBtn').onclick = function() {
      resetGame();
      update();
    };
    leafImg.onload = function() {
      resetGame();
      update();
    };
    window.addEventListener('touchmove', function(e){e.preventDefault()}, {passive:false});
  })();
}

function hideLeafGame() {
  document.getElementById('leafGameContainer').style.display = "none";
}