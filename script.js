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
let questionStart = 0;
let timer;
let totalSeconds = 0;

const startBtn = document.getElementById('start-btn');
const nextBtn = document.getElementById('next-btn');
const restartBtn = document.getElementById('restart-btn');
const questionText = document.getElementById('question-text');
const optionsDiv = document.getElementById('options');
const scoreText = document.getElementById('score-text');
const timerDisplay = document.getElementById('timer');
const progressBar = document.getElementById('progress-bar');
const highScoreStart = document.getElementById('high-score');
const highScoreEnd = document.getElementById('high-score-end');
const timeTakenDisplay = document.getElementById('time-taken');

startBtn.addEventListener('click', startQuiz);
nextBtn.addEventListener('click', submitAnswer);
restartBtn.addEventListener('click', restartQuiz);

function startQuiz() {
  const savedHigh = localStorage.getItem('quizHighScore') || 0;
  highScoreStart.textContent = savedHigh;
  startTime = Date.now();
  questionStart = Date.now();
  currentIndex = 0;
  score = 0;
  document.getElementById('start-screen').classList.add('hidden');
  document.getElementById('quiz-screen').classList.remove('hidden');
  showQuestion();
  startTimer();
}

function showQuestion() {
  const current = quizData[currentIndex];
  questionText.textContent = current.question;
  optionsDiv.innerHTML = '';
  optionsDiv.classList.add('fade');
  setTimeout(() => optionsDiv.classList.remove('fade'), 500);
  current.options.forEach((option) => {
    const btn = document.createElement('button');
    btn.textContent = option;
    btn.addEventListener('click', () => selectOption(btn));
    optionsDiv.appendChild(btn);
  });
  updateProgress();
  resetTimer();
}

function selectOption(btn) {
  Array.from(optionsDiv.children).forEach((b) => (b.disabled = true));
  btn.classList.add('selected');
  btn.dataset.selected = true;
}

function submitAnswer() {
  const selected = Array.from(optionsDiv.children).find(
    (b) => b.dataset.selected
  );
  if (!selected) return alert('Please select an answer.');
  if (selected.textContent === quizData[currentIndex].answer) score++;
  currentIndex++;
  if (currentIndex < quizData.length) {
    showQuestion();
  } else {
    showResult();
  }
}

function showResult() {
  clearInterval(timer);
  document.getElementById('quiz-screen').classList.add('hidden');
  document.getElementById('result-screen').classList.remove('hidden');
  scoreText.textContent = `You got ${score} out of ${quizData.length} correct!`;
  const totalTime = Math.round((Date.now() - startTime) / 1000);
  timeTakenDisplay.textContent = totalTime;
  const prevHigh = localStorage.getItem('quizHighScore') || 0;
  if (score > prevHigh) localStorage.setItem('quizHighScore', score);
  highScoreEnd.textContent = Math.max(score, prevHigh);
}

function restartQuiz() {
  document.getElementById('result-screen').classList.add('hidden');
  startQuiz();
}

function updateProgress() {
  const progress = (currentIndex / quizData.length) * 100;
  progressBar.style.width = `${progress}%`;
}

function startTimer() {
  clearInterval(timer);
  let timeLeft = 30;
  timerDisplay.textContent = timeLeft;
  timer = setInterval(() => {
    timeLeft--;
    timerDisplay.textContent = timeLeft;
    if (timeLeft <= 0) {
      clearInterval(timer);
      submitAnswer();
    }
  }, 1000);
}

function resetTimer() {
  clearInterval(timer);
  startTimer();
}
