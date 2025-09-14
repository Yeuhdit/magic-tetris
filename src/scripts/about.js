//src/scripts/about.js
const canvas = document.getElementById("bg-canvas");
const ctx = canvas.getContext("2d");

function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight * 0.8;
}
resizeCanvas();
window.addEventListener("resize", resizeCanvas);

const shapes = [
  [[1,1,1,1]], [[1,1],[1,1]], [[0,1,0],[1,1,1]],
  [[1,0,0],[1,1,1]], [[0,0,1],[1,1,1]], [[1,1,0],[0,1,1]], [[0,1,1],[1,1,0]]
];

class TetrisShape {
  constructor() { this.reset(); }
  reset() {
    this.shape = shapes[Math.floor(Math.random()*shapes.length)];
    this.size = 15 + Math.random()*20;
    this.x = Math.random() * canvas.width;
    this.y = -this.size * 3;
    this.speed = 0.5 + Math.random()*2;
    this.angle = Math.random()*Math.PI*2;
    this.rotationSpeed = (Math.random()-0.5)*0.03;
    this.opacity = 0;
    this.opacitySpeed = 0.01 + Math.random()*0.02;
    this.color = `hsla(${Math.random()*360}, 100%, 70%, 1)`;
    this.swingAmplitude = 15 + Math.random()*25; 
    this.swingSpeed = 0.005 + Math.random()*0.02;
    this.swingAngle = 0;
  }
  draw() {
    ctx.save();
    ctx.translate(this.x, this.y);
    ctx.rotate(this.angle);
    ctx.globalAlpha = this.opacity;
    ctx.shadowColor = this.color;
    ctx.shadowBlur = 20;
    ctx.fillStyle = this.color;
    for(let r=0;r<this.shape.length;r++){
      for(let c=0;c<this.shape[r].length;c++){
        if(this.shape[r][c]){
          ctx.fillRect(c*this.size, r*this.size, this.size-2, this.size-2);
        }
      }
    }
    ctx.restore();
  }
  explode() {
    // יוצרים חלקיקים מהקוביה
    for (let r=0;r<this.shape.length;r++){
      for (let c=0;c<this.shape[r].length;c++){
        if(this.shape[r][c]){
          const particle = {
            x: this.x + c*this.size,
            y: this.y + r*this.size,
            size: this.size * 0.6,
            color: this.color,
            vx: (Math.random()-0.5)*5,
            vy: Math.random()*-3 - 2,
            alpha: 1
          };
          particles.push(particle);
        }
      }
    }
  }
  update() {
    this.y += this.speed;
    this.angle += this.rotationSpeed;
    this.swingAngle += this.swingSpeed;
    this.x += Math.sin(this.swingAngle) * this.swingAmplitude * 0.04;

    // Fade in/out
    if(this.opacity < 1) this.opacity += this.opacitySpeed;

    if(this.y > canvas.height*0.8) {
      this.explode();  // פיצוץ כשהקוביה מגיעה לתחתית
      this.reset();
    }

    this.draw();
  }
}

// מערך לחלקיקים
const particles = [];

function updateParticles() {
  for (let i = particles.length-1; i>=0; i--) {
    const p = particles[i];
    p.x += p.vx;
    p.y += p.vy;
    p.vy += 0.1; // כוח כבידה קל
    p.alpha -= 0.02;
    if(p.alpha <= 0) particles.splice(i,1);
    else {
      ctx.globalAlpha = p.alpha;
      ctx.fillStyle = p.color;
      ctx.shadowBlur = 15;
      ctx.shadowColor = p.color;
      ctx.fillRect(p.x, p.y, p.size, p.size);
    }
  }
  ctx.globalAlpha = 1;
}

const tetrisShapes = [];
for(let i=0;i<35;i++) tetrisShapes.push(new TetrisShape());

function animate(){
  ctx.clearRect(0,0,canvas.width,canvas.height);
  tetrisShapes.forEach(shape => shape.update());
  updateParticles();
  requestAnimationFrame(animate);
}
animate();
