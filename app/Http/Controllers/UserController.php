<?php

namespace App\Http\Controllers;

use App\Models\User;
use Inertia\Inertia;

class UserController extends Controller
{
    public function index()
    {
        $users = User::with('ruangan')->where('role', 'penjaga')->get();
        return Inertia::render("Admin/Users/Index", ["users" => $users]);
    }
}
