// Obtener referencias a elementos del DOM
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

// Obtener el tamaño del punto desde las variables CSS
const sizePoint = getComputedStyle(point)
  .getPropertyValue('--point')
  .slice(0, -2)

// Variables de estado
let autopilot
let width = window.innerWidth
let height = window.innerHeight
let box = origin.getBoundingClientRect()
let wBox = box.right - box.left
let hBox = box.bottom - box.top

// Función para cambiar la posición del punto y el origen de transformación de la forma
function change(ex, ey) {
  const xIsPercent = xUnit.value === '%'
  const yIsPercent = yUnit.value === '%'

  // verificar si ex y ey son distintos de undefined, caso contraio se genera un numero random
  const x =
    ex ?? (xIsPercent ? Math.random() : Math.floor(Math.random() * (wBox + 1)))
  const y =
    ey ?? (yIsPercent ? Math.random() : Math.floor(Math.random() * (hBox + 1)))

  // Actualizar variables CSS
  style.setProperty('--x', x)
  style.setProperty('--y', y)

  // Calcular los valores de transformación
  const xVal = Math.round(x * (xIsPercent ? 100 : 1))
  const yVal = Math.round(y * (yIsPercent ? 100 : 1))

  // Crear strings de transformación para el origen y el punto
  const transformOrigin = `${xVal}${xUnit.value} ${yVal}${yUnit.value}`
  const transformPoint = `
    ${xIsPercent
      ? Math.round((x * 100 * wBox) / sizePoint - 50) + '%'
      : Math.floor(x - sizePoint / 2) + 'px'
    }, 
    ${yIsPercent
      ? Math.round((y * 100 * hBox) / sizePoint - 50) + '%'
      : Math.floor(y - sizePoint / 2) + 'px'
    }
  `

  // Aplicar transformaciones
  point.style.transform = `translate(${transformPoint})`
  shape.style.transformOrigin = transformOrigin

  // Actualizar el código CSS mostrado en el bloque de codigo
  code.textContent = `
.box {
  width: 250px;
  height: 250px;
  transform-origin: ${transformOrigin.trim()};
}`

  // Actualizar valores de input
  xValue.value = xVal
  yValue.value = yVal

  // Actualizar resaltado con Highlight.js
  delete code.dataset.highlighted
  hljs.highlightElement(code)
}

// Función para inicializar el modo de autopilot
function initializeAutopilot() {
  autopilot = setTimeout(() => {
    change()
    autopilot = setInterval(change, 5000)
  }, 1500)
}

// Función para actualizar dimensiones de la caja
function updateDimensions() {
  if (window.innerWidth !== width || window.innerHeight !== height) {
    box = origin.getBoundingClientRect()
    width = window.innerWidth
    height = window.innerHeight
    wBox = box.right - box.left
    hBox = box.bottom - box.top
  }
}

function clearIntervals() {
  clearTimeout(autopilot)
  clearInterval(autopilot)
}

// Función para manejar el evento de presionar (mouse o toque)
function onPress(e) {
  clearIntervals()
  const x = e.clientX ?? e.changedTouches[0].clientX
  const y = e.clientY ?? e.changedTouches[0].clientY

  updateDimensions()

  const ex = x - box.left
  const ey = y - box.top

  // ex, ey: siempre se obtendran en pixeles, a continuación se transforma, a procentaje
  // o se mantiene en pixeles segun la unidad de cada eje
  change(
    xUnit.value === 'px' ? ex : ex / wBox,
    yUnit.value === 'px' ? ey : ey / hBox
  )
}

// Función para manejar el cambio en los inputs, y selects
function onChange(e) {
  clearIntervals()
  updateDimensions()

  change(
    xUnit.value === 'px' ? xValue.value : xValue.value / 100,
    yUnit.value === 'px' ? yValue.value : yValue.value / 100
  )
}

// Añadir event listeners
viewver.addEventListener('mouseup', onPress)
viewver.addEventListener('touchend', onPress)

// inputs events
xValue.oninput = function () {
  this.value = this.value.slice(0, 3)
  onChange()
}
yValue.oninput = function () {
  this.value = this.value.slice(0, 3)
  onChange()
}

// Select units events
xUnit.onchange = onChange

yUnit.onchange = onChange

// Resaltado inicial del bloque de salida de código
hljs.highlightElement(code)

// Iniciar el autopilot
initializeAutopilot()
