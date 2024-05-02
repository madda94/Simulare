import { Ship, Fregata } from './ship.js';
import { Background } from './scrollingBackground.js';
import { btnsScenarii } from './script.js';
import { Explosion } from './explosions.js';

export class Simulare {
	constructor(width, height) {
		this.width = width;
		this.height = height;
		this.speed = 0;
		this.background = new Background(this);
		this.ships = [new Ship(this), new Ship(this), new Fregata(this)];
		this.fireParticles = [];
		this.smokeParticles = [];
		this.shipFireParticles = [];
		this.explosions = [];
		this.timeForFregata = false;
		this.fregataArcCollision = false;
		this.fps = 20;
		this.zoomInterval = 1000 / this.fps;
		this.zoomTime = 0;
		this.scenariu1Time = false;
		this.scenariu2Time = false;
		this.zoomedIn = false;
		this.explosionCount = 0;
		this.maxExplosions = 10;
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
		this.fireParticles.forEach((particle) => {
			particle.draw(context);
		});
		this.smokeParticles.forEach((particle) => {
			particle.draw(context);
		});
	}
	controlAfterFirstCollision(context) {
		if (this.ships[0].collisionLine <= 0) {
			this.background.moving = true;
			this.ships[0].approachLine.movingBack();
			this.x += 0.5;
			this.shipFireParticles.forEach((fire) => {
				fire.x += fire.speedX + this.ships[0].moveX;
				fire.update();
				fire.draw(context);
			});
			if (!this.fregataArcCollision)
				this.ships[0].missiles.forEach((missile) => {
					missile.draw(context);
					missile.update();
				});
			else if (this.fregataArcCollision)
				this.ships[0].missiles.forEach((missile) => {
					missile.draw(context);
				});
			this.shipFireParticles.forEach((particle) => {
				particle.draw(context);
			});
		}
	}
	update(context) {
		if (!this.ships[2].isDrawn) this.background.update();
		if (!this.ships[0].markedForDeletion) this.ships[0].controlNpr(context);
		this.controlAfterFirstCollision(context);
		// handle missile reaction
		this.fireParticles.forEach((particle) => {
			particle.update();
		});
		this.smokeParticles.forEach((particle) => {
			particle.update();
		});
		this.shipFireParticles.forEach((particle) => {
			particle.update();
		});
		this.fireParticles = this.fireParticles.filter(
			(particle) => !particle.markedForDeletion
		);
		this.smokeParticles = this.smokeParticles.filter(
			(particle) => !particle.markedForDeletion
		);
		this.shipFireParticles = this.shipFireParticles.filter(
			(particle) => !particle.markedForDeletion
		);
		this.explosions.forEach((explosion) => {
			explosion.update(context);
			explosion.draw(context);
		});
		this.explosions = this.explosions.filter(
			(explosion) => !explosion.markedForDeletion
		);
		if (this.ships[2].isDrawn)
			this.checkFregataLineCollision(context, this.ships[0].missiles);
		this.ships[2].radar.update();
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
				if (this.explosionCount < this.maxExplosions) {
					this.explosions.unshift(new Explosion(this, 500, 200));
					this.explosionCount++;
				}
			}
		});
	}

	zoomIn(context) {
		this.background.marks.markDistance *= 1.2;
		this.ships[2].radius *= 1.045;
		this.ships[2].width *= 1.04;
		this.ships[2].y /= 1.1;
		this.ships[2].height *= 1.04;
		this.ships[2].draw(context);
		this.ships[2].radar.draw(context);
		this.ships[0].missiles.forEach((missile) => {
			missile.x *= 1.042;
			missile.y /= 1.2;
			missile.width *= 1.02;
			missile.height *= 1.02;
			missile.draw(context);
		});
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

		if (!this.ships[2].fireAK630.fireStop)
			this.ships[2].fireAK630.update(context);

		requestAnimationFrame(() => this.scenariu1(context));
	}

	animate(context) {
		this.draw(context);
		this.update(context);
		requestAnimationFrame(() => this.animate(context));
	}
}
