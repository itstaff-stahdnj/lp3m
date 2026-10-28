<?php

namespace App\Http\Controllers\Ami;

use App\Http\Controllers\Controller;
use App\Models\JadwalAudit;
use App\Models\TemuanAudit;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class TemuanAuditController extends Controller
{
    public function index(Request $request): Response
    {
        $klasifikasi = $request->query('klasifikasi');
        $status = $request->query('status');

        $query = TemuanAudit::with([
            'jadwalAudit.programStudi',
            'jadwalAudit.unitKerja',
            'jadwalAudit.leadAuditor',
            'jadwalAudit.periodeAudit',
            'standarMutu',
        ])
            ->orderByDesc('created_at');

        if ($klasifikasi && in_array($klasifikasi, ['KTS Mayor', 'KTS Minor', 'Observasi'])) {
            $query->where('klasifikasi', $klasifikasi);
        }

        if ($status && in_array($status, ['Open', 'Proses PTK', 'Menunggu Verifikasi', 'Closed'])) {
            $query->where('status_temuan', $status);
        }

        $temuans = $query->get();

        $stats = [
            'total' => TemuanAudit::count(),
            'kts_mayor' => TemuanAudit::where('klasifikasi', 'KTS Mayor')->count(),
            'kts_minor' => TemuanAudit::where('klasifikasi', 'KTS Minor')->count(),
            'observasi' => TemuanAudit::where('klasifikasi', 'Observasi')->count(),
            'open' => TemuanAudit::where('status_temuan', 'Open')->count(),
            'proses_ptk' => TemuanAudit::where('status_temuan', 'Proses PTK')->count(),
            'closed' => TemuanAudit::where('status_temuan', 'Closed')->count(),
        ];

        return Inertia::render('ami/temuan/index', [
            'temuans' => $temuans,
            'stats' => $stats,
            'currentKlasifikasi' => $klasifikasi ?? 'all',
            'currentStatus' => $status ?? 'all',
        ]);
    }

    public function store(Request $request, JadwalAudit $jadwal): RedirectResponse
    {
        $validated = $request->validate([
            'standar_mutu_id' => ['required', 'exists:standar_mutus,id'],
            'indikator_mutu_id' => ['nullable', 'exists:indikator_mutus,id'],
            'kode_temuan' => ['required', 'string', 'max:50', 'unique:temuan_audits,kode_temuan'],
            'klasifikasi' => ['required', 'in:KTS Mayor,KTS Minor,Observasi'],
            'deskripsi_temuan' => ['required', 'string'],
            'kriteria_standar' => ['nullable', 'string'],
            'akar_penyebab' => ['nullable', 'string'],
            'akibat_dampak' => ['nullable', 'string'],
            'rekomendasi_auditor' => ['required', 'string'],
            'target_selesai_ptk' => ['nullable', 'date'],
        ]);

        $validated['jadwal_audit_id'] = $jadwal->id;
        $validated['status_temuan'] = 'Open';

        TemuanAudit::create($validated);

        return back()->with('success', 'Temuan Audit berhasil dicatat.');
    }

    public function updatePtk(Request $request, TemuanAudit $temuan): RedirectResponse
    {
        $validated = $request->validate([
            'tindakan_koreksi' => ['required', 'string'],
            'pencegahan' => ['nullable', 'string'],
            'tanggal_tindakan_koreksi' => ['required', 'date'],
            'bukti_ptk_url' => ['nullable', 'string', 'max:255'],
        ]);

        $validated['status_temuan'] = 'Menunggu Verifikasi';

        $temuan->update($validated);

        return back()->with('success', 'Tindakan Koreksi (PTK) berhasil disimpan dan diajukan ke Auditor.');
    }

    public function verifyClosing(Request $request, TemuanAudit $temuan): RedirectResponse
    {
        $validated = $request->validate([
            'status_temuan' => ['required', 'in:Proses PTK,Closed'],
            'catatan_verifikasi_auditor' => ['required', 'string'],
        ]);

        if ($validated['status_temuan'] === 'Closed') {
            $validated['tanggal_closing'] = now()->toDateString();
        }

        $temuan->update($validated);

        return back()->with('success', 'Status verifikasi temuan audit berhasil diperbarui.');
    }
}
