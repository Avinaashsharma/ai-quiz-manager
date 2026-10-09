import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Home from '../pages/Home';
import Login from '../pages/Login';
import Register from '../pages/Register';
import TeacherDashboard from '../pages/TeacherDashboard';
import StudentDashboard from '../pages/StudentDashboard';
import StudentAttempts from '../pages/StudentAttempts';
import TeacherQuizList from '../pages/TeacherQuizList';
import CreateQuiz from '../pages/CreateQuiz';
import EditQuiz from '../pages/EditQuiz';
import TeacherQuizResults from '../pages/TeacherQuizResults';
import TeacherLiveQuiz from '../pages/TeacherLiveQuiz';
import TeacherAnalytics from '../pages/TeacherAnalytics';
import JoinQuiz from '../pages/JoinQuiz';
import QuizAttempt from '../pages/QuizAttempt';
import QuizResult from '../pages/QuizResult';
import VerifyOtp from '../pages/VerifyOtp';
import NotFound from '../pages/NotFound';
import Profile from '../pages/Profile';
import ProtectedRoute from '../components/ProtectedRoute';
import InfoPage from '../pages/InfoPage';

const AppRoutes: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/verify-otp" element={<VerifyOtp />} />
      <Route path="/info/:slug" element={<InfoPage />} />

      {/* Teacher Routes */}
      <Route
        path="/teacher/dashboard"
        element={
          <ProtectedRoute allowedRoles={['teacher']}>
            <TeacherDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/teacher/quizzes"
        element={
          <ProtectedRoute allowedRoles={['teacher']}>
            <TeacherQuizList />
          </ProtectedRoute>
        }
      />
      <Route
        path="/teacher/quizzes/create"
        element={
          <ProtectedRoute allowedRoles={['teacher']}>
            <CreateQuiz />
          </ProtectedRoute>
        }
      />
      <Route
        path="/teacher/quizzes/:id/edit"
        element={
          <ProtectedRoute allowedRoles={['teacher']}>
            <EditQuiz />
          </ProtectedRoute>
        }
      />
      <Route
        path="/teacher/quizzes/:id/results"
        element={
          <ProtectedRoute allowedRoles={['teacher']}>
            <TeacherQuizResults />
          </ProtectedRoute>
        }
      />
      <Route
        path="/teacher/live/:joinCode"
        element={
          <ProtectedRoute allowedRoles={['teacher']}>
            <TeacherLiveQuiz />
          </ProtectedRoute>
        }
      />
      <Route
        path="/teacher/quizzes/:id/analytics"
        element={
          <ProtectedRoute allowedRoles={['teacher']}>
            <TeacherAnalytics />
          </ProtectedRoute>
        }
      />

      {/* Student Routes */}
      <Route
        path="/student/dashboard"
        element={
          <ProtectedRoute allowedRoles={['student']}>
            <StudentDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/student/attempts"
        element={
          <ProtectedRoute allowedRoles={['student']}>
            <StudentAttempts />
          </ProtectedRoute>
        }
      />
      <Route
        path="/student/join"
        element={
          <ProtectedRoute allowedRoles={['student']}>
            <JoinQuiz />
          </ProtectedRoute>
        }
      />
      <Route
        path="/student/quiz/:id/attempt"
        element={
          <ProtectedRoute allowedRoles={['student']}>
            <QuizAttempt />
          </ProtectedRoute>
        }
      />
      <Route
        path="/student/results/:id"
        element={
          <ProtectedRoute allowedRoles={['student']}>
            <QuizResult />
          </ProtectedRoute>
        }
      />

      <Route
        path="/profile"
        element={
          <ProtectedRoute allowedRoles={['student', 'teacher']}>
            <Profile />
          </ProtectedRoute>
        }
      />

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default AppRoutes;
