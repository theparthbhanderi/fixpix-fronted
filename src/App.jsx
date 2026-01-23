import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from './lib/queryClient';
import { AuthProvider } from './context/AuthContext';
import { ModalProvider } from './context/ModalContext';
import PrivateRoute from './utils/PrivateRoute';

import LoadingOverlay from './components/ui/LoadingOverlay';
import LandingPage from './pages/LandingPage';
import DashboardLayout from './pages/DashboardLayout';
import DashboardPage from './pages/DashboardPage';
import EditorPage from './pages/EditorPage';
import ProjectsPage from './pages/ProjectsPage';
import SettingsPage from './pages/SettingsPage';
import BatchProcessor from './components/features/batch/BatchProcessor';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import AboutPage from './pages/AboutPage';
import NotFoundPage from './pages/NotFoundPage';

import { ImageProvider } from './context/ImageContext';
import GlobalErrorBoundary from './utils/GlobalErrorBoundary';
import { ToastProvider } from './components/ui/Toast';

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <GlobalErrorBoundary>
        <ToastProvider>
          <Router>
            <AuthProvider>
              <ImageProvider>
                <ModalProvider>
                  {/* Skip Navigation for Accessibility */}
                  <a
                    href="#main-content"
                    className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-[100] focus:px-4 focus:py-2 focus:rounded-lg focus:bg-primary focus:text-white focus:outline-none"
                  >
                    Skip to main content
                  </a>
                  {/* React.Suspense removed as we reverted to static imports */}
                  <Routes>
                    <Route path="/" element={<LandingPage />} />
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/signup" element={<SignupPage />} />
                    <Route path="/about" element={<AboutPage />} />
                    <Route
                      path="/app"
                      element={
                        <PrivateRoute>
                          <DashboardLayout />
                        </PrivateRoute>
                      }
                    >
                      <Route index element={<DashboardPage />} />
                      <Route path="restoration" element={<EditorPage />} />
                      <Route path="batch" element={<BatchProcessor />} />
                      <Route path="projects" element={<ProjectsPage />} />
                      <Route path="settings" element={<SettingsPage />} />
                    </Route>
                    {/* 404 Page */}
                    <Route path="*" element={<NotFoundPage />} />
                  </Routes>
                </ModalProvider>
              </ImageProvider>
            </AuthProvider>
          </Router>
        </ToastProvider>
      </GlobalErrorBoundary>
    </QueryClientProvider>
  );
}

export default App;

