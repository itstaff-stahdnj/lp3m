<?php

namespace App\Http\Controllers\Spmi;

use App\Http\Controllers\Controller;
use App\Models\CapaianIndikator;
use App\Models\IndikatorMutu;
use App\Models\ProgramStudi;
use App\Models\StandarMutu;
use App\Models\TahunAkademik;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class EvaluasiSpmiController extends Controller
{
    public function index(Request $request): Response
    {
        $activeYear = TahunAkademik::active() ?? TahunAkademik::first();
        $selectedTahunId = $request->query('tahun_id', $activeYear?->id);
        $selectedProdiId = $request->query('prodi_id');

        $tahunAkademiks = TahunAkademik::orderByDesc('tahun')->orderBy('semester')->get();
        $prodis = ProgramStudi::where('is_active', true)->orderBy('jenjang')->orderBy('nama')->get();

        // Ambil semua standar yang aktif beserta indikator dan capaian untuk tahun & prodi yang dipilih
        $standars = StandarMutu::with([
            'indikators' => function ($query) use ($selectedTahunId, $selectedProdiId) {
                $query->with(['capaians' => function ($q) use ($selectedTahunId, $selectedProdiId) {
                    if ($selectedTahunId) {
                        $q->where('tahun_akademik_id', $selectedTahunId);
                    }
                    if ($selectedProdiId) {
                        $q->where('program_studi_id', $selectedProdiId);
                    }
                }]);
            },
        ])
            ->where('is_active', true)
            ->orderBy('urutan')
            ->get();

        // Rekapitulasi Capaian
        $allCapaiansQuery = CapaianIndikator::query();
        if ($selectedTahunId) {
            $allCapaiansQuery->where('tahun_akademik_id', $selectedTahunId);
        }
        if ($selectedProdiId) {
            $allCapaiansQuery->where('program_studi_id', $selectedProdiId);
        }
        $capaians = $allCapaiansQuery->get();

        $summary = [
            'total_indikator' => IndikatorMutu::where('is_active', true)->count(),
            'terisi' => $capaians->count(),
            'terlampaui' => $capaians->where('status_capaian', 'Terlampaui')->count(),
            'tercapai' => $capaians->where('status_capaian', 'Tercapai')->count(),
            'belum_tercapai' => $capaians->where('status_capaian', 'Belum Tercapai')->count(),
        ];

        return Inertia::render('spmi/evaluasi/index', [
            'standars' => $standars,
            'tahunAkademiks' => $tahunAkademiks,
            'prodis' => $prodis,
            'selectedTahunId' => $selectedTahunId ? (int) $selectedTahunId : null,
            'selectedProdiId' => $selectedProdiId ? (int) $selectedProdiId : null,
            'summary' => $summary,
        ]);
    }

    public function storeOrUpdate(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'indikator_mutu_id' => ['required', 'exists:indikator_mutus,id'],
            'tahun_akademik_id' => ['required', 'exists:tahun_akademiks,id'],
            'program_studi_id' => ['nullable', 'exists:program_studis,id'],
            'realisasi' => ['required', 'string', 'max:100'],
            'status_capaian' => ['required', 'in:Terlampaui,Tercapai,Belum Tercapai'],
            'analisis_capaian' => ['nullable', 'string'],
            'akar_masalah' => ['nullable', 'string'],
            'rencana_tindak_lanjut' => ['nullable', 'string'],
            'bukti_dokumen_url' => ['nullable', 'string', 'max:255'],
        ]);

        CapaianIndikator::updateOrCreate(
            [
                'indikator_mutu_id' => $validated['indikator_mutu_id'],
                'tahun_akademik_id' => $validated['tahun_akademik_id'],
                'program_studi_id' => $validated['program_studi_id'] ?? null,
            ],
            $validated
        );

        return back()->with('success', 'Evaluasi capaian indikator berhasil disimpan.');
    }
}
