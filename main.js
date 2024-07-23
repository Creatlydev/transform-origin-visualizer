const code = document.getElementById('css-code')
const origin = document.querySelector('.origin')
const shape = document.querySelector('.shape')
const point = document.querySelector('.point')
const viewver = document.querySelector('.playground__viewver')
const xValue = document.getElementById('x')
const yValue = document.getElementById('y')
const xUnit = document.getElementById('x-unit')
const yUnit = document.getElementById('y-unit')
const style = document.documentElement.style
const sizePoint = getComputedStyle(point).getPropertyValue('--point').slice(0, -2)

let autopilot
let width = window.innerWidth
let height = window.innerHeight
let box = origin.getBoundingClientRect()
let side = box.right - box.left

function change(ex, ey) {
  const xIsPercen = xUnit.value === '%'
  const yIsPercen = yUnit.value === '%'

  const x =
    ex || (xIsPercen ? Math.random() : Math.floor(Math.random() * (side + 1)))
  const y =
    ey || (yIsPercen ? Math.random() : Math.floor(Math.random() * (side + 1)))

  style.setProperty('--x', x)
  style.setProperty('--y', y)

  let multiplyX = xIsPercen ? side : 1
  let multiplyY = yIsPercen ? side : 1
  let xXCien = xIsPercen ? 100 : 1
  let yXCien = yIsPercen ? 100 : 1
  let transformOrigin = `
    ${Math.round(x * xXCien)}${xUnit.value} ${Math.round(y * yXCien)}${yUnit.value}
  `
  let transformPoint = `
    ${xIsPercen ? Math.round((x * 100 * side) / sizePoint) + '%' : x + 'px'}, 
    ${yIsPercen ? Math.round((y * 100 * side) / sizePoint) + '%' : y + 'px'}
  `
  console.log(transformPoint)

  point.style.transform = `translate(${transformPoint})`
  shape.style.transformOrigin = `${transformOrigin}`

  code.textContent = `
.box {
    width: 250px;
    height: 250px;
    transform-origin: ${transformOrigin.trim()};
}`
  // Actualizar resaltado con Highlight.js
  delete code.dataset.highlighted
  hljs.highlightElement(code)
}

function initializeAutopilot() {
  autopilot = setTimeout(() => {
    change()
    autopilot = setInterval(change, 5000)
  }, 1500)
}

function updateDimensions() {
  if (window.innerWidth !== width || window.innerHeight !== height) {
    box = origin.getBoundingClientRect()
    width = window.innerWidth
    height = window.innerHeight
    side = box.right - box.left
  }
}

function onPress(e) {
  clearTimeout(autopilot)
  clearInterval(autopilot)

  const x = e.clientX || e.changedTouches[0].clientX
  const y = e.clientY || e.changedTouches[0].clientY

  updateDimensions()

  const ex = ((x - box.left) / side) * 100
  const ey = ((y - box.top) / side) * 100

  change(ex, ey)
}

function onChange(e) {
  clearTimeout(autopilot)
  clearInterval(autopilot)

  updateDimensions()

  let xVal = xUnit.value === 'px' ? xValue.value : xValue.value
  let yVal = yUnit.value === 'px' ? yValue.value : yValue.value

  change(xVal, yVal)
}

// Resaltado inicial del bloque de salida de codigo
hljs.highlightElement(code)

viewver.addEventListener('mouseup', onPress)
viewver.addEventListener('touchend', onPress)
xValue.oninput = onChange
yValue.oninput = onChange

initializeAutopilot()
