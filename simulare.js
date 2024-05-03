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
		this.fregataArcCollisionfirstAttack = false;
		this.fregataArcCollisionsecondAttack = false;
		this.fps = 20;
		this.zoomInterval = 1000 / this.fps;
		this.zoomTime = 0;
		this.scenariu1Time = false;
		this.scenariu2Time = false;
		this.zoomedIn = false;
		this.explosionCount = 0;
		this.maxExplosions = 10;
		this.explosionMissile = 1;
		this.explosionShip = 2;
		this.attackOver = false;
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
			if (!this.fregataArcCollisionfirstAttack)
				Object.keys(this.ships[0].missiles).forEach((key) => {
					this.ships[0].missiles[key].draw(context);
					this.ships[0].missiles[key].update();
				});
			else if (this.fregataArcCollisionfirstAttack) {
				Object.keys(this.ships[0].missiles).forEach((key) => {
					this.ships[0].missiles[key].draw(context);
				});
			}
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
			this.checkFregataLineCollisionFirst(context, this.ships[0].missiles.p22);
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
	checkFregataLineCollisionFirst(context, missile) {
		if (this.ships[2].checkArcCollision(missile)) {
			this.fregataArcCollisionfirstAttack = true;
			if (this.zoomTime < this.zoomInterval) {
				this.zoomIn(context);
				this.zoomTime += 5;
			}
		}
	}
	checkFregataLineCollisionSecond(missile) {
		if (this.ships[2].checkArcCollision(missile, 0)) {
			this.fregataArcCollisionsecondAttack = true;
		}
	}
	zoomIn(context) {
		this.background.marks.markDistance *= 1.2;
		this.ships[2].radius *= 1.045;
		this.ships[2].width *= 1.04;
		this.ships[2].y /= 1.1;
		this.ships[2].height *= 1.04;
		this.ships[2].draw(context);
		Object.keys(this.ships[0].missiles).forEach((key) => {
			this.ships[0].missiles[key].x *= 1.045;
			this.ships[0].missiles[key].y /= 1.2;
			this.ships[0].missiles[key].width *= 1.02;
			this.ships[0].missiles[key].height *= 1.02;
			this.ships[0].missiles[key].draw(context);
		});
		this.background.marks.draw(context);
		this.scenariu1Time = true;
		this.zoomedIn = true;
		setTimeout(() => {
			btnsScenarii.style.display = 'block';
		}, 100);
	}
	controlMissiles(
		context,
		missile,
		shipPos,
		explosionX,
		explosionY,
		explosionSize
	) {
		if (missile && missile.x > shipPos) {
			missile.draw(context);
			missile.speedX = 1;
			missile.speedY = 0.4;
			missile.lightHeadMissile();
			missile.x -= missile.speedX;
			missile.y += missile.speedY;
		} else if (missile && missile.x <= shipPos) {
			if (this.explosionCount < this.maxExplosions) {
				this.explosions.unshift(
					new Explosion(this, explosionX, explosionY, explosionSize)
				);
				this.explosionCount++;
				missile.markedForDeletion = true;
			}
		}
	}
	controlFireAK630(context, ak1, ak2) {
		if (!ak1.fireStop) {
			ak1.update(context);
			ak2.y = this.height / 2.1;
			ak2.update(context);
		}
	}

	controlAttack(context, ship) {
		if (ship.missiles.p21) {
			this.controlMissiles(
				context,
				ship.missiles.p21,
				this.ships[2].x + this.ships[2].width / 2,
				ship.missiles.p21.x - this.ships[2].width / 3,
				ship.missiles.p21.y - this.ships[2].height / 5,
				this.explosionShip
			);
		}
		if (ship.missiles.p22) {
			this.controlMissiles(
				context,
				ship.missiles.p22,
				this.ships[2].x + this.ships[2].width * 2,
				ship.missiles.p22.x,
				ship.missiles.p22.y,
				this.explosionMissile
			);
		}
		this.controlFireAK630(
			context,
			this.ships[2].fireAK630[0],
			this.ships[2].fireAK630[1]
		);

		if (ship.missiles.p21 && ship.missiles.p21.markedForDeletion)
			delete ship.missiles.p21;
		if (ship.missiles.p22 && ship.missiles.p22.markedForDeletion)
			delete ship.missiles.p22;

		if (!Object.keys(ship.missiles).length) {
			this.attackOver = true;
		}
	}
	scenariu1(context) {
		if (this.scenariu1Time) {
			this.controlAttack(context, this.ships[0]);
			this.controlFireAK630(
				context,
				this.ships[2].fireAK630[0],
				this.ships[2].fireAK630[1]
			);
			if (this.attackOver) {
				this.ships[1].updateMissilesPosition();
				Object.keys(this.ships[1].missiles).forEach((key) => {
					this.ships[1].missiles[key].width =
						this.ships[1].missiles[key].zoomedWidth;
					this.ships[1].missiles[key].height =
						this.ships[1].missiles[key].zoomedHeight;
				});

				this.controlAttack(context, this.ships[1]);
				this.controlFireAK630(
					context,
					this.ships[2].fireAK630[2],
					this.ships[2].fireAK630[3]
				);
			}
		}
		requestAnimationFrame(() => this.scenariu1(context));
	}

	animate(context) {
		this.draw(context);
		this.update(context);
		requestAnimationFrame(() => this.animate(context));
	}
}
