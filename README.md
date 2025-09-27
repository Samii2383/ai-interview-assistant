## AI Interview Assistant 🤖

A comprehensive React application for conducting automated interviews with resume parsing and AI-powered question generation. Perfect for showcasing advanced React skills, state management, and UX patterns.

# 🚀 Live Demo
(https://ai-interview-assistant-lyart-tau.vercel.app/)

## 🛠 Features

### Interviewee (Chat) Tab
- **Resume Upload**: Upload DOCX resumes with automatic information extraction (PDF requires manual input)
- **Smart Form Validation**: Automatically extracts name, email, and phone from resumes
- **Timed Interview**: 6 questions with different difficulty levels and time limits:
  - 2 Easy questions (20 seconds each)
  - 2 Medium questions (60 seconds each) 
  - 2 Hard questions (120 seconds each)
- **Auto-submit**: Answers are automatically submitted when timer expires
- **Session Persistence**: Resume interviews after page refresh or browser close
- **Welcome Back Modal**: Prompts users to resume unfinished sessions

### Interviewer (Dashboard) Tab
- **Candidate Management**: View all candidates with scores and summaries
- **Search & Filter**: Find candidates by name or email
- **Detailed Views**: Click any candidate to see complete interview details
- **Score Analysis**: Visual progress bars and grade assignments
- **AI Feedback**: Review AI-generated feedback for each answer

### ⚙️ Technical Highlights
- React 18 with Hooks
- Redux Toolkit for centralized state management
- Redux Persist for local data persistence
- Resume Parsing: DOCX support via Mammoth.js
- AI Simulation: Timed questions & scoring algorithm
- UI: Ant Design + Inter font family
- Responsive Design: Optimized for desktop & mobile

## Installation

1. **Clone or download the project**
2. **Install dependencies**:
   ```bash
   npm install
   ```
3. **Start the development server**:
   ```bash
   npm start
   ```
4. **Open your browser** and navigate to `http://localhost:3000`

## Usage

### For Interviewees
1. Navigate to the "Interviewee (Chat)" tab
2. Upload your resume (PDF or DOCX)
3. Verify and complete your information
4. Start the interview
5. Answer questions within the time limit
6. Review your final score and feedback

### For Interviewers
1. Navigate to the "Interviewer (Dashboard)" tab
2. View all candidates and their scores
3. Use search and sorting to find specific candidates
4. Click "View Details" to see complete interview results
5. Review AI feedback and candidate performance

##  🗂 Project Structure

```
src/
├── components/
│   ├── MainLayout.js          # Main app layout with navigation
│   ├── IntervieweeTab.js      # Interviewee interface
│   ├── InterviewerTab.js      # Interviewer dashboard
│   ├── ChatInterface.js       # Chat interface with timers
│   ├── CandidateDetails.js    # Detailed candidate view
│   └── WelcomeBackModal.js    # Session resume modal
├── store/
│   ├── index.js              # Redux store configuration
│   └── candidateSlice.js      # Redux slice for candidates
├── services/
│   ├── resumeParser.js        # Resume parsing logic
│   └── aiService.js          # AI question generation and scoring
├── App.js                     # Main app component
├── App.css                    # Global styles
└── index.js                   # App entry point
```

## Dependencies

- **React 18**: Modern React with hooks
- **Redux Toolkit**: State management
- **Redux Persist**: Local data persistence
- **Ant Design**: UI component library with modern theming
- **React Router**: Navigation
- **Mammoth**: DOCX text extraction
- **UUID**: Unique ID generation
- **Day.js**: Date manipulation
- **Google Fonts**: Inter font family for modern typography

## Browser Support

- Chrome (recommended)
- Firefox
- Safari
- Edge

## Notes

- All data is stored locally in your browser
- Resume parsing works best with well-formatted documents
- The AI scoring is simulated for demonstration purposes
- Questions are pre-generated for Full Stack React/Node.js roles
- Timer functionality includes visual warnings for low time remaining

## Troubleshooting

If you encounter issues:
1. Make sure all dependencies are installed: `npm install`
2. Clear browser cache and local storage
3. Check browser console for any error messages
4. Ensure you're using a modern browser with JavaScript enabled

## Future Enhancements

- Real AI integration for question generation
- Video interview capabilities
- Advanced analytics and reporting
- Multi-language support
- Custom question sets
- Integration with HR systems

## 📫 Contact / Contributions

- Email: sameerkhan47149@gmail.com
- LinkedIn: sameer-khan-312715235
- GitHub: Samii2383
