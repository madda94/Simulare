import { Ship, Fregata } from './ship.js';
import { ArcDetection, ApproachDetection } from './approachLine.js';
import { MissileP21, MissileP22 } from './missile.js';
import { Background } from './scrollingBackground.js';

const canvas = document.getElementById('canvas1');
const ctx = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
const background = new Background(canvas.width, canvas.height);

function createObject(constructor, ...args) {
	return new constructor(...args);
}
const ships = {
	npr1: {
		ship: createObject(Ship, canvas.width, canvas.height),
		missiles: {
			p21: createObject(MissileP21, canvas.width, canvas.height),
			p22: createObject(MissileP22, canvas.width, canvas.height),
		},
		approachLine: createObject(ApproachDetection, canvas.width, canvas.height),
	},
	npr2: {
		ship: createObject(Ship, canvas.width, canvas.height),
		missiles: {
			p21: createObject(MissileP21, canvas.width, canvas.height),
			p22: createObject(MissileP22, canvas.width, canvas.height),
		},
		approachLine: createObject(ApproachDetection, canvas.width, canvas.height),
	},
	fregata: {
		ship: createObject(Fregata, canvas.width, canvas.height),
		approachLine: createObject(ArcDetection, canvas.width, canvas.height),
	},
};

function lineBlinking(collision, ship) {
	if (collision <= 300) {
		ship.approachLine.appearBlinking = true;
		ship.approachLine.draw(ctx, collision);
	} else {
		ship.approachLine.appearBlinking = false;
	}
}
function updatePositionNPR1() {
	ships.npr1.ship.y = canvas.height / 3;
	ships.npr1.ship.updatedPosition = true;
	ships.npr1.missiles.p21.x = ships.npr1.missiles.p22.x = canvas.width / 3;
	ships.npr1.missiles.p21.y = ships.npr1.ship.y + ships.npr1.ship.height / 2;
	ships.npr1.missiles.p22.y = ships.npr1.missiles.p21.y - 40;
}
function controlNpr(ship) {
	if (!ship.ship.updatedPosition && ship === ships.npr1) {
		updatePositionNPR1();
	}
	ship.ship.draw(ctx);
	const collision = ship.approachLine.detectCollision(ship.ship) + 20;
	lineBlinking(collision, ship);
	ship.ship.update(collision);
	if (Math.trunc(collision) <= 0) {
		background.moving = true;
		ship.ship.x += 0.5;
		ship.approachLine.x += 0.1;
		Object.keys(ship.missiles).forEach((key) => {
			ship.missiles[key].draw(ctx);
			ship.missiles[key].update();
		});
	}
	if (Math.trunc(collision) <= -300) {
		ship.ship.needRotation = true;
		ship.ship.turnAround();
		ship.ship.needRotation = false;
	}
	if (ship.ship.x > canvas.width + ship.ship.width) delete ship.ship;
}

function updateMissilesPosition(missile) {
	if (!missile.updatedPosition) {
		missile.updatePosition();
		if (missile === ships.npr1.missiles.p21) {
			missile.x = canvas.width / 2;
		} else if (missile === ships.npr1.missiles.p22) {
			missile.x = canvas.width / 1.9;
		}
	}
	missile.update();
	missile.draw(ctx);
}

function drawFregata(context) {
	const fregata = ships.fregata;
	fregata.ship.y = canvas.height / 3;
	updateMissilesPosition(ships.npr1.missiles.p21);
	updateMissilesPosition(ships.npr1.missiles.p22);
	fregata.ship.draw(context);
	fregata.ship.radius = fregata.ship.width * 2;
	fregata.approachLine.y = canvas.height / 1.5;
	fregata.approachLine.appearBlinking = true;
	fregata.approachLine.draw(context, fregata.ship.radius);
}

export function initialDisplayS2() {
	background.draw(ctx);
	ships.npr1.ship.initialX = ships.npr2.ship.initialX =
		canvas.width - ships.npr1.ship.initialWidth;
	ships.npr1.ship.initialY = canvas.height / 2.5;
	ships.npr2.ship.initialY = canvas.height - ships.npr1.ship.initialHeight * 2;
	ships.fregata.ship.initialY = canvas.height / 1.7;

	setTimeout(() => {
		ships.npr1.ship.initialDraw(ctx);
		ships.npr2.ship.initialDraw(ctx);
		ships.fregata.ship.initialDraw(ctx);
	}, 100);
}

export function drawBackground() {
	background.draw(ctx);
}

export function animateSimulare2() {
	ctx.clearRect(0, 0, canvas.width, canvas.height);
	background.draw(ctx);
	if (!ships.fregata.ship.isDrawn) background.update();
	if (ships.npr1.ship) controlNpr(ships.npr1);
	if (ships.npr2.ship) controlNpr(ships.npr2);
	if (!ships.npr1.ship) drawFregata(ctx);

	requestAnimationFrame(animateSimulare2);
}
