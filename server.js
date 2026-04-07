const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// 1. DATABASE CONNECTION
const localURI = "mongodb://127.0.0.1:27017/jobBoardTask4";
mongoose.connect(localURI)
    .then(() => console.log("✅ MongoDB Connected Successfully"))
    .catch(err => console.log("❌ Connection Error:", err));

// 2. DATA MODELS
const Job = mongoose.model('Job', {
    title: String,
    company: String,
    location: String,
    postedAt: { type: Date, default: Date.now }
});

const User = mongoose.model('User', {
    name: String,
    email: { type: String, unique: true },
    password: String
});

const Application = mongoose.model('Application', {
    jobId: String,
    jobTitle: String,
    name: String,
    email: String,
    phone: String,
    skills: String,
    resumeFileName: String, // Stores the name of the uploaded file
    appliedAt: { type: Date, default: Date.now }
});

// 3. AUTH ROUTES
app.post('/api/signup', async (req, res) => {
    try {
        const user = new User(req.body);
        await user.save();
        res.status(201).json({ name: user.name, email: user.email });
    } catch (e) { res.status(400).json({ error: "Email already registered" }); }
});

app.post('/api/login', async (req, res) => {
    const user = await User.findOne({ email: req.body.email, password: req.body.password });
    if (user) res.json({ name: user.name, email: user.email });
    else res.status(401).json({ error: "Invalid email or password" });
});

// 4. JOB MANAGEMENT ROUTES (For index.html and employer.html)

// GET: List all jobs or search by keyword
app.get('/api/jobs', async (req, res) => {
    const { keyword } = req.query;
    let query = {};
    if (keyword) {
        query.title = { $regex: keyword, $options: 'i' };
    }
    const jobs = await Job.find(query).sort({ postedAt: -1 });
    res.json(jobs);
});

// POST: Add a new job
app.post('/api/jobs', async (req, res) => {
    try {
        const newJob = new Job(req.body);
        await newJob.save();
        res.status(201).json(newJob);
    } catch (e) { res.status(500).json({ error: "Failed to post job" }); }
});

// DELETE: Remove a job (Crucial for the Dashboard)
app.delete('/api/jobs/:id', async (req, res) => {
    try {
        await Job.findByIdAndDelete(req.params.id);
        res.json({ message: "Job deleted successfully" });
    } catch (e) { res.status(500).json({ error: "Delete failed" }); }
});

// 5. APPLICATION ROUTE
app.post('/api/apply', async (req, res) => {
    try {
        const appln = new Application(req.body);
        await appln.save();
        res.status(201).json({ success: true });
    } catch (e) { res.status(500).json({ error: "Application failed" }); }
});

// 6. AUTO-SEED 20 JOBS (Runs only if DB is empty)
const seedJobs = async () => {
    const count = await Job.countDocuments();
    if (count === 0) {
        const jobs = [
            { title: "Java Developer", company: "TCS", location: "Mumbai" },
            { title: "Frontend Engineer", company: "Google", location: "Remote" },
            { title: "Python Data Scientist", company: "Meta", location: "Bangalore" },
            { title: "Backend Specialist", company: "Amazon", location: "Hyderabad" },
            { title: "React Native Dev", company: "Zomato", location: "Gurgaon" },
            { title: "MERN Stack Dev", company: "CodSoft", location: "Remote" },
            { title: "UI/UX Designer", company: "Adobe", location: "Noida" },
            { title: "DevOps Engineer", company: "Microsoft", location: "Pune" },
            { title: "Database Admin", company: "Oracle", location: "Chennai" },
            { title: "Cybersecurity Analyst", company: "JPMorgan", location: "Mumbai" },
            { title: "Full Stack Dev", company: "Infosys", location: "Nashik" },
            { title: "AI Researcher", company: "OpenAI", location: "Remote" },
            { title: "Node.js Developer", company: "Netflix", location: "Remote" },
            { title: "Machine Learning Eng", company: "Tesla", location: "Bangalore" },
            { title: "Cloud Architect", company: "AWS", location: "Hyderabad" },
            { title: "Quality Assurance", company: "Wipro", location: "Pune" },
            { title: "Blockchain Dev", company: "Coinbase", location: "Remote" },
            { title: "PHP Developer", company: "Freelancer", location: "Remote" },
            { title: "iOS Developer", company: "Apple", location: "Bangalore" },
            { title: "Data Analyst", company: "Deloitte", location: "Mumbai" }
        ];
        await Job.insertMany(jobs);
        console.log("🌱 Database seeded with 20 default jobs!");
    }
};
seedJobs();

// 7. START SERVER
const PORT = 5000;
app.listen(PORT, () => {
    console.log(`🚀 Server running at http://localhost:${PORT}`);
});