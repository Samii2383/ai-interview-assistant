import React from 'react';
import { 
  Typography, 
  Card, 
  Tag, 
  Progress, 
  Divider,
  Timeline,
  Badge,
  Space
} from 'antd';
import { 
  UserOutlined, 
  MailOutlined, 
  PhoneOutlined,
  TrophyOutlined,
  ClockCircleOutlined,
  CheckCircleOutlined
} from '@ant-design/icons';

const { Title, Text, Paragraph } = Typography;

const CandidateDetails = ({ candidate }) => {
  const interview = candidate.interview;
  
  if (!interview) {
    return (
      <Card>
        <Text type="secondary">No interview data available for this candidate.</Text>
      </Card>
    );
  }

  const getScoreColor = (score) => {
    if (score >= 80) return '#52c41a';
    if (score >= 60) return '#1890ff';
    if (score >= 40) return '#faad14';
    return '#ff4d4f';
  };

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'easy': return 'green';
      case 'medium': return 'orange';
      case 'hard': return 'red';
      default: return 'default';
    }
  };

  const formatDuration = (startTime, endTime) => {
    if (!startTime || !endTime) return 'N/A';
    const start = new Date(startTime);
    const end = new Date(endTime);
    const diffMs = end - start;
    const diffMins = Math.floor(diffMs / 60000);
    const diffSecs = Math.floor((diffMs % 60000) / 1000);
    return `${diffMins}m ${diffSecs}s`;
  };

  return (
    <div>
      {/* Candidate Info */}
      <Card style={{ marginBottom: 16 }}>
        <Title level={4}>Candidate Information</Title>
        <Space direction="vertical" style={{ width: '100%' }}>
          <div>
            <UserOutlined style={{ marginRight: 8 }} />
            <Text strong>{candidate.name}</Text>
          </div>
          <div>
            <MailOutlined style={{ marginRight: 8 }} />
            <Text>{candidate.email}</Text>
          </div>
          <div>
            <PhoneOutlined style={{ marginRight: 8 }} />
            <Text>{candidate.phone}</Text>
          </div>
        </Space>
      </Card>

      {/* Interview Summary */}
      <Card style={{ marginBottom: 16 }}>
        <Title level={4}>Interview Summary</Title>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
          <div>
            <Text strong>Final Score: </Text>
            <Badge 
              count={`${interview.finalScore}/100`} 
              style={{ backgroundColor: getScoreColor(interview.finalScore) }}
            />
            <Text style={{ marginLeft: 8, fontSize: '16px', fontWeight: 'bold' }}>
              Grade: {interview.grade}
            </Text>
          </div>
          <div>
            <Text type="secondary">
              <ClockCircleOutlined style={{ marginRight: 4 }} />
              Duration: {formatDuration(interview.startTime, interview.endTime)}
            </Text>
          </div>
        </div>
        
        <Progress 
          percent={interview.finalScore} 
          strokeColor={getScoreColor(interview.finalScore)}
          showInfo={false}
        />
        
        {interview.summary && (
          <div style={{ marginTop: 16 }}>
            <Title level={5}>AI Assessment:</Title>
            <Paragraph style={{ whiteSpace: 'pre-wrap', background: '#f5f5f5', padding: 12, borderRadius: 6 }}>
              {interview.summary}
            </Paragraph>
          </div>
        )}
      </Card>

      {/* Questions and Answers */}
      <Card>
        <Title level={4}>Questions & Answers</Title>
        <Timeline>
          {interview.answers?.map((answer, index) => (
            <Timeline.Item
              key={index}
              dot={<CheckCircleOutlined style={{ color: getScoreColor(answer.score) }} />}
            >
              <div className="question-item">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
                  <Title level={5} style={{ margin: 0 }}>
                    Question {index + 1}
                  </Title>
                  <div>
                    <Tag color={getDifficultyColor(answer.question.includes('Easy') ? 'easy' : 
                                                 answer.question.includes('Medium') ? 'medium' : 'hard')}>
                      {answer.question.includes('Easy') ? 'Easy' : 
                       answer.question.includes('Medium') ? 'Medium' : 'Hard'}
                    </Tag>
                    <Badge 
                      count={`${answer.score}/100`} 
                      style={{ backgroundColor: getScoreColor(answer.score), marginLeft: 8 }}
                    />
                  </div>
                </div>
                
                <div style={{ marginBottom: 12 }}>
                  <Text strong>Question:</Text>
                  <Paragraph style={{ marginTop: 4, marginBottom: 8 }}>
                    {answer.question}
                  </Paragraph>
                </div>
                
                <div style={{ marginBottom: 12 }}>
                  <Text strong>Answer:</Text>
                  <div className="answer-item">
                    <Paragraph style={{ margin: 0, whiteSpace: 'pre-wrap' }}>
                      {answer.answer}
                    </Paragraph>
                  </div>
                </div>
                
                {answer.feedback && answer.feedback.length > 0 && (
                  <div>
                    <Text strong>AI Feedback:</Text>
                    {answer.feedback.map((feedback, feedbackIndex) => (
                      <div key={feedbackIndex} className="feedback-item">
                        <Text style={{ fontSize: '12px' }}>{feedback}</Text>
                      </div>
                    ))}
                  </div>
                )}
                
                <div style={{ marginTop: 8, fontSize: '12px', color: '#666' }}>
                  <ClockCircleOutlined style={{ marginRight: 4 }} />
                  Time spent: {answer.timeSpent}s
                </div>
              </div>
            </Timeline.Item>
          ))}
        </Timeline>
      </Card>
    </div>
  );
};

export default CandidateDetails;
