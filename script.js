import { Simulare } from './simulare.js';

export const btnsScenarii = document.querySelector('.btns-scenarii');
const card = document.querySelector('.card');
const buttons = document.querySelector('.buttons');
const startBtn = document.querySelector('.start');
const btnScenariu1 = document.getElementById('scenariu1');
const btnScenariu2 = document.getElementById('scenariu2');

const canvas = document.getElementById('canvas1');
const ctx = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
let selectNrSimulare;

const simulare1 = new Simulare(canvas.width, canvas.height);

window.addEventListener('load', simulare1.background.draw(ctx));

buttons.addEventListener('click', function (e) {
	if (e.target.classList.contains('btn-simulare')) {
		card.style.display = 'none';
		startBtn.style.display = 'block';
		selectNrSimulare = +e.target.id;
	}
	if (selectNrSimulare === 1) simulare1.initialDisplayS1(ctx);
	// if (selectNrSimulare === 2) initialDisplayS2();
});

startBtn.addEventListener('click', function () {
	if (selectNrSimulare === 1) simulare1.animate(ctx);
	// if (selectNrSimulare === 2) animateSimulare2();
	startBtn.style.display = 'none';
});

btnsScenarii.addEventListener('click', function (e) {
	btnScenariu1.classList.remove('btn-scenariu-selected');
	btnScenariu2.classList.remove('btn-scenariu-selected');
	if (e.target.dataset.id === '1') {
		btnScenariu1.classList.add('btn-scenariu-selected');
		simulare1.scenariu1(ctx);
	} else if (e.target.dataset.id === '2') btnScenariu2.classList.add('btn-scenariu-selected');
});
