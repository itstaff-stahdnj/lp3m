import { usePage } from '@inertiajs/react';

import AppLogoIcon from '@/components/app-logo-icon';

export default function AppLogo() {
    return (
        <>
            <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-amber-500 text-slate-950 font-bold shadow-sm">
                <span className="text-xs font-black tracking-wider">LP3M</span>
            </div>
            <div className="ml-1.5 grid flex-1 text-left text-sm">
                <span className="truncate leading-tight font-bold text-slate-900 dark:text-slate-100">
                    LP3M STAH DNJ
                </span>
                <span className="truncate text-[10px] text-slate-500 font-medium">
                    Penjaminan & Mutu
                </span>
            </div>
        </>
    );
}
