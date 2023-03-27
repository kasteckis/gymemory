<?php

namespace App\Http\Controllers;

use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class SettingsController extends Controller
{
    public function createOrGetApiToStopWorkout(Request $request): JsonResponse
    {
        return response()->json('soon todo');
    }

    public function stopAllOngoingWorkouts(Request $request): JsonResponse
    {
        return response()->json('todo');
    }
}
