<?php

namespace App\Http\Requests;

use App\Models\Mahasiswa;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class MahasiswaUpdateRequest extends FormRequest
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
            "pin" => ['nullable',  Rule::unique(Mahasiswa::class)->ignore($this->id)],
            "nama" => ['required'],
            "id_tag" => ['required',  Rule::unique(Mahasiswa::class)->ignore($this->id)],
            "nim" => ['required', Rule::unique(Mahasiswa::class)->ignore($this->id)],
            "status" => ['required'],
            "ruangan_id" => ['required'],
            "tahun_masuk" => ['required',  'max_digits:4', 'min_digits:4']
        ];
    }
}
