import React from 'react';
import { Link } from 'react-router-dom';
import HeroWaveBackground from '../components/HeroWaveBackground';
import Footer from '../components/Footer';

const Home: React.FC = () => {
  return (
    <div className="min-h-[calc(100vh-56px)]">
      {/* Hero Section with Full-Width Dynamic Fluid Wave Background */}
      <section className="relative overflow-hidden w-full">
        {/* Dynamic Flowing Fluid Wave Background */}
        <HeroWaveBackground />

        <div className="max-w-[1500px] mx-auto px-4 sm:px-8 lg:px-12 xl:px-16 relative">
          {/* Hero */}
          <div className="pt-16 sm:pt-20 pb-4 text-center">
            <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-extrabold text-gray-900 leading-[1.08] tracking-tight mb-6 max-w-6xl mx-auto">
              Create Quizzes <span className="whitespace-nowrap">in <span className="text-orange-500">Seconds</span>,</span><br />
              Not Hours
            </h1>
            <p className="text-base sm:text-lg text-gray-500 max-w-2xl mx-auto mb-14">
              Generate smart quizzes with AI, manage your classroom, and track student progress, all in one simple platform built for teachers and students.
            </p>
            <div className="flex gap-3 sm:gap-4 justify-center flex-wrap">
              <Link
                to="/register"
                className="btn-shine px-5 sm:px-8 py-2.5 sm:py-3 bg-orange-500 hover:bg-orange-600 text-white rounded-lg font-semibold transition-colors shadow-sm text-sm sm:text-base inline-block text-center"
              >
                Get Started Free
              </Link>
              <Link
                to="/login"
                className="px-5 sm:px-8 py-2.5 sm:py-3 bg-white hover:bg-orange-50 text-gray-700 border border-gray-300 rounded-lg font-semibold transition-colors text-sm sm:text-base"
              >
                Sign In
              </Link>
            </div>
            <div className="mt-16 sm:mt-20">
              <hr className="border-t border-gray-300" />
            </div>
          </div>
        </div>
      </section>

      <div className="max-w-[1500px] mx-auto px-4 sm:px-8 lg:px-12 xl:px-16 relative">
        {/* Features */}
        <div className="pb-24 pt-8 sm:pt-12">
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
            <p className="text-gray-500 max-w-xl mx-auto">Get started in minutes. No setup, no complex configurations,  just create, share, and track.</p>
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
          <div className="py-6 sm:py-10">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-5 sm:gap-8 text-center">
              {[
                { value: 'AI-Powered', label: 'Quiz Generation' },
                { value: 'Real-Time', label: 'Live Competitions' },
                { value: 'Instant', label: 'Results & Analytics' },
                { value: '100%', label: 'Free to Use' },
              ].map((s) => (
                <div key={s.label}>
                  <div className="text-lg sm:text-2xl md:text-3xl font-extrabold text-orange-500 mb-1">{s.value}</div>
                  <div className="text-xs sm:text-sm text-gray-500 font-medium">{s.label}</div>
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
          <div className="text-center py-6 sm:py-10">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mb-4">Ready to Transform Your Classroom?</h2>
            <p className="text-gray-600 max-w-lg mx-auto mb-8">Join thousands of educators who are making assessments smarter, faster, and more fun with AI Quiz Manager.</p>
            <div className="flex gap-3 sm:gap-4 justify-center flex-wrap">
              <Link
                to="/register"
                className="btn-shine px-5 sm:px-8 py-2.5 sm:py-3 bg-orange-500 hover:bg-orange-600 text-white rounded-lg font-semibold transition-colors shadow-sm text-sm sm:text-base inline-block text-center"
              >
                Get Started Free
              </Link>
              <Link
                to="/login"
                className="px-5 sm:px-8 py-2.5 sm:py-3 bg-white hover:bg-gray-50 text-gray-900 border border-gray-300 rounded-lg font-semibold transition-colors text-sm sm:text-base"
              >
                Sign In
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <Footer className="mt-0" />
    </div>
  );
};

export default Home;
