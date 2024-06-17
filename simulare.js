import { Ship, Fregata } from './ship.js';
import { Background } from './scrollingBackground.js';
import { btnsScenarii } from './script.js';
import { Explosion } from './explosions.js';

export class Simulare {
	constructor(width, height) {
		// Inițializarea dimensiunilor și vitezei simulării
		this.width = width;
		this.height = height;
		this.speed = 1;
		// Crearea fundalului și a navelor
		this.background = new Background(this);
		this.ships = [new Ship(this), new Ship(this), new Fregata(this)];
		this.fireParticles = [];
		this.smokeParticles = [];
		this.smokeParticlesAK726 = [];
		this.shipFireParticles = [];
		this.explosions = [];
		this.cloud = [];
		this.timeForFregata = false;
		this.fregataArcCollisionfirstAttack = false;
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
		this.attackOverFinal = false;
		this.continue = true;
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
		this.smokeParticlesAK726.forEach((particle) => {
			particle.draw(context);
		});
		this.cloud.forEach((cloud) => {
			cloud.draw(context);
		});
	}

	// dupa ce npr1 ajunge la linia rosie, rachetele se lanseaza si ecranul se deruleaza
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
				// rachetele navei npr1 sunt desenate si actualizate
				Object.keys(this.ships[0].missiles).forEach((key) => {
					if (!this.ships[0].missiles[key].deviat)
						this.ships[0].missiles[key].draw(context);
					else this.ships[0].missiles[key].drawAfterDeviation(context);
					this.ships[0].missiles[key].update();
				});
			else if (this.fregataArcCollisionfirstAttack) {
				// rachetele navei npr2 sunt desenate si actualizate
				Object.keys(this.ships[0].missiles).forEach((key) => {
					if (!this.ships[0].missiles[key].deviat)
						this.ships[0].missiles[key].draw(context);
					else this.ships[0].missiles[key].drawAfterDeviation(context);
				});
			}
			if (this.attackOver)
				Object.keys(this.ships[1].missiles).forEach((key) => {
					this.ships[1].missiles[key].drawZoomed(context);
					this.ships[1].missiles[key].updateZoomed();
				});
			this.shipFireParticles.forEach((particle) => {
				particle.draw(context);
			});
		}
	}
	// intreaga simulare se actualizeaza
	update(context) {
		if (this.continue) {
			// actualizare background
			if (!this.ships[2].isDrawn) this.background.update();
			// actualizare npr1
			if (!this.ships[0].markedForDeletion) this.ships[0].controlNpr(context);
			this.controlAfterFirstCollision(context);
			// actualizarea reactiei rachetelor la lansare
			this.fireParticles.forEach((particle) => {
				particle.update();
			});
			// actualizarea fumului rezultat de la tunuri
			this.smokeParticles.forEach((particle) => {
				particle.update();
			});
			this.smokeParticlesAK726.forEach((particle) => {
				particle.update();
			});
			// actualizarea reactiei pe nava rezultata la lansarea rachetelor
			this.shipFireParticles.forEach((particle) => {
				particle.update();
			});
			// this.cloud.forEach((cloud) => {
			// 	cloud.update(context);
			// });
			this.fireParticles = this.fireParticles.filter(
				(particle) => !particle.markedForDeletion
			);
			this.smokeParticles = this.smokeParticles.filter(
				(particle) => !particle.markedForDeletion
			);
			this.smokeParticlesAK726 = this.smokeParticlesAK726.filter(
				(particle) => !particle.markedForDeletion
			);
			this.shipFireParticles = this.shipFireParticles.filter(
				(particle) => !particle.markedForDeletion
			);
			// actualizare explozii
			this.explosions.forEach((explosion) => {
				explosion.update(context);
				explosion.draw(context);
			});
			this.explosions = this.explosions.filter(
				(explosion) => !explosion.markedForDeletion
			);
			// actualizarea norilor rezultati din dispersarea instalatiilor de bruiaj
			this.cloud = this.cloud.filter((cloud) => !cloud.markedForDeletion);
			if (this.ships[2].isDrawn) this.ships[2].radar.update();
			if (this.ships[2].isDrawn)
				this.checkFregataLineCollisionFirst(
					context,
					this.ships[0].missiles.p22
				);
			this.ships[2].radar.update();
		} else if (!this.continue) {
			// desenarea rachetelor daca este apasat butonul de pauza
			Object.keys(this.ships[0].missiles).forEach((key) => {
				if (!this.ships[0].missiles[key].deviat)
					this.ships[0].missiles[key].draw(context);
				else this.ships[0].missiles[key].drawAfterDeviation(context);
			});
			if (this.attackOver)
				Object.keys(this.ships[1].missiles).forEach((key) =>
					this.ships[1].missiles[key].draw(context)
				);
		}
	}
	// desenarea navelor in pozitie initiala si la o scala mai mica
	initialDisplay(context) {
		this.background.draw(context);
		this.ships[1].initialX = this.width - this.ships[1].initialWidth;
		this.ships[1].x = this.width + this.ships[1].width;

		setTimeout(() => {
			this.ships.forEach((ship) => {
				ship.initialDraw(context);
			});
		}, 100);
	}
	// la coliziunea rachetelor cu linia fregatei se da zoom
	checkFregataLineCollisionFirst(context, missile) {
		if (this.ships[2].checkArcCollision(missile)) {
			this.fregataArcCollisionfirstAttack = true;
			if (this.zoomTime < this.zoomInterval) {
				this.zoomIn(context);
				this.zoomTime += 5;
			}
		}
	}
	// controlul navei si a rachetelor in zoom
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
	// controlul rachetelor navei npr1 si devierea acestora cand intra in norul de bruiaj
	controlMissilesBeforeAttackShip0(context, missile, shipPos) {
		if (missile && missile.x > shipPos) {
			missile.speedX = this.speed;
			missile.speedY = this.speed * 0.4;
			missile.lightHeadMissile();
			missile.x -= missile.speedX;
			missile.y += missile.speedY;
		} else if (missile && missile.x <= shipPos) {
			missile.deviat = true;
			missile.lightHead = false;
			missile.speedX = this.speed;
			missile.speedY = this.speed * 2;
			missile.x -= missile.speedX;
			missile.y += missile.speedY;
			if (
				missile.x <= 0 - missile.width ||
				missile.y >= this.height + missile.height
			)
				missile.markedForDeletion = true;
		}
		Object.keys(this.ships[0].missiles).forEach((key) => {
			if (!this.ships[0].missiles[key].deviat)
				this.ships[0].missiles[key].draw(context);
			else this.ships[0].missiles[key].drawAfterDeviation(context);
		});
	}
	// controlul rachetelor navei npr2 si explozia acestora cand lovesc fregata
	controlMissilesBeforeAttackShip1(
		context,
		missile,
		shipPos,
		explosionX,
		explosionY,
		explosionSize
	) {
		if (missile && missile.x > shipPos) {
			missile.draw(context);
			// modificare direcie (viteza)
			missile.speedX = this.speed * 1.2;
			missile.speedY = this.speed * 0.4;
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
	// controlul tunurilor AK630
	controlFireAK630(context, ak1, ak2) {
		if (!ak1.fireStop) {
			ak1.update(context);
			ak2.y = this.height / 2.1;
			ak2.update(context);
		}
	}
	// controlul tunurilor AK726
	controlFireAK726(context, ak1, ak2) {
		if (!ak1.fireStop) {
			ak1.update(context);
			ak2.fireInterval = 120;
			ak2.x = this.width / 9.5;
			ak2.y = this.height / 1.8;
			ak2.update(context);
		}
	}
// controlul atacului rachetelor navei 1 asupra fregatei
	controlAttackShip0(context) {
		const ship = this.ships[0];
		if (ship.missiles.p21) {
			this.controlMissilesBeforeAttackShip0(
				context,
				ship.missiles.p21,
				this.ships[2].x + this.ships[2].width * 2
			);
		}
		if (ship.missiles.p22) {
			this.controlMissilesBeforeAttackShip0(
				context,
				ship.missiles.p22,
				this.ships[2].x + this.ships[2].width * 2
			);
		}
		// daca rachetele au disparut de pe ecran, acestea vor fi sterse
		if (ship.missiles.p21 && ship.missiles.p21.markedForDeletion)
			delete ship.missiles.p21;
		if (ship.missiles.p22 && ship.missiles.p22.markedForDeletion)
			delete ship.missiles.p22;

		if (!Object.keys(ship.missiles).length) {
			this.attackOver = true;
		}
	}
// controlul atacului rachetelor navei 2 asupra fregatei
	controlAttackShip1(context) {
		const ship = this.ships[1];
		if (this.attackOver) {
			Object.keys(this.ships[1].missiles).forEach((key) => {
				this.ships[1].missiles[key].draw(context);
				this.ships[1].missiles[key].updateZoomed();
			});
		}
		if (ship.missiles.p21) {
			this.controlMissilesBeforeAttackShip1(
				context,
				ship.missiles.p21,
				this.ships[2].x + this.ships[2].width / 2,
				// modificare pozitii explozie p21 (cap albastru)
				ship.missiles.p21.x - this.ships[2].width / 2,
				ship.missiles.p21.y - this.ships[2].height / 5.5,
				this.explosionShip
			);
		}
		if (ship.missiles.p22) {
			this.controlMissilesBeforeAttackShip1(
				context,
				ship.missiles.p22,
				this.ships[2].x + this.ships[2].width / 2,
				// modificare pozitii explozie p22 (cap portocaliu)
				ship.missiles.p22.x - this.ships[2].width / 2,
				ship.missiles.p22.y - this.ships[2].height / 5,
				this.explosionShip
			);
		}
		// daca rachetele au disparut de pe ecran, acestea vor fi sterse
		if (ship.missiles.p21 && ship.missiles.p21.markedForDeletion)
			delete ship.missiles.p21;
		if (ship.missiles.p22 && ship.missiles.p22.markedForDeletion)
			delete ship.missiles.p22;
	}
	scenariu1(context) {
		if (this.scenariu1Time && this.continue) {
			// controlul rachetelor navei npr1 in cadrul scenariului
			this.controlAttackShip0(context);
			// controlul instalatiilor de bruiaj
			this.ships[2].firePK16.forEach((fire) => {
				// console.log(fire);
				fire.update(context);
				// controlul norilor rezultati din dispersarea instalatiilor de bruiaj
			});
			this.cloud.forEach((cloud) => {
				cloud.update(context);
			});
			if (this.attackOver) {
				// actualizarea pozitiilor si dimensiunilor rachetelor navei npr2
				this.ships[1].updateMissilesPosition();
				Object.keys(this.ships[1].missiles).forEach((key) => {
					this.ships[1].missiles[key].width =
						this.ships[1].missiles[key].zoomedWidth;
					this.ships[1].missiles[key].height =
						this.ships[1].missiles[key].zoomedHeight;
				});
				// controlul rachetelor navei npr2 dupa ce rachetele navei npr1 au fost deviate
				this.controlAttackShip1(context);
				// controlul tunurilor AK630 in cadrul scenariului
				this.controlFireAK630(
					context,
					this.ships[2].fireAK630[2],
					this.ships[2].fireAK630[3]
				);
				// controlul tunurilor AK726 in cadrul scenariului
				this.controlFireAK726(
					context,
					this.ships[2].fireAK726[2],
					this.ships[2].fireAK726[3]
				);
			}
			// daca toate rachetele au disparut de pe ecran atacul se incheie
			if (
				Object.keys(this.ships[0].missiles).length === 0 &&
				Object.keys(this.ships[1].missiles).length === 0
			)
				this.attackOverFinal = true;
		}
		if (!this.attackOverFinal)
			requestAnimationFrame(() => this.scenariu1(context));
	}

	animate(context) {
		this.draw(context);
		this.update(context);
		requestAnimationFrame(() => this.animate(context));
	}
}
