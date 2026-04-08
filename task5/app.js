// State Management
let quizzes = JSON.parse(localStorage.getItem('quizzes')) || [
    { id: 1, title: "General Knowledge", creator: "Admin", questions: [
        { text: "Which planet is known as the Red Planet?", options: ["Earth", "Mars", "Jupiter", "Saturn"], correct: 1 },
        { text: "What is 5 + 7?", options: ["10", "11", "12", "13"], correct: 2 }
    ]}
];
let currentUser = localStorage.getItem('user') || null;
let currentQuiz = null;
let currentQuestionIndex = 0;
let userAnswers = [];

// --- Improved Navigation ---
function showSection(id) {
    // UI Cleanup
    document.querySelectorAll('section').forEach(s => s.classList.add('hidden'));
    document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active-link'));
    
    // Activate Section
    const target = document.getElementById(id);
    if(target) target.classList.remove('hidden');
    
    // Update Sidebar Link
    const link = document.getElementById(`link-${id}`);
    if(link) link.classList.add('active-link');

    // Dynamic Title
    const titles = { 'home': 'Dashboard', 'listing': 'Browse Quizzes', 'create': 'Quiz Builder', 'taking': 'Assessment in Progress', 'results': 'Performance Report', 'login': 'Authentication' };
    document.getElementById('pageTitle').innerText = titles[id] || 'QuizPro';

    if(id === 'listing') renderListing();
    updateUserUI();
}

function updateUserUI() {
    const authPanel = document.getElementById('authPanel');
    const userDisplay = document.getElementById('userDisplay');
    
    if (currentUser) {
        userDisplay.innerHTML = `<i class="fas fa-user-circle mr-2"></i> ${currentUser}`;
        authPanel.innerHTML = `
            <button onclick="logout()" class="w-full flex items-center gap-3 px-3 py-3 text-red-500 hover:bg-red-50 rounded-lg transition">
                <i class="fas fa-sign-out-alt"></i> <span>Logout</span>
            </button>`;
    } else {
        userDisplay.innerText = "Guest Mode";
        authPanel.innerHTML = `
            <button onclick="showSection('login')" class="w-full flex items-center gap-3 px-3 py-3 text-indigo-600 hover:bg-indigo-50 rounded-lg transition font-bold">
                <i class="fas fa-sign-in-alt"></i> <span>Login</span>
            </button>`;
    }
}

// --- Auth logic ---
function login() {
    const val = document.getElementById('username').value;
    if(val) {
        currentUser = val;
        localStorage.setItem('user', val);
        showSection('home');
    }
}
function logout() {
    localStorage.removeItem('user');
    currentUser = null;
    showSection('home');
}
function checkAuth(target) {
    if(!currentUser) showSection('login');
    else {
        showSection(target);
        if(target === 'create') resetCreationForm();
    }
}

// --- Quiz Creation logic ---
function resetCreationForm() {
    document.getElementById('questionsContainer').innerHTML = '';
    document.getElementById('quizTitle').value = '';
    addQuestionUI();
}

function addQuestionUI() {
    const id = Date.now();
    const count = document.querySelectorAll('.q-block').length + 1;
    const html = `
        <div class="q-block p-6 rounded-xl border border-slate-100 bg-slate-50/50 space-y-4" id="q-${id}">
            <div class="flex justify-between items-center">
                <span class="text-xs font-bold uppercase tracking-wider text-slate-400">Question ${count}</span>
                <button onclick="this.parentElement.parentElement.remove()" class="text-slate-300 hover:text-red-500"><i class="fas fa-times"></i></button>
            </div>
            <input type="text" placeholder="Type your question here..." class="w-full p-3 bg-white border border-slate-200 rounded-lg q-text outline-none focus:border-indigo-400">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
                <input type="text" placeholder="Option A" class="p-3 bg-white border border-slate-200 rounded-lg opt">
                <input type="text" placeholder="Option B" class="p-3 bg-white border border-slate-200 rounded-lg opt">
                <input type="text" placeholder="Option C" class="p-3 bg-white border border-slate-200 rounded-lg opt">
                <input type="text" placeholder="Option D" class="p-3 bg-white border border-slate-200 rounded-lg opt">
            </div>
            <select class="w-full p-3 bg-white border border-slate-200 rounded-lg correct-idx font-semibold text-indigo-600">
                <option value="0">Answer: Option A</option>
                <option value="1">Answer: Option B</option>
                <option value="2">Answer: Option C</option>
                <option value="3">Answer: Option D</option>
            </select>
        </div>`;
    document.getElementById('questionsContainer').insertAdjacentHTML('beforeend', html);
}

function saveQuiz() {
    const title = document.getElementById('quizTitle').value;
    const qNodes = document.querySelectorAll('.q-block');
    const questions = Array.from(qNodes).map(node => ({
        text: node.querySelector('.q-text').value,
        options: Array.from(node.querySelectorAll('.opt')).map(i => i.value),
        correct: parseInt(node.querySelector('.correct-idx').value)
    }));

    if(!title || questions.length === 0 || questions.some(q => !q.text)) {
        alert("Please provide a title and at least one complete question.");
        return;
    }

    quizzes.push({ id: Date.now(), title, creator: currentUser, questions });
    localStorage.setItem('quizzes', JSON.stringify(quizzes));
    showSection('listing');
}

// --- Quiz Engine ---
function renderListing() {
    const container = document.getElementById('quizContainer');
    container.innerHTML = quizzes.map(q => `
        <div class="bg-white p-6 rounded-2xl border border-slate-200 hover:shadow-xl hover:shadow-indigo-100 transition-all group">
            <div class="bg-indigo-50 w-12 h-12 rounded-xl flex items-center justify-center text-indigo-600 mb-4 group-hover:bg-indigo-600 group-hover:text-white transition">
                <i class="fas fa-file-alt"></i>
            </div>
            <h3 class="text-lg font-bold text-slate-800 mb-1">${q.title}</h3>
            <p class="text-xs text-slate-400 mb-6 uppercase tracking-widest font-bold">${q.questions.length} Questions</p>
            <button onclick="startQuiz(${q.id})" class="w-full py-3 bg-slate-50 text-slate-700 rounded-xl font-bold group-hover:bg-indigo-600 group-hover:text-white transition">
                Take Quiz
            </button>
        </div>
    `).join('');
}

function startQuiz(id) {
    currentQuiz = quizzes.find(q => q.id === id);
    currentQuestionIndex = 0;
    userAnswers = [];
    showSection('taking');
    renderQuestion();
}

function renderQuestion() {
    const q = currentQuiz.questions[currentQuestionIndex];
    const total = currentQuiz.questions.length;
    const progress = ((currentQuestionIndex + 1) / total) * 100;
    
    // Update Progress UI
    document.getElementById('progressBar').style.width = `${progress}%`;
    document.getElementById('progressText').innerText = `Question ${currentQuestionIndex + 1}/${total}`;
    document.getElementById('percentageText').innerText = `${Math.round(progress)}%`;

    const container = document.getElementById('quizContent');
    container.innerHTML = `
        <h2 class="text-2xl font-bold text-slate-800 mb-8 leading-tight">${q.text}</h2>
        <div class="space-y-4">
            ${q.options.map((opt, i) => `
                <button onclick="selectAnswer(${i})" class="w-full p-5 text-left border-2 border-slate-100 rounded-2xl hover:border-indigo-500 hover:bg-indigo-50 hover:pl-7 transition-all font-medium text-slate-700 flex justify-between items-center group">
                    <span>${opt}</span>
                    <i class="fas fa-chevron-right text-slate-200 group-hover:text-indigo-500"></i>
                </button>
            `).join('')}
        </div>
    `;
}

function selectAnswer(index) {
    userAnswers.push(index);
    if(currentQuestionIndex < currentQuiz.questions.length - 1) {
        currentQuestionIndex++;
        renderQuestion();
    } else {
        showResults();
    }
}

function showResults() {
    showSection('results');
    let score = 0;
    let feedbackHtml = '';

    currentQuiz.questions.forEach((q, i) => {
        const isCorrect = q.correct === userAnswers[i];
        if(isCorrect) score++;
        feedbackHtml += `
            <div class="flex items-start gap-3 p-4 rounded-xl ${isCorrect ? 'bg-green-50 border border-green-100' : 'bg-red-50 border border-red-100'}">
                <i class="fas ${isCorrect ? 'fa-check-circle text-green-500' : 'fa-times-circle text-red-500'} mt-1"></i>
                <div>
                    <p class="text-sm font-bold text-slate-800">${q.text}</p>
                    <p class="text-xs ${isCorrect ? 'text-green-600' : 'text-red-600'}">Answer: ${q.options[q.correct]}</p>
                </div>
            </div>`;
    });

    document.getElementById('scoreDisplay').innerText = `${score} / ${currentQuiz.questions.length}`;
    document.getElementById('feedbackDetails').innerHTML = feedbackHtml;
}

// Bootstrap
showSection('home');