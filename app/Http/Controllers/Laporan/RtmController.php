<?php

namespace App\Http\Controllers\Laporan;

use App\Http\Controllers\Controller;
use App\Models\ProgramStudi;
use App\Models\Rtm;
use App\Models\TahunAkademik;
use App\Models\TindakLanjutRtm;
use App\Models\UnitKerja;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class RtmController extends Controller
{
    public function index(): Response
    {
        $rtms = Rtm::with(['tahunAkademik', 'tindakLanjuts.programStudi', 'tindakLanjuts.unitKerja'])
            ->latest('tanggal_rapat')
            ->get();

        $activeYear = TahunAkademik::active() ?? TahunAkademik::first();
        $tahunAkademiks = TahunAkademik::orderByDesc('tahun')->get();
        $prodis = ProgramStudi::orderBy('jenjang')->orderBy('nama')->get();
        $unitKerjas = UnitKerja::orderBy('nama')->get();

        return Inertia::render('laporan/rtm', [
            'rtms' => $rtms,
            'activeYear' => $activeYear,
            'tahunAkademiks' => $tahunAkademiks,
            'prodis' => $prodis,
            'unitKerjas' => $unitKerjas,
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'tahun_akademik_id' => 'required|exists:tahun_akademiks,id',
            'nomor_dokumen' => 'required|string|max:100|unique:rtms,nomor_dokumen',
            'judul' => 'required|string|max:255',
            'tanggal_rapat' => 'required|date',
            'tempat' => 'required|string|max:255',
            'pimpinan_rapat' => 'required|string|max:255',
            'peserta_hadir' => 'nullable|string',
            'agenda' => 'nullable|string',
            'ringkasan_pembahasan' => 'nullable|string',
            'kesimpulan' => 'nullable|string',
            'status' => 'required|in:Draft,Terlaksana,Dalam Tindak Lanjut,Selesai',
        ]);

        Rtm::create($validated);

        return back()->with('success', 'Sidang RTM berhasil ditambahkan.');
    }

    public function update(Request $request, Rtm $rtm): RedirectResponse
    {
        $validated = $request->validate([
            'tahun_akademik_id' => 'required|exists:tahun_akademiks,id',
            'nomor_dokumen' => 'required|string|max:100|unique:rtms,nomor_dokumen,'.$rtm->id,
            'judul' => 'required|string|max:255',
            'tanggal_rapat' => 'required|date',
            'tempat' => 'required|string|max:255',
            'pimpinan_rapat' => 'required|string|max:255',
            'peserta_hadir' => 'nullable|string',
            'agenda' => 'nullable|string',
            'ringkasan_pembahasan' => 'nullable|string',
            'kesimpulan' => 'nullable|string',
            'status' => 'required|in:Draft,Terlaksana,Dalam Tindak Lanjut,Selesai',
        ]);

        $rtm->update($validated);

        return back()->with('success', 'Data sidang RTM berhasil diperbarui.');
    }

    public function destroy(Rtm $rtm): RedirectResponse
    {
        $rtm->delete();

        return back()->with('success', 'Data sidang RTM berhasil dihapus.');
    }

    public function storeTindakLanjut(Request $request, Rtm $rtm): RedirectResponse
    {
        $validated = $request->validate([
            'program_studi_id' => 'nullable|exists:program_studis,id',
            'unit_kerja_id' => 'nullable|exists:unit_kerjas,id',
            'butir_rekomendasi' => 'required|string',
            'rencana_tindakan' => 'required|string',
            'target_waktu' => 'required|date',
            'penanggung_jawab' => 'required|string|max:255',
            'status' => 'required|in:Belum Dimulai,Dalam Proses,Selesai,Diverifikasi',
            'bukti_tindak_lanjut' => 'nullable|string',
            'catatan_verifikasi' => 'nullable|string',
        ]);

        $rtm->tindakLanjuts()->create($validated);

        return back()->with('success', 'Rencana tindak lanjut peningkatan mutu berhasil ditambahkan.');
    }

    public function updateTindakLanjut(Request $request, TindakLanjutRtm $tindakLanjut): RedirectResponse
    {
        $validated = $request->validate([
            'program_studi_id' => 'nullable|exists:program_studis,id',
            'unit_kerja_id' => 'nullable|exists:unit_kerjas,id',
            'butir_rekomendasi' => 'required|string',
            'rencana_tindakan' => 'required|string',
            'target_waktu' => 'required|date',
            'penanggung_jawab' => 'required|string|max:255',
            'status' => 'required|in:Belum Dimulai,Dalam Proses,Selesai,Diverifikasi',
            'bukti_tindak_lanjut' => 'nullable|string',
            'catatan_verifikasi' => 'nullable|string',
        ]);

        $tindakLanjut->update($validated);

        return back()->with('success', 'Status tindak lanjut RTM berhasil diperbarui.');
    }

    public function destroyTindakLanjut(TindakLanjutRtm $tindakLanjut): RedirectResponse
    {
        $tindakLanjut->delete();

        return back()->with('success', 'Butir tindak lanjut berhasil dihapus.');
    }
}
