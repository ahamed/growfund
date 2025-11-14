<?php
// phpcs:ignoreFile

namespace Growfund\Seeders;

use Growfund\Constants\AppreciationType;
use Growfund\Constants\Campaign\ReachingAction;
use Growfund\Constants\MetaKeys\Campaign as CampaignMetaKeys;
use Growfund\Constants\Status\CampaignStatus;
use Growfund\PostTypes\Campaign;
use Growfund\Services\CampaignCategoryService;
use Growfund\Services\CampaignService;
use Growfund\Services\CampaignTagService;
use Growfund\Supports\PostMeta;
use Growfund\Supports\Terms;
use Growfund\Taxonomies\Category;
use Growfund\Taxonomies\Tag;
use Exception;
use WP_Error;

/**
 * Campaign Seeder
 * 
 * Generates 10 random campaigns for both reward and donation modes
 * 
 * @since 1.0.0
 */
class CampaignSeeder
{
    protected $campaign_service;
    protected $category_service;
    protected $tag_service;

    public function __construct()
    {
        $this->campaign_service = new CampaignService();
        $this->category_service = new CampaignCategoryService();
        $this->tag_service = new CampaignTagService();
    }

    /**
     * Run the seeder
     */
    public function run()
    {
        echo "Starting campaign seeder...\n";

        // First, ensure we have categories and tags
        $this->seedCategories();
        $this->seedTags();

        // Get available categories and tags
        $categories = $this->category_service->get_top_level_categories();
        $tags = $this->tag_service->get_all();

        if (empty($categories)) {
            echo "No categories found. Please create categories first.\n";
            return;
        }

        // Generate 5 reward-based campaigns
        for ($i = 1; $i <= 5; $i++) {
            $this->createRewardCampaign($i, $categories, $tags);
        }

        echo "Campaign seeder completed successfully!\n";
    }

    /**
     * Create sample categories if they don't exist
     */
    protected function seedCategories()
    {
        $sample_categories = [
            'Technology',
            'Art & Design',
            'Health & Fitness',
            'Education',
            'Environment',
            'Community',
            'Music & Film',
            'Food & Beverage',
            'Sports',
            'Business'
        ];

        foreach ($sample_categories as $category_name) {
            $existing = get_term_by('name', $category_name, Category::NAME);
            if (!$existing) {
                wp_insert_term($category_name, Category::NAME, [
                    'slug' => sanitize_title($category_name)
                ]);
                echo "Created category: {$category_name}\n";
            }
        }
    }

    /**
     * Create sample tags if they don't exist
     */
    protected function seedTags()
    {
        $sample_tags = [
            'Innovation',
            'Creative',
            'Sustainable',
            'Community-driven',
            'Educational',
            'Health-focused',
            'Tech-savvy',
            'Eco-friendly',
            'Social Impact',
            'Local Business',
            'Startup',
            'Non-profit',
            'Research',
            'Artistic',
            'Entrepreneurial'
        ];

        foreach ($sample_tags as $tag_name) {
            $existing = get_term_by('name', $tag_name, Tag::NAME);
            if (!$existing) {
                wp_insert_term($tag_name, Tag::NAME, [
                    'slug' => sanitize_title($tag_name)
                ]);
                echo "Created tag: {$tag_name}\n";
            }
        }
    }

    /**
     * Create a reward-based campaign
     */
    protected function createRewardCampaign($index, $categories, $tags)
    {
        $campaign_data = $this->getRewardCampaignData($index);

        try {
            // Create the campaign post
            $post_id = wp_insert_post([
                'post_type' => Campaign::NAME,
                'post_title' => $campaign_data['title'],
                'post_content' => $campaign_data['description'],
                'post_status' => 'publish',
                'post_author' => 1, // Admin user
                'post_name' => sanitize_title($campaign_data['title'])
            ]);

            if (is_wp_error($post_id)) {
                throw new Exception('Failed to create campaign post: ' . $post_id->get_error_message());
            }

            // Set campaign metadata
            $this->setCampaignMeta($post_id, $campaign_data, 'reward');

            // Set categories and tags
            $this->setCampaignTerms($post_id, $categories, $tags);

            echo "Created reward campaign: {$campaign_data['title']} (ID: {$post_id})\n";
        } catch (Exception $e) {
            echo "Error creating reward campaign: " . $e->getMessage() . "\n";
        }
    }

    /**
     * Create a donation-based campaign
     */
    protected function createDonationCampaign($index, $categories, $tags)
    {
        $campaign_data = $this->getDonationCampaignData($index);

        try {
            // Create the campaign post
            $post_id = wp_insert_post([
                'post_type' => Campaign::NAME,
                'post_title' => $campaign_data['title'],
                'post_content' => $campaign_data['description'],
                'post_status' => 'publish',
                'post_author' => 1, // Admin user
                'post_name' => sanitize_title($campaign_data['title'])
            ]);

            if (is_wp_error($post_id)) {
                throw new Exception('Failed to create campaign post: ' . $post_id->get_error_message());
            }

            // Set campaign metadata
            $this->setCampaignMeta($post_id, $campaign_data, 'donation');

            // Set categories and tags
            $this->setCampaignTerms($post_id, $categories, $tags);

            echo "Created donation campaign: {$campaign_data['title']} (ID: {$post_id})\n";
        } catch (Exception $e) {
            echo "Error creating donation campaign: " . $e->getMessage() . "\n";
        }
    }

    /**
     * Set campaign metadata
     */
    protected function setCampaignMeta($post_id, $data, $mode)
    {
        // Common metadata
        PostMeta::add($post_id, CampaignMetaKeys::STATUS, CampaignStatus::PUBLISHED);
        PostMeta::add($post_id, CampaignMetaKeys::STORY, $data['story']);
        PostMeta::add($post_id, CampaignMetaKeys::START_DATE, $data['start_date']);
        PostMeta::add($post_id, CampaignMetaKeys::END_DATE, $data['end_date']);
        PostMeta::add($post_id, CampaignMetaKeys::LOCATION, $data['location']);
        PostMeta::add($post_id, CampaignMetaKeys::HAS_GOAL, $data['has_goal']);
        PostMeta::add($post_id, CampaignMetaKeys::GOAL_AMOUNT, $data['goal_amount']);
        PostMeta::add($post_id, CampaignMetaKeys::GOAL_TYPE, $data['goal_type']);
        PostMeta::add($post_id, CampaignMetaKeys::REACHING_ACTION, $data['reaching_action']);
        PostMeta::add($post_id, CampaignMetaKeys::RISK, $data['risk']);
        PostMeta::add($post_id, CampaignMetaKeys::CONFIRMATION_TITLE, $data['confirmation_title']);
        PostMeta::add($post_id, CampaignMetaKeys::CONFIRMATION_DESCRIPTION, $data['confirmation_description']);
        PostMeta::add($post_id, CampaignMetaKeys::PROVIDE_CONFIRMATION_PDF_RECEIPT, true);

        if ($mode === 'reward') {
            // Reward-specific metadata
            PostMeta::add($post_id, CampaignMetaKeys::APPRECIATION_TYPE, AppreciationType::GOODIES);
            PostMeta::add($post_id, CampaignMetaKeys::ALLOW_PLEDGE_WITHOUT_REWARD, $data['allow_pledge_without_reward']);
            PostMeta::add($post_id, CampaignMetaKeys::MIN_PLEDGE_AMOUNT, $data['min_pledge_amount']);
            PostMeta::add($post_id, CampaignMetaKeys::MAX_PLEDGE_AMOUNT, $data['max_pledge_amount']);
            PostMeta::add($post_id, CampaignMetaKeys::REWARDS, $data['rewards']);
        } else {
            // Donation-specific metadata
            PostMeta::add($post_id, CampaignMetaKeys::APPRECIATION_TYPE, AppreciationType::GIVING_THANKS);
            PostMeta::add($post_id, 'allow_custom_donation', $data['allow_custom_donation']);
            PostMeta::add($post_id, 'min_donation_amount', $data['min_donation_amount']);
            PostMeta::add($post_id, 'max_donation_amount', $data['max_donation_amount']);
            PostMeta::add($post_id, 'suggested_option_type', $data['suggested_option_type']);
            PostMeta::add($post_id, 'suggested_options', $data['suggested_options']);
            PostMeta::add($post_id, 'has_tribute', $data['has_tribute']);
            PostMeta::add($post_id, 'tribute_requirement', $data['tribute_requirement']);
            PostMeta::add($post_id, 'tribute_title', $data['tribute_title']);
            PostMeta::add($post_id, 'tribute_options', $data['tribute_options']);
            PostMeta::add($post_id, 'tribute_notification_preference', $data['tribute_notification_preference']);
        }
    }

    /**
     * Set campaign categories and tags
     */
    protected function setCampaignTerms($post_id, $categories, $tags)
    {
        // Set random category
        if (!empty($categories)) {
            $random_category = $categories[array_rand($categories)];
            wp_set_post_terms($post_id, [$random_category['id']], Category::NAME);
        }

        // Set random tags (2-4 tags)
        if (!empty($tags)) {
            $tag_count = rand(2, min(4, count($tags)));
            $random_tags = array_rand($tags, $tag_count);
            if (!is_array($random_tags)) {
                $random_tags = [$random_tags];
            }

            $tag_ids = array_map(function ($index) use ($tags) {
                return $tags[$index]['id'];
            }, $random_tags);

            wp_set_post_terms($post_id, $tag_ids, Tag::NAME);
        }
    }

    /**
     * Get reward campaign data
     */
    protected function getRewardCampaignData($index)
    {
        $titles = [
            'Smart Home Automation System - The Future of Living',
            'Eco-Friendly Water Bottles - Sustainable Hydration Revolution',
            'Premium Coffee Roasting Kit - Craft Your Perfect Cup',
            'Sustainable Fashion Collection - Style Meets Ethics',
            'Educational Board Game - Making Learning Fun',
            'Wireless Charging Station - Power Without Cables',
            'Organic Skincare Line - Natural Beauty Solutions',
            'Smart Garden System - Grow Fresh Herbs Indoors',
            'Handcrafted Leather Goods - Timeless Quality',
            'Solar-Powered Backpack - Adventure Meets Technology',
            'Artisan Chocolate Collection - Premium Cocoa Experience',
            'Modular Desk Organizer - Workspace Productivity',
            'Bamboo Smartphone Stand - Sustainable Tech Accessories',
            'Craft Beer Brewing Kit - Brewery-Quality at Home',
            'Vintage-Inspired Watches - Classic Timepieces Reimagined',
            'Ergonomic Office Chair - Comfort Meets Design',
            'Portable Espresso Maker - Coffee Anywhere',
            'Smart Plant Monitor - Never Kill a Plant Again',
            'Minimalist Wallet - Slim Design, Maximum Function',
            'LED Desk Lamp - Adjustable Lighting for Professionals'
        ];

        $descriptions = [
            'Revolutionary smart home system that learns your habits and automates your daily routines for maximum efficiency and comfort.',
            'Beautiful, sustainable water bottles made from recycled materials, designed to reduce plastic waste and promote healthy hydration.',
            'Premium coffee roasting kit for home enthusiasts, featuring high-quality beans and professional-grade equipment.',
            'Ethically sourced fashion line that combines style with sustainability, supporting local artisans and eco-friendly practices.',
            'Interactive educational board game that makes learning fun for children, covering science, math, and critical thinking skills.',
            'Universal wireless charging station compatible with all devices, eliminating cable clutter and providing fast, efficient power.',
            'Organic skincare line crafted from natural ingredients, providing gentle yet effective solutions for healthy, radiant skin.',
            'Innovative smart garden system that grows fresh herbs indoors year-round, perfect for urban dwellers and cooking enthusiasts.',
            'Handcrafted leather goods made by skilled artisans, combining traditional techniques with modern design for lasting quality.',
            'Solar-powered backpack with built-in charging capabilities, perfect for adventurers who need power on the go.',
            'Premium artisan chocolate collection featuring rare cocoa beans from sustainable farms around the world.',
            'Modular desk organizer system that adapts to your workspace needs, maximizing productivity and minimizing clutter.',
            'Eco-friendly bamboo smartphone stand that combines sustainability with functionality for the modern tech user.',
            'Complete craft beer brewing kit with premium ingredients and equipment to create brewery-quality beer at home.',
            'Vintage-inspired timepieces that blend classic design with modern precision, crafted for the discerning watch enthusiast.',
            'Ergonomic office chair designed by experts to provide optimal comfort and support for long work sessions.',
            'Portable espresso maker that delivers café-quality coffee anywhere, perfect for travelers and coffee lovers.',
            'Smart plant monitoring system with sensors and app integration to help you care for your plants effortlessly.',
            'Ultra-slim minimalist wallet designed for modern life, holding all essentials while maintaining a sleek profile.',
            'Professional LED desk lamp with adjustable brightness and color temperature for optimal workspace lighting.'
        ];

        $stories = [
            'As a tech enthusiast and homeowner, I\'ve always dreamed of creating a truly intelligent home system. After years of research and development, I\'m excited to bring this vision to life with your support.',
            'Our planet needs sustainable solutions now more than ever. This water bottle collection represents our commitment to environmental responsibility while providing beautiful, functional products.',
            'Coffee is more than a beverage - it\'s a craft. This roasting kit brings the art of coffee making to your home, allowing you to create the perfect cup every time.',
            'Fashion should be both beautiful and responsible. Our collection proves that you don\'t have to compromise on style to make ethical choices.',
            'Learning should be an adventure, not a chore. This board game transforms education into an exciting journey that children will love.',
            'In today\'s connected world, we need power solutions that keep up with our lifestyle. This wireless charging station eliminates cable clutter while providing fast, efficient charging.',
            'After struggling with skin issues for years, I discovered the power of natural ingredients. This organic skincare line represents years of research into gentle, effective formulations.',
            'Urban living shouldn\'t mean giving up fresh herbs and vegetables. This smart garden system brings the joy of growing your own food to any indoor space.',
            'Quality craftsmanship is becoming a lost art. These handcrafted leather goods represent traditional techniques passed down through generations, built to last a lifetime.',
            'As an outdoor enthusiast, I was tired of devices dying during adventures. This solar-powered backpack ensures you stay connected no matter where your journey takes you.',
            'Great chocolate tells a story - of the farmers, the soil, and the craft. This collection celebrates the finest cocoa beans while supporting sustainable farming practices.',
            'A cluttered workspace leads to a cluttered mind. This modular desk organizer adapts to your needs, helping you stay focused and productive.',
            'Technology and sustainability can work together beautifully. This bamboo smartphone stand proves that eco-friendly choices don\'t mean compromising on functionality.',
            'Brewing great beer at home should be accessible to everyone. This kit contains everything needed to create brewery-quality beer in your own kitchen.',
            'In a world of disposable everything, these watches represent timeless craftsmanship and enduring style that will last for generations.',
            'After years of back pain from poor office furniture, I set out to design the perfect ergonomic chair that supports health without sacrificing style.',
            'Great coffee shouldn\'t be limited by location. This portable espresso maker delivers café-quality coffee whether you\'re at home, in the office, or on the road.',
            'Plant care doesn\'t have to be guesswork. This smart monitoring system takes the mystery out of plant care, helping you grow thriving indoor gardens.',
            'Modern life requires streamlined solutions. This minimalist wallet holds everything you need while maintaining a sleek profile that fits comfortably in any pocket.',
            'Proper lighting is essential for productivity and eye health. This LED desk lamp provides adjustable, professional-grade lighting for any workspace.'
        ];

        $locations = [
            'Silicon Valley, CA',
            'Portland, OR',
            'Seattle, WA',
            'New York, NY',
            'Boston, MA',
            'San Francisco, CA',
            'Los Angeles, CA',
            'Denver, CO',
            'Brooklyn, NY',
            'Austin, TX',
            'Belgium',
            'Toronto, ON',
            'Vancouver, BC',
            'Chicago, IL',
            'Switzerland',
            'Minneapolis, MN',
            'Miami, FL',
            'Phoenix, AZ',
            'Nashville, TN',
            'San Diego, CA'
        ];

        $title = $titles[$index - 1] ?? "Reward Campaign {$index}";
        $description = $descriptions[$index - 1] ?? "Description for reward campaign {$index}";
        $story = $stories[$index - 1] ?? "Story for reward campaign {$index}";
        $location = $locations[array_rand($locations)];

        $start_date = date('Y-m-d', strtotime('-' . rand(1, 30) . ' days'));
        $end_date = date('Y-m-d', strtotime('+' . rand(30, 90) . ' days'));
        $goal_amount = rand(5000, 50000);

        return [
            'title' => $title,
            'description' => $description,
            'story' => $story,
            'start_date' => $start_date,
            'end_date' => $end_date,
            'location' => $location,
            'has_goal' => true,
            'goal_amount' => $goal_amount,
            'goal_type' => 'raised-amount',
            'reaching_action' => ReachingAction::CONTINUE,
            'confirmation_title' => 'Thank you for your support!',
            'confirmation_description' => 'Your contribution helps make this campaign a reality. We\'ll keep you updated on our progress.',
            'allow_pledge_without_reward' => true,
            'min_pledge_amount' => 10,
            'max_pledge_amount' => 1000,
            'rewards' => $this->generateRewards($goal_amount)
        ];
    }

    /**
     * Get donation campaign data
     */
    protected function getDonationCampaignData($index)
    {
        $titles = [
            'Community Garden Initiative',
            'Children\'s Education Fund',
            'Animal Rescue Shelter',
            'Clean Water Project',
            'Mental Health Support Program'
        ];

        $descriptions = [
            'Help us create a community garden that will provide fresh produce to local families and serve as an educational space for children.',
            'Support education for underprivileged children by providing school supplies, books, and learning resources to families in need.',
            'Fund our animal rescue operations to provide medical care, food, and shelter for abandoned and abused animals.',
            'Bring clean, safe drinking water to communities that lack access to this basic necessity through well construction and water purification systems.',
            'Provide mental health counseling and support services to individuals and families struggling with mental health challenges.'
        ];

        $stories = [
            'Our community has always been about helping each other. This garden will not only provide fresh food but also bring neighbors together in a shared space of growth and learning.',
            'Every child deserves access to quality education. Your donation directly impacts a child\'s future by providing the tools they need to succeed in school.',
            'Animals can\'t speak for themselves, but we can. Our rescue shelter has saved hundreds of lives, and with your help, we can save hundreds more.',
            'Clean water is a basic human right. This project will transform lives by providing access to safe drinking water for entire communities.',
            'Mental health affects us all. This program provides crucial support to those who need it most, creating a stronger, healthier community.'
        ];

        $locations = [
            'Chicago, IL',
            'Miami, FL',
            'Denver, CO',
            'Phoenix, AZ',
            'Boston, MA'
        ];

        $risks = [
            'Weather conditions may affect project timeline. We have contingency plans in place to ensure project completion.',
            'Community participation may vary. We\'re working with local leaders to ensure strong community engagement.',
            'Regulatory approvals may take longer than expected. We\'re working closely with local authorities to expedite the process.',
            'Material costs may fluctuate. We have established relationships with suppliers to minimize cost variations.',
            'Volunteer availability may impact project pace. We have a dedicated team committed to seeing this project through.'
        ];

        $title = $titles[$index - 1] ?? "Donation Campaign {$index}";
        $description = $descriptions[$index - 1] ?? "Description for donation campaign {$index}";
        $story = $stories[$index - 1] ?? "Story for donation campaign {$index}";
        $location = $locations[array_rand($locations)];
        $risk = $risks[array_rand($risks)];

        $start_date = date('Y-m-d', strtotime('-' . rand(1, 30) . ' days'));
        $end_date = date('Y-m-d', strtotime('+' . rand(30, 90) . ' days'));
        $goal_amount = rand(10000, 100000);

        return [
            'title' => $title,
            'description' => $description,
            'story' => $story,
            'start_date' => $start_date,
            'end_date' => $end_date,
            'location' => $location,
            'has_goal' => true,
            'goal_amount' => $goal_amount,
            'goal_type' => 'raised-amount',
            'reaching_action' => ReachingAction::CONTINUE,
            'risk' => $risk,
            'confirmation_title' => 'Thank you for your generous donation!',
            'confirmation_description' => 'Your contribution makes a real difference in our community. We\'ll keep you updated on how your donation is being used.',
            'allow_custom_donation' => true,
            'min_donation_amount' => 5,
            'max_donation_amount' => 5000,
            'suggested_option_type' => 'amount-description',
            'suggested_options' => $this->generateDonationOptions(),
            'has_tribute' => true,
            'tribute_requirement' => 'optional',
            'tribute_title' => 'In Memory Of / In Honor Of',
            'tribute_options' => $this->generateTributeOptions(),
            'tribute_notification_preference' => 'donor-decide'
        ];
    }

    /**
     * Generate rewards for reward campaigns
     */
    protected function generateRewards($goal_amount)
    {
        $rewards = [];
        $reward_amounts = [25, 50, 100, 250, 500];

        foreach ($reward_amounts as $amount) {
            if ($amount <= $goal_amount / 10) { // Only include rewards that make sense relative to goal
                $rewards[] = [
                    'amount' => $amount,
                    'title' => $this->getRewardTitle($amount),
                    'description' => $this->getRewardDescription($amount),
                    'estimated_delivery' => date('Y-m-d', strtotime('+' . rand(60, 120) . ' days')),
                    'shipping' => $amount >= 100 ? 'free' : 'calculated',
                    'limit' => rand(10, 100),
                    'items' => $this->getRewardItems($amount)
                ];
            }
        }

        return $rewards;
    }

    /**
     * Get reward title based on amount
     */
    protected function getRewardTitle($amount)
    {
        $titles = [
            25 => 'Early Bird Special',
            50 => 'Supporter Pack',
            100 => 'Premium Package',
            250 => 'VIP Experience',
            500 => 'Ultimate Bundle'
        ];

        return $titles[$amount] ?? "Reward Tier {$amount}";
    }

    /**
     * Get reward description based on amount
     */
    protected function getRewardDescription($amount)
    {
        $descriptions = [
            25 => 'Get early access to our product with a special discount and exclusive updates.',
            50 => 'Receive the product plus exclusive merchandise and behind-the-scenes content.',
            100 => 'Premium package with additional accessories and priority customer support.',
            250 => 'VIP experience including personal consultation and exclusive access to new features.',
            500 => 'Ultimate bundle with everything plus lifetime updates and premium support.'
        ];

        return $descriptions[$amount] ?? "Description for {$amount} reward tier";
    }

    /**
     * Get reward items based on amount
     */
    protected function getRewardItems($amount)
    {
        $items = [
            25 => [['name' => 'Product', 'quantity' => 1]],
            50 => [['name' => 'Product', 'quantity' => 1], ['name' => 'Sticker Pack', 'quantity' => 1]],
            100 => [['name' => 'Product', 'quantity' => 1], ['name' => 'Accessory Kit', 'quantity' => 1], ['name' => 'Premium Case', 'quantity' => 1]],
            250 => [['name' => 'Product', 'quantity' => 2], ['name' => 'Premium Accessories', 'quantity' => 1], ['name' => 'Exclusive Merchandise', 'quantity' => 1]],
            500 => [['name' => 'Product', 'quantity' => 3], ['name' => 'Complete Accessory Set', 'quantity' => 1], ['name' => 'Limited Edition Items', 'quantity' => 1]]
        ];

        return $items[$amount] ?? [['name' => 'Product', 'quantity' => 1]];
    }

    /**
     * Generate donation options
     */
    protected function generateDonationOptions()
    {
        return [
            ['amount' => 25, 'description' => 'Help provide basic supplies', 'is_default' => false],
            ['amount' => 50, 'description' => 'Support a family for a week', 'is_default' => false],
            ['amount' => 100, 'description' => 'Make a significant impact', 'is_default' => true],
            ['amount' => 250, 'description' => 'Transform multiple lives', 'is_default' => false],
            ['amount' => 500, 'description' => 'Create lasting change', 'is_default' => false]
        ];
    }

    /**
     * Generate tribute options
     */
    protected function generateTributeOptions()
    {
        return [
            ['message' => 'In loving memory of a special person', 'is_editing' => false, 'is_default' => true],
            ['message' => 'In honor of someone who inspired me', 'is_editing' => false, 'is_default' => false],
            ['message' => 'Celebrating a special occasion', 'is_editing' => false, 'is_default' => false],
            ['message' => 'Supporting a cause close to my heart', 'is_editing' => false, 'is_default' => false]
        ];
    }
}
