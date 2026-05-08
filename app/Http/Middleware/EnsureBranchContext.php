<?php

namespace App\Http\Middleware;

use App\Actions\Branch\ResolveBranchContext;
use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Exception\AccessDeniedHttpException;
use Symfony\Component\HttpFoundation\Response;

class EnsureBranchContext
{
    public function __construct(private readonly ResolveBranchContext $resolveBranchContext) {}

    /**
     * Handle an incoming request.
     *
     * @param  Closure(Request): (Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        if (! $request->user()) {
            return $next($request);
        }

        $context = $this->resolveBranchContext->resolve($request);

        if ($context['allowed_branch_ids'] === []) {
            throw new AccessDeniedHttpException('No branches are assigned to your account. Contact an administrator.');
        }

        $request->session()->put([
            ResolveBranchContext::SESSION_MODE_KEY => $context['mode'],
            ResolveBranchContext::SESSION_BRANCH_ID_KEY => $context['current_branch_id'],
        ]);

        $request->attributes->set('branch_context', $context);

        return $next($request);
    }
}
