<?php

namespace App\Http\Controllers\Monev;

use App\Http\Controllers\Controller;
use App\Models\Iku;
use App\Models\MonevIku;
use App\Models\ProgramStudi;
use App\Models\TahunAkademik;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class MonevIkuController extends Controller
{
    public function index(Request $request): Response
    {
        $prodiId = $request->query('prodi_id');
        $prodis = ProgramStudi::where('is_active', true)->orderBy('nama')->get();
        $activeProdi = $prodiId ? ProgramStudi::find($prodiId) : $prodis->first();

        $tahunAkademiks = TahunAkademik::orderByDesc('kode')->get();
        $taId = $request->query('ta_id');
        $activeTa = $taId ? TahunAkademik::find($taId) : TahunAkademik::active() ?? $tahunAkademiks->first();

        $ikus = Iku::orderBy('nomor')->get();

        $monevs = collect();
        if ($activeTa && $activeProdi) {
            $monevs = MonevIku::with('iku')
                ->where('tahun_akademik_id', $activeTa->id)
                ->where('program_studi_id', $activeProdi->id)
                ->get()
                ->keyBy('iku_id');
        }

        // Summary statistics
        $totalIku = $ikus->count();
        $tercapaiCount = $monevs->where('status', 'Tercapai')->count();
        $sebagianCount = $monevs->where('status', 'Sebagian Tercapai')->count();
        $belumCount = $totalIku - ($tercapaiCount + $sebagianCount);
        $avgPct = $monevs->count() > 0 ? round($monevs->avg('persentase_capaian'), 1) : 0;

        $stats = [
            'total_iku' => $totalIku,
            'tercapai_count' => $tercapaiCount,
            'sebagian_count' => $sebagianCount,
            'belum_count' => max(0, $belumCount),
            'avg_persentase' => $avgPct,
        ];

        return Inertia::render('monev/iku/index', [
            'ikus' => $ikus,
            'monevs' => $monevs,
            'prodis' => $prodis,
            'activeProdi' => $activeProdi,
            'tahunAkademiks' => $tahunAkademiks,
            'activeTa' => $activeTa,
            'stats' => $stats,
        ]);
    }

    public function saveCapaian(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'iku_id' => ['required', 'exists:ikus,id'],
            'tahun_akademik_id' => ['required', 'exists:tahun_akademiks,id'],
            'program_studi_id' => ['required', 'exists:program_studis,id'],
            'target' => ['required', 'numeric', 'min:0'],
            'realisasi' => ['required', 'numeric', 'min:0'],
            'kendala' => ['nullable', 'string'],
            'strategi_tindak_lanjut' => ['nullable', 'string'],
            'bukti_dokumen_url' => ['nullable', 'string', 'max:255'],
        ]);

        $target = floatval($validated['target']);
        $realisasi = floatval($validated['realisasi']);
        $pct = $target > 0 ? round(($realisasi / $target) * 100, 1) : 100;

        if ($pct >= 100) {
            $status = 'Tercapai';
        } elseif ($pct >= 75) {
            $status = 'Sebagian Tercapai';
        } else {
            $status = 'Belum Tercapai';
        }

        MonevIku::updateOrCreate(
            [
                'iku_id' => $validated['iku_id'],
                'tahun_akademik_id' => $validated['tahun_akademik_id'],
                'program_studi_id' => $validated['program_studi_id'],
            ],
            [
                'target' => $target,
                'realisasi' => $realisasi,
                'persentase_capaian' => $pct,
                'status' => $status,
                'kendala' => $validated['kendala'] ?? null,
                'strategi_tindak_lanjut' => $validated['strategi_tindak_lanjut'] ?? null,
                'bukti_dokumen_url' => $validated['bukti_dokumen_url'] ?? null,
            ]
        );

        return back()->with('success', 'Data capaian IKU berhasil diperbarui.');
    }
}
