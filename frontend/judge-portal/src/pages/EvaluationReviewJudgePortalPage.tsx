// @ts-nocheck
import React from 'react';

export default function Component() {
  return (
    <>
      

<header className="bg-surface/80 backdrop-blur-md text-primary font-body-md text-body-md sticky top-0 w-full z-50 shadow-sm border-b border-outline-variant/30">
<div className="flex justify-between items-center px-gutter py-4 max-w-container-max mx-auto">

<div className="font-headline-md text-headline-md font-bold text-primary flex items-center gap-sm">
<span className="material-symbols-outlined" style={{ "fontVariationSettings": "'FILL' 1" }}>gavel</span>
                HackathonJudge
            </div>

<nav className="hidden md:flex gap-lg items-center">
<a className="text-on-surface-variant hover:text-primary transition-colors hover:bg-surface-container-low transition-all px-3 py-2 rounded-md" href="#">Dashboard</a>

<a className="text-primary border-b-2 border-primary pb-1 font-bold" href="#">Assigned Teams</a>
<a className="text-on-surface-variant hover:text-primary transition-colors hover:bg-surface-container-low transition-all px-3 py-2 rounded-md" href="#">Evaluation History</a>
<a className="text-on-surface-variant hover:text-primary transition-colors hover:bg-surface-container-low transition-all px-3 py-2 rounded-md" href="#">Announcements</a>
</nav>

<div className="flex items-center gap-md">
<button className="p-2 text-on-surface-variant hover:bg-surface-container-low rounded-full transition-all cursor-pointer active:scale-95 duration-150">
<span className="material-symbols-outlined">notifications</span>
</button>
<button className="p-2 text-on-surface-variant hover:bg-surface-container-low rounded-full transition-all cursor-pointer active:scale-95 duration-150">
<span className="material-symbols-outlined">settings</span>
</button>
<div className="w-10 h-10 rounded-full bg-secondary-container flex items-center justify-center overflow-hidden border border-outline-variant">
<img alt="Judge Profile Avatar" className="w-full h-full object-cover" data-alt="A professional headshot of a software engineer serving as a hackathon judge. Clean lighting, neutral background, modern corporate aesthetic. The subject is smiling slightly, conveying competence and approachability. High resolution, sharp focus." src="https://lh3.googleusercontent.com/aida-public/AB6AXuAWaPnWy6mh8mPgpns2TjVnFBmNV-I0-X6antoab-48wP4wMdTw2ei4OMMbbyzOeNQwZuPHyneBs_2-hzZHAqALnWBApqqNiStmQW2dnWvh_lq6vaeIEV9cCLxOFQ7sQRFy4uIm19jHqBfglpat9y9Up_cfuqaO7ZLvQ9q0-b8A2NeTz6bI5sVlpTOjhJbqFM3n6RGNJ-yTfLuUcvIJaW113xO33dMisKHSxghrWGdTn_s1pysO6NrL"/>
</div>
</div>
</div>
</header>

<main className="flex-grow w-full max-w-container-max mx-auto px-gutter py-xl md:py-xxl">

<div className="mb-xl">
<div className="flex items-center gap-sm text-secondary font-body-md text-body-md mb-sm">
<span className="material-symbols-outlined text-sm">arrow_back</span>
<a className="hover:underline" href="#">Back to Evaluation</a>
</div>
<h1 className="font-headline-lg-mobile md:font-headline-lg text-headline-lg-mobile md:text-headline-lg text-on-surface">
                Review Evaluation for Team Alpha
            </h1>
<p className="font-body-md text-body-md text-on-surface-variant mt-xs">
                Finalize your scores and feedback before submitting to the system.
            </p>
</div>

<div className="bg-error-container text-on-error-container rounded-lg p-md flex items-start gap-md mb-xl border border-error/20 shadow-sm">
<span className="material-symbols-outlined shrink-0 mt-0.5 text-error" style={{ "fontVariationSettings": "'FILL' 1" }}>warning</span>
<div>
<h3 className="font-label-md text-label-md font-bold mb-xs">Final Submission Warning</h3>
<p className="font-body-md text-body-md">Once submitted, this evaluation will be locked and cannot be edited. Please verify all scores carefully.</p>
</div>
</div>

<div className="grid grid-cols-1 lg:grid-cols-12 gap-lg items-start">

<div className="lg:col-span-4 flex flex-col gap-lg sticky top-24">

<div className="bg-surface-container-lowest rounded-xl border border-outline-variant/30 p-xl shadow-sm flex flex-col items-center justify-center text-center relative overflow-hidden">
<div className="absolute top-0 left-0 w-full h-1 bg-primary"></div>
<p className="font-label-md text-label-md text-on-surface-variant mb-md uppercase tracking-wider">Total Score</p>
<div className="relative flex items-center justify-center mb-sm">

<svg className="w-32 h-32 transform -rotate-90" viewBox="0 0 100 100">
<circle className="stroke-surface-container-high" cx="50" cy="50" fill="none" r="45" strokeWidth="6"></circle>
<circle className="stroke-primary-container" cx="50" cy="50" fill="none" r="45" strokeDasharray="283" strokeDashoffset="45" strokeLinecap="round" strokeWidth="6"></circle>
</svg>
<div className="absolute flex flex-col items-center justify-center">
<span className="font-display-lg text-display-lg text-primary-container">42</span>
<span className="font-body-md text-body-md text-outline">/ 50</span>
</div>
</div>
<div className="mt-md inline-flex items-center gap-xs bg-surface-container px-sm py-1 rounded-md border border-outline-variant/50">
<span className="material-symbols-outlined text-sm text-secondary" style={{ "fontVariationSettings": "'FILL' 1" }}>verified</span>
<span className="font-caption text-caption text-secondary">Ready to Submit</span>
</div>
</div>

<div className="bg-surface-container-lowest rounded-xl border border-outline-variant/30 p-lg shadow-sm">
<h3 className="font-label-md text-label-md text-on-surface mb-md">Project Info</h3>
<div className="space-y-sm">
<div className="flex justify-between items-center">
<span className="font-body-md text-body-md text-on-surface-variant">Track:</span>
<span className="font-label-md text-label-md text-primary bg-primary-container/10 px-2 py-0.5 rounded-sm">FinTech</span>
</div>
<div className="flex justify-between items-center">
<span className="font-body-md text-body-md text-on-surface-variant">Table:</span>
<span className="font-body-md text-body-md text-on-surface font-medium">B-42</span>
</div>
</div>
</div>
</div>

<div className="lg:col-span-8 flex flex-col gap-lg">

<div className="bg-surface-container-lowest rounded-xl border border-outline-variant/30 shadow-sm overflow-hidden">
<div className="p-lg border-b border-outline-variant/20 bg-surface/50">
<h2 className="font-headline-md text-headline-md text-on-surface flex items-center gap-sm">
<span className="material-symbols-outlined text-secondary">fact_check</span>
                            Score Breakdown
                        </h2>
</div>
<div className="flex flex-col">

<div className="flex justify-between px-lg py-sm bg-surface-container-low font-label-md text-label-md text-on-surface-variant border-b border-outline-variant/20">
<span>Criterion</span>
<span>Score</span>
</div>

<div className="flex justify-between items-center px-lg py-md border-b border-outline-variant/10 hover:bg-surface-container-lowest transition-colors">
<div className="flex flex-col">
<span className="font-body-md text-body-md text-on-surface font-medium">Technical Complexity</span>
<span className="font-caption text-caption text-on-surface-variant mt-1">Architecture, difficulty, execution</span>
</div>
<div className="font-headline-md text-headline-md text-primary-container">9<span className="text-outline text-body-md font-body-md">/10</span></div>
</div>
<div className="flex justify-between items-center px-lg py-md border-b border-outline-variant/10 hover:bg-surface-container-lowest transition-colors">
<div className="flex flex-col">
<span className="font-body-md text-body-md text-on-surface font-medium">Innovation &amp; Originality</span>
<span className="font-caption text-caption text-on-surface-variant mt-1">Novelty of solution, creative approach</span>
</div>
<div className="font-headline-md text-headline-md text-primary-container">8<span className="text-outline text-body-md font-body-md">/10</span></div>
</div>
<div className="flex justify-between items-center px-lg py-md border-b border-outline-variant/10 hover:bg-surface-container-lowest transition-colors">
<div className="flex flex-col">
<span className="font-body-md text-body-md text-on-surface font-medium">Business Viability</span>
<span className="font-caption text-caption text-on-surface-variant mt-1">Market potential, practical application</span>
</div>
<div className="font-headline-md text-headline-md text-primary-container">7<span className="text-outline text-body-md font-body-md">/10</span></div>
</div>
<div className="flex justify-between items-center px-lg py-md border-b border-outline-variant/10 hover:bg-surface-container-lowest transition-colors">
<div className="flex flex-col">
<span className="font-body-md text-body-md text-on-surface font-medium">UI/UX Design</span>
<span className="font-caption text-caption text-on-surface-variant mt-1">Usability, aesthetics, user journey</span>
</div>
<div className="font-headline-md text-headline-md text-primary-container">9<span className="text-outline text-body-md font-body-md">/10</span></div>
</div>
<div className="flex justify-between items-center px-lg py-md hover:bg-surface-container-lowest transition-colors">
<div className="flex flex-col">
<span className="font-body-md text-body-md text-on-surface font-medium">Presentation &amp; Pitch</span>
<span className="font-caption text-caption text-on-surface-variant mt-1">Clarity, communication, live demo</span>
</div>
<div className="font-headline-md text-headline-md text-primary-container">9<span className="text-outline text-body-md font-body-md">/10</span></div>
</div>
</div>
</div>

<div className="bg-surface-container-lowest rounded-xl border border-outline-variant/30 shadow-sm overflow-hidden">
<div className="p-lg border-b border-outline-variant/20 bg-surface/50">
<h2 className="font-headline-md text-headline-md text-on-surface flex items-center gap-sm">
<span className="material-symbols-outlined text-secondary">forum</span>
                            Qualitative Feedback
                        </h2>
</div>
<div className="p-lg flex flex-col gap-lg">

<div>
<h4 className="font-label-md text-label-md text-on-surface mb-sm flex items-center gap-xs">
<span className="material-symbols-outlined text-primary text-sm" style={{ "fontVariationSettings": "'FILL' 1" }}>thumb_up</span>
                                Key Strengths
                            </h4>
<div className="bg-surface-container p-md rounded-lg border border-outline-variant/20 font-body-md text-body-md text-on-surface-variant leading-relaxed">
                                Exceptional technical execution on the backend architecture. The use of microservices for their data processing pipeline was robust and well-explained during the Q&amp;A. The UI is clean and intuitive.
                            </div>
</div>

<div>
<h4 className="font-label-md text-label-md text-on-surface mb-sm flex items-center gap-xs">
<span className="material-symbols-outlined text-tertiary-container text-sm" style={{ "fontVariationSettings": "'FILL' 1" }}>trending_up</span>
                                Areas for Improvement
                            </h4>
<div className="bg-surface-container p-md rounded-lg border border-outline-variant/20 font-body-md text-body-md text-on-surface-variant leading-relaxed">
                                The business model needs more validation. Consider defining a clearer target audience for the initial rollout phase. The presentation felt slightly rushed towards the end.
                            </div>
</div>

<div>
<h4 className="font-label-md text-label-md text-on-surface mb-sm flex items-center gap-xs">
<span className="material-symbols-outlined text-secondary text-sm" style={{ "fontVariationSettings": "'FILL' 1" }}>format_quote</span>
                                Overall Notes (Internal)
                            </h4>
<div className="bg-surface-container p-md rounded-lg border border-outline-variant/20 font-body-md text-body-md text-on-surface-variant leading-relaxed italic">
                                Strong contender for the main prize. Team dynamics were excellent and they handled technical questions perfectly.
                            </div>
</div>
</div>
</div>

<div className="flex flex-col sm:flex-row justify-end items-center gap-md mt-sm pt-lg border-t border-outline-variant/30">
<button className="w-full sm:w-auto px-xl py-3 rounded-lg border border-outline text-secondary font-label-md text-label-md hover:bg-surface-container-low transition-colors duration-150 flex items-center justify-center gap-xs">
                        Back to Edit
                    </button>
<button className="w-full sm:w-auto px-xl py-3 rounded-lg bg-primary-container text-on-primary-container font-label-md text-label-md hover:opacity-90 shadow-sm transition-all duration-150 flex items-center justify-center gap-xs">
<span className="material-symbols-outlined text-sm" style={{ "fontVariationSettings": "'FILL' 1" }}>send</span>
                        Confirm &amp; Submit
                    </button>
</div>
</div>
</div>
</main>

<footer className="bg-surface-container-low text-primary font-caption text-caption w-full border-t border-outline-variant/20 mt-auto">
<div className="py-xl px-gutter flex flex-col md:flex-row justify-between items-center gap-md max-w-container-max mx-auto">
<div className="font-label-md text-label-md font-semibold text-secondary">
                © 2024 Department of Computer Engineering, T.M.E's J.T.M. College of Engineering, Faizpur. All Rights Reserved.
            </div>
<nav className="flex gap-lg">
<a className="text-on-secondary-container hover:text-primary transition-colors transition-opacity hover:opacity-80" href="#">Privacy Policy</a>
<a className="text-on-secondary-container hover:text-primary transition-colors transition-opacity hover:opacity-80" href="#">Judging Guide</a>
<a className="text-on-secondary-container hover:text-primary transition-colors transition-opacity hover:opacity-80" href="#">Support</a>
</nav>
</div>
</footer>

    </>
  );
}
