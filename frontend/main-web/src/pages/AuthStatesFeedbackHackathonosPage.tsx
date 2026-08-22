// @ts-nocheck
import React from 'react';

export default function Component() {
  return (
    <>
      

<header className="bg-surface/80 dark:bg-surface-dim/80 backdrop-blur-md fixed top-0 w-full border-b border-outline-variant dark:border-outline shadow-sm z-50">
<div className="flex justify-between items-center px-gutter py-4 max-w-container-max mx-auto">
<div className="flex items-center gap-2 font-headline-md text-headline-md font-bold text-primary dark:text-primary-fixed-dim">
<span className="material-symbols-outlined" data-weight="fill" style={{ "fontVariationSettings": "'FILL' 1" }}>terminal</span>
                INNOVATIVE'26 Auth
            </div>
<div className="flex items-center gap-6 hidden md:flex">

</div>
<div className="flex items-center gap-4">
<button className="text-secondary dark:text-secondary-fixed-dim hover:text-primary-container dark:hover:text-primary-fixed transition-colors font-label-md text-label-md cursor-pointer active:scale-95 duration-200">
                    Support
                </button>
</div>
</div>
</header>

<main className="flex-grow flex flex-col items-center justify-center p-gutter w-full max-w-container-max mx-auto gap-xl">
<div className="text-center mb-lg">
<h1 className="font-display-lg text-display-lg text-on-surface mb-sm">Authentication States</h1>
<p className="font-body-lg text-body-lg text-on-surface-variant max-w-2xl mx-auto">Review common error and feedback states encountered during the authentication flow.</p>
</div>
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-lg w-full">

<div className="bg-surface-container-lowest border border-error/30 rounded-xl p-lg shadow-[0_1px_3px_0_rgba(0,0,0,0.1),0_1px_2px_-1px_rgba(0,0,0,0.1)] relative overflow-hidden">
<div className="absolute top-0 left-0 w-1 h-full bg-error"></div>
<div className="flex gap-4 items-start mb-6">
<span className="material-symbols-outlined text-error text-3xl" data-weight="fill" style={{ "fontVariationSettings": "'FILL' 1" }}>error</span>
<div>
<h2 className="font-headline-md text-headline-md text-on-surface mb-1">Invalid Credentials</h2>
<p className="font-body-md text-body-md text-on-surface-variant">The email or password provided is incorrect.</p>
</div>
</div>
<form className="flex flex-col gap-4">
<div>
<label className="block font-label-md text-label-md text-on-surface-variant mb-2">Email Address</label>
<input className="w-full bg-surface-container-lowest border border-error text-on-surface rounded-lg px-4 py-2 font-body-md text-body-md focus:outline-none focus:ring-2 focus:ring-error focus:border-error transition-all" type="email" value="developer@example.com"/>
</div>
<div>
<label className="block font-label-md text-label-md text-on-surface-variant mb-2">Password</label>
<input className="w-full bg-surface-container-lowest border border-error text-on-surface rounded-lg px-4 py-2 font-body-md text-body-md focus:outline-none focus:ring-2 focus:ring-error focus:border-error transition-all" type="password" value="********"/>
<p className="font-caption text-caption text-error mt-2">Incorrect password. Please try again.</p>
</div>
<button className="w-full bg-primary-container text-on-primary rounded-lg py-3 font-label-md text-label-md hover:bg-surface-tint transition-colors mt-2 shadow-sm" type="button">
                        Sign In
                    </button>
</form>
</div>

<div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-lg shadow-[0_1px_3px_0_rgba(0,0,0,0.1),0_1px_2px_-1px_rgba(0,0,0,0.1)]">
<div className="flex gap-4 items-start mb-6">
<span className="material-symbols-outlined text-tertiary-container text-3xl" data-weight="fill" style={{ "fontVariationSettings": "'FILL' 1" }}>warning</span>
<div>
<h2 className="font-headline-md text-headline-md text-on-surface mb-1">Account Exists</h2>
<p className="font-body-md text-body-md text-on-surface-variant">An account with this email is already registered.</p>
</div>
</div>
<div className="bg-tertiary-container/10 border border-tertiary-container/30 rounded-lg p-4 mb-6 flex items-start gap-3">
<span className="material-symbols-outlined text-tertiary-container text-xl mt-0.5">info</span>
<div>
<p className="font-body-md text-body-md text-on-surface"><strong>student@university.edu</strong> is already associated with an account.</p>
<a className="font-label-md text-label-md text-primary hover:underline mt-2 inline-block" href="#">Go to Login</a>
</div>
</div>
<form className="flex flex-col gap-4 opacity-50 pointer-events-none">
<div>
<label className="block font-label-md text-label-md text-on-surface-variant mb-2">Email Address</label>
<input className="w-full bg-surface-container-lowest border border-outline-variant text-on-surface rounded-lg px-4 py-2 font-body-md text-body-md" type="email" value="student@university.edu"/>
</div>
<button className="w-full bg-surface-container-high text-on-surface-variant rounded-lg py-3 font-label-md text-label-md" type="button">
                        Create Account
                    </button>
</form>
</div>

<div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-lg shadow-[0_1px_3px_0_rgba(0,0,0,0.1),0_1px_2px_-1px_rgba(0,0,0,0.1)]">
<div className="flex flex-col items-center text-center">
<div className="w-16 h-16 bg-surface-container-high rounded-full flex items-center justify-center mb-4">
<span className="material-symbols-outlined text-secondary text-3xl" data-weight="fill" style={{ "fontVariationSettings": "'FILL' 1" }}>mark_email_unread</span>
</div>
<h2 className="font-headline-md text-headline-md text-on-surface mb-2">Verify Your Email</h2>
<p className="font-body-md text-body-md text-on-surface-variant mb-6">We sent a verification link to <strong>newuser@startup.io</strong>. Please check your inbox to continue.</p>
<div className="w-full flex flex-col gap-3">
<button className="w-full bg-primary-container text-on-primary rounded-lg py-3 font-label-md text-label-md hover:bg-surface-tint transition-colors shadow-sm flex justify-center items-center gap-2" type="button">
<span className="material-symbols-outlined text-sm">refresh</span>
                            Resend Verification Email
                        </button>
<button className="w-full bg-transparent border border-outline text-secondary rounded-lg py-3 font-label-md text-label-md hover:bg-surface-container-low transition-colors" type="button">
                            Change Email Address
                        </button>
</div>
</div>
</div>

<div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-lg shadow-[0_4px_6px_-1px_rgba(0,0,0,0.1),0_2px_4px_-2px_rgba(0,0,0,0.1)] relative">

<div className="absolute inset-0 bg-on-surface/5 rounded-xl pointer-events-none"></div>
<div className="relative z-10 bg-surface-container-lowest border border-outline-variant rounded-lg p-6 shadow-[0_10px_15px_-3px_rgba(0,0,0,0.1),0_4px_6px_-4px_rgba(0,0,0,0.1)] m-4 max-w-sm mx-auto text-center">
<span className="material-symbols-outlined text-tertiary text-4xl mb-3" data-weight="fill" style={{ "fontVariationSettings": "'FILL' 1" }}>timer</span>
<h3 className="font-headline-md text-headline-md text-on-surface mb-2">Session Expired</h3>
<p className="font-body-md text-body-md text-on-surface-variant mb-6">For your security, you have been automatically logged out due to inactivity.</p>
<button className="w-full bg-primary-container text-on-primary rounded-lg py-3 font-label-md text-label-md hover:bg-surface-tint transition-colors shadow-sm" type="button">
                        Log In Again
                    </button>
</div>
</div>
</div>
</main>

<footer className="bg-surface-container-low dark:bg-surface-container-lowest w-full py-8 mt-auto border-t border-outline-variant">
<div className="flex flex-col md:flex-row justify-between items-center px-gutter gap-4 max-w-container-max mx-auto">
<div className="font-caption text-caption text-secondary dark:text-secondary-fixed-dim">
                © 2024 INNOVATIVE'26 Department of Computer Engineering, T.M.E's J.T.M. College of Engineering, Faizpur. Built for innovators.
            </div>
<div className="flex flex-wrap gap-4 items-center justify-center">
<a className="font-caption text-caption text-on-surface-variant hover:text-primary dark:hover:text-primary-fixed transition-all" href="#">Privacy Policy</a>
<a className="font-caption text-caption text-on-surface-variant hover:text-primary dark:hover:text-primary-fixed transition-all" href="#">Terms of Service</a>
<a className="font-caption text-caption text-on-surface-variant hover:text-primary dark:hover:text-primary-fixed transition-all" href="#">Contact Organizer</a>
</div>
</div>
</footer>

    </>
  );
}
