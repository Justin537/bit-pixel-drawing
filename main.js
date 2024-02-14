/**
 * @type HTMLCanvasElement
 */
const canvas = document.getElementById("canvas");
const guide = document.getElementById("guide");
const colorInput = document.getElementById("colorInput");
const toggleGuide = document.getElementById("toggleGuide");
const clearButton = document.getElementById("clearButton");
const resizeButton = document.getElementById("resizeButton");
const saveButton = document.getElementById("saveButton");
const gridXInput = document.getElementById("gridXInput");
const gridYInput = document.getElementById("gridYInput");
const drawingContext = canvas.getContext("2d");

let gridXCount = parseInt(gridXInput.value);
let gridYCount = parseInt(gridYInput.value);
let cellPixelWidth = canvas.width / gridXCount;
let cellPixelHeight = canvas.height / gridYCount;
const colorHistory = {};

// Set default color
colorInput.value = "#009578";

// Initialize the canvas background
drawingContext.fillStyle = "#ffffff";
drawingContext.fillRect(0, 0, canvas.width, canvas.height);

// Setup the guide
function setupGuide() {
  guide.style.width = `${canvas.width}px`;
  guide.style.height = `${canvas.height}px`;
  guide.style.gridTemplateColumns = `repeat(${gridXCount}, 1fr)`;
  guide.style.gridTemplateRows = `repeat(${gridYCount}, 1fr)`;

  guide.innerHTML = "";
  [...Array(gridXCount * gridYCount)].forEach(() =>
    guide.insertAdjacentHTML("beforeend", "<div></div>")
  );
}

setupGuide();

function handleCanvasMousedown(e) {
  // Ensure the user is using their primary mouse button
  if (e.button !== 0) {
    return;
  }

  const canvasBoundingRect = canvas.getBoundingClientRect();
  const x = e.clientX - canvasBoundingRect.left;
  const y = e.clientY - canvasBoundingRect.top;
  const cellX = Math.floor(x / cellPixelWidth);
  const cellY = Math.floor(y / cellPixelHeight);
  const currentColor = colorHistory[`${cellX}_${cellY}`];

  if (e.ctrlKey) {
    if (currentColor) {
      colorInput.value = currentColor;
    }
  } else {
    fillCell(cellX, cellY);
  }
}

function handleClearButtonClick() {
  const yes = confirm("Are you sure you wish to clear the canvas?");

  if (!yes) return;

  drawingContext.fillStyle = "#ffffff";
  drawingContext.fillRect(0, 0, canvas.width, canvas.height);
}

function handleToggleGuideChange() {
  guide.style.display = toggleGuide.checked ? null : "none";
}

function handleResizeButtonClick() {
  const newGridXCount = parseInt(gridXInput.value);
  const newGridYCount = parseInt(gridYInput.value);

  if (!isNaN(newGridXCount) && !isNaN(newGridYCount) && newGridXCount > 0 && newGridYCount > 0) {
    gridXCount = newGridXCount;
    gridYCount = newGridYCount;
    cellPixelWidth = canvas.width / gridXCount;
    cellPixelHeight = canvas.height / gridYCount;

    setupGuide();
  }
}

function handleSaveButtonClick() {
  const dataURL = canvas.toDataURL("image/jpeg");
  const link = document.createElement("a");
  link.href = dataURL;
  link.download = "Pixel_image.jpg";
  link.click();
}

function fillCell(cellX, cellY) {
  const startX = cellX * cellPixelWidth;
  const startY = cellY * cellPixelHeight;

  drawingContext.fillStyle = colorInput.value;
  drawingContext.fillRect(startX, startY, cellPixelWidth, cellPixelHeight);
  colorHistory[`${cellX}_${cellY}`] = colorInput.value;
}

canvas.addEventListener("mousedown", handleCanvasMousedown);
clearButton.addEventListener("click", handleClearButtonClick);
toggleGuide.addEventListener("change", handleToggleGuideChange);
resizeButton.addEventListener("click", handleResizeButtonClick);
saveButton.addEventListener("click", handleSaveButtonClick);
