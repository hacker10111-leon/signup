const tf = require('@tensorflow/tfjs-node');

// Initialize and train the model with mock data
async function createModel() {
  const model = tf.sequential();

  // Add a dense layer
  model.add(tf.layers.dense({ units: 10, inputShape: [3], activation: 'relu' }));
  model.add(tf.layers.dense({ units: 3, activation: 'softmax' })); // 3 output units for 3 categories (A, B, C)

  // Compile the model
  model.compile({
    optimizer: 'adam',
    loss: 'categoricalCrossentropy',
    metrics: ['accuracy'],
  });

  // Mock training data
  const trainingData = tf.tensor2d([
    [1, 1, 1], // Group A
    [1, 0, 0], // Group B
    [0, 0, 1], // Group C
    [1, 1, 0], // Group A
    [0, 1, 1], // Group B
    [0, 0, 0], // Group C
  ]);
  
  const outputData = tf.tensor2d([
    [1, 0, 0], // Group A
    [0, 1, 0], // Group B
    [0, 0, 1], // Group C
    [1, 0, 0], // Group A
    [0, 1, 0], // Group B
    [0, 0, 1], // Group C
  ]);

  // Train the model
  await model.fit(trainingData, outputData, {
    epochs: 100,
  });

  return model;
}
