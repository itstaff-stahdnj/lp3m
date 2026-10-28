<?php

namespace App\Http\Controllers;

use App\Models\ProfilInstitusi;
use App\Models\ProgramStudi;
use App\Models\TahunAkademik;
use App\Models\UnitKerja;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    public function index(Request $request): Response
    {
        $activeYear = TahunAkademik::active();
        $prodis = ProgramStudi::orderBy('jenjang')->orderBy('nama')->get();
        $unitKerjas = UnitKerja::orderBy('nama')->get();
        $institution = ProfilInstitusi::current();

        $stats = [
            'total_prodi' => $prodis->count(),
            'total_unit' => $unitKerjas->count(),
            'total_users' => User::count(),
            'active_semester' => $activeYear ? "{$activeYear->tahun} {$activeYear->semester}" : 'Belum diatur',
            'standar_spmi_count' => 24, // SN-Dikti: 8 Pendidikan, 8 Penelitian, 8 PkM
            'ami_status' => [
                'periode' => 'Siklus AMI 2025/2026',
                'audited_prodi' => 3,
                'total_temuan' => 5,
                'kts_mayor' => 0,
                'kts_minor' => 3,
                'observasi' => 2,
                'status_closing' => 'Dalam Tindak Lanjut PTK',
            ],
            'iku_summary' => [
                ['name' => 'Lulusan Mendapat Pekerjaan Layak', 'target' => 80, 'achieved' => 84, 'unit' => '%'],
                ['name' => 'Mahasiswa Berkegiatan di Luar Kampus (MBKM)', 'target' => 30, 'achieved' => 35, 'unit' => '%'],
                ['name' => 'Dosen Berkegiatan Tridharma di Luar Kampus', 'target' => 50, 'achieved' => 58, 'unit' => '%'],
                ['name' => 'Praktisi Mengajar di Dalam Kampus', 'target' => 20, 'achieved' => 25, 'unit' => '%'],
                ['name' => 'Hasil Kerja Dosen Digunakan Masyarakat', 'target' => 60, 'achieved' => 65, 'unit' => '%'],
                ['name' => 'Program Studi Berstandar Akreditasi Unggul', 'target' => 70, 'achieved' => 67, 'unit' => '%'],
            ],
        ];

        return Inertia::render('dashboard', [
            'stats' => $stats,
            'prodis' => $prodis,
            'unitKerjas' => $unitKerjas,
            'institution' => $institution,
            'activeYear' => $activeYear,
        ]);
    }
}
