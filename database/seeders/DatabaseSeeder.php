<?php

namespace Database\Seeders;

use App\Models\User;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        $this->call(StorefrontCatalogSeeder::class);

        User::updateOrCreate(
            ['email' => 'admin@myntra.test'],
            [
                'name' => 'Myntra Admin',
                'phone' => '9999999999',
                'role' => User::ROLE_ADMIN,
                'password' => Hash::make('password'),
            ],
        );

        User::updateOrCreate(
            ['email' => 'test@example.com'],
            [
                'name' => 'Test User',
                'phone' => '9876543210',
                'role' => User::ROLE_CUSTOMER,
                'password' => Hash::make('password'),
            ],
        );
    }
}
