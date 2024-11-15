const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const PORT = 3000;

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));

// Route to render the quiz page
app.get('/quiz', (req, res) => {
  res.render('quiz');
});

// Route to handle quiz submission and process results
app.post('/quiz', (req, res) => {
  const answers = req.body;

  // Mock analysis function that categorizes users (could be replaced with AI/ML model)
  const category = analyzeAnswers(answers);

  res.render('result', { category });
});

// Sample analysis function (replace with AI/ML logic later)
function analyzeAnswers(answers) {
  const { question1, question2, question3 } = answers;
  // Sample logic: You could add more detailed logic here or use an AI model
  if (question1 === 'Yes' && question2 === 'Yes' && question3 === 'Yes') {
    return 'Group A';
  } else if (question1 === 'No' && question2 === 'No' && question3 === 'No') {
    return 'Group B';
  } else {
    return 'Group C';
  }
}

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
