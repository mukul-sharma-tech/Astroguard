"use client";

import React, { useState, useEffect, useRef, useMemo } from 'react';
// Added next/image for optimized images
import Image from 'next/image'; 
import { Scene, PerspectiveCamera, WebGLRenderer, TextureLoader, CircleGeometry, MeshBasicMaterial, Mesh, BufferGeometry, Float32BufferAttribute, PointsMaterial, Points, Clock } from 'three';
// FIX 1: Removed 'Briefcase' and 'MapPin' as they were unused.
import { ChevronRight, X, Users, Home, Instagram, Linkedin, Mail, Calendar, Lightbulb, Info, Rocket, Filter, Brain, Globe, Smartphone, Code, ExternalLink, Github, Eye, Target } from 'lucide-react';

//================================================================//
//  0. DATA
//================================================================//
const projectsData = [
  // Using a real image URL for demonstration purposes
  { id: 1, title: 'AI-Powered Learning Assistant', description: 'An interactive AI assistant to help students with their studies, providing real-time answers and resources.', image: '/images/project-ai.jpg', category: 'AI', technologies: ['Python', 'TensorFlow', 'NLP', 'React'], liveUrl: '#', githubUrl: '#', status: 'In Development' },
  { id: 2, title: 'Society Alumni Portal', description: 'A web platform to connect current society members with alumni for mentorship and networking.', image: '/images/project-web.jpg', category: 'Web', technologies: ['Next.js', 'Firebase', 'Tailwind CSS', 'Node.js'], liveUrl: '#', githubUrl: '#', status: 'Completed' },
  { id: 3, title: 'Campus Event Navigator', description: 'A mobile app to help students find and navigate to events happening on campus.', image: '/images/project-mobile.jpg', category: 'Mobile', technologies: ['React Native', 'Expo', 'Google Maps API'], liveUrl: '#', githubUrl: '#', status: 'Planning' },
  { id: 4, title: 'Code-Collab Platform', description: 'A real-time collaborative coding platform for hackathons and team projects.', image: null, category: 'Web', technologies: ['React', 'WebSockets', 'Docker', 'MongoDB'], liveUrl: '#', githubUrl: '#', status: 'Completed' },
];

const eventsData = [
  { id: 1, title: 'Hackathon 2025: Code for Good', description: 'A 24-hour hackathon focused on building solutions for social and environmental challenges.', date: 'Oct 18-19', year: '2025', type: 'Hackathon' },
  { id: 2, title: 'Intro to Machine Learning Workshop', description: 'A hands-on workshop covering the fundamentals of machine learning with Python.', date: 'Sep 15', year: '2025', type: 'Workshop' },
  { id: 3, title: 'Tech Talk with Industry Leader', description: 'An inspiring talk from a guest speaker from a leading tech company.', date: 'Aug 22', year: '2025', type: 'Seminar' },
  { id: 4, title: 'Annual Project Showcase 2024', description: 'Members presented their year-long projects to faculty and industry judges.', date: 'Dec 05', year: '2024', type: 'Showcase' },
  { id: 5, title: 'Web Dev Bootcamp', description: 'A week-long bootcamp covering the MERN stack for beginners.', date: 'Jun 10-15', year: '2024', type: 'Bootcamp' },
  { id: 6, title: 'UI/UX Design Principles', description: 'A workshop on the core principles of user interface and user experience design.', date: 'Mar 02', year: '2023', type: 'Workshop' }
];

const journeyData = [
  { title: "Inception of TechXtract", subtitle: "Foundation of the Society", period: "Fall 2022", type: "Milestone", description: "A group of passionate students came together to form TechXtract, with the goal of creating a hub for tech enthusiasts in the department." },
  { title: "First Annual Hackathon", subtitle: "HackaMAIT 1.0", period: "Spring 2023", type: "Event", description: "Successfully hosted our first-ever 24-hour hackathon, attracting over 100 participants from across the university." },
  { title: "Industry Collaboration", subtitle: "Partnership with TechCorp", period: "Fall 2023", type: "Partnership", description: "Established our first official industry partnership, providing members with internship opportunities and mentorship." },
  { title: "Launch of Mentorship Program", subtitle: "Connecting Seniors and Juniors", period: "Spring 2024", type: "Initiative", description: "Launched a program to connect experienced senior members with newcomers to foster knowledge sharing and community growth." },
  { title: "Expansion to 100+ Members", subtitle: "Community Growth", period: "Fall 2024", type: "Milestone", description: "Reached a major milestone, growing our community to over 100 active and passionate members." },
  { title: "Website Relaunch", subtitle: "Project WebVision", period: "Present", type: "Project", description: "Currently revamping our digital identity with a modern, dynamic, and feature-rich official website." }
];

//================================================================//
//  1. COMPONENTS
//================================================================//

const Loader = () => {
  // FIX 2: Typed the ref to let TypeScript know it's a div element.
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const currentMount = mountRef.current;
    if (!currentMount) return;
    const scene = new Scene();
    // This resolves the `currentMount.clientWidth` type error.
    const camera = new PerspectiveCamera(75, currentMount.clientWidth / currentMount.clientHeight, 0.1, 1000);
    camera.position.z = 5;
    const renderer = new WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(currentMount.clientWidth, currentMount.clientHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    currentMount.appendChild(renderer.domElement);
    const textureLoader = new TextureLoader();
    // Make sure 'logo.jpeg' is in your /public directory
    const logoTexture = textureLoader.load('/logo.jpeg');
    const logoGeometry = new CircleGeometry(1.5, 64);
    const logoMaterial = new MeshBasicMaterial({ map: logoTexture });
    const logoMesh = new Mesh(logoGeometry, logoMaterial);
    scene.add(logoMesh);
    const animate = () => { requestAnimationFrame(animate); renderer.render(scene, camera); };
    animate();
    const handleResize = () => {
      // Added a check for currentMount to be safe
      if (currentMount) {
        camera.aspect = currentMount.clientWidth / currentMount.clientHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(currentMount.clientWidth, currentMount.clientHeight);
      }
    };
    window.addEventListener('resize', handleResize);
    const speakWelcomeMessage = () => { if ('speechSynthesis' in window) { const utterance = new SpeechSynthesisUtterance("Welcome to the world of TechXtract"); utterance.rate = 0.9; utterance.pitch = 1.1; window.speechSynthesis.speak(utterance); } };
    const speechTimeout = setTimeout(speakWelcomeMessage, 1000);
    return () => {
      window.removeEventListener('resize', handleResize);
      if (currentMount && renderer.domElement) { currentMount.removeChild(renderer.domElement); }
      clearTimeout(speechTimeout);
      window.speechSynthesis.cancel();
    };
  }, []);

  return (
    <div className="relative flex flex-col items-center justify-center w-screen h-screen bg-black overflow-hidden">
      <div ref={mountRef} className="w-full h-full absolute top-0 left-0" />
      <div className="absolute bottom-20 flex flex-col items-center">
        <div className="w-16 h-16 border-4 border-dashed rounded-full animate-spin border-cyan-400"></div>
        <p className="text-white text-lg mt-4 font-mono">Initializing...</p>
      </div>
    </div>
  );
};

const AnimatedBackground = () => {
  // FIX 2 (cont.): Typed this ref as well.
  const mountRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const currentMount = mountRef.current;
    if (!currentMount) return;
    const scene = new Scene();
    const camera = new PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 5;
    const renderer = new WebGLRenderer({ alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    currentMount.appendChild(renderer.domElement);
    const starVertices = [];
    for (let i = 0; i < 10000; i++) {
      const x = (Math.random() - 0.5) * 2000;
      const y = (Math.random() - 0.5) * 2000;
      const z = (Math.random() - 0.5) * 2000;
      starVertices.push(x, y, z);
    }
    const starGeometry = new BufferGeometry();
    starGeometry.setAttribute('position', new Float32BufferAttribute(starVertices, 3));
    const starMaterial = new PointsMaterial({ color: 0x00c5ce, size: 0.7, transparent: true });
    const stars = new Points(starGeometry, starMaterial);
    scene.add(stars);
    let mouseX = 0; let mouseY = 0;
    const onMouseMove = (event: MouseEvent) => { mouseX = (event.clientX / window.innerWidth) * 2 - 1; mouseY = -(event.clientY / window.innerHeight) * 2 + 1; };
    document.addEventListener('mousemove', onMouseMove);
    // Use Three.js Clock for smoother animation
    const clock = new Clock();
    const animate = () => {
        requestAnimationFrame(animate);
        stars.rotation.y = clock.getElapsedTime() * 0.1;
        camera.position.x += (mouseX * 0.5 - camera.position.x) * 0.02;
        camera.position.y += (mouseY * 0.5 - camera.position.y) * 0.02;
        camera.lookAt(scene.position);
        renderer.render(scene, camera);
    };
    animate();
    const handleResize = () => { camera.aspect = window.innerWidth / window.innerHeight; camera.updateProjectionMatrix(); renderer.setSize(window.innerWidth, window.innerHeight); };
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
      document.removeEventListener('mousemove', onMouseMove);
      if (currentMount && renderer.domElement) { currentMount.removeChild(renderer.domElement); }
    };
  }, []);
  return <div ref={mountRef} style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', zIndex: -1 }} />;
};

// Added type for props
const CircularNav = ({ onNavigate }: { onNavigate: (page: string) => void }) => {
  const [isOpen, setIsOpen] = useState(false);
  const navItems = [{ id: 'home', label: 'Home', icon: <Home size={24} /> }, { id: 'about', label: 'About', icon: <Info size={24} /> }, { id: 'team', label: 'Team', icon: <Users size={24} /> }, { id: 'projects', label: 'Projects', icon: <Lightbulb size={24} /> }, { id: 'events', label: 'Events', icon: <Calendar size={24} /> }, { id: 'journey', label: 'Journey', icon: <Rocket size={24} /> },{ id: 'contact', label: 'Contact', icon: <Mail size={24} /> }];
  const handleNavClick = (page: string) => { setIsOpen(false); setTimeout(() => { onNavigate(page); }, 700); };
  const radius = 150;
  return (
    <>
      <style>{`.nav-item-container{transition:all .5s cubic-bezier(.68,-.55,.27,1.55)}.nav-item-button{transition:background-color .3s,box-shadow .3s,transform .3s;box-shadow:0 0 5px #0ff,0 0 10px #0ff,0 0 20px #0ff}.nav-item-button:hover{background-color:rgba(0,255,255,.9);transform:scale(1.15);box-shadow:0 0 10px #0ff,0 0 25px #0ff,0 0 50px #0ff}`}</style>
      <button onClick={() => setIsOpen(!isOpen)} className="fixed top-4 right-4 z-50 w-16 h-16 bg-cyan-400/80 text-black rounded-full flex items-center justify-center shadow-lg backdrop-blur-sm hover:bg-cyan-300 transition-all duration-300 transform hover:scale-110" aria-label="Open navigation menu">{isOpen ? <X size={32} /> : <ChevronRight size={32} />}</button>
      <div className={`fixed inset-0 bg-black/50 backdrop-blur-sm z-30 transition-opacity duration-500 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`} onClick={() => setIsOpen(false)} />
      <div className="fixed inset-0 flex items-center justify-center z-40 pointer-events-none">
        {navItems.map((item, index) => {
          const angle = (index / navItems.length) * 2 * Math.PI - (Math.PI / 2); const x = Math.cos(angle) * radius; const y = Math.sin(angle) * radius;
          return (
            <div key={item.id} className="absolute nav-item-container pointer-events-auto" style={{ transform: isOpen ? `translate(${x}px, ${y}px) scale(1)` : 'translate(0, 0) scale(0)', opacity: isOpen ? 1 : 0, transitionDelay: `${isOpen ? index * 80 : (navItems.length - index - 1) * 50}ms` }}>
              <button onClick={() => handleNavClick(item.id)} className="nav-item-button w-24 h-24 bg-cyan-500/80 text-white rounded-full flex flex-col items-center justify-center text-center shadow-xl backdrop-blur-sm"> {item.icon} <span className="text-sm mt-1 font-semibold">{item.label}</span></button>
            </div>
          );
        })}
      </div>
    </>
  );
};

// Added types for button props
interface ButtonProps {
  children: React.ReactNode;
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
  disabled?: boolean;
  variant?: 'default' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  type?: 'button' | 'submit' | 'reset';
}

const Button: React.FC<ButtonProps> = ({ children, onClick, disabled, variant = 'default', size = 'md', className = '', type = 'button' }) => {
  const baseStyle = "inline-flex items-center justify-center rounded-md font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none";
  const sizeStyles = { sm: "px-3 py-1.5 text-xs", md: "px-4 py-2 text-sm", lg: "px-6 py-3 text-base", };
  const variantStyles = { default: "bg-cyan-500 text-black hover:bg-cyan-400", outline: "border border-cyan-500 bg-transparent hover:bg-cyan-500/10", };
  return (<button type={type} onClick={onClick} disabled={disabled} className={`${baseStyle} ${sizeStyles[size]} ${variantStyles[variant]} ${className}`}>{children}</button>);
}

//================================================================//
//  2. PAGES
//================================================================//

const HomePage = () => (
  <div className="w-full text-white">
    <style>{`@keyframes fade-in-down{0%{opacity:0;transform:translateY(-20px)}100%{opacity:1;transform:translateY(0)}}@keyframes fade-in-up{0%{opacity:0;transform:translateY(20px)}100%{opacity:1;transform:translateY(0)}}.animate-fade-in-down{animation:fade-in-down 1s ease-out forwards}.animate-fade-in-up{animation:fade-in-up 1s ease-out .5s forwards}`}</style>
    <header className="h-screen bg-cover bg-center flex items-center justify-center relative" style={{ backgroundImage: "url('https://plus.unsplash.com/premium_photo-1712225701850-d34b3141b1a0?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=1170')" }}>
      <div className="absolute inset-0 bg-black/60"></div>
      <div className="relative z-10 text-center p-4">
        <h1 className="text-5xl md:text-7xl font-bold mb-4 tracking-tight animate-fade-in-down">TechXtract</h1>
        <p className="text-xl md:text-2xl text-cyan-300 animate-fade-in-up">Innovation, Collaboration, Creativity</p>
      </div>
    </header>
    <section className="relative py-20 px-4 md:px-8 bg-black/50 backdrop-blur-sm">
      <div className="max-w-4xl mx-auto text-center"><h2 className="text-4xl font-bold mb-6 text-cyan-400">Who We Are</h2><p className="text-lg text-gray-300 leading-relaxed">TechXtract is the official technology society of our department, serving as a dynamic hub for students passionate about engineering and innovation. We foster a collaborative environment where creativity thrives, ideas are born, and projects come to life. Our mission is to bridge the gap between theoretical knowledge and practical application, empowering members to become the next generation of tech leaders.</p></div>
    </section>
  </div>
);

const AboutPage = () => {
  const sections = [{ icon: <Eye className="h-12 w-12 text-cyan-400 mb-4" />, title: "Our Vision", text: "To be a leading student-run technology society that fosters a culture of innovation, continuous learning, and technical excellence, recognized for creating impactful solutions and nurturing future tech leaders." }, { icon: <Target className="h-12 w-12 text-cyan-400 mb-4" />, title: "Our Mission", text: "To provide a dynamic platform for students to explore, learn, and collaborate on cutting-edge technologies. We aim to organize workshops, host competitions, and build real-world projects that solve meaningful problems." }, { icon: <Rocket className="h-12 w-12 text-cyan-400 mb-4" />, title: "Our Goals", text: "To cultivate a strong community of tech enthusiasts, facilitate skill development in emerging technologies, encourage inter-disciplinary collaboration, and connect students with industry professionals and opportunities." }];
  return (
    <div className="w-full min-h-screen text-white p-8 pt-24">
      <div className="max-w-6xl mx-auto"><h1 className="text-5xl font-bold text-center mb-16 text-cyan-400">About TechXtract</h1><div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-center">{sections.map((section, index) => (<div key={index} className="glass-card p-8 flex flex-col items-center">{section.icon}<h2 className="text-3xl font-bold mb-4 text-cyan-300">{section.title}</h2><p className="text-gray-300 leading-relaxed">{section.text}</p></div>))}</div></div>
    </div>
  );
};

const TeamPage = () => {
  const teamMembers = [
    { name: 'Aditya Srivastav', role: 'President', img: 'https://placehold.co/400x400/000000/FFFFFF?text=A' },
    { name: 'Gauri', role: 'Vice President', img: 'https://placehold.co/400x400/1a1a1a/FFFFFF?text=G' },
    { name: 'Gagandeep Singh', role: 'Social Media Head', img: 'https://placehold.co/400x400/333333/FFFFFF?text=GS' },
    { name: 'Prateek Agarwal', role: 'Operations Head', img: 'https://placehold.co/400x400/4d4d4d/FFFFFF?text=P' },
    { name: 'Ishan Mishra', role: 'Graphics Head', img: 'https://placehold.co/400x400/666666/FFFFFF?text=I' },
    { name: 'Sarvagya Joshi', role: 'Tech Head', img: 'https://placehold.co/400x400/808080/FFFFFF?text=S' },
    { name: 'Hitesh Tyagi', role: 'PR Head', img: 'https://placehold.co/400x400/000000/FFFFFF?text=H' },
    { name: 'Yaniya', role: 'Frontend Lead', img: 'https://placehold.co/400x400/1a1a1a/FFFFFF?text=Y' },
    { name: 'Manan Wadhwa', role: 'AI/ML Head', img: 'https://placehold.co/400x400/333333/FFFFFF?text=M' },
    { name: 'Pratham Gupta', role: 'Backend Lead', img: 'https://placehold.co/400x400/4d4d4d/FFFFFF?text=PG' },
    { name: 'Tanuj Kumar', role: 'Social Media Co-Head', img: 'https://placehold.co/400x400/666666/FFFFFF?text=T' },
    { name: 'Saksham Sonker', role: 'Graphics Co-Head', img: 'https://placehold.co/400x400/808080/FFFFFF?text=SS' }
  ];
  return (
    <div className="w-full min-h-screen text-white p-8 pt-24">
      <div className="max-w-6xl mx-auto"><h1 className="text-5xl font-bold text-center mb-12 text-cyan-400">Meet The Team</h1><div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">{teamMembers.map((member, index) => (<div key={index} className="glass-card p-6 text-center transform hover:scale-105 transition-transform duration-300">
        {/* FIX 3: Replaced <img> with next/image's <Image> component for optimization */}
        <Image src={member.img} alt={member.name} width={128} height={128} className="rounded-full mx-auto mb-4 border-4 border-cyan-500" />
        <h3 className="text-2xl font-semibold">{member.name}</h3>
        <p className="text-cyan-400">{member.role}</p>
        </div>))}</div></div>
    </div>
  );
};

const ProjectsPage = () => {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const categories = ['All', 'AI', 'Web', 'Mobile'];
  const filteredProjects = useMemo(() => { if (selectedCategory === 'All') return projectsData; return projectsData.filter((project) => project.category === selectedCategory); }, [selectedCategory]);
  const getStatusColor = (status: string) => { switch (status) { case 'Completed': return 'text-green-400 bg-green-400/10'; case 'In Development': return 'text-blue-400 bg-blue-400/10'; case 'Planning': return 'text-purple-400 bg-purple-400/10'; default: return 'text-gray-400 bg-gray-400/10'; } };

  // Typed the 'project' prop for the card component
  const ProjectCard = ({ project }: { project: typeof projectsData[0] }) => (
    <div className="glass-card p-6 group h-full flex flex-col hover:border-cyan-400 transition-all duration-300">
      <div className="relative overflow-hidden rounded-lg mb-4 aspect-video flex items-center justify-center bg-black/30">
        {project.image ? 
          // FIX 3 (cont.): Replaced <img> with <Image> using the 'fill' prop.
          <Image src={project.image} alt={project.title} fill className="object-cover rounded-lg transition-transform duration-300 group-hover:scale-110" /> 
          : <div className="text-5xl text-white/20">{project.category === 'AI' ? <Brain /> : project.category === 'Web' ? <Globe /> : project.category === 'Mobile' ? <Smartphone /> : <Code />}</div>}
        <div className="absolute inset-0 bg-black/70 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center space-x-3">
          <Button size="sm" onClick={() => window.open(project.liveUrl, '_blank')} disabled={!project.liveUrl || project.liveUrl === '#'}><ExternalLink className="h-3 w-3 mr-1" /> Live</Button>
          <Button size="sm" variant="outline" onClick={() => window.open(project.githubUrl, '_blank')} disabled={!project.githubUrl || project.githubUrl === '#'}><Github className="h-3 w-3 mr-1" /> Code</Button>
        </div>
      </div>
      <div className="space-y-3 flex-1 flex flex-col">
        <div className="flex items-start justify-between"><h3 className="font-bold text-lg text-white line-clamp-2">{project.title}</h3><span className={`text-xs px-2 py-1 rounded-full whitespace-nowrap ${getStatusColor(project.status)}`}>{project.status}</span></div>
        <p className="text-gray-400 text-sm leading-relaxed line-clamp-3 flex-1">{project.description}</p>
        <div className="flex flex-wrap gap-1 pt-2">{project.technologies.slice(0, 4).map((tech, i) => (<span key={i} className="px-2 py-1 text-xs rounded-md bg-cyan-400/10 text-cyan-300 border border-cyan-400/20">{tech}</span>))}</div>
      </div>
    </div>
  );

  return (
    <section id="projects" className="min-h-screen text-white p-8 pt-24">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16"><h1 className="text-5xl font-bold mb-4 text-cyan-400">Our Projects</h1><p className="text-lg text-gray-300 max-w-3xl mx-auto">A showcase of our work in AI, Web Development, and other innovative domains.</p></div>
        <div className="flex justify-center space-x-2 mb-12">{categories.map((category) => (<Button key={category} variant={selectedCategory === category ? 'default' : 'outline'} onClick={() => setSelectedCategory(category)}><Filter className="h-4 w-4 mr-2" /> {category}</Button>))}</div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">{filteredProjects.map((project) => (<ProjectCard key={project.id} project={project} />))}</div>
      </div>
    </section>
  );
};

const EventsPage = () => {
  const [selectedYear, setSelectedYear] = useState('2025');
  const years = ['2025', '2024', '2023'];
  const filteredEvents = useMemo(() => eventsData.filter(event => event.year === selectedYear), [selectedYear]);
  return (
    <div className="w-full min-h-screen text-white p-8 pt-24">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-5xl font-bold text-center mb-4 text-cyan-400">Our Events</h1><p className="text-lg text-gray-300 text-center mb-12">Workshops, hackathons, and seminars we have hosted.</p>
        <div className="flex justify-center space-x-4 mb-12">{years.map(year => (<button key={year} onClick={() => setSelectedYear(year)} className={`px-6 py-2 rounded-lg font-semibold transition-all duration-300 ${selectedYear === year ? 'bg-cyan-500 text-black' : 'bg-gray-700/50 hover:bg-gray-600/50'}`}>{year}</button>))}</div>
        <div className="space-y-8">{filteredEvents.length > 0 ? filteredEvents.map(event => (<div key={event.id} className="glass-card p-6 md:flex items-center gap-6"><div className="md:w-1/4 text-center md:text-left mb-4 md:mb-0"><p className="text-2xl font-bold text-cyan-400">{event.date}</p><p className="text-gray-400">{event.year}</p></div><div className="md:w-3/4"><h2 className="text-2xl font-bold text-white mb-2">{event.title}</h2><p className="text-gray-300 mb-3">{event.description}</p><span className="px-3 py-1 text-sm rounded-full bg-cyan-400/10 text-cyan-300">{event.type}</span></div></div>)) : (<div className="text-center py-16"><p className="text-2xl text-gray-400">No events found for {selectedYear}.</p></div>)}</div>
      </div>
    </div>
  );
};

const JourneyPage = () => (
  <section id="journey" className="w-full min-h-screen text-white p-8 pt-24">
    <div className="max-w-5xl mx-auto">
      <div className="text-center mb-16"><h1 className="text-5xl font-bold text-cyan-400 mb-4">Our Journey</h1><p className="text-lg text-gray-300">A timeline of our society key milestones and achievements.</p></div>
      <div className="relative">
        <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-cyan-500 via-purple-500 to-blue-500" />
        <div className="space-y-12">{journeyData.map((item, index) => (<div key={index} className={`relative flex items-center ${index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'}`}><div className="absolute left-4 md:left-1/2 w-4 h-4 rounded-full bg-cyan-400 border-4 border-gray-900 transform -translate-x-1/2 z-10" /><div className={`w-full md:w-5/12 ml-10 md:ml-0 ${index % 2 === 0 ? 'md:pr-10' : 'md:pl-10'}`}><div className="glass-card p-6"><div className="flex items-start justify-between mb-3"><div><h3 className="text-xl font-bold text-white mb-1">{item.title}</h3><p className="text-base font-semibold text-cyan-300 mb-2">{item.subtitle}</p></div><span className="px-2 py-1 rounded-full text-xs font-medium bg-cyan-500/20 text-cyan-400 whitespace-nowrap">{item.type}</span></div><div className="flex items-center space-x-4 text-sm text-gray-400 mb-3"><span className="flex items-center"><Calendar className="mr-1.5 h-4 w-4" />{item.period}</span></div><p className="text-gray-300 text-sm">{item.description}</p></div></div></div>))}</div>
      </div>
    </div>
  </section>
);

const ContactPage = () => {
  const socialLinks = [
    { name: 'Instagram', icon: <Instagram />, url: 'https://www.instagram.com/techxtract_official/' },
    { name: 'LinkedIn', icon: <Linkedin />, url: '#' },
    { name: 'GitHub', icon: <Github />, url: '#' },
    { name: 'Email', icon: <Mail />, url: 'mailto:contact@techxtract.com' },
  ];

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    alert('Thank you for your message! We will get back to you soon.');
    e.currentTarget.reset();
  };

  return (
    <div className="w-full min-h-screen text-white p-8 pt-24">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-cyan-400 mb-4">Get In Touch</h1>
          <p className="text-lg text-gray-300">Have a question or want to collaborate? Reach out to us!</p>
        </div>
        <div className="flex justify-center gap-6 mb-16">
          {socialLinks.map(link => (
            <a key={link.name} href={link.url} target="_blank" rel="noopener noreferrer" className="w-16 h-16 glass-card rounded-full flex items-center justify-center text-cyan-400 hover:text-white hover:bg-cyan-500/50 transition-all duration-300 transform hover:scale-110 glow" >{link.icon}</a>
          ))}
        </div>
        <div className="glass-card p-8 md:p-12">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-2">Name</label>
                <input type="text" id="name" name="name" required className="w-full bg-gray-900/50 border border-gray-700 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-cyan-500" />
              </div>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">Email</label>
                <input type="email" id="email" name="email" required className="w-full bg-gray-900/50 border border-gray-700 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-cyan-500" />
              </div>
            </div>
            <div>
              <label htmlFor="message" className="block text-sm font-medium text-gray-300 mb-2">Message</label>
              <textarea id="message" name="message" rows={5} required className="w-full bg-gray-900/50 border border-gray-700 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-cyan-500"></textarea>
            </div>
            <div className="text-center">
              <Button type="submit" size="lg" className="glow">Send Message</Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};


//================================================================//
//  3. MAIN APP (Entry Point & Router)
//================================================================//
const App = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState('home');
  useEffect(() => { const timer = setTimeout(() => { setIsLoading(false); }, 4000); return () => clearTimeout(timer); }, []);
  const handleNavigate = (page: string) => { setCurrentPage(page); window.scrollTo(0, 0); };
  if (isLoading) { return <Loader />; }

  const renderPage = () => {
    switch (currentPage) {
      case 'home': return <HomePage />;
      case 'about': return <AboutPage />;
      case 'team': return <TeamPage />;
      case 'projects': return <ProjectsPage />;
      case 'events': return <EventsPage />;
      case 'journey': return <JourneyPage />;
      case 'contact': return <ContactPage />;
      default: return <HomePage />;
    }
  };

  return (
    <main>
      <style>{`body{background-color:#0a0a0a}.glass-card{background:rgba(255,255,255,.05);border-radius:16px;box-shadow:0 4px 30px rgba(0,0,0,.1);backdrop-filter:blur(5px);-webkit-backdrop-filter:blur(5px);border:1px solid rgba(255,255,255,.1)}.glow{box-shadow:0 0 5px #0ff,0 0 10px #0ff,0 0 15px #0ff}`}</style>
      <AnimatedBackground />
      <CircularNav onNavigate={handleNavigate} />
      <div className="page-content relative z-10">{renderPage()}</div>
    </main>
  );
};

export default App;
