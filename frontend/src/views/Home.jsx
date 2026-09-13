import React from 'react';
import { ArrowRight, CheckCircle2, ClipboardList, Home as HomeIcon, ShieldCheck, Wrench } from 'lucide-react';
import { Link } from 'react-router-dom';

const features = [
  {
    icon: ClipboardList,
    title: 'Simple requests',
    description: 'Residents can book services and report issues from one clear dashboard.'
  },
  {
    icon: Wrench,
    title: 'Faster repairs',
    description: 'Workers see assigned tasks, update progress, and keep everyone informed.'
  },
  {
    icon: ShieldCheck,
    title: 'Reliable oversight',
    description: 'Admins manage services, workers, and complaints with complete visibility.'
  }
];

const Home = () => (
  <main className="home-page">
    <nav className="home-nav" aria-label="Main navigation">
      <Link to="/" className="brand-mark">
        <span className="brand-icon"><HomeIcon size={19} /></span>
        Flat Maintenance Service
      </Link>
      <div className="home-nav-actions">
        <Link to="/login" className="home-login">Sign in</Link>
        <Link to="/register" className="btn btn-primary home-register">Create account <ArrowRight size={17} /></Link>
      </div>
    </nav>

    <section className="home-hero">
      <div className="hero-copy animate-slide-up">
        <p className="eyebrow"><span className="eyebrow-dot" /> Maintenance, made easy</p>
        <h1>Keep your building <span>running beautifully.</span></h1>
        <p className="hero-description">
          One calm, connected place for residents, maintenance teams, and property managers to stay on top of every request.
        </p>
        <div className="hero-actions">
          <Link to="/register" className="btn btn-primary">Get started <ArrowRight size={18} /></Link>
          <Link to="/login" className="text-link">I already have an account</Link>
        </div>
        <div className="trust-line"><CheckCircle2 size={17} /> Clear updates from request to resolution</div>
      </div>

      <div className="service-preview animate-slide-up" aria-label="Flat Maintenance Service request preview">
        <Link to="/login" className="water-supply-link" aria-label="Report a water supply fault">
          <img
            className="water-supply-image"
            src="https://images.unsplash.com/photo-1607472586893-edb57bdc0e39?auto=format&fit=crop&w=900&q=85"
            alt="Plumber repairing a water pipe"
          />
          <span className="water-supply-cta">Report water fault <ArrowRight size={16} /></span>
        </Link>
        <div className="preview-topline"><span>Today at Flat Maintenance Service</span><span className="live-status"><i /> Live</span></div>
        <div className="preview-title">Your home, looked after.</div>
        <div className="preview-request">
          <div className="request-icon"><Wrench size={20} /></div>
          <div><strong>Kitchen tap repair</strong><small>Assigned to Arun · Today, 2:30 PM</small></div>
          <span className="request-check"><CheckCircle2 size={19} /></span>
        </div>
        <div className="preview-stats">
          <div><strong>24</strong><small>Requests resolved</small></div>
          <div><strong>4.9</strong><small>Resident rating</small></div>
        </div>
        <div className="preview-spark" aria-hidden="true"><span /><span /><span /><span /><span /><span /><span /></div>
      </div>
    </section>

    <section className="feature-strip" aria-label="Flat Maintenance Service features">
      {features.map(({ icon: Icon, title, description }) => (
        <article className="feature-item" key={title}>
          <div className="feature-icon"><Icon size={21} /></div>
          <div><h2>{title}</h2><p>{description}</p></div>
        </article>
      ))}
    </section>

    <footer className="home-footer"><span>Flat Maintenance Service</span><span>Better maintenance. Better living.</span></footer>
  </main>
);

export default Home;
