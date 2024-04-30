import { Fire, Dust } from './missileReaction.js';

class Missile {
	constructor(simulare) {
		this.simulare = simulare;
		this.totalWidth = this.simulare.width;
		this.totalHeight = this.simulare.height;
		this.spriteWidth = 300;
		this.spriteHeight = 300;
		this.width = this.spriteWidth / 3;
		this.height = this.spriteHeight / 3;
		this.x = this.totalWidth / 2.7;
		this.speedX = 10;
		this.speedY = 10;
		this.frame = 1;
		this.frameTime = 0;
		this.frameInterval = 3000;
		this.moveDown = false;
		this.updatedPosition = false;
		this.radius = this.width / 2;
	}
	draw(context) {
		context.drawImage(
			this.image,
			this.frame * this.spriteWidth,
			0,
			this.spriteWidth,
			this.spriteHeight,
			this.x,
			this.y,
			this.width,
			this.height
		);
	}
	update() {
		if (!this.moveDown) {
			this.x -= this.speedX;
			this.y -= this.speedY;
			this.createFireReaction();
		} else if (this.moveDown) {
			this.speedX = 3;
			this.speedY = 1.4;
			this.x -= this.speedX;
			this.y += this.speedY;
		}
	}
	updatePosition() {
		this.spriteWidth = 239.5;
		this.spriteHeight = 187;
		this.moveDown = true;
		this.y = 0;
		this.updatedPosition = true;
	}
	lightHeadMissile() {
		if (this.frameTime <= this.frameInterval) this.frameTime++;
		else if (this.frameTime >= this.frameInterval) {
			this.frame === 1 ? (this.frame = 0) : (this.frame = 1);
			this.frameTime = 0;
		}

		requestAnimationFrame(() => this.lightHeadMissile());
	}

	createFireReaction() {
		this.simulare.particles.unshift(
			new Fire(
				this.simulare,
				this.x + this.width * 0.9,
				this.y + this.height * 0.6
			)
		);
	}
}

export class MissileP21 extends Missile {
	constructor(simulare) {
		super(simulare);
		this.y = this.totalHeight - this.height - 115;
		this.image = p21LightHead;
	}
	updatePosition() {
		super.updatePosition();
		this.image = p21Down;
		this.x = this.totalWidth - 2.5 * this.width;
	}
}

export class MissileP22 extends Missile {
	constructor(simulare) {
		super(simulare);
		this.y = this.totalHeight - this.height - 75;
		this.image = p22LightHead;
	}
	updatePosition() {
		super.updatePosition();
		this.image = p22Down;
		this.x = this.totalWidth - 3 * this.width;
	}
}

export class FireAK630 extends Missile {
	constructor(simulare) {
		super(simulare);
		this.x = this.simulare.width / 6.3;
		this.y = this.simulare.height / 1.8;
		this.image = fireReaction;
	}
	draw(context) {
		context.drawImage(this.image, this.x, this.y, this.width, this.height);
	}
}

export class Radar {
	constructor(simulare) {
		this.simulare = simulare;
		this.image = radar;
		this.spriteWidth = 129.4;
		this.spriteHeight = 96.25;
		this.width = this.spriteWidth / 2;
		this.height = this.spriteHeight / 2;
		this.frameX = 0;
		this.maxFrameX = 4;
		this.maxFrameY = 3;
		this.frameY = 0;
		this.frameCount = 0;
		this.frameInterval = 15;
		this.x = this.simulare.width / 7.2;
		this.y = this.simulare.height / 1.84;
	}
	draw(context) {
		context.drawImage(
			this.image,
			this.frameX * this.spriteWidth,
			this.frameY * this.spriteHeight,
			this.spriteWidth,
			this.spriteHeight,
			this.x,
			this.y,
			this.width,
			this.height
		);
	}
	update() {
		this.frameCount++;
		if (this.frameCount > this.frameInterval) {
			this.frameCount = 0;
			this.frameX++;
			if (this.frameX > this.maxFrameX) {
				this.frameX = 0;
				this.frameY++;
				if (this.frameY > this.maxFrameY) {
					this.frameY = 0;
				}
			}
		}
	}
}
