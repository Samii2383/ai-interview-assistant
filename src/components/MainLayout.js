import React, { useState } from 'react';
import { Layout, Tabs, Typography } from 'antd';
import { useNavigate, useLocation } from 'react-router-dom';
import { UserOutlined, TeamOutlined } from '@ant-design/icons';

const { Header, Content } = Layout;
const { Title } = Typography;

const MainLayout = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [activeTab, setActiveTab] = useState(
    location.pathname === '/interviewer' ? 'interviewer' : 'interviewee'
  );

  const handleTabChange = (key) => {
    setActiveTab(key);
    navigate(`/${key}`);
  };

  const tabItems = [
    {
      key: 'interviewee',
      label: (
        <span>
          <UserOutlined />
          Interviewee (Chat)
        </span>
      ),
    },
    {
      key: 'interviewer',
      label: (
        <span>
          <TeamOutlined />
          Interviewer (Dashboard)
        </span>
      ),
    },
  ];

  return (
    <Layout className="main-layout">
      <Header style={{ 
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        padding: '0 24px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between'
      }}>
        <Title level={3} style={{ 
          color: 'white', 
          margin: 0,
          fontFamily: 'Inter, sans-serif',
          fontWeight: 600,
          letterSpacing: '-0.02em'
        }}>
          AI Interview Assistant
        </Title>
        <Tabs
          activeKey={activeTab}
          onChange={handleTabChange}
          items={tabItems}
          style={{ color: 'white' }}
          tabBarStyle={{ margin: 0 }}
        />
      </Header>
      <Content className="content-area">
        {children}
      </Content>
    </Layout>
  );
};

export default MainLayout;
