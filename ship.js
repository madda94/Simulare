import { MissileP21, MissileP22, FireAK630, Radar } from './missile.js';
import { ArcDetection, ApproachDetection } from './approachLine.js';
import { ShipFire } from './missileReaction.js';

export class Ship {
	constructor(simulare) {
		this.simulare = simulare;
		this.totalWidth = this.simulare.width;
		this.totalHeight = this.simulare.height;
		this.spriteWidth = 402;
		this.spriteHeight = 149;
		this.initialWidth = this.spriteWidth / 3;
		this.width = this.spriteWidth;
		this.initialHeight = this.spriteHeight / 3;
		this.height = this.spriteHeight;
		this.initialX = this.totalWidth - this.width;
		this.x = this.totalWidth - this.width;
		this.initialY = this.totalHeight / 2;
		this.y = this.totalHeight - 1.5 * this.height;
		this.image = nprImage;
		this.approachLine = new ApproachDetection(this.simulare);
		this.collisionLine;
		this.missiles = [
			new MissileP21(this.simulare),
			new MissileP22(this.simulare),
		];
		this.updatedPosition = false;
		this.markedForDeletion = false;
		this.timeForNpr2 = false;
		this.moveX = 0;
	}
	draw(context) {
		context.drawImage(
			this.image,
			0,
			0,
			this.spriteWidth,
			this.spriteHeight,
			this.x,
			this.y,
			this.width,
			this.height
		);
	}
	createFireReaction() {
		for (let i = 0; i < 10; i++) {
			this.simulare.shipFireParticles.unshift(
				new ShipFire(this.simulare, this)
			);
		}
	}
	update() {
		this.collisionLine = Math.trunc(this.x - this.approachLine.x + 20);
		if (this.collisionLine <= 0) {
			this.createFireReaction();
		}
		if (this.collisionLine <= -100) {
			this.x += 8;
			this.moveX = 8;
		} else {
			this.x -= 5;
			this.moveX = 5;
		}
	}
	initialDraw(context) {
		context.drawImage(
			this.image,
			0,
			0,
			this.spriteWidth,
			this.spriteHeight,
			this.initialX,
			this.initialY,
			this.initialWidth,
			this.initialHeight
		);
	}
	lineBlinking(context) {
		if (this.collisionLine <= 300) {
			this.approachLine.appearBlinking = true;
			this.approachLine.draw(context);
		} else {
			this.approachLine.appearBlinking = false;
		}
	}
	controlNpr(context) {
		this.draw(context);
		this.lineBlinking(context);
		this.update();
		if (this.x > this.totalWidth + 2.8 * this.width) {
			this.markedForDeletion = true;
			this.simulare.timeForFregata = true;
		}
	}
	updateMissilesPosition() {
		this.missiles.forEach((missile) => {
			if (!missile.updatedPosition) {
				missile.updatePosition();
			}
		});
	}
}

export class Fregata extends Ship {
	constructor(simulare) {
		super(simulare);
		this.simulare = simulare;
		this.image = fregataImage;
		this.spriteWidth = 232;
		this.spriteHeight = 348;
		this.initialWidth = this.spriteWidth / 3.5;
		this.width = this.spriteWidth / 1.4;
		this.initialHeight = this.spriteHeight / 2;
		this.height = this.spriteHeight;
		this.initialX = this.initialWidth;
		this.x = this.width / 4;
		this.initialY = this.totalHeight / 2;
		this.y = this.totalHeight / 2.4;
		this.isDrawn = false;
		this.radius = this.width * 4.25;
		this.approachLines = new ArcDetection(this.simulare);
		this.radar = new Radar(this.simulare);
		this.fireAK630 = new FireAK630(this.simulare);
	}
	draw(context) {
		super.draw(context);
		this.drawApproachLine(context, this.approachLines, this.radius);
		this.isDrawn = true;
	}
	drawApproachLine(context, line, radius) {
		line.appearBlinking = true;
		line.draw(context, radius);
	}
	checkArcCollision(missile) {
		const dx = missile.x - 0;
		const dy = missile.y - this.approachLine.y;
		const distance = Math.trunc(Math.sqrt(dx * dx + dy * dy)) + 130;
		const sumOfRadius = missile.radius + this.radius;
		return distance < sumOfRadius;
	}
	// fireCannonAK630() {
	// 	this.fireAK630.update()
	// }
}
