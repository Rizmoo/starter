<?php

namespace App\Actions\Branch;

use Illuminate\Http\Request;

class ResolveBranchContext
{
    public const MODE_SINGLE = 'single';

    public const MODE_ALL = 'all';

    public const SESSION_MODE_KEY = 'branch_context.mode';

    public const SESSION_BRANCH_ID_KEY = 'branch_context.current_branch_id';

    /**
     * @return array{mode: string, current_branch_id: int|null, allowed_branch_ids: array<int, int>, visible_branch_ids: array<int, int>}
     */
    public function resolve(Request $request): array
    {
        $user = $request->user();

        if (! $user) {
            return [
                'mode' => self::MODE_SINGLE,
                'current_branch_id' => null,
                'allowed_branch_ids' => [],
                'visible_branch_ids' => [],
            ];
        }

        $allowedBranchIds = array_map('intval', $user->availableBranchIds());

        if ($allowedBranchIds === []) {
            return [
                'mode' => self::MODE_SINGLE,
                'current_branch_id' => null,
                'allowed_branch_ids' => [],
                'visible_branch_ids' => [],
            ];
        }

        $sessionMode = (string) $request->session()->get(self::SESSION_MODE_KEY, self::MODE_SINGLE);

        $mode = in_array($sessionMode, [self::MODE_SINGLE, self::MODE_ALL], true)
            ? $sessionMode
            : self::MODE_SINGLE;

        $currentBranchId = $request->session()->has(self::SESSION_BRANCH_ID_KEY)
            ? (int) $request->session()->get(self::SESSION_BRANCH_ID_KEY)
            : null;

        if ($currentBranchId === null || ! in_array($currentBranchId, $allowedBranchIds, true)) {
            $currentBranchId = $user->defaultBranchId();
        }

        if ($currentBranchId === null || ! in_array($currentBranchId, $allowedBranchIds, true)) {
            $currentBranchId = $allowedBranchIds[0];
        }

        $visibleBranchIds = $mode === self::MODE_ALL
            ? $allowedBranchIds
            : [$currentBranchId];

        return [
            'mode' => $mode,
            'current_branch_id' => $currentBranchId,
            'allowed_branch_ids' => $allowedBranchIds,
            'visible_branch_ids' => $visibleBranchIds,
        ];
    }
}
