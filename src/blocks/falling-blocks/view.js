/**
 * 8-Bit Retro Falling Blocks Game Implementation
 * A complete Falling Blocks game with authentic 8-bit aesthetics
 */

document.addEventListener('DOMContentLoaded', function() {
    // Initialize all Falling Blocks games on the page
    const fallingBlockContainers = document.querySelectorAll('.falling-blocks-container');
    
    fallingBlockContainers.forEach(container => {
        new FallingBlocksGame(container);
    });
});

class FallingBlocksGame {
    constructor(container) {
        this.container = container;
        this.canvas = container.querySelector('.falling-blocks-canvas');
        this.ctx = this.canvas.getContext('2d');
        this.nextCanvas = container.querySelector('.next-piece-canvas');
        this.nextCtx = this.nextCanvas.getContext('2d');
        
        // Configure canvas for pixel-perfect rendering
        this.ctx.imageSmoothingEnabled = false;
        this.nextCtx.imageSmoothingEnabled = false;
        
        // Game settings
        this.width = parseInt(container.dataset.width) || 300;
        this.height = parseInt(container.dataset.height) || 600;
        this.showControls = container.dataset.showControls === 'true';
        
        // Grid settings - make blocks bigger for 8-bit feel
        this.blockSize = 30;
        this.cols = Math.floor(this.width / this.blockSize);
        this.rows = Math.floor(this.height / this.blockSize);
        
        // Game state
        this.board = [];
        this.currentPiece = null;
        this.nextPiece = null;
        this.score = 0;
        this.level = 1;
        this.lines = 0;
        this.dropTime = 0;
        this.dropInterval = 800; // Slightly slower for retro feel
        this.gameOver = false;
        this.paused = false;
        
        // 8-bit block pieces
        this.pieces = {
            'I': [
                [[1,1,1,1]]
            ],
            'O': [
                [[1,1],
                 [1,1]]
            ],
            'T': [
                [[0,1,0],
                 [1,1,1]]
            ],
            'S': [
                [[0,1,1],
                 [1,1,0]]
            ],
            'Z': [
                [[1,1,0],
                 [0,1,1]]
            ],
            'J': [
                [[1,0,0],
                 [1,1,1]]
            ],
            'L': [
                [[0,0,1],
                 [1,1,1]]
            ]
        };
        
        // Classic 8-bit colors - bright and saturated
        this.colors = {
            'I': '#00FFFF',    // Cyan
            'O': '#FFFF00',    // Yellow  
            'T': '#FF00FF',    // Magenta
            'S': '#00FF00',    // Lime
            'Z': '#FF0000',    // Red
            'J': '#0000FF',    // Blue
            'L': '#FFA500'     // Orange
        };
        
        // 8-bit sound effects simulation
        this.audioContext = null;
        this.initAudio();
        
        this.init();
    }
    
    initAudio() {
        try {
            this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
        } catch (e) {
            console.log('Audio context not supported');
        }
    }
    
    // Generate 8-bit style beep sounds
    playSound(frequency, duration, type = 'square') {
        if (!this.audioContext) return;
        
        const oscillator = this.audioContext.createOscillator();
        const gainNode = this.audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(this.audioContext.destination);
        
        oscillator.frequency.value = frequency;
        oscillator.type = type;
        
        gainNode.gain.setValueAtTime(0.1, this.audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + duration);
        
        oscillator.start(this.audioContext.currentTime);
        oscillator.stop(this.audioContext.currentTime + duration);
    }
    
    init() {
        this.createBoard();
        this.bindEvents();
        this.nextPiece = this.createPiece();
        this.spawnPiece();
        this.updateScore();
        this.gameLoop();
    }
    
    createBoard() {
        this.board = Array(this.rows).fill().map(() => Array(this.cols).fill(0));
    }
    
    bindEvents() {
        // Keyboard controls
        document.addEventListener('keydown', (e) => {
            if (this.gameOver || this.paused) {
                if (e.key === 'r' || e.key === 'R') {
                    e.preventDefault();
                    this.restart();
                }
                return;
            }
            
            switch(e.key) {
                case 'ArrowLeft':
                    e.preventDefault();
                    if (this.movePiece(-1, 0)) {
                        this.playSound(220, 0.1);
                    }
                    break;
                case 'ArrowRight':
                    e.preventDefault();
                    if (this.movePiece(1, 0)) {
                        this.playSound(220, 0.1);
                    }
                    break;
                case 'ArrowDown':
                    e.preventDefault();
                    if (this.movePiece(0, 1)) {
                        this.playSound(110, 0.1);
                    }
                    break;
                case 'ArrowUp':
                    e.preventDefault();
                    this.rotatePiece();
                    this.playSound(330, 0.15);
                    break;
                case ' ':
                    e.preventDefault();
                    this.hardDrop();
                    this.playSound(440, 0.2);
                    break;
                case 'r':
                case 'R':
                    e.preventDefault();
                    this.restart();
                    break;
            }
        });
        
        // Button controls with sound effects
        const buttons = this.container.querySelectorAll('.falling-blocks-btn');
        buttons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                const action = btn.dataset.action;
                
                switch(action) {
                    case 'left':
                        if (!this.gameOver && !this.paused && this.movePiece(-1, 0)) {
                            this.playSound(220, 0.1);
                        }
                        break;
                    case 'right':
                        if (!this.gameOver && !this.paused && this.movePiece(1, 0)) {
                            this.playSound(220, 0.1);
                        }
                        break;
                    case 'down':
                        if (!this.gameOver && !this.paused && this.movePiece(0, 1)) {
                            this.playSound(110, 0.1);
                        }
                        break;
                    case 'rotate':
                        if (!this.gameOver && !this.paused) {
                            this.rotatePiece();
                            this.playSound(330, 0.15);
                        }
                        break;
                    case 'drop':
                        if (!this.gameOver && !this.paused) {
                            this.hardDrop();
                            this.playSound(440, 0.2);
                        }
                        break;
                    case 'restart':
                        this.restart();
                        this.playSound(880, 0.3, 'sawtooth');
                        break;
                }
            });
        });
    }
    
    createPiece() {
        const pieces = Object.keys(this.pieces);
        const randomPiece = pieces[Math.floor(Math.random() * pieces.length)];
        
        return {
            shape: this.pieces[randomPiece],
            color: randomPiece,
            x: Math.floor((this.cols - this.pieces[randomPiece][0].length) / 2),
            y: 0,
            rotation: 0
        };
    }
    
    spawnPiece() {
        this.currentPiece = this.nextPiece;
        this.nextPiece = this.createPiece();
        
        // Check if game over
        if (this.checkCollision(this.currentPiece, 0, 0)) {
            this.gameOver = true;
            this.showGameOver();
            this.playSound(150, 1, 'sawtooth'); // Game over sound
        }
        
        this.drawNextPiece();
    }
    
    movePiece(dx, dy) {
        if (!this.checkCollision(this.currentPiece, dx, dy)) {
            this.currentPiece.x += dx;
            this.currentPiece.y += dy;
            return true;
        }
        return false;
    }
    
    rotatePiece() {
        const rotatedShape = this.rotateMatrix(this.getShape());
        const originalShape = this.currentPiece.shape;
        
        this.currentPiece.shape = [rotatedShape];
        
        if (this.checkCollision(this.currentPiece, 0, 0)) {
            // Try wall kicks
            const kicks = [[-1, 0], [1, 0], [0, -1], [-2, 0], [2, 0]];
            let kicked = false;
            
            for (let kick of kicks) {
                if (!this.checkCollision(this.currentPiece, kick[0], kick[1])) {
                    this.currentPiece.x += kick[0];
                    this.currentPiece.y += kick[1];
                    kicked = true;
                    break;
                }
            }
            
            if (!kicked) {
                this.currentPiece.shape = originalShape;
            }
        }
    }
    
    rotateMatrix(matrix) {
        const rows = matrix.length;
        const cols = matrix[0].length;
        const rotated = Array(cols).fill().map(() => Array(rows).fill(0));
        
        for (let i = 0; i < rows; i++) {
            for (let j = 0; j < cols; j++) {
                rotated[j][rows - 1 - i] = matrix[i][j];
            }
        }
        
        return rotated;
    }
    
    hardDrop() {
        let dropCount = 0;
        while (this.movePiece(0, 1)) {
            dropCount++;
        }
        this.score += dropCount * 2; // Bonus points for hard drop
        this.lockPiece();
    }
    
    checkCollision(piece, dx, dy) {
        const shape = this.getShape(piece);
        const newX = piece.x + dx;
        const newY = piece.y + dy;
        
        for (let y = 0; y < shape.length; y++) {
            for (let x = 0; x < shape[y].length; x++) {
                if (shape[y][x]) {
                    const boardX = newX + x;
                    const boardY = newY + y;
                    
                    if (boardX < 0 || boardX >= this.cols || 
                        boardY >= this.rows || 
                        (boardY >= 0 && this.board[boardY][boardX])) {
                        return true;
                    }
                }
            }
        }
        
        return false;
    }
    
    getShape(piece = this.currentPiece) {
        return piece.shape[0];
    }
    
    lockPiece() {
        const shape = this.getShape();
        
        for (let y = 0; y < shape.length; y++) {
            for (let x = 0; x < shape[y].length; x++) {
                if (shape[y][x]) {
                    const boardX = this.currentPiece.x + x;
                    const boardY = this.currentPiece.y + y;
                    
                    if (boardY >= 0) {
                        this.board[boardY][boardX] = this.currentPiece.color;
                    }
                }
            }
        }
        
        this.clearLines();
        this.spawnPiece();
    }
    
    clearLines() {
        let linesCleared = 0;
        
        for (let y = this.rows - 1; y >= 0; y--) {
            if (this.board[y].every(cell => cell !== 0)) {
                this.board.splice(y, 1);
                this.board.unshift(Array(this.cols).fill(0));
                linesCleared++;
                y++; // Check this line again
            }
        }
        
        if (linesCleared > 0) {
            this.lines += linesCleared;
            
            // 8-bit scoring system
            const baseScore = [0, 100, 300, 500, 800][linesCleared];
            this.score += baseScore * this.level;
            
            this.level = Math.floor(this.lines / 10) + 1;
            this.dropInterval = Math.max(100, 800 - (this.level - 1) * 50);
            this.updateScore();
            
            // Line clear sound effect
            if (linesCleared === 1) {
                this.playSound(523, 0.3); // C5
            } else if (linesCleared === 2) {
                this.playSound(659, 0.3); // E5
            } else if (linesCleared === 3) {
                this.playSound(784, 0.3); // G5
            } else if (linesCleared === 4) {
                // Special sound
                this.playSound(1047, 0.5, 'sawtooth'); // C6
            }
        }
    }
    
    updateScore() {
        const scoreEl = this.container.querySelector('#falling-blocks-score');
        const levelEl = this.container.querySelector('#falling-blocks-level');
        const linesEl = this.container.querySelector('#falling-blocks-lines');
        
        if (scoreEl) scoreEl.textContent = this.score.toLocaleString();
        if (levelEl) levelEl.textContent = this.level;
        if (linesEl) linesEl.textContent = this.lines;
    }
    
    showGameOver() {
        const gameOverEl = this.container.querySelector('.falling-blocks-over');
        const finalScoreEl = this.container.querySelector('#final-score');
        
        if (gameOverEl) {
            gameOverEl.style.display = 'flex';
        }
        
        if (finalScoreEl) {
            finalScoreEl.textContent = this.score.toLocaleString();
        }
    }
    
    restart() {
        this.gameOver = false;
        this.paused = false;
        this.score = 0;
        this.level = 1;
        this.lines = 0;
        this.dropInterval = 800;
        this.createBoard();
        this.nextPiece = this.createPiece();
        this.spawnPiece();
        this.updateScore();
        
        const gameOverEl = this.container.querySelector('.falling-blocks-over');
        if (gameOverEl) {
            gameOverEl.style.display = 'none';
        }
    }
    
    gameLoop() {
        const now = Date.now();
        
        if (!this.gameOver && !this.paused) {
            if (now - this.dropTime > this.dropInterval) {
                if (!this.movePiece(0, 1)) {
                    this.lockPiece();
                }
                this.dropTime = now;
            }
        }
        
        this.draw();
        requestAnimationFrame(() => this.gameLoop());
    }
    
    draw() {
        // Clear canvas with pure black
        this.ctx.fillStyle = '#000000';
        this.ctx.fillRect(0, 0, this.width, this.height);
        
        // Draw board with 8-bit style blocks
        for (let y = 0; y < this.rows; y++) {
            for (let x = 0; x < this.cols; x++) {
                if (this.board[y][x]) {
                    this.draw8BitBlock(x, y, this.colors[this.board[y][x]]);
                }
            }
        }
        
        // Draw current piece
        if (this.currentPiece && !this.gameOver) {
            const shape = this.getShape();
            for (let y = 0; y < shape.length; y++) {
                for (let x = 0; x < shape[y].length; x++) {
                    if (shape[y][x]) {
                        this.draw8BitBlock(
                            this.currentPiece.x + x, 
                            this.currentPiece.y + y, 
                            this.colors[this.currentPiece.color]
                        );
                    }
                }
            }
        }
        
        // Draw 8-bit style grid
        this.draw8BitGrid();
    }
    
    draw8BitBlock(x, y, color) {
        const pixelX = x * this.blockSize;
        const pixelY = y * this.blockSize;
        const size = this.blockSize;
        
        // Main block color
        this.ctx.fillStyle = color;
        this.ctx.fillRect(pixelX, pixelY, size, size);
        
        // 8-bit style highlighting - lighter edge on top and left
        this.ctx.fillStyle = this.lightenColor(color, 40);
        this.ctx.fillRect(pixelX, pixelY, size, 3); // Top highlight
        this.ctx.fillRect(pixelX, pixelY, 3, size); // Left highlight
        
        // Darker edge on bottom and right for depth
        this.ctx.fillStyle = this.darkenColor(color, 40);
        this.ctx.fillRect(pixelX, pixelY + size - 3, size, 3); // Bottom shadow
        this.ctx.fillRect(pixelX + size - 3, pixelY, 3, size); // Right shadow
        
        // Crisp black border
        this.ctx.strokeStyle = '#000000';
        this.ctx.lineWidth = 1;
        this.ctx.strokeRect(pixelX + 0.5, pixelY + 0.5, size - 1, size - 1);
    }
    
    draw8BitGrid() {
        this.ctx.strokeStyle = '#333333';
        this.ctx.lineWidth = 1;
        
        // Vertical lines
        for (let x = 0; x <= this.cols; x++) {
            this.ctx.beginPath();
            this.ctx.moveTo(x * this.blockSize + 0.5, 0);
            this.ctx.lineTo(x * this.blockSize + 0.5, this.height);
            this.ctx.stroke();
        }
        
        // Horizontal lines
        for (let y = 0; y <= this.rows; y++) {
            this.ctx.beginPath();
            this.ctx.moveTo(0, y * this.blockSize + 0.5);
            this.ctx.lineTo(this.width, y * this.blockSize + 0.5);
            this.ctx.stroke();
        }
    }
    
    drawNextPiece() {
        if (!this.nextPiece) return;
        
        // Clear next piece canvas
        this.nextCtx.fillStyle = '#000000';
        this.nextCtx.fillRect(0, 0, 80, 80);
        
        const shape = this.nextPiece.shape[0];
        const blockSize = 15;
        const offsetX = (80 - shape[0].length * blockSize) / 2;
        const offsetY = (80 - shape.length * blockSize) / 2;
        
        for (let y = 0; y < shape.length; y++) {
            for (let x = 0; x < shape[y].length; x++) {
                if (shape[y][x]) {
                    const pixelX = offsetX + x * blockSize;
                    const pixelY = offsetY + y * blockSize;
                    const color = this.colors[this.nextPiece.color];
                    
                    // Main block
                    this.nextCtx.fillStyle = color;
                    this.nextCtx.fillRect(pixelX, pixelY, blockSize, blockSize);
                    
                    // 8-bit highlighting
                    this.nextCtx.fillStyle = this.lightenColor(color, 40);
                    this.nextCtx.fillRect(pixelX, pixelY, blockSize, 2);
                    this.nextCtx.fillRect(pixelX, pixelY, 2, blockSize);
                    
                    this.nextCtx.fillStyle = this.darkenColor(color, 40);
                    this.nextCtx.fillRect(pixelX, pixelY + blockSize - 2, blockSize, 2);
                    this.nextCtx.fillRect(pixelX + blockSize - 2, pixelY, 2, blockSize);
                    
                    // Border
                    this.nextCtx.strokeStyle = '#000000';
                    this.nextCtx.lineWidth = 1;
                    this.nextCtx.strokeRect(pixelX + 0.5, pixelY + 0.5, blockSize - 1, blockSize - 1);
                }
            }
        }
    }
    
    // Utility functions for 8-bit color manipulation
    lightenColor(color, percent) {
        const num = parseInt(color.replace('#', ''), 16);
        const amt = Math.round(2.55 * percent);
        const R = (num >> 16) + amt;
        const G = (num >> 8 & 0x00FF) + amt;
        const B = (num & 0x0000FF) + amt;
        return '#' + (0x1000000 + (R < 255 ? R < 1 ? 0 : R : 255) * 0x10000 +
            (G < 255 ? G < 1 ? 0 : G : 255) * 0x100 +
            (B < 255 ? B < 1 ? 0 : B : 255)).toString(16).slice(1);
    }
    
    darkenColor(color, percent) {
        const num = parseInt(color.replace('#', ''), 16);
        const amt = Math.round(2.55 * percent);
        const R = (num >> 16) - amt;
        const G = (num >> 8 & 0x00FF) - amt;
        const B = (num & 0x0000FF) - amt;
        return '#' + (0x1000000 + (R > 255 ? 255 : R < 0 ? 0 : R) * 0x10000 +
            (G > 255 ? 255 : G < 0 ? 0 : G) * 0x100 +
            (B > 255 ? 255 : B < 0 ? 0 : B)).toString(16).slice(1);
    }
}