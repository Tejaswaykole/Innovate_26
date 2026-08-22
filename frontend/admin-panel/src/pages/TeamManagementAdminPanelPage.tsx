// @ts-nocheck
import React from 'react';

export default function Component() {
  return (
    <>
      

<nav className="hidden md:flex bg-surface/80 dark:bg-surface-dim/80 backdrop-blur-md fixed top-0 w-full z-50 border-b border-outline-variant/30 dark:border-outline/20 shadow-sm dark:shadow-none font-body-md text-body-md">
<div className="flex justify-between items-center h-16 px-gutter max-w-container-max mx-auto w-full">
<div className="flex items-center gap-lg">
<div className="font-headline-md text-headline-md font-extrabold text-primary dark:text-inverse-primary tracking-tight">INNOVATE'26 Pro</div>

<div className="relative w-64 ml-4">
<span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline-variant">search</span>
<input className="w-full pl-10 pr-4 py-2 bg-surface-container-low border border-outline-variant rounded-lg focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all font-body-md text-body-md" placeholder="Search teams..." type="text"/>
</div>
</div>
<div className="flex items-center gap-md">

<div className="flex gap-md mr-lg">
<a className="text-secondary dark:text-secondary-fixed-dim hover:text-primary dark:hover:text-inverse-primary transition-colors hover:bg-surface-container-low dark:hover:bg-surface-container-highest rounded-lg px-3 py-2" href="#">Dashboard</a>
<a className="text-primary dark:text-inverse-primary font-semibold border-b-2 border-primary pb-1 px-3 py-2 hover:bg-surface-container-low dark:hover:bg-surface-container-highest rounded-lg transition-all active:scale-95 duration-150" href="#">Teams</a>
<a className="text-secondary dark:text-secondary-fixed-dim hover:text-primary dark:hover:text-inverse-primary transition-colors hover:bg-surface-container-low dark:hover:bg-surface-container-highest rounded-lg px-3 py-2" href="#">Schedule</a>
<a className="text-secondary dark:text-secondary-fixed-dim hover:text-primary dark:hover:text-inverse-primary transition-colors hover:bg-surface-container-low dark:hover:bg-surface-container-highest rounded-lg px-3 py-2" href="#">Judging</a>
<a className="text-secondary dark:text-secondary-fixed-dim hover:text-primary dark:hover:text-inverse-primary transition-colors hover:bg-surface-container-low dark:hover:bg-surface-container-highest rounded-lg px-3 py-2" href="#">Sponsors</a>
</div>

<button className="bg-primary text-on-primary px-4 py-2 rounded-lg font-label-md text-label-md hover:bg-primary-fixed-variant transition-colors">Register Now</button>
<button className="p-2 text-on-surface hover:bg-surface-container-high rounded-full transition-colors">
<span className="material-symbols-outlined">notifications</span>
</button>
<button className="p-2 text-on-surface hover:bg-surface-container-high rounded-full transition-colors">
<span className="material-symbols-outlined">help</span>
</button>
<img alt="User profile" className="w-8 h-8 rounded-full border border-outline-variant object-cover" data-alt="A small circular user profile picture showing a professional headshot of a young adult looking directly at the camera, well-lit, corporate modern style, isolated on a clean background." src="https://lh3.googleusercontent.com/aida-public/AB6AXuDUUtmzwsX9RUVyV4UdB-cMgwIA9qfxK4GhaWqAvcoxMqaOi8hLg5x6TOmdYfcjDlCw399-I1dGSUy9NWejpDSqezLBu6h1vP-vK_y8eCQuvnZws3GAnAz-nEXe7s5XiLpyKLyXl1syvglyaYh5dYdk3Ej99b23DBqWePnRod0BTRrgY3K0vhJ5CnuJNGxyGe8yDK9iGJNxMLIrJUwuhh_6BBw0wqrMwVipNoadlIdYYTB6EpL9tm8l"/>
</div>
</div>
</nav>

<nav className="md:hidden fixed bottom-0 w-full rounded-t-xl bg-surface/95 dark:bg-surface-dim/95 backdrop-blur-lg border-t border-outline-variant/50 shadow-lg shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)] z-50 font-caption text-caption">
<div className="flex justify-around items-center h-16 px-4 pb-safe">
<a className="flex flex-col items-center justify-center text-secondary dark:text-secondary-fixed-dim active:bg-surface-container-high transition-all duration-200 ease-in-out p-2 rounded-lg" href="#">
<span className="material-symbols-outlined mb-1">home</span>
                Home
            </a>
<a className="flex flex-col items-center justify-center text-secondary dark:text-secondary-fixed-dim active:bg-surface-container-high transition-all duration-200 ease-in-out p-2 rounded-lg" href="#">
<span className="material-symbols-outlined mb-1">event</span>
                Schedule
            </a>
<a className="flex flex-col items-center justify-center text-primary dark:text-inverse-primary bg-primary-container/20 rounded-xl px-4 py-1 active:bg-surface-container-high transition-all duration-200 ease-in-out" href="#">
<span className="material-symbols-outlined mb-1" style={{ "fontVariationSettings": "'FILL' 1" }}>groups</span>
                Team
            </a>
<a className="flex flex-col items-center justify-center text-secondary dark:text-secondary-fixed-dim active:bg-surface-container-high transition-all duration-200 ease-in-out p-2 rounded-lg" href="#">
<span className="material-symbols-outlined mb-1">account_circle</span>
                Profile
            </a>
</div>
</nav>

<main className="flex-1 mt-16 mb-16 md:mb-0 p-md md:p-gutter max-w-container-max mx-auto w-full">

<header className="flex flex-col md:flex-row md:items-end justify-between mb-lg gap-md">
<div>
<h1 className="font-headline-lg text-headline-lg text-on-surface mb-sm">Team Management</h1>
<p className="font-body-md text-body-md text-on-surface-variant">Oversee all registered teams, track eligibility requirements, and monitor submission statuses.</p>
</div>
<div className="flex gap-sm">
<button className="flex items-center gap-xs px-4 py-2 border border-outline text-on-surface rounded-lg font-label-md text-label-md hover:bg-surface-container-low transition-colors">
<span className="material-symbols-outlined text-[18px]">download</span>
                    Export CSV
                </button>
<button className="flex items-center gap-xs px-4 py-2 bg-primary text-on-primary rounded-lg font-label-md text-label-md hover:bg-primary-fixed-variant transition-colors shadow-sm">
<span className="material-symbols-outlined text-[18px]">add</span>
                    New Team
                </button>
</div>
</header>

<div className="grid grid-cols-1 md:grid-cols-4 gap-md mb-lg">
<div className="bg-surface-container-lowest p-md rounded-xl border border-outline-variant/50 shadow-sm flex flex-col justify-between h-[120px]">
<div className="flex justify-between items-start">
<span className="font-label-md text-label-md text-on-surface-variant uppercase tracking-wider">Total Teams</span>
<span className="material-symbols-outlined text-primary bg-primary-container/10 p-1 rounded-md">groups</span>
</div>
<div className="font-display-lg text-display-lg text-on-surface leading-none">142</div>
</div>
<div className="bg-surface-container-lowest p-md rounded-xl border border-outline-variant/50 shadow-sm flex flex-col justify-between h-[120px]">
<div className="flex justify-between items-start">
<span className="font-label-md text-label-md text-on-surface-variant uppercase tracking-wider">Eligible</span>
<span className="material-symbols-outlined text-primary bg-primary-container/10 p-1 rounded-md">check_circle</span>
</div>
<div className="flex items-baseline gap-2">
<span className="font-display-lg text-display-lg text-on-surface leading-none">89</span>
<span className="font-caption text-caption text-secondary">/142</span>
</div>
<div className="w-full bg-surface-variant h-1 mt-2 rounded-full overflow-hidden">
<div className="bg-primary h-full rounded-full" style={{ "width": "62%" }}></div>
</div>
</div>
<div className="bg-surface-container-lowest p-md rounded-xl border border-outline-variant/50 shadow-sm flex flex-col justify-between h-[120px]">
<div className="flex justify-between items-start">
<span className="font-label-md text-label-md text-on-surface-variant uppercase tracking-wider">Missing Req.</span>
<span className="material-symbols-outlined text-error bg-error-container/20 p-1 rounded-md">warning</span>
</div>
<div className="font-display-lg text-display-lg text-error leading-none">24</div>
<div className="font-caption text-caption text-error">Teams missing female member req.</div>
</div>
<div className="bg-surface-container-lowest p-md rounded-xl border border-outline-variant/50 shadow-sm flex flex-col justify-between h-[120px]">
<div className="flex justify-between items-start">
<span className="font-label-md text-label-md text-on-surface-variant uppercase tracking-wider">Submissions</span>
<span className="material-symbols-outlined text-secondary bg-surface-variant p-1 rounded-md">upload_file</span>
</div>
<div className="flex items-baseline gap-2">
<span className="font-display-lg text-display-lg text-on-surface leading-none">12</span>
<span className="font-caption text-caption text-secondary">Submitted</span>
</div>
</div>
</div>

<div className="bg-surface-container-lowest rounded-xl border border-outline-variant/50 shadow-[0_1px_3px_0_rgba(0,0,0,0.1),0_1px_2px_-1px_rgba(0,0,0,0.1)] overflow-hidden">

<div className="p-md border-b border-outline-variant/30 bg-surface-bright flex flex-col md:flex-row justify-between items-center gap-md">
<div className="flex gap-sm w-full md:w-auto">
<div className="relative w-full md:w-64">
<span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline-variant text-[20px]">search</span>
<input className="w-full pl-9 pr-4 py-2 bg-surface border border-outline-variant rounded-lg focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all font-body-md text-body-md text-sm" placeholder="Search team or leader..." type="text"/>
</div>
</div>
<div className="flex gap-sm w-full md:w-auto overflow-x-auto pb-1 md:pb-0 hide-scrollbar">
<select className="bg-surface border border-outline-variant rounded-lg px-3 py-2 font-label-md text-label-md text-on-surface-variant focus:outline-none focus:border-primary min-w-[140px]">
<option>Eligibility: All</option>
<option>Eligible</option>
<option>Not Eligible</option>
</select>
<select className="bg-surface border border-outline-variant rounded-lg px-3 py-2 font-label-md text-label-md text-on-surface-variant focus:outline-none focus:border-primary min-w-[160px]">
<option>Submission: All</option>
<option>Submitted</option>
<option>Draft</option>
<option>Not Started</option>
</select>
<button className="flex items-center gap-xs px-3 py-2 border border-outline-variant text-on-surface-variant rounded-lg font-label-md text-label-md hover:bg-surface-container-low transition-colors whitespace-nowrap">
<span className="material-symbols-outlined text-[18px]">filter_list</span>
                        More Filters
                    </button>
</div>
</div>

<div className="overflow-x-auto">
<table className="w-full text-left border-collapse">
<thead>
<tr className="bg-surface-container-low border-b border-outline-variant/50 font-label-md text-label-md text-on-surface-variant uppercase tracking-wider text-xs">
<th className="p-md font-semibold w-1/4">Team Info</th>
<th className="p-md font-semibold w-1/5">Leader</th>
<th className="p-md font-semibold text-center">Members</th>
<th className="p-md font-semibold text-center">Eligibility</th>
<th className="p-md font-semibold text-center">Submission</th>
<th className="p-md font-semibold text-right w-16">Actions</th>
</tr>
</thead>
<tbody className="font-body-md text-body-md text-sm divide-y divide-outline-variant/30">

<tr className="hover:bg-surface-bright transition-colors group">
<td className="p-md">
<div className="flex items-center gap-3">
<div className="w-10 h-10 rounded-lg bg-primary-container/20 text-primary flex items-center justify-center font-headline-md text-headline-md">N</div>
<div>
<div className="font-semibold text-on-surface">Neural Knights</div>
<div className="font-caption text-caption text-on-surface-variant">Track: AI/ML</div>
</div>
</div>
</td>
<td className="p-md">
<div className="flex items-center gap-2">
<img alt="Leader avatar" className="w-6 h-6 rounded-full object-cover" data-alt="A small circular headshot of a young professional female developer with glasses, smiling, bright corporate lighting, clean background." src="https://lh3.googleusercontent.com/aida-public/AB6AXuAVK2i1ZjbBhu2j9cn360t91trMhsYhEYnsY4rYHrgRMVZ1RBwvb_3N5TKUBEEln5wL2GpMNjpK8_y7WW5ehY6nyD9twfoU4iaIHbhuihZXQjr9oEU5BslwU7sTFeLOZe0MpO14LvObF0iET6LwnEPkKfm5LkxVff3drpdOZ7i-JPD-ogwpzfnqlNGyKX0kNtMhjYd-HBXoZMMmsWY3okGVQdwyN8Da4o2iGJJw9ZCzgkFa7sKQBRvs"/>
<span className="text-on-surface">Sarah Chen</span>
</div>
</td>
<td className="p-md text-center">
<div className="inline-flex items-center gap-1 bg-surface-container py-1 px-2 rounded-md">
<span className="material-symbols-outlined text-[16px] text-secondary">group</span>
<span className="font-semibold text-on-surface">4<span className="text-on-surface-variant font-normal">/6</span></span>
</div>
</td>
<td className="p-md text-center">
<span className="inline-flex items-center gap-1 bg-surface-container-low border border-primary/30 text-primary px-2 py-1 rounded-full font-label-md text-[11px] uppercase tracking-wide">
<span className="material-symbols-outlined text-[14px]">check_circle</span>
                                    Eligible
                                </span>
</td>
<td className="p-md text-center">
<span className="inline-flex items-center gap-1 bg-surface-variant text-on-surface px-2 py-1 rounded-full font-label-md text-[11px] uppercase tracking-wide">
                                    Submitted
                                </span>
</td>
<td className="p-md text-right">
<button className="text-on-surface-variant hover:text-primary transition-colors p-1 opacity-0 group-hover:opacity-100 focus:opacity-100">
<span className="material-symbols-outlined">more_vert</span>
</button>
</td>
</tr>

<tr className="hover:bg-surface-bright transition-colors group bg-error-container/5">
<td className="p-md">
<div className="flex items-center gap-3">
<div className="w-10 h-10 rounded-lg bg-surface-variant text-secondary flex items-center justify-center font-headline-md text-headline-md">B</div>
<div>
<div className="font-semibold text-on-surface">Byte Busters</div>
<div className="font-caption text-caption text-on-surface-variant">Track: Web3</div>
</div>
</div>
</td>
<td className="p-md">
<div className="flex items-center gap-2">
<div className="w-6 h-6 rounded-full bg-secondary-container text-on-secondary-container flex items-center justify-center text-xs font-bold">JD</div>
<span className="text-on-surface">John Doe</span>
</div>
</td>
<td className="p-md text-center">
<div className="inline-flex items-center gap-1 bg-surface-container py-1 px-2 rounded-md border border-error/20">
<span className="material-symbols-outlined text-[16px] text-error">group</span>
<span className="font-semibold text-on-surface">3<span className="text-on-surface-variant font-normal">/6</span></span>
</div>
<div className="font-caption text-[10px] text-error mt-1 leading-tight">Missing Female Req.</div>
</td>
<td className="p-md text-center">
<span className="inline-flex items-center gap-1 bg-error-container/30 text-error px-2 py-1 rounded-full font-label-md text-[11px] uppercase tracking-wide">
<span className="material-symbols-outlined text-[14px]">cancel</span>
                                    Not Eligible
                                </span>
</td>
<td className="p-md text-center">
<span className="inline-flex items-center gap-1 border border-outline-variant text-on-surface-variant px-2 py-1 rounded-full font-label-md text-[11px] uppercase tracking-wide">
                                    Draft
                                </span>
</td>
<td className="p-md text-right">
<button className="text-on-surface-variant hover:text-primary transition-colors p-1 opacity-0 group-hover:opacity-100 focus:opacity-100">
<span className="material-symbols-outlined">more_vert</span>
</button>
</td>
</tr>

<tr className="hover:bg-surface-bright transition-colors group">
<td className="p-md">
<div className="flex items-center gap-3">
<div className="w-10 h-10 rounded-lg bg-tertiary-container/20 text-tertiary flex items-center justify-center font-headline-md text-headline-md">Q</div>
<div>
<div className="font-semibold text-on-surface">Quantum Quarks</div>
<div className="font-caption text-caption text-on-surface-variant">Track: Open</div>
</div>
</div>
</td>
<td className="p-md">
<div className="flex items-center gap-2">
<img alt="Leader avatar" className="w-6 h-6 rounded-full object-cover" data-alt="A small circular headshot of a young male developer, wearing a dark casual shirt, smiling slightly, modern corporate portrait style." src="https://lh3.googleusercontent.com/aida-public/AB6AXuALnQfdnltBbpXJ19GHJ7P-wo-73CHuxcn-5XZLQDCPsJFTEdOZrRrT0yr74w6q26yLq0F881yEWJyxcWFBUALHovAV4sgRoqJ6HjpiMwMtOs4nyW6DwzCKBoiwj0W0hbg2AL1Uiu6pxnbXSfEVkJesWeVgIhNi_E1V_NuDAc_nMNTgW-yiA3kvr03fJnCdCHtfVJv90iFU6Em0Fj4U8STfgZWxZBBqfzzERJmp_TmpGECvOrGwHLBQ"/>
<span className="text-on-surface">Mike Ross</span>
</div>
</td>
<td className="p-md text-center">
<div className="inline-flex items-center gap-1 bg-surface-container py-1 px-2 rounded-md">
<span className="material-symbols-outlined text-[16px] text-secondary">group</span>
<span className="font-semibold text-on-surface">5<span className="text-on-surface-variant font-normal">/6</span></span>
</div>
</td>
<td className="p-md text-center">
<span className="inline-flex items-center gap-1 bg-surface-container-low border border-primary/30 text-primary px-2 py-1 rounded-full font-label-md text-[11px] uppercase tracking-wide">
<span className="material-symbols-outlined text-[14px]">check_circle</span>
                                    Eligible
                                </span>
</td>
<td className="p-md text-center">
<span className="inline-flex items-center gap-1 border border-outline-variant text-on-surface-variant px-2 py-1 rounded-full font-label-md text-[11px] uppercase tracking-wide">
                                    Draft
                                </span>
</td>
<td className="p-md text-right">
<button className="text-on-surface-variant hover:text-primary transition-colors p-1 opacity-0 group-hover:opacity-100 focus:opacity-100">
<span className="material-symbols-outlined">more_vert</span>
</button>
</td>
</tr>
</tbody>
</table>
</div>

<div className="p-md border-t border-outline-variant/30 bg-surface flex items-center justify-between font-caption text-caption text-on-surface-variant">
<div>Showing 1 to 3 of 142 teams</div>
<div className="flex gap-2">
<button className="px-3 py-1 border border-outline-variant rounded hover:bg-surface-container-low disabled:opacity-50">Prev</button>
<button className="px-3 py-1 bg-primary text-on-primary rounded hover:bg-primary-fixed-variant">1</button>
<button className="px-3 py-1 border border-outline-variant rounded hover:bg-surface-container-low">2</button>
<button className="px-3 py-1 border border-outline-variant rounded hover:bg-surface-container-low">3</button>
<button className="px-3 py-1 border border-outline-variant rounded hover:bg-surface-container-low">Next</button>
</div>
</div>
</div>
</main>


    </>
  );
}
