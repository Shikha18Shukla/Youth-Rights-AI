import { useState } from 'react';

interface LandingPageProps {
  onGetStarted: () => void;
  onLogin: () => void;
  isAuthenticated: boolean;
}

export function LandingPage({ onGetStarted, onLogin, isAuthenticated }: LandingPageProps) {
  const [showDisclaimer, setShowDisclaimer] = useState(false);

  return (
    <div className="min-h-screen bg-ivory">
      {/* Header */}
      <header className="bg-forest text-white sticky top-0 z-10 shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-2xl">⚖️</span>
            <h1 className="text-xl font-bold">Youth Rights AI</h1>
          </div>
          <div className="flex items-center gap-3">
            {isAuthenticated ? (
              <button
                onClick={onGetStarted}
                className="px-4 py-2 bg-gold text-forest-dark rounded-lg hover:bg-gold-light transition-colors font-medium"
              >
                Open Chat
              </button>
            ) : (
              <>
                <button
                  onClick={onLogin}
                  className="px-4 py-2 text-ivory hover:text-gold-light font-medium transition-colors"
                >
                  Sign In
                </button>
                <button
                  onClick={onGetStarted}
                  className="px-4 py-2 bg-gold text-forest-dark rounded-lg hover:bg-gold-light transition-colors font-medium"
                >
                  Get Started
                </button>
              </>
            )}
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <section className="py-16 sm:py-24 text-center">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-4xl sm:text-5xl font-extrabold text-charcoal mb-6">
              Know Your Rights.{' '}
              <span className="text-forest">Understand the Law.</span>
            </h2>
            <p className="text-lg sm:text-xl text-charcoal-light mb-8 leading-relaxed">
              Youth Rights AI helps students and young adults in India understand their legal rights
              through simple, easy-to-understand explanations grounded in official legal sources.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={onGetStarted}
                className="px-8 py-3 bg-forest text-white rounded-xl hover:bg-forest-light transition-colors font-semibold text-lg shadow-lg"
              >
                Ask a Legal Question
              </button>
              <button
                onClick={() => setShowDisclaimer(true)}
                className="px-8 py-3 bg-white text-charcoal rounded-xl hover:bg-sage-light transition-colors font-semibold text-lg border border-border"
              >
                Learn More
              </button>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-16 border-t border-border-light">
          <h3 className="text-2xl font-bold text-center text-charcoal mb-12">What Can I Ask About?</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { icon: '🎓', title: 'Education Rights', desc: 'Ragging, scholarships, document retention, and more' },
              { icon: '💼', title: 'Employment & Internships', desc: 'Stipend rights, workplace harassment, minimum wages' },
              { icon: '📱', title: 'Online Safety', desc: 'Cyberbullying, fake profiles, cybercrime reporting' },
              { icon: '🛒', title: 'Consumer Rights', desc: 'Online shopping refunds, grievance redressal' },
              { icon: '📜', title: 'Constitutional Rights', desc: 'Fundamental rights, equality, freedom, education' },
              { icon: '🛡️', title: 'Legal Procedures', desc: 'How to file complaints, approach authorities' },
            ].map((item) => (
              <div key={item.title} className="bg-cream rounded-xl p-6 border border-border hover:shadow-md transition-shadow">
                <span className="text-3xl mb-3 block">{item.icon}</span>
                <h4 className="font-semibold text-charcoal mb-2">{item.title}</h4>
                <p className="text-charcoal-light text-sm">{item.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Example Questions */}
        <section className="py-16 border-t border-border-light">
          <h3 className="text-2xl font-bold text-center text-charcoal mb-8">Example Questions</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-4xl mx-auto">
            {[
              'Can my college refuse to return my original documents?',
              'What are my rights if my internship stipend is not paid?',
              'What can I do if someone creates a fake social media account using my photos?',
              'What protections exist against ragging in educational institutions?',
              'What are my rights if an online seller refuses a valid refund?',
              'Which constitutional provisions protect my fundamental rights?',
            ].map((q) => (
              <button
                key={q}
                onClick={onGetStarted}
                className="text-left px-4 py-3 bg-cream rounded-lg border border-border hover:border-forest hover:bg-sage-light transition-colors text-sm text-charcoal"
              >
                {q}
              </button>
            ))}
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-border-light bg-forest text-ivory mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <p className="text-sage-light text-sm">
              Youth Rights AI — An AI-powered legal information assistant for Indian youth.
            </p>
            <p className="text-sage text-xs mt-2">
              This application provides general legal information only. It does not provide legal advice.
              For advice specific to your situation, please consult a qualified lawyer.
            </p>
          </div>
        </div>
      </footer>

      {/* Disclaimer Modal */}
      {showDisclaimer && (
        <div className="fixed inset-0 bg-charcoal-dark/50 flex items-center justify-center z-50 p-4">
          <div className="bg-cream rounded-xl max-w-lg w-full p-6 shadow-2xl border border-gold">
            <h3 className="text-xl font-bold text-charcoal mb-4 border-b border-gold pb-2">Important Disclaimer</h3>
            <div className="space-y-3 text-charcoal-light text-sm leading-relaxed">
              <p>
                Youth Rights AI is an <strong className="text-charcoal">educational tool</strong> that provides general legal information
                based on publicly available Indian legal sources.
              </p>
              <p>
                <strong className="text-charcoal">It does not provide legal advice.</strong> The information provided should not be
                interpreted as a substitute for consultation with a qualified legal professional.
              </p>
              <p>
                Laws change over time. While we strive for accuracy, always verify information with
                official government sources or a lawyer.
              </p>
              <p>
                For advice specific to your situation, please consult a qualified lawyer or the
                appropriate legal authority.
              </p>
            </div>
            <button
              onClick={() => setShowDisclaimer(false)}
              className="mt-6 w-full px-4 py-2 bg-forest text-white rounded-lg hover:bg-forest-light transition-colors font-medium"
            >
              I Understand
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
