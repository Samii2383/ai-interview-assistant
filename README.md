

# 🤖 AI Interview Assistant

> **A modern, production-ready SaaS platform for automated technical interviews with AI-powered resume parsing and real-time evaluation.**

[![React](https://img.shields.io/badge/React-18.2.0-blue.svg)](https://reactjs.org/)
[![Ant Design](https://img.shields.io/badge/Ant%20Design-5.2.0-blue.svg)](https://ant.design/)
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3.3.3-blue.svg)](https://tailwindcss.com/)
[![Framer Motion](https://img.shields.io/badge/Framer%20Motion-10.16.4-purple.svg)](https://www.framer.com/motion/)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)
(✨ Polished UI: modernized design with Tailwind/AntD, improved chat, dashboard, and responsiveness)

## Live Demo
[ai-interview-assistance](https://ai-interview-assistant-dwxp3nnc1-sameerkhan47149-8480s-projects.vercel.app/)

## ✨ Features

### 🎯 **For Candidates (Interviewees)**
- **📄 Smart Resume Upload** - Drag & drop PDF/DOCX files with automatic parsing
- **⚡ Real-time Interview** - Live chat interface with AI-powered questions
- **⏱️ Smart Timer** - Circular countdown with visual progress indicators
- **📊 Instant Feedback** - Real-time scoring and detailed evaluation
- **💾 Session Management** - Resume interviews anytime with progress saving
- **📱 Mobile Responsive** - Seamless experience across all devices


### ⚙️ Technical Highlights
- React 18 with Hooks
- Redux Toolkit for centralized state management
- Redux Persist for local data persistence
- Resume Parsing: DOCX support via Mammoth.js
- AI Simulation: Timed questions & scoring algorithm
- UI: Ant Design + Inter font family
- Responsive Design: Optimized for desktop & mobile

### 🏢 **For Recruiters (Interviewers)**
- **📊 Analytics Dashboard** - Comprehensive candidate performance metrics
- **🔍 Advanced Filtering** - Search and filter by score, status, and date
- **📈 Data Visualization** - Beautiful charts and progress tracking
- **👥 Candidate Management** - Detailed candidate profiles and interview history
- **🎨 Modern UI** - Professional SaaS interface with dark mode support
- **📱 Mobile Dashboard** - Full functionality on mobile devices
ec05ef0 (✨ Polished UI: modernized design with Tailwind/AntD, improved chat, dashboard, and responsiveness)

### 🚀 **Technical Highlights**
- **🎨 Modern Design System** - TailwindCSS with custom design tokens
- **🌙 Dark Mode Support** - Complete theme system with persistence
- **✨ Smooth Animations** - Framer Motion micro-interactions
- **📱 Mobile-First** - Responsive design for all screen sizes
- **⚡ Performance Optimized** - Fast loading and smooth interactions
- **🔒 Type Safe** - TypeScript support for better development experience

## 🖼️ Screenshots

### Dashboard Overview
[Dashboard]<img width="1316" height="1079" alt="Screenshot 2025-09-28 133841" src="https://github.com/user-attachments/assets/9b15583f-a43b-4550-8d05-d4d0e0c90e06" />


### Interview Interface
[Interview]<img width="1885" height="903" alt="Screenshot 2025-09-28 134119" src="https://github.com/user-attachments/assets/415ece05-4b0c-472f-81e9-7390e6542bce" />


### Candidate Management
[Candidates]<img width="1902" height="911" alt="Screenshot 2025-09-28 134201" src="https://github.com/user-attachments/assets/932825d3-2332-48fe-8b1c-e28178075cd3" />


## 🛠️ Tech Stack

### **Frontend**
- **React 18.2.0** - Modern React with hooks and functional components
- **Ant Design 5.2.0** - Enterprise-grade UI component library
- **TailwindCSS 3.3.3** - Utility-first CSS framework
- **Framer Motion 10.16.4** - Production-ready motion library
- **Lucide React** - Beautiful, customizable SVG icons
- **Redux Toolkit** - Predictable state management
- **React Router** - Client-side routing

### **Backend & Services**
- **Resume Parsing** - Mammoth.js for DOCX parsing
- **AI Evaluation** - Custom AI service for answer assessment
- **Local Storage** - Redux Persist for data persistence
- **File Processing** - Web Workers for PDF handling

### **Development Tools**
- **Create React App** - Zero-configuration React setup
- **PostCSS** - CSS processing with TailwindCSS
- **ESLint** - Code linting and quality assurance
- **Prettier** - Code formatting

## 🚀 Quick Start

### Prerequisites
- **Node.js** 16.0 or higher
- **npm** 8.0 or higher

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/ai-interview-assistant.git
   cd ai-interview-assistant
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm start
   ```

4. **Open your browser**
   ```
   http://localhost:3000
   ```

## 📁 Project Structure

```
ai-interview-assistant/
├── public/
│   ├── index.html
│   └── favicon.ico
├── src/
│   ├── components/
│   │   ├── MainLayout.js          # Main navigation and layout
│   │   ├── IntervieweeTab.js      # Candidate interview interface
│   │   ├── InterviewerTab.js      # Recruiter dashboard
│   │   ├── ChatInterface.js       # Real-time chat component
│   │   ├── CandidateDetails.js    # Candidate profile details
│   │   └── WelcomeBackModal.js    # Session resume modal
│   ├── services/
│   │   ├── aiService.js           # AI evaluation logic
│   │   ├── resumeParser.js        # Resume parsing service
│   │   └── simpleResumeParser.js  # Simplified parser
│   ├── store/
│   │   ├── candidateSlice.js      # Redux state management
│   │   └── index.js               # Store configuration
│   ├── utils/
│   ├── App.js                     # Main app component
│   ├── App.css                    # Global styles with TailwindCSS
│   └── index.js                   # App entry point
├── tailwind.config.js             # TailwindCSS configuration
├── postcss.config.js              # PostCSS configuration
└── package.json
```

## 🎨 Design System

### **Color Palette**
- **Primary**: Blue gradient (`#3b82f6` to `#1d4ed8`)
- **Success**: Green (`#22c55e`)
- **Warning**: Orange (`#f59e0b`)
- **Danger**: Red (`#ef4444`)
- **Neutral**: Slate grays (`#0f172a` to `#f8fafc`)

### **Typography**
- **Font Family**: Inter (Google Fonts)
- **Weights**: 300, 400, 500, 600, 700
- **Scale**: Responsive typography with TailwindCSS

### **Components**
- **Cards**: Rounded corners (2xl), soft shadows
- **Buttons**: Rounded (xl), hover animations
- **Inputs**: Rounded (xl), focus states with glow
- **Modals**: Rounded (2xl), backdrop blur
- **Tables**: Rounded (xl), hover effects

## 🔧 Configuration

### **TailwindCSS**
The project uses a custom TailwindCSS configuration with:
- Custom color palette
- Extended animations
- Custom shadows and effects
- Dark mode support

### **Future Scope**

- Real AI integration for question generation
- Video interview capabilities
- Advanced analytics and reporting
- Multi-language support
- Custom question sets
- Integration with HR systems

## 📫 Contact / Contributions

- Email: sameerkhan47149@gmail.com
- LinkedIn: https://www.linkedin.com/in/sameer-khan-312715235/
- GitHub: https://github.com/Samii2383

### **Ant Design Theme**
Custom Ant Design theme with:
- Inter font family
- Custom color tokens
- Rounded corners
- Modern spacing

## 📱 Responsive Design

The application is fully responsive with breakpoints:
- **Mobile**: < 768px
- **Tablet**: 768px - 1024px
- **Desktop**: > 1024px

## 🌙 Dark Mode

Complete dark mode support with:
- System preference detection
- Manual toggle
- Persistent storage
- Smooth transitions

## 🧪 Testing

```bash
# Run tests
npm test

# Run tests with coverage
npm test -- --coverage

# Run tests in watch mode
npm test -- --watch
```

## 📦 Deployment

### **Vercel** (Recommended)
```bash
npm install -g vercel
vercel
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Ant Design** - For the amazing UI component library
- **TailwindCSS** - For the utility-first CSS framework
- **Framer Motion** - For smooth animations
- **Lucide** - For beautiful icons
- **React Team** - For the amazing framework

## 📫 Contact / Contributions

- Email: sameerkhan47149@gmail.com
- LinkedIn: https://www.linkedin.com/in/sameer-khan-312715235/
- GitHub: https://github.com/Samii2383


## 🗺️ Future Enhancemnet

- [ ] **Video Interviews** - Face-to-face video chat integration
- [ ] **Advanced Analytics** - Detailed performance insights
- [ ] **Team Collaboration** - Multi-user interview sessions
- [ ] **API Integration** - RESTful API for external systems
- [ ] **Mobile App** - React Native mobile application
- [ ] **AI Improvements** - Enhanced question generation
- [ ] **Multi-language** - Internationalization support

---

<div align="center">

**Built with ❤️ by the AI Interview Assistant Team**

[⭐ Star this repo](https://github.com/Samii2383/ai-interview-assistant) • [🐛 Report Bug](https://github.com/Samii2383/ai-interview-assistant/issues) • [💡 Request Feature](https://github.com/Samii2383/ai-interview-assistant/issues)

</div>
