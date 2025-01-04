# AI Movie Recommendation System - Project Dev Rush Session 02
## Extending Movie Streaming Platform with AI-Powered Recommendations

Welcome to Session 02 of Project Dev Rush! In this session, we'll enhance our movie streaming platform by adding an AI-powered recommendation system. We'll build upon the frontend from Session 01 and create a Node.js backend that uses Google's Gemini AI for intelligent movie suggestions.

## 🎯 Project Overview

We're adding an AI recommendation system that:
1. Takes the currently watched movie/show as input
2. Uses Gemini AI to analyze viewing preferences
3. Returns personalized movie/show recommendations
4. Seamlessly integrates with our existing streaming interface

## 🛠 Prerequisites

1. Complete setup from Session 01
2. Node.js installed on your system
3. Basic understanding of:
   - JavaScript/ES6+
   - Async/Await
   - API integration
   - DOM manipulation

## 📦 Required Dependencies

```bash
npm install express cors dotenv @google/generative-ai
```

## 🔑 API Keys Setup

1. OMDB API Key (from Session 01)
2. Google Gemini AI API Key
   env
   API_KEY=your_gemini_ai_api_key
   PORT=8000
   

## 💻 Implementation Guide

### 1. Backend Server (server.js)

javascript
const express = require('express')
const cors = require('cors');
const app = express()
const { askAI } = require('./ai')

app.use(express.json());
app.use(cors());

// API Endpoints
app.post('/ai', async (req, res) => {
    const { currently_watching } = req.body;
    const result = await askAI(currently_watching);
    res.send(result);
});


### 2. AI Integration (ai.js)

javascript
const { GoogleGenerativeAI } = require("@google/generative-ai");
const dotenv = require('dotenv');
dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

const askAI = async (currently_watching) => {
    const prompt = `[...your prompt template...]`;
    const result = await model.generateContent(prompt)
    return result.response.text();
}


### 3. Frontend Integration (script.js)

javascript
const nextRecommendation = async (media) => {
    try {
        const response = await fetch('http://localhost:8000/ai', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ currently_watching: media.Title })
        });
        const data = await response.text();
        processRecommendations(data);
    } catch (error) {
        console.error('Error:', error);
    }
}


## 🔄 Key Workflows

### Movie Recommendation Flow
1. User selects a movie/show
2. Frontend sends title to backend
3. Backend processes with Gemini AI
4. AI returns IMDB codes
5. Frontend fetches movie details
6. UI updates with recommendations

### Data Processing
javascript
// Convert AI response to usable format
recomendation = data
    .replace(/\/\/.*$/gm, '')    // Remove comments
    .replace(/[\[\]"]/g, '')     // Remove brackets
    .split(',')                  // Split into array
    .map(item => item.trim())    // Clean items
    .filter(item => item.length > 0);


## 🚀 Running the Project

1. Start the backend:
   bash
   cd backend
   node server.js
   

2. Start the frontend (from Session 01):
   - Open index.html in a browser
   - Or use a local server:
     bash
     npx http-server frontend
     

## ⚠ Common Issues & Solutions

1. CORS Issues
   javascript
   // Ensure proper CORS setup
   app.use(cors());
   

2. API Key Errors
   javascript
   // Check .env file presence and format
   API_KEY=your_key_here
   

3. Response Processing
   javascript
   // Handle empty or malformed responses
   if (!data || data.length === 0) {
       // Provide fallback recommendations
   }
   

## 🔍 Key Concepts Learned

1. *Backend Development*
   - Express.js server setup
   - API endpoint creation
   - Middleware usage

2. *AI Integration*
   - Working with AI APIs
   - Prompt engineering
   - Response processing

3. *Error Handling*
   - Try-catch patterns
   - API error management
   - Data validation

4. *Full Stack Integration*
   - Frontend-Backend communication
   - State management
   - Asynchronous operations

## 🎯 Challenges to Try

1. Add error fallbacks with popular movie suggestions
2. Add user preference tracking
3. Create more sophisticated AI prompts
4. Add loading states and animations

## 📚 Additional Resources

- [Express.js Documentation](https://expressjs.com/)
- [Google Gemini AI Documentation](https://ai.google.dev/)
- [CORS Documentation](https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS)
- [Async JavaScript Guide](https://developer.mozilla.org/en-US/docs/Learn/JavaScript/Asynchronous)

## 🤝 Support

For questions or issues:
- Join our Discord server
- Check the WhatsApp group
- Contact team Skepsis