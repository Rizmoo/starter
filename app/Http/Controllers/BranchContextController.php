<?php

namespace App\Http\Controllers;

use App\Actions\Branch\ResolveBranchContext;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

class BranchContextController extends Controller
{
    public function __construct(private readonly ResolveBranchContext $resolveBranchContext) {}

    public function update(Request $request): RedirectResponse
    {
        $context = $this->resolveBranchContext->resolve($request);

        $validated = $request->validate([
            'mode' => ['required', 'string', Rule::in([ResolveBranchContext::MODE_SINGLE, ResolveBranchContext::MODE_ALL])],
            'branch_id' => [
                'nullable',
                'integer',
                Rule::requiredIf(fn () => $request->input('mode') === ResolveBranchContext::MODE_SINGLE),
                Rule::in($context['allowed_branch_ids']),
            ],
        ]);

        $mode = $validated['mode'];
        $branchId = $mode === ResolveBranchContext::MODE_SINGLE
            ? (int) $validated['branch_id']
            : $context['current_branch_id'];

        $request->session()->put([
            ResolveBranchContext::SESSION_MODE_KEY => $mode,
            ResolveBranchContext::SESSION_BRANCH_ID_KEY => $branchId,
        ]);

        if ($mode === ResolveBranchContext::MODE_SINGLE && $request->user()?->preferred_branch_id !== $branchId) {
            $request->user()?->forceFill([
                'preferred_branch_id' => $branchId,
            ])->save();
        }

        return back()->with('success', 'Branch context updated.');
    }
}
