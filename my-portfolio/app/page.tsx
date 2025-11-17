"use client"

import React, { useState, useEffect, useRef, Suspense } from 'react';
import { motion, useScroll, useTransform, useInView, AnimatePresence } from 'framer-motion';
import { 
  Github, Linkedin, Mail, ExternalLink, ChevronDown, 
  Code2, Server, Cloud, Database, Terminal, Menu, X,
  MapPin, Calendar, Award, TrendingUp, Zap, Box,
  ArrowRight, Coffee, Download
} from 'lucide-react';

// Custom Hook for scroll animations
const useScrollAnimation = () => {
  const [ref, inView] = [useRef(null), true];
  const controls = {
    visible: { opacity: 1, y: 0 },
    hidden: { opacity: 0, y: 50 }
  };
  
  return [ref, inView, controls];
};

// Animated Counter Component
const AnimatedCounter = ({ end, duration = 2000, suffix = "" }) => {
  const [count, setCount] = useState(0);
  const [ref, inView] = [useRef(null), true];

  useEffect(() => {
    if (inView) {
      let start = 0;
      const increment = end / (duration / 16);
      const timer = setInterval(() => {
        start += increment;
        if (start >= end) {
          setCount(end);
          clearInterval(timer);
        } else {
          setCount(Math.floor(start));
        }
      }, 16);
      return () => clearInterval(timer);
    }
  }, [inView, end, duration]);

  return <span ref={ref}>{count}{suffix}</span>;
};

// Magnetic Button Component
const MagneticButton = ({ children, onClick, variant = "primary" }) => {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const buttonRef = useRef(null);

  const handleMouseMove = (e) => {
    if (!buttonRef.current) return;
    const rect = buttonRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left - rect.width / 2) * 0.3;
    const y = (e.clientY - rect.top - rect.height / 2) * 0.3;
    setPosition({ x, y });
  };

  const handleMouseLeave = () => {
    setPosition({ x: 0, y: 0 });
  };

  const baseClasses = "relative px-8 py-4 rounded-lg font-semibold transition-all duration-300 overflow-hidden group";
  const variantClasses = {
    primary: "bg-gradient-to-r from-indigo-500 to-purple-600 text-white hover:shadow-lg hover:shadow-indigo-500/50",
    secondary: "bg-gray-800 text-white border border-gray-700 hover:border-indigo-500 hover:shadow-lg hover:shadow-indigo-500/20"
  };

  return (
    <motion.button
      ref={buttonRef}
      className={`${baseClasses} ${variantClasses[variant]}`}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      animate={{ x: position.x, y: position.y }}
      transition={{ type: "spring", stiffness: 150, damping: 15 }}
      onClick={onClick}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      <span className="relative z-10 flex items-center gap-2">
        {children}
      </span>
      <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
    </motion.button>
  );
};

// Navbar Component
const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = ['Home', 'Projects', 'Skills', 'Experience', 'Contact'];

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? 'bg-gray-900/95 backdrop-blur-lg shadow-lg' : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        <motion.div
          className="text-2xl font-bold bg-gradient-to-r from-indigo-500 to-purple-600 bg-clip-text text-transparent"
          whileHover={{ scale: 1.05 }}
        >
          AS
        </motion.div>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-8">
          {navItems.map((item, index) => (
            <motion.a
              key={item}
              href={`#${item.toLowerCase()}`}
              className="text-gray-300 hover:text-white transition-colors relative group"
              whileHover={{ y: -2 }}
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              {item}
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-indigo-500 to-purple-600 group-hover:w-full transition-all duration-300" />
            </motion.a>
          ))}
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden text-white"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-gray-900 border-t border-gray-800"
          >
            {navItems.map((item) => (
              <a
                key={item}
                href={`#${item.toLowerCase()}`}
                className="block px-6 py-4 text-gray-300 hover:bg-gray-800 hover:text-white transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {item}
              </a>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
};

// Hero Section
const Hero = () => {
  const { scrollY } = useScroll();
  const y = useTransform(scrollY, [0, 500], [0, 150]);
  const opacity = useTransform(scrollY, [0, 300], [1, 0]);

  return (
    <section id="home" className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-indigo-900/20 to-purple-900/20">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0icmdiYSgyNTUsMjU1LDI1NSwwLjAzKSIgc3Ryb2tlLXdpZHRoPSIxIi8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2dyaWQpIi8+PC9zdmc+')] opacity-20" />
      </div>

      <motion.div
        style={{ y, opacity }}
        className="relative z-10 text-center px-6 max-w-5xl mx-auto"
      >
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="mb-6"
        >
          <span className="text-indigo-400 text-lg font-mono">Hey, I'm</span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-white via-indigo-200 to-purple-400 bg-clip-text text-transparent"
        >
          Aditya Sanskar Srivastav
        </motion.h1>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="mb-8"
        >
          <h2 className="text-2xl md:text-4xl text-gray-300 mb-4">
            Backend Architect <span className="text-indigo-400">×</span> Full-Stack Creator
          </h2>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Building scalable distributed systems with <span className="text-indigo-400 font-semibold">Go</span> and crafting exceptional user experiences with <span className="text-purple-400 font-semibold">Next.js</span>
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12"
        >
          <MagneticButton>
            Explore My Work <ArrowRight size={20} />
          </MagneticButton>
          <MagneticButton variant="secondary">
            <Download size={20} /> Download Resume
          </MagneticButton>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1.2 }}
          className="flex justify-center gap-6"
        >
          {[
            { Icon: Github, href: '#', label: 'GitHub' },
            { Icon: Linkedin, href: '#', label: 'LinkedIn' },
            { Icon: Mail, href: '#', label: 'Email' },
            { Icon: Terminal, href: '#', label: 'Blog' }
          ].map(({ Icon, href, label }) => (
            <motion.a
              key={label}
              href={href}
              whileHover={{ y: -5, scale: 1.1 }}
              className="p-3 bg-gray-800/50 rounded-lg backdrop-blur-sm border border-gray-700 hover:border-indigo-500 transition-colors group"
            >
              <Icon className="text-gray-400 group-hover:text-indigo-400 transition-colors" size={24} />
            </motion.a>
          ))}
        </motion.div>

        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ repeat: Infinity, duration: 2 }}
          className="absolute bottom-10 left-1/2 transform -translate-x-1/2"
        >
          <ChevronDown className="text-gray-400" size={32} />
        </motion.div>
      </motion.div>
    </section>
  );
};

// Tech Stack Section
const TechStack = () => {
  const technologies = [
    { 
      category: 'Backend',
      skills: [
        { name: 'Go', icon: Code2, level: 95, projects: 15 },
        { name: 'gRPC', icon: Server, level: 90, projects: 12 },
        { name: 'Kafka', icon: Database, level: 85, projects: 8 },
        { name: 'Redis', icon: Zap, level: 88, projects: 10 }
      ]
    },
    {
      category: 'Frontend',
      skills: [
        { name: 'Next.js', icon: Code2, level: 92, projects: 20 },
        { name: 'TypeScript', icon: Code2, level: 94, projects: 25 },
        { name: 'React', icon: Code2, level: 93, projects: 22 },
        { name: 'Tailwind', icon: Code2, level: 90, projects: 18 }
      ]
    },
    {
      category: 'DevOps',
      skills: [
        { name: 'Docker', icon: Box, level: 91, projects: 16 },
        { name: 'Kubernetes', icon: Cloud, level: 87, projects: 11 },
        { name: 'AWS', icon: Cloud, level: 85, projects: 14 },
        { name: 'CI/CD', icon: TrendingUp, level: 89, projects: 13 }
      ]
    }
  ];

  return (
    <section className="py-20 px-6 bg-gray-900/50">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
            Tech Universe
          </h2>
          <p className="text-gray-400 text-lg">
            Technologies I use to build amazing products
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8">
          {technologies.map((tech, categoryIndex) => (
            <motion.div
              key={tech.category}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: categoryIndex * 0.2 }}
            >
              <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
                <span className="w-2 h-2 bg-indigo-500 rounded-full" />
                {tech.category}
              </h3>
              <div className="space-y-4">
                {tech.skills.map((skill, skillIndex) => (
                  <motion.div
                    key={skill.name}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: (categoryIndex * 0.2) + (skillIndex * 0.1) }}
                    whileHover={{ scale: 1.02, x: 10 }}
                    className="bg-gray-800/50 backdrop-blur-sm p-4 rounded-lg border border-gray-700 hover:border-indigo-500 transition-all cursor-pointer group"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-3">
                        <skill.icon className="text-indigo-400 group-hover:text-purple-400 transition-colors" size={20} />
                        <span className="text-white font-semibold">{skill.name}</span>
                      </div>
                      <span className="text-sm text-gray-400">{skill.projects}+ projects</span>
                    </div>
                    <div className="w-full bg-gray-700 rounded-full h-2 overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        whileInView={{ width: `${skill.level}%` }}
                        viewport={{ once: true }}
                        transition={{ duration: 1, delay: 0.5 }}
                        className="h-full bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full"
                      />
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

// Projects Section
const Projects = () => {
  const projects = [
    {
      title: 'Distributed Task Queue',
      description: 'High-performance task processing system handling 10K+ tasks/sec with Redis and Kafka for job distribution',
      tech: ['Go', 'Redis', 'Kafka', 'Docker'],
      metrics: { rps: '10K+', uptime: '99.9%', latency: '<50ms' },
      gradient: 'from-blue-500 to-cyan-500'
    },
    {
      title: 'Real-time Analytics Dashboard',
      description: 'Interactive dashboard with WebSocket streaming, processing millions of events per day',
      tech: ['Next.js', 'TypeScript', 'WebSockets', 'Go'],
      metrics: { users: '50K+', realtime: 'Yes', events: '5M/day' },
      gradient: 'from-purple-500 to-pink-500'
    },
    {
      title: 'Microservices Platform',
      description: 'Scalable microservices architecture with gRPC communication, deployed on Kubernetes',
      tech: ['Go', 'gRPC', 'Kubernetes', 'PostgreSQL'],
      metrics: { services: '15+', requests: '1M/day', nodes: '20+' },
      gradient: 'from-green-500 to-teal-500'
    },
    {
      title: 'API Gateway',
      description: 'High-performance API gateway with rate limiting, authentication, and request routing',
      tech: ['Go', 'Redis', 'Docker', 'Nginx'],
      metrics: { throughput: '50K rps', latency: '<10ms', endpoints: '100+' },
      gradient: 'from-orange-500 to-red-500'
    },
    {
      title: 'E-commerce Platform',
      description: 'Full-stack e-commerce solution with payment integration, inventory management, and analytics',
      tech: ['Next.js', 'Go', 'PostgreSQL', 'Stripe'],
      metrics: { transactions: '10K+', revenue: '$500K+', products: '5K+' },
      gradient: 'from-indigo-500 to-purple-500'
    },
    {
      title: 'DevOps Automation Suite',
      description: 'CI/CD pipeline automation with infrastructure as code and monitoring',
      tech: ['Go', 'Kubernetes', 'Terraform', 'Prometheus'],
      metrics: { deployments: '500+', uptime: '99.95%', pipelines: '50+' },
      gradient: 'from-yellow-500 to-orange-500'
    }
  ];

  return (
    <section id="projects" className="py-20 px-6">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
            Featured Projects
          </h2>
          <p className="text-gray-400 text-lg">
            Building production-grade systems that scale
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project, index) => (
            <motion.div
              key={project.title}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ y: -10 }}
              className="group relative bg-gray-800/50 backdrop-blur-sm rounded-xl overflow-hidden border border-gray-700 hover:border-transparent transition-all"
            >
              <div className={`absolute inset-0 bg-gradient-to-br ${project.gradient} opacity-0 group-hover:opacity-10 transition-opacity`} />
              
              <div className="p-6">
                <div className={`inline-block px-3 py-1 rounded-full bg-gradient-to-r ${project.gradient} mb-4`}>
                  <span className="text-white text-sm font-semibold">Featured</span>
                </div>

                <h3 className="text-xl font-bold text-white mb-3 group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-indigo-400 group-hover:to-purple-400 group-hover:bg-clip-text transition-all">
                  {project.title}
                </h3>

                <p className="text-gray-400 mb-4 leading-relaxed">
                  {project.description}
                </p>

                <div className="flex flex-wrap gap-2 mb-4">
                  {project.tech.map((tech) => (
                    <span
                      key={tech}
                      className="px-3 py-1 bg-gray-700/50 rounded-full text-xs text-gray-300 border border-gray-600"
                    >
                      {tech}
                    </span>
                  ))}
                </div>

                <div className="grid grid-cols-3 gap-2 pt-4 border-t border-gray-700">
                  {Object.entries(project.metrics).map(([key, value]) => (
                    <div key={key} className="text-center">
                      <div className="text-indigo-400 font-bold text-sm">{value}</div>
                      <div className="text-gray-500 text-xs capitalize">{key}</div>
                    </div>
                  ))}
                </div>

                <div className="flex gap-3 mt-4 pt-4 border-t border-gray-700">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="flex-1 py-2 bg-indigo-600 hover:bg-indigo-700 rounded-lg text-white text-sm font-semibold transition-colors flex items-center justify-center gap-2"
                  >
                    <Github size={16} /> GitHub
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="flex-1 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg text-white text-sm font-semibold transition-colors flex items-center justify-center gap-2"
                  >
                    <ExternalLink size={16} /> Demo
                  </motion.button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

// Experience Section
const Experience = () => {
  const experiences = [
    {
      year: '2024',
      title: 'Senior Backend Engineer',
      company: 'Tech Innovations Inc.',
      description: 'Leading the development of distributed systems handling millions of requests daily. Architected microservices infrastructure using Go and Kubernetes.',
      achievements: ['Reduced API latency by 60%', 'Scaled system to 10M+ users', 'Mentored 5 junior engineers'],
      tech: ['Go', 'Kubernetes', 'gRPC', 'PostgreSQL']
    },
    {
      year: '2023',
      title: 'Full-Stack Developer',
      company: 'Digital Solutions Ltd.',
      description: 'Built end-to-end web applications using Next.js and Go. Implemented real-time features and optimized database performance.',
      achievements: ['Delivered 15+ projects', 'Improved page load time by 40%', 'Implemented CI/CD pipelines'],
      tech: ['Next.js', 'TypeScript', 'Go', 'Redis']
    },
    {
      year: '2022',
      title: 'Backend Developer',
      company: 'StartupXYZ',
      description: 'Developed RESTful APIs and background job processing systems. Worked on database optimization and caching strategies.',
      achievements: ['Built core API infrastructure', 'Implemented job queuing system', 'Optimized database queries'],
      tech: ['Go', 'PostgreSQL', 'Redis', 'Docker']
    }
  ];

  return (
    <section id="experience" className="py-20 px-6 bg-gray-900/50">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
            Experience Timeline
          </h2>
          <p className="text-gray-400 text-lg">
            My professional journey in tech
          </p>
        </motion.div>

        <div className="relative">
          {/* Timeline Line */}
          <div className="absolute left-8 md:left-1/2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-indigo-500 via-purple-500 to-pink-500" />

          {experiences.map((exp, index) => (
            <motion.div
              key={exp.year}
              initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.2 }}
              className={`relative mb-12 ${index % 2 === 0 ? 'md:pr-1/2' : 'md:pl-1/2 md:ml-auto'} max-w-full md:max-w-[50%]`}
            >
              {/* Timeline Dot */}
              <div className="absolute left-8 md:left-1/2 top-6 w-4 h-4 bg-indigo-500 rounded-full transform -translate-x-1/2 border-4 border-gray-900" />

              <div className={`ml-16 md:ml-0 ${index % 2 === 0 ? 'md:mr-12' : 'md:ml-12'}`}>
                <motion.div
                  whileHover={{ scale: 1.02, x: index % 2 === 0 ? -5 : 5 }}
                  className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700 hover:border-indigo-500 transition-all"
                >
                  <div className="flex items-center gap-3 mb-4">
                    <div className="bg-indigo-500/20 p-2 rounded-lg">
                      <Calendar className="text-indigo-400" size={20} />
                    </div>
                    <span className="text-indigo-400 font-bold text-lg">{exp.year}</span>
                  </div>

                  <h3 className="text-2xl font-bold text-white mb-2">{exp.title}</h3>
                  <p className="text-purple-400 mb-4 flex items-center gap-2">
                    <MapPin size={16} /> {exp.company}
                  </p>

                  <p className="text-gray-400 mb-4 leading-relaxed">{exp.description}</p>

                  <div className="mb-4">
                    <h4 className="text-sm font-semibold text-gray-300 mb-2 flex items-center gap-2">
                      <Award size={16} className="text-yellow-500" /> Key Achievements:
                    </h4>
                    <ul className="space-y-1">
                      {exp.achievements.map((achievement, i) => (
                        <li key={i} className="text-gray-400 text-sm flex items-start gap-2">
                          <span className="text-indigo-400 mt-1">•</span>
                          {achievement}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {exp.tech.map((tech) => (
                      <span
                        key={tech}
                        className="px-3 py-1 bg-indigo-500/10 border border-indigo-500/30 rounded-full text-xs text-indigo-300"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </motion.div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Stats Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-6"
        >
          {[
            { label: 'Years Experience', value: 3, suffix: '+' },
            { label: 'Projects Delivered', value: 50, suffix: '+' },
            { label: 'Happy Clients', value: 30, suffix: '+' },
            { label: 'Coffee Consumed', value: 1000, suffix: '+' }
          ].map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, scale: 0.5 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="text-center p-6 bg-gray-800/30 rounded-xl border border-gray-700"
            >
              <div className="text-4xl font-bold bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent mb-2">
                <AnimatedCounter end={stat.value} suffix={stat.suffix} />
              </div>
              <div className="text-gray-400 text-sm">{stat.label}</div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

// Skills Section
const Skills = () => {
  const skillCategories = [
    {
      name: 'Languages',
      skills: ['Go', 'TypeScript', 'JavaScript', 'Python', 'SQL']
    },
    {
      name: 'Backend',
      skills: ['gRPC', 'REST APIs', 'GraphQL', 'Microservices', 'WebSockets']
    },
    {
      name: 'Frontend',
      skills: ['Next.js', 'React', 'Tailwind CSS', 'Framer Motion', 'Redux']
    },
    {
      name: 'Databases',
      skills: ['PostgreSQL', 'MongoDB', 'Redis', 'Elasticsearch', 'MySQL']
    },
    {
      name: 'DevOps',
      skills: ['Docker', 'Kubernetes', 'AWS', 'CI/CD', 'Terraform']
    },
    {
      name: 'Tools',
      skills: ['Git', 'Kafka', 'RabbitMQ', 'Prometheus', 'Grafana']
    }
  ];

  return (
    <section id="skills" className="py-20 px-6">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
            Skills Matrix
          </h2>
          <p className="text-gray-400 text-lg">
            Comprehensive technical skill set
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {skillCategories.map((category, categoryIndex) => (
            <motion.div
              key={category.name}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: categoryIndex * 0.1 }}
              className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700 hover:border-indigo-500 transition-all"
            >
              <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                <Server className="text-indigo-400" size={20} />
                {category.name}
              </h3>
              <div className="flex flex-wrap gap-2">
                {category.skills.map((skill, skillIndex) => (
                  <motion.span
                    key={skill}
                    initial={{ opacity: 0, scale: 0 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: categoryIndex * 0.1 + skillIndex * 0.05 }}
                    whileHover={{ scale: 1.1, y: -2 }}
                    className="px-4 py-2 bg-gradient-to-r from-indigo-500/20 to-purple-500/20 border border-indigo-500/30 rounded-lg text-sm text-white cursor-pointer hover:border-indigo-400 transition-all"
                  >
                    {skill}
                  </motion.span>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

// About Section
const About = () => {
  return (
    <section className="py-20 px-6 bg-gray-900/50">
      <div className="max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
            Code Philosophy
          </h2>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-8 md:p-12 border border-gray-700"
        >
          <div className="mb-8">
            <blockquote className="text-2xl md:text-3xl text-gray-300 italic leading-relaxed mb-6">
              "I believe in building systems that scale elegantly and writing code that reads like poetry."
            </blockquote>
          </div>

          <div className="grid md:grid-cols-2 gap-8 mb-8">
            <div>
              <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                <Zap className="text-yellow-500" size={24} />
                Core Principles
              </h3>
              <ul className="space-y-3">
                {[
                  'Clean Architecture Advocate',
                  'Performance Obsessed',
                  'Test-Driven Development',
                  'Continuous Learning'
                ].map((principle) => (
                  <motion.li
                    key={principle}
                    whileHover={{ x: 5 }}
                    className="text-gray-400 flex items-center gap-3"
                  >
                    <span className="w-2 h-2 bg-indigo-500 rounded-full" />
                    {principle}
                  </motion.li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                <Coffee className="text-orange-500" size={24} />
                Fun Facts
              </h3>
              <ul className="space-y-3">
                {[
                  'Vim enthusiast since 2020',
                  'Open source contributor',
                  'Coffee-driven developer',
                  'Documentation lover'
                ].map((fact) => (
                  <motion.li
                    key={fact}
                    whileHover={{ x: 5 }}
                    className="text-gray-400 flex items-center gap-3"
                  >
                    <span className="w-2 h-2 bg-purple-500 rounded-full" />
                    {fact}
                  </motion.li>
                ))}
              </ul>
            </div>
          </div>

          <div className="bg-gray-900/50 rounded-xl p-6 border border-gray-700">
            <div className="flex items-start gap-3 mb-3">
              <Terminal className="text-green-500 mt-1" size={20} />
              <div className="flex-1">
                <div className="text-green-500 font-mono text-sm mb-2">$ go run main.go</div>
                <div className="text-gray-400 font-mono text-sm space-y-1">
                  <div>&gt; Building distributed systems...</div>
                  <div>&gt; Optimizing for scale...</div>
                  <div>&gt; Crafting exceptional UX...</div>
                  <div className="text-green-500">&gt; Status: 200 OK ✓</div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

// Contact Section
const Contact = () => {
  return (
    <section id="contact" className="py-20 px-6">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
            Let's Build Something Amazing
          </h2>
          <p className="text-gray-400 text-lg mb-12">
            Open to freelance projects, full-time opportunities, and technical consulting
          </p>

          <div className="grid md:grid-cols-3 gap-6 mb-12">
            {[
              { Icon: Mail, label: 'Email', value: 'aditya@example.com', href: 'mailto:aditya@example.com' },
              { Icon: Linkedin, label: 'LinkedIn', value: '/adityasanskar', href: '#' },
              { Icon: Github, label: 'GitHub', value: '@adityasanskar', href: '#' }
            ].map(({ Icon, label, value, href }) => (
              <motion.a
                key={label}
                href={href}
                whileHover={{ y: -5, scale: 1.05 }}
                className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700 hover:border-indigo-500 transition-all block"
              >
                <Icon className="text-indigo-400 mx-auto mb-3" size={32} />
                <div className="text-white font-semibold mb-1">{label}</div>
                <div className="text-gray-400 text-sm">{value}</div>
              </motion.a>
            ))}
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <MagneticButton onClick={() => window.location.href = 'mailto:aditya@example.com'}>
              <Mail size={20} /> Send Email
            </MagneticButton>
            <MagneticButton variant="secondary">
              <Calendar size={20} /> Schedule Call
            </MagneticButton>
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            className="mt-12 p-6 bg-gradient-to-r from-indigo-500/10 to-purple-500/10 rounded-xl border border-indigo-500/30"
          >
            <h3 className="text-xl font-bold text-white mb-3">Available For</h3>
            <div className="flex flex-wrap justify-center gap-4">
              {['Freelance Projects', 'Full-time Opportunities', 'Technical Consulting', 'Open Source Collaboration'].map((item) => (
                <span
                  key={item}
                  className="px-4 py-2 bg-gray-800/50 rounded-lg text-gray-300 text-sm border border-gray-700"
                >
                  ✓ {item}
                </span>
              ))}
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

// Footer
const Footer = () => {
  return (
    <footer className="py-8 px-6 border-t border-gray-800">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="text-gray-400 text-sm">
            © 2024 Aditya Sanskar Srivastav. Built with Next.js & ❤️
          </div>
          
          <div className="flex gap-6">
            {[
              { Icon: Github, href: '#' },
              { Icon: Linkedin, href: '#' },
              { Icon: Mail, href: '#' },
              { Icon: Terminal, href: '#' }
            ].map(({ Icon, href }) => (
              <motion.a
                key={href}
                href={href}
                whileHover={{ y: -3, scale: 1.1 }}
                className="text-gray-400 hover:text-indigo-400 transition-colors"
              >
                <Icon size={20} />
              </motion.a>
            ))}
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="mt-6 text-center"
        >
          <p className="text-gray-500 text-xs">
            Designed & Built by Aditya • Powered by Go, Next.js, TypeScript & Tailwind CSS
          </p>
        </motion.div>
      </div>
    </footer>
  );
};

// Main App Component
export default function Portfolio() {
  return (
    <div className="bg-gray-900 min-h-screen text-white overflow-x-hidden">
      <Navbar />
      <Hero />
      <TechStack />
      <Projects />
      <Experience />
      <Skills />
      <About />
      <Contact />
      <Footer />
    </div>
  );
}