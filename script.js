class SnowflakeAnimation {
    constructor() {
        this.container = document.getElementById('snowflakes-container');
        this.startButton = document.getElementById('startButton');
        this.snowflakes = [];
        this.maxSnowflakes = 50;
        this.spawnRate = 1;
        this.maxSize = 40;
        this.minSize = 15;
        this.fallSpeed = { min: 1, max: 8 };
        this.isActive = false;
        this.animationTimer = null;
        this.spawnInterval = null;
        
        this.init();
    }

    init() {
        this.startButton.addEventListener('click', () => {
            if (this.isActive) {
                this.stopSnowfall();
            } else {
                this.startSnowfall();
            }
        });
    }

    startSnowfall() {
        if (this.isActive) return;
        
        this.isActive = true;
        this.startButton.textContent = 'стоп мне не приятно';
        this.startButton.style.background = '#00FFFF';
        
        this.animate();
        
        this.spawnInterval = setInterval(() => {
            if (this.snowflakes.length < this.maxSnowflakes) {
                this.createSnowflakeFromExisting();
            }
        }, this.spawnRate);
    }

    stopSnowfall() {
        this.isActive = false;
        this.startButton.textContent = 'Нажмиииии';
        this.startButton.style.background = '#00FFFF';
        
        if (this.spawnInterval) {
            clearInterval(this.spawnInterval);
            this.spawnInterval = null;
        }
        
        if (this.animationTimer) {
            cancelAnimationFrame(this.animationTimer);
            this.animationTimer = null;
        }
        
        this.removeAllSnowflakes();
    }

    createSnowflakeFromExisting() {
        if (!this.isActive) return;
        
        const existingSnowflakes = document.querySelectorAll('#snowflakes-container > img');
        if (existingSnowflakes.length > 0) {
            const randomIndex = Math.floor(Math.random() * existingSnowflakes.length);
            const originalImg = existingSnowflakes[randomIndex];
            const clonedImg = originalImg.cloneNode(true);
            
            this.container.appendChild(clonedImg);
            this.activateSnowflake(clonedImg);
        }
    }

    activateSnowflake(imgElement) {
        imgElement.style.display = 'block';
        
        const size = Math.random() * (this.maxSize - this.minSize) + this.minSize;
        imgElement.style.width = `${size}px`;
        imgElement.style.height = `${size}px`;
        
        const startX = Math.random() * (414 - size);
        imgElement.style.left = `${startX}px`;
        imgElement.style.top = `-${size}px`;
        
        const snowflakeData = {
            element: imgElement,
            x: startX,
            y: -size,
            size: size,
            speed: Math.random() * (this.fallSpeed.max - this.fallSpeed.min) + this.fallSpeed.min,
            rotation: 0,
            rotationSpeed: (Math.random() - 0.5) * 0.05
        };
        
        this.snowflakes.push(snowflakeData);
    }

    animate() {
        if (!this.isActive) return;
        
        this.snowflakes.forEach((snowflake, index) => {
            snowflake.y += snowflake.speed;
            snowflake.rotation += snowflake.rotationSpeed;
            
            snowflake.element.style.transform = `translate(${snowflake.x}px, ${snowflake.y}px) rotate(${snowflake.rotation}rad)`;
            
            if (snowflake.y > 896) {
                snowflake.element.remove();
                this.snowflakes.splice(index, 1);
            }
        });
        
        this.animationTimer = requestAnimationFrame(() => this.animate());
    }

    removeAllSnowflakes() {
        this.snowflakes.forEach(snowflake => {
            if (snowflake.element.parentNode) {
                snowflake.element.remove();
            }
        });
        this.snowflakes = [];
        
        const allImages = document.querySelectorAll('#snowflakes-container > img');
        const originalImages = document.querySelectorAll('#snowflakes-container > img[src="keia.jpg"]');
        
        allImages.forEach(img => {
            let isOriginal = false;
            originalImages.forEach(original => {
                if (img === original) {
                    isOriginal = true;
                }
            });
            
            if (!isOriginal && img.parentNode) {
                img.remove();
            }
        });
    }
}

window.addEventListener('load', () => {
    new SnowflakeAnimation();
});