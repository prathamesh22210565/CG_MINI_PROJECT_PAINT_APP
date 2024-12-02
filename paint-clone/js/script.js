// GLOBAL VARIABLES
const canvas = document.querySelector('canvas'),
	toolBtns = document.querySelectorAll('.tool'),
	fillColor = document.querySelector('#fill-color'),
	sizeSlider = document.querySelector('#size-slider'),
	colorBtns = document.querySelectorAll('.colors .option'),
	colorPicker = document.querySelector('#color-picker'),
	clearCanvasBtn = document.querySelector('.clear-canvas'),
	saveImageBtn = document.querySelector('.save-img')

// VARIABLE WITH DEFAULT VALUE
let ctx = canvas.getContext('2d'),
	isDrawing = false,
	brushWidth = 5,
	selectedTool = 'brush',
	selectedColor = '#000',
	prevMouseX,
	prevMouseY,
	snapshot

// SET CANVAS BACKGROUND
const setCannvasBackground = () => {
	ctx.fillStyle = '#fff'
	ctx.fillRect(0, 0, canvas.width, canvas.height)
	ctx.fillStyle = selectedColor
}

// SET CANVAS WIDTH AND HEIGHT
window.addEventListener('load', () => {
	canvas.width = canvas.offsetWidth
	canvas.height = canvas.offsetHeight
	setCannvasBackground()
})

// START DRAWING
const startDraw = e => {
	isDrawing = true
	prevMouseX = e.offsetX
	prevMouseY = e.offsetY
	ctx.beginPath()
	ctx.lineWidth = brushWidth
	ctx.strokeStyle = selectedColor
	ctx.fillStyle = selectedColor
	snapshot = ctx.getImageData(0, 0, canvas.width, canvas.height)
}

// DRAW RECTANGLE
const drawRectangle = e => {
	fillColor.checked
		? ctx.fillRect(e.offsetX, e.offsetY, prevMouseX - e.offsetX, prevMouseY - e.offsetY)
		: ctx.strokeRect(e.offsetX, e.offsetY, prevMouseX - e.offsetX, prevMouseY - e.offsetY)
}

// DRAW CIRCLE
const drawCircle = e => {
	ctx.beginPath()
	const radius =
		Math.sqrt(Math.pow(prevMouseX - e.offsetX, 2)) + Math.pow(prevMouseY - e.offsetY, 2)
	ctx.arc(prevMouseX, prevMouseY, radius, 0, 2 * Math.PI)
	fillColor.checked ? ctx.fill() : ctx.stroke()
}

// DRAW TRIANGLE
const drawTriangle = e => {
	ctx.beginPath()
	ctx.moveTo(prevMouseX, prevMouseY)
	ctx.lineTo(e.offsetX, e.offsetY)
	ctx.lineTo(prevMouseX * 2 - e.offsetX, e.offsetY)
	ctx.closePath()
	fillColor.checked ? ctx.fill() : ctx.stroke()
}

// DRAWING
const drawing = e => {
	if (!isDrawing) return
	ctx.putImageData(snapshot, 0, 0)

	switch (selectedTool) {
		case 'brush':
			ctx.lineTo(e.offsetX, e.offsetY)
			ctx.stroke()
			break
		case 'rectangle':
			drawRectangle(e)
			break
		case 'circle':
			drawCircle(e)
			break
		case 'triangle':
			drawTriangle(e)
			break
		case 'eraser':
			ctx.strokeStyle = '#fff'
			ctx.lineTo(e.offsetX, e.offsetY)
			ctx.stroke()
			break
		default:
			break
	}
}

// TOOLS BTN AND SET TO VARIABLES SELECTED TOOL
toolBtns.forEach(btn => {
	btn.addEventListener('click', () => {
		document.querySelector('.options .active').classList.remove('active')
		btn.classList.add('active')
		selectedTool = btn.id
	})
})

// CHANGE BRUSH WITH
sizeSlider.addEventListener('change', () => (brushWidth = sizeSlider.value))

// SET COLOR TO SHAPES
colorBtns.forEach(btn => {
	btn.addEventListener('click', e => {
		document.querySelector('.options .selected').classList.remove('selected')
		btn.classList.add('selected')
		const bgColor = window.getComputedStyle(btn).getPropertyValue('background-color')
		selectedColor = bgColor
	})
})

// SET COLOR FROM COLOR PICKER
colorPicker.addEventListener('change', () => {
	colorPicker.parentElement.style.background = colorPicker.value
	colorPicker.parentElement.click()
})

// CLEAR CANVAS BUTTON
clearCanvasBtn.addEventListener('click', () => {
	ctx.clearRect(0, 0, canvas.width, canvas.height)
	setCannvasBackground()
})

// SAVE LIKE IMAGE OUR PAINT
saveImageBtn.addEventListener('click', () => {
	const link = document.createElement('a')
	link.download = `paint${Date.now()}.jpg`
	link.href = canvas.toDataURL()
	link.click()
})

// STOP DRAWING
const stopDraw = () => {
	isDrawing = false
}

canvas.addEventListener('mousedown', startDraw)
canvas.addEventListener('mousemove', drawing)
canvas.addEventListener('mouseup', stopDraw)

// Ensure all elements exist in the HTML

const setCanvasBackground = () => {
	ctx.fillStyle = '#fff';
	ctx.fillRect(0, 0, canvas.width, canvas.height);
	ctx.fillStyle = selectedColor;
};

window.addEventListener('load', () => {
	canvas.width = canvas.offsetWidth;
	canvas.height = canvas.offsetHeight;
	setCanvasBackground();
});

let startPoint = null,
	endPoint = null,
	selectedDrawingAlgorithm = '';


// Select the slider and speed display element
const speedSlider = document.getElementById('speed-slider');
const speedValue = document.getElementById('speed-value');

// Default delay (0ms)
let delay = 0;


// Update delay when slider value changes
speedSlider.addEventListener('input', (e) => {
	delay = parseInt(e.target.value)/10;
	speedValue.textContent = `${delay}ms`;
});

// Delay utility function
const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Select the drawing algorithm
const selectDrawingAlgorithm = (algorithm) => {
	selectedDrawingAlgorithm = algorithm;
	document.querySelector('.options .active')?.classList.remove('active');
	document.getElementById(`${algorithm}`).classList.add('active');
};

// Drawing DDA Line
const drawLineDDA = async (x1, y1, x2, y2) => {
	let dx = x2 - x1, dy = y2 - y1;
	let steps = Math.max(Math.abs(dx), Math.abs(dy));
	let xInc = dx / steps, yInc = dy / steps;
	let x = x1, y = y1;

	for (let i = 0; i <= steps; i++) {
		ctx.fillRect(Math.round(x), Math.round(y), 1, 1);
		x += xInc;
		y += yInc;

		if (delay > 0) await sleep(delay);
	}
};

// Drawing Bresenham Line
const drawLineBresenham = async (x1, y1, x2, y2) => {
	let dx = Math.abs(x2 - x1), dy = Math.abs(y2 - y1);
	let sx = x1 < x2 ? 1 : -1, sy = y1 < y2 ? 1 : -1;
	let err = dx - dy;

	while (true) {
		ctx.fillRect(x1, y1, 1, 1);
		if (x1 === x2 && y1 === y2) break;

		let e2 = 2 * err;
		if (e2 > -dy) {
			err -= dy;
			x1 += sx;
		}
		if (e2 < dx) {
			err += dx;
			y1 += sy;
		}

		if (delay > 0) await sleep(delay);  
	}
};

// Drawing Bresenham Circle
const drawCircleBresenham = async (xc, yc, r) => {
	let x = 0, y = r, d = 3 - 2 * r;

	const plotCirclePoints = async (xc, yc, x, y) => {
		ctx.fillRect(xc + x, yc + y, 1, 1);
		ctx.fillRect(xc - x, yc + y, 1, 1);
		ctx.fillRect(xc + x, yc - y, 1, 1);
		ctx.fillRect(xc - x, yc - y, 1, 1);
		ctx.fillRect(xc + y, yc + x, 1, 1);
		ctx.fillRect(xc - y, yc + x, 1, 1);
		ctx.fillRect(xc + y, yc - x, 1, 1);
		ctx.fillRect(xc - y, yc - x, 1, 1);
		if (delay > 0) await sleep(delay);
	};

	while (y >= x) {
		await plotCirclePoints(xc, yc, x, y);
		plotCirclePoints(xc, yc, x, y);
		x++;
		if (d > 0) {
			y--;
			d += 4 * (x - y) + 10;
		} else {
			d += 4 * x + 6;
		}
	}
};

const handleDraw = (e) => {
	if (clippingMode) return; // Skip if clipping mode is active.

	if (!startPoint) {
		startPoint = { x: e.offsetX, y: e.offsetY };
		ctx.fillRect(startPoint.x - 3, startPoint.y - 3, 6, 6);
	} else {
		endPoint = { x: e.offsetX, y: e.offsetY };
		ctx.fillRect(endPoint.x - 3, endPoint.y - 3, 6, 6);

		if (selectedDrawingAlgorithm === 'dda-line') {
			drawLineDDA(startPoint.x, startPoint.y, endPoint.x, endPoint.y);
		} else if (selectedDrawingAlgorithm === 'bresenham-line') {
			drawLineBresenham(startPoint.x, startPoint.y, endPoint.x, endPoint.y);
		} else if (selectedDrawingAlgorithm === 'bresenham-circle') {
			const radius = Math.round(
				Math.sqrt(Math.pow(endPoint.x - startPoint.x, 2) + Math.pow(endPoint.y - startPoint.y, 2))
			);
			drawCircleBresenham(startPoint.x, startPoint.y, radius);
		}

		startPoint = null;
		endPoint = null;
	}
};

// Add Event Listeners
document.getElementById('dda-line').addEventListener('click', () => selectDrawingAlgorithm('dda-line'));
document.getElementById('bresenham-line').addEventListener('click', () => selectDrawingAlgorithm('bresenham-line'));
document.getElementById('bresenham-circle').addEventListener('click', () => selectDrawingAlgorithm('bresenham-circle'));

canvas.addEventListener('click', handleDraw);



let polygonPoints = [];

const scanLineFill = async (polygon) => {
	const edges = [];
	const n = polygon.length;

	// Collect edges for the polygon.
	for (let i = 0; i < n; i++) {
			const p1 = polygon[i];
			const p2 = polygon[(i + 1) % n];
			if (p1.y !== p2.y) {
					const edge = {
							yMin: Math.min(p1.y, p2.y),
							yMax: Math.max(p1.y, p2.y),
							xOfYMin: p1.y < p2.y ? p1.x : p2.x,
							slopeInverse: (p2.x - p1.x) / (p2.y - p1.y),
					};
					edges.push(edge);
			}
	}

	edges.sort((a, b) => a.yMin - b.yMin); // Sort edges by yMin

	// Find the range of y values to scan.
	const yStart = Math.min(...polygon.map(p => p.y));
	const yEnd = Math.max(...polygon.map(p => p.y));

	for (let y = yStart; y <= yEnd; y++) {
			const intersections = [];

			// Find intersections with scan line.
			for (const edge of edges) {
					if (y >= edge.yMin && y < edge.yMax) {
							const x = edge.xOfYMin + edge.slopeInverse * (y - edge.yMin);
							intersections.push(Math.round(x));
					}
			}

			intersections.sort((a, b) => a - b);

			for (let i = 0; i < intersections.length; i += 2) {
					for (let x = intersections[i]; x <= intersections[i + 1]; x++) {
							ctx.fillRect(x, y, 1, 1);
							if (delay > 0) await sleep(delay);
					}
			}
	}
};

const handlePolygonClick = (e) => {
	const point = { x: e.offsetX, y: e.offsetY };
	polygonPoints.push(point);
	ctx.fillRect(point.x - 3, point.y - 3, 6, 6);

	if (polygonPoints.length > 1) {
			const prevPoint = polygonPoints[polygonPoints.length - 2];
			drawLineDDA(prevPoint.x, prevPoint.y, point.x, point.y);
	}
};

const finishPolygonAndFill = () => {
	if (polygonPoints.length > 2) {
			const firstPoint = polygonPoints[0];
			const lastPoint = polygonPoints[polygonPoints.length - 1];
			drawLineDDA(lastPoint.x, lastPoint.y, firstPoint.x, firstPoint.y); // Close the polygon
			scanLineFill(polygonPoints);
			polygonPoints = []; // Reset polygon points after filling
	}
};

document.getElementById('scan-line-fill').addEventListener('click', () => {
	selectedDrawingAlgorithm = 'scan-line-fill';
});

canvas.addEventListener('click', (e) => {
	if (selectedDrawingAlgorithm === 'scan-line-fill') {
			handlePolygonClick(e);
	}
});

document.getElementById('finish-polygon').addEventListener('click', finishPolygonAndFill);


// Global Variables for Clipping Polygon
let clippingPolygonPoints = [];
let clippingMode = false;

// Start Clipping Mode: Enables drawing the polygon.
document.getElementById('clipping-start').addEventListener('click', () => {
	clippingMode = true;
	clippingPolygonPoints = [];
	selectDrawingAlgorithm(''); // Reset other drawing algorithms.
});


// Add Polygon Points on Click
const handleClippingPolygonClick = (e) => {
	if (clippingMode) {
		const point = { x: e.offsetX, y: e.offsetY };
		clippingPolygonPoints.push(point);
		ctx.fillRect(point.x - 3, point.y - 3, 6, 6); // Draw a small point

		// Draw line connecting last two points
		if (clippingPolygonPoints.length > 1) {
			const prevPoint = clippingPolygonPoints[clippingPolygonPoints.length - 2];
			drawLineDDA(prevPoint.x, prevPoint.y, point.x, point.y);
		}
	}
};

// Close the Polygon and Clip
const finishClippingPolygon = () => {
	if (clippingPolygonPoints.length > 2) {
		const firstPoint = clippingPolygonPoints[0];
		const lastPoint = clippingPolygonPoints[clippingPolygonPoints.length - 1];
		drawLineDDA(lastPoint.x, lastPoint.y, firstPoint.x, firstPoint.y);

		ctx.save();
		ctx.beginPath();
		ctx.moveTo(firstPoint.x, firstPoint.y);
		clippingPolygonPoints.forEach(point => ctx.lineTo(point.x, point.y));
		ctx.closePath();
		ctx.clip();

		clippingMode = false; // Turn off clipping mode.
		ctx.restore();
	}
};

// Event Listeners
canvas.addEventListener('click', handleClippingPolygonClick);
document.getElementById('clipping-finish').addEventListener('click', finishClippingPolygon);


let objects = [];  // Store all objects drawn

// Define objects for different shapes
function createRectangle(x, y, width, height, color, isFilled) {
  return {
    type: 'rectangle',
    x, y, width, height,
    color,
    isFilled,
  };
}

function createCircle(x, y, radius, color, isFilled) {
  return {
    type: 'circle',
    x, y, radius,
    color,
    isFilled,
  };
}

function createTriangle(x1, y1, x2, y2, x3, y3, color, isFilled) {
  return {
    type: 'triangle',
    points: [x1, y1, x2, y2, x3, y3],
    color,
    isFilled,
  };
}

// Add objects to the canvas array
function addObject(shape) {
  objects.push(shape);
}

// Check if mouse is within rectangle bounds
function isMouseOverRectangle(mouseX, mouseY, rect) {
  return (
    mouseX >= rect.x && mouseX <= rect.x + rect.width &&
    mouseY >= rect.y && mouseY <= rect.y + rect.height
  );
}

// Check if mouse is within circle bounds
function isMouseOverCircle(mouseX, mouseY, circle) {
  const dist = Math.sqrt(Math.pow(mouseX - circle.x, 2) + Math.pow(mouseY - circle.y, 2));
  return dist <= circle.radius;
}

// Check if mouse is within triangle bounds
function isMouseOverTriangle(mouseX, mouseY, triangle) {
  const [x1, y1, x2, y2, x3, y3] = triangle.points;
  // Use the barycentric technique to check if the point is inside the triangle
  const area = 0.5 * (-y2 * x3 + y1 * (-x2 + x3) + x1 * (y2 - y3) + x2 * y3);
  const sign = (x, y, x1, y1, x2, y2) => (x - x2) * (y1 - y2) - (x1 - x2) * (y - y2);

  const s1 = sign(mouseX, mouseY, x1, y1, x2, y2);
  const s2 = sign(mouseX, mouseY, x2, y2, x3, y3);
  const s3 = sign(mouseX, mouseY, x3, y3, x1, y1);

  const hasNeg = s1 < 0 || s2 < 0 || s3 < 0;
  const hasPos = s1 > 0 || s2 > 0 || s3 > 0;
  return !(hasNeg && hasPos);
}

let selectedObject = null;
let offsetX = 0, offsetY = 0;

// Handle mouse down to start dragging
canvas.addEventListener('mousedown', (e) => {
  const mouseX = e.offsetX;
  const mouseY = e.offsetY;

  // Check if the mouse is over any object
  for (let i = 0; i < objects.length; i++) {
    const obj = objects[i];
    let isSelected = false;

    switch (obj.type) {
      case 'rectangle':
        isSelected = isMouseOverRectangle(mouseX, mouseY, obj);
        break;
      case 'circle':
        isSelected = isMouseOverCircle(mouseX, mouseY, obj);
        break;
      case 'triangle':
        isSelected = isMouseOverTriangle(mouseX, mouseY, obj);
        break;
    }

    if (isSelected) {
      selectedObject = obj;
      offsetX = mouseX - obj.x;
      offsetY = mouseY - obj.y;
      break;
    }
  }
});

// Handle mouse move to drag the selected object
canvas.addEventListener('mousemove', (e) => {
  if (selectedObject) {
    const mouseX = e.offsetX;
    const mouseY = e.offsetY;

    // Move the object based on mouse position
    selectedObject.x = mouseX - offsetX;
    selectedObject.y = mouseY - offsetY;

    redrawCanvas();  // Redraw all objects after moving
  }
});

// Handle mouse up to stop dragging
canvas.addEventListener('mouseup', () => {
  selectedObject = null;  // Deselect object when mouse is released
});

// Redraw all objects on the canvas
function redrawCanvas() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);  // Clear canvas first

  // Redraw all objects
  objects.forEach((obj) => {
    ctx.fillStyle = obj.color;
    ctx.strokeStyle = obj.color;

    switch (obj.type) {
      case 'rectangle':
        if (obj.isFilled) {
          ctx.fillRect(obj.x, obj.y, obj.width, obj.height);
        } else {
          ctx.strokeRect(obj.x, obj.y, obj.width, obj.height);
        }
        break;
      case 'circle':
        ctx.beginPath();
        ctx.arc(obj.x, obj.y, obj.radius, 0, 2 * Math.PI);
        if (obj.isFilled) {
          ctx.fill();
        } else {
          ctx.stroke();
        }
        break;
      case 'triangle':
        ctx.beginPath();
        ctx.moveTo(obj.points[0], obj.points[1]);
        ctx.lineTo(obj.points[2], obj.points[3]);
        ctx.lineTo(obj.points[4], obj.points[5]);
        ctx.closePath();
        if (obj.isFilled) {
          ctx.fill();
        } else {
          ctx.stroke();
        }
        break;
    }
  });
}

// Store objects drawn on canvas
// let objects = [];

// Utility to save an object
const saveObject = (type, props) => {
  objects.push({ type, ...props, transforms: { translate: { x: 0, y: 0 }, rotate: 0, scale: 1 } });
};

// Clear and re-render all objects
const renderObjects = () => {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  setCanvasBackground();

  objects.forEach(obj => {
    ctx.save(); // Save the context state
    ctx.translate(obj.transforms.translate.x, obj.transforms.translate.y); // Apply translation
    ctx.rotate(obj.transforms.rotate); // Apply rotation
    ctx.scale(obj.transforms.scale, obj.transforms.scale); // Apply scaling

    switch (obj.type) {
      case 'rectangle':
        drawSavedRectangle(obj);
        break;
      case 'circle':
        drawSavedCircle(obj);
        break;
      case 'triangle':
        drawSavedTriangle(obj);
        break;
      default:
        break;
    }
    ctx.restore(); // Restore context state
  });
};

// Functions to draw saved objects
const drawSavedRectangle = obj => {
  ctx.beginPath();
  fillColor.checked
    ? ctx.fillRect(obj.x, obj.y, obj.width, obj.height)
    : ctx.strokeRect(obj.x, obj.y, obj.width, obj.height);
};

const drawSavedCircle = obj => {
  ctx.beginPath();
  ctx.arc(obj.x, obj.y, obj.radius, 0, 2 * Math.PI);
  fillColor.checked ? ctx.fill() : ctx.stroke();
};

const drawSavedTriangle = obj => {
  ctx.beginPath();
  ctx.moveTo(obj.x, obj.y);
  ctx.lineTo(obj.x1, obj.y1);
  ctx.lineTo(obj.x2, obj.y2);
  ctx.closePath();
  fillColor.checked ? ctx.fill() : ctx.stroke();
};

// Capture drawing functions to save shapes


// Add Transformation Functions
const transformObject = (index, transformType, value) => {
  const obj = objects[index];
  switch (transformType) {
    case 'translate':
      obj.transforms.translate.x += value.x;
      obj.transforms.translate.y += value.y;
      break;
    case 'rotate':
      obj.transforms.rotate += value;
      break;
    case 'scale':
      obj.transforms.scale *= value;
      break;
    default:
      break;
  }
  renderObjects();
};

// Event Listeners for transformations
document.getElementById('translate-btn').addEventListener('click', () => {
  const index = parseInt(prompt('Enter object index to translate:'));
  const x = parseInt(prompt('Translate X by:'));
  const y = parseInt(prompt('Translate Y by:'));
  transformObject(index, 'translate', { x, y });
});

document.getElementById('rotate-btn').addEventListener('click', () => {
  const index = parseInt(prompt('Enter object index to rotate:'));
  const angle = parseFloat(prompt('Rotate by angle (radians):'));
  transformObject(index, 'rotate', angle);
});

document.getElementById('scale-btn').addEventListener('click', () => {
  const index = parseInt(prompt('Enter object index to scale:'));
  const factor = parseFloat(prompt('Scale by factor:'));
  transformObject(index, 'scale', factor);
});
