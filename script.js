const flock = [];
let alignSlider, cohesionSlider, separationSlider, count;
let img;
let id = 0;


function setup() {

    alignSlider = document.getElementById('alignSlider');
    cohesionSlider = document.getElementById('cohesionSlider');
    separationSlider = document.getElementById('separationSlider');
    count = document.getElementById('count');

    img = loadImage('./bird.png'); // 

    var canvas = createCanvas(800, 600);

   

    for (var i = 0; i < 10; i++) {
        flock.push(new Boid({}, id++));
    }

}

function draw() {
    background(0);
    let dp = new Map();
    for (let boid of flock) {
        var snapshot = [...flock];
        boid.flock(snapshot, dp);
        boid.update();
        boid.show();
    }
    delete dp;
}

function mouseDragged(e){
    if(e.target !== canvas ){
        return false;
    }
    
    flock.push(new Boid({mouseX, mouseY}, id++));
    count.innerHTML = flock.length;
}
