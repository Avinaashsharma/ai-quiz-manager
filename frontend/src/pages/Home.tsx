import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import HeroWaveBackground from '../components/HeroWaveBackground';
import Footer from '../components/Footer';

/** Fade-up on scroll into view. Pure Intersection Observer, no deps. */
const useScrollReveal = () => {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { el.classList.add('revealed'); observer.unobserve(el); } },
      { threshold: 0.15 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);
  return ref;
};

const revealStyle = 'opacity-0 translate-y-8 transition-all duration-700 ease-out [&.revealed]:opacity-100 [&.revealed]:translate-y-0';

const Home: React.FC = () => {
  const featuresRef = useScrollReveal();
  const howRef = useScrollReveal();
  const statsRef = useScrollReveal();
  const testimonialsRef = useScrollReveal();
  const ctaRef = useScrollReveal();

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
        <div ref={featuresRef} className={`pb-24 pt-8 sm:pt-12 ${revealStyle}`}>
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
            ].map((f, i) => (
              <div key={f.num} className="group" style={{ transitionDelay: `${i * 120}ms` }}>
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
        <div ref={howRef} className={`pb-24 pt-8 group ${revealStyle}`}>
          <div className="text-center mb-14">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mb-3">How It Works</h2>
            <p className="text-gray-500 max-w-xl mx-auto">Get started in minutes. No setup, no complex configurations — just create, share, and track.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 relative">
            {/* Connector line desktop */}
            <div className="hidden md:block absolute top-10 left-[12.5%] right-[12.5%] h-px bg-gradient-to-r from-orange-200 via-orange-300 to-orange-200 z-0" />
            {[
              { step: '1', title: 'Create Account', desc: 'Sign up as a teacher or student in seconds. No credit card required.', icon: '👤' },
              { step: '2', title: 'Build Your Quiz', desc: 'Use AI to generate questions or create them manually. Mix and match as you like.', icon: '✏️' },
              { step: '3', title: 'Share & Go Live', desc: 'Share a join code with students. Go live for real-time competition.', icon: '🚀' },
              { step: '4', title: 'Track Results', desc: 'View detailed analytics, leaderboards, and per-question breakdowns instantly.', icon: '📊' },
            ].map((s, i) => (
              <div
                key={s.step}
                className={`relative z-10 bg-white border border-gray-100 rounded-2xl p-6 text-center shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-500 ease-out opacity-0 ${i < 2 ? '-translate-x-12' : 'translate-x-12'} group-[.revealed]:opacity-100 group-[.revealed]:translate-x-0 group-[.revealed]:translate-y-0`}
                style={{ transitionDelay: `${i * 150}ms` }}
              >
                {/* Orange top accent bar */}
                <div className="absolute top-0 left-6 right-6 h-0.5 bg-gradient-to-r from-transparent via-orange-400 to-transparent rounded-full" />
                {/* Watermark step number */}
                <div className="absolute top-3 right-4 text-5xl font-black text-orange-50 leading-none select-none">{s.step}</div>
                {/* Icon */}
                <div className="w-14 h-14 bg-gradient-to-br from-orange-100 to-amber-50 rounded-2xl flex items-center justify-center mx-auto mb-4 text-2xl shadow-sm">
                  {s.icon}
                </div>
                <span className="inline-block text-[10px] font-bold text-orange-500 uppercase tracking-widest mb-2">Step {s.step}</span>
                <h3 className="text-base font-bold text-gray-900 mb-2 leading-snug">{s.title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>


        {/* Stats */}
        <div ref={statsRef} className={`pb-24 ${revealStyle}`}>
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
        <div ref={testimonialsRef} className={`pb-16 group ${revealStyle}`}>
          <div className="text-center mb-10">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mb-3">Loved by Educators</h2>
            <p className="text-gray-500 max-w-xl mx-auto">Teachers and students are already using AI Quiz Manager to make learning more engaging.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { name: 'Priya Das', role: 'High School Teacher', quote: 'The AI generation saves me hours every week. I can create a full quiz in under a minute!', avatar: '👩‍🏫', stars: 5 },
              { name: 'Rahul Verma', role: 'College Professor', quote: 'Live quiz mode makes my lectures so much more interactive. Students actually look forward to assessments now.', avatar: '👨‍🏫', stars: 5 },
              { name: 'Ananya Kumar', role: 'Student', quote: 'I love competing on the leaderboard. It makes studying feel like a game instead of a chore.', avatar: '👩‍🎓', stars: 5 },
            ].map((t, i) => {
              const dir = i === 0 ? '-translate-x-12' : i === 2 ? 'translate-x-12' : 'translate-y-8';
              return (
                <div
                  key={t.name}
                  className={`relative bg-white border border-gray-100 rounded-2xl p-5 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-500 ease-out opacity-0 ${dir} group-[.revealed]:opacity-100 group-[.revealed]:translate-x-0 group-[.revealed]:translate-y-0`}
                  style={{ transitionDelay: `${i * 150}ms` }}
                >
                  {/* Orange top accent */}
                  <div className="absolute top-0 left-6 right-6 h-0.5 bg-gradient-to-r from-transparent via-orange-400 to-transparent rounded-full" />

                  {/* Watermark quote mark */}
                  <div className="absolute top-3 right-4 text-4xl font-serif text-orange-200/60 leading-none select-none pointer-events-none">”</div>

                  {/* Stars */}
                  <div className="flex gap-0.5 mb-2">
                    {Array.from({ length: t.stars }).map((_, si) => (
                      <svg key={si} className="w-3.5 h-3.5 text-orange-400 fill-current" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>
                    ))}
                  </div>

                  {/* Quote */}
                  <p className="text-gray-600 text-xs sm:text-sm leading-relaxed mb-3.5">{t.quote}</p>

                  {/* Author */}
                  <div className="flex items-center gap-2.5 pt-3 border-t border-gray-100">
                    <div className="w-9 h-9 bg-gradient-to-br from-orange-100 to-amber-50 rounded-full flex items-center justify-center text-lg shadow-sm shrink-0">{t.avatar}</div>
                    <div>
                      <div className="text-sm font-bold text-gray-900 leading-tight">{t.name}</div>
                      <div className="text-[11px] text-orange-500 font-semibold leading-tight mt-0.5">{t.role}</div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>


        {/* CTA */}
        <div ref={ctaRef} className={`pb-24 ${revealStyle}`}>
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

