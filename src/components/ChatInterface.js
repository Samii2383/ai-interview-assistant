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
  Space
} from 'antd';
import { SendOutlined, ClockCircleOutlined, QuestionCircleOutlined, CloseOutlined } from '@ant-design/icons';
import { evaluateAnswer, calculateFinalScore } from '../services/aiService';
import { updateInterviewProgress, completeInterview, pauseInterview } from '../store/candidateSlice';

const { Text, Title } = Typography;
const { TextArea } = Input;

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
    <div>
      <Card>
        <div className={`timer-display ${getTimerClass()}`} style={{
          fontFamily: 'Inter, sans-serif',
          fontWeight: 600,
          letterSpacing: '-0.01em',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <span>
            <ClockCircleOutlined /> Time Remaining: {formatTime(timeLeft)}
          </span>
          <Button
            type="text"
            danger
            icon={<CloseOutlined />}
            onClick={handleExitInterview}
            style={{
              color: 'white',
              border: '1px solid rgba(255, 255, 255, 0.3)',
              background: 'rgba(255, 255, 255, 0.1)'
            }}
          >
            Exit Interview
          </Button>
        </div>
        
        <div className="chat-container">
          <div className="chat-messages">
            {messages.map((message) => (
              <div key={message.id} className={`message ${message.type}`}>
                <div className="message-content" style={{
                  fontFamily: 'Inter, sans-serif',
                  fontWeight: 400,
                  lineHeight: 1.5
                }}>
                  <pre style={{ 
                    whiteSpace: 'pre-wrap', 
                    margin: 0,
                    fontFamily: 'Inter, sans-serif',
                    fontWeight: 400,
                    lineHeight: 1.5
                  }}>
                    {message.content}
                  </pre>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
          
          <div className="chat-input">
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
            />
            <div style={{ marginTop: 12, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Text type="secondary">
                Question {currentQuestionIndex + 1} of {interview.questions.length}
              </Text>
              <Space>
                <Button
                  type="default"
                  icon={<QuestionCircleOutlined />}
                  onClick={handleDontKnow}
                  disabled={isSubmitting}
                  style={{ 
                    borderColor: '#ff4d4f',
                    color: '#ff4d4f'
                  }}
                >
                  Don't Know
                </Button>
                <Button
                  type="primary"
                  icon={<SendOutlined />}
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                  loading={isSubmitting}
                >
                  {isSubmitting ? 'Submitting...' : 'Submit Answer'}
                </Button>
              </Space>
            </div>
          </div>
        </div>
      </Card>

      {/* Exit Confirmation Modal */}
      <Modal
        title="Exit Interview"
        open={showExitModal}
        onOk={confirmExit}
        onCancel={cancelExit}
        okText="Yes, Exit"
        cancelText="Continue Interview"
        okButtonProps={{ danger: true }}
        centered
      >
        <div style={{ textAlign: 'center', padding: '20px 0' }}>
          <CloseOutlined style={{ fontSize: '48px', color: '#ff4d4f', marginBottom: '16px' }} />
          <Title level={4}>Are you sure you want to exit the interview?</Title>
          <Text type="secondary" style={{ display: 'block', marginBottom: '16px' }}>
            Your progress will be saved and you can resume the interview later.
          </Text>
          <Alert
            message="Interview Progress"
            description={`You've completed ${currentQuestionIndex} out of ${interview.questions.length} questions. Your session will be saved.`}
            type="info"
            showIcon
          />
        </div>
      </Modal>
    </div>
  );
};

export default ChatInterface;
