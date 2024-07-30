<?php

namespace App\Http\Requests;

use App\Models\ScanerStatus;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateScannerRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            "kode" => ['required',  Rule::unique(ScanerStatus::class, 'kode')->ignore($this->id)],
            "ruangan_id" => ['required'],
            "type" => ['required'],
            "status" => ['required']
        ];
    }
}
