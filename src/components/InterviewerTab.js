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
  Progress,
  Table,
  Drawer,
  Statistic,
  Row,
  Col,
  Avatar
} from 'antd';
import { 
  Search as SearchIcon, 
  User, 
  Mail, 
  Phone,
  Calendar,
  Trophy,
  Eye,
  Filter,
  SortAsc,
  SortDesc,
  TrendingUp,
  Clock,
  CheckCircle,
  AlertCircle,
  Star,
  BarChart3,
  Users,
  Award,
  X
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
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
  const [showDrawer, setShowDrawer] = useState(false);
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterScore, setFilterScore] = useState('all');

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

  // Calculate statistics
  const stats = {
    total: candidates.length,
    completed: candidates.filter(c => c.status === 'completed').length,
    inProgress: candidates.filter(c => c.status === 'in_progress').length,
    averageScore: candidates
      .filter(c => c.interview?.finalScore)
      .reduce((acc, c) => acc + c.interview.finalScore, 0) / 
      candidates.filter(c => c.interview?.finalScore).length || 0,
    excellent: candidates.filter(c => c.interview?.finalScore >= 80).length,
    good: candidates.filter(c => c.interview?.finalScore >= 60 && c.interview?.finalScore < 80).length,
    fair: candidates.filter(c => c.interview?.finalScore >= 40 && c.interview?.finalScore < 60).length,
    poor: candidates.filter(c => c.interview?.finalScore < 40).length,
  };

  const filteredCandidates = candidates
    .filter(candidate => {
      const matchesSearch = candidate.name.toLowerCase().includes(searchText.toLowerCase()) ||
                           candidate.email.toLowerCase().includes(searchText.toLowerCase());
      
      const matchesStatus = filterStatus === 'all' || candidate.status === filterStatus;
      
      const matchesScore = filterScore === 'all' || 
        (filterScore === 'excellent' && candidate.interview?.finalScore >= 80) ||
        (filterScore === 'good' && candidate.interview?.finalScore >= 60 && candidate.interview?.finalScore < 80) ||
        (filterScore === 'fair' && candidate.interview?.finalScore >= 40 && candidate.interview?.finalScore < 60) ||
        (filterScore === 'poor' && candidate.interview?.finalScore < 40);
      
      return matchesSearch && matchesStatus && matchesScore;
    })
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
    setShowDrawer(true);
  };

  // Table columns configuration
  const columns = [
    {
      title: 'Candidate',
      dataIndex: 'name',
      key: 'name',
      render: (text, record) => (
        <div className="flex items-center space-x-3">
          <Avatar 
            size={40} 
            icon={<User className="w-5 h-5" />}
            className="bg-gradient-to-br from-primary-500 to-primary-600"
          />
          <div>
            <div className="font-semibold text-slate-900 dark:text-slate-100">{text}</div>
            <div className="text-sm text-slate-500 dark:text-slate-400">{record.email}</div>
          </div>
        </div>
      ),
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status) => (
        <Tag 
          color={getStatusColor(status)}
          className="!rounded-lg !px-3 !py-1 !font-medium"
        >
          {getStatusText(status)}
        </Tag>
      ),
    },
    {
      title: 'Score',
      dataIndex: ['interview', 'finalScore'],
      key: 'score',
      render: (score) => (
        <div className="flex items-center space-x-2">
          <Badge 
            count={score ? `${score}/100` : 'N/A'} 
            style={{ 
              backgroundColor: score ? getScoreColor(score) === 'success' ? '#22c55e' : 
                               getScoreColor(score) === 'processing' ? '#3b82f6' :
                               getScoreColor(score) === 'warning' ? '#f59e0b' : '#ef4444' : '#94a3b8'
            }}
            className="!rounded-lg"
          />
          {score && (
            <div className="text-sm text-slate-500 dark:text-slate-400">
              Grade: {getScoreText(score)}
            </div>
          )}
        </div>
      ),
    },
    {
      title: 'Date',
      dataIndex: 'createdAt',
      key: 'date',
      render: (date) => (
        <div className="flex items-center space-x-2 text-slate-600 dark:text-slate-400">
          <Calendar className="w-4 h-4" />
          <span className="text-sm">{new Date(date).toLocaleDateString()}</span>
        </div>
      ),
    },
    {
      title: 'Progress',
      key: 'progress',
      render: (_, record) => {
        const interview = record.interview;
        const progress = interview ? (interview.answers?.length || 0) / interview.questions.length * 100 : 0;
        return (
          <div className="flex items-center space-x-2">
            <Progress 
              percent={progress} 
              size="small" 
              showInfo={false}
              strokeColor={progress === 100 ? '#22c55e' : '#3b82f6'}
              className="flex-1"
            />
            <span className="text-sm text-slate-500 dark:text-slate-400">
              {interview ? `${interview.answers?.length || 0}/${interview.questions.length}` : '0/0'}
            </span>
          </div>
        );
      },
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <Button
          type="primary"
          icon={<Eye className="w-4 h-4" />}
          onClick={() => handleViewDetails(record)}
          className="!rounded-xl"
        >
          View Details
        </Button>
      ),
    },
  ];

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
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="tab-content"
    >
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="mb-8"
      >
        <Card className="bg-gradient-to-r from-primary-50 to-primary-100 dark:from-primary-900/20 dark:to-primary-800/20 border-primary-200 dark:border-primary-800">
          <div className="text-center">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="w-16 h-16 bg-gradient-to-br from-primary-500 to-primary-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-glow"
            >
              <BarChart3 className="w-8 h-8 text-white" />
            </motion.div>
            
            <Title level={2} className="gradient-text mb-2">
              Interview Dashboard
            </Title>
            <Text className="text-slate-600 dark:text-slate-400 text-lg">
              Review and manage candidate interviews
            </Text>
          </div>
        </Card>
      </motion.div>

      {/* Statistics Cards */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="mb-8"
      >
        <Row gutter={[16, 16]}>
          <Col xs={24} sm={12} md={6}>
            <Card className="text-center hover:shadow-medium transition-all duration-300">
              <Statistic
                title="Total Candidates"
                value={stats.total}
                prefix={<Users className="w-5 h-5 text-primary-500" />}
                valueStyle={{ color: '#3b82f6' }}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} md={6}>
            <Card className="text-center hover:shadow-medium transition-all duration-300">
              <Statistic
                title="Completed"
                value={stats.completed}
                prefix={<CheckCircle className="w-5 h-5 text-success-500" />}
                valueStyle={{ color: '#22c55e' }}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} md={6}>
            <Card className="text-center hover:shadow-medium transition-all duration-300">
              <Statistic
                title="In Progress"
                value={stats.inProgress}
                prefix={<Clock className="w-5 h-5 text-warning-500" />}
                valueStyle={{ color: '#f59e0b' }}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} md={6}>
            <Card className="text-center hover:shadow-medium transition-all duration-300">
              <Statistic
                title="Average Score"
                value={Math.round(stats.averageScore)}
                suffix="/100"
                prefix={<Award className="w-5 h-5 text-primary-500" />}
                valueStyle={{ color: '#3b82f6' }}
              />
            </Card>
          </Col>
        </Row>
      </motion.div>

      {/* Filters and Search */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className="mb-6"
      >
        <Card>
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0 lg:space-x-4">
            <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4 flex-1">
              <Input
                placeholder="Search candidates..."
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                prefix={<SearchIcon className="w-4 h-4 text-slate-400" />}
                className="!rounded-xl sm:w-64"
                size="large"
              />
              
              <Select
                value={filterStatus}
                onChange={setFilterStatus}
                className="!rounded-xl sm:w-32"
                size="large"
              >
                <Option value="all">All Status</Option>
                <Option value="completed">Completed</Option>
                <Option value="in_progress">In Progress</Option>
                <Option value="paused">Paused</Option>
              </Select>
              
              <Select
                value={filterScore}
                onChange={setFilterScore}
                className="!rounded-xl sm:w-32"
                size="large"
              >
                <Option value="all">All Scores</Option>
                <Option value="excellent">Excellent (80+)</Option>
                <Option value="good">Good (60-79)</Option>
                <Option value="fair">Fair (40-59)</Option>
                <Option value="poor">Poor (&lt;40)</Option>
              </Select>
            </div>
            
            <div className="flex items-center space-x-2">
              <Select
                value={sortBy}
                onChange={setSortBy}
                className="!rounded-xl w-32"
                size="large"
              >
                <Option value="date">Sort by Date</Option>
                <Option value="name">Sort by Name</Option>
                <Option value="score">Sort by Score</Option>
              </Select>
            </div>
          </div>
        </Card>
      </motion.div>

      {/* Data Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
      >
        <Card>
          <div className="flex items-center justify-between mb-6">
            <Title level={3} className="!mb-0">
              Candidates ({filteredCandidates.length})
            </Title>
          </div>

          {filteredCandidates.length === 0 ? (
            <Empty 
              description="No candidates found"
              image={Empty.PRESENTED_IMAGE_SIMPLE}
              className="py-12"
            />
          ) : (
            <Table
              columns={columns}
              dataSource={filteredCandidates}
              rowKey="id"
              pagination={{
                pageSize: 10,
                showSizeChanger: true,
                showQuickJumper: true,
                showTotal: (total, range) => 
                  `${range[0]}-${range[1]} of ${total} candidates`,
                className: '!mt-6'
              }}
              className="modern-table"
            />
          )}
        </Card>
      </motion.div>

      {/* Candidate Details Drawer */}
      <Drawer
        title={
          <div className="flex items-center space-x-2">
            <User className="w-5 h-5 text-primary-500" />
            <span>Interview Details - {selectedCandidate?.name}</span>
          </div>
        }
        open={showDrawer}
        onClose={() => setShowDrawer(false)}
        width={800}
        className="modern-drawer"
        extra={
          <Button 
            type="text" 
            icon={<X className="w-4 h-4" />} 
            onClick={() => setShowDrawer(false)}
          />
        }
      >
        {selectedCandidate && (
          <CandidateDetails candidate={selectedCandidate} />
        )}
      </Drawer>
    </motion.div>
  );
};

export default InterviewerTab;




