<?php

namespace App\Http\Controllers;

use App\Models\Exercise;
use App\Models\User;
use App\Models\Workout;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class SettingsController extends Controller
{
    public function createOrGetApiToStopWorkout(Request $request): JsonResponse
    {
        $apiToken = '';

        // TODO: Regenerate API key on separate endpoint.
        // TODO: Check if API key doesnt exist in DB.

        if (auth()->user()) {
            $user = User::findOrFail(auth()->user()->id);

            if ($user->api_token) {
                $apiToken = $user->api_token;
            } else {
                $apiToken = bin2hex(random_bytes(32));

                $user->api_token = $apiToken;
                $user->saveOrFail();
            }
        } else if (isset(request()->query()['guest-code'])) {
            $user = User::where('guest_code', request()->query()['guest-code'])->firstOrFail();

            if (!$user->api_token) {
                $apiToken = bin2hex(random_bytes(32));

                $user->api_token = $apiToken;
                $user->saveOrFail();
            }
        }

        return response()->json($apiToken);
    }

    public function stopAllOngoingWorkouts(Request $request): JsonResponse
    {
        if (isset(request()->query()['token'])) {
            $user = User::where('api_token', request()->query()['token'])->firstOrFail();

            $workouts = Workout::where('user_id', $user->id)->where('end_date_time', null)->get();

            foreach ($workouts as $workout) {
                $workout->update(['end_date_time' => new \DateTime()]);
                $training_id = $workout->training_id;
                Exercise::where('training_id', $training_id)->update(['completed' => true]);
            }
        }

        return response()->json('success if API key exists');
    }
}
