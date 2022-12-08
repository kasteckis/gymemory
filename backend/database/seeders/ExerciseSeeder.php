<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class ExerciseSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        DB::table('exercises')->insert([
            'name' => 'Bench Press',
            'count' => '30kg',
            'training_id' => 1,
        ]);

        DB::table('exercises')->insert([
            'name' => 'Push downs',
            'count' => '20x3',
            'training_id' => 1,
        ]);

        DB::table('exercises')->insert([
            'name' => 'Tricep Extensions',
            'count' => '30x4',
            'training_id' => 1,
        ]);

        DB::table('exercises')->insert([
            'name' => 'Pull ups',
            'count' => '10x3',
            'training_id' => 2,
        ]);

        DB::table('exercises')->insert([
            'name' => 'Pullovers',
            'count' => '10x3',
            'training_id' => 2,
        ]);

        DB::table('exercises')->insert([
            'name' => 'T-Bar rows',
            'count' => '25x3',
            'training_id' => 2,
        ]);

        DB::table('exercises')->insert([
            'name' => 'Squats',
            'count' => '12x3 50kg',
            'training_id' => 3,
        ]);

        DB::table('exercises')->insert([
            'name' => 'Leg Press',
            'count' => '25x3 60kg',
            'training_id' => 3,
        ]);

        DB::table('exercises')->insert([
            'name' => 'Leg curls',
            'count' => '10x3 30kg',
            'training_id' => 3,
        ]);
    }
}
