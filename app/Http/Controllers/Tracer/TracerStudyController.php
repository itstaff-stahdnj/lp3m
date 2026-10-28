<?php

namespace App\Http\Controllers\Tracer;

use App\Http\Controllers\Controller;
use App\Models\ProgramStudi;
use App\Models\TracerStudy;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class TracerStudyController extends Controller
{
    public function index(Request $request): Response
    {
        $prodiId = $request->query('prodi_id');
        $tahunLulus = $request->query('tahun_lulus');

        $query = TracerStudy::with('programStudi')->orderByDesc('tahun_lulus')->orderBy('nama_alumni');

        if ($prodiId) {
            $query->where('program_studi_id', $prodiId);
        }

        if ($tahunLulus) {
            $query->where('tahun_lulus', $tahunLulus);
        }

        $alumnis = $query->get();
        $prodis = ProgramStudi::where('is_active', true)->orderBy('nama')->get();

        // Statistik Tracer Study
        $totalAlumni = TracerStudy::count();
        $bekerjaCount = TracerStudy::whereIn('status_alumni', ['Bekerja Penuh', 'Bekerja Paruh Waktu', 'Wiraswasta'])->count();
        $serapanPct = $totalAlumni > 0 ? round(($bekerjaCount / $totalAlumni) * 100, 1) : 0;

        $sesuaiCount = TracerStudy::whereIn('kesesuaian_bidang', ['Sangat Sesuai', 'Sesuai'])->count();
        $relevansiPct = $totalAlumni > 0 ? round(($sesuaiCount / $totalAlumni) * 100, 1) : 0;

        $avgMasaTunggu = $totalAlumni > 0 ? round(TracerStudy::avg('masa_tunggu_bulan'), 1) : 0;

        $stats = [
            'total_alumni' => $totalAlumni,
            'serapan_persen' => $serapanPct,
            'relevansi_persen' => $relevansiPct,
            'avg_masa_tunggu' => $avgMasaTunggu,
            'wiraswasta_count' => TracerStudy::where('status_alumni', 'Wiraswasta')->count(),
            'lanjut_studi_count' => TracerStudy::where('status_alumni', 'Melanjutkan Studi')->count(),
        ];

        return Inertia::render('tracer/index', [
            'alumnis' => $alumnis,
            'prodis' => $prodis,
            'stats' => $stats,
            'currentProdi' => $prodiId ?? 'all',
            'currentTahun' => $tahunLulus ?? 'all',
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'program_studi_id' => ['required', 'exists:program_studis,id'],
            'tahun_lulus' => ['required', 'integer', 'min:2000', 'max:2099'],
            'nama_alumni' => ['required', 'string', 'max:255'],
            'nim' => ['required', 'string', 'max:30', 'unique:tracer_studies,nim'],
            'email' => ['nullable', 'email'],
            'nomor_hp' => ['nullable', 'string', 'max:30'],
            'status_alumni' => ['required', 'in:Bekerja Penuh,Bekerja Paruh Waktu,Wiraswasta,Melanjutkan Studi,Mencari Kerja'],
            'nama_instansi' => ['nullable', 'string', 'max:255'],
            'posisi_jabatan' => ['nullable', 'string', 'max:255'],
            'masa_tunggu_bulan' => ['required', 'integer', 'min:0'],
            'pendapatan_bulanan' => ['required', 'in:< 3 Juta,3 - 5 Juta,5 - 10 Juta,> 10 Juta'],
            'kesesuaian_bidang' => ['required', 'in:Sangat Sesuai,Sesuai,Kurang Sesuai,Tidak Sesuai'],
            'rekomendasi_alumni' => ['nullable', 'string'],
        ]);

        TracerStudy::create($validated);

        return back()->with('success', 'Data Tracer Study Alumni berhasil ditambahkan.');
    }

    public function update(Request $request, TracerStudy $tracer): RedirectResponse
    {
        $validated = $request->validate([
            'program_studi_id' => ['required', 'exists:program_studis,id'],
            'tahun_lulus' => ['required', 'integer', 'min:2000', 'max:2099'],
            'nama_alumni' => ['required', 'string', 'max:255'],
            'nim' => ['required', 'string', 'max:30', 'unique:tracer_studies,nim,'.$tracer->id],
            'email' => ['nullable', 'email'],
            'nomor_hp' => ['nullable', 'string', 'max:30'],
            'status_alumni' => ['required', 'in:Bekerja Penuh,Bekerja Paruh Waktu,Wiraswasta,Melanjutkan Studi,Mencari Kerja'],
            'nama_instansi' => ['nullable', 'string', 'max:255'],
            'posisi_jabatan' => ['nullable', 'string', 'max:255'],
            'masa_tunggu_bulan' => ['required', 'integer', 'min:0'],
            'pendapatan_bulanan' => ['required', 'in:< 3 Juta,3 - 5 Juta,5 - 10 Juta,> 10 Juta'],
            'kesesuaian_bidang' => ['required', 'in:Sangat Sesuai,Sesuai,Kurang Sesuai,Tidak Sesuai'],
            'rekomendasi_alumni' => ['nullable', 'string'],
        ]);

        $tracer->update($validated);

        return back()->with('success', 'Data Tracer Study Alumni berhasil diperbarui.');
    }

    public function destroy(TracerStudy $tracer): RedirectResponse
    {
        $tracer->delete();

        return back()->with('success', 'Data Tracer Study Alumni berhasil dihapus.');
    }
}
