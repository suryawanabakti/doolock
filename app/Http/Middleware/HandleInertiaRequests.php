<?php

namespace App\Http\Middleware;

use App\Models\PenjagaRuangan;
use Illuminate\Http\Request;
use Inertia\Middleware;
use Tightenco\Ziggy\Ziggy;

class HandleInertiaRequests extends Middleware
{
    /**
     * The root template that is loaded on the first page visit.
     *
     * @var string
     */
    protected $rootView = 'app';

    /**
     * Determine the current asset version.
     */
    public function version(Request $request): string|null
    {
        return parent::version($request);
    }

    /**
     * Define the props that are shared by default.
     *
     * @return array<string, mixed>
     */
    public function share(Request $request): array
    {
        if ($request->user() && $request->user()->role == 'penjaga') {
            $daftarRuangan = PenjagaRuangan::with('ruangan')->where('user_id', $request->user()->id)->get()->map(function ($data) {
                return [
                    "label" => "Ruangan " . $data->ruangan->nama_ruangan,
                    "items" => [
                        [
                            "label" => "Hak Akses",
                            "icon" => "pi pi-key",
                            "route" => "penjaga.ruangan-hak-akses.index",
                            "to" => route("penjaga.ruangan-hak-akses.index",  [
                                "id" => $data->ruangan_id
                            ]),
                        ],
                        [
                            "label" => "Daftar jadwal belum di approve",
                            "icon" => "pi pi-clock",
                            "route" => "penjaga.pendaftaran.index",
                            "to" => route("penjaga.pendaftaran.index",  [
                                "id" => $data->ruangan_id
                            ])
                        ],
                        [
                            "label" => "Daftar jadwal sudah di approve",
                            "icon" => "pi pi-check",
                            "route" => "penjaga.pendaftaran-approve.index",
                            "to" => route("penjaga.pendaftaran-approve.index",  [
                                "id" => $data->ruangan_id
                            ])
                        ],
                        [
                            "label" => "Daftar jadwal sudah di tolak",
                            "icon" => "pi pi-times",
                            "route" => "penjaga.pendaftaran-disapprove.index",
                            "to" => route("penjaga.pendaftaran-disapprove.index",  [
                                "id" => $data->ruangan_id
                            ])
                        ],
                        [
                            "label" => "Riwayat",
                            "icon" => "pi pi-history",
                            "to" => route("penjaga.riwayat.index",  [
                                "id" => $data->ruangan_id
                            ])
                        ],
                        [
                            "label" => "Absensi",
                            "icon" => "pi pi-file",
                            "to" => route("penjaga.absensi.index",  [
                                "id" => $data->ruangan_id
                            ])
                        ],
                    ]
                ];
            });
        }

        return [
            ...parent::share($request),
            'auth' => [
                'user' => $request->user(),
                'daftarRuangan' => $daftarRuangan ?? null
            ],
            'ziggy' => fn() => [
                ...(new Ziggy)->toArray(),
                'location' => $request->url(),
            ],
        ];
    }
}
