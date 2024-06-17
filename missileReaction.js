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
		this.speedX = this.simulare.speed;
		this.speedY = this.simulare.speed;
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
		this.speedX = (Math.random() + 2) * this.simulare.speed;
		this.speedY = (Math.random() * 2 - 2) * this.simulare.speed;
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

export class SmokeAK726 extends Dust {
	constructor(simulare, x, y) {
		super(simulare);
		this.x = x;
		this.y = y;
	}
}

export class ShipFire extends Particle {
	constructor(simulare, ship) {
		super(simulare);
		this.ship = ship;
		this.size = Math.random() * 10;
		this.x = this.ship.x + this.ship.width / 2 + this.ship.moveX;
		// this.x = this.simulare.width / 2.2
		this.y = this.simulare.height / 1.2;
		this.speedX = (Math.random() * 2 - 0.5) * this.simulare.speed;
		this.speedY = (Math.random() - 1) * this.simulare.speed;
		this.color1 = 'rgba(255, 102, 0, 0.1)';
		this.color2 = 'rgba(141, 141, 124, 0.3)';
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
		if (this.x < this.ship.x && this.x > this.ship.width) {
			this.speedX = this.speedX * -1;
		}
		this.x -= this.speedX;
		this.y += this.speedY / 2;
		this.size *= 1.01;
		if (this.size > 60) this.markedForDeletion = true;
	}
}

class Cloud extends Particle {
	constructor(simulare, x, y) {
		super(simulare);
		// modificare dimensiune nor la start
		this.size = Math.random() * 5 + 10;
		this.x = x;
		this.y = y;
		this.opacity = 0.4;
		this.opacityDecrease = 0.001;
		this.timer = 0;
		this.interval = 50;
	}
	draw(context) {
		context.beginPath();
		context.arc(this.x, this.y, this.size, 0, Math.PI * 2);
		context.arc(this.x - 10, this.y, this.size, 0, Math.PI * 2);
		context.arc(this.x - 20, this.y, this.size, 0, Math.PI * 2);
		context.arc(this.x - 30, this.y, this.size, 0, Math.PI * 2);
		context.arc(this.x - 5, this.y - 5, this.size, 0, Math.PI * 2);
		context.arc(this.x - 15, this.y - 5, this.size, 0, Math.PI * 2);
		context.arc(this.x - 25, this.y - 5, this.size, 0, Math.PI * 2);
		context.arc(this.x - 35, this.y - 5, this.size, 0, Math.PI * 2);
		context.arc(this.x - 5, this.y + 5, this.size, 0, Math.PI * 2);
		context.arc(this.x - 15, this.y + 5, this.size, 0, Math.PI * 2);
		context.arc(this.x - 25, this.y + 5, this.size, 0, Math.PI * 2);
		context.arc(this.x - 35, this.y + 5, this.size, 0, Math.PI * 2);
		context.arc(this.x - 10, this.y + 10, this.size, 0, Math.PI * 2);
		context.arc(this.x - 20, this.y + 10, this.size, 0, Math.PI * 2);
		context.arc(this.x - 30, this.y + 10, this.size, 0, Math.PI * 2);
		context.arc(this.x - 10, this.y - 10, this.size, 0, Math.PI * 2);
		context.arc(this.x - 20, this.y - 10, this.size, 0, Math.PI * 2);
		context.arc(this.x - 30, this.y - 10, this.size, 0, Math.PI * 2);
		context.fillStyle = this.color;
		context.fill();
	}
}

export class Cloud0 extends Cloud {
	constructor(simulare, x, y) {
		super(simulare, x, y);
		// modificare culoare nor (trebuie modificata si mai jos in update)
		this.color = `rgba(144, 144, 144, ${this.opacity})`;
	}

	update(context) {
		this.draw(context);
		// modificare dimensiunea la care norul isi incetineste cresterea
		if (this.size > 90) {
			if (this.timer < this.interval) this.timer++;
			// modificare viteza cu care creste dupa acest punct
			else this.size *= 1;
		}
		// modificare viteza cu care creste norul de la inceput
		else this.size *= 1.007;
		this.opacity -= this.opacityDecrease;
		this.color = `rgba(144, 144, 144, ${this.opacity})`;
		if (this.size > 100 || this.opacity === 0) this.markedForDeletion = true;
	}
}
export class Cloud1 extends Cloud {
	constructor(simulare, x, y) {
		super(simulare);
		// modificare culoare nor (trebuie modificata si mai jos in update)
		this.color = `rgba(144, 144, 144, ${this.opacity})`;
	}

	update(context) {
		this.draw(context);
		// modificare dimensiunea la care norul isi incetineste cresterea
		if (this.size > 90) {
			if (this.timer < this.interval) this.timer++;
			// modificare viteza cu care creste dupa acest punct
			else this.size *= 1;
		}
		// modificare viteza cu care creste norul de la inceput
		else this.size *= 1.007;
		this.opacity -= this.opacityDecrease;
		this.color = `rgba(144, 144, 144, ${this.opacity})`;
		if (this.size > 100 || this.opacity === 0) this.markedForDeletion = true;
	}
}
export class Cloud2 extends Cloud {
	constructor(simulare, x, y) {
		super(simulare, x, y);
		// modificare culoare nor (trebuie modificata si mai jos in update)
		this.color = `rgba(255, 139, 74, ${this.opacity})`;
	}

	update(context) {
		this.draw(context);
		// modificare dimensiunea la care norul isi incetineste cresterea
		if (this.size > 90) {
			if (this.timer < this.interval) this.timer++;
			// modificare viteza cu care creste dupa acest punct
			else this.size *= 1;
		}
		// modificare viteza cu care creste norul de la inceput
		else this.size *= 1.007;
		this.opacity -= this.opacityDecrease;
		this.color = `rgba(255, 139, 74, ${this.opacity})`;
		if (this.size > 100 || this.opacity === 0) this.markedForDeletion = true;
	}
}

export class Cloud3 extends Cloud {
	constructor(simulare, x, y) {
		super(simulare, x, y);
		// modificare culoare nor (trebuie modificata si mai jos in update)
		this.color = `rgba(255, 139, 74, ${this.opacity})`;
	}

	update(context) {
		this.draw(context);
		// modificare dimensiunea la care norul isi incetineste cresterea
		if (this.size > 90) {
			if (this.timer < this.interval) this.timer++;
			// modificare viteza cu care creste dupa acest punct
			else this.size *= 0.8;
		}
		// modificare viteza cu care creste norul de la inceput
		else this.size *= 1.007;
		this.opacity -= this.opacityDecrease;
		this.color = `rgba(255, 139, 74, ${this.opacity})`;
		if (this.size > 100 || this.opacity === 0) this.markedForDeletion = true;
	}
}
export class Cloud4 extends Cloud {
	constructor(simulare, x, y) {
		super(simulare, x, y);
		// modificare culoare nor (trebuie modificata si mai jos in update)
		this.color = `rgba(144, 144, 144, ${this.opacity})`;
	}

	update(context) {
		this.draw(context);
		// modificare dimensiunea la care norul isi incetineste cresterea
		if (this.size > 90) {
			if (this.timer < this.interval) this.timer++;
			// modificare viteza cu care creste dupa acest punct
			else this.size *= 1;
		}
		// modificare viteza cu care creste norul de la inceput
		else this.size *= 1.007;
		this.opacity -= this.opacityDecrease;
		this.color = `rgba(144, 144, 144, ${this.opacity})`;
		if (this.size > 100 || this.opacity === 0) this.markedForDeletion = true;
	}
}
export class Cloud5 extends Cloud {
	constructor(simulare, x, y) {
		super(simulare, x, y);
		// modificare culoare nor (trebuie modificata si mai jos in update)
		this.color = `rgba(144, 144, 144, ${this.opacity})`;
	}

	update(context) {
		this.draw(context);
		// modificare dimensiunea la care norul isi incetineste cresterea
		if (this.size > 90) {
			if (this.timer < this.interval) this.timer++;
			// modificare viteza cu care creste dupa acest punct
			else this.size *= 1;
		}
		// modificare viteza cu care creste norul de la inceput
		else this.size *= 1.007;
		this.opacity -= this.opacityDecrease;
		this.color = `rgba(144, 144, 144, ${this.opacity})`;
		if (this.size > 100 || this.opacity === 0) this.markedForDeletion = true;
	}
}
