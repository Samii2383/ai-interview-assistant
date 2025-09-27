import React from 'react';
import { Modal, Button, Typography, Card } from 'antd';
import { ClockCircleOutlined, UserOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;

const WelcomeBackModal = ({ visible, onResume, onStartNew, candidateStatus }) => {
  const isPaused = candidateStatus === 'paused';
  
  return (
    <Modal
      title="Welcome Back!"
      open={visible}
      footer={null}
      closable={false}
      width={500}
      className="welcome-back-modal"
    >
      <div style={{ textAlign: 'center', padding: '20px 0' }}>
        <UserOutlined style={{ fontSize: '48px', color: '#1890ff', marginBottom: '16px' }} />
        
        <Title level={3}>
          {isPaused ? 'You have a paused interview session' : 'You have an unfinished interview session'}
        </Title>
        
        <Text type="secondary" style={{ display: 'block', marginBottom: '24px' }}>
          {isPaused 
            ? 'Your interview was paused and saved. Would you like to resume where you left off or start a new interview?'
            : 'Would you like to continue where you left off or start a new interview?'
          }
        </Text>

        <Card style={{ background: '#f0f8ff', border: '1px solid #91d5ff', marginBottom: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <ClockCircleOutlined style={{ marginRight: '8px', color: '#1890ff' }} />
            <Text strong>Resume Previous Session</Text>
          </div>
          <Text type="secondary" style={{ display: 'block', marginTop: '8px' }}>
            Continue your interview from where you left off
          </Text>
        </Card>

        <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
          <Button size="large" onClick={onStartNew}>
            Start New Interview
          </Button>
          <Button type="primary" size="large" onClick={onResume}>
            Resume Session
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default WelcomeBackModal;
