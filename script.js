const questions = [
  // 20 total questions...
  { question: "What is Django?", options: ["A CMS", "A web framework", "A Python library", "A JavaScript tool"], answer: "A web framework" },
  { question: "Which language is Django written in?", options: ["JavaScript", "Python", "Ruby", "C#"], answer: "Python" },
  { question: "Which command starts a new Django project?", options: ["django new", "startproject", "startapp", "django-admin startproject"], answer: "django-admin startproject" },
  { question: "Where are Django settings stored?", options: ["settings.py", "config.py", "django.conf", "core.py"], answer: "settings.py" },
  { question: "What does ORM stand for?", options: ["Object Relational Mapping", "Official Resource Manager", "Object Render Model", "Online Resource Management"], answer: "Object Relational Mapping" },
  { question: "Which DB is default in Django?", options: ["PostgreSQL", "MySQL", "SQLite", "Oracle"], answer: "SQLite" },
  { question: "What is the default port Django runs on?", options: ["8000", "5000", "3000", "80"], answer: "8000" },
  { question: "Which template engine does Django use by default?", options: ["Jinja2", "Twig", "Django Template Language", "Mako"], answer: "Django Template Language" },
  { question: "What is a Django model?", options: ["UI element", "Database table abstraction", "Admin interface", "Template file"], answer: "Database table abstraction" },
  { question: "Which file defines URL routes?", options: ["routes.py", "views.py", "urls.py", "models.py"], answer: "urls.py" },
  { question: "What is the function of 'makemigrations'?", options: ["Create DB", "Delete DB", "Track model changes", "Serve app"], answer: "Track model changes" },
  { question: "Which command creates DB tables?", options: ["migrate", "initdb", "makemigrations", "dbsetup"], answer: "migrate" },
  { question: "Django is based on which pattern?", options: ["MVC", "MTV", "MVVM", "MVP"], answer: "MTV" },
  { question: "What is a view in Django?", options: ["HTML file", "Model", "Python function/class handling requests", "CSS file"], answer: "Python function/class handling requests" },
  { question: "What is 'manage.py'?", options: ["Main DB file", "Settings file", "Helper script to manage project", "URL router"], answer: "Helper script to manage project" },
  { question: "How to create a new app in Django?", options: ["django-admin startapp appname", "create app", "new django app", "python manage.py newapp"], answer: "django-admin startapp appname" },
  { question: "What is CSRF in Django?", options: ["Security token", "Database", "Cache", "Template"], answer: "Security token" },
  { question: "Which middleware handles sessions?", options: ["SessionMiddleware", "CacheMiddleware", "AuthMiddleware", "CSRF"], answer: "SessionMiddleware" },
  { question: "Which Django feature handles form validation?", options: ["Models", "Forms", "Views", "URLs"], answer: "Forms" },
  { question: "How do you protect views from non-logged-in users?", options: ["@auth", "@login_required", "@secure", "@csrf_required"], answer: "@login_required" }
];

let currentQuestion = 0;
let score = 0;
let timerInterval;
let timeLeft = 20;
let username = "";

const questionEl = document.getElementById("question");
const optionsEl = document.getElementById("options");
const resultEl = document.getElementById("result");
const timerEl = document.getElementById("timer");
const counterEl = document.getElementById("question-counter");

function shuffle(array) {
  return array.sort(() => Math.random() - 0.5);
}

let selectedQuestions = shuffle([...questions]).slice(0, 10);

function showQuestion(index) {
  const q = selectedQuestions[index];
  questionEl.textContent = q.question;
  optionsEl.innerHTML = "";
  counterEl.textContent = `Question ${index + 1} / ${selectedQuestions.length}`;
  q.options.forEach(option => {
    const btn = document.createElement("button");
    btn.classList.add("option");
    btn.textContent = option;
    btn.onclick = () => checkAnswer(btn, q.answer);
    optionsEl.appendChild(btn);
  });
  resetTimer();
  countdown();
}

function checkAnswer(button, answer) {
  clearInterval(timerInterval);
  const options = document.querySelectorAll(".option");
  options.forEach(btn => {
    btn.disabled = true;
    if (btn.textContent === answer) {
      btn.classList.add("correct");
    } else {
      btn.classList.add("wrong");
    }
  });
  if (button.textContent === answer) score++;
  setTimeout(() => {
    currentQuestion++;
    if (currentQuestion < selectedQuestions.length) {
      showQuestion(currentQuestion);
    } else {
      showResult();
    }
  }, 1000);
}

function countdown() {
  timeLeft = 20;
  timerEl.textContent = `⏳ ${timeLeft}s`;
  timerInterval = setInterval(() => {
    timeLeft--;
    timerEl.textContent = `⏳ ${timeLeft}s`;
    if (timeLeft <= 5) timerEl.classList.add("flash");
    if (timeLeft <= 0) {
      clearInterval(timerInterval);
      timerEl.classList.remove("flash");
      checkAnswer({ textContent: "" }, selectedQuestions[currentQuestion].answer);
    }
  }, 1000);
}

function resetTimer() {
  clearInterval(timerInterval);
  timerEl.classList.remove("flash");
  timerEl.textContent = "⏳ 20s";
}

function showResult() {
  document.getElementById("quiz-container").style.display = "none";
  document.getElementById("result-screen").style.display = "block";
  document.getElementById("leaderboard").style.display = "block";

  let comment = "";
  if (score === 10) comment = "🌟 Perfect score!";
  else if (score >= 8) comment = "👏 Great job!";
  else if (score >= 5) comment = "😊 Good try!";
  else comment = "😅 Keep practicing!";

  resultEl.innerHTML = `${username}, your score: <strong>${score}/10</strong><br>${comment}`;

  const leaderboardData = JSON.parse(localStorage.getItem("leaderboard")) || [];
  leaderboardData.push({ name: username, score: score });
  leaderboardData.sort((a, b) => b.score - a.score);
  const topFive = leaderboardData.slice(0, 5);
  localStorage.setItem("leaderboard", JSON.stringify(topFive));

  const board = document.getElementById("leaderboard");
  board.innerHTML = "<h2>🏆 Top 5 Leaderboard</h2>";
  topFive.forEach((entry) => {
    const div = document.createElement("div");
    div.className = "leaderboard-entry";
    div.innerHTML = `<span>👤 ${entry.name}</span> <span>⭐ ${entry.score}/10</span>`;
    board.appendChild(div);
  });

  // Add clear leaderboard button
  const clearBtn = document.createElement("button");
  clearBtn.textContent = "🗑️ Clear Leaderboard";
  clearBtn.style.marginTop = "15px";
  clearBtn.style.padding = "10px 15px";
  clearBtn.style.backgroundColor = "#f44336";
  clearBtn.style.color = "#fff";
  clearBtn.style.border = "none";
  clearBtn.style.cursor = "pointer";
  clearBtn.onclick = () => {
    localStorage.removeItem("leaderboard");
    alert("Leaderboard cleared!");
    document.getElementById("leaderboard").innerHTML = "<h2>🏆 Top 5 Leaderboard</h2><p>No data available</p>";
  };
  board.appendChild(clearBtn);
}

document.getElementById("restart").onclick = () => {
  currentQuestion = 0;
  score = 0;
  selectedQuestions = shuffle([...questions]).slice(0, 10);
  document.getElementById("quiz-container").style.display = "block";
  document.getElementById("result-screen").style.display = "none";
  document.getElementById("leaderboard").style.display = "none";
  showQuestion(currentQuestion);
};

document.getElementById("start-btn").onclick = () => {
  const input = document.getElementById("username");
  if (!input.value.trim()) {
    alert("Please enter your name to begin the quiz.");
    return;
  }
  username = input.value.trim();
  currentQuestion = 0;
  score = 0;
  selectedQuestions = shuffle([...questions]).slice(0, 10);
  document.getElementById("start-screen").style.display = "none";
  document.getElementById("quiz-container").style.display = "block";
  showQuestion(currentQuestion);
};
