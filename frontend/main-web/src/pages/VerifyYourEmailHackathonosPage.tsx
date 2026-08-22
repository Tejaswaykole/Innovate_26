// @ts-nocheck
import React from 'react';

export default function Component() {
  return (
    <>
      

<div className="absolute inset-0 z-0 pointer-events-none opacity-20" style={{ "backgroundImage": "radial-gradient(circle at 2px 2px, #004ac6 1px, transparent 0)", "backgroundSize": "32px 32px" }}></div>

<div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-primary-fixed-dim blur-3xl opacity-30 z-0"></div>
<div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-secondary-fixed blur-3xl opacity-30 z-0"></div>

<main className="flex-grow flex items-center justify-center p-md z-10">
<div className="w-full max-w-md glass-panel rounded-xl shadow-[0_4px_6px_-1px_rgba(0,0,0,0.1),0_2px_4px_-2px_rgba(0,0,0,0.1)] p-xl relative overflow-hidden">

<div className="absolute top-0 left-0 w-full h-1 bg-surface-container-high">
<div className="h-full bg-primary-container w-[75%]"></div>
</div>

<div className="flex flex-col items-center mb-lg">
<div className="w-16 h-16 bg-primary-fixed rounded-full flex items-center justify-center mb-md text-primary-container">
<span className="material-symbols-outlined text-[32px]" style={{ "fontVariationSettings": "'FILL' 1" }}>mark_email_read</span>
</div>
<h1 className="font-headline-md text-headline-md text-on-surface mb-xs text-center">Account Created</h1>
<p className="font-body-md text-body-md text-on-surface-variant text-center">We've sent a verification link to your email.</p>
</div>

<div className="bg-surface-container-low border border-outline-variant rounded-lg p-md mb-lg flex items-center justify-center space-x-sm">
<span className="material-symbols-outlined text-secondary">mail</span>
<span className="font-label-md text-label-md text-on-surface font-medium">developer@university.edu</span>
</div>

<div className="space-y-md mb-xl">
<p className="font-body-md text-body-md text-on-surface-variant text-center">
                    Please check your inbox and click the link to verify your account. If you don't see it, check your spam folder.
                </p>
</div>

<div className="flex flex-col space-y-md">
<button className="w-full bg-primary-container text-on-primary py-3 px-4 rounded-lg font-label-md text-label-md hover:bg-primary transition-colors shadow-sm flex items-center justify-center gap-2">
<span>Continue</span>
<span className="material-symbols-outlined text-[18px]">arrow_forward</span>
</button>
<button className="w-full bg-transparent border border-outline-variant text-secondary py-3 px-4 rounded-lg font-label-md text-label-md hover:bg-surface-container-low transition-colors flex items-center justify-center gap-2">
<span className="material-symbols-outlined text-[18px]">refresh</span>
<span>Resend Verification</span>
</button>
</div>

<div className="mt-lg text-center">
<a className="font-caption text-caption text-primary hover:underline" href="#">Change email address</a>
</div>
</div>
</main>

<footer className="w-full py-8 mt-auto border-t border-outline-variant bg-surface-container-low z-10 flex flex-col md:flex-row justify-between items-center px-gutter gap-4">
<div className="font-label-md text-label-md uppercase tracking-widest text-on-surface-variant">
            © 2024 INNOVATIVE'26 Department of Computer Engineering, T.M.E's J.T.M. College of Engineering, Faizpur. Built for innovators.
        </div>
<div className="flex gap-4">
<a className="font-caption text-caption text-on-surface-variant hover:text-primary transition-all" href="#">Privacy Policy</a>
<a className="font-caption text-caption text-on-surface-variant hover:text-primary transition-all" href="#">Terms of Service</a>
<a className="font-caption text-caption text-on-surface-variant hover:text-primary transition-all" href="#">Contact Organizer</a>
</div>
</footer>

    </>
  );
}
