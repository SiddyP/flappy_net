function setup() {
    createCanvas(800, 1000)
}

let gravity = 0.5
let start = new Date().getTime();

let action = 0
const arrAvg = arr => arr.reduce((a,b) => a + b, 0) / arr.length


let pipe_arr = new Array()
let bird_arr = new Array()
let dead_bird_arr = new Array()
let nn_output_arr = new Array()
let loggerm = [1,2,3]

//Create players
function create_players(pop, child_arr) {
    for (let j = 0; j < child_arr.length; j++) {
        bird_arr[j] = new Player(50, 400, 0, generate_model(1,child_arr[j]))
    }

    for (let i = 0; i < pop-child_arr.length; i++) {
        bird_arr.push(new Player(50, 400, 0, generate_model(1,0)))      
    }
}

function trace(x,y){
    point(x+500,y+500)
    stroke(255)
    translate(1,1)
}

//Genetic functions
function mutate(w){
    let p = Math.random();
    if (p < 0.03) {
      console.log('Mutation occured.')
      w = w*Math.random()
    }
    return w
  }


  function breed(wx, wy){
    let wz = [];
    for (let i = 0; i < wx.length; i++) {
      let wxwy = (mutate(wx[i]) + mutate(wy[i])) / 2;
      wz.push(wxwy)
    }
    return wz
  } 

  function evolve(weights, n){
    let childW = []
    let w1 = weights[weights.length-1*n]
    let w2 = weights[weights.length-2*n]
    //The best birds are located in the end of the array, breed the best two and the best second two birds
    for (let i = 0; i < w1.length; i = i + 2) {
        let wx = w1[i].dataSync();
        let wy = w2[i].dataSync();
        
        //Child weights
        let wz = breed(wx, wy)
        childW.push(wz)
    }            
    //evos += 1
    return childW
}


create_players(20,[])

let draw_counter = 0
function draw() {
    background(135, 206, 250)
    let stop = new Date().getTime();



        if (stop - start > 3000) {
            start = stop
            pipe_arr.push(new Pipe(800, 1000, 800, 0, 75, 3))
        }


    for (let k = 0; k < bird_arr.length; k++) {
        bird_arr[k].show()
        bird_arr[k].update()
        //bird_arr[k].random_action()

        if (pipe_arr.length > 0) {
            if (draw_counter % 10 == 0){
                let inpt = bird_arr[k].distance(pipe_arr[0])
                //console.log(inpt)
                let x = tf.tensor([inpt])
                let action = bird_arr[k].model.predict(x)
                const value = action.dataSync()
                //console.log(value)
                nn_output_arr.push(value[0])
                //console.log(arrAvg(nn_output_arr))

                //Average inputs instead
                const normvalue = (value-115) / (115+115)

                if (normvalue > 0){
                    bird_arr[k].flap()
                    //console.log('Bird: ' + String(k) + ' flapped')
                }
            }

            if (pipe_arr[0].colided(bird_arr[k]) == true) {
                dead_bird_arr.push(bird_arr[k])
                console.log('Bird: died!')
                console.log(bird_arr[k])
                bird_arr.splice(k, 1)
            }

            if (pipe_arr[0].x_b + pipe_arr[0].width < 0) {
                pipe_arr.shift()
            }
        }
    }

    //Update pipe rendering every step of the draw loop
    for (let i = 0; i < pipe_arr.length; i++) {
        pipe_arr[i].show()
        pipe_arr[i].update()
    }

    if(bird_arr.length == 0){
        console.log('All birds dead, evolving ...')
        let weights = [];
        for (let i = 0; i < dead_bird_arr.length; i++) {
            let w = dead_bird_arr[i].model.getWeights()
            weights.push(w)
        }

        pipe_arr = []
        //Produces child from best and next best bird
        let child1w = evolve(weights, 1)
        //Produces child from 3:rd and 4:th best
        let child2w = evolve(weights, 2)

        let child3w = evolve(weights, 3)

        //Create new players with the individuals above appended to the player array

        create_players(20,[child1w, child2w, child3w])


    }
draw_counter += 1
}




//Old code 


// function sample_game(){
//     let dist = bird.distance(pipe_arr[0])
//     if (keyIsDown(UP_ARROW) == true) {
//         action = 1
//     } else {
//         action = 0
//     }
//     return [dist, action]
// }