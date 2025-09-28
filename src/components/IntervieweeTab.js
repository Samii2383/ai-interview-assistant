import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { 
  Upload, 
  Button, 
  Card, 
  Typography, 
  Alert, 
  Input, 
  Form, 
  Modal,
  Progress,
  Spin,
  Steps
} from 'antd';
import { 
  Upload as UploadIcon, 
  FileText, 
  User, 
  Mail, 
  Phone, 
  CheckCircle,
  Clock,
  Play,
  Sparkles,
  ArrowRight,
  AlertCircle
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { parseResume } from '../services/simpleResumeParser';
import { generateQuestions } from '../services/aiService';
import { 
  addCandidate, 
  setCurrentCandidate, 
  setCurrentInterview,
  updateInterviewProgress,
  completeInterview,
  clearCurrentSession
} from '../store/candidateSlice';
import ChatInterface from './ChatInterface';
import WelcomeBackModal from './WelcomeBackModal';

const { Title, Text } = Typography;
const { Dragger } = Upload;

const IntervieweeTab = () => {
  const dispatch = useDispatch();
  const { currentCandidate, currentInterview, candidates } = useSelector(state => state.candidates);
  const [step, setStep] = useState('upload'); // upload, info, interview, completed
  const [uploading, setUploading] = useState(false);
  const [candidateInfo, setCandidateInfo] = useState({ name: '', email: '', phone: '' });
  const [showWelcomeBack, setShowWelcomeBack] = useState(false);
  const [unfinishedCandidate, setUnfinishedCandidate] = useState(null);

  useEffect(() => {
    // Check for unfinished sessions on component mount
    const unfinished = candidates.find(c => c.status === 'in_progress' || c.status === 'paused');
    if (unfinished) {
      setUnfinishedCandidate(unfinished);
      setShowWelcomeBack(true);
    }
  }, [candidates]);

  const handleFileUpload = async (file) => {
    setUploading(true);
    try {
      const parsedInfo = await parseResume(file);
      setCandidateInfo(parsedInfo);
      setStep('info');
    } catch (error) {
      console.error('Upload error:', error);
    } finally {
      setUploading(false);
    }
    return false; // Prevent default upload
  };

  const handleInfoSubmit = () => {
    const { name, email, phone } = candidateInfo;
    if (!name || !email || !phone) {
      return;
    }

    const candidate = {
      id: Date.now().toString(),
      name,
      email,
      phone,
      resumeText: candidateInfo.rawText,
      status: 'in_progress',
      createdAt: new Date().toISOString()
    };

    dispatch(addCandidate(candidate));
    dispatch(setCurrentCandidate(candidate));
    setStep('interview');
  };

  const handleStartInterview = () => {
    const questions = generateQuestions();
    const allQuestions = [...questions.easy, ...questions.medium, ...questions.hard];
    
    const interview = {
      id: Date.now().toString(),
      candidateId: currentCandidate.id,
      questions: allQuestions,
      currentQuestionIndex: 0,
      answers: [],
      startTime: new Date().toISOString(),
      status: 'in_progress'
    };

    dispatch(setCurrentInterview(interview));
  };

  const handleResumeSession = () => {
    const unfinishedCandidate = candidates.find(c => c.status === 'in_progress' || c.status === 'paused');
    if (unfinishedCandidate) {
      dispatch(setCurrentCandidate(unfinishedCandidate));
      // Find the interview for this candidate
      const interview = candidates.find(c => c.id === unfinishedCandidate.id)?.interview;
      if (interview) {
        dispatch(setCurrentInterview(interview));
      }
      setStep('interview');
    }
    setShowWelcomeBack(false);
  };

  const handleStartNewSession = () => {
    dispatch(clearCurrentSession());
    setStep('upload');
    setCandidateInfo({ name: '', email: '', phone: '' });
    setShowWelcomeBack(false);
  };

  const renderUploadStep = () => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card className="overflow-hidden">
        <div className="text-center mb-8">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="w-20 h-20 bg-gradient-to-br from-primary-500 to-primary-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-glow"
          >
            <UploadIcon className="w-10 h-10 text-white" />
          </motion.div>
          
          <Title level={2} className="gradient-text mb-4">
            Upload Your Resume
          </Title>
          <Text className="text-slate-600 dark:text-slate-400 text-lg max-w-2xl mx-auto block">
            Please upload your resume in PDF or DOCX format. DOCX files will be parsed automatically, while PDF files require manual input.
          </Text>
        </div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <Dragger
            name="resume"
            multiple={false}
            accept=".pdf,.docx"
            beforeUpload={handleFileUpload}
            showUploadList={false}
            className="!border-2 !border-dashed !border-slate-300 dark:!border-slate-600 !rounded-2xl !bg-slate-50 dark:!bg-slate-800 hover:!border-primary-400 hover:!bg-primary-50 dark:hover:!bg-primary-900/20 !transition-all !duration-300 !p-12"
          >
            <div className="text-center">
              <motion.div
                whileHover={{ scale: 1.1, rotate: 5 }}
                transition={{ duration: 0.2 }}
                className="w-16 h-16 bg-gradient-to-br from-primary-100 to-primary-200 dark:from-primary-900/30 dark:to-primary-800/30 rounded-xl flex items-center justify-center mx-auto mb-4"
              >
                <FileText className="w-8 h-8 text-primary-600 dark:text-primary-400" />
              </motion.div>
              
              <p className="text-lg font-medium text-slate-700 dark:text-slate-300 mb-2">
                Click or drag resume file to this area to upload
              </p>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                Support for PDF and DOCX files • Max 10MB
              </p>
            </div>
          </Dragger>
        </motion.div>

        <AnimatePresence>
          {uploading && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-8 text-center"
            >
              <div className="inline-flex items-center space-x-3 bg-primary-50 dark:bg-primary-900/20 px-6 py-4 rounded-xl">
                <Spin size="large" />
                <div>
                  <Text className="text-primary-600 dark:text-primary-400 font-medium">
                    Parsing your resume...
                  </Text>
                  <div className="typing-indicator mt-2">
                    <span></span>
                    <span></span>
                    <span></span>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </Card>
    </motion.div>
  );

  const renderInfoStep = () => {
    const { name, email, phone, isPdfFile } = candidateInfo;
    const missingFields = [];
    if (!name) missingFields.push('Name');
    if (!email) missingFields.push('Email');
    if (!phone) missingFields.push('Phone');

    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Card className="overflow-hidden">
          <div className="text-center mb-8">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="w-20 h-20 bg-gradient-to-br from-success-500 to-success-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-glow-success"
            >
              <CheckCircle className="w-10 h-10 text-white" />
            </motion.div>
            
            <Title level={2} className="gradient-text mb-4">
              Verify Your Information
            </Title>
            <Text className="text-slate-600 dark:text-slate-400 text-lg max-w-2xl mx-auto block">
              {isPdfFile 
                ? "PDF files require manual input. Please fill in your information below."
                : "We've extracted the following information from your resume. Please verify and complete any missing fields."
              }
            </Text>
          </div>

          <AnimatePresence>
            {isPdfFile && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="mb-6"
              >
                <Alert
                  message="PDF Resume Uploaded"
                  description="PDF files cannot be automatically parsed in the browser. Please fill in your information manually below."
                  type="info"
                  showIcon
                  className="!rounded-xl !border-0 !shadow-soft"
                />
              </motion.div>
            )}

            {missingFields.length > 0 && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="mb-6"
              >
                <Alert
                  message={`Missing fields: ${missingFields.join(', ')}`}
                  type="warning"
                  showIcon
                  className="!rounded-xl !border-0 !shadow-soft"
                />
              </motion.div>
            )}
          </AnimatePresence>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="resume-info"
          >
            <Form layout="vertical" className="space-y-6">
              <Form.Item label="Name" required>
                <Input
                  value={name}
                  onChange={(e) => setCandidateInfo({ ...candidateInfo, name: e.target.value })}
                  prefix={<User className="w-4 h-4 text-slate-400" />}
                  placeholder="Enter your full name"
                  size="large"
                  className="!rounded-xl"
                />
              </Form.Item>
              <Form.Item label="Email" required>
                <Input
                  value={email}
                  onChange={(e) => setCandidateInfo({ ...candidateInfo, email: e.target.value })}
                  prefix={<Mail className="w-4 h-4 text-slate-400" />}
                  placeholder="Enter your email address"
                  size="large"
                  className="!rounded-xl"
                />
              </Form.Item>
              <Form.Item label="Phone" required>
                <Input
                  value={phone}
                  onChange={(e) => setCandidateInfo({ ...candidateInfo, phone: e.target.value })}
                  prefix={<Phone className="w-4 h-4 text-slate-400" />}
                  placeholder="Enter your phone number"
                  size="large"
                  className="!rounded-xl"
                />
              </Form.Item>
            </Form>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="text-center mt-8"
          >
            <Button 
              type="primary" 
              size="large" 
              onClick={handleInfoSubmit}
              disabled={!name || !email || !phone}
              className="!h-12 !px-8 !rounded-xl !font-medium !text-lg"
              icon={<ArrowRight className="w-5 h-5" />}
            >
              Continue to Interview
            </Button>
          </motion.div>
        </Card>
      </motion.div>
    );
  };

  const renderInterviewStep = () => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="mb-6"
      >
        <Card className="bg-gradient-to-r from-primary-50 to-primary-100 dark:from-primary-900/20 dark:to-primary-800/20 border-primary-200 dark:border-primary-800">
          <div className="text-center">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="w-16 h-16 bg-gradient-to-br from-primary-500 to-primary-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-glow"
            >
              <Sparkles className="w-8 h-8 text-white" />
            </motion.div>
            
            <Title level={2} className="gradient-text mb-2">
              Welcome, {currentCandidate?.name}! 👋
            </Title>
            <Text className="text-slate-600 dark:text-slate-400 text-lg">
              You're about to start a Full Stack React/Node.js interview. 
              The interview consists of 6 questions with different time limits.
            </Text>
          </div>
        </Card>
      </motion.div>

      {!currentInterview ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Card className="overflow-hidden">
            <div className="text-center mb-8">
              <Title level={3} className="gradient-text mb-6">
                Interview Details
              </Title>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  className="bg-success-50 dark:bg-success-900/20 border border-success-200 dark:border-success-800 rounded-2xl p-6"
                >
                  <div className="w-12 h-12 bg-success-500 rounded-xl flex items-center justify-center mx-auto mb-4">
                    <Clock className="w-6 h-6 text-white" />
                  </div>
                  <h4 className="font-semibold text-success-700 dark:text-success-300 mb-2">
                    2 Easy Questions
                  </h4>
                  <p className="text-success-600 dark:text-success-400 text-sm">
                    20 seconds each
                  </p>
                </motion.div>
                
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  className="bg-warning-50 dark:bg-warning-900/20 border border-warning-200 dark:border-warning-800 rounded-2xl p-6"
                >
                  <div className="w-12 h-12 bg-warning-500 rounded-xl flex items-center justify-center mx-auto mb-4">
                    <Clock className="w-6 h-6 text-white" />
                  </div>
                  <h4 className="font-semibold text-warning-700 dark:text-warning-300 mb-2">
                    2 Medium Questions
                  </h4>
                  <p className="text-warning-600 dark:text-warning-400 text-sm">
                    60 seconds each
                  </p>
                </motion.div>
                
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  className="bg-danger-50 dark:bg-danger-900/20 border border-danger-200 dark:border-danger-800 rounded-2xl p-6"
                >
                  <div className="w-12 h-12 bg-danger-500 rounded-xl flex items-center justify-center mx-auto mb-4">
                    <Clock className="w-6 h-6 text-white" />
                  </div>
                  <h4 className="font-semibold text-danger-700 dark:text-danger-300 mb-2">
                    2 Hard Questions
                  </h4>
                  <p className="text-danger-600 dark:text-danger-400 text-sm">
                    120 seconds each
                  </p>
                </motion.div>
              </div>
              
              <div className="bg-slate-50 dark:bg-slate-800 rounded-xl p-4 mb-8">
                <div className="flex items-center justify-center space-x-2 text-slate-600 dark:text-slate-400">
                  <AlertCircle className="w-5 h-5" />
                  <Text className="mb-0">
                    Your answers will be automatically submitted when the timer expires.
                  </Text>
                </div>
              </div>
              
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button 
                  type="primary" 
                  size="large" 
                  onClick={handleStartInterview}
                  className="!h-14 !px-8 !rounded-xl !font-medium !text-lg"
                  icon={<Play className="w-6 h-6" />}
                >
                  Start Interview
                </Button>
              </motion.div>
            </div>
          </Card>
        </motion.div>
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <ChatInterface 
            interview={currentInterview}
            candidate={currentCandidate}
          />
        </motion.div>
      )}
    </motion.div>
  );

  const getStepItems = () => [
    {
      title: 'Upload Resume',
      description: 'Upload your resume file',
      icon: <UploadIcon className="w-5 h-5" />,
    },
    {
      title: 'Verify Info',
      description: 'Confirm your details',
      icon: <CheckCircle className="w-5 h-5" />,
    },
    {
      title: 'Interview',
      description: 'Start the interview',
      icon: <Play className="w-5 h-5" />,
    },
  ];

  const getCurrentStep = () => {
    switch (step) {
      case 'upload': return 0;
      case 'info': return 1;
      case 'interview': return 2;
      default: return 0;
    }
  };

  return (
    <div className="tab-content">
      <WelcomeBackModal
        visible={showWelcomeBack}
        onResume={handleResumeSession}
        onStartNew={handleStartNewSession}
        candidateStatus={unfinishedCandidate?.status}
      />
      
      {/* Progress Steps */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-8"
      >
        <Steps
          current={getCurrentStep()}
          items={getStepItems()}
          className="!w-full"
          size="small"
        />
      </motion.div>
      
      <AnimatePresence mode="wait">
        {step === 'upload' && (
          <motion.div
            key="upload"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            {renderUploadStep()}
          </motion.div>
        )}
        {step === 'info' && (
          <motion.div
            key="info"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            {renderInfoStep()}
          </motion.div>
        )}
        {step === 'interview' && (
          <motion.div
            key="interview"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            {renderInterviewStep()}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default IntervieweeTab;
