<?php

namespace App\Http\Controllers;

use App\Http\Requests\UserStoreRequest;
use App\Http\Requests\UserUpdateRequest;
use App\Models\PenjagaRuangan;
use App\Models\Ruangan;
use App\Models\User;
use Inertia\Inertia;

class UserController extends Controller
{
    public function getRuangan()
    {
        return Ruangan::whereNot('type', 'kelas')->get();
    }

    public function  store(UserStoreRequest $request)
    {
        $data = $request->validated();
        $data['role'] = 'penjaga';
        unset($data['ruangan_id']);
        $user = User::create($data);

        PenjagaRuangan::create([
            'user_id' => $user->id,
            'ruangan_id' => $request->ruangan_id
        ]);

        return $user->load('ruangan.ruangan:id,nama_ruangan');
    }

    public function  update(UserUpdateRequest $request, User $user)
    {
        $data = $request->validated();
        unset($data['ruangan_id']);
        $user->update($data);
        return $user->load('ruangan.ruangan:id,nama_ruangan');
    }

    public function index()
    {
        $users = User::orderBy('created_at', 'DESC')->with(['ruangan.ruangan:id,nama_ruangan'])->where('role', 'penjaga')->get();
        return Inertia::render("Admin/Users/Index", ["users" => $users]);
    }

    public function destroy(User $user)
    {
        $user->delete();
    }
}
