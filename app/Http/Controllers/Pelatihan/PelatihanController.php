<?php

namespace App\Http\Controllers\Pelatihan;

use App\Http\Controllers\Controller;
use App\Models\Pelatihan;
use App\Models\PesertaPelatihan;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class PelatihanController extends Controller
{
    public function index(Request $request): Response
    {
        $kategori = $request->query('kategori');
        $status = $request->query('status');

        $query = Pelatihan::withCount('pesertas')->orderByDesc('tanggal_mulai');

        if ($kategori) {
            $query->where('kategori', $kategori);
        }

        if ($status) {
            $query->where('status', $status);
        }

        $pelatihans = $query->get();

        $stats = [
            'total_pelatihan' => Pelatihan::count(),
            'selesai_count' => Pelatihan::where('status', 'Selesai')->count(),
            'berjalan_count' => Pelatihan::where('status', 'Sedang Berjalan')->count(),
            'akan_datang_count' => Pelatihan::where('status', 'Akan Datang')->count(),
            'total_peserta' => PesertaPelatihan::count(),
            'total_sertifikat' => PesertaPelatihan::whereNotNull('nomor_sertifikat')->count(),
        ];

        return Inertia::render('pelatihan/index', [
            'pelatihans' => $pelatihans,
            'stats' => $stats,
            'currentKategori' => $kategori ?? 'all',
            'currentStatus' => $status ?? 'all',
        ]);
    }

    public function show(Pelatihan $pelatihan): Response
    {
        $pelatihan->load(['pesertas.user.programStudi', 'pesertas.user.role']);

        $users = User::whereHas('role', fn ($q) => $q->whereIn('name', ['dosen', 'kaprodi', 'super_admin']))
            ->orderBy('name')
            ->get();

        return Inertia::render('pelatihan/show', [
            'pelatihan' => $pelatihan,
            'users' => $users,
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'kode' => ['required', 'string', 'max:50', 'unique:pelatihans,kode'],
            'judul' => ['required', 'string', 'max:255'],
            'kategori' => ['required', 'in:Pedagogik & Kurikulum,Penelitian & Publikasi,Pengabdian Masyarakat,Penjaminan Mutu SPMI,Pengembangan Tendik'],
            'narasumber' => ['nullable', 'string', 'max:255'],
            'penyelenggara' => ['required', 'string', 'max:255'],
            'tanggal_mulai' => ['required', 'date'],
            'tanggal_selesai' => ['required', 'date', 'after_or_equal:tanggal_mulai'],
            'lokasi' => ['nullable', 'string', 'max:255'],
            'kuota' => ['required', 'integer', 'min:1'],
            'jam_pelajaran' => ['required', 'integer', 'min:1'],
            'status' => ['required', 'in:Akan Datang,Sedang Berjalan,Selesai'],
            'deskripsi' => ['nullable', 'string'],
            'silabus_materi' => ['nullable', 'string'],
        ]);

        Pelatihan::create($validated);

        return back()->with('success', 'Agenda pelatihan/workshop SDM berhasil dibuat.');
    }

    public function update(Request $request, Pelatihan $pelatihan): RedirectResponse
    {
        $validated = $request->validate([
            'judul' => ['required', 'string', 'max:255'],
            'kategori' => ['required', 'in:Pedagogik & Kurikulum,Penelitian & Publikasi,Pengabdian Masyarakat,Penjaminan Mutu SPMI,Pengembangan Tendik'],
            'narasumber' => ['nullable', 'string', 'max:255'],
            'penyelenggara' => ['required', 'string', 'max:255'],
            'tanggal_mulai' => ['required', 'date'],
            'tanggal_selesai' => ['required', 'date', 'after_or_equal:tanggal_mulai'],
            'lokasi' => ['nullable', 'string', 'max:255'],
            'kuota' => ['required', 'integer', 'min:1'],
            'jam_pelajaran' => ['required', 'integer', 'min:1'],
            'status' => ['required', 'in:Akan Datang,Sedang Berjalan,Selesai'],
            'deskripsi' => ['nullable', 'string'],
            'silabus_materi' => ['nullable', 'string'],
        ]);

        $pelatihan->update($validated);

        return back()->with('success', 'Agenda pelatihan berhasil diperbarui.');
    }

    public function destroy(Pelatihan $pelatihan): RedirectResponse
    {
        $pelatihan->delete();

        return redirect()->route('pelatihan.index')->with('success', 'Agenda pelatihan berhasil dihapus.');
    }

    public function registerPeserta(Request $request, Pelatihan $pelatihan): RedirectResponse
    {
        $validated = $request->validate([
            'user_id' => ['required', 'exists:users,id'],
        ]);

        // Cek jika sudah terdaftar
        $existing = PesertaPelatihan::where('pelatihan_id', $pelatihan->id)
            ->where('user_id', $validated['user_id'])
            ->first();

        if ($existing) {
            return back()->with('error', 'Peserta ini sudah terdaftar pada pelatihan tersebut.');
        }

        PesertaPelatihan::create([
            'pelatihan_id' => $pelatihan->id,
            'user_id' => $validated['user_id'],
            'status_kehadiran' => 'Terdaftar',
        ]);

        return back()->with('success', 'Peserta berhasil didaftarkan ke pelatihan.');
    }

    public function updatePeserta(Request $request, PesertaPelatihan $peserta): RedirectResponse
    {
        $validated = $request->validate([
            'status_kehadiran' => ['required', 'in:Terdaftar,Hadir,Lulus,Tidak Lulus'],
            'nomor_sertifikat' => ['nullable', 'string', 'max:100'],
            'catatan_evaluasi' => ['nullable', 'string'],
        ]);

        if ($validated['status_kehadiran'] === 'Lulus' && empty($validated['nomor_sertifikat'])) {
            $nomorUrut = PesertaPelatihan::whereNotNull('nomor_sertifikat')->count() + 1;
            $validated['nomor_sertifikat'] = 'SERT-DNJ/'.date('Y').'/'.str_pad($nomorUrut, 4, '0', STR_PAD_LEFT);
            $validated['tanggal_terbit_sertifikat'] = now()->toDateString();
        }

        $peserta->update($validated);

        return back()->with('success', 'Data peserta dan sertifikat berhasil diperbarui.');
    }
}
