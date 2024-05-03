import { Simulare } from './simulare.js';

export const btnsScenarii = document.querySelector('.btns-scenarii');
const startBtn = document.querySelector('.start');
const btnScenariu1 = document.getElementById('scenariu1');
const btnScenariu2 = document.getElementById('scenariu2');

const canvas = document.getElementById('canvas1');
const ctx = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const simulare = new Simulare(canvas.width, canvas.height);

window.addEventListener('load', () => {
	simulare.background.draw(ctx);
	simulare.initialDisplayS1(ctx);
	startBtn.style.display = 'block';
});

startBtn.addEventListener('click', function () {
	simulare.animate(ctx);
	startBtn.style.display = 'none';
});

btnsScenarii.addEventListener('click', function (e) {
	btnScenariu1.classList.remove('btn-scenariu-selected');
	btnScenariu2.classList.remove('btn-scenariu-selected');
	if (e.target.dataset.id === '1') {
		btnScenariu1.classList.add('btn-scenariu-selected');
		simulare.scenariu1(ctx);
	} else if (e.target.dataset.id === '2') btnScenariu2.classList.add('btn-scenariu-selected');
});
