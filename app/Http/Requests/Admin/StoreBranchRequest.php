<?php

namespace App\Http\Requests\Admin;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreBranchRequest extends FormRequest
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
     * @return array<string, array<int, mixed>|string>
     */
    public function rules(): array
    {
        $companyId = $this->user()?->company_id;

        return [
            'name' => ['required', 'string', 'max:255'],
            'slug' => [
                'nullable',
                'string',
                'max:255',
                Rule::unique('branches', 'slug')->where(fn ($query) => $query->where('company_id', $companyId)),
            ],
            'code' => [
                'nullable',
                'string',
                'max:50',
                Rule::unique('branches', 'code')->where(fn ($query) => $query->where('company_id', $companyId)),
            ],
            'status' => ['sometimes', 'string', Rule::in(['active', 'inactive'])],
            'settings' => ['sometimes', 'array'],
        ];
    }
}
