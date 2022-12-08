<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        DB::table('users')->insert([
            'name' => 'Dev Admin',
            'email' => 'admin@admin.dev',
            'password' => Hash::make('admin'),
            'register_ip' => fake()->ipv4,
            'last_login_ip' => 'never logged in',
        ]);

        User::factory()->count(5)->create();
    }
}
