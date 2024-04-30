import { Ship, Fregata } from './ship.js';
import { ArcDetection, ApproachDetection } from './approachLine.js';
import { MissileP21, MissileP22 } from './missile.js';
import { Background } from './scrollingBackground.js';


let timeForShip2 = false;

export function animateSimulare1() {
	ctx.clearRect(0, 0, canvas.width, canvas.height);
	background.draw(ctx);
	if (!ships.fregata.ship.isDrawn) background.update();
	if (ships.npr1.ship) controlNpr(ships.npr1);
	// if (ships.npr2.ship && timeForShip2) controlNpr(ships.npr2); // i think we need some timeout between the nprs
	if (!ships.npr1.ship) drawFregata(ctx);

	requestAnimationFrame(animateSimulare1);
}
