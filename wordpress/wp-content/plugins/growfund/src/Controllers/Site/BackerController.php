<?php

namespace Growfund\Controllers\Site;

class BackerController
{
    public function show()
    {
        return gf_renderer()->get_html('dashboard.app');
    }
}
