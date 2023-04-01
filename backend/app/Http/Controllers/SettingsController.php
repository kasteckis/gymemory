<?php

namespace App\Http\Controllers;

use App\Models\Exercise;
use App\Models\User;
use App\Models\Workout;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Ramsey\Uuid\Nonstandard\Uuid;

class SettingsController extends Controller
{
    public function createOrGetApiToStopWorkout(Request $request): JsonResponse
    {
        $apiToken = '';

        // TODO: Regenerate API key on separate endpoint.

        if (auth()->user()) {
            $user = User::findOrFail(auth()->user()->id);

            if ($user->api_token) {
                $apiToken = $user->api_token;
            } else {
                $apiToken = Uuid::uuid4()->toString();

                $user->api_token = $apiToken;
                $user->saveOrFail();
            }
        } else if (isset(request()->query()['guest-code'])) {
            $apiToken = request()->query()['guest-code'];
        }

        return response()->json($apiToken);
    }

    public function stopAllOngoingWorkouts(Request $request): JsonResponse
    {
        if (isset(request()->query()['token'])) {
            $user = User::where('api_token', request()->query()['token'])->first();

            if ($user) {
                $workouts = Workout::where('user_id', $user->id)->where('end_date_time', null)->get();

                foreach ($workouts as $workout) {
                    $workout->update(['end_date_time' => new \DateTime()]);
                    $training_id = $workout->training_id;
                    Exercise::where('training_id', $training_id)->update(['completed' => true]);
                }
            } else {
                // If User was not found, maybe that was guest code. So lets use that to stop ongoing workouts.

                $workouts = Workout::where('guest_code', request()->query()['token'])->where('end_date_time', null)->get();

                foreach ($workouts as $workout) {
                    $workout->update(['end_date_time' => new \DateTime()]);
                    $training_id = $workout->training_id;
                    Exercise::where('training_id', $training_id)->update(['completed' => true]);
                }
            }
        }

        return response()->json('success if API key exists');
    }
}
