<?php

namespace App\Http\Services;

use App\Models\Exercise;
use App\Models\Training;
use Ramsey\Uuid\UuidInterface;

class CreateTrainingsService
{
    /**
     * @param UuidInterface $uuid
     * @return Training[]
     */
    public static function createTrainings(UuidInterface $uuid): array
    {
        $push = Training::create([
            'name' => 'Push',
            'owner_is_guest' => true,
            'guest_code' => $uuid,
        ]);

        $pull = Training::create([
            'name' => 'Pull',
            'owner_is_guest' => true,
            'guest_code' => $uuid,
        ]);

        $legs = Training::create([
            'name' => 'Legs',
            'owner_is_guest' => true,
            'guest_code' => $uuid,
        ]);

        return [$push, $pull, $legs];
    }

    /**
     * @param int $userId
     * @return Training[]
     */
    public static function createTrainingsForRealUser(int $userId): array
    {
        $push = Training::create([
            'name' => 'Push',
            'owner_is_guest' => false,
            'user_id' => $userId,
        ]);

        $pull = Training::create([
            'name' => 'Pull',
            'owner_is_guest' => false,
            'user_id' => $userId,
        ]);

        $legs = Training::create([
            'name' => 'Legs',
            'owner_is_guest' => false,
            'user_id' => $userId,
        ]);

        return [$push, $pull, $legs];
    }

    public static function createPushExercises(Training $training): void
    {
        Exercise::create([
            'name' => 'Bench Press',
            'count' => '30kg',
            'training_id' => $training->id,
        ]);

        Exercise::create([
            'name' => 'Push downs',
            'count' => '20x3',
            'training_id' => $training->id,
        ]);

        Exercise::create([
            'name' => 'Tricep Extensions',
            'count' => '30x4',
            'training_id' => $training->id,
        ]);
    }

    public static function createPullExercises(Training $training): void
    {
        Exercise::create([
            'name' => 'Pull ups',
            'count' => '10x3',
            'training_id' => $training->id,
        ]);

        Exercise::create([
            'name' => 'Pullovers',
            'count' => '10x3',
            'training_id' => $training->id,
        ]);

        Exercise::create([
            'name' => 'T-Bar rows',
            'count' => '25x3',
            'training_id' => $training->id,
        ]);
    }

    public static function createLegsExercises(Training $training): void
    {
        Exercise::create([
            'name' => 'Squats',
            'count' => '12x3 50kg',
            'training_id' => $training->id,
        ]);

        Exercise::create([
            'name' => 'Leg Press',
            'count' => '25x3 60kg',
            'training_id' => $training->id,
        ]);

        Exercise::create([
            'name' => 'Leg curls',
            'count' => '10x3 30kg',
            'training_id' => $training->id,
        ]);
    }
}
