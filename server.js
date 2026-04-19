const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const app = express();
app.use(express.json({ limit: '50mb' }));
app.use(cors());

mongoose.connect('mongodb://127.0.0.1:27017/tradehub_v6_final')
    .then(() => console.log("✅ Server Data Node: Connected"))
    .catch(err => console.error("❌ Connection Error:", err));

// ─── SCHEMAS ────────────────────────────────────────────────────────────────

const User = mongoose.model('User', new mongoose.Schema({
    fullName: { type: String, required: true },
    company:  { type: String, required: true },
    email:    { type: String, unique: true, required: true },
    password: { type: String, required: true },
    profileImage: { type: String, default: "" },
    bio:      { type: String, default: "" },
    phone:    { type: String, default: "" },
    location: { type: String, default: "" },
    website:  { type: String, default: "" }
}));

const taskSchema = new mongoose.Schema({
    title:     { type: String, required: true },
    completed: { type: Boolean, default: false },
    dueDate:   { type: String, default: "" },
    assignee:  { type: String, default: "" }
});

const milestoneSchema = new mongoose.Schema({
    title:     { type: String, required: true },
    dueDate:   { type: String, default: "" },
    completed: { type: Boolean, default: false }
});

const commentSchema = new mongoose.Schema({
    author:    String,
    text:      String,
    timestamp: { type: Date, default: Date.now }
});

const attachmentSchema = new mongoose.Schema({
    name:      String,
    data:      String,   // base64
    type:      String,
    uploadedAt:{ type: Date, default: Date.now }
});

const projectSchema = new mongoose.Schema({
    userId:      String,
    name:        { type: String, required: true },
    description: { type: String, default: "" },
    startDate:   { type: String, default: "" },
    deadline:    { type: String, default: "" },
    owner:       { type: String, default: "" },
    priority:    { type: String, default: "Medium", enum: ["Low","Medium","High","Urgent"] },
    status:      { type: String, default: "Not Started", enum: ["Not Started","In Progress","Completed","On Hold"] },
    teamMembers: [{ type: String }],
    tags:        [{ type: String }],
    budget:      { type: Number, default: null },
    tasks:       [taskSchema],
    milestones:  [milestoneSchema],
    comments:    [commentSchema],
    attachments: [attachmentSchema]
}, { timestamps: true });

const Project = mongoose.model('Project', projectSchema);

// ─── AUTH ROUTES ─────────────────────────────────────────────────────────────

app.post('/api/register', async (req, res) => {
    try {
        const { email, password, fullName, company, profileImage } = req.body;
        const hash = await bcrypt.hash(password, 10);
        await new User({ email, password: hash, fullName, company, profileImage }).save();
        res.json({ success: true });
    } catch (err) {
        res.status(400).json({ error: "Registration Error" });
    }
});

app.post('/api/login', async (req, res) => {
    const user = await User.findOne({ email: req.body.email });
    if (user && await bcrypt.compare(req.body.password, user.password)) {
        const token = jwt.sign({ id: user._id }, 'CORE_SECRET');
        res.json({
            token,
            userId: user._id,
            fullName: user.fullName,
            company: user.company,
            profileImage: user.profileImage,
            bio: user.bio,
            phone: user.phone,
            location: user.location,
            website: user.website,
            email: user.email
        });
    } else {
        res.status(401).json({ error: "Invalid Credentials" });
    }
});

// ─── ACCOUNT ROUTES ──────────────────────────────────────────────────────────

app.get('/api/account/:userId', async (req, res) => {
    try {
        const user = await User.findById(req.params.userId).select('-password');
        if (!user) return res.status(404).json({ error: "User not found" });
        res.json(user);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

app.put('/api/account/:userId', async (req, res) => {
    try {
        const { fullName, company, bio, phone, location, website, profileImage } = req.body;
        const updated = await User.findByIdAndUpdate(
            req.params.userId,
            { fullName, company, bio, phone, location, website, profileImage },
            { new: true, runValidators: true }
        ).select('-password');
        if (!updated) return res.status(404).json({ error: "User not found" });
        res.json({
            userId: updated._id,
            fullName: updated.fullName,
            company: updated.company,
            profileImage: updated.profileImage,
            bio: updated.bio,
            phone: updated.phone,
            location: updated.location,
            website: updated.website,
            email: updated.email
        });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

app.put('/api/account/:userId/password', async (req, res) => {
    try {
        const { currentPassword, newPassword } = req.body;
        const user = await User.findById(req.params.userId);
        if (!user) return res.status(404).json({ error: "User not found" });
        const valid = await bcrypt.compare(currentPassword, user.password);
        if (!valid) return res.status(401).json({ error: "Current password is incorrect" });
        user.password = await bcrypt.hash(newPassword, 10);
        await user.save();
        res.json({ success: true });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// ─── PROJECT ROUTES ───────────────────────────────────────────────────────────

app.get('/api/projects/:userId', async (req, res) => {
    const data = await Project.find({ userId: req.params.userId }).sort({ createdAt: -1 });
    res.json(data);
});

app.post('/api/projects', async (req, res) => {
    try {
        const p = new Project(req.body);
        await p.save();
        res.json(p);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

app.put('/api/projects/:id', async (req, res) => {
    try {
        const updated = await Project.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
        res.json(updated);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

app.post('/api/projects/:id/comments', async (req, res) => {
    try {
        const project = await Project.findById(req.params.id);
        project.comments.push({ author: req.body.author, text: req.body.text });
        await project.save();
        res.json(project);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

app.post('/api/projects/:id/attachments', async (req, res) => {
    try {
        const project = await Project.findById(req.params.id);
        project.attachments.push({ name: req.body.name, data: req.body.data, type: req.body.type });
        await project.save();
        res.json(project);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

app.delete('/api/projects/:id', async (req, res) => {
    await Project.findByIdAndDelete(req.params.id);
    res.json({ success: true });
});

app.listen(5000, () => console.log("🚀 API active on Port 5000"));