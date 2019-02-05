//Genetic functions
function mutate(w) {
    if (Math.random() < 0.03) {
        //console.log('Mutation occured.')
        let mutagen = randomGaussian() * 0.5
        let neww = w + mutagen
        return neww
    } else {
        return w;
    }
}

function breed(wx, wy) {
    let wz = [];
    for (let i = 0; i < wx.length; i++) {
        let wxwy = (mutate(wx[i]) + mutate(wy[i])) / 2;
        wz.push(wxwy)
    }
    return wz
}

function evolve(weights, n, m) {
    let childW = []
    let w1 = weights[weights.length - 1 * n]
    let w2 = weights[weights.length - 2 * m]
    //The best birds are located in the end of the array, 
    //breed the best two and the best second two birds
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


function evolveFatherMother(father, mother){
    let childW = []
    let fatherW = father.model.getWeights()
    let motherW = mother.model.getWeights()

    for (let i = 0; i < fatherW.length; i = i + 2) {
        let child_layer = []
        let wXY = fatherW[i].dataSync()
        let wXX = motherW[i].dataSync()
        //console.log(wXY)
        //console.log(wXX)

        for (let j = 0; j < wXY.length; j++) {
            let p = Math.random()
            if (p < 0.5) {
                child_layer.push(mutate(wXY[j]))
                //console.log('father gene pushed')
            } else if (p > 0.5) {
                child_layer.push(mutate(wXX[j]))
                //console.log('mother gene pushed')
            }
        }
        childW.push(child_layer)
    }
    return childW
}


function normFitness(birds){
    for (let i = 0; i < birds.length; i++) {
        birds[i].score = Math.pow(birds[i].score, 2);
    }
    let sum = 0
    for (let i = 0; i < birds.length; i++) {
        sum += birds[i].score    
    }

    for (let i = 0; i < birds.length; i++) {
        birds[i].fitness = birds[i].score/sum
    }
}

//BORROWED //

// An algorithm for picking one bird from an array
// based on fitness
function poolSelection(birds) {
    // Start at 0
    let index = 0;

    // Pick a random number between 0 and 1
    let r = random(1);

    // Keep subtracting probabilities until you get less than zero
    // Higher probabilities will be more likely to be fixed since they will
    // subtract a larger number towards zero
    while (r > 0) {
        r -= birds[index].fitness;
        // And move on to the next
        index += 1;
    }

    // Go back one
    index -= 1;

    // Make sure it's a copy!
    // (this includes mutation)
    //return birds[index].copy();
    return birds[index];
}

// Generate a new population of birds
function generate(oldBirds) {
    let newBirds = [];
    for (let i = 0; i < oldBirds.length; i++) {
        // Select a bird based on fitness
        let bird = poolSelection(oldBirds);
        newBirds[i] = bird;
    }
    return newBirds;
}