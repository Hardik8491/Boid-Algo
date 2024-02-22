class Rectangle {
    constructor(x, y, w, h) {
        this.x = x;
        this.y = y;
        this.w = w;
        this.h = h;
    }

    overlaps(range) {
        return !(range.x - range.w > this.x + this.w ||
            range.x + range.w < this.x - this.w ||
            range.y - range.h > this.y + this.h ||
            range.y + range.h < this.y - this.h
        );
    }

    contains(boid) {
        return (boid.position.x >= this.x - this.w && boid.position.x <= this.x + this.w &&
            boid.position.y >= this.y - this.h && boid.position.y <= this.y + this.h);
    }
}
class QuadTree {
    constructor(boundary, capacity) {
        this.boids = [];
        this.capacity = capacity;
        this.subdivided = false;
        this.boundary = boundary;
    }

    show() {
        stroke(255);
        noFill();
        rectMode(CENTER);
        rect(this.boundary.x, this.boundary.y, this.boundary.w * 2, this.boundary.h * 2);
        if (this.subdivided) {
            this.northWest.show();
            this.northEast.show();
            this.southWest.show();
            this.southEast.show();
        }
    }

    calc() {
        if (!this.subdivided)
            return this.boids.length;
        return this.boids.length + this.northWest.calc() + this.northEast.calc() + this.southWest.calc() + this.southEast.calc();
    }

    query(range, found) {
        if (!found) found = [];

        if (!this.boundary.overlaps(range)) {
            return found;
        }

        found.push(...this.boids);

        if (this.subdivided) {
            this.northEast.query(range, found);
            this.northWest.query(range, found);
            this.southEast.query(range, found);
            this.southWest.query(range, found);
        }

        return found;
    }

    contains(point) {
        return this.boundary.contains(point);
    }

    subdivide() {
        this.subdivided = true;
        let [x, y, w, h] = [this.boundary.x, this.boundary.y, this.boundary.w / 2, this.boundary.h / 2];

        let ne = new Rectangle(x + w, y - h, w, h);
        this.northEast = new QuadTree(ne, this.capacity);
        let nw = new Rectangle(x - w, y - h, w, h);
        this.northWest = new QuadTree(nw, this.capacity);
        let se = new Rectangle(x + w, y + h, w, h);
        this.southEast = new QuadTree(se, this.capacity);
        let sw = new Rectangle(x - w, y + h, w, h);
        this.southWest = new QuadTree(sw, this.capacity);
    }

    insert(point) {
        if (!this.contains(point)) {
            return false;
        }

        if (this.boids.length < this.capacity) {
            this.boids.push(point);
            return true;
        } else {
            if (!this.subdivided) {
                this.subdivide();
            }
            return this.northWest.insert(point) ? true
                : this.northEast.insert(point) ? true :
                    this.southEast.insert(point) ? true :
                        this.southWest.insert(point);
        }
    }
};
