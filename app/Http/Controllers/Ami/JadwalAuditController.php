<?php

namespace App\Http\Controllers\Ami;

use App\Http\Controllers\Controller;
use App\Models\JadwalAudit;
use App\Models\PeriodeAudit;
use App\Models\ProgramStudi;
use App\Models\StandarMutu;
use App\Models\UnitKerja;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class JadwalAuditController extends Controller
{
    public function index(Request $request): Response
    {
        $periodeId = $request->query('periode_id');
        $periodes = PeriodeAudit::orderByDesc('tanggal_mulai')->get();
        $activePeriode = $periodeId ? PeriodeAudit::find($periodeId) : PeriodeAudit::where('status', 'Berjalan')->first() ?? $periodes->first();

        $jadwals = JadwalAudit::with([
            'periodeAudit',
            'programStudi',
            'unitKerja',
            'leadAuditor',
            'auditorAnggota',
            'temuans',
        ])
            ->when($activePeriode, fn ($q) => $q->where('periode_audit_id', $activePeriode->id))
            ->orderBy('tanggal_audit')
            ->get();

        $auditors = User::whereHas('role', fn ($q) => $q->where('name', 'auditor'))
            ->orWhereHas('role', fn ($q) => $q->where('name', 'super_admin'))
            ->orWhereHas('role', fn ($q) => $q->where('name', 'ketua_lp3m'))
            ->orderBy('name')
            ->get();

        $prodis = ProgramStudi::where('is_active', true)->orderBy('nama')->get();
        $units = UnitKerja::where('is_active', true)->orderBy('nama')->get();

        return Inertia::render('ami/jadwal/index', [
            'jadwals' => $jadwals,
            'periodes' => $periodes,
            'activePeriode' => $activePeriode,
            'auditors' => $auditors,
            'prodis' => $prodis,
            'units' => $units,
        ]);
    }

    public function show(JadwalAudit $jadwal): Response
    {
        $jadwal->load([
            'periodeAudit.tahunAkademik',
            'programStudi',
            'unitKerja',
            'leadAuditor',
            'auditorAnggota',
            'temuans.standarMutu',
            'temuans.indikatorMutu',
        ]);

        $standars = StandarMutu::where('is_active', true)->with('indikators')->orderBy('kode')->get();

        return Inertia::render('ami/jadwal/show', [
            'jadwal' => $jadwal,
            'standars' => $standars,
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'periode_audit_id' => ['required', 'exists:periode_audits,id'],
            'auditee_tipe' => ['required', 'in:ProgramStudi,UnitKerja'],
            'program_studi_id' => ['nullable', 'exists:program_studis,id'],
            'unit_kerja_id' => ['nullable', 'exists:unit_kerjas,id'],
            'lead_auditor_id' => ['required', 'exists:users,id'],
            'auditor_anggota_id' => ['nullable', 'exists:users,id'],
            'tanggal_audit' => ['required', 'date'],
            'lokasi' => ['nullable', 'string', 'max:255'],
            'status' => ['required', 'in:Terjadwal,Sedang Berjalan,Selesai Audit,Tindakan Koreksi,Closed'],
            'catatan_auditor' => ['nullable', 'string'],
        ]);

        JadwalAudit::create($validated);

        return back()->with('success', 'Jadwal Audit dan Penugasan Auditor berhasil disimpan.');
    }

    public function update(Request $request, JadwalAudit $jadwal): RedirectResponse
    {
        $validated = $request->validate([
            'lead_auditor_id' => ['required', 'exists:users,id'],
            'auditor_anggota_id' => ['nullable', 'exists:users,id'],
            'tanggal_audit' => ['required', 'date'],
            'lokasi' => ['nullable', 'string', 'max:255'],
            'status' => ['required', 'in:Terjadwal,Sedang Berjalan,Selesai Audit,Tindakan Koreksi,Closed'],
            'catatan_auditor' => ['nullable', 'string'],
        ]);

        $jadwal->update($validated);

        return back()->with('success', 'Jadwal Audit berhasil diperbarui.');
    }

    public function destroy(JadwalAudit $jadwal): RedirectResponse
    {
        $jadwal->delete();

        return back()->with('success', 'Jadwal Audit berhasil dihapus.');
    }
}
