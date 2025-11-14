<?php

use Growfund\Supports\Template;

gf_get_header();

echo '<div class="gf-page-container">' . Template::get_campaign_archive_content() . '</div>'; // phpcs:ignore -- already escaped

gf_get_footer();
