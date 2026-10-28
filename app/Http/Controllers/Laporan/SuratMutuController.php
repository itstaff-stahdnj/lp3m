<?php

namespace App\Http\Controllers\Laporan;

use App\Http\Controllers\Controller;
use App\Models\ProfilInstitusi;
use App\Models\ProgramStudi;
use App\Models\SuratMutu;
use App\Models\TahunAkademik;
use App\Models\UnitKerja;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Inertia\Response;

class SuratMutuController extends Controller
{
    public function index(Request $request): Response
    {
        $query = SuratMutu::with(['programStudi', 'unitKerja', 'user', 'tahunAkademik'])
            ->latest('tanggal_surat');

        if ($request->filled('jenis_surat')) {
            $query->where('jenis_surat', $request->query('jenis_surat'));
        }

        $suratList = $query->get();
        $activeYear = TahunAkademik::active() ?? TahunAkademik::first();
        $tahunAkademiks = TahunAkademik::orderByDesc('tahun')->get();
        $prodis = ProgramStudi::orderBy('jenjang')->orderBy('nama')->get();
        $unitKerjas = UnitKerja::orderBy('nama')->get();
        $users = User::select('id', 'name', 'email', 'nip_nim')->orderBy('name')->get();
        $institution = ProfilInstitusi::current();

        return Inertia::render('surat/index', [
            'suratList' => $suratList,
            'activeYear' => $activeYear,
            'tahunAkademiks' => $tahunAkademiks,
            'prodis' => $prodis,
            'unitKerjas' => $unitKerjas,
            'users' => $users,
            'institution' => $institution,
            'filters' => $request->only(['jenis_surat']),
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'tahun_akademik_id' => 'required|exists:tahun_akademiks,id',
            'nomor_surat' => 'required|string|max:100|unique:surat_mutus,nomor_surat',
            'jenis_surat' => 'required|in:Surat Keterangan Akreditasi,Surat Bebas Temuan AMI,Surat Rekomendasi Mutu,E-Sertifikat Pelatihan,Surat Pengantar Audit',
            'perihal' => 'required|string|max:255',
            'tujuan_penerima' => 'required|string|max:255',
            'program_studi_id' => 'nullable|exists:program_studis,id',
            'unit_kerja_id' => 'nullable|exists:unit_kerjas,id',
            'user_id' => 'nullable|exists:users,id',
            'tanggal_surat' => 'required|date',
            'penandatangan_nama' => 'required|string|max:255',
            'penandatangan_jabatan' => 'required|string|max:255',
            'isi_ringkas' => 'required|string',
            'status' => 'required|in:Draft,Diterbitkan,Diarsipkan,Dibatalkan',
        ]);

        $tokenPrefix = match ($validated['jenis_surat']) {
            'Surat Keterangan Akreditasi' => 'SK-AKRED-',
            'Surat Bebas Temuan AMI' => 'SK-BEBAS-AMI-',
            'Surat Rekomendasi Mutu' => 'REKOM-MUTU-',
            'E-Sertifikat Pelatihan' => 'SERT-PELATIHAN-',
            default => 'SURAT-LP3M-',
        };

        $validated['qr_token'] = $tokenPrefix.strtoupper(Str::random(24));

        SuratMutu::create($validated);

        return back()->with('success', 'Surat Mutu / E-Sertifikat berhasil diterbitkan.');
    }

    public function update(Request $request, SuratMutu $surat): RedirectResponse
    {
        $validated = $request->validate([
            'tahun_akademik_id' => 'required|exists:tahun_akademiks,id',
            'nomor_surat' => 'required|string|max:100|unique:surat_mutus,nomor_surat,'.$surat->id,
            'jenis_surat' => 'required|in:Surat Keterangan Akreditasi,Surat Bebas Temuan AMI,Surat Rekomendasi Mutu,E-Sertifikat Pelatihan,Surat Pengantar Audit',
            'perihal' => 'required|string|max:255',
            'tujuan_penerima' => 'required|string|max:255',
            'program_studi_id' => 'nullable|exists:program_studis,id',
            'unit_kerja_id' => 'nullable|exists:unit_kerjas,id',
            'user_id' => 'nullable|exists:users,id',
            'tanggal_surat' => 'required|date',
            'penandatangan_nama' => 'required|string|max:255',
            'penandatangan_jabatan' => 'required|string|max:255',
            'isi_ringkas' => 'required|string',
            'status' => 'required|in:Draft,Diterbitkan,Diarsipkan,Dibatalkan',
        ]);

        $surat->update($validated);

        return back()->with('success', 'Data surat mutu berhasil diperbarui.');
    }

    public function destroy(SuratMutu $surat): RedirectResponse
    {
        $surat->delete();

        return back()->with('success', 'Surat mutu berhasil dihapus.');
    }

    /**
     * Public verification endpoint accessible by anyone / scanning QR code.
     */
    public function verifyPublic(string $token): Response
    {
        $surat = SuratMutu::with(['programStudi', 'unitKerja', 'user', 'tahunAkademik'])
            ->where('qr_token', $token)
            ->firstOrFail();

        $institution = ProfilInstitusi::current();

        return Inertia::render('surat/verify', [
            'surat' => $surat,
            'institution' => $institution,
        ]);
    }
}
