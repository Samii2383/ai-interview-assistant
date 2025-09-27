import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { 
  Card, 
  List, 
  Typography, 
  Tag, 
  Button, 
  Input, 
  Select, 
  Space,
  Badge,
  Empty,
  Modal,
  Divider,
  Progress
} from 'antd';
import { 
  SearchOutlined, 
  UserOutlined, 
  MailOutlined, 
  PhoneOutlined,
  CalendarOutlined,
  TrophyOutlined,
  EyeOutlined
} from '@ant-design/icons';
import CandidateDetails from './CandidateDetails';

const { Title, Text } = Typography;
const { Search } = Input;
const { Option } = Select;

const InterviewerTab = () => {
  const { candidates } = useSelector(state => state.candidates);
  const [searchText, setSearchText] = useState('');
  const [sortBy, setSortBy] = useState('date');
  const [selectedCandidate, setSelectedCandidate] = useState(null);
  const [showDetails, setShowDetails] = useState(false);

  const getScoreColor = (score) => {
    if (score >= 80) return 'success';
    if (score >= 60) return 'processing';
    if (score >= 40) return 'warning';
    return 'error';
  };

  const getScoreText = (score) => {
    if (score >= 80) return 'Excellent';
    if (score >= 60) return 'Good';
    if (score >= 40) return 'Fair';
    return 'Poor';
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed': return 'green';
      case 'in_progress': return 'blue';
      default: return 'default';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'completed': return 'Completed';
      case 'in_progress': return 'In Progress';
      default: return 'Pending';
    }
  };

  const filteredCandidates = candidates
    .filter(candidate => 
      candidate.name.toLowerCase().includes(searchText.toLowerCase()) ||
      candidate.email.toLowerCase().includes(searchText.toLowerCase())
    )
    .sort((a, b) => {
      switch (sortBy) {
        case 'score':
          return (b.interview?.finalScore || 0) - (a.interview?.finalScore || 0);
        case 'name':
          return a.name.localeCompare(b.name);
        case 'date':
        default:
          return new Date(b.createdAt) - new Date(a.createdAt);
      }
    });

  const handleViewDetails = (candidate) => {
    setSelectedCandidate(candidate);
    setShowDetails(true);
  };

  const renderCandidateCard = (candidate) => {
    const interview = candidate.interview;
    const finalScore = interview?.finalScore || 0;
    const grade = interview?.grade || 'N/A';

    return (
      <Card
        key={candidate.id}
        className="candidate-card"
        actions={[
          <Button 
            type="link" 
            icon={<EyeOutlined />}
            onClick={() => handleViewDetails(candidate)}
          >
            View Details
          </Button>
        ]}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 }}>
          <div>
            <Title level={4} style={{ margin: 0 }}>
              <UserOutlined style={{ marginRight: 8 }} />
              {candidate.name}
            </Title>
            <Text type="secondary">
              <MailOutlined style={{ marginRight: 4 }} />
              {candidate.email}
            </Text>
            <br />
            <Text type="secondary">
              <PhoneOutlined style={{ marginRight: 4 }} />
              {candidate.phone}
            </Text>
          </div>
          <div style={{ textAlign: 'right' }}>
            <Tag color={getStatusColor(candidate.status)}>
              {getStatusText(candidate.status)}
            </Tag>
            {interview && (
              <div style={{ marginTop: 8 }}>
                <Badge 
                  count={`${finalScore}/100`} 
                  style={{ backgroundColor: getScoreColor(finalScore) === 'success' ? '#52c41a' : 
                           getScoreColor(finalScore) === 'processing' ? '#1890ff' :
                           getScoreColor(finalScore) === 'warning' ? '#faad14' : '#ff4d4f' }}
                />
                <div style={{ fontSize: '12px', color: '#666', marginTop: 4 }}>
                  Grade: {grade}
                </div>
              </div>
            )}
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Text type="secondary">
            <CalendarOutlined style={{ marginRight: 4 }} />
            {new Date(candidate.createdAt).toLocaleDateString()}
          </Text>
          {interview && (
            <Text type="secondary">
              <TrophyOutlined style={{ marginRight: 4 }} />
              {interview.answers?.length || 0} questions answered
            </Text>
          )}
        </div>

        {interview && interview.summary && (
          <div style={{ marginTop: 12, padding: 12, background: '#f5f5f5', borderRadius: 6 }}>
            <Text strong>Summary:</Text>
            <div style={{ marginTop: 4 }}>
              <Text ellipsis={{ rows: 2 }}>
                {interview.summary}
              </Text>
            </div>
          </div>
        )}
      </Card>
    );
  };

  return (
    <div className="tab-content">
      <Card style={{ marginBottom: 24 }}>
        <Title level={2}>Interview Dashboard</Title>
        <Text type="secondary">
          Review and manage candidate interviews
        </Text>
      </Card>

      <Card>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
          <Title level={3} style={{ margin: 0 }}>
            Candidates ({filteredCandidates.length})
          </Title>
          <Space>
            <Search
              placeholder="Search candidates..."
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              style={{ width: 200 }}
              prefix={<SearchOutlined />}
            />
            <Select
              value={sortBy}
              onChange={setSortBy}
              style={{ width: 120 }}
            >
              <Option value="date">Date</Option>
              <Option value="name">Name</Option>
              <Option value="score">Score</Option>
            </Select>
          </Space>
        </div>

        {filteredCandidates.length === 0 ? (
          <Empty 
            description="No candidates found"
            image={Empty.PRESENTED_IMAGE_SIMPLE}
          />
        ) : (
          <List
            dataSource={filteredCandidates}
            renderItem={renderCandidateCard}
            pagination={{
              pageSize: 5,
              showSizeChanger: true,
              showQuickJumper: true,
              showTotal: (total, range) => 
                `${range[0]}-${range[1]} of ${total} candidates`
            }}
          />
        )}
      </Card>

      <Modal
        title={`Interview Details - ${selectedCandidate?.name}`}
        open={showDetails}
        onCancel={() => setShowDetails(false)}
        footer={null}
        width={800}
        style={{ top: 20 }}
      >
        {selectedCandidate && (
          <CandidateDetails candidate={selectedCandidate} />
        )}
      </Modal>
    </div>
  );
};

export default InterviewerTab;
