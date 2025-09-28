import React from 'react';
import { Modal, Button, Typography, Card } from 'antd';
import { 
  Clock, 
  User, 
  Play, 
  RotateCcw, 
  Sparkles,
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import { motion } from 'framer-motion';

const { Title, Text } = Typography;

const WelcomeBackModal = ({ visible, onResume, onStartNew, candidateStatus }) => {
  const isPaused = candidateStatus === 'paused';
  
  return (
    <Modal
      title={
        <div className="flex items-center space-x-2">
          <Sparkles className="w-5 h-5 text-primary-500" />
          <span>Welcome Back!</span>
        </div>
      }
      open={visible}
      footer={null}
      closable={false}
      width={600}
      className="welcome-back-modal !rounded-2xl"
    >
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center py-6"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="w-20 h-20 bg-gradient-to-br from-primary-500 to-primary-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-glow"
        >
          <User className="w-10 h-10 text-white" />
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <Title level={3} className="gradient-text mb-4">
            {isPaused ? 'You have a paused interview session' : 'You have an unfinished interview session'}
          </Title>
          
          <Text className="text-slate-600 dark:text-slate-400 text-lg block mb-8 max-w-md mx-auto">
            {isPaused 
              ? 'Your interview was paused and saved. Would you like to resume where you left off or start a new interview?'
              : 'Would you like to continue where you left off or start a new interview?'
            }
          </Text>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="mb-8"
        >
          <Card className="bg-gradient-to-r from-primary-50 to-primary-100 dark:from-primary-900/20 dark:to-primary-800/20 border-primary-200 dark:border-primary-800 !rounded-2xl">
            <div className="flex items-center justify-center space-x-3 mb-3">
              <div className="w-10 h-10 bg-primary-500 rounded-xl flex items-center justify-center">
                <Clock className="w-5 h-5 text-white" />
              </div>
              <div>
                <Text className="text-primary-700 dark:text-primary-300 font-semibold text-lg">
                  Resume Previous Session
                </Text>
                <div className="flex items-center space-x-1 text-primary-600 dark:text-primary-400">
                  <CheckCircle className="w-4 h-4" />
                  <Text className="text-sm">
                    Continue your interview from where you left off
                  </Text>
                </div>
              </div>
            </div>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="flex flex-col sm:flex-row gap-4 justify-center"
        >
          <Button 
            size="large" 
            onClick={onStartNew}
            className="!h-12 !px-8 !rounded-xl !font-medium !text-lg"
            icon={<RotateCcw className="w-5 h-5" />}
          >
            Start New Interview
          </Button>
          <Button 
            type="primary" 
            size="large" 
            onClick={onResume}
            className="!h-12 !px-8 !rounded-xl !font-medium !text-lg"
            icon={<Play className="w-5 h-5" />}
          >
            Resume Session
          </Button>
        </motion.div>
      </motion.div>
    </Modal>
  );
};

export default WelcomeBackModal;
