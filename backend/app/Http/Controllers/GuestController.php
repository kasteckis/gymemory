<?php

namespace App\Http\Controllers;

use App\Http\Services\CreateTrainingsService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Ramsey\Uuid\Nonstandard\Uuid;

class GuestController extends Controller
{
    public function create(Request $request): JsonResponse
    {
        $newGuestAccountId = Uuid::uuid4();

        [$push, $pull, $legs] = CreateTrainingsService::createTrainings($newGuestAccountId);

        CreateTrainingsService::createPushExercises($push);
        CreateTrainingsService::createPullExercises($pull);
        CreateTrainingsService::createLegsExercises($legs);

        return response()->json([
            'uuid' => $newGuestAccountId,
        ]);
    }
}
