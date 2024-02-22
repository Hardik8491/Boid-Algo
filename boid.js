
function distance(boid1, boid2, dp){
    if(boid1.id > boid2.id){
        return distance(boid2, boid1, dp);
    }
    let key = boid1.id+" " + boid2.id
    if(dp.has(key)){
        return dp.get(key);
    }
    else{
        dp.set(key, dist(boid1.position.x, boid1.position.y, boid2.position.x, boid2.position.y));
        return dp.get(key);
    }
}
class Boid {
    constructor(e, id) {

        if (!e) {
            this.position = createVector(random(width), random(height));
        }
        if (e) {
            this.position = createVector(e.mouseX, e.mouseY);
        }

        this.velocity = p5.Vector.random2D();
        this.velocity.setMag(random(4, 8));
        this.acceleration = createVector();
        this.maxForce = 0.2;
        this.maxSpeed = 4;
        this.r = 5;
        this.id = id;
    }



    align(boids, dp) {
        
        let sf = createVector();
        let total = 0;
        let perceptionRadius = 25;

        for (let boid of boids) {
            if(boid === this ) continue;
            let d = distance(boid, this, dp);
            if (boid != this && d <= perceptionRadius) {
                sf.add(boid.velocity);
                total++;
            }
        }

        if (total > 0) {
            sf.div(total);
            sf.setMag(this.maxSpeed)
            sf.sub(this.velocity);
            sf.limit(this.maxForce);
        }

        return sf;
    }

    cohesion(boids, dp) {

        let sf = createVector();
        let total = 0;
        let perceptionRadius = 50;

        for (let boid of boids) {
            if(boid === this ) continue
            let d = distance(boid, this, dp);
            if (boid != this && d <= perceptionRadius) {
                sf.add(boid.position);
                total++;
            }
        }

        if (total > 0) {
            sf.div(total);
            sf.sub(this.position);
            sf.setMag(this.maxSpeed)
            sf.sub(this.velocity)
            sf.limit(this.maxForce);
        }

        return sf;
    }

    separation(boids, dp) {
        
        let sf = createVector();
        let total = 0;
        let perceptionRadius = 24;
        for (let boid of boids) {
            if(boid === this ) continue
            let d = distance(boid, this, dp);
            if (boid != this && d <= perceptionRadius) {
                let diff = p5.Vector.sub(this.position, boid.position);
                diff.div(d);
                sf.add(diff);
                total++;
            }
        }
        if (total > 0) {
            sf.div(total);
            sf.setMag(this.maxSpeed)
            sf.sub(this.velocity)
            sf.limit(this.maxForce);
        }

        return sf;

    }

    edge() {
        if (this.position.x > width) {
            this.position.x = 0;
        } else if (this.position.x < 0) {
            this.position.x = width;
        }
        if (this.position.y > height) {
            this.position.y = 0;
        } else if (this.position.y < 0) {
            this.position.y = height;
        }
    }

    flock(boids, dp) {
        let steering = this.align(boids, dp);
        let cohesion = this.cohesion(boids, dp);
        let separation = this.separation(boids, dp);

        separation.mult(Number.parseInt(separationSlider.value));
        cohesion.mult(Number.parseInt(cohesionSlider.value));
        steering.mult(Number.parseInt(alignSlider.value));

        this.acceleration.add(steering);
        this.acceleration.add(cohesion);
        this.acceleration.add(separation);
    }
    update() {
        this.position.add(this.velocity);
        this.velocity.add(this.acceleration);
        this.velocity.limit(this.maxSpeed)
        this.acceleration.mult(0);
        this.edge();
    }

    show() {
        let theta = this.velocity.heading() + radians(90);
        fill(127);
        stroke(200);
        push();
        translate(this.position.x, this.position.y);
        rotate(theta);
        beginShape();
        vertex(0, -this.r * 2);
        vertex(-this.r, this.r * 2);
        vertex(this.r, this.r * 2);
        endShape(CLOSE);
        pop();

    }
}