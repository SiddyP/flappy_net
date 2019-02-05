// Constants
let slider;
var button;
let generation_html;
let top_score_html;
let current_score_html;
let game_width = 600
let game_height = 600
let gravity = 0
let pipe_arr = new Array()
let bird_arr = new Array()
let dead_bird_arr = new Array()
let generationColor = 0


//Utils
const arrAvg = arr => arr.reduce((a, b) => a + b, 0) / arr.length
const sortedArr = points => points.sort(function (a, b) { return a - b });
function compareDicts(a, b) {
    if (a.x < b.x) {
        return -1
    } if (a.x > b.x) {
        return 1
    }
    return 0
}


function get_total_score(birds) {
    let total_accuracy = 0
    for (let i = 0; i < birds.length; i++) {
        total_accuracy += birds[i].score
    }
    return total_accuracy
}

function renderGame(){
    //Render game
    background(135, 206, 250)

    for (let k = 0; k < bird_arr.length; k++) {
        bird_arr[k].show()
    }

    for (let i = 0; i < pipe_arr.length; i++) {
        pipe_arr[i].show()
    }
}

function setup() {
    generation_html = select('#generation_html');
    birds_html = select('#birds_html')
    top_score_html = select('#top_score_html')
    current_score_html = select('#current_score_html')
    createCanvas(game_width, game_height)
    slider = createSlider(1, 10, 1)
    button = createButton("toggle render")
}


// Create intital population, if we have breed only 
function create_players(new_population, kept_population) {
    for (let i = 0; i < new_population; i++) {
        bird_arr.push(new Player(50, game_height / 2, 0, 'brain', 0))
    }
    if (kept_population.length > 0) {
        for (let j = 0; j < kept_population.length; j++) {
            bird_arr.push(kept_population[j])  
        }
    }
}

let tot_pop = 500

create_players(tot_pop, [])


//Loop counters
let draw_counter = 0
let generations = 0
let top_score = 0
let current_score = 0

function draw() {

birds_html.html(bird_arr.length)

for (let t = 0; t < slider.value(); t++) {
        
    if (draw_counter % 100 == 0) {
        pipe_arr.push(new Pipe(game_width, game_height, game_width, 0, 75, 4))
    }
    current_score = bird_arr[0].score
    current_score_html.html(current_score)

    for (let k = 0; k < bird_arr.length; k++) {
        bird_arr[k].update()
        

        if (bird_arr[k].score > top_score){
            top_score_html.html(bird_arr[k].score)
        }

        if (pipe_arr.length > 0) {
            gravity = 0.35
            if (draw_counter % 10 == 0){
                let inpt = pipe_arr[0]
                if (inpt[0] < 0) {
                    inpt = pipe_arr[1]
                }
                bird_arr[k].model_action(inpt)
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
        pipe_arr[i].update()
    }

    if(bird_arr.length == 0){
        gravity = 0

        for (let i = 0; i < dead_bird_arr.length; i++) {
            if (dead_bird_arr[i].score > top_score){
                top_score = dead_bird_arr[i].score
                top_score_html.html(top_score)
            }
        }

        generations += 1
        generation_html.html(generations)

        pipe_arr = []
        //pipe_arr.push(new Pipe(game_width, game_height, game_width, 0, 75, 5))


        /////////// EVO STRAT 2 ////////////////
        // Evolve top five birds through randomly selecting gene to keep
        // from mother / father. A bird can father / mother more than one child
        // but father / mother should not be the same (only results in random mutation)

        // Try implementing carrying fitness score through generations?

        // normFitness(dead_bird_arr)
        // console.log(dead_bird_arr)
        // let brds = []
        // brds = generate(dead_bird_arr)
        // console.log(brds)

        normalizeFitness(dead_bird_arr);
        console.log(dead_bird_arr)
        bird_arr = generate(dead_bird_arr);
        dead_bird_arr = bird_arr.slice();
        console.log(bird_arr)
        console.log(dead_bird_arr)

        
        // let kept_birds = []
        // for (let i = 0; i < 100; i++) {
        //     let kept_brain = dead_bird_arr[dead_bird_arr.length-1-i].model
        //     let kept_bird = new Player(50, game_height / 2, 0, kept_brain, 0)
        //     kept_birds.push(kept_bird)

    }
}
    // Render game
    renderGame()


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


//Create players
// function create_players(pop, child_arr) {
//     for (let j = 0; j < child_arr.length; j++) {
//         bird_arr[j] = new Player(50, 400, 0, generate_model(0,child_arr[j]))
//     }

//     for (let i = 0; i < pop-child_arr.length; i++) {
//         bird_arr.push(new Player(50, 400, 0, generate_model(1,0)))      
//     }
// }

       //create_players(20,[child1w, child2w, child3w, child4w, child5w])

       ////////////// EVO STRAT 1 ////////////////////
       // Keep 10 birds and just mutate random weights.. does not work so well ...
    //    let kept_birds = []
    //    for (let i = 0; i < 10; i++) {
    //         //Mutate best birds
    //        let w = weights[weights.length - 1 - i]
    //        let wmut = []
    //        for (let i = 0; i < w.length; i = i + 2) {
    //            let wtemp = w[i].dataSync()
    //            let muta = []
    //            for (let k = 0; k < wtemp.length; k++) {
    //                let mut = mutate(wtemp[k])
    //                muta.push(mut)
    //            }
    //            wmut.push(muta)
    //        }

    //        let mut_top_bird = new Player(50, game_height / 2, 0, generate_model(2, wmut))
    //        kept_birds.push(mut_top_bird)
    //        //kept_birds.push(dead_bird_arr[dead_bird_arr.length-1-i])       
    //    }
    //     create_players(10,kept_birds)
        ////////////// EVO STRAT 1 ////////////////////



        // //Produces child from best and next best bird
        // let child1w = evolve(weights, 1, 2)
        // //Produces child from 3:rd and 4:th best
        // let child2w = evolve(weights, 1, 3)

        // let child3w = evolve(weights, 1, 4)

        // let child4w = evolve(weights, 2, 3)

        // let child5w = evolve(weights, 2, 4)