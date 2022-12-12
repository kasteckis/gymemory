<?php

namespace App\Http\Controllers;

use App\Models\Exercise;
use App\Models\Training;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Ramsey\Uuid\Nonstandard\Uuid;
use Ramsey\Uuid\UuidInterface;

class GuestController extends Controller
{
    public function create(Request $request): JsonResponse
    {
        $newGuestAccountId = Uuid::uuid4();

        [$push, $pull, $legs] = $this->createTrainings($newGuestAccountId);

        $this->createPushExercises($push);
        $this->createPullExercises($pull);
        $this->createLegsExercises($legs);

        return response()->json([
            'uuid' => $newGuestAccountId,
        ]);
    }

    /**
     * @param UuidInterface $uuid
     * @return Training[]
     */
    private function createTrainings(UuidInterface $uuid): array
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

    private function createPushExercises(Training $training): void
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

    private function createPullExercises(Training $training): void
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

    private function createLegsExercises(Training $training): void
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
