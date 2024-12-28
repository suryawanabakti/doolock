<?php

namespace App\Http\Controllers;

use App\Http\Requests\UserStoreRequest;
use App\Http\Requests\UserUpdateRequest;
use App\Models\PenjagaRuangan;
use App\Models\Ruangan;
use App\Models\User;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class UserController extends Controller
{
    public function getRuangan()
    {
        return Ruangan::whereNot('type', 'kelas')->get()->map(function ($data) {
            $data['name'] = $data->nama_ruangan;
            $data['code'] = $data->id;
            return $data;
        });
    }

    public function  store(UserStoreRequest $request)
    {
        $data = $request->validated();
        $data['role'] = 'penjaga';
        unset($data['ruangan_id']);

        return DB::transaction(function () use ($data, $request) {
            $user = User::create($data);
            $dataPenjagaRuangan = [];
            foreach ($request->ruangan_id as $ruangan) {
                $dataPenjagaRuangan[] = [
                    "user_id" => $user->id,
                    "ruangan_id" => $ruangan['id'],
                ];
            }
            PenjagaRuangan::insert($dataPenjagaRuangan);
            return $user->load('ruangan.ruangan:id,nama_ruangan');
        });
    }

    public function  update(UserUpdateRequest $request, User $user)
    {
        $data = $request->validated();
        unset($data['ruangan_id']);

        return DB::transaction(function () use ($data, $request, $user) {
            $user->update($data);
            $dataPenjagaRuangan = [];
            foreach ($request->ruangan_id as $ruangan) {
                $dataPenjagaRuangan[] = [
                    "user_id" => $user->id,
                    "ruangan_id" => $ruangan['id'],
                ];
            }
            PenjagaRuangan::where('user_id', $user->id)->delete();
            PenjagaRuangan::insert($dataPenjagaRuangan);
            return $user->load('ruangan.ruangan:id,nama_ruangan');
        });
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
