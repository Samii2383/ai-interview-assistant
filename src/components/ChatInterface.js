import React, { useState, useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { 
  Card, 
  Input, 
  Button, 
  Typography, 
  Progress, 
  Alert,
  Modal,
  Result,
  Space,
  Avatar
} from 'antd';
import { 
  Send, 
  Clock, 
  HelpCircle, 
  X, 
  Bot, 
  User, 
  CheckCircle,
  AlertCircle,
  Timer,
  Play,
  Pause
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { evaluateAnswer, calculateFinalScore } from '../services/aiService';
import { updateInterviewProgress, completeInterview, pauseInterview } from '../store/candidateSlice';

const { Text, Title } = Typography;
const { TextArea } = Input;

// Circular Timer Component
const CircularTimer = ({ timeLeft, totalTime, size = 64 }) => {
  const radius = (size - 8) / 2;
  const circumference = 2 * Math.PI * radius;
  const progress = ((totalTime - timeLeft) / totalTime) * circumference;
  
  const getStrokeColor = () => {
    const percentage = (timeLeft / totalTime) * 100;
    if (percentage <= 20) return '#ef4444'; // danger
    if (percentage <= 40) return '#f59e0b'; // warning
    return '#3b82f6'; // primary
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="circular-timer" style={{ width: size, height: size }}>
      <svg width={size} height={size}>
        {/* Background circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="currentColor"
          strokeWidth="4"
          fill="none"
          className="text-slate-200 dark:text-slate-700"
        />
        {/* Progress circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={getStrokeColor()}
          strokeWidth="4"
          fill="none"
          strokeDasharray={circumference}
          strokeDashoffset={circumference - progress}
          strokeLinecap="round"
          className="transition-all duration-1000 ease-in-out"
          style={{
            filter: 'drop-shadow(0 0 6px currentColor)',
          }}
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <Text className="text-sm font-bold text-slate-700 dark:text-slate-300">
          {formatTime(timeLeft)}
        </Text>
      </div>
    </div>
  );
};

const ChatInterface = ({ interview, candidate }) => {
  const dispatch = useDispatch();
  const [messages, setMessages] = useState([]);
  const [currentAnswer, setCurrentAnswer] = useState('');
  const [timeLeft, setTimeLeft] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [finalResults, setFinalResults] = useState(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [isInitialized, setIsInitialized] = useState(false);
  const [showExitModal, setShowExitModal] = useState(false);
  const messagesEndRef = useRef(null);
  const timerRef = useRef(null);

  const currentQuestion = interview.questions[currentQuestionIndex];
  const isLastQuestion = currentQuestionIndex >= interview.questions.length - 1;

  // Initialize interview on component mount
  useEffect(() => {
    if (!isInitialized && currentQuestion) {
      initializeInterview();
      setIsInitialized(true);
    }
  }, [currentQuestion, isInitialized]);

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Timer effect
  useEffect(() => {
    if (timeLeft > 0 && !isSubmitting) {
      const timer = setTimeout(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            handleAutoSubmit();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      
      return () => clearTimeout(timer);
    }
  }, [timeLeft, isSubmitting]);

  const initializeInterview = () => {
    const welcomeMessage = {
      id: 'welcome',
      type: 'ai',
      content: `Hello ${candidate.name}! Welcome to your Full Stack React/Node.js interview. Let's begin with the first question.`,
      timestamp: new Date().toISOString()
    };

    const questionMessage = {
      id: `question-${currentQuestion.id}`,
      type: 'ai',
      content: `Question ${currentQuestionIndex + 1}/${interview.questions.length} (${currentQuestion.difficulty.toUpperCase()} - ${currentQuestion.timeLimit}s):\n\n${currentQuestion.question}`,
      timestamp: new Date().toISOString()
    };

    setMessages([welcomeMessage, questionMessage]);
    setTimeLeft(currentQuestion.timeLimit);
  };

  const handleAutoSubmit = () => {
    if (!isSubmitting) {
      submitAnswer('[Time expired - No answer provided]');
    }
  };

  const submitAnswer = async (answerText = null) => {
    if (isSubmitting) return;
    
    setIsSubmitting(true);
    const answer = answerText || currentAnswer || '[No answer provided]';
    
    // Add user message
    const userMessage = {
      id: `answer-${Date.now()}`,
      type: 'user',
      content: answer,
      timestamp: new Date().toISOString()
    };

    setMessages(prev => [...prev, userMessage]);

    // Evaluate answer
    const evaluation = evaluateAnswer(currentQuestion, answer);
    
    // Add AI feedback
    const feedbackMessage = {
      id: `feedback-${Date.now()}`,
      type: 'ai',
      content: `Score: ${evaluation.score}/100\n\nFeedback:\n${evaluation.feedback.join('\n')}`,
      timestamp: new Date().toISOString()
    };

    setMessages(prev => [...prev, feedbackMessage]);

    // Update interview progress
    const updatedAnswers = [...(interview.answers || []), {
      questionId: currentQuestion.id,
      question: currentQuestion.question,
      answer: answer,
      score: evaluation.score,
      feedback: evaluation.feedback,
      timeSpent: currentQuestion.timeLimit - timeLeft
    }];

    const updatedInterview = {
      ...interview,
      answers: updatedAnswers,
      currentQuestionIndex: currentQuestionIndex + 1
    };

    dispatch(updateInterviewProgress(updatedInterview));

    if (isLastQuestion) {
      // Calculate final results
      const finalScore = calculateFinalScore(updatedAnswers);
      setFinalResults(finalScore);
      setShowResults(true);
      
      // Complete the interview
      dispatch(completeInterview({
        candidateId: candidate.id,
        interview: {
          ...updatedInterview,
          status: 'completed',
          endTime: new Date().toISOString(),
          finalScore: finalScore.totalScore,
          grade: finalScore.grade,
          summary: finalScore.summary
        }
      }));
    } else {
      // Move to next question after a delay
      setTimeout(() => {
        const nextQuestionIndex = currentQuestionIndex + 1;
        const nextQuestion = interview.questions[nextQuestionIndex];
        
        const nextQuestionMessage = {
          id: `question-${nextQuestion.id}`,
          type: 'ai',
          content: `Question ${nextQuestionIndex + 1}/${interview.questions.length} (${nextQuestion.difficulty.toUpperCase()} - ${nextQuestion.timeLimit}s):\n\n${nextQuestion.question}`,
          timestamp: new Date().toISOString()
        };

        setMessages(prev => [...prev, nextQuestionMessage]);
        setCurrentAnswer('');
        setCurrentQuestionIndex(nextQuestionIndex);
        setTimeLeft(nextQuestion.timeLimit);
        setIsSubmitting(false);
      }, 3000);
    }
  };

  const handleDontKnow = () => {
    submitAnswer("I don't know the answer to this question.");
  };

  const handleExitInterview = () => {
    setShowExitModal(true);
  };

  const confirmExit = () => {
    // Add exit message to chat
    const exitMessage = {
      id: `exit-${Date.now()}`,
      type: 'ai',
      content: `Thank you for your time, ${candidate.name}! We appreciate you taking the time to participate in this interview. Your session has been saved and you can resume it anytime. Have a great day! 👋`,
      timestamp: new Date().toISOString()
    };

    setMessages(prev => [...prev, exitMessage]);
    
    // Update interview status to paused
    const updatedInterview = {
      ...interview,
      status: 'paused',
      pausedAt: new Date().toISOString(),
      currentQuestionIndex: currentQuestionIndex
    };

    dispatch(pauseInterview({
      candidateId: candidate.id,
      interview: updatedInterview
    }));
    
    // Close modal and show exit message
    setShowExitModal(false);
    
    // Redirect to main page after a delay
    setTimeout(() => {
      window.location.href = '/';
    }, 3000);
  };

  const cancelExit = () => {
    setShowExitModal(false);
  };

  const handleSubmit = () => {
    submitAnswer();
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getTimerClass = () => {
    if (timeLeft <= 10) return 'timer-warning';
    if (timeLeft <= 30) return 'timer-warning';
    return '';
  };

  const getProgressPercentage = () => {
    return ((currentQuestionIndex + 1) / interview.questions.length) * 100;
  };

  const renderResults = () => (
    <Modal
      title="Interview Complete!"
      open={showResults}
      footer={null}
      width={600}
    >
      <Result
        status="success"
        title={`Interview Completed!`}
        subTitle={`Final Score: ${finalResults.totalScore}/100 (Grade: ${finalResults.grade})`}
        extra={[
          <Button type="primary" key="ok" onClick={() => setShowResults(false)}>
            OK
          </Button>
        ]}
      >
        <div style={{ textAlign: 'left', marginTop: 24 }}>
          <Title level={4}>Summary:</Title>
          <pre style={{ whiteSpace: 'pre-wrap', fontSize: '14px' }}>
            {finalResults.summary}
          </pre>
        </div>
      </Result>
    </Modal>
  );

  if (showResults) {
    return renderResults();
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card className="overflow-hidden">
        {/* Modern Timer Header */}
        <div className={`timer-display ${getTimerClass()}`}>
          <div className="flex items-center space-x-4">
            <CircularTimer 
              timeLeft={timeLeft} 
              totalTime={currentQuestion?.timeLimit || 60} 
              size={48}
            />
            <div>
              <Text className="text-white/90 text-sm font-medium">
                Question {currentQuestionIndex + 1} of {interview.questions.length}
              </Text>
              <div className="flex items-center space-x-2">
                <Timer className="w-4 h-4" />
                <Text className="text-white font-semibold">
                  Time Remaining: {formatTime(timeLeft)}
                </Text>
              </div>
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            <Progress
              percent={getProgressPercentage()}
              showInfo={false}
              strokeColor="#ffffff"
              trailColor="rgba(255, 255, 255, 0.3)"
              className="w-24"
            />
            <Button
              type="text"
              danger
              icon={<X className="w-4 h-4" />}
              onClick={handleExitInterview}
              className="!text-white hover:!bg-white/10 !border !border-white/30 !rounded-xl"
            >
              Exit
            </Button>
          </div>
        </div>
        
        {/* Modern Chat Container */}
        <div className="chat-container">
          <div className="chat-messages">
            <AnimatePresence>
              {messages.map((message, index) => (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, y: 20, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -20, scale: 0.95 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                  className={`message ${message.type}`}
                >
                  <div className="flex items-start space-x-3">
                    <Avatar
                      size={32}
                      icon={message.type === 'ai' ? <Bot className="w-4 h-4" /> : <User className="w-4 h-4" />}
                      className={`${
                        message.type === 'ai' 
                          ? 'bg-gradient-to-br from-primary-500 to-primary-600' 
                          : 'bg-gradient-to-br from-slate-500 to-slate-600'
                      }`}
                    />
                    <div className="message-content">
                      <pre className="whitespace-pre-wrap font-sans text-sm leading-relaxed m-0">
                        {message.content}
                      </pre>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
            <div ref={messagesEndRef} />
          </div>
          
          {/* Modern Chat Input */}
          <div className="chat-input">
            <div className="space-y-4">
              <TextArea
                value={currentAnswer}
                onChange={(e) => setCurrentAnswer(e.target.value)}
                placeholder="Type your answer here..."
                rows={3}
                disabled={isSubmitting}
                onPressEnter={(e) => {
                  if (e.shiftKey) return;
                  e.preventDefault();
                  handleSubmit();
                }}
                className="!rounded-xl !border-slate-200 dark:!border-slate-600 !resize-none"
              />
              
              <div className="flex justify-between items-center">
                <div className="flex items-center space-x-2 text-slate-500 dark:text-slate-400">
                  <Clock className="w-4 h-4" />
                  <Text className="text-sm">
                    Question {currentQuestionIndex + 1} of {interview.questions.length}
                  </Text>
                </div>
                
                <Space>
                  <Button
                    type="default"
                    icon={<HelpCircle className="w-4 h-4" />}
                    onClick={handleDontKnow}
                    disabled={isSubmitting}
                    className="!border-danger-300 !text-danger-600 hover:!border-danger-400 hover:!text-danger-700 !rounded-xl"
                  >
                    Don't Know
                  </Button>
                  <Button
                    type="primary"
                    icon={<Send className="w-4 h-4" />}
                    onClick={handleSubmit}
                    disabled={isSubmitting}
                    loading={isSubmitting}
                    className="!rounded-xl !h-10 !px-6"
                  >
                    {isSubmitting ? 'Submitting...' : 'Submit Answer'}
                  </Button>
                </Space>
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* Modern Exit Confirmation Modal */}
      <Modal
        title={
          <div className="flex items-center space-x-2">
            <AlertCircle className="w-5 h-5 text-danger-500" />
            <span>Exit Interview</span>
          </div>
        }
        open={showExitModal}
        onOk={confirmExit}
        onCancel={cancelExit}
        okText="Yes, Exit"
        cancelText="Continue Interview"
        okButtonProps={{ danger: true, className: '!rounded-xl' }}
        cancelButtonProps={{ className: '!rounded-xl' }}
        className="!rounded-2xl"
        centered
      >
        <div className="text-center py-6">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.3 }}
            className="w-16 h-16 bg-danger-100 dark:bg-danger-900/20 rounded-2xl flex items-center justify-center mx-auto mb-4"
          >
            <X className="w-8 h-8 text-danger-500" />
          </motion.div>
          
          <Title level={4} className="mb-2">
            Are you sure you want to exit the interview?
          </Title>
          <Text className="text-slate-600 dark:text-slate-400 block mb-6">
            Your progress will be saved and you can resume the interview later.
          </Text>
          
          <Alert
            message="Interview Progress"
            description={`You've completed ${currentQuestionIndex} out of ${interview.questions.length} questions. Your session will be saved.`}
            type="info"
            showIcon
            className="!rounded-xl !border-0"
          />
        </div>
      </Modal>
    </motion.div>
  );
};

export default ChatInterface;
