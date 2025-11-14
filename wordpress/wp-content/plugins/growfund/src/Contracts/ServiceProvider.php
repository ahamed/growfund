<?php

namespace Growfund\Contracts;

interface ServiceProvider
{
    /**
     * Register the service provider.
     *
     * @param array $args
     * @return void
     */
    public function register(...$args);
}
