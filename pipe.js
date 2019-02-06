class Pipe {
    constructor(x_b, y_b, x_t, y_t, width, velX) {
        this.x_b = x_b;
        this.y_b = y_b;
        this.x_t = x_t;
        this.y_t = y_t;
        this.width = width
        this.gap = 120
        this.height_b = Math.floor(Math.random() * Math.floor(300)) + 70
        this.height_t = game_height - this.gap -this.height_b
        this.velX = velX
    }

    show(){
        noStroke();
        fill(0,255,0);
        rect(this.x_b, this.y_b, this.width, -this.height_b);
        rect(this.x_t, this.y_t, this.width, this.height_t);
        
    }

    update(){
        this.x_b -= this.velX
        this.x_t -= this.velX
    }

    colided(p) {
        if  (p.y > game_height || p.y < 0) {
            return true
        }
        if (p.x + p.size / 2 > this.x_b && p.x - p.size / 2 < this.x_b + this.width ) {
            if (p.y - p.size / 2 < this.height_t || p.y + p.size / 2 > this.y_b - this.height_b) {
                return true
            }
        } 
    }
}