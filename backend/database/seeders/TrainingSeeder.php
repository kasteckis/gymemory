<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class TrainingSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        DB::table('trainings')->insert([
            'name' => 'Push',
            'owner_is_guest' => false,
            'guest_code' => null,
            'user_id' => 1,
        ]);

        DB::table('trainings')->insert([
            'name' => 'Pull',
            'owner_is_guest' => false,
            'guest_code' => null,
            'user_id' => 1,
        ]);

        DB::table('trainings')->insert([
            'name' => 'Legs',
            'owner_is_guest' => false,
            'guest_code' => null,
            'user_id' => 1,
        ]);
    }
}
