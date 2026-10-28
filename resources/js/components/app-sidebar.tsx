import { Link } from '@inertiajs/react';
import {
    LayoutGrid,
    GraduationCap,
    Building2,
    CalendarDays,
    Landmark,
    Users,
    ShieldCheck,
    ClipboardCheck,
    TrendingUp,
    FilePieChart,
    ExternalLink,
    FileText,
    Activity,
    AlertTriangle,
    Award,
    Calendar,
    UserCheck,
} from 'lucide-react';
import AppLogo from '@/components/app-logo';
import { NavFooter } from '@/components/nav-footer';
import { NavUser } from '@/components/nav-user';
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarGroupLabel,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarMenuBadge,
} from '@/components/ui/sidebar';
import { useCurrentUrl } from '@/hooks/use-current-url';
import type { NavItem } from '@/types';

export function AppSidebar() {
    const { isCurrentUrl, isCurrentOrParentUrl } = useCurrentUrl();

    const spmiNavItems = [
        {
            title: 'Standar Mutu (SN-Dikti)',
            href: '/spmi/standar',
            icon: ShieldCheck,
        },
        {
            title: 'Evaluasi & Gap Capaian',
            href: '/spmi/evaluasi',
            icon: Activity,
        },
        {
            title: 'Dokumen & Manual SPMI',
            href: '/spmi/dokumen',
            icon: FileText,
        },
    ];

    const amiNavItems = [
        {
            title: 'Jadwal & Visitasi Audit',
            href: '/ami/jadwal',
            icon: ClipboardCheck,
        },
        {
            title: 'Temuan & Tindakan Koreksi (PTK)',
            href: '/ami/temuan',
            icon: AlertTriangle,
        },
        {
            title: 'Siklus Periode AMI',
            href: '/ami/periode',
            icon: Calendar,
        },
    ];

    const akreditasiNavItems = [
        {
            title: '9 Kriteria & Simulasi Skor',
            href: '/akreditasi',
            icon: Award,
        },
    ];

    const masterNavItems = [
        {
            title: 'Program Studi',
            href: '/master/prodi',
            icon: GraduationCap,
        },
        {
            title: 'Unit Kerja',
            href: '/master/unit-kerja',
            icon: Building2,
        },
        {
            title: 'Tahun Akademik',
            href: '/master/tahun-akademik',
            icon: CalendarDays,
        },
        {
            title: 'Profil Institusi',
            href: '/master/profil',
            icon: Landmark,
        },
        {
            title: 'Manajemen Pengguna',
            href: '/master/users',
            icon: Users,
        },
    ];

    const surveiNavItems = [
        {
            title: 'Kuesioner & EDOM',
            href: '/survei/kuesioner',
            icon: FilePieChart,
        },
        {
            title: 'Tracer Study Alumni',
            href: '/tracer',
            icon: UserCheck,
        },
    ];

    const monevNavItems = [
        {
            title: 'Monev Tridharma & IKU',
            href: '/monev/iku',
            icon: TrendingUp,
        },
        {
            title: 'Pelatihan & Sertifikat SDM',
            href: '/pelatihan',
            icon: Award,
        },
    ];

    const laporanNavItems = [
        {
            title: 'Laporan Kinerja Tahunan',
            href: '/laporan',
            icon: FileText,
        },
        {
            title: 'Rapat Tinjauan Manajemen (RTM)',
            href: '/laporan/rtm',
            icon: Users,
        },
        {
            title: 'Surat Mutu & E-Sertifikat',
            href: '/surat',
            icon: Award,
        },
    ];

    const footerNavItems: NavItem[] = [
        {
            title: 'Portal STAH DNJ',
            href: 'https://stahdnj.ac.id',
            icon: ExternalLink,
        },
    ];

    return (
        <Sidebar collapsible="icon" variant="inset">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link href="/dashboard" prefetch>
                                <AppLogo />
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent className="space-y-1">
                {/* Menu Utama */}
                <SidebarGroup className="px-2 py-0">
                    <SidebarGroupLabel>Menu Utama</SidebarGroupLabel>
                    <SidebarMenu>
                        <SidebarMenuItem>
                            <SidebarMenuButton
                                asChild
                                isActive={isCurrentUrl('/dashboard')}
                                tooltip={{ children: 'Dashboard' }}
                            >
                                <Link href="/dashboard" prefetch>
                                    <LayoutGrid />
                                    <span>Dashboard LP3M</span>
                                </Link>
                            </SidebarMenuButton>
                        </SidebarMenuItem>
                    </SidebarMenu>
                </SidebarGroup>

                {/* Modul SPMI (Fase 2) */}
                <SidebarGroup className="px-2 py-0">
                    <SidebarGroupLabel>Penjaminan Mutu (SPMI)</SidebarGroupLabel>
                    <SidebarMenu>
                        {spmiNavItems.map((item) => (
                            <SidebarMenuItem key={item.href}>
                                <SidebarMenuButton
                                    asChild
                                    isActive={isCurrentOrParentUrl(item.href)}
                                    tooltip={{ children: item.title }}
                                >
                                    <Link href={item.href} prefetch>
                                        <item.icon />
                                        <span>{item.title}</span>
                                    </Link>
                                </SidebarMenuButton>
                            </SidebarMenuItem>
                        ))}
                    </SidebarMenu>
                </SidebarGroup>

                {/* Modul Audit Mutu Internal (Fase 3) */}
                <SidebarGroup className="px-2 py-0">
                    <SidebarGroupLabel>Audit Mutu Internal (AMI)</SidebarGroupLabel>
                    <SidebarMenu>
                        {amiNavItems.map((item) => (
                            <SidebarMenuItem key={item.href}>
                                <SidebarMenuButton
                                    asChild
                                    isActive={isCurrentOrParentUrl(item.href)}
                                    tooltip={{ children: item.title }}
                                >
                                    <Link href={item.href} prefetch>
                                        <item.icon />
                                        <span>{item.title}</span>
                                    </Link>
                                </SidebarMenuButton>
                            </SidebarMenuItem>
                        ))}
                    </SidebarMenu>
                </SidebarGroup>

                {/* Modul Akreditasi (Fase 3) */}
                <SidebarGroup className="px-2 py-0">
                    <SidebarGroupLabel>Akreditasi BAN-PT/LAM</SidebarGroupLabel>
                    <SidebarMenu>
                        {akreditasiNavItems.map((item) => (
                            <SidebarMenuItem key={item.href}>
                                <SidebarMenuButton
                                    asChild
                                    isActive={isCurrentOrParentUrl(item.href)}
                                    tooltip={{ children: item.title }}
                                >
                                    <Link href={item.href} prefetch>
                                        <item.icon />
                                        <span>{item.title}</span>
                                    </Link>
                                </SidebarMenuButton>
                            </SidebarMenuItem>
                        ))}
                    </SidebarMenu>
                </SidebarGroup>

                {/* Modul Survei & Tracer Study (Fase 4) */}
                <SidebarGroup className="px-2 py-0">
                    <SidebarGroupLabel>Survei & Tracer Study</SidebarGroupLabel>
                    <SidebarMenu>
                        {surveiNavItems.map((item) => (
                            <SidebarMenuItem key={item.href}>
                                <SidebarMenuButton
                                    asChild
                                    isActive={isCurrentOrParentUrl(item.href)}
                                    tooltip={{ children: item.title }}
                                >
                                    <Link href={item.href} prefetch>
                                        <item.icon />
                                        <span>{item.title}</span>
                                    </Link>
                                </SidebarMenuButton>
                            </SidebarMenuItem>
                        ))}
                    </SidebarMenu>
                </SidebarGroup>

                {/* Modul Monev & Pelatihan SDM (Fase 5) */}
                <SidebarGroup className="px-2 py-0">
                    <SidebarGroupLabel>Monev & Pelatihan SDM</SidebarGroupLabel>
                    <SidebarMenu>
                        {monevNavItems.map((item) => (
                            <SidebarMenuItem key={item.href}>
                                <SidebarMenuButton
                                    asChild
                                    isActive={isCurrentOrParentUrl(item.href)}
                                    tooltip={{ children: item.title }}
                                >
                                    <Link href={item.href} prefetch>
                                        <item.icon />
                                        <span>{item.title}</span>
                                    </Link>
                                </SidebarMenuButton>
                            </SidebarMenuItem>
                        ))}
                    </SidebarMenu>
                </SidebarGroup>

                {/* Data Master */}
                <SidebarGroup className="px-2 py-0">
                    <SidebarGroupLabel>Data Master</SidebarGroupLabel>
                    <SidebarMenu>
                        {masterNavItems.map((item) => (
                            <SidebarMenuItem key={item.href}>
                                <SidebarMenuButton
                                    asChild
                                    isActive={isCurrentOrParentUrl(item.href)}
                                    tooltip={{ children: item.title }}
                                >
                                    <Link href={item.href} prefetch>
                                        <item.icon />
                                        <span>{item.title}</span>
                                    </Link>
                                </SidebarMenuButton>
                            </SidebarMenuItem>
                        ))}
                    </SidebarMenu>
                </SidebarGroup>

                {/* Modul Laporan & RTM (Fase 6) */}
                <SidebarGroup className="px-2 py-0">
                    <SidebarGroupLabel>Laporan & Pengendalian Mutu</SidebarGroupLabel>
                    <SidebarMenu>
                        {laporanNavItems.map((item) => (
                            <SidebarMenuItem key={item.href}>
                                <SidebarMenuButton
                                    asChild
                                    isActive={isCurrentOrParentUrl(item.href)}
                                    tooltip={{ children: item.title }}
                                >
                                    <Link href={item.href} prefetch>
                                        <item.icon />
                                        <span>{item.title}</span>
                                    </Link>
                                </SidebarMenuButton>
                            </SidebarMenuItem>
                        ))}
                    </SidebarMenu>
                </SidebarGroup>
            </SidebarContent>

            <SidebarFooter>
                <NavFooter items={footerNavItems} className="mt-auto" />
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
