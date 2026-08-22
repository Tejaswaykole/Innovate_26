// @ts-nocheck
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useHackathon } from '../contexts/HackathonContext';
import { motion, AnimatePresence } from 'framer-motion';
import HeroImage from '../assets/hero.png';
import Timeline from '../components/Timeline';

const faqs = [
  { question: "Can individuals without a team register?", answer: "Yes, individuals can register. However, you must form or join a team of 2–6 members before the hacking begins." },
  { question: "Is there a registration fee?", answer: "No, registration is completely free for all verified university students." },
  { question: "What if I don't have a female member?", answer: "A female member is compulsory for team validation. We encourage reaching out to the community to form inclusive teams." },
  { question: "Is physical presence required?", answer: "This is a fully virtual event so no need to come physically." }
];

function FAQItem({ question, answer, isOpen, onClick }: { question: string, answer: string, isOpen: boolean, onClick: () => void }) {
    return (
        <div className={`accordion-item bg-white border rounded-xl overflow-hidden transition-colors ${isOpen ? 'border-primary shadow-sm' : 'border-outline-variant'}`}>
            <button className="w-full flex items-center justify-between p-6 text-left" onClick={onClick}>
                <span className={`font-bold transition-colors ${isOpen ? 'text-primary' : 'text-on-surface'}`}>{question}</span>
                <motion.span 
                    animate={{ rotate: isOpen ? 180 : 0 }}
                    transition={{ duration: 0.3 }}
                    className={`material-symbols-outlined transition-colors ${isOpen ? 'text-primary' : 'text-secondary'}`} 
                    data-icon="expand_more"
                >
                    expand_more
                </motion.span>
            </button>
            <AnimatePresence>
                {isOpen && (
                    <motion.div 
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3, ease: "easeInOut" }}
                    >
                        <div className="px-6 pb-6 pt-0">
                            <p className="text-secondary text-sm leading-relaxed">{answer}</p>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}

export default function Component() {
  const { config } = useHackathon();
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  return (
    <>
      

<header className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-outline-variant px-6 md:px-10 lg:px-40 py-3">
<div className="max-w-[1280px] mx-auto flex items-center justify-between whitespace-nowrap">
<div className="flex items-center gap-4 text-on-surface">
<img src="/logo.png" alt="Innovate'26 Logo" className="h-12 object-contain" />
</div>
<div className="hidden lg:flex flex-1 justify-end gap-8 items-center">
<nav className="flex items-center gap-6">
<a className="text-on-surface text-sm font-medium hover:text-primary transition-colors" href="#about">About</a>
<a className="text-on-surface text-sm font-medium hover:text-primary transition-colors" href="#how-it-works">How It Works</a>
<a className="text-on-surface text-sm font-medium hover:text-primary transition-colors" href="#timeline">Timeline</a>
<a className="text-on-surface text-sm font-medium hover:text-primary transition-colors" href="#rules">Rules</a>
<a className="text-on-surface text-sm font-medium hover:text-primary transition-colors" href="#faqs">FAQs</a>
</nav>
<div className="flex items-center gap-4">
<Link to="/login" className="text-on-surface text-sm font-bold hover:text-primary transition-colors px-2">
    Login
</Link>
<Link to="/register" className="flex min-w-[120px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-10 px-5 bg-primary text-white text-sm font-bold tracking-[0.015em] hover:bg-primary/90 transition-all shadow-sm">
                    Register Now
                </Link>
</div>
</div>
</div>
</header>
<main className="pt-16">

<section className="relative overflow-hidden bg-white px-6 md:px-10 lg:px-40 py-20 lg:py-32">
<div className="max-w-[1280px] mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center relative z-10">
<motion.div 
    initial={{ opacity: 0, x: -50 }}
    animate={{ opacity: 1, x: 0 }}
    transition={{ duration: 0.8, ease: "easeOut" }}
    className="flex flex-col gap-8"
>
<div className="flex flex-col gap-4">
<span className="inline-flex items-center gap-2 px-3 py-1 bg-primary-fixed text-primary text-xs font-bold uppercase tracking-widest rounded-full w-fit">
<span className="relative flex h-2 w-2">
<span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
<span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
</span>
                            Live Innovation Sprint
                        </span>
<h1 className="text-on-surface text-5xl md:text-6xl font-black leading-tight tracking-tight font-display-lg">
                            INNOVATE'26: <br /><span className="text-primary">Build the Future</span>
</h1>
<p className="text-secondary text-lg md:text-xl max-w-[540px] leading-relaxed">
                            Join forces with the brightest minds in a high-intensity 24-hour innovation sprint. Identify real-world pain points and engineer the solutions of tomorrow.
                        </p>
</div>
<div className="flex flex-wrap gap-4">
<Link to="/register" className="px-8 py-4 bg-primary text-white font-bold rounded-xl hover:scale-105 transition-transform shadow-lg shadow-primary/20">
                            Register Now
                        </Link>
<button onClick={() => document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' })} className="px-8 py-4 bg-surface-container text-on-surface font-bold rounded-xl hover:bg-surface-container-high transition-colors cursor-pointer">
                            Explore Hackathon
                        </button>
</div>
</motion.div>
<motion.div 
    initial={{ opacity: 0, scale: 0.9 }}
    animate={{ opacity: 1, scale: 1 }}
    transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
    className="relative group"
>
<div className="absolute -inset-4 bg-primary/5 rounded-[2rem] blur-2xl group-hover:bg-primary/10 transition-colors"></div>
<img className="relative w-full aspect-[4/3] object-cover rounded-[2rem] shadow-2xl border border-white/50 hover:scale-[1.02] transition-transform duration-700" data-alt="A high-tech, futuristic collaborative workspace with diverse teams of university students working on laptops. The room features glowing neon accents in deep blue, large data visualization screens in the background, and a clean, high-key light mode aesthetic. The atmosphere is energetic and focused, representing a modern innovation marathon." src={HeroImage} />
</motion.div>
</div>

<div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-primary/5 to-transparent -z-10 pointer-events-none"></div>
</section>

<section className="px-6 md:px-10 lg:px-40 py-24 bg-surface" id="about">
<div className="max-w-[1280px] mx-auto">
<div className="flex flex-col gap-12">
<motion.div 
    initial={{ opacity: 0, y: 30 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.6 }}
    className="max-w-2xl"
>
<h2 className="text-primary font-bold tracking-widest uppercase text-sm mb-2">About the Hackathon</h2>
<h3 className="text-on-surface text-3xl md:text-4xl font-bold font-display-lg mb-6 leading-tight">24 Hours of Pure Innovation</h3>
<p className="text-secondary text-lg">Experience a format designed for rapid prototyping and creative problem solving. We believe the best ideas emerge under constraints of time and collaboration.</p>
</motion.div>
<div className="grid grid-cols-1 md:grid-cols-3 gap-8">
<motion.div 
    initial={{ opacity: 0, y: 30 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.6, delay: 0.1 }}
    className="p-8 bg-white rounded-2xl border border-outline-variant shadow-sm hover:-translate-y-2 hover:shadow-xl transition-all duration-300 group"
>
<div className="size-14 rounded-xl bg-primary/10 flex items-center justify-center text-primary mb-6 group-hover:bg-primary group-hover:text-white transition-colors">
<span className="material-symbols-outlined text-3xl" data-icon="timer">timer</span>
</div>
<h4 className="text-on-surface text-xl font-bold mb-3">Format</h4>
<p className="text-secondary leading-relaxed">24-hour intensive sprint from ideation to deployment. Non-stop creation and rapid iterations.</p>
</motion.div>
<motion.div 
    initial={{ opacity: 0, y: 30 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.6, delay: 0.2 }}
    className="p-8 bg-white rounded-2xl border border-outline-variant shadow-sm hover:-translate-y-2 hover:shadow-xl transition-all duration-300 group"
>
<div className="size-14 rounded-xl bg-primary/10 flex items-center justify-center text-primary mb-6 group-hover:bg-primary group-hover:text-white transition-colors">
<span className="material-symbols-outlined text-3xl" data-icon="architecture">architecture</span>
</div>
<h4 className="text-on-surface text-xl font-bold mb-3">Open Architecture</h4>
<p className="text-secondary leading-relaxed">Build on any tech stack. Whether it's Web3, AI, Cloud, or Hardware, you choose your weapons.</p>
</motion.div>
<motion.div 
    initial={{ opacity: 0, y: 30 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.6, delay: 0.3 }}
    className="p-8 bg-white rounded-2xl border border-outline-variant shadow-sm hover:-translate-y-2 hover:shadow-xl transition-all duration-300 group"
>
<div className="size-14 rounded-xl bg-primary/10 flex items-center justify-center text-primary mb-6 group-hover:bg-primary group-hover:text-white transition-colors">
<span className="material-symbols-outlined text-3xl" data-icon="ads_click">ads_click</span>
</div>
<h4 className="text-on-surface text-xl font-bold mb-3">Core Objectives</h4>
<p className="text-secondary leading-relaxed">Focus on innovation, scalability, and impact. We look for solutions that solve real-world problems.</p>
</motion.div>
</div>
</div>
</div>
</section>

<section className="px-6 md:px-10 lg:px-40 py-24 bg-white">
<div className="max-w-[1280px] mx-auto">
<div className="rounded-[2.5rem] p-10 md:p-20 relative overflow-hidden group bg-gradient-to-br from-primary to-[#0047b3] shadow-2xl shadow-primary/20">
<div className="relative z-10 flex flex-col items-center text-center max-w-3xl mx-auto gap-8">
<div className="inline-flex items-center gap-2 px-4 py-1.5 bg-white/20 backdrop-blur-md rounded-full text-white font-bold text-xs uppercase tracking-widest border border-white/30">
                            Freedom to Innovate
                        </div>
<h2 className="text-white text-4xl md:text-6xl font-black font-display-lg leading-tight">Your Problem, <br />Your Solution.</h2>
<p className="text-white/90 text-lg md:text-xl leading-relaxed">
                            We provide the platform; you provide the vision. No predefined problem statements. Identify a real-world pain point that matters to you and build the solution from scratch.
                        </p>
<button className="px-10 py-4 bg-white text-primary font-bold rounded-xl hover:scale-105 transition-transform shadow-xl shadow-black/10">Learn More About Scope</button>
</div>

<div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none overflow-hidden">
<div className="absolute -top-1/4 -right-1/4 w-[500px] h-[500px] border-[60px] border-white rounded-full"></div>
<div className="absolute -bottom-1/4 -left-1/4 w-[300px] h-[300px] border-[40px] border-white rounded-full"></div>
</div>
</div>
</div>
</section>

<section className="px-6 md:px-10 lg:px-40 py-24 bg-surface" id="how-it-works">
<div className="max-w-[1280px] mx-auto">
<div className="text-center mb-16">
<h2 className="text-primary font-bold tracking-widest uppercase text-sm mb-2">Process</h2>
<h3 className="text-on-surface text-3xl md:text-4xl font-bold font-display-lg">The 8-Step Journey</h3>
</div>
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-12">

<div className="flex flex-col gap-4 relative">
<div className="size-12 rounded-full bg-primary text-white flex items-center justify-center font-bold text-lg shadow-lg shadow-primary/20">1</div>
<h4 className="text-on-surface font-bold text-lg">Register</h4>
<p className="text-secondary text-sm">Individual sign-up via the portal to begin your journey.</p>
</div>
<div className="flex flex-col gap-4 relative">
<div className="size-12 rounded-full bg-primary text-white flex items-center justify-center font-bold text-lg shadow-lg shadow-primary/20">2</div>
<h4 className="text-on-surface font-bold text-lg">Create Team</h4>
<p className="text-secondary text-sm">Form or join a team using unique team codes.</p>
</div>
<div className="flex flex-col gap-4 relative">
<div className="size-12 rounded-full bg-primary text-white flex items-center justify-center font-bold text-lg shadow-lg shadow-primary/20">3</div>
<h4 className="text-on-surface font-bold text-lg">Choose Problem</h4>
<p className="text-secondary text-sm">Identify a gap and define your unique problem statement.</p>
</div>
<div className="flex flex-col gap-4 relative">
<div className="size-12 rounded-full bg-primary text-white flex items-center justify-center font-bold text-lg shadow-lg shadow-primary/20">4</div>
<h4 className="text-on-surface font-bold text-lg">Build</h4>
<p className="text-secondary text-sm">Collaborate and code for 24 hours to create your prototype.</p>
</div>
<div className="flex flex-col gap-4 relative">
<div className="size-12 rounded-full bg-primary text-white flex items-center justify-center font-bold text-lg shadow-lg shadow-primary/20">5</div>
<h4 className="text-on-surface font-bold text-lg">Submit</h4>
<p className="text-secondary text-sm">Upload all required files through the submission portal.</p>
</div>
<div className="flex flex-col gap-4 relative">
<div className="size-12 rounded-full bg-primary text-white flex items-center justify-center font-bold text-lg shadow-lg shadow-primary/20">6</div>
<h4 className="text-on-surface font-bold text-lg">Judging</h4>
<p className="text-secondary text-sm">Expert review panel evaluates your work based on criteria.</p>
</div>
<div className="flex flex-col gap-4 relative">
<div className="size-12 rounded-full bg-primary text-white flex items-center justify-center font-bold text-lg shadow-lg shadow-primary/20">7</div>
<h4 className="text-on-surface font-bold text-lg">Winners</h4>
<p className="text-secondary text-sm">Public announcement of the top innovation champions.</p>
</div>
<div className="flex flex-col gap-4 relative">
<div className="size-12 rounded-full bg-primary text-white flex items-center justify-center font-bold text-lg shadow-lg shadow-primary/20">8</div>
<h4 className="text-on-surface font-bold text-lg">Certificates</h4>
<p className="text-secondary text-sm">All participants receive verifiable digital recognition.</p>
</div>
</div>
</div>
</section>

<section className="px-6 md:px-10 lg:px-40 py-24 bg-white border-y border-outline-variant">
<div className="max-w-[1280px] mx-auto flex flex-col lg:flex-row items-center gap-16">
<div className="flex-1 space-y-8">
<h3 className="text-on-surface text-4xl font-bold font-display-lg leading-tight">Team Dynamics &amp; Formation</h3>
<div className="space-y-6">
<div className="flex items-start gap-4">
<div className="size-10 rounded-lg bg-primary-fixed flex items-center justify-center shrink-0">
<span className="material-symbols-outlined text-primary" data-icon="groups">groups</span>
</div>
<div>
<h5 className="font-bold text-on-surface">Size: 2–6 Members</h5>
<p className="text-secondary">Flexible team sizes to accommodate diverse skill sets and collaborative needs.</p>
</div>
</div>
<div className="flex items-start gap-4">
<div className="size-10 rounded-lg bg-primary-fixed flex items-center justify-center shrink-0">
<span className="material-symbols-outlined text-primary" data-icon="female">female</span>
</div>
<div>
<h5 className="font-bold text-on-surface">Compulsory Female Member</h5>
<p className="text-secondary">Inclusion is at our core. Every team must have at least one female participant.</p>
</div>
</div>
<div className="flex items-start gap-4">
<div className="size-10 rounded-lg bg-primary-fixed flex items-center justify-center shrink-0">
<span className="material-symbols-outlined text-primary" data-icon="stars">stars</span>
</div>
<div>
<h5 className="font-bold text-on-surface">Permanent Team Leader</h5>
<p className="text-secondary">One point of contact for all coordination throughout the event lifecycle.</p>
</div>
</div>
</div>
</div>
<div className="flex-1 w-full max-w-md">
<div className="bg-surface-container rounded-3xl p-8 border border-outline-variant">
<img className="w-full h-auto object-cover rounded-2xl shadow-sm mb-6" data-alt="A stylized minimalist illustration of a diverse group of college students—men and women—working collaboratively around a large desk with digital blueprints. The style is clean, vector-based with a soft color palette of light blue, white, and subtle orange accents, reflecting a professional and inclusive environment." src="https://lh3.googleusercontent.com/aida-public/AB6AXuDJyOIFhYDNROWboiTHRPwWSsJik4AF4IXH2F1eHvMFwSknmC1Zn7thT0Fla6mP8gkHkNq6u2lqMq2TELB0gW70kPUyuibaOapLR20595cfISJMNI5FEFAM4CKx7e5Llu_DydPQIh6lxBt8pJFL7pkyIaCv7zQWtKPbT8sf9r_XYa68eVStqrtvytbIe_gsZR2xKIElTwi7m_j-3uqcze8vn9aCrMxsm9lLTkN5SKQbg3BySMeFSMLr" />
<div className="bg-white p-6 rounded-xl border border-outline-variant">
<div className="flex justify-between items-center mb-4">
<span className="text-sm font-bold text-on-surface">Team Code #HOS-2024</span>
<span className="px-2 py-0.5 bg-primary/10 text-primary text-[10px] font-bold rounded uppercase">Active</span>
</div>
<div className="flex -space-x-3">
<div className="size-10 rounded-full border-2 border-white bg-slate-300"></div>
<div className="size-10 rounded-full border-2 border-white bg-slate-400"></div>
<div className="size-10 rounded-full border-2 border-white bg-slate-500"></div>
<div className="size-10 rounded-full border-2 border-white bg-primary text-white flex items-center justify-center text-xs font-bold">+2</div>
</div>
</div>
</div>
</div>
</div>
</section>

<section className="px-6 md:px-10 lg:px-40 py-24 bg-surface overflow-hidden" id="timeline">
<div className="max-w-[1280px] mx-auto">
<div className="mb-16">
<h3 className="text-on-surface text-3xl md:text-4xl font-bold font-display-lg">The Event Timeline</h3>
<p className="text-secondary mt-2">Mark your calendars for the innovation journey.</p>
</div>
<Timeline config={config} />
</div>
</section>

<section className="px-6 md:px-10 lg:px-40 py-24 bg-white">
<div className="max-w-4xl mx-auto">
<div>
<h3 className="text-on-surface text-4xl font-bold font-display-lg leading-tight mb-8">Submission Requirements</h3>
<p className="text-secondary text-lg mb-12">To ensure fair judging, all teams must provide a comprehensive package of their project's progress and final outcome.</p>
<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
<div className="p-5 rounded-2xl bg-surface-container-low border border-outline-variant">
<span className="material-symbols-outlined text-primary mb-3" data-icon="description">description</span>
<h6 className="font-bold text-on-surface">Title &amp; Description</h6>
<p className="text-xs text-secondary mt-1">Concise and compelling summary of the solution.</p>
</div>
<div className="p-5 rounded-2xl bg-surface-container-low border border-outline-variant">
<span className="material-symbols-outlined text-primary mb-3" data-icon="presentation_chart">mobile_code</span>
<h6 className="font-bold text-on-surface">PPT Presentation</h6>
<p className="text-xs text-secondary mt-1">Pitch deck detailing problem, solution, and scale.</p>
</div>
<div className="p-5 rounded-2xl bg-surface-container-low border border-outline-variant">
<span className="material-symbols-outlined text-primary mb-3" data-icon="code_blocks">code_blocks</span>
<h6 className="font-bold text-on-surface">GitHub Repo</h6>
<p className="text-xs text-secondary mt-1">Public repository link with all source code.</p>
</div>
<div className="p-5 rounded-2xl bg-surface-container-low border border-outline-variant">
<span className="material-symbols-outlined text-primary mb-3" data-icon="videocam">videocam</span>
<h6 className="font-bold text-on-surface">Demo Video</h6>
<p className="text-xs text-secondary mt-1">Short video with audio explanation of features.</p>
</div>
</div>
</div>
</div>
</section>

<section className="px-6 md:px-10 lg:px-40 py-24 bg-surface" id="rules">
<div className="max-w-[1280px] mx-auto">
<div className="text-center max-w-2xl mx-auto mb-16">
<h3 className="text-on-surface text-3xl md:text-4xl font-bold font-display-lg mb-4">Rules &amp; Guidelines</h3>
<p className="text-secondary">Integrity and sportsmanship are the foundation of Innovate26.</p>
</div>
<div className="grid grid-cols-1 md:grid-cols-3 gap-8">
<div className="space-y-6">
<div className="flex items-center gap-3">
<div className="size-8 rounded bg-primary/10 flex items-center justify-center text-primary">
<span className="material-symbols-outlined text-xl" data-icon="groups_2">groups_2</span>
</div>
<h4 className="text-xl font-bold text-on-surface">Team Rules</h4>
</div>
<ul className="space-y-4 text-secondary text-sm">
<li className="flex gap-3">
<span className="material-symbols-outlined text-primary shrink-0" data-icon="check_circle">check_circle</span>
                                One student can only be a part of one team.
                            </li>
<li className="flex gap-3">
<span className="material-symbols-outlined text-primary shrink-0" data-icon="check_circle">check_circle</span>
                                Cross-college teams are permitted and encouraged.
                            </li>
<li className="flex gap-3">
<span className="material-symbols-outlined text-primary shrink-0" data-icon="check_circle">check_circle</span>
                                Team Leader is responsible for all communications.
                            </li>
</ul>
</div>
<div className="space-y-6">
<div className="flex items-center gap-3">
<div className="size-8 rounded bg-primary/10 flex items-center justify-center text-primary">
<span className="material-symbols-outlined text-xl" data-icon="rocket_launch">rocket_launch</span>
</div>
<h4 className="text-xl font-bold text-on-surface">Innovation</h4>
</div>
<ul className="space-y-4 text-secondary text-sm">
<li className="flex gap-3">
<span className="material-symbols-outlined text-primary shrink-0" data-icon="check_circle">check_circle</span>
                                All code must be written during the 24-hour hacking window.
                            </li>
<li className="flex gap-3">
<span className="material-symbols-outlined text-primary shrink-0" data-icon="check_circle">check_circle</span>
                                Use of open-source libraries is permitted with attribution.
                            </li>
<li className="flex gap-3">
<span className="material-symbols-outlined text-primary shrink-0" data-icon="check_circle">check_circle</span>
                                Pre-existing projects are strictly disqualified.
                            </li>
</ul>
</div>
<div className="space-y-6">
<div className="flex items-center gap-3">
<div className="size-8 rounded bg-primary/10 flex items-center justify-center text-primary">
<span className="material-symbols-outlined text-xl" data-icon="assignment">assignment</span>
</div>
<h4 className="text-xl font-bold text-on-surface">Submission</h4>
</div>
<ul className="space-y-4 text-secondary text-sm">
<li className="flex gap-3">
<span className="material-symbols-outlined text-primary shrink-0" data-icon="check_circle">check_circle</span>
                                Final package must contain all 5 required elements.
                            </li>
<li className="flex gap-3">
<span className="material-symbols-outlined text-primary shrink-0" data-icon="check_circle">check_circle</span>
                                Video demo must be under 3 minutes with clear audio.
                            </li>
<li className="flex gap-3">
<span className="material-symbols-outlined text-primary shrink-0" data-icon="check_circle">check_circle</span>
                                GitHub repo must be public for evaluation.
                            </li>
</ul>
</div>
</div>
</div>
</section>

<section className="px-6 md:px-10 lg:px-40 py-24 bg-white">
<div className="max-w-[1280px] mx-auto">
<div className="text-center mb-16">
<h3 className="text-on-surface text-3xl md:text-4xl font-bold font-display-lg">Recognition &amp; Awards</h3>
<p className="text-secondary mt-2">Celebrating innovation, effort, and excellence.</p>
</div>
<div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch">
<div className="p-10 rounded-[2rem] bg-on-surface text-white flex flex-col justify-between">
<div>
<div className="size-16 rounded-full bg-primary flex items-center justify-center mb-8">
<span className="material-symbols-outlined text-3xl" data-icon="emoji_events">emoji_events</span>
</div>
<h4 className="text-3xl font-bold font-display-lg mb-4">Top 2 Teams</h4>
<p className="text-white/70 text-lg">The most outstanding solutions will be selected based on innovation, technical complexity, and impact. Winners receive prestigious medals and direct mentoring opportunities.</p>
</div>
<div className="mt-12 flex gap-4">
<div className="flex-1 p-4 rounded-xl bg-white/5 border border-white/10 text-center">
<div className="text-primary font-bold text-2xl">01</div>
<div className="text-[10px] uppercase tracking-widest text-white/50">Champion</div>
</div>
<div className="flex-1 p-4 rounded-xl bg-white/5 border border-white/10 text-center">
<div className="text-white font-bold text-2xl">02</div>
<div className="text-[10px] uppercase tracking-widest text-white/50">Runner Up</div>
</div>
</div>
</div>
<div className="p-10 rounded-[2rem] bg-surface-container border border-outline-variant flex flex-col justify-between relative overflow-hidden">
<div className="relative z-10">
<div className="size-16 rounded-full bg-white flex items-center justify-center mb-8 shadow-sm">
<span className="material-symbols-outlined text-3xl text-primary" data-icon="card_membership">card_membership</span>
</div>
<h4 className="text-3xl font-bold font-display-lg mb-4">Digital Certificates</h4>
<p className="text-secondary text-lg">Every participant who completes a successful submission will receive a verifiable digital certificate of participation, perfect for showcasing on LinkedIn and portfolios.</p>
</div>
<div className="relative z-10 mt-12 bg-white p-6 rounded-2xl border border-outline-variant shadow-sm rotate-3 translate-x-12 translate-y-6">
<div className="flex items-center gap-4 mb-4">
<div className="size-10 bg-primary/10 rounded-full"></div>
<div className="space-y-1">
<div className="h-2 w-24 bg-surface-container rounded"></div>
<div className="h-2 w-16 bg-surface-container rounded"></div>
</div>
</div>
<div className="h-4 w-full bg-surface-container rounded mb-2"></div>
<div className="h-4 w-3/4 bg-surface-container rounded"></div>
</div>
</div>
</div>
</div>
</section>

<section className="px-6 md:px-10 lg:px-40 py-24 bg-surface" id="faqs">
<div className="max-w-[1280px] mx-auto grid grid-cols-1 lg:grid-cols-3 gap-16">
<div className="lg:col-span-1">
<h3 className="text-on-surface text-3xl font-bold font-display-lg leading-tight">Frequently Asked Questions</h3>
<p className="text-secondary mt-4">Everything you need to know about the event. Can't find what you're looking for? Reach out to our team.</p>
<a href="mailto:tejaswaykole8@gmail.com" className="mt-8 text-primary font-bold flex items-center gap-2 hover:gap-3 transition-all inline-flex">
                        Contact Support
                        <span className="material-symbols-outlined" data-icon="arrow_right_alt">arrow_right_alt</span>
</a>
</div>
<div className="lg:col-span-2 space-y-4">

{faqs.map((faq, index) => (
  <FAQItem 
    key={index}
    question={faq.question}
    answer={faq.answer}
    isOpen={openFaqIndex === index}
    onClick={() => setOpenFaqIndex(openFaqIndex === index ? null : index)}
  />
))}
</div>
</div>
</section>

<footer className="px-6 md:px-10 lg:px-40 py-20 bg-on-surface text-white">
<div className="max-w-[1280px] mx-auto">
<div className="grid grid-cols-1 md:grid-cols-4 gap-12 pb-16 border-b border-white/10">
<div className="col-span-1 md:col-span-1 space-y-6">
<div className="flex items-center gap-3">
<div className="size-6 text-primary">
<svg fill="none" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
<path d="M13.8261 30.5736C16.7203 29.8826 20.2244 29.4783 24 29.4783C27.7756 29.4783 31.2797 29.8826 34.1739 30.5736C36.9144 31.2278 39.9967 32.7669 41.3563 33.8352L24.8486 7.36089C24.4571 6.73303 23.5429 6.73303 23.1514 7.36089L6.64374 33.8352C8.00331 32.7669 11.0856 31.2278 13.8261 30.5736Z" fill="currentColor"></path>
<path clipRule="evenodd" d="M39.998 35.764C39.9944 35.7463 39.9875 35.7155 39.9748 35.6706C39.9436 35.5601 39.8949 35.4259 39.8346 35.2825C39.8168 35.2403 39.7989 35.1993 39.7813 35.1602C38.5103 34.2887 35.9788 33.0607 33.7095 32.5189C30.9875 31.8691 27.6413 31.4783 24 31.4783C20.3587 31.4783 17.0125 31.8691 14.2905 32.5189C12.0012 33.0654 9.44505 34.3104 8.18538 35.1832C8.17384 35.2075 8.16216 35.233 8.15052 35.2592C8.09919 35.3751 8.05721 35.4886 8.02977 35.589C8.00356 35.6848 8.00039 35.7333 8.00004 35.7388C8.00004 35.739 8 35.7393 8.00004 35.7388C8.00004 35.7641 8.0104 36.0767 8.68485 36.6314C9.34546 37.1746 10.4222 37.7531 11.9291 38.2772C14.9242 39.319 19.1919 40 24 40C28.8081 40 33.0758 39.319 36.0709 38.2772C37.5778 37.7531 38.6545 37.1746 39.3151 36.6314C39.9006 36.1499 39.9857 35.8511 39.998 35.764ZM4.95178 32.7688L21.4543 6.30267C22.6288 4.4191 25.3712 4.41909 26.5457 6.30267L43.0534 32.777C43.0709 32.8052 43.0878 32.8338 43.104 32.8629L41.3563 33.8352C43.104 32.8629 43.1038 32.8626 43.104 32.8629L43.1051 32.865L43.1065 32.8675L43.1101 32.8739L43.1199 32.8918C43.1276 32.906 43.1377 32.9246 43.1497 32.9473C43.1738 32.9925 43.2062 33.0545 43.244 33.1299C43.319 33.2792 43.4196 33.489 43.5217 33.7317C43.6901 34.1321 44 34.9311 44 35.7391C44 37.4427 43.003 38.7775 41.8558 39.7209C40.6947 40.6757 39.1354 41.4464 37.385 42.0552C33.8654 43.2794 29.133 44 24 44C18.867 44 14.1346 43.2794 10.615 42.0552C8.86463 41.4464 7.30529 40.6757 6.14419 39.7209C4.99695 38.7775 3.99999 37.4427 3.99999 35.7391C3.99999 34.8725 4.29264 34.0922 4.49321 33.6393C4.60375 33.3898 4.71348 33.1804 4.79687 33.0311C4.83898 32.9556 4.87547 32.8935 4.9035 32.8471C4.91754 32.8238 4.92954 32.8043 4.93916 32.7889L4.94662 32.777L4.95178 32.7688ZM35.9868 29.004L24 9.77997L12.0131 29.004C12.4661 28.8609 12.9179 28.7342 13.3617 28.6282C16.4281 27.8961 20.0901 27.4783 24 27.4783C27.9099 27.4783 31.5719 27.8961 34.6383 28.6282C35.082 28.7342 35.5339 28.8609 35.9868 29.004Z" fill="currentColor" fillRule="evenodd"></path>
</svg>
</div>
<span className="text-xl font-bold font-display-lg">INNOVATE'26</span>
</div>
<p className="text-white/60 text-sm">An annual celebration of technology, creativity, and the power of collaboration among the next generation of engineers.</p>
</div>
<div>
<h6 className="font-bold mb-6">Navigation</h6>
<ul className="space-y-4 text-white/60 text-sm">
<li className=""><a className="hover:text-primary transition-colors" href="#about">About</a></li>
<li className=""><a className="hover:text-primary transition-colors" href="#how-it-works">Process</a></li>
<li className=""><a className="hover:text-primary transition-colors" href="#timeline">Timeline</a></li>
<li className=""><a className="hover:text-primary transition-colors" href="#rules">Rules</a></li>
</ul>
</div>
<div>
<h6 className="font-bold mb-6">Support</h6>
<ul className="space-y-4 text-white/60 text-sm">
<li className=""><a className="hover:text-primary transition-colors" href="#">Privacy Policy</a></li>
<li className=""><a className="hover:text-primary transition-colors" href="#">Code of Conduct</a></li>
<li className=""><a className="hover:text-primary transition-colors" href="#">Help Center</a></li>
<li className=""><a className="hover:text-primary transition-colors" href="#faqs">FAQs</a></li>
</ul>
</div>
<div>
<h6 className="font-bold mb-6">Organizer Info</h6>
<div className="space-y-4 text-white/60 text-sm">
<p className="flex items-center gap-3">
<span className="material-symbols-outlined text-sm" data-icon="mail">mail</span>
                                tejaswaykole8@gmail.com
                            </p>
<p className="flex items-center gap-3">
<span className="material-symbols-outlined text-sm" data-icon="phone">phone</span>
                                Tejas Waykole: 9860113081
                            </p>
<p className="flex items-center gap-3">
<span className="material-symbols-outlined text-sm" data-icon="phone">phone</span>
                                Prathamesh Sangale: 8668324956
                            </p>
<p className="flex items-center gap-3">
<span className="material-symbols-outlined text-sm" data-icon="location_on">location_on</span>
                                JTM College of Engineering Faizpur
                            </p>
<div className="flex gap-4 pt-4">
<div className="size-8 rounded-full bg-white/5 flex items-center justify-center hover:bg-primary transition-colors cursor-pointer">
<span className="material-symbols-outlined text-lg" data-icon="public">public</span>
</div>
<div className="size-8 rounded-full bg-white/5 flex items-center justify-center hover:bg-primary transition-colors cursor-pointer">
<span className="material-symbols-outlined text-lg" data-icon="alternate_email">alternate_email</span>
</div>
</div>
</div>
</div>
</div>
<div className="pt-8 text-center text-white/40 text-xs">
                    © 2024 INNOVATE'26. All Rights Reserved. Built with passion for innovation.
                </div>
</div>
</footer>
</main>




    </>
  );
}
