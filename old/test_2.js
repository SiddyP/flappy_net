function setup() {
    //createCanvas(400,400)

    function poolSelection(birds) {
        // Start at 0
        let index = 0;

        // Pick a random number between 0 and 1
        let r = Math.random();

        // Keep subtracting probabilities until you get less than zero
        // Higher probabilities will be more likely to be fixed since they will
        // subtract a larger number towards zero
        while (r > 0) {
            r -= birds[index].fitness;
            console.log(r)
            console.log(index)
            // And move on to the next
            index += 1;
        }

        // Go back one
        index -= 1;

        // Make sure it's a copy!
        // (this includes mutation)
        return birds[index];
    }

    // Normalize the fitness of all birds
    function normalizeFitness(birds) {
        // Make score exponentially better?
        for (let i = 0; i < birds.length; i++) {
            birds[i].score = pow(birds[i].score, 2);
        }

        // Add up all the scores
        let sum = 0;
        for (let i = 0; i < birds.length; i++) {
            sum += birds[i].score;
        }
        // Divide by the sum
        for (let i = 0; i < birds.length; i++) {
            birds[i].fitness = birds[i].score / sum;
        }
    }




    let birdz = [{ 'score': 0.1, 'fitness': 0 }, { 'score': 0.3, 'fitness': 0 }, { 'score': 0.2, 'fitness': 0 }, { 'score': 0.1, 'fitness': 0 }, { 'score': 0.3, 'fitness': 0 }, { 'score': 0.2, 'fitness': 0 }, { 'score': 0.1, 'fitness': 0 }, { 'score': 0.3, 'fitness': 0 }, { 'score': 0.2, 'fitness': 0 }]
    normalizeFitness(birdz)
    console.log(birdz)
}








function draw() {
}



// const model1 = tf.sequential();
// model1.add(tf.layers.dense({units:4, inputShape: [4]}));
// model1.add(tf.layers.dense({units: 4}));
// model1.add(tf.layers.dense({units: 2}));
// model1.summary();

// let w = model1.getWeights()
// console.log(w[0].dataSync())

// w[1].print()