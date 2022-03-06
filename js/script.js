'use strict';

// const brick = [{ x: 3, y: 3 }, { x: 4, y: 3 }, { x: 5, y: 3 }, { x: 4, y: 4 }]
const blocks = document.querySelectorAll('.block');
const bricks = []
const inertState = Array(20).fill().map(() => Array(10).fill(null));
const gameState = { inertState, activeBrick: null, speed: 3, score: 0 }


for (let i = 0; i < 6; i++) inertState[19][i] = 'orange'
for (let i = 6; i < 9; i++) inertState[19][i] = 'green'
for (let i = 1; i < 5; i++) inertState[18][i] = 'yellow'
for (let i = 1; i < 5; i++) inertState[17][i] = 'yellow'

console.log(inertState);
renderInert();
// const brick1 = [{ x: 3, y: 6 }, { x: 3, y: 7 }, { x: 4, y: 7 }, { x: 4, y: 8 }]

// brick1.forEach(coords => blocks[coords.y*10 + coords.x].style.background = 'red')

fetch('bricks.txt').then(response => response.text()).then(parse).then(brickItems => {
  bricks.push(...brickItems)
  getNextBrick()
  console.log(bricks)
  
  for (let i = 0; i < 3; i++) {
    moveBrick(brick, 'right');
  }
  brick.coords.forEach(coords => blocks[coords.y * 10 + coords.x].style.background = brick.color)

  setInterval(() => {
    renderInert();
    moveBrick(brick, 'down');
    brick.coords.forEach(coords => blocks[coords.y * 10 + coords.x].style.background = brick.color)
  }, 400)
})

function parse(str) {
  const bricks = str.split('\r\n\r\n');

  for (let i = 0; i < bricks.length; i++) {
    let brick = bricks[i].split('\r\n');
    const color = brick.pop();
    const coords = [];
    brick = brick.map(row => row.match(/../g));

    for (let y = 0; y < brick.length; y++) {

      for (let x = 0; x < brick[y].length; x++) {
        if (brick[y][x] !== '  ') coords.push({
          x,
          y
        })
      }
    }

    bricks[i] = {
      coords,
      color
    }
  }

  return bricks
}

function rnd(max) {
  return Math.floor(Math.random() * max)
}

function renderInert() {
  blocks.forEach((block, i) => block.style.background = inertState[Math.floor(i / 10)][i % 10]);
}

function moveBrick(brick, side) {
  if (side === 'down') {
    brick.coords.forEach(coords => coords.y++);
  } else if (side === 'right') {
    brick.coords.forEach(coords => coords.x++);
  }
}

function getNextBrick() {
  const brick = bricks[rnd(bricks.length)]
  gameState.activeBrick = clone(brick)
  // повернуть случайным образом
  // установить его над экраном по центру 
  // добавить его в игровое состояние

}

function clone(obj){
  const json = JSON.stringify(obj)
  return JSON.parse(json)
}

function prepare(brick){
  const width = Math.max(...brick.coords.map(({x}) => x))
  const height = Math.max(...brick.coords.map(({y}) => y))
  const side = Math.max(width, height)
  const shiftX = Math.floor((side - width)/2)
  const shiftY = Math.floor((side - height)/2)

  brick.coords.forEach(coord => coord.x += shiftX)
  brick.coords.forEach(coord => coord.y += shiftY)
}