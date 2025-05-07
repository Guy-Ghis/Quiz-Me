const fs = require('fs');
const readline = require('readline');

const quizData = [
  {
    question: 'What is the output of typeof null?',
    options: ['object', 'null', 'undefined', 'boolean'],
    answer: 'object',
  },
  {
    question: 'Which keyword declares a block-scoped variable?',
    options: ['var', 'let', 'const', 'define'],
    answer: 'let',
  },
  {
    question: 'What does NaN stand for?',
    options: [
      'Not a Number',
      'No Any Number',
      'New and Null',
      'Name as Number',
    ],
    answer: 'Not a Number',
  },
  {
    question: 'Which method converts JSON to a JavaScript object?',
    options: [
      'JSON.parse()',
      'JSON.stringify()',
      'JSON.convert()',
      'JSON.read()',
    ],
    answer: 'JSON.parse()',
  },
  {
    question: 'What does === mean in JavaScript?',
    options: [
      'Equal value and type',
      'Only equal value',
      'Only equal type',
      'None',
    ],
    answer: 'Equal value and type',
  },
];

let currentIndex = 0;
let score = 0;
let startTime = 0;
const highScoreFile = './highscore.txt';

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function readHighScore() {
  if (fs.existsSync(highScoreFile)) {
    return parseInt(fs.readFileSync(highScoreFile, 'utf-8'));
  }
  return 0;
}

function saveHighScore(newScore) {
  fs.writeFileSync(highScoreFile, String(newScore));
}

function startQuiz() {
  console.clear();
  const savedHigh = readHighScore();
  console.log(`
🎯 High Score: ${savedHigh}`);
  score = 0;
  currentIndex = 0;
  startTime = Date.now();
  askQuestion();
}

function askQuestion() {
  const current = quizData[currentIndex];
  console.log(`\nQuestion ${currentIndex + 1}: ${current.question}`);
  current.options.forEach((opt, i) => {
    console.log(`${i + 1}. ${opt}`);
  });

  rl.question('Your answer (1-4): ', handleAnswer);
}

function handleAnswer(input) {
  const choice = parseInt(input);
  const current = quizData[currentIndex];

  if (quizData[currentIndex].options[choice - 1] === current.answer) {
    console.log('✅ Correct!');
    score++;
  } else {
    console.log(`❌ Wrong. Correct answer: ${current.answer}`);
  }

  currentIndex++;
  if (currentIndex < quizData.length) {
    askQuestion();
  } else {
    showResult();
  }
}

function showResult() {
  const totalTime = Math.round((Date.now() - startTime) / 1000);
  console.log(`\n🎉 You got ${score} out of ${quizData.length} correct!`);
  console.log(`⏱️ You took ${totalTime} seconds.`);

  const prevHigh = readHighScore();
  if (score > prevHigh) {
    console.log('🏆 New High Score!');
    saveHighScore(score);
  }

  rl.question('\nWould you like to take another quiz? (y/n): ', (ans) => {
    if (ans.trim().toLowerCase() === 'y') {
      startQuiz();
    } else {
      console.log('👋 Thanks for playing!');
      rl.close();
    }
  });
}

startQuiz();
