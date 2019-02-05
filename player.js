class Player {
    constructor(x, y, fitness, model, generation, anscestors) {
        this.x = x;
        this.y = y;
        this.velY = 0
        this.size = 15
        this.model = model
        this.score = 0
        this.fitness = fitness
        this.proba = []
        this.generation = generation
        this.anscestors = anscestors
    }

    show() {
        noStroke();
        fill(this.generation,255, 70);
        ellipse(this.x,this.y,this.size);
    }

    //map(value, start1, stop1, start2, stop2, [withinBounds])
    distance(pipe) {
        let x_dist = map(pipe.x_b - pipe.width/2, this.x, game_width, 0, 1)
        let y_dist_bottom = map((pipe.y_b - pipe.height_b) - this.y, 0, game_height, 0, 1) 
        let y_dist_top = map(this.y - (pipe.y_t + pipe.height_t), 0, game_height, 0, 1)
        let y_bird = map(this.y, 0, game_height, 0, 1)
        return [x_dist, y_dist_bottom, y_dist_top, y_bird]
    }

    flap(){
        this.velY -= 10
    }

    model_action(pipe){
        let input = tf.tensor([this.distance(pipe)])
        let output = this.model.predict(input).dataSync()
        
        //console.log(mapped_out)
        if (output[1] > output[0]){
            this.velY -= 6
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
        this.score += 1

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

    }

}