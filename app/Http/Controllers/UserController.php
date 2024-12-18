<?php

namespace App\Http\Controllers;

use App\Http\Requests\UserStoreRequest;
use App\Http\Requests\UserUpdateRequest;
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
        $user = User::create($data);
        return $user->load('ruangan');
    }
    public function  update(UserUpdateRequest $request, User $user)
    {
        $data = $request->validated();
        $user->update($data);
        return $user->load('ruangan');
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
