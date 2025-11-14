<?php

namespace Growfund\Controllers\Site;

/**
 * Guest Controller
 * @since 1.0.0
 */
class GuestController
{
    public function show()
    {
        return gf_renderer()->get_html('dashboard.app', ['as_guest' => true]);
    }
}
