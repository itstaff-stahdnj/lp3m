<?php

namespace App\Http\Controllers\Ami;

use App\Http\Controllers\Controller;
use App\Models\PeriodeAudit;
use App\Models\TahunAkademik;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class PeriodeAuditController extends Controller
{
    public function index(): Response
    {
        $periodes = PeriodeAudit::with(['tahunAkademik', 'jadwals.programStudi', 'jadwals.unitKerja'])
            ->withCount(['jadwals', 'temuans'])
            ->orderByDesc('tanggal_mulai')
            ->get();

        $tahunAkademiks = TahunAkademik::orderByDesc('tahun')->get();

        return Inertia::render('ami/periode/index', [
            'periodes' => $periodes,
            'tahunAkademiks' => $tahunAkademiks,
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'kode' => ['required', 'string', 'max:50', 'unique:periode_audits,kode'],
            'nama' => ['required', 'string', 'max:255'],
            'tahun_akademik_id' => ['required', 'exists:tahun_akademiks,id'],
            'tanggal_mulai' => ['required', 'date'],
            'tanggal_selesai' => ['required', 'date', 'after_or_equal:tanggal_mulai'],
            'status' => ['required', 'in:Draft,Berjalan,Selesai,RTM'],
            'keterangan' => ['nullable', 'string'],
        ]);

        PeriodeAudit::create($validated);

        return back()->with('success', 'Periode Audit Mutu Internal berhasil dibuat.');
    }

    public function update(Request $request, PeriodeAudit $periode): RedirectResponse
    {
        $validated = $request->validate([
            'kode' => ['required', 'string', 'max:50', 'unique:periode_audits,kode,'.$periode->id],
            'nama' => ['required', 'string', 'max:255'],
            'tahun_akademik_id' => ['required', 'exists:tahun_akademiks,id'],
            'tanggal_mulai' => ['required', 'date'],
            'tanggal_selesai' => ['required', 'date', 'after_or_equal:tanggal_mulai'],
            'status' => ['required', 'in:Draft,Berjalan,Selesai,RTM'],
            'keterangan' => ['nullable', 'string'],
        ]);

        $periode->update($validated);

        return back()->with('success', 'Periode Audit Mutu Internal berhasil diperbarui.');
    }

    public function destroy(PeriodeAudit $periode): RedirectResponse
    {
        $periode->delete();

        return back()->with('success', 'Periode Audit Mutu Internal berhasil dihapus.');
    }
}
