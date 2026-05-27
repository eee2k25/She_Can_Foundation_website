import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Moon, Sun, Heart, ArrowUp, Menu, X, Sparkles, Users, BookOpen, Globe } from 'lucide-react';

function App() {
  const [darkMode, setDarkMode] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [subscribed, setSubscribed] = useState(false);
  const [email, setEmail] = useState('');
  const [subscribing, setSubscribing] = useState(false);
  const [statsVisible, setStatsVisible] = useState(false);
  const [counters, setCounters] = useState({ women: 0, communities: 0, programs: 0, states: 0 });

  useEffect(() => {
    const saved = localStorage.getItem('shecan-dark');
    if (saved === 'true') setDarkMode(true);
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', darkMode);
    localStorage.setItem('shecan-dark', String(darkMode));
  }, [darkMode]);

  useEffect(() => {
    const handleScroll = () => setShowScrollTop(window.scrollY > 400);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setStatsVisible(true); },
      { threshold: 0.3 }
    );
    const el = document.getElementById('stats-section');
    if (el) observer.observe(el);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!statsVisible) return;
    const targets = { women: 5000, communities: 120, programs: 35, states: 18 };
    const duration = 2000;
    const steps = 60;
    const interval = duration / steps;
    let step = 0;
    const timer = setInterval(() => {
      step++;
      const progress = step / steps;
      const eased = 1 - Math.pow(1 - progress, 3);
      setCounters({
        women: Math.round(targets.women * eased),
        communities: Math.round(targets.communities * eased),
        programs: Math.round(targets.programs * eased),
        states: Math.round(targets.states * eased),
      });
      if (step >= steps) clearInterval(timer);
    }, interval);
    return () => clearInterval(timer);
  }, [statsVisible]);

  const handleSubscribe = async () => {
    if (!email || !email.includes('@')) return;
    setSubscribing(true);
    try {
      const res = await fetch('/api/subscribers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      if (res.ok) {
        setSubscribed(true);
        setEmail('');
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSubscribing(false);
    }
  };

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
    setMenuOpen(false);
  };

  return (
    <div className={`min-h-screen transition-colors duration-500 ${darkMode ? 'dark bg-gray-950' : 'bg-white'}`}>
      {/* Floating particles */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            className={`absolute rounded-full ${darkMode ? 'bg-rose-500/10' : 'bg-rose-200/40'}`}
            style={{
              width: 100 + i * 60,
              height: 100 + i * 60,
              left: `${10 + i * 15}%`,
              top: `${20 + i * 10}%`,
            }}
            animate={{
              y: [0, -30, 0],
              x: [0, 15, 0],
              scale: [1, 1.1, 1],
            }}
            transition={{
              duration: 6 + i * 2,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          />
        ))}
      </div>

      {/* Navbar */}
      <nav className={`fixed top-0 left-0 right-0 z-50 backdrop-blur-xl transition-all duration-300 ${darkMode ? 'bg-gray-950/80 border-gray-800' : 'bg-white/80 border-gray-100'} border-b`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <motion.div
              className="flex items-center gap-2.5 cursor-pointer"
              onClick={() => scrollTo('hero')}
              whileHover={{ scale: 1.05 }}
            >
              <img
                src="/logo.png"
                alt="She Can Foundation Logo"
                className="w-10 h-10 rounded-xl object-contain"
              />
              <span className={`font-bold text-lg ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                She Can
              </span>
            </motion.div>

            {/* Desktop nav */}
            <div className="hidden md:flex items-center gap-8">
              {['about', 'impact', 'join'].map((id) => (
                <button
                  key={id}
                  onClick={() => scrollTo(id)}
                  className={`text-sm font-medium capitalize transition-colors ${darkMode ? 'text-gray-300 hover:text-rose-400' : 'text-gray-600 hover:text-rose-500'}`}
                >
                  {id}
                </button>
              ))}
              <button
                onClick={() => setDarkMode(!darkMode)}
                className={`p-2 rounded-xl transition-colors ${darkMode ? 'bg-gray-800 text-yellow-400 hover:bg-gray-700' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
              >
                {darkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
              </button>
            </div>

            {/* Mobile menu button */}
            <div className="flex md:hidden items-center gap-2">
              <button
                onClick={() => setDarkMode(!darkMode)}
                className={`p-2 rounded-xl transition-colors ${darkMode ? 'bg-gray-800 text-yellow-400' : 'bg-gray-100 text-gray-600'}`}
              >
                {darkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
              </button>
              <button
                onClick={() => setMenuOpen(!menuOpen)}
                className={`p-2 rounded-xl ${darkMode ? 'text-white' : 'text-gray-900'}`}
              >
                {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile menu */}
        <AnimatePresence>
          {menuOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className={`md:hidden overflow-hidden ${darkMode ? 'bg-gray-950' : 'bg-white'} border-t ${darkMode ? 'border-gray-800' : 'border-gray-100'}`}
            >
              <div className="px-4 py-4 space-y-3">
                {['about', 'impact', 'join'].map((id) => (
                  <button
                    key={id}
                    onClick={() => scrollTo(id)}
                    className={`block w-full text-left text-sm font-medium capitalize py-2 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}
                  >
                    {id}
                  </button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* Hero Section */}
      <section id="hero" className="relative min-h-screen flex items-center justify-center pt-16 overflow-hidden">
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="text-center lg:text-left">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
              >
                <span className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold tracking-wide uppercase mb-6 ${darkMode ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20' : 'bg-rose-50 text-rose-600 border border-rose-200'}`}>
                  <Sparkles className="w-3 h-3" />
                  Empowering Since 2018
                </span>
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.15 }}
                className={`text-4xl sm:text-5xl lg:text-6xl font-extrabold leading-tight mb-6 ${darkMode ? 'text-white' : 'text-gray-900'}`}
              >
                She Can.
                <br />
                <span className="bg-gradient-to-r from-rose-500 via-pink-500 to-orange-400 bg-clip-text text-transparent">
                  She Will.
                </span>
                <br />
                She Does.
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.3 }}
                className={`text-lg sm:text-xl mb-8 leading-relaxed max-w-lg ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}
              >
                She Can Foundation is dedicated to empowering women and girls across India through education, skill development, and community support.
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.45 }}
                className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start"
              >
                <motion.button
                  whileHover={{ scale: 1.05, boxShadow: '0 20px 40px rgba(244, 63, 94, 0.3)' }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => scrollTo('join')}
                  className="px-8 py-4 bg-gradient-to-r from-rose-500 to-orange-400 text-white font-semibold rounded-2xl shadow-lg shadow-rose-500/25 hover:shadow-rose-500/40 transition-shadow text-base"
                >
                  Join Our Mission
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => scrollTo('about')}
                  className={`px-8 py-4 font-semibold rounded-2xl border-2 transition-colors text-base ${darkMode ? 'border-gray-700 text-gray-300 hover:border-rose-500 hover:text-rose-400' : 'border-gray-200 text-gray-700 hover:border-rose-500 hover:text-rose-500'}`}
                >
                  Learn More
                </motion.button>
              </motion.div>
            </div>

            {/* Hero Image */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1, delay: 0.3 }}
              className="relative"
            >
              <div className="relative rounded-3xl overflow-hidden shadow-2xl">
                <img
                  src="/uploads/hero-women.jpg"
                  alt="Women empowered by She Can Foundation"
                  className="w-full h-[400px] sm:h-[500px] object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />
                <div className="absolute bottom-6 left-6 right-6">
                  <div className={`backdrop-blur-md rounded-2xl p-4 ${darkMode ? 'bg-gray-900/60' : 'bg-white/70'}`}>
                    <p className={`text-sm font-medium ${darkMode ? 'text-gray-200' : 'text-gray-800'}`}>
                      "Every woman deserves the chance to write her own story."
                    </p>
                    <p className={`text-xs mt-1 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>— She Can Foundation</p>
                  </div>
                </div>
              </div>
              {/* Decorative elements */}
              <div className="absolute -top-4 -right-4 w-24 h-24 bg-gradient-to-br from-rose-400 to-orange-300 rounded-2xl -z-10 opacity-60" />
              <div className="absolute -bottom-4 -left-4 w-20 h-20 bg-gradient-to-br from-pink-400 to-rose-300 rounded-2xl -z-10 opacity-60" />
            </motion.div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className={`relative py-24 ${darkMode ? 'bg-gray-900/50' : 'bg-gray-50/80'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: '-100px' }}
              transition={{ duration: 0.8 }}
            >
              <span className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold uppercase mb-4 ${darkMode ? 'bg-rose-500/10 text-rose-400' : 'bg-rose-50 text-rose-600'}`}>
                About Us
              </span>
              <h2 className={`text-3xl sm:text-4xl font-bold mb-6 leading-tight ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                Building a World Where
                <span className="bg-gradient-to-r from-rose-500 to-orange-400 bg-clip-text text-transparent"> Every Woman Thrives</span>
              </h2>
              <p className={`text-lg mb-6 leading-relaxed ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                She Can Foundation was born from a simple yet powerful belief — that every woman and girl, regardless of her background, deserves the opportunity to learn, grow, and lead. Founded in 2018, we have been working tirelessly at the grassroots level to break down barriers and create pathways for women's empowerment.
              </p>
              <p className={`text-lg mb-8 leading-relaxed ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                Our holistic approach combines education, vocational training, health awareness, and community building to ensure lasting change. We don't just empower individuals — we transform entire communities by investing in the potential of women.
              </p>
              <div className="grid grid-cols-2 gap-4">
                {[
                  { icon: BookOpen, label: 'Education & Literacy' },
                  { icon: Users, label: 'Skill Development' },
                  { icon: Heart, label: 'Health & Wellness' },
                  { icon: Globe, label: 'Community Building' },
                ].map(({ icon: Icon, label }) => (
                  <div key={label} className={`flex items-center gap-3 p-3 rounded-xl ${darkMode ? 'bg-gray-800/50' : 'bg-white'}`}>
                    <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-rose-500 to-orange-400 flex items-center justify-center flex-shrink-0">
                      <Icon className="w-5 h-5 text-white" />
                    </div>
                    <span className={`text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>{label}</span>
                  </div>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: '-100px' }}
              transition={{ duration: 0.8 }}
              className="relative"
            >
              <div className={`rounded-3xl p-8 ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-xl`}>
                <div className="space-y-6">
                  {[
                    { title: 'Our Mission', desc: 'To empower women and girls through education, skills, and community support, enabling them to become self-reliant and confident leaders of change.' },
                    { title: 'Our Vision', desc: 'A world where every woman has equal access to opportunities, where her potential is not limited by gender, and where she can dream without boundaries.' },
                    { title: 'Our Values', desc: 'Compassion, Equality, Resilience, and Community. We believe in lifting each other up and creating spaces where every voice matters.' },
                  ].map((item, i) => (
                    <motion.div
                      key={item.title}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: i * 0.15 }}
                      className={`p-5 rounded-2xl ${darkMode ? 'bg-gray-700/50' : 'bg-gray-50'}`}
                    >
                      <h3 className={`font-bold text-lg mb-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>{item.title}</h3>
                      <p className={`text-sm leading-relaxed ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>{item.desc}</p>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Stats / Impact Section */}
      <section id="impact" className="relative py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            className="text-center mb-16"
          >
            <span className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold uppercase mb-4 ${darkMode ? 'bg-rose-500/10 text-rose-400' : 'bg-rose-50 text-rose-600'}`}>
              Our Impact
            </span>
            <h2 className={`text-3xl sm:text-4xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              Numbers That Tell Our Story
            </h2>
          </motion.div>

          <div id="stats-section" className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { value: counters.women, label: 'Women Empowered', suffix: '+', icon: Users },
              { value: counters.communities, label: 'Communities Reached', suffix: '+', icon: Globe },
              { value: counters.programs, label: 'Active Programs', suffix: '', icon: BookOpen },
              { value: counters.states, label: 'States Covered', suffix: '', icon: Heart },
            ].map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                whileHover={{ y: -8, boxShadow: '0 20px 40px rgba(244, 63, 94, 0.15)' }}
                className={`text-center p-8 rounded-3xl transition-colors ${darkMode ? 'bg-gray-800/80 hover:bg-gray-800' : 'bg-white hover:bg-rose-50/50'} shadow-lg`}
              >
                <div className="w-14 h-14 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-rose-500 to-orange-400 flex items-center justify-center">
                  <stat.icon className="w-7 h-7 text-white" />
                </div>
                <div className={`text-3xl sm:text-4xl font-extrabold mb-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  {stat.value.toLocaleString()}{stat.suffix}
                </div>
                <div className={`text-sm font-medium ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Join / CTA Section */}
      <section id="join" className={`relative py-24 ${darkMode ? 'bg-gray-900/50' : 'bg-gray-50/80'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            className={`relative overflow-hidden rounded-3xl p-12 sm:p-16 text-center ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-2xl`}
          >
            {/* Decorative gradient */}
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-rose-500 via-pink-500 to-orange-400" />
            <div className="absolute -top-20 -right-20 w-60 h-60 bg-gradient-to-br from-rose-500/10 to-orange-400/10 rounded-full blur-3xl" />
            <div className="absolute -bottom-20 -left-20 w-60 h-60 bg-gradient-to-br from-pink-500/10 to-rose-400/10 rounded-full blur-3xl" />

            <div className="relative z-10">
              <motion.div
                initial={{ scale: 0 }}
                whileInView={{ scale: 1 }}
                viewport={{ once: true }}
                className="w-20 h-20 mx-auto mb-8 rounded-3xl bg-gradient-to-br from-rose-500 to-orange-400 flex items-center justify-center"
              >
                <Heart className="w-10 h-10 text-white" fill="white" />
              </motion.div>

              <h2 className={`text-3xl sm:text-4xl font-bold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                Be Part of the Change
              </h2>
              <p className={`text-lg mb-8 max-w-2xl mx-auto ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                Subscribe to our newsletter and stay updated on our programs, success stories, and ways you can make a difference in a woman's life.
              </p>

              <AnimatePresence mode="wait">
                {!subscribed ? (
                  <motion.div
                    key="form"
                    initial={{ opacity: 1 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto"
                  >
                    <input
                      type="email"
                      placeholder="Enter your email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handleSubscribe()}
                      className={`flex-1 px-5 py-3.5 rounded-xl border-2 text-base font-medium outline-none transition-colors ${darkMode ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-500 focus:border-rose-500' : 'bg-gray-50 border-gray-200 text-gray-900 placeholder-gray-400 focus:border-rose-500'}`}
                    />
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={handleSubscribe}
                      disabled={subscribing}
                      className="px-8 py-3.5 bg-gradient-to-r from-rose-500 to-orange-400 text-white font-semibold rounded-xl shadow-lg shadow-rose-500/25 hover:shadow-rose-500/40 transition-shadow disabled:opacity-60 whitespace-nowrap"
                    >
                      {subscribing ? 'Subscribing...' : 'Subscribe'}
                    </motion.button>
                  </motion.div>
                ) : (
                  <motion.div
                    key="success"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`inline-flex items-center gap-3 px-6 py-4 rounded-2xl ${darkMode ? 'bg-green-500/10 text-green-400' : 'bg-green-50 text-green-700'}`}
                  >
                    <Heart className="w-5 h-5" fill="currentColor" />
                    <span className="font-semibold">Thank you for subscribing!</span>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className={`py-16 ${darkMode ? 'bg-gray-950 border-gray-800' : 'bg-gray-900'} border-t`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-12 mb-12">
            <div>
              <div className="flex items-center gap-2.5 mb-4">
                <img
                  src="/logo.png"
                  alt="She Can Foundation Logo"
                  className="w-10 h-10 rounded-xl object-contain"
                />
                <span className="font-bold text-lg text-white">She Can Foundation</span>
              </div>
              <p className="text-gray-400 text-sm leading-relaxed">
                Empowering women and girls across India through education, skill development, and community support since 2018.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-white mb-4">Quick Links</h3>
              <div className="space-y-2">
                {['About Us', 'Our Impact', 'Get Involved', 'Contact'].map((link) => (
                  <button
                    key={link}
                    className="block text-gray-400 text-sm hover:text-rose-400 transition-colors"
                    onClick={() => {
                      const map: Record<string, string> = { 'About Us': 'about', 'Our Impact': 'impact', 'Get Involved': 'join', 'Contact': 'hero' };
                      scrollTo(map[link] || 'hero');
                    }}
                  >
                    {link}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <h3 className="font-semibold text-white mb-4">Contact</h3>
              <div className="space-y-2 text-gray-400 text-sm">
                <p>New Delhi, India</p>
                <p>hello@shecanfoundation.org</p>
                <p>+91 98765 43210</p>
              </div>
            </div>
          </div>
          <div className="border-t border-gray-800 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-gray-500 text-sm">
              © {new Date().getFullYear()} She Can Foundation. All rights reserved.
            </p>
            <p className="text-gray-500 text-sm flex items-center gap-1">
              Made with <Heart className="w-3 h-3 text-rose-500" fill="currentColor" /> for a better world
            </p>
          </div>
        </div>
      </footer>

      {/* Scroll to top */}
      <AnimatePresence>
        {showScrollTop && (
          <motion.button
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0 }}
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="fixed bottom-6 right-6 z-50 w-12 h-12 bg-gradient-to-br from-rose-500 to-orange-400 text-white rounded-full shadow-lg shadow-rose-500/25 flex items-center justify-center"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <ArrowUp className="w-5 h-5" />
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
}

export default App;
