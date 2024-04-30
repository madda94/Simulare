export class FireAK630 extends Missile {
	constructor(simulare) {
		super(simulare);
		this.x = 200;
		this.y = 200;
		this.image = fireReaction;
	}
	draw(context) {
		context.drawImage(this.image, this.x, this.y, this.width, this.height);
	}
}
export class Fregata extends Ship {
	constructor(simulare) {
		super(simulare);
		this.simulare = simulare;
		this.image = fregataImage;
		this.spriteWidth = 408;
		this.spriteHeight = 612;
		this.initialWidth = this.spriteWidth / 4;
		this.width = this.spriteWidth / 4;
		this.initialHeight = this.spriteHeight / 3;
		this.height = this.spriteHeight / 3;
		this.initialX = this.initialWidth;
		this.x = this.width / 2;
		this.initialY = this.totalHeight / 2.5;
		this.y = this.totalHeight / 1.5;
		this.isDrawn = false;
		this.radius = this.width * 4.25;
		this.approachLines = new ArcDetection(this.simulare);
		this.fireAK630 = new FireAK630(this.simulare);
	}
	draw(context) {
		super.draw(context);
		this.drawApproachLine(context, this.approachLines, this.radius);
		this.fireAK630.draw(context);
		this.isDrawn = true;
	}
	drawApproachLine(context, line, radius) {
		line.appearBlinking = true;
		line.draw(context, radius);
	}
	checkArcCollision(missile) {
		const dx = missile.x - 0;
		const dy = missile.y - this.approachLine.y;
		const distance = Math.trunc(Math.sqrt(dx * dx + dy * dy)) + 150;
		const sumOfRadius = missile.radius + this.radius;
		return distance < sumOfRadius;
	}
}
