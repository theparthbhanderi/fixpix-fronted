import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from './lib/queryClient';
import { AuthProvider } from './context/AuthContext';
import { ModalProvider } from './context/ModalContext';
import PrivateRoute from './utils/PrivateRoute';
import { CommandProvider } from './context/CommandContext';
import { ImageProvider } from './context/ImageContext';
import GlobalErrorBoundary from './utils/GlobalErrorBoundary';
import { ToastProvider } from './components/ui/Toast';


const LandingPage = React.lazy(() => import('./pages/LandingPage'));
const DashboardLayout = React.lazy(() => import('./pages/DashboardLayout'));
const DashboardPage = React.lazy(() => import('./pages/DashboardPage'));
const EditorPage = React.lazy(() => import('./pages/EditorPage'));
const ProjectsPage = React.lazy(() => import('./pages/ProjectsPage'));
const SettingsPage = React.lazy(() => import('./pages/SettingsPage'));
const BatchProcessor = React.lazy(() => import('./components/features/batch/BatchProcessor'));
const LoginPage = React.lazy(() => import('./pages/LoginPage'));
const SignupPage = React.lazy(() => import('./pages/SignupPage'));
const AboutPage = React.lazy(() => import('./pages/AboutPage'));
const NotFoundPage = React.lazy(() => import('./pages/NotFoundPage'));

// Admin Components
const AdminGuard = React.lazy(() => import('./admin/components/AdminGuard'));
const AdminLayout = React.lazy(() => import('./admin/layouts/AdminLayout'));
const Dashboard = React.lazy(() => import('./admin/pages/Dashboard'));
const UsersPage = React.lazy(() => import('./admin/pages/Users'));
const JobsPage = React.lazy(() => import('./admin/pages/Jobs'));

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <GlobalErrorBoundary>
        <ToastProvider>
          <Router>
            <AuthProvider>
              <ImageProvider>
                <CommandProvider>
                  <ModalProvider>
                    {/* Skip Navigation for Accessibility */}
                    <a
                      href="#main-content"
                      className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-[100] focus:px-4 focus:py-2 focus:rounded-lg focus:bg-primary focus:text-white focus:outline-none"
                    >
                      Skip to main content
                    </a>
                    <React.Suspense fallback={<div className="flex h-screen w-screen items-center justify-center text-white">Loading App...</div>}>
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

                        {/* Admin Panel Routes */}
                        <Route
                          path="/admin"
                          element={
                            <AdminGuard>
                              <AdminLayout />
                            </AdminGuard>
                          }
                        >
                          <Route index element={<Dashboard />} />
                          <Route path="users" element={<UsersPage />} />
                          <Route path="jobs" element={<JobsPage />} />
                          {/* Placeholder for future specific pages */}
                          <Route path="system" element={<Dashboard />} />
                        </Route>
                        {/* 404 Page */}
                        <Route path="*" element={<NotFoundPage />} />
                      </Routes>
                    </React.Suspense>
                  </ModalProvider>
                </CommandProvider>
              </ImageProvider>
            </AuthProvider>
          </Router>
        </ToastProvider>
      </GlobalErrorBoundary>
    </QueryClientProvider>
  );
}

export default App;

