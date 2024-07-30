<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class DosenStoreRequest extends FormRequest
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
            "nama" => ['required'],
            "id_tag" => ['required', 'unique:mahasiswa,id_tag'],
            "nim" => ['required', 'unique:mahasiswa,nim'],
            "status" => ['required'],
        ];
    }
}
