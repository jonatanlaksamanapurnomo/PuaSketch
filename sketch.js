let model;

let previous_pen = 'down';

let x, y;

let strokePath;
let seedStrokes = [];


let canvas;

function setup() {
    canvas = createCanvas(innerWidth, innerHeight);
    canvas.hide();
    background("#f2dbff");
    model = ml5.sketchRNN('pig', modelReady);

    let button = select('#clear');
    button.mousePressed(clearDrawing);

}


// The model is ready
function modelReady() {
    canvas.show();
    canvas.mouseReleased(startSketchRNN);
    select('#status').html('Happy draw !!');
}

// Reset the drawing
function clearDrawing() {
    background("#f2dbff");
    seedStrokes = [];
    model.reset();
}

// sketchRNN takes over
function startSketchRNN() {
    x = mouseX;
    y = mouseY;
    model.generate(seedStrokes, gotStroke);
}

function draw() {

    if (mouseIsPressed) {
        stroke(0);
        strokeWeight(3.0);
        line(pmouseX, pmouseY, mouseX, mouseY);

        let userStroke = {
            dx: mouseX - pmouseX,
            dy: mouseY - pmouseY,
            pen: 'down'
        };

        seedStrokes.push(userStroke);
    }


    if (strokePath) {
        if (previous_pen == 'down') {
            stroke(0);
            strokeWeight(3.0);
            line(x, y, x + strokePath.dx, y + strokePath.dy);
        }

        x += strokePath.dx;
        y += strokePath.dy;

        previous_pen = strokePath.pen;
        if (strokePath.pen !== 'end') {
            strokePath = null;
            model.generate(gotStroke);
        }
    }
}

// A new stroke path
function gotStroke(err, s) {
    strokePath = s;
}