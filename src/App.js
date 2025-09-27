import React from 'react';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ConfigProvider } from 'antd';
import { store, persistor } from './store';
import MainLayout from './components/MainLayout';
import IntervieweeTab from './components/IntervieweeTab';
import InterviewerTab from './components/InterviewerTab';
import './App.css';

function App() {
  return (
    <Provider store={store}>
      <PersistGate loading={<div>Loading...</div>} persistor={persistor}>
        <ConfigProvider
          theme={{
            token: {
              colorPrimary: '#1890ff',
              borderRadius: 8,
              fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
              fontSize: 14,
              fontSizeHeading1: 38,
              fontSizeHeading2: 30,
              fontSizeHeading3: 24,
              fontSizeHeading4: 20,
              fontSizeHeading5: 16,
              lineHeight: 1.6,
              lineHeightHeading1: 1.2,
              lineHeightHeading2: 1.3,
              lineHeightHeading3: 1.4,
              lineHeightHeading4: 1.5,
              lineHeightHeading5: 1.5,
            },
            components: {
              Typography: {
                fontFamily: 'Inter, sans-serif',
                titleMarginBottom: '0.5em',
                titleMarginTop: '1.2em',
              },
              Button: {
                fontFamily: 'Inter, sans-serif',
                fontWeight: 500,
              },
              Input: {
                fontFamily: 'Inter, sans-serif',
              },
              Card: {
                fontFamily: 'Inter, sans-serif',
              },
              Tabs: {
                fontFamily: 'Inter, sans-serif',
              },
              Modal: {
                fontFamily: 'Inter, sans-serif',
              },
            },
          }}
        >
          <Router>
            <div className="App">
              <MainLayout>
                <Routes>
                  <Route path="/" element={<IntervieweeTab />} />
                  <Route path="/interviewee" element={<IntervieweeTab />} />
                  <Route path="/interviewer" element={<InterviewerTab />} />
                </Routes>
              </MainLayout>
            </div>
          </Router>
        </ConfigProvider>
      </PersistGate>
    </Provider>
  );
}

export default App;
