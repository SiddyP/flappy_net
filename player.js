class Player {
    constructor(x, y, velX, model) {
        this.x = x;
        this.y = y;
        this.velY = 0
        this.velX = velX
        this.size = 15
        this.fitness = 0
        this.actions_taken = [];
        this.model = model
    }

    show() {
        noStroke();
        fill(255,255,0);
        ellipse(this.x,this.y,this.size);
    }

    distance(pipe) {
        let x_dist = pipe.x_b - this.x
        let y_dist_bottom = (pipe.y_b - pipe.height_b) - this.y
        let y_dist_top = this.y - (pipe.y_t + pipe.height_t)
        return [x_dist, y_dist_bottom, y_dist_top]
    }

    flap(){
        this.velY -= 10
    }

    random_action(){
        let p = Math.random()
        if (p > 0.5) {
            this.velY -= 1
            this.actions_taken.push(1)
            return 1
        } else {
            this.actions_taken.push(0)
            return 0
        }
    }

    model_action(model, inpt){
        return model.predict(inpt)
    }


    update(){
        this.velY += gravity;
        this.y += this.velY;
        this.x += this.velX;
        this.fitness += 0.01

        //Manual override
        if (keyIsDown(UP_ARROW)){
            this.velY -= 1
            print(this.velY)
        }

        if (keyIsDown(DOWN_ARROW)) {
            this.velY += 0.5
            print(this.velY)
        }

        //Max speed
        if (this.velY > 10) {
            this.velY = 10
        }

        //Boundaries 
        if (this. y < 10) {
            this.y = 10
        } else if (this.y > 990){
            this.y = 990
        }
    }

}