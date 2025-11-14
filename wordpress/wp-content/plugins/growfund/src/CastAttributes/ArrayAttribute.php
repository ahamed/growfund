<?php

namespace Growfund\CastAttributes;

use Growfund\Contracts\CastAttribute;

class ArrayAttribute implements CastAttribute
{
    public function get($value)
    {
        if (empty($value) || is_array($value)) {
            return $value;
        }

        if (gf_is_valid_json($value)) {
            return json_decode($value, true);
        }

        if (is_serialized($value)) {
            return maybe_unserialize($value);
        }

        return $value;
    }
}
