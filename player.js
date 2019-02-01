class Player {
    constructor(x, y, velX, model) {
        this.x = x;
        this.y = y;
        this.velY = 0
        this.velX = velX
        this.size = 15
        this.fitness = 0
        this.model = model
        this.score = 0
    }

    show() {
        noStroke();
        fill(255,255,0);
        ellipse(this.x,this.y,this.size);
    }

    distance(pipe) {
        let x_dist = this.x - pipe.x_b 
        let y_dist_bottom = (pipe.y_b - pipe.height_b) - this.y
        let y_dist_top = this.y - (pipe.y_t + pipe.height_t)
        return [x_dist / 1000, y_dist_bottom / pipe.height_b, y_dist_top / pipe.height_t, this.y / 1000]
    }

    flap(){
        this.velY -= 10
    }

    model_action(pipe){
        let input = tf.tensor([this.distance(pipe)])
        let output = this.model.predict(input).dataSync()
        if (output > 0.5){
            this.velY -= 10
        } 
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


    update(){
        this.velY += gravity;
        this.y += this.velY;
        this.x += this.velX;
        this.score += 0.01

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