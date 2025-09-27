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
  Spin
} from 'antd';
import { InboxOutlined, FileTextOutlined, UserOutlined, MailOutlined, PhoneOutlined } from '@ant-design/icons';
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
    <Card>
      <Title level={2}>Upload Your Resume</Title>
      <Text type="secondary" style={{ display: 'block', marginBottom: 24 }}>
        Please upload your resume in PDF or DOCX format. DOCX files will be parsed automatically, while PDF files require manual input.
      </Text>
      
      <Dragger
        name="resume"
        multiple={false}
        accept=".pdf,.docx"
        beforeUpload={handleFileUpload}
        showUploadList={false}
        style={{ marginBottom: 24 }}
      >
        <p className="ant-upload-drag-icon">
          <InboxOutlined />
        </p>
        <p className="ant-upload-text">Click or drag resume file to this area to upload</p>
        <p className="ant-upload-hint">
          Support for PDF and DOCX files
        </p>
      </Dragger>

      {uploading && (
        <div className="loading-spinner">
          <Spin size="large" />
          <Text>Parsing your resume...</Text>
        </div>
      )}
    </Card>
  );

  const renderInfoStep = () => {
    const { name, email, phone, isPdfFile } = candidateInfo;
    const missingFields = [];
    if (!name) missingFields.push('Name');
    if (!email) missingFields.push('Email');
    if (!phone) missingFields.push('Phone');

    return (
      <Card>
        <Title level={2}>Verify Your Information</Title>
        <Text type="secondary" style={{ display: 'block', marginBottom: 24 }}>
          {isPdfFile 
            ? "PDF files require manual input. Please fill in your information below."
            : "We've extracted the following information from your resume. Please verify and complete any missing fields."
          }
        </Text>

        {isPdfFile && (
          <Alert
            message="PDF Resume Uploaded"
            description="PDF files cannot be automatically parsed in the browser. Please fill in your information manually below."
            type="info"
            style={{ marginBottom: 24 }}
            showIcon
          />
        )}

        {missingFields.length > 0 && (
          <Alert
            message={`Missing fields: ${missingFields.join(', ')}`}
            type="warning"
            style={{ marginBottom: 24 }}
          />
        )}

        <div className="resume-info">
          <Form layout="vertical">
            <Form.Item label="Name" required>
              <Input
                value={name}
                onChange={(e) => setCandidateInfo({ ...candidateInfo, name: e.target.value })}
                prefix={<UserOutlined />}
                placeholder="Enter your full name"
              />
            </Form.Item>
            <Form.Item label="Email" required>
              <Input
                value={email}
                onChange={(e) => setCandidateInfo({ ...candidateInfo, email: e.target.value })}
                prefix={<MailOutlined />}
                placeholder="Enter your email address"
              />
            </Form.Item>
            <Form.Item label="Phone" required>
              <Input
                value={phone}
                onChange={(e) => setCandidateInfo({ ...candidateInfo, phone: e.target.value })}
                prefix={<PhoneOutlined />}
                placeholder="Enter your phone number"
              />
            </Form.Item>
          </Form>
        </div>

        <Button 
          type="primary" 
          size="large" 
          onClick={handleInfoSubmit}
          disabled={!name || !email || !phone}
          style={{ marginTop: 16 }}
        >
          Continue to Interview
        </Button>
      </Card>
    );
  };

  const renderInterviewStep = () => (
    <div>
      <Card style={{ marginBottom: 16 }}>
        <Title level={2}>Welcome, {currentCandidate?.name}!</Title>
        <Text type="secondary">
          You're about to start a Full Stack React/Node.js interview. 
          The interview consists of 6 questions with different time limits.
        </Text>
      </Card>

      {!currentInterview ? (
        <Card>
          <Title level={3}>Interview Details</Title>
          <ul>
            <li><strong>2 Easy Questions:</strong> 20 seconds each</li>
            <li><strong>2 Medium Questions:</strong> 60 seconds each</li>
            <li><strong>2 Hard Questions:</strong> 120 seconds each</li>
          </ul>
          <Text type="secondary" style={{ display: 'block', marginBottom: 24 }}>
            Your answers will be automatically submitted when the timer expires.
          </Text>
          <Button type="primary" size="large" onClick={handleStartInterview}>
            Start Interview
          </Button>
        </Card>
      ) : (
        <ChatInterface 
          interview={currentInterview}
          candidate={currentCandidate}
        />
      )}
    </div>
  );

  return (
    <div className="tab-content">
      <WelcomeBackModal
        visible={showWelcomeBack}
        onResume={handleResumeSession}
        onStartNew={handleStartNewSession}
        candidateStatus={unfinishedCandidate?.status}
      />
      
      {step === 'upload' && renderUploadStep()}
      {step === 'info' && renderInfoStep()}
      {step === 'interview' && renderInterviewStep()}
    </div>
  );
};

export default IntervieweeTab;
