//Genetic functions
function mutate(w) {
    if (Math.random() < 0.03) {
        //console.log('Mutation occured.')
        let mutagen = randomGaussian() * 0.5
        let neww = w + mutagen
        return [neww, 25]
    } else {
        return [w, 0];
    }
}

function breed(wx, wy) {
    let wz = [];
    for (let i = 0; i < wx.length; i++) {
        let wxwy = (mutate(wx[i]) + mutate(wy[i])) / 2;
        wz.push(wxwy[0])
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
    let mutations = 0

    for (let i = 0; i < fatherW.length; i = i + 2) {
        let child_layer = []
        let wXY = fatherW[i].dataSync()
        let wXX = motherW[i].dataSync()

        for (let j = 0; j < wXY.length; j++) {
            let p = Math.random()
            if (p < 0.5) {
                let mutagen = mutate(wXY[j])
                child_layer.push(mutagen[0])
                mutations += mutagen[1]
            } else if (p > 0.5) {
                let mutagen = mutate(wXX[j])
                child_layer.push(mutagen[0])
                mutations += mutagen[1]
            }
        }
        childW.push(child_layer)
    }
    return [childW, mutations]
}

