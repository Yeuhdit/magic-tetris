  const canvas = document.getElementById("bg-canvas");
    const ctx = canvas.getContext("2d");

    function resizeCanvas() {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
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
        this.size = 20 + Math.random()*15;
        this.x = Math.random() * canvas.width;
        this.y = -this.size * 3;
        this.speed = 1 + Math.random()*2;
        this.angle = Math.random()*Math.PI*2;
        this.rotationSpeed = (Math.random()-0.5)*0.02;
        this.color = `hsla(${Math.random()*360}, 100%, 70%, 0.7)`;
        this.swingAmplitude = 20 + Math.random()*20;
        this.swingSpeed = 0.01 + Math.random()*0.02;
        this.swingAngle = 0;
      }
      draw() {
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(this.angle);
        ctx.shadowColor = this.color;
        ctx.shadowBlur = 15;
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
      update() {
        this.y += this.speed;
        this.angle += this.rotationSpeed;
        this.swingAngle += this.swingSpeed;
        this.x += Math.sin(this.swingAngle) * this.swingAmplitude * 0.05;
        if(this.y > canvas.height + 50) this.reset();
        this.draw();
      }
    }

    const tetrisShapes = [];
    for(let i=0;i<40;i++) tetrisShapes.push(new TetrisShape());

    function animate(){
      ctx.clearRect(0,0,canvas.width,canvas.height);
      tetrisShapes.forEach(shape => shape.update());
      requestAnimationFrame(animate);
    }
    animate();