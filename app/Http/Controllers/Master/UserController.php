<?php

namespace App\Http\Controllers\Master;

use App\Http\Controllers\Controller;
use App\Models\ProgramStudi;
use App\Models\Role;
use App\Models\UnitKerja;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rule;
use Illuminate\Validation\Rules\Password;
use Inertia\Inertia;
use Inertia\Response;

class UserController extends Controller
{
    public function index(): Response
    {
        $users = User::with(['role', 'programStudi', 'unitKerja'])
            ->orderBy('name')
            ->get();

        $roles = Role::orderBy('id')->get();
        $prodis = ProgramStudi::where('is_active', true)->orderBy('nama')->get();
        $units = UnitKerja::where('is_active', true)->orderBy('nama')->get();

        return Inertia::render('master/users/index', [
            'users' => $users,
            'roles' => $roles,
            'prodis' => $prodis,
            'units' => $units,
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'string', 'email', 'max:255', 'unique:users,email'],
            'password' => ['required', Password::defaults()],
            'role_id' => ['nullable', 'exists:roles,id'],
            'program_studi_id' => ['nullable', 'exists:program_studis,id'],
            'unit_kerja_id' => ['nullable', 'exists:unit_kerjas,id'],
            'nip_nim' => ['nullable', 'string', 'max:50'],
            'phone' => ['nullable', 'string', 'max:50'],
            'is_active' => ['boolean'],
        ]);

        $validated['password'] = Hash::make($validated['password']);
        $validated['email_verified_at'] = now();

        User::create($validated);

        return back()->with('success', 'Pengguna berhasil ditambahkan.');
    }

    public function update(Request $request, User $user): RedirectResponse
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'string', 'email', 'max:255', Rule::unique('users')->ignore($user->id)],
            'password' => ['nullable', Password::defaults()],
            'role_id' => ['nullable', 'exists:roles,id'],
            'program_studi_id' => ['nullable', 'exists:program_studis,id'],
            'unit_kerja_id' => ['nullable', 'exists:unit_kerjas,id'],
            'nip_nim' => ['nullable', 'string', 'max:50'],
            'phone' => ['nullable', 'string', 'max:50'],
            'is_active' => ['boolean'],
        ]);

        if (! empty($validated['password'])) {
            $validated['password'] = Hash::make($validated['password']);
        } else {
            unset($validated['password']);
        }

        $user->update($validated);

        return back()->with('success', 'Pengguna berhasil diperbarui.');
    }

    public function destroy(User $user): RedirectResponse
    {
        if ($user->id === auth()->id()) {
            return back()->with('error', 'Anda tidak dapat menghapus akun Anda sendiri.');
        }

        $user->delete();

        return back()->with('success', 'Pengguna berhasil dihapus.');
    }
}
