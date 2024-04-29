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
	constructor(simulare, x, y) {
		super(simulare);
		this.size = Math.random() * 10 + 10;
		this.x = x;
		this.y = y;
		this.speedX = Math.random();
		this.speedY = Math.random();
		this.color = 'rgba(0, 0, 0, 0.2)';
	}
	draw(context) {
		context.beginPath();
		context.arc(this.x, this.y, this.size, 0, Math.PI * 2);
		context.fillStyle = this.color;
		context.fill();
	}
}
