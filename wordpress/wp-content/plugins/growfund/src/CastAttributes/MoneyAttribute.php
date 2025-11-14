<?php

namespace Growfund\CastAttributes;

use Growfund\Contracts\CastAttribute;
use Growfund\Supports\Money;

class MoneyAttribute implements CastAttribute
{
    public function get($value)
    {
        if (is_null($value)) {
            return $value;
        }

        return Money::prepare_for_display($value);
    }
}
