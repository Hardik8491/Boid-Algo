function distance(boid1, boid2) {
  return dist(
    boid1.position.x,
    boid1.position.y,
    boid2.position.x,
    boid2.position.y
  );
}
class Boid {
  constructor(e) {
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
    this.perceptionRadius = 3;
  }

  align(nearby) {
    let sf = createVector();
    let total = 0;
    for (let boid of nearby) {
      if (boid === this) continue;
      sf.add(boid.velocity);
      total++;
    }

    if (total > 0) {
      sf.div(total);
      sf.setMag(this.maxSpeed);
      sf.sub(this.velocity);
      sf.limit(this.maxForce);
    }
    return sf;
  }

  cohesion(nearby) {
    let sf = createVector();
    let total = 0;

    for (let boid of nearby) {
      if (boid === this) continue;
      sf.add(boid.position);
      total++;
    }

    if (total > 0) {
      sf.div(total);
      sf.sub(this.position);
      sf.setMag(this.maxSpeed);
      sf.sub(this.velocity);
      sf.limit(this.maxForce);
    }

    return sf;
  }

  separation(boids) {
    let sf = createVector();
    let total = 0;
    let perceptionRadius = 24;
    for (let boid of boids) {
      if (boid === this) continue;
      let d = distance(boid, this);
      if (boid != this && d <= perceptionRadius) {
        let diff = p5.Vector.sub(this.position, boid.position);
        diff.div(d);
        sf.add(diff);
        total++;
      }
    }
    if (total > 0) {
      sf.div(total);
      sf.setMag(this.maxSpeed);
      sf.sub(this.velocity);
      sf.limit(0.3);
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
    let nearby = qt.query(
      new Rectangle(this.position.x, this.position.y, 25, 25)
    );
    qcount.innerHTML = nearby.length;

    let steering = this.align(nearby, dp);
    nearby = qt.query(new Rectangle(this.position.x, this.position.y, 50, 50));
    let cohesion = this.cohesion(nearby, dp);
    nearby = qt.query(new Rectangle(this.position.x, this.position.y, 24, 24));
    let separation = this.separation(nearby, dp);

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
    this.velocity.limit(this.maxSpeed);
    this.acceleration.mult(0);
    this.edge();
  }

  show() {
    let theta = this.velocity.heading() + radians(90);
    fill(random(255), random(255), random(255));
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
