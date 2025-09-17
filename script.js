class ReactionSpeedGame {
    constructor() {
        this.gameArea = document.getElementById('gameArea');
        this.startScreen = document.getElementById('startScreen');
        this.gameOverScreen = document.getElementById('gameOverScreen');
        this.startBtn = document.getElementById('startBtn');
        this.restartBtn = document.getElementById('restartBtn');
        this.timerElement = document.getElementById('timer');
        this.scoreElement = document.getElementById('score');
        this.finalScoreElement = document.getElementById('finalScore');
        this.performanceTextElement = document.getElementById('performanceText');
        this.particlesContainer = document.getElementById('particlesContainer');
        this.gameState = 'waiting';
        this.score = 0;
        this.timeLeft = 15;
        this.gameTimer = null;
        this.dotSpawnTimer = null;
        this.dots = [];
        
        this.initializeEventListeners();
    }
    
    initializeEventListeners() {
        this.startBtn.addEventListener('click', () => this.startGame());
        this.restartBtn.addEventListener('click', () => this.restartGame());
        
        this.gameArea.addEventListener('touchstart', (e) => {
            e.preventDefault();
            if (this.gameState === 'playing') {
                this.handleClick(e.touches[0]);
            }
        });
        
        this.gameArea.addEventListener('click', (e) => {
            if (this.gameState === 'playing') {
                this.handleClick(e);
            }
        });
    }
    
    startGame() {
        this.gameState = 'playing';
        this.score = 0;
        this.timeLeft = 15;
        
        this.startScreen.style.display = 'none';
        this.gameOverScreen.style.display = 'none';
        
        this.updateScore();
        this.updateTimer();
        this.gameTimer = setInterval(() => {
            this.timeLeft--;
            this.updateTimer();
            
            if (this.timeLeft <= 0) {
                this.endGame();
            }
        }, 1000);
        
        this.spawnDot();
    }
    
    scheduleNextDot() {
    }

    spawnDot() {
        if (this.gameState !== 'playing') return;
        
        this.dots.forEach(dot => {
            if (dot.parentNode) {
                this.removeDot(dot);
            }
        });
        this.dots = [];
        
        const dot = document.createElement('div');
        dot.className = 'red-dot';
        
        const dotSize = 40;
        const padding = 20;
        const gameAreaWidth = this.gameArea.offsetWidth;
        const gameAreaHeight = this.gameArea.offsetHeight;
        
        const maxX = Math.max(0, gameAreaWidth - dotSize - (padding * 2));
        const maxY = Math.max(0, gameAreaHeight - dotSize - (padding * 2));
        
        const x = Math.random() * maxX + padding;
        const y = Math.random() * maxY + padding;
        
        dot.style.left = x + 'px';
        dot.style.top = y + 'px';
        
        dot.addEventListener('click', (e) => {
            e.stopPropagation();
            this.clickDot(dot);
        });
        
        dot.addEventListener('touchstart', (e) => {
            e.preventDefault();
            e.stopPropagation();
            this.clickDot(dot);
        });
        
        this.gameArea.appendChild(dot);
        this.dots.push(dot);
    }
    
    clickDot(dot) {
        if (this.gameState !== 'playing') return;
        
        this.score++;
        this.updateScore();
        
        this.createParticleEffect(dot);
        
        this.removeDot(dot);
        
        this.scoreElement.classList.add('score-pop');
        setTimeout(() => {
            this.scoreElement.classList.remove('score-pop');
        }, 300);
        
        setTimeout(() => {
            this.spawnDot();
        }, 100);
    }
    
    removeDot(dot) {
        dot.style.animation = 'dotDisappear 0.2s ease-out forwards';
        setTimeout(() => {
            if (dot.parentNode) {
                dot.parentNode.removeChild(dot);
            }
            const index = this.dots.indexOf(dot);
            if (index > -1) {
                this.dots.splice(index, 1);
            }
        }, 200);
    }
    
    createParticleEffect(dot) {
        const rect = dot.getBoundingClientRect();
        const gameAreaRect = this.gameArea.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2 - gameAreaRect.left;
        const centerY = rect.top + rect.height / 2 - gameAreaRect.top;
        
        for (let i = 0; i < 8; i++) {
            const particle = document.createElement('div');
            particle.className = 'particle';
            
            const angle = (i / 8) * Math.PI * 2;
            const distance = 50 + Math.random() * 30;
            const dx = Math.cos(angle) * distance;
            const dy = Math.sin(angle) * distance;
            
            particle.style.left = centerX + 'px';
            particle.style.top = centerY + 'px';
            particle.style.setProperty('--dx', dx + 'px');
            particle.style.setProperty('--dy', dy + 'px');
            
            this.particlesContainer.appendChild(particle);
            
            setTimeout(() => {
                if (particle.parentNode) {
                    particle.parentNode.removeChild(particle);
                }
            }, 1000);
        }
    }
    
    updateScore() {
        this.scoreElement.textContent = this.score;
    }
    
    updateTimer() {
        this.timerElement.textContent = this.timeLeft;
        
        if (this.timeLeft <= 5) {
            this.timerElement.classList.add('timer-warning');
        } else {
            this.timerElement.classList.remove('timer-warning');
        }
    }
    
    endGame() {
        this.gameState = 'gameOver';
        
        clearInterval(this.gameTimer);
        clearTimeout(this.dotSpawnTimer);
        
        this.dots.forEach(dot => {
            if (dot.parentNode) {
                this.removeDot(dot);
            }
        });
        this.dots = [];
        
        this.finalScoreElement.textContent = this.score;
        this.setPerformanceText();
        this.gameOverScreen.style.display = 'block';
        
        const overlay = document.createElement('div');
        overlay.className = 'game-over-overlay';
        this.gameArea.appendChild(overlay);
        
        this.timerElement.classList.remove('timer-warning');
    }
    
    setPerformanceText() {
        let performance = '';
        if (this.score >= 20) {
            performance = 'Not bad';
        } else if (this.score >= 10) {
            performance = 'Decent';
        } else {
            performance = 'Could be better';
        }
        this.performanceTextElement.textContent = performance;
    }
    
    restartGame() {
        const overlay = this.gameArea.querySelector('.game-over-overlay');
        if (overlay) {
            overlay.remove();
        }
        
        this.particlesContainer.innerHTML = '';
        
        this.gameState = 'waiting';
        this.score = 0;
        this.timeLeft = 15;
        
        this.startScreen.style.display = 'block';
        this.gameOverScreen.style.display = 'none';
        
        this.updateScore();
        this.updateTimer();
    }
    
    handleClick(event) {
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new ReactionSpeedGame();
});

document.addEventListener('DOMContentLoaded', () => {
    function createBackgroundParticle() {
        const particle = document.createElement('div');
        particle.style.position = 'absolute';
        particle.style.width = '2px';
        particle.style.height = '2px';
        particle.style.background = 'rgba(255, 255, 255, 0.3)';
        particle.style.borderRadius = '50%';
        particle.style.pointerEvents = 'none';
        particle.style.left = Math.random() * 100 + '%';
        particle.style.top = '100%';
        particle.style.animation = `floatUp ${5 + Math.random() * 10}s linear forwards`;
        
        document.body.appendChild(particle);
        
        setTimeout(() => {
            if (particle.parentNode) {
                particle.parentNode.removeChild(particle);
            }
        }, 15000);
    }
    
    setInterval(createBackgroundParticle, 2000);
    
    const style = document.createElement('style');
    style.textContent = `
        @keyframes floatUp {
            0% {
                transform: translateY(0) rotate(0deg);
                opacity: 0;
            }
            10% {
                opacity: 1;
            }
            90% {
                opacity: 1;
            }
            100% {
                transform: translateY(-100vh) rotate(360deg);
                opacity: 0;
            }
        }
    `;
    document.head.appendChild(style);
});

