class Firefly {
    constructor() {
        this.position = createVector(random() * width, random() * height);
        this.velocity = p5.Vector.random2D();
        this.velocity.mag(random() * 1.5);
        this.acceleration = createVector();
        this.max_force = 0.1;
        this.max_speed = 3;

        this.flash_period = 100;
        this.urge = 1;
        this.urge_limit = 13;
        this.flash = false;
        this.flash_position = random() * this.flash_period;
        this.flash_length = 30;
        this.flash_frame_counter = 0;
    }

    flashing(nearby_flys, snapshot) {
        let perception_range = 100;

        // influence the urges of neighbors when flashing:
        if (this.flash == true && this.flash_frame_counter == 1) { //this.flash_length / 2) {
            for (let i = 0; i < nearby_flys.length; i++) {
                // for (let neighbor of nearby_flys) {
                let neighbor = snapshot[i]
                let d = dist(this.position.x, this.position.y, neighbor.position.x, neighbor.position.y);
                if (neighbor != this && d < perception_range) { //&& neighbor.flash == false) {
                    nearby_flys[i].urge = neighbor.urge * 1.1;
                }
            }
        }

        // Spontaneous flash based on urge:
        let rng = random() * 100
        if (this.flash == false && this.urge > rng) {
            console.log(rng, this.urge)
            this.flash = true;
            this.urge = 1;
            this.flash_position = 0;
        }

        // Flash once per period:
        else if (this.flash_position > this.flash_period) {
            this.flash = true;
            this.urge = 1;
            this.flash_position = 0;
        } else {
            this.flash_position++
        }
    }

    flock_behaviour(fly_list) {
        this.acceleration.set(0, 0)
        let alignment = this.align(fly_list);
        this.acceleration.add(alignment);
        let cohesion = this.cohesion(fly_list);
        this.acceleration.add(cohesion);
        let separation = this.separation(fly_list);
        this.acceleration.add(separation)
    }

    loop_edges() {
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

    align(nearby_flys) {
        let perception_range = 200;
        let total_influenced_by = 0;
        let steering_force = createVector();
        for (let neighbor of nearby_flys) {
            let d = dist(this.position.x, this.position.y, neighbor.position.x, neighbor.position.y);
            if (neighbor != this && d < perception_range) {
                steering_force.add(neighbor.velocity);
                total_influenced_by++;
            }
        }
        if (total_influenced_by > 0) {
            steering_force.div(total_influenced_by);
            steering_force.setMag(this.max_speed);
            steering_force.sub(this.velocity);
            steering_force.limit(this.max_force)
        }
        return steering_force;
    }

    cohesion(nearby_flys) {
        let perception_range = 200;
        let total_influenced_by = 0;
        let steering_force = createVector();
        for (let neighbor of nearby_flys) {
            let d = dist(this.position.x, this.position.y, neighbor.position.x, neighbor.position.y);
            if (neighbor != this && d < perception_range) {
                steering_force.add(neighbor.position);
                total_influenced_by++;
            }
        }
        if (total_influenced_by > 0) {
            steering_force.div(total_influenced_by);
            steering_force.sub(this.position);
            steering_force.setMag(this.max_speed);
            steering_force.sub(this.velocity);
            steering_force.limit(this.max_force)
        }
        return steering_force;
    }

    separation(nearby_flys) {
        let perception_range = 200;
        let total_influenced_by = 0;
        let steering_force = createVector();
        for (let neighbor of nearby_flys) {
            let d = dist(this.position.x, this.position.y, neighbor.position.x, neighbor.position.y);
            if (neighbor != this && d < perception_range) {
                let difference = p5.Vector.sub(this.position, neighbor.position);
                difference.div(d);
                steering_force.add(difference);
                total_influenced_by++;
            }
        }
        if (total_influenced_by > 0) {
            steering_force.div(total_influenced_by);
            steering_force.setMag(this.max_speed);
            steering_force.sub(this.velocity);
            steering_force.limit(this.max_force)
        }
        return steering_force;
    }

    update_mech() {
        this.position.add(this.velocity);
        this.velocity.add(this.acceleration)
        this.velocity.limit(this.max_speed)
    }

    draw_fly() {
        if (this.flash == true && this.flash_frame_counter < this.flash_length) {
            let flash_diameter = sin((this.flash_frame_counter * 4) / this.flash_length) * 5 + 2
            fill(255, 204, 0)

            circle(this.position.x, this.position.y, flash_diameter);
            this.flash_frame_counter++
        } else if (this.flash_frame_counter == this.flash_length) {
            this.flash = false;
            this.flash_frame_counter = 0;
            fill(255)
            circle(this.position.x, this.position.y, 2);
        } else {
            fill(255)
            circle(this.position.x, this.position.y, 2);
        }
    }

}