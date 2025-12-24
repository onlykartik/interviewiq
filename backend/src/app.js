const express = require('express');
const cors = require('cors');
const app = express();



app.use(cors({
    origin: 'http://localhost:5173'
}));

app.use(express.json());



// Impport routes
const companyRoutes = require('./routes/company.routes')
const interviewRoutes = require('./routes/interview.routes');
const questionRoutes = require('./routes/question.routes');
const authRoutes = require('./routes/auth.routes');
const dashboardRoutes = require('./routes/dashboard.routes');
const exploreRoutes = require('./routes/explore.routes');
const userRoutes =  require('./routes/user.routes')
const aiTestRoutes = require('./routes/ai.test.routes');
const aiAnalysisRoutes = require('./routes/ai.analysis.routes');
const aiProfileRoutes = require('./routes/ai.profile.routes');
const quizRoutes = require('./routes/quiz.routes');

//Connect routes
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/companies', companyRoutes)
app.use('/api/interviews', interviewRoutes);
app.use('/api/questions', questionRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/explore', exploreRoutes);
app.use('/api/users', userRoutes);
app.use('/api/ai', aiTestRoutes);
app.use('/api/ai', aiAnalysisRoutes);
app.use('/api/ai', aiProfileRoutes);
app.use('/api/quiz', quizRoutes);


app.get('/', (req, res) => {
    res.send('InterviewIQ API is running');
});

module.exports = app;
