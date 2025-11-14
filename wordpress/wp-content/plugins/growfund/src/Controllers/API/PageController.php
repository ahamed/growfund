<?php

namespace Growfund\Controllers\API;

use Growfund\Contracts\Request;
use Growfund\Http\Response;
use Growfund\Services\PageService;
use WP_User_Query;

class PageController
{
    protected $service;

    /**
     * Initialize the controller with PageService.
     */
    public function __construct(PageService $service)
    {
        $this->service = $service;
    }

    /**
     * Retrieve all pages.
     *
     * @param Request $request The HTTP request instance.
     * @return Response JSON response containing all pages data.
     */

    public function all(Request $request) // phpcs:ignore
    {
        $results = $this->service->all();

        return gf_response()->json([
            'data' => $results,
            'message' => '',
        ], Response::OK);
    }
}
