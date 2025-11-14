<?php

namespace Growfund\Payments\DTO;

use Growfund\DTO\DTO;

class PaymentResponseDTO extends DTO
{
    public $is_redirect;
    public $redirect_url;
    public $transaction_id;
    public $previous_transaction_id;
    public $payment_form;
    public $raw;
}
