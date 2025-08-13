class DungeonCrawler {
    constructor() {
        this.canvas = document.getElementById('gameCanvas');
        this.ctx = this.canvas.getContext('2d');
        this.canvas.width = 800;
        this.canvas.height = 600;
        
        this.tileSize = 32;
        this.map = this.createMap();
        this.player = {
            x: this.tileSize * 1,
            y: this.tileSize * 1,
            width: this.tileSize,
            height: this.tileSize,
            health: 100,
            speed: 4,
            attackCooldown: 0,
            attackPower: 10
        };
        
        // Initialize enemies
        this.enemies = this.createEnemies();
        this.score = 0;
        this.level = 1;
        
        this.keys = {};
        this.setupEventListeners();
        this.updateScore(0);
        this.updateLevel(1);
    }

    createMap() {
        // More complex dungeon layout with rooms and corridors
        return [
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 0],
            [0, 1, 0, 0, 0, 1, 0, 1, 0, 0, 0, 0, 0, 1, 0],
            [0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 1, 1, 0, 1, 0],
            [0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0],
            [0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0],
            [0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0],
            [0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0],
            [0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0],
            [0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0],
            [0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0],
            [0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0],
            [0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0],
            [0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0],
            [0, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
        ];
    }

    setupEventListeners() {
        document.addEventListener('keydown', (e) => {
            this.keys[e.key] = true;
        });
        
        document.addEventListener('keyup', (e) => {
            this.keys[e.key] = false;
        });
    }

    updateScore(score) {
        document.getElementById('score').textContent = `Score: ${score}`;
    }

    updateLevel(level) {
        document.getElementById('level').textContent = `Level: ${level}`;
    }

    updateHealth(health) {
        this.player.health = health;
        const healthFill = document.querySelector('.health-fill');
        healthFill.style.width = `${health}%`;
    }

    drawMap() {
        this.ctx.fillStyle = '#000';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        for (let y = 0; y < this.map.length; y++) {
            for (let x = 0; x < this.map[y].length; x++) {
                if (this.map[y][x] === 0) {
                    // Draw walls with a more dungeon-like appearance
                    this.ctx.fillStyle = '#444';
                    this.ctx.fillRect(
                        x * this.tileSize,
                        y * this.tileSize,
                        this.tileSize,
                        this.tileSize
                    );
                    
                    // Add wall texture (cracks and lines)
                    this.ctx.fillStyle = '#666';
                    this.ctx.fillRect(
                        x * this.tileSize + 2,
                        y * this.tileSize + 2,
                        this.tileSize - 4,
                        this.tileSize - 4
                    );
                    
                    // Add vertical lines
                    this.ctx.fillStyle = '#333';
                    this.ctx.fillRect(
                        x * this.tileSize + 8,
                        y * this.tileSize + 4,
                        1,
                        this.tileSize - 8
                    );
                    this.ctx.fillRect(
                        x * this.tileSize + 24,
                        y * this.tileSize + 4,
                        1,
                        this.tileSize - 8
                    );
                } else {
                    // Draw floor tiles with a gradient effect
                    const gradient = this.ctx.createLinearGradient(
                        x * this.tileSize,
                        y * this.tileSize,
                        x * this.tileSize + this.tileSize,
                        y * this.tileSize + this.tileSize
                    );
                    gradient.addColorStop(0, '#555');
                    gradient.addColorStop(0.5, '#666');
                    gradient.addColorStop(1, '#777');
                    
                    this.ctx.fillStyle = gradient;
                    this.ctx.fillRect(
                        x * this.tileSize,
                        y * this.tileSize,
                        this.tileSize,
                        this.tileSize
                    );
                    
                    // Add floor texture (small dots)
                    this.ctx.fillStyle = '#888';
                    for (let i = 0; i < 3; i++) {
                        for (let j = 0; j < 3; j++) {
                            this.ctx.fillRect(
                                x * this.tileSize + 4 + (i * 8),
                                y * this.tileSize + 4 + (j * 8),
                                2,
                                2
                            );
                        }
                    }
                }
            }
        }
    }

    drawEnemies() {
        this.enemies.forEach(enemy => {
            if (enemy.health > 0) {
                // Draw enemy
                this.ctx.fillStyle = '#ff0000';
                this.ctx.fillRect(
                    enemy.x + 4,
                    enemy.y + 4,
                    enemy.width - 8,
                    enemy.height - 8
                );
                
                // Draw enemy health bar
                this.ctx.fillStyle = '#ff0000';
                this.ctx.fillRect(
                    enemy.x + 4,
                    enemy.y + 2,
                    (enemy.width - 8) * (enemy.health / 100),
                    2
                );
            }
        });
    }

    drawUI() {
        // Draw health bar
        this.ctx.fillStyle = '#333';
        this.ctx.fillRect(10, 10, 200, 20);
        this.ctx.fillStyle = '#ff0000';
        this.ctx.fillRect(10, 10, (200 * this.player.health / 100), 20);
        
        // Draw score
        this.ctx.fillStyle = '#fff';
        this.ctx.font = '16px Arial';
        this.ctx.fillText(`Score: ${this.score}`, 10, 40);
        
        // Draw level
        this.ctx.fillText(`Level: ${this.level}`, 10, 60);
    }

    drawPlayer() {
        // Draw player character
        this.ctx.fillStyle = '#00ff00';
        this.ctx.fillRect(
            this.player.x + 4,
            this.player.y + 4,
            this.player.width - 8,
            this.player.height - 8
        );
        
        // Draw player's sword with a better animation
        this.ctx.fillStyle = '#fff';
        this.ctx.fillRect(
            this.player.x + 8,
            this.player.y + 12,
            4,
            8
        );
        
        // Draw player's shield
        this.ctx.fillStyle = '#000';
        this.ctx.beginPath();
        this.ctx.arc(
            this.player.x + 12,
            this.player.y + 12,
            4,
            0,
            Math.PI * 2
        );
        this.ctx.fill();
        
        // Add player's health bar
        this.ctx.fillStyle = '#ff0000';
        this.ctx.fillRect(
            this.player.x + 4,
            this.player.y + 2,
            (this.player.width - 8) * (this.player.health / 100),
            2
        );
    }

    createEnemies() {
        return [
            { x: 3 * this.tileSize, y: 3 * this.tileSize, width: this.tileSize, height: this.tileSize, health: 50 },
            { x: 5 * this.tileSize, y: 7 * this.tileSize, width: this.tileSize, height: this.tileSize, health: 50 },
            { x: 9 * this.tileSize, y: 5 * this.tileSize, width: this.tileSize, height: this.tileSize, health: 50 }
        ];
    }

    handlePlayerAttack() {
        const playerX = Math.floor(this.player.x / this.tileSize);
        const playerY = Math.floor(this.player.y / this.tileSize);
        
        // Check all directions (up, down, left, right)
        const directions = [
            { x: playerX, y: playerY - 1 },
            { x: playerX, y: playerY + 1 },
            { x: playerX - 1, y: playerY },
            { x: playerX + 1, y: playerY }
        ];

        directions.forEach(dir => {
            this.enemies.forEach(enemy => {
                const enemyX = Math.floor(enemy.x / this.tileSize);
                const enemyY = Math.floor(enemy.y / this.tileSize);
                
                if (enemy.health > 0 && enemyX === dir.x && enemyY === dir.y) {
                    enemy.health -= this.player.attackPower;
                    if (enemy.health <= 0) {
                        // Enemy defeated
                        this.score += 50;
                        this.updateScore(this.score);
                    }
                }
            });
        });
    }

    update() {
        // Handle movement
        const playerX = Math.floor(this.player.x / this.tileSize);
        const playerY = Math.floor(this.player.y / this.tileSize);

        // Handle player attacks
        if (this.keys[' '] && this.player.attackCooldown <= 0) {
            this.player.attackCooldown = 30;
            this.handlePlayerAttack();
        }
        if (this.player.attackCooldown > 0) {
            this.player.attackCooldown--;
        }

        if (this.keys['ArrowUp'] || this.keys['w']) {
            const newY = playerY - 1;
            if (this.map[newY] && this.map[newY][playerX] === 1) {
                this.player.y -= this.player.speed;
            }
        }
        if (this.keys['ArrowDown'] || this.keys['s']) {
            const newY = playerY + 1;
            if (this.map[newY] && this.map[newY][playerX] === 1) {
                this.player.y += this.player.speed;
            }
        }
        if (this.keys['ArrowLeft'] || this.keys['a']) {
            const newX = playerX - 1;
            if (this.map[playerY] && this.map[playerY][newX] === 1) {
                this.player.x -= this.player.speed;
            }
        }
        if (this.keys['ArrowRight'] || this.keys['d']) {
            const newX = playerX + 1;
            if (this.map[playerY] && this.map[playerY][newX] === 1) {
                this.player.x += this.player.speed;
            }
        }

        // Check for collision with walls
        const tileX = Math.floor(this.player.x / this.tileSize);
        const tileY = Math.floor(this.player.y / this.tileSize);
        if (this.map[tileY] && this.map[tileY][tileX] === 0) {
            // Reset to previous position
            this.player.x = Math.floor(this.player.x / this.tileSize) * this.tileSize;
            this.player.y = Math.floor(this.player.y / this.tileSize) * this.tileSize;
        }

        // Check for win condition (reach bottom right corner)
        const exitX = this.map[0].length - 2;
        const exitY = this.map.length - 2;
        if (tileX === exitX && tileY === exitY) {
            alert('Congratulations! You found the exit!');
            this.player.x = 1;
            this.player.y = 1;
            this.updateHealth(100);
            this.updateScore(this.score + 100);
            this.updateLevel(this.level + 1);
        }

        // Check for lose condition (all enemies defeated)
        const enemiesAlive = this.enemies.some(enemy => enemy.health > 0);
        if (!enemiesAlive) {
            alert('All enemies defeated! You win!');
            this.player.x = 1;
            this.player.y = 1;
            this.updateHealth(100);
            this.updateScore(this.score + 200);
            this.updateLevel(this.level + 1);
            this.enemies = this.createEnemies(); // Reset enemies
        }
    }

    gameLoop() {
        // Update state and render a frame
        this.update();
        this.drawMap();
        this.drawEnemies();
        this.drawPlayer();
        this.drawUI();
        requestAnimationFrame(() => this.gameLoop());
    }
}

// Initialize game
const game = new DungeonCrawler();
game.gameLoop();
