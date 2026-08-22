// @ts-nocheck
import React from 'react';

export default function Component() {
  return (
    <>
      

<nav className="bg-surface-container w-full sticky top-0 z-50 border-b border-outline-variant shadow-sm flex justify-between items-center px-lg h-16 w-full">
<div className="flex items-center gap-xl">
<span className="text-headline-md font-headline-md font-bold text-primary">HackPulse</span>
<div className="hidden md:flex gap-lg">
<a className="text-on-surface-variant font-body-md text-body-md hover:text-primary transition-colors cursor-pointer active:opacity-80" href="#">Explore</a>
<a className="text-on-surface-variant font-body-md text-body-md hover:text-primary transition-colors cursor-pointer active:opacity-80" href="#">Schedule</a>
<a className="text-on-surface-variant font-body-md text-body-md hover:text-primary transition-colors cursor-pointer active:opacity-80" href="#">Support</a>
</div>
</div>
<div className="flex items-center gap-md">
<span className="material-symbols-outlined text-on-surface-variant cursor-pointer hover:text-primary transition-colors">notifications</span>
<span className="material-symbols-outlined text-on-surface-variant cursor-pointer hover:text-primary transition-colors">settings</span>
<button className="bg-primary-container text-on-primary-container font-label-md text-label-md px-md py-sm rounded-lg hover:opacity-90 transition-opacity">Registration</button>
<div className="w-8 h-8 rounded-full bg-secondary-container flex items-center justify-center border border-outline-variant overflow-hidden">
<span className="material-symbols-outlined text-on-secondary-container text-sm">person</span>
</div>
</div>
</nav>

<main className="flex-grow w-full max-w-container-max mx-auto px-md md:px-lg py-xl flex flex-col gap-lg">

<div className="bg-secondary-fixed text-on-secondary-fixed-variant rounded-lg p-md flex items-start gap-md border border-outline-variant/30 shadow-sm">
<span className="material-symbols-outlined mt-0.5 filled text-primary">info</span>
<div>
<h4 className="font-label-md text-label-md mb-xs">View Only Mode</h4>
<p className="font-body-md text-body-md opacity-90">You are viewing this submission as a Team Member. Only the Team Leader can make modifications prior to the final deadline.</p>
</div>
</div>

<div className="flex flex-col md:flex-row md:items-end justify-between gap-md border-b border-outline-variant pb-md">
<div className="flex flex-col gap-sm">
<a className="text-on-surface-variant hover:text-primary flex items-center gap-xs font-label-md text-label-md w-fit transition-colors" href="#">
<span className="material-symbols-outlined text-[18px]">arrow_back</span>
                    Back to Dashboard
                </a>
<div className="flex flex-col gap-xs">
<h1 className="font-headline-lg text-headline-lg text-on-surface tracking-tight">Project Submission</h1>
<div className="flex items-center gap-md">
<span className="inline-flex items-center gap-xs bg-primary text-on-primary font-label-md text-label-md px-md py-sm rounded-full shadow-sm">
<span className="material-symbols-outlined text-[16px] filled">check_circle</span>
                            SUBMITTED
                        </span>
<span className="text-on-surface-variant font-caption text-caption flex items-center gap-xs">
<span className="material-symbols-outlined text-[14px]">schedule</span>
                            Confirmed on 20 August 2026 • 14:35 UTC
                        </span>
</div>
</div>
</div>
</div>

<div className="grid grid-cols-1 lg:grid-cols-3 gap-lg">

<div className="lg:col-span-2 flex flex-col gap-lg">

<section className="bg-surface-container-lowest rounded-xl border border-outline-variant p-lg shadow-sm flex flex-col gap-md">
<div className="flex items-center gap-md pb-md border-b border-outline-variant/50">
<div className="w-12 h-12 rounded-lg bg-primary-fixed flex items-center justify-center shrink-0">
<span className="material-symbols-outlined text-on-primary-fixed text-[28px]">rocket_launch</span>
</div>
<div>
<h2 className="font-headline-md text-headline-md text-on-surface">Your Project Title</h2>
<p className="font-body-md text-body-md text-on-surface-variant">Project Tagline</p>
</div>
</div>
<div className="grid grid-cols-1 sm:grid-cols-2 gap-md pt-sm">
<div className="flex flex-col gap-xs">
<span className="font-label-md text-label-md text-on-surface-variant uppercase tracking-wider text-[11px]">Team Name</span>
<span className="font-body-md text-body-md font-medium text-on-surface flex items-center gap-sm">
<span className="material-symbols-outlined text-[18px] text-primary">groups</span>
                                Your Team Name
                            </span>
</div>
<div className="flex flex-col gap-xs">
<span className="font-label-md text-label-md text-on-surface-variant uppercase tracking-wider text-[11px]">Team Leader</span>
<span className="font-body-md text-body-md font-medium text-on-surface flex items-center gap-sm">
<span className="material-symbols-outlined text-[18px] text-primary">person</span>
                                Team Leader
                            </span>
</div>
</div>
</section>

<section className="bg-surface-container-lowest rounded-xl border border-outline-variant p-lg shadow-sm flex flex-col gap-md">
<h3 className="font-headline-md text-headline-md text-on-surface flex items-center gap-sm">
<span className="material-symbols-outlined text-primary">description</span>
                        Problem Statement
                    </h3>
<div className="bg-surface rounded-lg p-md border border-outline-variant/30">
<p className="font-body-md text-body-md text-on-surface leading-relaxed whitespace-pre-line"></p>
</div>
</section>
</div>

<div className="lg:col-span-1 flex flex-col gap-lg">

<section className="bg-surface-container-lowest rounded-xl border border-outline-variant p-lg shadow-sm flex flex-col gap-md">
<h3 className="font-headline-md text-headline-md text-on-surface flex items-center gap-sm pb-sm border-b border-outline-variant/50">
<span className="material-symbols-outlined text-primary">link</span>
                        Project Artifacts
                    </h3>
<div className="flex flex-col gap-sm">

<div className="flex items-center justify-between p-sm rounded-lg hover:bg-surface transition-colors group">
<div className="flex items-center gap-md">
<div className="w-8 h-8 rounded bg-surface-variant flex items-center justify-center">
<span className="material-symbols-outlined text-[18px] text-on-surface-variant">code</span>
</div>
<div className="flex flex-col">
<span className="font-label-md text-label-md text-on-surface">GitHub Repository</span>
<span className="font-caption text-caption text-on-surface-variant truncate w-40 md:w-auto"></span>
</div>
</div>
<span className="material-symbols-outlined text-on-surface-variant opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer hover:text-primary">open_in_new</span>
</div>

<div className="flex items-center justify-between p-sm rounded-lg hover:bg-surface transition-colors group">
<div className="flex items-center gap-md">
<div className="w-8 h-8 rounded bg-surface-variant flex items-center justify-center">
<span className="material-symbols-outlined text-[18px] text-on-surface-variant">language</span>
</div>
<div className="flex flex-col">
<span className="font-label-md text-label-md text-on-surface">Live Demo</span>
<span className="font-caption text-caption text-on-surface-variant truncate w-40 md:w-auto"></span>
</div>
</div>
<span className="material-symbols-outlined text-on-surface-variant opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer hover:text-primary">open_in_new</span>
</div>

<div className="flex items-center justify-between p-sm rounded-lg hover:bg-surface transition-colors group">
<div className="flex items-center gap-md">
<div className="w-8 h-8 rounded bg-surface-variant flex items-center justify-center">
<span className="material-symbols-outlined text-[18px] text-on-surface-variant">slideshow</span>
</div>
<div className="flex flex-col">
<span className="font-label-md text-label-md text-on-surface">Presentation Deck</span>
<span className="font-caption text-caption text-on-surface-variant truncate w-40 md:w-auto"></span>
</div>
</div>
<span className="material-symbols-outlined text-on-surface-variant opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer hover:text-primary">download</span>
</div>
</div>
</section>

<section className="bg-surface-container-lowest rounded-xl border border-outline-variant p-md shadow-sm flex flex-col gap-sm relative overflow-hidden group cursor-pointer">
<h3 className="font-label-md text-label-md text-on-surface px-xs pb-xs">Demo Video</h3>
<div className="relative w-full aspect-video rounded-lg overflow-hidden border border-outline-variant/30 bg-surface">
<img className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" data-alt="A cinematic, high-quality still frame from a technical software demonstration video. The scene shows a sleek, dark-mode dashboard interface with intricate data visualizations, glowing neon blue network graphs, and a clean, modern aesthetic. The lighting is moody and professional, suggesting a high-stakes hackathon presentation. Soft focus on the background elements brings the central data UI into sharp relief." src="https://lh3.googleusercontent.com/aida-public/AB6AXuCk9-Em_kbrQ96v6CMSHJWWBBeoSPHaAsBJemo4SApCKD_h43QGg_BllkiwqFCMxx0oJe-AFWJ8FC12qfunG8RbFRPeqSB9ve94PPNCXxqpCVoYOxH1dpGFVUV6MK09_S5uDKeHyPFvR-Vttlq-_V2cIselUhCSpHOE6lqMz7N3SjQMGxm5BmEz1eFZVmQO4zv7TJ-o5lRyDAifF_umTU5vBFBao4g5XQD6yUnq_K-IObl_UZt6LmG6"/>
<div className="absolute inset-0 bg-on-surface/20 flex items-center justify-center group-hover:bg-on-surface/10 transition-colors duration-300">
<div className="w-14 h-14 rounded-full bg-surface-container-lowest/90 backdrop-blur-sm flex items-center justify-center shadow-lg transform group-hover:scale-110 transition-transform duration-300">
<span className="material-symbols-outlined text-[32px] text-primary filled pl-1">play_arrow</span>
</div>
</div>
</div>
</section>
</div>
</div>
</main>

<footer className="bg-surface-container-lowest w-full py-8 border-t border-outline-variant flex flex-col md:flex-row justify-between items-center px-lg gap-4 mt-auto">
<span className="font-bold text-on-surface">© 2024 Department of Computer Engineering, T.M.E's J.T.M. College of Engineering, Faizpur. All rights reserved.</span>
<div className="flex gap-md">
<a className="text-on-surface-variant font-label-sm text-label-sm hover:text-secondary-fixed-dim transition-colors" href="#">Privacy Policy</a>
<a className="text-on-surface-variant font-label-sm text-label-sm hover:text-secondary-fixed-dim transition-colors" href="#">Terms of Service</a>
<a className="text-on-surface-variant font-label-sm text-label-sm hover:text-secondary-fixed-dim transition-colors" href="#">Contact Support</a>
</div>
</footer>

    </>
  );
}
