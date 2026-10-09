import React from 'react';
import { Link, useParams } from 'react-router-dom';
import Footer from '../components/Footer';

const pages: Record<string, { title: string; sections: { heading: string; body: string }[] }> = {
  documentation: {
    title: 'Documentation',
    sections: [
      { heading: 'Getting Started', body: 'AI Quiz Manager lets teachers create, manage, and host quizzes powered by AI. Sign up, create a quiz (manually or with AI), set it to Active, and share the join code with students.' },
      { heading: 'Creating Quizzes', body: 'Navigate to your Teacher Dashboard → Create Quiz. Enter a topic and let Gemini AI generate questions, or add them manually. You can edit, reorder, and delete questions before saving.' },
      { heading: 'AI Quiz Generation', body: 'On the Create Quiz page, enter any topic (e.g. "Photosynthesis", "World War II") and choose the number of questions. The AI generates multiple-choice questions with correct answers and explanations.' },
      { heading: 'Managing Quizzes', body: 'From the Teacher Dashboard, view all your quizzes. Set status to Draft, Active, or Closed. Only Active quizzes can be joined by students. Edit quiz details, questions, or duration at any time.' },
      { heading: 'Live Quiz Sessions', body: 'When a quiz is Active, share the join code with students. Open the Live view to see a real-time leaderboard as students submit their answers.' },
      { heading: 'Student Workflow', body: 'Students sign up, enter a join code on the Join Quiz page, answer all questions within the time limit, and instantly see their score and detailed results with explanations.' },
    ],
  },
  'help-center': {
    title: 'Help Center',
    sections: [
      { heading: 'How do I create a quiz?', body: 'Go to Teacher Dashboard → Create Quiz. You can generate questions using AI by entering a topic, or add questions manually one by one.' },
      { heading: 'How do students join a quiz?', body: 'Students click "Join Quiz" from their dashboard and enter the join code shared by the teacher. The quiz must be in Active status.' },
      { heading: 'Can I edit a quiz after creating it?', body: 'Yes! Go to your quiz list, click Edit on any quiz. You can modify questions, options, correct answers, duration, and description.' },
      { heading: 'How does the live leaderboard work?', body: 'When students submit answers for an Active quiz, the leaderboard updates in real-time. Teachers can watch the Live view, and students see the leaderboard on their results page.' },
      { heading: 'What happens if I close a quiz?', body: 'Closed quizzes can no longer be joined by students. Existing results and analytics remain accessible.' },
      { heading: 'I forgot my password', body: 'Currently, password reset is not available through the app. Please contact the administrator for assistance.' },
    ],
  },
  'api-reference': {
    title: 'API Reference',
    sections: [
      { heading: 'Authentication', body: 'POST /api/auth/register — Register a new user.\nPOST /api/auth/login — Login and receive a JWT token.\nPOST /api/auth/verify-otp — Verify email with OTP.\nGET /api/auth/me — Get current user profile.' },
      { heading: 'Quizzes', body: 'GET /api/quizzes — List all quizzes (teacher).\nPOST /api/quizzes — Create a new quiz.\nPUT /api/quizzes/:id — Update a quiz.\nDELETE /api/quizzes/:id — Delete a quiz.\nPOST /api/quizzes/:id/generate — AI-generate questions for a quiz.' },
      { heading: 'Quiz Attempts', body: 'POST /api/quizzes/:id/join — Join a quiz by code (student).\nPOST /api/quizzes/:id/submit — Submit quiz answers.\nGET /api/attempts — List all attempts for the current student.\nGET /api/attempts/:id — Get detailed attempt results.' },
      { heading: 'Results & Leaderboard', body: 'GET /api/quizzes/:id/results — Get all student results for a quiz (teacher).\nGET /api/quizzes/:id/leaderboard — Get ranked leaderboard for a quiz.' },
      { heading: 'Authentication', body: 'All API endpoints (except register/login) require a Bearer token in the Authorization header: Authorization: Bearer <token>' },
    ],
  },
  'release-notes': {
    title: 'Release Notes',
    sections: [
      { heading: 'v1.2.0 — October 2026', body: '• Premium KPI card designs on dashboards and result pages\n• Fixed Vercel 404 on page refresh (SPA rewrite)\n• Fixed background flash on page load\n• Footer links now functional' },
      { heading: 'v1.1.0 — September 2026', body: '• Live quiz sessions with real-time leaderboard\n• Teacher analytics page with question-wise breakdown\n• Student attempt history page\n• Mobile-responsive navigation with bottom bar' },
      { heading: 'v1.0.0 — August 2026', body: '• Initial release\n• AI-powered quiz generation using Gemini\n• Teacher and Student dashboards\n• Quiz creation, editing, and management\n• Join code system for students\n• Score tracking and result review with explanations' },
    ],
  },
  'about-us': {
    title: 'About Us',
    sections: [
      { heading: 'Our Mission', body: 'AI Quiz Manager was built to make assessments smarter, faster, and more engaging. We believe teachers deserve tools that save time, and students deserve quizzes that are fair, fun, and insightful.' },
      { heading: 'What We Do', body: 'We combine the power of AI with a clean, intuitive interface to help educators create high-quality quizzes in seconds. From AI-generated questions to live leaderboards, everything is designed to make learning interactive.' },
      { heading: 'Built for Education', body: 'Whether you\'re a school teacher managing a classroom or a tutor running online sessions, AI Quiz Manager adapts to your workflow. No complex setup, no steep learning curve — just create, share, and track.' },
    ],
  },
  'privacy-policy': {
    title: 'Privacy Policy',
    sections: [
      { heading: 'Information We Collect', body: 'We collect your name, email address, and role (teacher/student) when you register. Quiz data, attempt results, and scores are stored to provide analytics and results.' },
      { heading: 'How We Use Your Data', body: 'Your data is used solely to operate the platform — authenticating your account, storing quiz results, generating analytics, and displaying leaderboards. We do not sell or share your personal data with third parties.' },
      { heading: 'Data Security', body: 'Passwords are hashed using industry-standard algorithms. API communication is encrypted via HTTPS. JWT tokens are used for session management and expire automatically.' },
      { heading: 'Data Retention', body: 'Your account data and quiz results are retained as long as your account is active. You may request account deletion by contacting us, and all associated data will be permanently removed.' },
      { heading: 'Third-Party Services', body: 'We use Google Gemini AI for quiz question generation. Topics you enter for AI generation may be sent to Google\'s API. No student personal data is shared with AI services.' },
    ],
  },
  'terms-of-service': {
    title: 'Terms of Service',
    sections: [
      { heading: 'Acceptance of Terms', body: 'By creating an account or using AI Quiz Manager, you agree to these terms. If you do not agree, please do not use the platform.' },
      { heading: 'User Accounts', body: 'You are responsible for maintaining the security of your account credentials. Each account must be associated with a valid email address. You may not share your account with others.' },
      { heading: 'Acceptable Use', body: 'You agree to use the platform for legitimate educational purposes only. You may not use the platform to distribute harmful, offensive, or misleading content. Automated abuse of the API or AI features is prohibited.' },
      { heading: 'Content Ownership', body: 'Quizzes and questions you create remain your intellectual property. By using AI generation, you acknowledge that AI-generated content may not be fully original and should be reviewed before use.' },
      { heading: 'Limitation of Liability', body: 'AI Quiz Manager is provided "as is" without warranties. We are not liable for data loss, service interruptions, or inaccuracies in AI-generated content. Use of the platform is at your own risk.' },
    ],
  },
  contact: {
    title: 'Contact',
    sections: [
      { heading: 'Get in Touch', body: 'Have questions, feedback, or need help? We\'d love to hear from you.' },
      { heading: 'Email', body: 'support@aiquizmanager.com' },
      { heading: 'Response Time', body: 'We aim to respond to all inquiries within 24–48 hours during business days.' },
      { heading: 'Bug Reports', body: 'Found a bug or something not working as expected? Please email us with a description of the issue, the page it occurred on, and any error messages you saw. Screenshots are always helpful!' },
    ],
  },
};

const InfoPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const page = pages[slug || ''];

  if (!page) {
    return (
      <div className="min-h-[calc(100vh-56px)] flex flex-col items-center justify-center bg-orange-50">
        <p className="text-gray-500 text-lg mb-4">Page not found</p>
        <Link to="/" className="px-6 py-2.5 bg-orange-500 text-white rounded-lg font-semibold">Go Home</Link>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-56px)] bg-orange-50 flex flex-col justify-between">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full flex-1">
        <Link to="/" className="text-sm text-gray-400 hover:text-orange-500 transition-colors mb-6 inline-block">← Back to Home</Link>
        <h1 className="text-3xl font-bold text-gray-900 mb-8">{page.title}</h1>
        <div className="space-y-8">
          {page.sections.map((s) => (
            <div key={s.heading} className="bg-white border border-gray-200 rounded-xl p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-2">{s.heading}</h2>
              <p className="text-gray-600 text-sm leading-relaxed whitespace-pre-line">{s.body}</p>
            </div>
          ))}
        </div>
      </div>
      <Footer className="mt-8" />
    </div>
  );
};

export default InfoPage;
