class Particle {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.baseX = x;
        this.baseY = y;
        this.size = Math.random() * 5 + 2;
        this.density = Math.random() * 30 + 1;
        this.distance = 0;

        const hue = Math.random() * 30 + 180;
        const saturation = 70 + Math.random() * 30;
        const lightness = 50 + Math.random() * 30;
        this.color = `hsl(${hue}, ${saturation}%, ${lightness}%)`;
    }

    update(mouseX, mouseY) {
        const dx = mouseX - this.x;
        const dy = mouseY - this.y;
        this.distance = Math.sqrt(dx * dx + dy * dy);

        const forceDirectionX = dx / this.distance;
        const forceDirectionY = dy / this.distance;
        const maxDistance = 100;
        const force = (maxDistance - this.distance) / maxDistance;

        if (this.distance < maxDistance) {
            const directionX = forceDirectionX * force * this.density;
            const directionY = forceDirectionY * force * this.density;
            this.x -= directionX;
            this.y -= directionY;
        } else {
            if (this.x !== this.baseX) {
                const dx = this.x - this.baseX;
                this.x -= dx / 10;
            }
            if (this.y !== this.baseY) {
                const dy = this.y - this.baseY;
                this.y -= dy / 10;
            }
        }
    }

    draw(ctx) {
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.closePath();
        ctx.fill();
    }
}

class HeroCanvas {
    constructor(canvasId) {
        this.canvas = document.getElementById(canvasId);
        if (!this.canvas) return;

        this.ctx = this.canvas.getContext('2d');
        this.particles = [];
        this.mouseX = 0;
        this.mouseY = 0;
        this.targetX = 0;
        this.targetY = 0;
        this.animationId = null;
        this.gridSize = 30;

        this.init();
    }

    init() {
        this.setCanvasDimensions();
        this.setupEventListeners();
        this.createParticles();
        this.animate();

        window.addEventListener('resize', () => {
            this.setCanvasDimensions();
            this.createParticles();
        });
    }

    setCanvasDimensions() {
        const devicePixelRatio = window.devicePixelRatio || 1;
        const rect = this.canvas.getBoundingClientRect();
        this.canvas.width = rect.width * devicePixelRatio;
        this.canvas.height = rect.height * devicePixelRatio;
        this.ctx.scale(devicePixelRatio, devicePixelRatio);
    }

    setupEventListeners() {
        this.canvas.addEventListener('mousemove', (e) => {
            const rect = this.canvas.getBoundingClientRect();
            this.targetX = e.clientX - rect.left;
            this.targetY = e.clientY - rect.top;
        });
    }

    createParticles() {
        this.particles = [];
        const canvasWidth = this.canvas.width / (window.devicePixelRatio || 1);
        const canvasHeight = this.canvas.height / (window.devicePixelRatio || 1);
        const numX = Math.floor(canvasWidth / this.gridSize);
        const numY = Math.floor(canvasHeight / this.gridSize);

        for (let y = 0; y < numY; y++) {
            for (let x = 0; x < numX; x++) {
                const posX = x * this.gridSize + this.gridSize / 2;
                const posY = y * this.gridSize + this.gridSize / 2;
                this.particles.push(new Particle(posX, posY));
            }
        }
    }

    animate() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        this.mouseX += (this.targetX - this.mouseX) * 0.1;
        this.mouseY += (this.targetY - this.mouseY) * 0.1;

        for (const particle of this.particles) {
            particle.update(this.mouseX, this.mouseY);
            particle.draw(this.ctx);
        }

        this.animationId = requestAnimationFrame(() => this.animate());
    }

    destroy() {
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
        }

        this.canvas.removeEventListener('mousemove', this.handleMouseMove);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const heroCanvas = new HeroCanvas('heroCanvas');
});