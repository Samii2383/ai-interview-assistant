import React, { useState, useEffect } from 'react';
import { Layout, Tabs, Typography, Button, Switch } from 'antd';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  User, 
  Users, 
  Moon, 
  Sun, 
  Bot, 
  Sparkles,
  Menu,
  X
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const { Header, Content } = Layout;
const { Title } = Typography;

const MainLayout = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [activeTab, setActiveTab] = useState(
    location.pathname === '/interviewer' ? 'interviewer' : 'interviewee'
  );
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Initialize dark mode from localStorage
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const shouldBeDark = savedTheme === 'dark' || (!savedTheme && prefersDark);
    
    setIsDarkMode(shouldBeDark);
    if (shouldBeDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, []);

  const toggleDarkMode = () => {
    const newDarkMode = !isDarkMode;
    setIsDarkMode(newDarkMode);
    
    if (newDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  };

  const handleTabChange = (key) => {
    setActiveTab(key);
    navigate(`/${key}`);
    setIsMobileMenuOpen(false);
  };

  const tabItems = [
    {
      key: 'interviewee',
      label: (
        <motion.div 
          className="flex items-center space-x-2"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <User size={18} />
          <span className="hidden sm:inline">Interviewee</span>
          <span className="sm:hidden">Chat</span>
        </motion.div>
      ),
    },
    {
      key: 'interviewer',
      label: (
        <motion.div 
          className="flex items-center space-x-2"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Users size={18} />
          <span className="hidden sm:inline">Interviewer</span>
          <span className="sm:hidden">Dashboard</span>
        </motion.div>
      ),
    },
  ];

  return (
    <Layout className="main-layout">
      <Header className="bg-gradient-to-r from-primary-500 via-primary-600 to-primary-700 px-6 py-4 flex items-center justify-between shadow-large">
        <motion.div 
          className="flex items-center space-x-3"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex items-center space-x-2">
            <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
              <Bot className="w-6 h-6 text-white" />
            </div>
            <div>
              <Title level={3} className="!text-white !mb-0 !font-bold">
                AI Interview Assistant
              </Title>
              <div className="flex items-center space-x-1 text-white/80 text-xs">
                <Sparkles size={12} />
                <span>Powered by AI</span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center space-x-6">
          <Tabs
            activeKey={activeTab}
            onChange={handleTabChange}
            items={tabItems}
            className="!text-white"
            tabBarStyle={{ margin: 0 }}
            tabBarGutter={24}
          />
          
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Switch
              checked={isDarkMode}
              onChange={toggleDarkMode}
              checkedChildren={<Moon size={14} />}
              unCheckedChildren={<Sun size={14} />}
              className="bg-white/20 border-white/30"
            />
          </motion.div>
        </div>

        {/* Mobile Menu Button */}
        <div className="md:hidden flex items-center space-x-3">
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Switch
              checked={isDarkMode}
              onChange={toggleDarkMode}
              checkedChildren={<Moon size={14} />}
              unCheckedChildren={<Sun size={14} />}
              className="bg-white/20 border-white/30"
            />
          </motion.div>
          
          <Button
            type="text"
            icon={isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="!text-white hover:!bg-white/10 !border-0"
          />
        </div>
      </Header>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 shadow-medium"
          >
            <div className="px-6 py-4 space-y-3">
              {tabItems.map((item) => (
                <motion.button
                  key={item.key}
                  onClick={() => handleTabChange(item.key)}
                  className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                    activeTab === item.key
                      ? 'bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400 border border-primary-200 dark:border-primary-800'
                      : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700'
                  }`}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  {item.label}
                </motion.button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <Content className="content-area">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          {children}
        </motion.div>
      </Content>
    </Layout>
  );
};

export default MainLayout;
