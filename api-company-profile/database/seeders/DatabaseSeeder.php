<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use App\Models\AdminUser;
use App\Models\Hero;
use App\Models\About;
use App\Models\Service;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        // Create default admin user
        AdminUser::firstOrCreate(
            ['username' => 'rizztech'],
            ['password' => Hash::make('rizzduluking')]
        );

        // Create default hero
        Hero::firstOrCreate(
            ['id' => 1],
            [
                'badge_text' => '🚀 Shaping the Digital Future',
                'title_line1' => 'Innovating',
                'title_line2' => 'The Future',
                'description' => 'We are RizzTech. A leading software house crafting digital experiences with cutting-edge technology and premium design.',
                'button1_text' => 'Get Started',
                'button1_link' => '#contact',
                'button2_text' => 'Learn More',
                'button2_link' => '#about',
            ]
        );

        // Create default about
        About::firstOrCreate(
            ['id' => 1],
            [
                'title' => 'About RizzTech',
                'description' => 'We are a leading software house crafting digital experiences.',
                'mission' => 'To deliver cutting-edge solutions.',
                'vision' => 'To be the #1 tech partner.',
            ]
        );

        // Create default services
        $services = [
            ['icon_name' => 'Globe', 'title' => 'Web Development', 'description' => 'Modern, responsive, and high-performance websites built with the latest technologies.'],
            ['icon_name' => 'Smartphone', 'title' => 'Mobile Apps', 'description' => 'Native and cross-platform mobile applications for iOS and Android.'],
            ['icon_name' => 'Palette', 'title' => 'UI/UX Design', 'description' => 'Intuitive and visually stunning designs that prioritize user experience.'],
            ['icon_name' => 'Server', 'title' => 'Backend Solutions', 'description' => 'Robust and scalable backend architectures to power your applications.'],
            ['icon_name' => 'Code', 'title' => 'Custom Software', 'description' => 'Tailored software solutions designed for your specific business needs.'],
            ['icon_name' => 'Shield', 'title' => 'Cybersecurity', 'description' => 'Protecting your digital assets with advanced security measures.'],
        ];

        foreach ($services as $service) {
            Service::firstOrCreate(['title' => $service['title']], $service);
        }
    }
}
