const express = require("express");
const cors = require("cors");
require("dotenv").config();
const { GoogleGenerativeAI } = require("@google/generative-ai");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const User = require("./models/User");
const Email = require("./models/Email");

const app = express();
app.use(cors());
app.use(express.json());

// MongoDB connection
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('MongoDB connected'))
.catch((err) => console.error('MongoDB connection error:', err));

const genAI =  new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);

// JWT middleware
function authMiddleware(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'No token provided' });
  }
  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ error: 'Invalid token' });
  }
}

// Signup endpoint
app.post("/signup", async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: "Email and password are required" });
  }
  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: "User already exists" });
    }
    const user = new User({ email, password });
    await user.save();
    const token = jwt.sign({ id: user._id, email: user.email }, process.env.JWT_SECRET, { expiresIn: '7d' });
    res.json({ token });
  } catch (err) {
    res.status(500).json({ error: err.message || "Signup failed" });
  }
});

// Login endpoint
app.post("/login", async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: "Email and password are required" });
  }
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ error: "Invalid credentials" });
    }
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(400).json({ error: "Invalid credentials" });
    }
    const token = jwt.sign({ id: user._id, email: user.email }, process.env.JWT_SECRET, { expiresIn: '7d' });
    res.json({ token });
  } catch (err) {
    res.status(500).json({ error: err.message || "Login failed" });
  }
});

app.post("/generate", authMiddleware, async (req, res) => {
    const { emailText, tone, customPrompt } = req.body;

    // Validate required inputs
    if (!emailText || !tone) {
        return res.status(400).json({ error: "Missing required fields: emailText and tone" });
    }

    // Construct a clear and focused prompt for generating replies
    let prompt = `
You are an assistant helping a professional write replies to emails.

Respond to the following email in a ${tone} tone:

"${emailText}"

Make sure your reply is clear, context-aware, and appropriately addresses the sender's request or concern.
`;

    // If there's a custom prompt, append it
    if (customPrompt && customPrompt.trim() !== "") {
        prompt += `\n\nAdditional instructions: ${customPrompt}`;
    }

    try {
        const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
        const result = await model.generateContent(prompt);
        const response = result.response.text();

        // Save to DB
        await Email.create({
            user: req.user.id,
            prompt,
            response
        });

        res.setHeader("Content-Type", "application/json");
        res.json({ response });
    } catch (error) {
        console.error("Error generating email:", error);
        res.status(500).json({ error: error.message || "Failed to generate email" });
    }
});

// Get user's email history
app.get("/history", authMiddleware, async (req, res) => {
    try {
        const emails = await Email.find({ user: req.user.id }).sort({ createdAt: -1 });
        res.json({ emails });
    } catch (error) {
        res.status(500).json({ error: error.message || "Failed to fetch history" });
    }
});

const Port = 5000;
app.listen(Port, () => {
    console.log(`Server is running on port ${Port}`);
});