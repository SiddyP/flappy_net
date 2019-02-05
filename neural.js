function generate_model(random, weights){
    if (random == 1){
        //console.log('Creating NEW offspring')
        const model = tf.sequential();
        // First layer must have an input shape defined.
        model.add(tf.layers.dense({units: 4, inputShape: [4]}));
        model.add(tf.layers.dense({units: 4}));
        //model.add(tf.layers.dense({units: 4}));
        model.add(tf.layers.dense({units: 2}));
        return model
    } else {
        //console.log('Creating BRED offspring')
        const model = tf.sequential();
        // First layer must have an input shape defined.
        model.add(tf.layers.dense({units: 4, inputShape: [4], weights: [tf.tensor(weights[0], [4,4]), tf.tensor([0,0,0,0])]}));
        model.add(tf.layers.dense({units: 4, weights: [tf.tensor(weights[1], [4,4]), tf.tensor([0,0,0,0])]}));
        //model.add(tf.layers.dense({units: 4, weights: [tf.tensor(weights[2], [4,4]), tf.tensor([0, 0, 0, 0])]}));
        model.add(tf.layers.dense({units: 2, weights: [tf.tensor(weights[2], [4,2]), tf.tensor([0,0])]}));
        return model
    }
}
