<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreScannerRequest;
use App\Http\Requests\UpdateScannerRequest;
use App\Models\Ruangan;
use App\Models\ScanerStatus;

class ScanerController extends Controller
{
    public function index()
    {
        $scanner = ScanerStatus::orderBy('created_at', 'DESC')->get()->map(fn ($data) =>  [
            "id" => $data->id,
            "kode" => $data->kode,
            "ruangan" => $data->ruangan,
            "type" => $data->type,
            "last" => $data->last,
            "status" => $data->status == 1 ? 'Active' : 'Block',
        ]);

        return inertia("Admin/Scanner/Index", [
            "scanner" => $scanner,
            "ruangans" => Ruangan::query()->get()->map(fn ($data) => ["name" => $data->nama_ruangan, "code" => $data->id]),
        ]);
    }

    public function store(StoreScannerRequest $request)
    {
        $scanner = ScanerStatus::create($request->validated());
        return [
            "id" => $scanner->id,
            "kode" => $scanner->kode,
            "ruangan_id" => $scanner->ruangan_id,
            "ruangan" => $scanner->ruangan,
            "type" => $scanner->type,
            "last" => $scanner->last,
            "status" => $scanner->status === 1 ? 'Active' : 'Block',
        ];
    }

    public function update(UpdateScannerRequest $request, ScanerStatus $scanerStatus)
    {
        $scanerStatus->update($request->validated());
        return [
            "id" => $scanerStatus->id,
            "kode" => $scanerStatus->kode,
            "ruangan_id" => $scanerStatus->ruangan_id,
            "ruangan" => $scanerStatus->ruangan,
            "type" => $scanerStatus->type,
            "last" => $scanerStatus->last,
            "status" => $scanerStatus->status === 1 ? 'Active' : 'Block',
        ];
    }
    public function destroy(ScanerStatus $scanerStatus)
    {
        $scanerStatus->delete();
    }
}
