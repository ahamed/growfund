<?php

/**
 * Badge Component
 * Flexible badge component for displaying status, categories, or labels
 * 
 * @param string $text - Badge text content
 * @param string $variant - Badge variant (default, success, warning, danger, info)
 * @param string $class - Custom CSS classes for styling
 * @param array $attributes - Additional HTML attributes
 */

use Growfund\Supports\ClassHelper;

$text = $text ?? '';
$variant = $variant ?? 'default';
$class = $class ?? '';
$attributes = $attributes ?? [];

// Variant-specific configurations
$variantConfigs = [
    'default' => [
        'classes' => ['gf-badge']
    ],
    'success' => [
        'classes' => ['gf-badge', 'gf-badge-success']
    ],
    'warning' => [
        'classes' => ['gf-badge', 'gf-badge-warning']
    ],
    'danger' => [
        'classes' => ['gf-badge', 'gf-badge-danger']
    ],
    'info' => [
        'classes' => ['gf-badge', 'gf-badge-info']
    ]
];

// Build class string using helper
$classString = ClassHelper::buildClassStringFromVariant($variantConfigs, $variant, $class);

// Build attributes string using helper
$attributeString = ClassHelper::buildAttributesString($attributes, ClassHelper::getDefaultDangerousAttributes());
?>

<span
    class="<?php echo esc_attr($classString); ?>"
    <?php echo $attributeString; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- Already escaped ?>>
    <?php echo esc_html($text); ?>
</span>