<?php

namespace Growfund\Controllers\Site;

class DonorController
{
    public function show()
    {
        return gf_renderer()->get_html('dashboard.app');
    }
}
