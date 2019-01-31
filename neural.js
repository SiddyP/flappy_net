function generate_model(random, weights){
    if (random == 1){
        const model = tf.sequential();
        // First layer must have an input shape defined.
        model.add(tf.layers.dense({units: 2, inputShape: [3]}));
        model.add(tf.layers.dense({units: 4}));
        model.add(tf.layers.dense({units: 1}));
        return model
    } else {
        const model = tf.sequential();
        // First layer must have an input shape defined.
        model.add(tf.layers.dense({units: 2, inputShape: [3], weights: [tf.tensor(weights[0], [3,2]), tf.tensor([0,0])]}));
        model.add(tf.layers.dense({units: 4, weights: [tf.tensor(weights[1], [2,4]), tf.tensor([0,0,0,0])]}));
        model.add(tf.layers.dense({units: 1, weights: [tf.tensor(weights[2], [4,1]), tf.tensor([0])]}));
        return model
    }
}
