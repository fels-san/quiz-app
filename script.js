const startScreen = document.querySelector(".start-screen");
const quizScreen = document.querySelector(".quiz");
const endScreen = document.querySelector(".end-screen");
const startButton = document.getElementById("start-btn");
const nextButton = document.getElementById("next-btn");
const submitButton = document.getElementById("submit-btn");
const restartButton = document.getElementById("restart-btn");
const questionElement = document.getElementById("question");
const answersElement = document.getElementById("answer-wrapper");
const counter = document.getElementById("counter");
const progressBar = document.getElementById("progress-bar");
const timerText = document.getElementById("timer");
const resultText = document.getElementById("result");

let shuffledQuestions;
let currentQuestionIndex;
let timer;
let score;

startButton.addEventListener("click", startGame);
submitButton.addEventListener("click", applyAnswer);
nextButton.addEventListener("click", () => {
  currentQuestionIndex++;
  setNextQuestion();
});
restartButton.addEventListener("click", () => {
  endScreen.classList.add("hide");
  startScreen.classList.remove("hide");
});

function startGame() {
  startScreen.classList.add("hide");
  shuffledQuestions = questions.sort(() => Math.random() - 0.5);
  currentQuestionIndex = 0;
  score = 0;
  quizScreen.classList.remove("hide");
  setNextQuestion();
}

function setNextQuestion() {
  resetState();
  resetTimer();
  showQuestion(shuffledQuestions[currentQuestionIndex]);
}

function showQuestion(question) {
  counter.querySelector(".current").innerText = currentQuestionIndex + 1;
  counter.querySelector(".total").innerText = `/${shuffledQuestions.length}`;
  questionElement.innerText = question.question;
  question.answers.forEach((answer) => {
    createAnswerElement(answer);
  });
}

function createAnswerElement(answer) {
  const answerElement = document.createElement("div");
  answerElement.classList.add("answer");
  if (answer.correct) {
    answerElement.dataset.correct = answer.correct;
  }

  const text = document.createElement("span");
  text.classList.add("text");
  text.innerText = answer.text;
  answerElement.append(text);

  const checkbox = document.createElement("span");
  checkbox.classList.add("checkbox");
  answerElement.append(checkbox);

  const icon = document.createElement("span");
  icon.classList.add("icon");
  icon.innerText = "✓";
  checkbox.append(icon);

  answerElement.addEventListener("click", selectAnswer);
  answersElement.appendChild(answerElement);
}

function resetState() {
  nextButton.classList.add("hide");
  submitButton.classList.remove("hide");
  submitButton.setAttribute("disabled", "");
  while (answersElement.firstChild) {
    answersElement.removeChild(answersElement.firstChild);
  }
}

function resetTimer() {
  clearTimeout(timer);

  const totalTime = 10 * 60;
  let currentTime = totalTime;
  progressBar.style.transition = "0s";
  progressBar.style.width = "100%";

  timerText.textContent = currentTime;

  timer = setInterval(() => {
    progressBar.style.transition = "0.5s linear";
    if (currentTime <= 0) {
      timerText.textContent = clearInterval(timer);
      applyAnswer();
    } else {
      --currentTime;
      timerText.textContent = Math.ceil(currentTime / 60);
    }
    const width = (currentTime / totalTime) * 100;
    progressBar.style.width = `${width}%`;
  }, 1000 / 60);
}

function selectAnswer(event) {
  if (!nextButton.classList.contains("hide")) return;
  const selectedAnswer = event.target;
  Array.from(answersElement.children).forEach((answer) => {
    answer.classList.remove("selected");
  });
  selectedAnswer.classList.add("selected");
  submitButton.removeAttribute("disabled");
}

function applyAnswer() {
  clearTimeout(timer);
  const selectedAnswer = Array.from(answersElement.children).find((answer) =>
    answer.classList.contains("selected")
  );

  Array.from(answersElement.children).forEach((answer) => {
    setStatusClass(answer, answer.dataset.correct);
  });

  if (selectedAnswer && selectedAnswer.classList.contains("correct")) score++;

  checkGameEnd();
}

function checkGameEnd() {
  if (shuffledQuestions.length > currentQuestionIndex + 1) {
    nextButton.classList.remove("hide");
    submitButton.classList.add("hide");
  } else {
    quizScreen.classList.add("hide");
    endScreen.classList.remove("hide");
    resultText.innerText = `${score}/${shuffledQuestions.length}`;
  }
}

function setStatusClass(element, correct) {
  clearStatusClass(element);
  if (correct) {
    element.classList.add("correct");
  } else {
    element.classList.add("wrong");
  }
}

function clearStatusClass(element) {
  element.classList.remove("correct");
  element.classList.remove("wrong");
}

const questions = [
  {
    question: "What is 2 + 2",
    answers: [
      { text: "4", correct: true },
      { text: "22", correct: false },
      { text: "51", correct: false },
    ],
  },
  {
    question: "What is 2 + 2",
    answers: [
      { text: "4", correct: true },
      { text: "22", correct: false },
      { text: "51", correct: false },
    ],
  },
  {
    question: "What is 2 + 2",
    answers: [
      { text: "4", correct: true },
      { text: "22", correct: false },
      { text: "51", correct: false },
    ],
  },
];
