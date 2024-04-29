import { Ship, Fregata } from './ship.js';
import { Background } from './scrollingBackground.js';
import { btnsScenarii } from './script.js';

export class Simulare {
	constructor(width, height) {
		this.width = width;
		this.height = height;
		this.speed = 0;
		this.background = new Background(this);
		this.ships = [new Ship(this), new Ship(this), new Fregata(this)];
		this.particles = [];
		this.timeForFregata = false;
		this.fregataArcCollision = false;
		this.fps = 20;
		this.zoomTime = 0;
		this.zoomInterval = 1000 / this.fps;
		this.scenariu1Time = false;
		this.scenariu2Time = false;
	}
	draw(context) {
		context.clearRect(0, 0, this.width, this.height);
		this.background.draw(context);
		this.background.marks.draw(context);
		if (!this.ships[0].markedForDeletion) this.ships[0].draw(context);
		if (this.ships[0].collisionLine <= -100) this.ships[1].draw(context);
		if (this.ships[0].markedForDeletion) {
			this.ships[2].draw(context);
			setTimeout(() => {
				this.ships[0].updateMissilesPosition();
			}, 100);
			this.background.marks.stop = true;
		}
		this.particles.forEach((particle) => {
			particle.draw(context);
		});
	}
	controlAfterFirstCollision(context) {
		if (this.ships[0].collisionLine <= 0) {
			this.background.moving = true;
			this.ships[0].approachLine.movingBack();
			this.x += 0.5;
			if (!this.fregataArcCollision)
				this.ships[0].missiles.forEach((missile) => {
					missile.draw(context);
					missile.update();
				});
			else if (this.fregataArcCollision)
				this.ships[0].missiles.forEach((missile) => {
					missile.draw(context);
				});
		}
	}
	update(context) {
		if (!this.ships[2].isDrawn) this.background.update();
		if (!this.ships[0].markedForDeletion) this.ships[0].controlNpr(context);
		this.controlAfterFirstCollision(context);
		// handle missile reaction
		this.particles.forEach((particle, index) => {
			particle.update();
		});
		this.particles = this.particles.filter(
			(particle) => !particle.markedForDeletion
		);
		if (this.ships[2].isDrawn)
			this.checkFregataLineCollision(context, this.ships[0].missiles);
	}
	initialDisplayS1(context) {
		this.background.draw(context);
		this.ships[1].initialX = this.width - this.ships[1].initialWidth;
		this.ships[1].x = this.width + this.ships[1].width;

		setTimeout(() => {
			this.ships.forEach((ship) => {
				ship.initialDraw(context);
			});
		}, 100);
	}
	checkFregataLineCollision(context, missiles) {
		missiles.forEach((missile) => {
			if (this.ships[2].checkArcCollision(missile)) {
				this.fregataArcCollision = true;
				if (this.zoomTime < this.zoomInterval) {
					this.zoomIn(context);
					this.zoomTime += 5;
				}
			}
		});
	}

	zoomIn(context) {
		this.ships[2].radius *= 1.05;
		this.ships[2].width *= 1.04;
		this.ships[2].y /= 1.04;
		this.ships[2].height *= 1.04;
		this.ships[2].draw(context);
		this.ships[0].missiles.forEach((missile) => {
			missile.x *= 1.05;
			missile.y /= 1.2;
			missile.width *= 1.05;
			missile.height *= 1.05;
			missile.draw(context);
		});
		this.background.marks.markDistance *= 1.06;
		this.background.marks.draw(context);
		this.scenariu1Time = true;
		setTimeout(() => {
			btnsScenarii.style.display = 'block';
		}, 100);
	}

	scenariu1(context) {
		if (this.scenariu1Time)
			this.ships[0].missiles.forEach((missile) => {
				missile.draw(context);
				missile.speedX = 1;
				missile.speedY = 0.5;
				missile.lightHeadMissile();
				missile.update();
			});
		requestAnimationFrame(() => this.scenariu1(context));
	}

	animate(context) {
		this.draw(context);
		this.update(context);
		requestAnimationFrame(() => this.animate(context));
	}
}
