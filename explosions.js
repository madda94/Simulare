export class Explosion {
	constructor(simulare, x, y, size) {
		this.simulare = simulare;
		this.x = x;
		this.y = y;
		// this.image = explosion; // assuming you have an explosion image
		this.spriteWidth = 798; // adjust the sprite width and height
		this.spriteHeight = 620;
		this.width = this.spriteWidth / 6;
		this.height = this.spriteHeight / 6;
		this.size = size;
		this.sizeIncrease = 0.1;
		this.frame = 0;
		this.frameTime = 0;
		this.frameInterval = 10; // adjust the frame interval
		this.markedForDeletion = false;
		this.images = document.querySelectorAll('.explosion');
		this.image = this.images[this.frame];
	}

	draw(context) {
		// context.clearRect(
		// 	this.x,
		// 	this.y,
		// 	this.width * this.size,
		// 	this.height * this.size
		// );
		context.drawImage(
			this.image,
			0,
			0,
			this.spriteWidth,
			this.spriteHeight,
			this.x,
			this.y,
			this.width * this.size,
			this.height * this.size
		);
	}

	update() {
		this.frameTime++;
		if (this.frameTime > this.frameInterval) {
			this.image = this.images[this.frame];
			this.frame++;
			this.size += this.sizeIncrease;
			this.frameTime = 0;
		}
		if (this.frame > 9) {
			// adjust the number of frames
			this.markedForDeletion = true;
		}
	}
}
