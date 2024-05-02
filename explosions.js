// export class Explosion {
// 	constructor(missile) {
// 		this.missile = missile;
// 		this.image = explosion;
// 		this.spriteWidth = 1200;
// 		this.spriteHeight = 630;
// 		this.width = this.spriteWidth / 10;
// 		this.heigth = this.spriteHeight / 10;
// 		this.opacity = 1;
// 		this.opacityDecrement = 0.01;
// 		this.scaleIncrement = 0.005;
// 		this.maxFrames = 1000;
// 		this.frame = 0;
// 		this.scale = 1;
// 		this.markedForDeletion = false;
// 		this.time = 0;
// 		this.timeForNextFrame = 100;
// 		this.previousScale = 1;
// 		this.previousOpacity = 1;
// 	}

// 	animate(context) {
// 		if (this.time < this.timeForNextFrame) {
// 			this.time++;
// 		} else {
// 			console.log(this.frame, this.scale);
// 			this.frame++;
// 			this.scale += this.scaleIncrement;
// 			this.time = 0; // Reset time to 0
// 			// this.opacity -= this.opacityDecrement;

// 			// Draw the previous frame
// 			context.globalAlpha = this.previousOpacity;
// 			context.drawImage(
// 				this.image,
// 				0,
// 				0,
// 				this.spriteWidth,
// 				this.spriteHeight,
// 				200,
// 				200,
// 				this.width * this.previousScale,
// 				this.heigth * this.previousScale
// 			);

// 			// Draw the current frame
// 			context.globalAlpha = this.opacity;
// 			context.drawImage(
// 				this.image,
// 				0,
// 				0,
// 				this.spriteWidth,
// 				this.spriteHeight,
// 				200,
// 				200,
// 				this.width * this.scale,
// 				this.heigth * this.scale
// 			);

// 			// Update the previous scale and opacity
// 			this.previousScale = this.scale;
// 			this.previousOpacity = this.opacity;
// 		}
// 		if (this.frame >= this.maxFrames || this.opacity < 0)
// 			this.markedForDeletion = true;
// 		else requestAnimationFrame(this.animate.bind(this, context));
// 	}
// }
export class Explosion {
	constructor(simulare, x, y) {
		this.simulare = simulare;
		this.x = x;
		this.y = y;
		this.image = explosion; // assuming you have an explosion image
		this.spriteWidth = 200; // adjust the sprite width and height
		this.spriteHeight = 180;
		this.width = this.spriteWidth;
		this.height = this.spriteHeight;
		this.size = 1;
		this.sizeIncrease = 0.1;
		this.frame = 0;
		this.frameTime = 0;
		this.frameInterval = 20; // adjust the frame interval
		this.markedForDeletion = false;
	}

	draw(context) {
		context.clearRect(
			this.x,
			this.y,
			this.width * this.size,
			this.height * this.size
		);
		context.drawImage(
			this.image,
			this.frame * this.spriteWidth,
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
		this.opacity -= this.opacityDecrease;
		if (this.frameTime > this.frameInterval) {
			this.frame++;
			this.size += this.sizeIncrease;
			this.frameTime = 0;
		}
		if (this.frame > 5) {
			// adjust the number of frames
			this.markedForDeletion = true;
		}
	}
}
