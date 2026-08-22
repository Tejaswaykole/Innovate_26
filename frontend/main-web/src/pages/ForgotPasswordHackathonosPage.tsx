// @ts-nocheck
import React from 'react';

export default function Component() {
  return (
    <>
      

<div className="absolute top-[-20%] left-[-10%] w-[50vw] h-[50vw] rounded-full bg-primary/5 blur-[120px] pointer-events-none"></div>
<div className="absolute bottom-[-20%] right-[-10%] w-[40vw] h-[40vw] rounded-full bg-secondary/5 blur-[100px] pointer-events-none"></div>

<header className="fixed top-0 w-full bg-surface/80 dark:bg-surface-dim/80 backdrop-blur-md z-50 shadow-sm border-b border-outline-variant dark:border-outline">
<div className="flex justify-between items-center px-gutter py-4 max-w-container-max mx-auto">
<div className="font-headline-md text-headline-md font-bold text-primary dark:text-primary-fixed-dim cursor-pointer active:scale-95 duration-200">
                INNOVATIVE'26 Auth
            </div>
<div className="flex items-center gap-4">
<a className="text-secondary dark:text-secondary-fixed-dim hover:text-primary-container dark:hover:text-primary-fixed transition-colors cursor-pointer active:scale-95 duration-200 font-label-md text-label-md" href="#">
                    Support
                </a>
</div>
</div>
</header>

<main className="flex-grow flex items-center justify-center px-md md:px-gutter pt-[80px] pb-xl relative z-10 w-full">

<div className="w-full max-w-[480px] glass-card rounded-xl p-lg md:p-xl slide-up" id="reset-request-view" style={{ "animationDelay": "0.1s" }}>
<div className="mb-lg text-center">
<div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-surface-container-high text-primary mb-4">
<span className="material-symbols-outlined" style={{ "fontVariationSettings": "'FILL' 1", "fontSize": "24px" }}>lock_reset</span>
</div>
<h1 className="font-headline-lg-mobile md:font-headline-lg text-headline-lg-mobile md:text-headline-lg text-on-surface mb-2">
                    Reset Password
                </h1>
<p className="font-body-md text-body-md text-on-surface-variant">
                    Enter the email address associated with your account, and we'll send you a link to reset your password.
                </p>
</div>
<form className="space-y-lg" id="reset-form">
<div className="space-y-sm">
<label className="block font-label-md text-label-md text-on-surface" htmlFor="email">Email Address</label>
<div className="relative">
<div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
<span className="material-symbols-outlined text-outline">mail</span>
</div>
<input className="block w-full pl-10 pr-3 py-3 border border-outline-variant rounded-lg bg-surface-container-lowest text-on-surface focus:ring-2 focus:ring-primary focus:border-primary transition-shadow sm:text-sm shadow-sm outline-none font-body-md text-body-md" id="email" name="email" placeholder="name@university.edu" required={true} type="email"/>
</div>
</div>
<button className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm font-label-md text-label-md text-on-primary bg-primary-container hover:bg-primary-container/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-colors duration-200" type="submit">
                    Send Reset Link
                </button>
<div className="text-center mt-6">
<a className="font-label-md text-label-md text-primary hover:text-primary-container transition-colors inline-flex items-center gap-1 group" href="#">
<span className="material-symbols-outlined text-[18px] group-hover:-translate-x-1 transition-transform">arrow_back</span>
                        Back to Login
                    </a>
</div>
</form>
</div>

<div className="w-full max-w-[480px] glass-card rounded-xl p-lg md:p-xl hidden-flow text-center" id="reset-success-view">
<div className="mb-lg flex flex-col items-center">
<div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-secondary-container text-primary mb-6 relative">
<div className="absolute inset-0 rounded-full border-4 border-primary/20 animate-ping" style={{ "animationDuration": "3s" }}></div>
<span className="material-symbols-outlined" style={{ "fontVariationSettings": "'FILL' 1", "fontSize": "32px" }}>mark_email_read</span>
</div>
<h1 className="font-headline-lg-mobile md:font-headline-lg text-headline-lg-mobile md:text-headline-lg text-on-surface mb-3">
                    Check your inbox
                </h1>
<div className="space-y-4 font-body-md text-body-md text-on-surface-variant max-w-sm mx-auto">
<p>
                        We've sent a secure reset link to <br/>
<span className="font-semibold text-on-surface break-all" id="submitted-email">developer@university.edu</span>
</p>
<p className="text-sm">
                        Didn't receive the email? Check your spam folder or try resending the request in <span className="font-mono text-primary" id="countdown">60</span>s.
                    </p>
</div>
</div>
<div className="space-y-4 pt-4 border-t border-outline-variant/30">
<button className="w-full flex justify-center py-3 px-4 border border-outline rounded-lg shadow-sm font-label-md text-label-md text-secondary bg-transparent hover:bg-surface-container-low focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-outline transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed" disabled={true} id="resend-btn" type="button">
                    Resend Email
                </button>
<a className="block w-full text-center py-3 px-4 font-label-md text-label-md text-primary hover:text-primary-container transition-colors" href="#">
                    Return to Login
                </a>
</div>
</div>
</main>

<footer className="w-full py-8 mt-auto bg-surface-container-low dark:bg-surface-container-lowest border-t border-outline-variant flex flex-col md:flex-row justify-between items-center px-gutter gap-4 relative z-10">
<div className="font-label-md text-label-md uppercase tracking-widest text-on-surface-variant">
            © 2024 INNOVATIVE'26 Department of Computer Engineering, T.M.E's J.T.M. College of Engineering, Faizpur. Built for innovators.
        </div>
<div className="flex items-center gap-6">
<a className="font-caption text-caption text-secondary dark:text-secondary-fixed-dim hover:text-primary dark:hover:text-primary-fixed transition-all text-on-surface-variant" href="#">Privacy Policy</a>
<a className="font-caption text-caption text-secondary dark:text-secondary-fixed-dim hover:text-primary dark:hover:text-primary-fixed transition-all text-on-surface-variant" href="#">Terms of Service</a>
<a className="font-caption text-caption text-secondary dark:text-secondary-fixed-dim hover:text-primary dark:hover:text-primary-fixed transition-all text-on-surface-variant" href="#">Contact Organizer</a>
</div>
</footer>


    </>
  );
}
