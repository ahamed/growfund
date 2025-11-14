<?php

/**
 * Renders the filters component for campaign listing
 * 
 * @param array $args {
 *     Optional. Array of arguments.
 *     @type array  $categories     Array of category options
 *     @type array  $filter_state   Array of current filter values
 * }
 */
if (!function_exists('render_filters')) {
    function render_filters($args = [])
    {
        $categories = $args['categories'] ?? [];
        $filter_state = $args['filter_state'] ?? [];

        // Helper function to build hierarchical options for the dropdown
        $build_options_recursive = function ($categories_array, $parent_id = 0) use (&$build_options_recursive) {
            $options = [];
            foreach ($categories_array as $category) {
                if ((int) $category['parent_id'] === (int) $parent_id) {
                    $option = [
                        'value' => $category['slug'] ?? '',
                        'label' => $category['name'] ?? '',
                    ];
                    $children = $build_options_recursive($categories_array, $category['id']);

                    // Always set children, even if empty, to ensure it's treated as a category in the dropdown
                    $option['children'] = $children;

                    $options[] = $option;
                }
            }
            return $options;
        };

        // Prepare category options
        $category_options = $build_options_recursive($categories);

        // Sort options
        $sort_options = [
            [
				'value' => 'newest',
				'label' => __('Newest', 'growfund')
			],
            [
				'value' => 'end_date',
				'label' => __('End Date', 'growfund')
			],
        ];
		?>

        <form method="GET" action="<?php echo esc_url(strtok($_SERVER['REQUEST_URI'], '?')); // phpcs:ignore ?>" class="gf-filters-form">
            <div class="gf-filters">
                <div class="gf-filters__left">
                    <div class="gf-filters__main-search">
                        <div class="gf-filters__search-wrapper">
                            <div class="gf-filters__search-form" id="gf-filters-search-form">
                                <div class="gf-filters__search-field">
                                    <?php
                                    gf_renderer()
                                        ->render('site.components.search-input', [
                                            'placeholder'  => __('Search campaign, categories', 'growfund'),
                                            'disabled'     => false,
                                            'name'         => 'search',
                                            'id'           => 'search',
                                            'value'        => $filter_state['search'] ?? '',
                                            'attributes'   => [
                                                'autocomplete' => 'off',
                                            ],
                                        ]);
                                    ?>
                                </div>
                            </div>
                            <div class="gf-filters__mobile-trigger" id="gf-mobile-filter-trigger">
                                <?php
                                gf_renderer()
                                    ->render('site.components.icon', [
                                        'name' => 'filter',
                                        'size' => '20px',
                                    ]);
                                ?>
                            </div>
                        </div>
                        <div class="gf-filters__category">
                            <?php
                            gf_renderer()
                                ->render('site.components.dropdown', [
                                    'name'       => 'category',
                                    'id'         => 'campaign-category',
                                    'placeholder' => esc_html__('Categories', 'growfund'),
                                    'options'    => $category_options,
                                    'value'      => $filter_state['category'] ?? '',
                                    'variant'    => 'nested',
                                ]);
                            ?>
                        </div>
                        <div class="gf-filters__clear-all" id="gf-desktop-filter-clear" data-clear-filters>
                            <?php esc_html_e('Clear All', 'growfund'); ?>
                        </div>
                    </div>
                </div>
                <div class="gf-filters__right">
                    <div class="gf-filters__sort">
                        <?php
                        gf_renderer()
                            ->render('site.components.dropdown', [
                                'name'       => 'sort',
                                'id'         => 'campaign-sort',
                                'placeholder' => esc_html__('Sort by', 'growfund'),
                                'options'    => $sort_options,
                                'value'      => $filter_state['sort'] ?? '',
                            ]);
                        ?>
                    </div>

                </div>
            </div>
        </form>
        <?php
        gf_renderer()
            ->render('site.components.mobile-filters', get_defined_vars());
        ?>

		<?php
    }
}

// Call the render function with the passed data
render_filters(get_defined_vars());
?>