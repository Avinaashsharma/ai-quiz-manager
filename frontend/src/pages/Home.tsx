import React from 'react';
import { Link } from 'react-router-dom';

const Home: React.FC = () => {
  return (
    <div className="min-h-[calc(100vh-56px)]">
      <div className="max-w-[1500px] mx-auto px-6 sm:px-8 lg:px-12 xl:px-16">
        {/* Hero */}
        <div className="pt-20 pb-16 text-center">
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold text-gray-900 leading-[1.12] tracking-tight mb-6 max-w-5xl mx-auto">
            Create Quizzes <span className="whitespace-nowrap">in <span className="text-orange-500">Seconds</span>,</span><br />
            Not Hours
          </h1>
          <p className="text-lg text-gray-500 max-w-2xl mx-auto mb-10">
            Generate smart quizzes with AI, manage your classroom, and track student progress, all in one simple platform built for teachers and students.
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <Link
              to="/register"
              className="px-8 py-3 bg-orange-500 hover:bg-orange-600 text-white rounded-lg font-semibold transition-colors shadow-sm"
            >
              Get Started Free
            </Link>
            <Link
              to="/login"
              className="px-8 py-3 bg-white hover:bg-orange-50 text-gray-700 border border-gray-300 rounded-lg font-semibold transition-colors"
            >
              Sign In
            </Link>
          </div>
        </div>

        {/* Features */}
        <div className="pb-24 pt-12 sm:pt-16 mt-6 sm:mt-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-x-12 lg:gap-x-16 xl:gap-x-20 gap-y-12">
            {[
              {
                num: '01',
                title: 'AI Generation',
                desc: 'Generate quiz questions from any topic using Gemini AI. Edit and customize before saving.',
              },
              {
                num: '02',
                title: 'Live Quizzes',
                desc: 'Host real-time quiz sessions. Students join with a code and compete on a live leaderboard.',
              },
              {
                num: '03',
                title: 'Analytics',
                desc: 'Track scores, view question-wise accuracy, and understand student performance at a glance.',
              },
            ].map((f) => (
              <div key={f.num} className="group">
                <h3 className="text-xl font-bold text-gray-900 mb-3 leading-snug">
                  {f.title}
                </h3>
                <p className="text-sm text-gray-500 leading-relaxed max-w-md">
                  {f.desc}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* How It Works */}
        <div className="pb-24 pt-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mb-4">How It Works</h2>
            <p className="text-gray-500 max-w-xl mx-auto">Get started in minutes. No setup, no complex configurations — just create, share, and track.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {[
              { step: '1', title: 'Create Account', desc: 'Sign up as a teacher or student in seconds. No credit card required.', icon: '👤' },
              { step: '2', title: 'Build Your Quiz', desc: 'Use AI to generate questions or create them manually. Mix and match as you like.', icon: '✏️' },
              { step: '3', title: 'Share & Go Live', desc: 'Share a join code with students. Go live for real-time competition.', icon: '🚀' },
              { step: '4', title: 'Track Results', desc: 'View detailed analytics, leaderboards, and per-question breakdowns instantly.', icon: '📊' },
            ].map((s) => (
              <div key={s.step} className="relative bg-white border border-gray-200 rounded-xl p-6 text-center hover:shadow-md transition-shadow">
                <div className="w-14 h-14 bg-orange-50 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl">
                  {s.icon}
                </div>
                <span className="absolute top-4 right-4 text-xs font-bold text-orange-400">Step {s.step}</span>
                <h3 className="text-lg font-bold text-gray-900 mb-2">{s.title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Stats */}
        <div className="pb-24">
          <div className="bg-white border border-gray-200 rounded-2xl p-10 sm:p-14">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
              {[
                { value: 'AI-Powered', label: 'Quiz Generation' },
                { value: 'Real-Time', label: 'Live Competitions' },
                { value: 'Instant', label: 'Results & Analytics' },
                { value: '100%', label: 'Free to Use' },
              ].map((s) => (
                <div key={s.label}>
                  <div className="text-2xl sm:text-3xl font-extrabold text-orange-500 mb-1">{s.value}</div>
                  <div className="text-sm text-gray-500 font-medium">{s.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* What People Say */}
        <div className="pb-24">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mb-4">Loved by Educators</h2>
            <p className="text-gray-500 max-w-xl mx-auto">Teachers and students are already using AI Quiz Manager to make learning more engaging.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { name: 'Priya Sharma', role: 'High School Teacher', quote: 'The AI generation saves me hours every week. I can create a full quiz in under a minute!', avatar: '👩‍🏫' },
              { name: 'Rahul Verma', role: 'College Professor', quote: 'Live quiz mode makes my lectures so much more interactive. Students actually look forward to assessments now.', avatar: '👨‍🏫' },
              { name: 'Ananya Gupta', role: 'Student', quote: 'I love competing on the leaderboard. It makes studying feel like a game instead of a chore.', avatar: '👩‍🎓' },
            ].map((t) => (
              <div key={t.name} className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-md transition-shadow">
                <p className="text-gray-600 text-sm leading-relaxed mb-6 italic">"{t.quote}"</p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-orange-50 rounded-full flex items-center justify-center text-lg">{t.avatar}</div>
                  <div>
                    <div className="text-sm font-bold text-gray-900">{t.name}</div>
                    <div className="text-xs text-gray-400">{t.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="pb-24">
          <div className="bg-white rounded-2xl p-10 sm:p-16 text-center">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mb-4">Ready to Transform Your Classroom?</h2>
            <p className="text-gray-600 max-w-lg mx-auto mb-8">Join thousands of educators who are making assessments smarter, faster, and more fun with AI Quiz Manager.</p>
            <div className="flex gap-4 justify-center flex-wrap">
              <Link
                to="/register"
                className="px-8 py-3 bg-orange-500 hover:bg-orange-600 text-white rounded-lg font-semibold transition-colors shadow-sm"
              >
                Get Started Free
              </Link>
              <Link
                to="/login"
                className="px-8 py-3 bg-white hover:bg-gray-50 text-gray-900 border border-gray-300 rounded-lg font-semibold transition-colors"
              >
                Sign In
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-600 text-gray-100 mt-0">
        <div className="max-w-[1500px] mx-auto px-6 sm:px-8 lg:px-12 xl:px-16 py-16">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
            {/* Brand */}
            <div>
              <h3 className="text-white text-lg font-bold mb-3">AI Quiz Manager</h3>
              <p className="text-sm leading-relaxed text-gray-200">Create smart quizzes with AI, host live sessions, and track student performance — all in one platform.</p>
            </div>

            {/* Product */}
            <div>
              <h4 className="text-white text-sm font-semibold mb-4">Product</h4>
              <ul className="space-y-2 text-sm text-gray-200">
                <li><Link to="/register" className="hover:text-orange-400 transition-colors">Get Started</Link></li>
                <li><Link to="/login" className="hover:text-orange-400 transition-colors">Sign In</Link></li>
                <li><span>AI Quiz Generation</span></li>
                <li><span>Live Quizzes</span></li>
              </ul>
            </div>

            {/* Resources */}
            <div>
              <h4 className="text-white text-sm font-semibold mb-4">Resources</h4>
              <ul className="space-y-2 text-sm text-gray-200">
                <li><span>Documentation</span></li>
                <li><span>Help Center</span></li>
                <li><span>API Reference</span></li>
                <li><span>Release Notes</span></li>
              </ul>
            </div>

            {/* Company */}
            <div>
              <h4 className="text-white text-sm font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-sm text-gray-200">
                <li><span>About Us</span></li>
                <li><span>Privacy Policy</span></li>
                <li><span>Terms of Service</span></li>
                <li><span>Contact</span></li>
              </ul>
            </div>
          </div>

          {/* Bottom bar */}
          <div className="border-t border-gray-500 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-xs text-gray-200">© {new Date().getFullYear()} AI Quiz Manager. All rights reserved.</p>
            <div className="flex gap-6 text-xs">
              <span className="text-gray-200 hover:text-orange-400 cursor-pointer transition-colors">Privacy</span>
              <span className="text-gray-200 hover:text-orange-400 cursor-pointer transition-colors">Terms</span>
              <span className="text-gray-200 hover:text-orange-400 cursor-pointer transition-colors">Cookies</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;
