import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Header from './components/Header';
import { ApplicationForm } from './components/ApplicationForm';
import { Chatbot, ChatToggleButton } from './components/Chatbot';
import { VideoTutorial } from './components/VideoTutorial';
import { ApplicationPreview } from './components/ApplicationPreview';
import { SearchComponent } from './components/SearchComponent';
import Dashboard from './pages/Dashboard';
import ApplicationsPage from './pages/ApplicationsPage';
import TutorialsPage from './pages/TutorialsPage';
import { Application, SearchResult } from './types';
import { useApplicationDraft } from './hooks/useApplicationDraft';

function App() {
  const [applications, setApplications] = useState<Application[]>([]);
  const [isChatOpen, setChatOpen] = useState(false);
  const [isSearchOpen, setSearchOpen] = useState(false);
  const [selectedApplication, setSelectedApplication] = useState<Application | null>(null);
  const { loadAllDrafts } = useApplicationDraft();

  // Load draft applications on mount
  React.useEffect(() => {
    const drafts = loadAllDrafts();
    setApplications(drafts);
  }, [loadAllDrafts]);

  const handleApplicationSubmit = (application: Application) => {
    setApplications(prev => [...prev, application]);
    alert('Application submitted successfully!');
  };

  const handleSearchResultClick = (result: SearchResult) => {
    setSearchOpen(false);
    
    switch (result.type) {
      case 'application':
        const app = applications.find(a => a.id === result.id);
        if (app) {
          setSelectedApplication(app);
        }
        break;
      case 'video':
        // Navigate to video tutorial
        window.location.href = result.url;
        break;
      case 'document':
        // Navigate to document
        window.location.href = result.url;
        break;
    }
  };

  return (
    <Router>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors">
        <Header
          title="College Application Portal"
          onSearchClick={() => setSearchOpen(true)}
          showSearch={true}
        />

        <main className="pb-16">
          <Routes>
            <Route 
              path="/" 
              element={<Navigate to="/dashboard" replace />} 
            />
            
            <Route 
              path="/dashboard" 
              element={
                <Dashboard 
                  applications={applications}
                  onViewApplication={setSelectedApplication}
                />
              } 
            />
            
            <Route 
              path="/applications" 
              element={
                <ApplicationsPage 
                  applications={applications}
                  onViewApplication={setSelectedApplication}
                />
              } 
            />
            
            <Route 
              path="/applications/new" 
              element={
                <ApplicationForm 
                  onSubmit={handleApplicationSubmit}
                />
              } 
            />
            
            <Route 
              path="/applications/:id" 
              element={
                selectedApplication ? (
                  <ApplicationPreview 
                    application={selectedApplication}
                    onEdit={() => {
                      // Navigate to edit form
                      console.log('Edit application:', selectedApplication.id);
                    }}
                    onDownload={() => {
                      // Generate and download PDF
                      console.log('Download application:', selectedApplication.id);
                    }}
                  />
                ) : (
                  <div className="max-w-2xl mx-auto p-6 text-center">
                    <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
                      Application not found
                    </h2>
                    <p className="text-gray-600 dark:text-gray-400">
                      The application you're looking for doesn't exist or has been removed.
                    </p>
                  </div>
                )
              } 
            />
            
            <Route 
              path="/tutorials" 
              element={<TutorialsPage />} 
            />
            
            <Route 
              path="/tutorials/personal-statement" 
              element={
                <VideoTutorial
                  videoId="personal-statement"
                  title="How to Write a Compelling Personal Statement"
                  description="Learn the key elements that make personal statements stand out to admissions committees."
                  videoUrl="/videos/personal-statement.mp4"
                  transcript={[
                    {
                      id: '1',
                      startTime: 0,
                      endTime: 30,
                      text: 'Welcome to our guide on writing compelling personal statements. A personal statement is your chance to tell your unique story.'
                    },
                    {
                      id: '2',
                      startTime: 30,
                      endTime: 60,
                      text: 'Start with a hook that captures the reader\'s attention. This could be a meaningful moment, a challenge you overcame, or a passion that drives you.'
                    },
                    {
                      id: '3',
                      startTime: 60,
                      endTime: 90,
                      text: 'Remember to show, don\'t just tell. Use specific examples and experiences to demonstrate your qualities and growth.'
                    },
                  ]}
                />
              } 
            />
          </Routes>
        </main>

        {/* Search Modal */}
        <SearchComponent
          applications={applications}
          onResultClick={handleSearchResultClick}
          isOpen={isSearchOpen}
          onClose={() => setSearchOpen(false)}
        />

        {/* Chatbot */}
        {!isChatOpen && (
          <ChatToggleButton onClick={() => setChatOpen(true)} />
        )}
        
        <Chatbot
          isOpen={isChatOpen}
          onClose={() => setChatOpen(false)}
        />
      </div>
    </Router>
  );
}

export default App;