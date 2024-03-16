
const card = document.querySelector('.card')
const buttons = document.querySelector('.buttons')
const startBtn = document.querySelector('.start')
const ships = document.querySelectorAll('.ship')
const ship1 = document.querySelector('#ship-1')
const ship2 = document.querySelector('#ship-2')
const ship3 = document.querySelector('#ship-3')
const alignment = document.querySelector('.alignment')
const missiles = document.querySelectorAll('.missile')
const p21 = document.querySelector('#missile-p21')
const p22 = document.querySelector('#missile-p22')

const missileInterval = null


//Zoom in the ships for the simulation
const zoomIn = function () {
  startBtn.style.display = 'none'
  setTimeout(() => {
    ship1.style.display = 'none'
    ship2.style.maxWidth = '25%'
    ship3.style.maxWidth = '25%'
    ship2.style.right = '10em'
    ship3.style.right = '-100em'
  }, 300)
}

// Move the ships
const moveShipsLeft = function (ship, position, speed) {
  setInterval(() => {
    position += speed
    ship.style.right = `${position}px`
    displayAlignment(ship)
  }, 200)
}
const moveShipsDown = function (ship, position, speed) {
  setInterval(() => {
    position += speed
    ship.style.top = `${position}px`
  }, 200)
}

// The ship rotates and leaves
const turnAroundShip = function (ship) {
  setTimeout(() => {
    ship.style.transform = `rotate(-${30}deg)`
  }, 200)
  setTimeout(() => {
    ship.style.transform = `rotate(-${60}deg)`
  }, 400)
  setTimeout(() => {
    ship.style.transform = `rotate(-${90}deg)`
  }, 600)
  moveShipsDown(ship, 400, 10)
}

const displayAlignment = function (ship) {
  if (ship.style.right === '500px') {
    alignment.style.display = 'block'
  }
  fireMissile(ship2, p21, 45.5, 79)
  fireMissile(ship2, p22, 47, 79)
}

const fireMissile = function (ship, missile, top, right) {
  // ship.style.right = '670px'
  if (ship.style.right === '670px') {
    p21.style.display = 'block'
    p22.style.display = 'block'
    setTimeout(() => {
      top -= 4
      right += 4
      missile.style.top = `${top}em`
      missile.style.right = `${right}em`
    }, 150)
    setTimeout(() => {
      top -= 4
      right += 4
      missile.style.top = `${top}em`
      missile.style.right = `${right}em`
    }, 300)
    setTimeout(() => {
      top -= 4
      right += 4
      missile.style.top = `${top}em`
      missile.style.right = `${right}em`
    }, 450)
    setTimeout(() => {
      top -= 4
      right += 4
      missile.style.top = `${top}em`
      missile.style.right = `${right}em`
    }, 600)
    setTimeout(() => {
      top -= 4
      right += 4
      missile.style.top = `${top}em`
      missile.style.right = `${right}em`
    }, 750)
    setTimeout(() => {
      top -= 4
      right += 4
      missile.style.top = `${top}em`
      missile.style.right = `${right}em`
    }, 900)
    turnAroundShip(ship2)
    setTimeout(() => {
      top -= 4
      right += 4
      missile.style.top = `${top}em`
      missile.style.right = `${right}em`
    }, 1050)
    setTimeout(() => {
      top -= 4
      right += 4
      missile.style.top = `${top}em`
      missile.style.right = `${right}em`
    }, 1200)
    setTimeout(() => {
      missile.style.transform = 'rotate(-5deg)'
      top -= 2
      right += 4
      missile.style.top = `${top}em`
      missile.style.right = `${right}em`
    }, 1350)
    setTimeout(() => {
      missile.style.transform = 'rotate(-10deg)'
      right += 4
      missile.style.top = `${top}em`
      missile.style.right = `${right}em`
    }, 1500)
    setTimeout(() => {
      missile.style.transform = 'rotate(-10deg)'
      right += 4
      missile.style.top = `${top}em`
      missile.style.right = `${right}em`
    }, 1650)
    setTimeout(() => {
      missile.style.transform = 'rotate(-10deg)'
      right += 4
      missile.style.top = `${top}em`
      missile.style.right = `${right}em`
    }, 1800)
    setTimeout(() => {
      missile.style.transform = 'rotate(-10deg)'
      right += 4
      missile.style.top = `${top}em`
      missile.style.right = `${right}em`
    }, 1950)
    setTimeout(() => {
      missile.style.transform = 'rotate(-15deg)'
      right += 4
      missile.style.top = `${top}em`
      missile.style.right = `${right}em`
    }, 2100)
    setTimeout(() => {
      right += 5
      missile.style.top = `${top}em`
      missile.style.right = `${right}em`
    }, 2250)
    setTimeout(() => {
      right += 5
      missile.style.top = `${top}em`
      missile.style.right = `${right}em`
    }, 2400)
  }

}

// Choose the simulation
buttons.addEventListener('click', function (e) {
  if (e.target.classList.contains('btn-simulare')) {
    card.style.display = 'none'
    startBtn.style.display = 'block'
  }
  if (e.target.id === '1') {
    setTimeout(() => {
      ships.forEach(ship => {
        ship.style.display = 'block'
      })
    }, 1000)
  }
})

// Start the simulation
startBtn.addEventListener('click', function () {
  zoomIn()
  moveShipsLeft(ship2, 100, 10)
  moveShipsLeft(ship3, -1000, 10)

})

// zoomIn()
//
// fireMissile(ship2, p21, 46, 79)
// fireMissile(ship2, p22, 47, 79)