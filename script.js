const flock = [];
let alignSlider, cohesionSlider, separationSlider, count, fps, qcount, showQuadTree;

var qt;


function insertBoid(e) {
    let boid;
    if (!e) {
        boid = new Boid();

    }
    else {
        boid = new Boid({ mouseX, mouseY });
    }
    flock.push(boid);
    qt.insert(boid);
    return true;

}


function setup() {
    createCanvas(800, 600);

    alignSlider = document.getElementById('alignSlider');
    showQuadTree = document.getElementById('quadtree');
    cohesionSlider = document.getElementById('cohesionSlider');
    separationSlider = document.getElementById('separationSlider');
    count = document.getElementById('count');
    qcount = document.getElementById('qcount');
    fps = document.getElementById('fps');


    let boundary = new Rectangle(400, 300, 400, 300);
    qt = new QuadTree(boundary, 3);



    for (var i = 0; i < 45; i++) {
        insertBoid();
    }

    count.innerHTML = ` ${flock.length}, ${qt.calc()}`;

}



function draw() {
    fps.innerHTML = frameRate();
    let boundary = new Rectangle(400, 300, 400, 300);

    qt = new QuadTree(boundary, 2);
    for (let boid of flock) {
        qt.insert(boid);
    }




    background(0);

    if (showQuadTree.checked)
        qt.show();

    let dp = new Map();
    for (let boid of flock) {
        var snapshot = [...flock];
        boid.flock(snapshot, dp);
        boid.update();
        boid.show();
    }
    delete dp;
}

function mouseDragged(e) {
    if (e.target !== canvas) {
        return false;
    }
    insertBoid(e);
    count.innerHTML = ` ${flock.length}, ${qt.calc()}`;
}
