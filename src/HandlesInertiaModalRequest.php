<?php
namespace Tofandel\InertiaVueModal;

use Closure;
use Illuminate\Http\Request;
use Inertia\Middleware;
use Symfony\Component\HttpFoundation\RedirectResponse;

class HandlesInertiaModalRequest extends Middleware
{

    public function share(Request $request)
    {
        return array_merge(parent::share($request), [
            'modalId' => $request->header('X-Inertia-Modal'),
        ]);
    }

    public function handle(Request $request, Closure $next)
    {
        $response = parent::handle($request, $next);

        if ($response instanceof RedirectResponse && $request->hasHeader('X-Inertia-Modal-Redirect-Back')) {
            return back(303);
        }

        if ($request->hasHeader('X-Inertia-Modal')) {
            $response->headers->set('X-Inertia-Modal', $request->header('X-Inertia-Modal'));
        }

        return $response;
    }
}
