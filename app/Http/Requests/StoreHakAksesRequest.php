<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreHakAksesRequest extends FormRequest
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
            "tanggal" => ['required'],
            "jam_masuk" => ['required', 'before_or_equal:jam_keluar'],
            "jam_keluar" => ['required', 'after_or_equal:jam_keluar']
        ];
    }

    public function messages()
    {
        return [
            'jam_masuk.before_or_equal' => 'Jam masuk harus sebelum jam keluar.',
            'jam_keluar.after_or_equal' => 'Jam keluar harus setelah jam masuk.',
        ];
    }
}
