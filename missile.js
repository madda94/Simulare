import {
	Fire,
	Dust,
	SmokeAK726,
	Cloud0,
	Cloud1,
	Cloud2,
	Cloud3,
	Cloud4,
	Cloud5,
} from './missileReaction.js';
import { Explosion } from './explosions.js';

class Missile {
	constructor(simulare) {
		this.simulare = simulare;
		this.totalWidth = this.simulare.width;
		this.totalHeight = this.simulare.height;
		this.spriteWidth = 300;
		this.spriteHeight = 300;
		this.width = this.spriteWidth / 4;
		this.height = this.spriteHeight / 4;
		this.x = this.totalWidth / 2.7;
		this.zoomedWidth = this.width * 1.22;
		this.zoomedHeight = this.width * 1.22;
		this.speedX = this.simulare.speed * 10;
		this.speedY = this.simulare.speed * 10;
		this.frame = 1;
		this.frameTime = 0;
		this.frameInterval = 10000;
		this.moveDown = false;
		this.updatedPosition = false;
		this.radius = this.width / 2;
		this.explosions = [new Explosion(this)];
		this.markedForDeletion = false;
		this.deviat = false;
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
	drawZoomed(context) {
		context.drawImage(
			this.image,
			this.frame * this.spriteWidth,
			0,
			this.spriteWidth,
			this.spriteHeight,
			this.zoomedX,
			this.zoomedY,
			this.zoomedWidth,
			this.zoomedHeight
		);
	}
	drawAfterDeviation(context) {
		context.save();
		context.translate(this.x + this.width / 2, this.y + this.height / 2);
		context.rotate(-Math.PI / 6.5);
		context.translate(-this.width / 2, -this.height / 2);
		context.drawImage(
			this.image,
			this.frame * this.spriteWidth,
			0,
			this.spriteWidth,
			this.spriteHeight,
			0,
			0,
			this.width,
			this.height
		);
		context.restore();
	}
	update() {
		if (!this.moveDown) {
			this.x -= this.speedX;
			this.y -= this.speedY;
			this.createFireReaction();
		} else if (this.moveDown) {
			this.speedX = this.simulare.speed * 3;
			this.speedY = this.simulare.speed * 1.5;
			this.x -= this.speedX;
			this.y += this.speedY;
		}
	}
	updateZoomed() {
		if (this.moveDown) {
			this.speedX = this.simulare.speed;
			this.speedY = this.simulare.speed * 0.4;
			this.zoomedX -= this.speedX;
			this.zoomedY += this.speedY;
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
		this.simulare.fireParticles.unshift(
			new Fire(
				this.simulare,
				this.x + this.width * 0.9,
				this.y + this.height * 0.6
			)
		);
	}
	createExplosion(context, timestamp) {
		this.explosions = this.explosions.filter(
			(explosion) => !explosion.markedForDeletion
		);
		if (this.explosions.length !== 0)
			this.explosions.animate(context, timestamp);
	}
}

export class MissileP21 extends Missile {
	constructor(simulare) {
		super(simulare);
		this.y = this.totalHeight - this.height - 90;
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
		this.zoomedX = this.x * 1.63;
	}
	updatePosition() {
		super.updatePosition();
		this.image = p22Down;
		this.x = this.totalWidth - 3.5 * this.width;
	}
}

export class FireAK630 {
	constructor(simulare) {
		this.simulare = simulare;
		this.totalWidth = this.simulare.width;
		this.totalHeight = this.simulare.height;
		this.spriteWidth = 238;
		this.spriteHeight = 260;
		this.width = this.spriteWidth / 5;
		this.height = this.spriteHeight / 5;
		this.x = this.simulare.width / 5.8;
		this.y = this.simulare.height / 2.2;
		this.image = ak630img;
		this.fireCount = 0;
		this.maxFire = 40;
		this.fireInterval = 30;
		this.fireTime = 0;
		this.fireStop = this.fireCount > this.maxFire ? true : false;
	}
	draw(context) {
		context.drawImage(this.image, this.x, this.y, this.width, this.height);
	}
	update(context) {
		if (this.fireTime < this.fireInterval) this.fireTime++;
		else {
			this.draw(context);
			this.createSmokeReaction();
			this.fireCount++;
			this.fireTime = 0;
		}
		if (this.fireCount > this.maxFire) this.fireStop = true;
	}
	createSmokeReaction() {
		for (let i = 0; i < 15; i++) {
			this.simulare.smokeParticles.unshift(new Dust(this.simulare));
		}
	}
}
export class FireAK726 {
	constructor(simulare) {
		this.simulare = simulare;
		this.totalWidth = this.simulare.width;
		this.totalHeight = this.simulare.height;
		this.spriteWidth = 185;
		this.spriteHeight = 170;
		this.width = this.spriteWidth / 2.5;
		this.height = this.spriteHeight / 2.5;
		this.x = this.simulare.width / 9;
		this.y = this.simulare.height / 2.1;
		this.moveX = this.x;
		this.moveY = this.y;
		this.speedX = this.simulare.speed * 5;
		this.speedY = this.simulare.speed * 2.5;
		this.image = ak726img;
		this.fireCount = 0;
		this.maxFire = 7;
		this.fireInterval = 100;
		this.fireTime = 0;
		this.fireStop = this.fireCount > this.maxFire ? true : false;
	}
	draw(context) {
		this.createSmokeReaction();
		context.drawImage(
			this.image,
			0,
			0,
			this.spriteWidth,
			this.spriteHeight,
			this.moveX,
			this.moveY,
			this.width,
			this.height
		);
	}
	update(context) {
		if (this.fireTime < this.fireInterval) {
			if (this.moveX <= this.x + 250) {
				this.moveX += this.speedX;
				this.moveY -= this.speedY;
				this.draw(context);
			}
			this.fireTime++;
		} else {
			this.moveX = this.x;
			this.moveY = this.y;
			this.draw(context);
			this.fireCount++;
			this.fireTime = 0;
		}
		if (this.fireCount > this.maxFire) this.fireStop = true;
	}
	createSmokeReaction() {
		this.simulare.smokeParticlesAK726.unshift(
			new SmokeAK726(
				this.simulare,
				this.moveX + this.width,
				this.moveY + this.height / 2
			)
		);
	}
}

export class Radar {
	constructor(simulare) {
		this.simulare = simulare;
		this.image = radar;
		this.spriteWidth = 129.4;
		this.spriteHeight = 96.25;
		this.width = this.spriteWidth / 2.2;
		this.height = this.spriteHeight / 2.2;
		this.frameX = 0;
		this.maxFrameX = 4;
		this.maxFrameY = 3;
		this.frameY = 0;
		this.frameCount = 0;
		this.frameInterval = 15;
		this.x = this.simulare.width / 7.2;
		this.y = this.simulare.height / 2.35;
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

class FirePK16 {
	constructor(simulare, x, y) {
		this.simulare = simulare;
		this.totalWidth = this.simulare.width;
		this.totalHeight = this.simulare.height;
		this.x = x;
		this.width = 10;
		this.height = 30;
		this.y = y;
		this.moveX = this.x;
		this.moveY = this.y;
		this.color = 'black';
		this.hasAppeared = false; // Add a flag to track if the fire particle has appeared
		this.cloudCreated = false; // Add a flag to track if the cloud has been created
	}
	draw(context) {
		context.save();
		context.beginPath();
		context.translate(
			this.moveX + this.width / 2,
			this.moveY + this.height / 2
		);
		context.rotate(this.rotationGrade);
		context.translate(-this.width / 2, -this.height / 2);
		context.fillStyle = this.color;
		context.roundRect(0, 0, this.width, this.height, [0, 0, 5, 5]);
		context.fill();
		context.restore();
	}

	update(context) {
		this.fireTime++;
		if (this.fireTime >= this.delay) {
			// delay has elapsed, update the particle
			if (!this.hasAppeared) {
				this.draw(context);
				if (this.moveX <= this.x + 350) {
					this.moveX += this.speedX;
					this.moveY -= this.speedY;
					this.draw(context);
				} else {
					this.createCloud(this.moveX + 20, this.moveY + 20);
					this.cloudCreated = true;
					this.hasAppeared = true;
				}
			} else if (this.cloudCreated && this.simulare.cloud[this.numberCloud]) {
				this.simulare.cloud[this.numberCloud].draw(context);
			}
		}
	}
}

export class FirePK16_1 extends FirePK16 {
	constructor(simulare, x, y) {
		super(simulare, x, y);
		// modificare orientare linie (rotire mai spre sus sau spre jos)
		this.rotationGrade = -Math.PI / 1.65;
		this.numberCloud = 0;
		this.delay = 50; // delay in milliseconds (1 second)
		this.fireTime = 0;
		// modificare directie si viteza
		this.speedX = this.simulare.speed * 3;
		this.speedY = this.simulare.speed * 1.5;
	}
	createCloud(x, y) {
		this.simulare.cloud.unshift(new Cloud0(this.simulare, x, y));
	}
}
export class FirePK16_2 extends FirePK16 {
	constructor(simulare, x, y) {
		super(simulare, x, y);
		// modificare orientare linie (rotire mai spre sus sau spre jos)
		this.rotationGrade = -Math.PI / 1.4;
		this.numberCloud = 1;
		this.delay = 100; // delay in milliseconds (1 second)
		this.fireTime = 0;
		// modificare directie si viteza
		this.speedX = this.simulare.speed * 3;
		this.speedY = this.simulare.speed;
	}
	createCloud(x, y) {
		this.simulare.cloud.unshift(new Cloud1(this.simulare, x, y));
	}
}
export class FirePK16_3 extends FirePK16 {
	constructor(simulare, x, y) {
		super(simulare, x, y);
		// modificare orientare linie (rotire mai spre sus sau spre jos)
		this.rotationGrade = -Math.PI / 1.2;
		this.numberCloud = 2;
		this.delay = 150; // delay in milliseconds (1 second)
		this.fireTime = 0;
		// modificare directie si viteza
		this.speedX = this.simulare.speed * 2;
		this.speedY = this.simulare.speed * 0.5;
	}
	createCloud(x, y) {
		this.simulare.cloud.unshift(new Cloud2(this.simulare, x, y));
	}
}
export class FirePK16_4 extends FirePK16 {
	constructor(simulare, x, y) {
		super(simulare, x, y);
		// modificare orientare linie (rotire mai spre sus sau spre jos)
		this.rotationGrade = -Math.PI / 1.85;
		this.numberCloud = 3;
		this.delay = 200; // delay in milliseconds (1 second)
		this.fireTime = 0;
		// modificare directie si viteza
		this.speedX = this.simulare.speed * 4;
		this.speedY = this.simulare.speed * 2;
	}
	createCloud(x, y) {
		this.simulare.cloud.unshift(new Cloud3(this.simulare, x, y));
	}
}
export class FirePK16_5 extends FirePK16 {
	constructor(simulare, x, y) {
		super(simulare, x, y);
		// modificare orientare linie (rotire mai spre sus sau spre jos)
		this.rotationGrade = -Math.PI / 2.1;
		this.numberCloud = 4;
		this.delay = 250; // delay in milliseconds (1 second)
		this.fireTime = 0;
		// modificare directie si viteza
		this.speedX = this.simulare.speed * 5;
		this.speedY = this.simulare.speed * 2;
	}
	createCloud(x, y) {
		this.simulare.cloud.unshift(new Cloud4(this.simulare, x, y));
	}
}
export class FirePK16_6 extends FirePK16 {
	constructor(simulare, x, y) {
		super(simulare, x, y);
		// modificare orientare linie (rotire mai spre sus sau spre jos)
		this.rotationGrade = -Math.PI / 2.3;
		this.numberCloud = 5;
		this.delay = 300; // delay in milliseconds (1 second)
		this.fireTime = 0;
		// modificare directie si viteza
		this.speedX = this.simulare.speed * 4;
		this.speedY = this.simulare.speed * 2.5;
	}
	createCloud(x, y) {
		this.simulare.cloud.unshift(new Cloud5(this.simulare, x, y));
		// cloud.draw(context);
	}
}
