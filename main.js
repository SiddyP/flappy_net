// Constants
let generation_html;
let top_score_html;
let current_score_html;
let game_width = 600
let game_height = 600
let gravity = 0
let pipe_arr = new Array()
let bird_arr = new Array()
let dead_bird_arr = new Array()


// Utils
function get_total_score(birds) {
    let tot_score = 0
    for (let i = 0; i < birds.length; i++) {
        tot_score += birds[i].score
    }
    return tot_score
}

function renderGame(){
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
}


// Create birds
function create_players(new_population, kept_population) {
    for (let i = 0; i < new_population; i++) {
        bird_arr.push(new Player(generate_model(1, 0)))
    }
    if (kept_population.length > 0) {
        for (let j = 0; j < kept_population.length; j++) {
            bird_arr.push(kept_population[j])  
        }
    }
}

let total_populaton = 200

create_players(total_populaton, [])


// Loop counters
let draw_counter = 0
let generations = 1
let top_score = 0
let current_score = 0

function draw() {
    background(135, 206, 250)
    birds_html.html(bird_arr.length)
    generation_html.html(generations)
        
    if (draw_counter % 100 == 0) {
        pipe_arr.push(new Pipe(game_width, game_height, game_width, 0, 55, 4))
    }
    current_score = bird_arr[0].score
    current_score_html.html(current_score)

    for (let k = 0; k < bird_arr.length; k++) {

        bird_arr[k].update()
        bird_arr[k].show()
        
        if (bird_arr[k].score > top_score){
            top_score_html.html(bird_arr[k].score)
        }

        if (pipe_arr.length > 0) {
            gravity = 0.35
            if (draw_counter % 1 == 0){
                let input = pipe_arr[0]
                if (input[0] < 0) {
                    input = pipe_arr[1]
                }
                bird_arr[k].player_action(input)
            }

            if (pipe_arr[0].colided(bird_arr[k]) == true) {
                dead_bird_arr.push(bird_arr[k])
                console.log('Bird: died!')
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
        gravity = 0
        console.log('All birds dead, evolving ...')
        for (let i = 0; i < dead_bird_arr.length; i++) {
            if (dead_bird_arr[i].score > top_score){
                top_score = dead_bird_arr[i].score
                top_score_html.html(top_score)
            }            
        }
        console.log('Generation: ' + String(generations))
        generations += 1
        

        /////////// EVO STRAT ////////////////
        // Create 40 versions of the best bird with random mutations

        let kept_birds = []
        for (let i = 0; i < 40; i++) {
            let child_genes = evolveFatherMother(dead_bird_arr[dead_bird_arr.length - 1], dead_bird_arr[dead_bird_arr.length - 1])
            let child_bird = new Player(generate_model(2, child_genes[0]))
            child_bird.evolved = child_genes[1] + dead_bird_arr[dead_bird_arr.length-1].evolved
            kept_birds.push(child_bird)
        }
        console.log('Kept birds: ' + String(kept_birds.length))
        create_players(total_populaton-kept_birds.length, kept_birds)

        // Reset pipe_arr, dead_bird_arr 
        pipe_arr = []
        dead_bird_arr = []
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



        // Copy top ten
        // if (i < 10) {
        //     kept_birds.push(dead_bird_arr[dead_bird_arr.length - 1 - i])
        // }

        // Let best bird father i children whith top birds (excluding itself)
        // let child_genes = evolveFatherMother(dead_bird_arr[dead_bird_arr.length - 1], dead_bird_arr[dead_bird_arr.length - 2-i])
        // let child_bird = new Player(generate_model(2, child_genes))
        // kept_birds.push(child_bird)

        // if (i < 3) {
        //     let child_genes = evolveFatherMother(dead_bird_arr[dead_bird_arr.length - 2], dead_bird_arr[dead_bird_arr.length - 3 - i])
        //     let child_bird = new Player(50, game_height / 2, 0, generate_model(2, child_genes), 0)
        //     kept_birds.push(child_bird)
        // }

        // Also keep some random individuals ? 
        //kept_birds.push(dead_bird_arr[dead_bird_arr.length-1-i])  