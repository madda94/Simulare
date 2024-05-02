class Particle {
	constructor(simulare) {
		this.simulare = simulare;
		this.markedForDeletion = false;
	}
	update() {
		this.x -= this.speedX + this.simulare.speed;
		this.y -= this.speedY;
		this.size *= 0.97;
		if (this.size < 0.5) this.markedForDeletion = true;
	}
}

export class Fire extends Particle {
	constructor(simulare, x, y) {
		super(simulare);
		this.image = fireReaction;
		this.size = Math.random() * 20 + 50;
		this.x = x;
		this.y = y;
		this.speedX = 1;
		this.speedY = 1;
		this.angle = 0;
		this.va = Math.random() * 0.2 - 0.1;
	}
	update() {
		super.update();
		this.angle += this.va;
		this.x += Math.sin(this.angle * 10);
	}
	draw(context) {
		context.save();
		context.translate(this.x, this.y);
		context.rotate(this.angle);
		context.drawImage(
			this.image,
			-this.size * 0.5,
			-this.size * 0.5,
			this.size,
			this.size
		);
		context.restore();
	}
}

export class Dust extends Particle {
	constructor(simulare) {
		super(simulare);
		this.size = Math.random() * 10 + 30;
		this.x = this.simulare.width / 5.2;
		this.y = this.simulare.height / 1.9;
		this.speedX = Math.random() + 2;
		this.speedY = Math.random() * 2 - 2;
		this.color = 'rgba(78, 70, 70, 0.1)';
	}
	draw(context) {
		context.beginPath();
		context.arc(this.x, this.y, this.size / 2, 0, Math.PI * 2);
		context.fillStyle = this.color;
		context.fill();
	}
	update() {
		if (this.x > this.simulare.width / 3) this.speedX = this.speedX * -1;
		this.x += this.speedX;
		this.y += this.speedY;
		this.size *= 1.005;
		if (this.size > 100) this.markedForDeletion = true;
	}
}

export class ShipFire extends Particle {
	constructor(simulare, ship) {
		super(simulare);
		this.ship = ship;
		this.size = Math.random() * 10 + 5;
		this.x = this.ship.x + this.ship.width / 2 + this.ship.moveX;
		// this.x = this.simulare.width / 2.2
		this.y = this.simulare.height / 1.2;
		this.speedX = Math.random() + 1;
		this.speedY = Math.random() - 1;
		this.color1 = 'rgba(255, 102, 0, 0.8)';
		this.color2 = 'rgba(141, 141, 124, 0.5)';
		this.limitPoint = this.simulare.width / 2.5;
	}
	draw(context) {
		context.beginPath();
		context.arc(this.x, this.y, this.size / 2, 0, Math.PI * 2);
		context.fillStyle = this.color1;
		context.fill();
		context.beginPath();
		context.arc(this.x - 5, this.y, this.size / 2, 0, Math.PI * 2);
		context.fillStyle = this.color2;
		context.fill();
	}
	update() {
		if (this.x < this.ship.x) {
			this.speedX = this.speedX * -1;
		}
		this.x -= this.speedX;
		this.y += this.speedY / 2;
		this.size *= 1.01;
		if (this.size > 50) this.markedForDeletion = true;
	}
}
