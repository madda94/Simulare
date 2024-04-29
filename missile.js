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
		this.frameInterval = 2000;
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
		this.spriteWidth = 353.5;
		this.spriteHeight = 353;
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
