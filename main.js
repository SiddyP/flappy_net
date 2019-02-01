let slider;
let generation_html;
let top_score_html;
function setup() {
    generation_html = select('#generation_html');
    birds_html = select('#birds_html')
    top_score_html = select('#top_score_html')
    createCanvas(800, 1000)
    slider = createSlider(1,10, 1)
}

let gravity = 0.5
let start = new Date().getTime();


const arrAvg = arr => arr.reduce((a,b) => a + b, 0) / arr.length


let pipe_arr = new Array()
let bird_arr = new Array()
let dead_bird_arr = new Array()

//Create players
// function create_players(pop, child_arr) {
//     for (let j = 0; j < child_arr.length; j++) {
//         bird_arr[j] = new Player(50, 400, 0, generate_model(0,child_arr[j]))
//     }

//     for (let i = 0; i < pop-child_arr.length; i++) {
//         bird_arr.push(new Player(50, 400, 0, generate_model(1,0)))      
//     }
// }

function create_players(total_pop, kept_pop) {
    for (let i = 0; i < total_pop; i++) {
        bird_arr.push(new Player(50, 400, 0, generate_model(1, 0)))
    }
    if(kept_pop.length > 0) {
        for (let j = 0; j < kept_pop.length; j++) {
            bird_arr.push(kept_pop[j])
            
        }
    
    }
}


//Genetic functions
function mutate(w){
    if (Math.random() < 0.1) {
        console.log('Mutation occured.')
        let mutagen = randomGaussian() * 0.5
        let neww = w + mutagen
        return neww
    } else {
        return w;
    }
}


  function breed(wx, wy){
    let wz = [];
    for (let i = 0; i < wx.length; i++) {
      let wxwy = (mutate(wx[i]) + mutate(wy[i])) / 2;
      wz.push(wxwy)
    }
    return wz
  } 

  function evolve(weights, n, m){
    let childW = []
    let w1 = weights[weights.length-1*n]
    let w2 = weights[weights.length-2*m]
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


//create_players(20,[])
create_players(20, [])

let draw_counter = 0
let generations = 0
let top_score = 0
function draw() {

    birds_html.html(bird_arr.length)

for (let t = 0; t < slider.value(); t++) {
        

        if (draw_counter % 100 == 0) {
            pipe_arr.push(new Pipe(800, 1000, 800, 0, 75, 5))
        }

    for (let k = 0; k < bird_arr.length; k++) {
        //bird_arr[k].show()
        bird_arr[k].update()

        if (pipe_arr.length > 0) {
            if (draw_counter % 10 == 0){
                let inpt = pipe_arr[0]
                if (inpt[0] < 0) {
                    inpt = pipe_arr[1]
                }

                bird_arr[k].model_action(inpt)

                //console.log('X_dist: ' + String(inpt[0] / 800))
                //console.log('Y_dist_b: ' + String(inpt[1]/1000))
                //console.log('Y_dist_t: ' + String(inpt[2]/1000))
            }

            if (pipe_arr[0].colided(bird_arr[k]) == true) {
                dead_bird_arr.push(bird_arr[k])
                console.log('Bird: died!')
                //console.log(bird_arr[k])
                bird_arr.splice(k, 1)
            }

            if (pipe_arr[0].x_b + pipe_arr[0].width < 0) {
                pipe_arr.shift()
            }
        }
    }

    //Update pipe rendering every step of the draw loop
    for (let i = 0; i < pipe_arr.length; i++) {
        //pipe_arr[i].show()
        pipe_arr[i].update()
    }

    if(bird_arr.length == 0){
        console.log('All birds dead, evolving ...')
        console.log('Generation: ' + String(generations))
        generations += 1
        generation_html.html(generations)
        let weights = [];

        
        for (let i = 0; i < dead_bird_arr.length; i++) {
            let w = dead_bird_arr[i].model.getWeights()
            weights.push(w)
            if (dead_bird_arr[i].score > top_score){
                top_score = dead_bird_arr[i].score
                top_score_html.html(top_score)
            }
        }

        pipe_arr = []
        //Produces child from best and next best bird
        let child1w = evolve(weights, 1, 2)
        //Produces child from 3:rd and 4:th best
        let child2w = evolve(weights, 1, 3)

        let child3w = evolve(weights, 1, 4)

        let child4w = evolve(weights, 2, 3)

        let child5w = evolve(weights, 2, 4)

        //Create new players with the individuals above appended to the player array

       //create_players(20,[child1w, child2w, child3w, child4w, child5w])
        let kept_birds = []
       for (let i = 0; i < 10; i++) {
            //Mutate best birds
           let w = weights[weights.length - 1 - i]
           let wmut = []
           for (let i = 0; i < w.length; i = i + 2) {
               let wtemp = w[i].dataSync()
               let muta = []
               for (let k = 0; k < wtemp.length; k++) {
                   let mut = mutate(wtemp[k])
                   muta.push(mut)
               }
               wmut.push(muta)
           }

           let mut_top_bird = new Player(50, 400, 0, generate_model(2, wmut))
           kept_birds.push(mut_top_bird)
           //kept_birds.push(dead_bird_arr[dead_bird_arr.length-1-i])       
       }
        create_players(25,kept_birds)
        console.log(bird_arr)
        


    }
}

    //Render game
    background(135, 206, 250)

    for (let k = 0; k < bird_arr.length; k++) {
        bird_arr[k].show()
    }

    for (let i = 0; i < pipe_arr.length; i++) {
        pipe_arr[i].show()
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