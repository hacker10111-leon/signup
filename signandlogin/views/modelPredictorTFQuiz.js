// Import Express and TensorFlow modules as before

let model; // Variable to store the model

// Load or create the model on server startup
(async () => {
  model = await createModel();
})();

app.post('/quiz', async (req, res) => {
  const answers = req.body;

  // Convert answers into tensor format for prediction
  const inputTensor = tf.tensor2d([
    [
      answers.question1 === 'Yes' ? 1 : 0,
      answers.question2 === 'Yes' ? 1 : 0,
      answers.question3 === 'Yes' ? 1 : 0,
    ],
  ]);

  // Get prediction (returns tensor with probabilities for each group)
  const prediction = model.predict(inputTensor);
  const predictedGroup = prediction.argMax(1).dataSync()[0];

  // Convert the prediction to a human-readable group name
  let category;
  if (predictedGroup === 0) category = 'Group A';
  else if (predictedGroup === 1) category = 'Group B';
  else if (predictedGroup === 2) category = 'Group C';

  res.render('result', { category });
});
