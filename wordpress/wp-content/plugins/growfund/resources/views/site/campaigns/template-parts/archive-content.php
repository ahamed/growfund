<?php

$initial_has_more = $data['campaigns']->has_more ?? false;
$initial_total_campaigns = $data['campaigns']->total ?? 0;
?>

<script type="text/javascript">
    var growfundArchiveData = {
        initialHasMore: <?php echo wp_json_encode($initial_has_more); ?>,
        initialPage: 2, // Next page to load
        initialLimit: <?php echo wp_json_encode($initial_limit); ?>,
        initialTotalCampaigns: <?php echo wp_json_encode($initial_total_campaigns); ?>,
    };
</script>

<!-- Hero Section -->
<section class="gf-hero">
    <div class="gf-hero__background"></div>
    <div class="gf-container">
        <div class="gf-hero__content">
            <h1 class="gf-hero__title"><?php esc_html_e('Support causes', 'growfund'); ?><br><?php esc_html_e('that matter', 'growfund'); ?></h1>
            <p class="gf-hero__description"><?php esc_html_e('Browse fundraisers and contribute to meaningful causes.', 'growfund'); ?></p>
            <div class="gf-hero__buttons">
                <?php
                gf_renderer()
                    ->render('site.components.button', [
                        'text' => __('Start a Fundraiser', 'growfund'),
                        'class' => 'gf-btn--primary'
                    ]);
				?>
            </div>
        </div>
        <div class="gf-hero__image">
            <!-- Hero image placeholder -->
        </div>
    </div>
</section>

<!-- Main Content -->
<div class="gf-container gf-main-content">
    <div class="gf-content-layout">
        <!-- Filters -->
        <?php
        gf_renderer()
            ->render('site.components.filters', [
                'categories' => $data['categories'] ?? [],
                'filter_state' => $filter_state,
            ]);
        ?>

        <!-- Main Content Area -->
        <main class="gf-main-area">
            <?php
            $is_search = !empty(trim($filter_state['search'] ?? '')) ||
                !empty($filter_state['category'] ?? '') ||
                !empty($filter_state['location'] ?? '') ||
                !empty($filter_state['sort'] ?? '');
            ?>
            <!-- Always include the campaign list container for infinite scroll -->
            <div id="gf-campaign-list-container">
                <?php if (!empty($data['campaigns']) && count($data['campaigns']->results)) : ?>
                    <?php if (!$is_search) : ?>
                        <!-- Featured projects slider (only show on default view) -->
                        <div class="gf-featured-projects">
                            <?php
                            // Use the featured campaigns data directly
                            $featured_campaigns = $featured_data['campaigns']->results;

                            // Show initial featured campaigns in the slider
                            $slider_campaigns = $featured_campaigns;
                            $campaign_per_page = 2; // Show 2 items per view

                            gf_renderer()
                                ->render('site.components.campaign-slider', [
                                    'campaigns' => $slider_campaigns, // Initial featured campaigns
                                    'all_campaigns' => $slider_campaigns, // Initial featured campaigns
                                    'variant' => 'featured',
                                    'total' => $featured_data['campaigns']->total ?? 0, // Total available featured campaigns
                                    'per_page' => $campaign_per_page,
                                    'current_page' => 1,
                                    'has_more' => $featured_data['campaigns']->has_more ?? false, // Enable dynamic loading if more available
                                    'header' => esc_html__('Featured Campaigns', 'growfund'),
                                    'limit' => $featured_initial_limit, // Load more items at a time for testing
                                    'total_loaded' => count($slider_campaigns)
                                ]);
                            ?>
                        </div>
                    <?php endif; ?>

                    <?php
                    gf_renderer()
                        ->render('site.components.campaign-list', [
                            'campaigns' => $data['campaigns'],
                            'header' => $is_search ? '' : esc_html__('All Campaigns', 'growfund'),
                        ]);
                    ?>
                <?php else : ?>
                    <div class="gf-no-campaigns">
                        <div class="gf-no-campaigns__content">
                            <h2><?php esc_html_e('No campaigns found.', 'growfund'); ?></h2>
                        </div>
                    </div>
                <?php endif; ?>
            </div>
        </main>
    </div>
</div>