<?php

namespace Growfund\DTO\Page;

use Growfund\DTO\DTO;

class PageListItemDTO extends DTO
{
    /**
     * @var string
     */
    public $id;

    /**
     * @var string
     */
    public $name;

    /**
     * @var string
     */
    public $slug;

    /**
     * @var string
     */
    public $url;

    /**
     * @var string
     */
    public $parent_id;
}
