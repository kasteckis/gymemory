<?php

namespace App\Http\Controllers;

use App\Http\DTO\WorkoutResponseDTO;
use App\Http\Requests\StoreWorkoutRequest;
use App\Http\Requests\UpdateWorkoutRequest;
use App\Models\Exercise;
use App\Models\Training;
use App\Models\Workout;
use Illuminate\Auth\Access\AuthorizationException;
use Illuminate\Http\JsonResponse;

class WorkoutController extends Controller
{
    public function index(): array|null
    {
        if (auth()->user()) {
            $workout = Workout::where('user_id', auth()->user()->id)->where('end_date_time', null)->first();

            return $workout ? (new WorkoutResponseDTO($workout))->toJson() : null;
        } else if (isset(request()->query()['guest-code'])) {
            $workout = Workout::where('guest_code', request()->query()['guest-code'])->where('end_date_time', null)->first();

            return $workout ? (new WorkoutResponseDTO($workout))->toJson() : null;
        }

        throw new AuthorizationException('');
    }

    public function show(Workout $workout): Workout
    {
        $this->isAuthorized($workout);

        return $workout;
    }

    public function store(StoreWorkoutRequest $request): Workout
    {
        if (auth()->user()) {
            if (!Training::where('id', $request->training_id)->where('user_id', auth()->user()->id)->exists()) {
                return response()->json(['error' => 'This training does not belong to this user'], 403);
            }

            if (Workout::where('user_id', auth()->user()->id)->where('end_date_time', null)->exists()) {
                return response()->json(['error' => 'You already have active workout. Finish it first.'], 403);
            }

            $workout = Workout::create([
                'user_id' => auth()->user()->id,
                'owner_is_guest' => false,
                'start_date_time' => new \DateTime($request->start_date_time),
                'locker_number' => $request->locker_number,
                'training_id' => $request->training_id,
            ]);

            Exercise::where('training_id', $request->training_id)->update(['completed' => 0]);

            return $workout;
        } else if (isset(request()->query()['guest-code'])) {
            if (!Training::where('id', $request->training_id)->where('guest_code', request()->query()['guest-code'])->exists()) {
                return response()->json(['error' => 'This training does not belong to this user'], 403);
            }

            if (Workout::where('guest_code', request()->query()['guest-code'])->where('end_date_time', null)->exists()) {
                return response()->json(['error' => 'You already have active workout. Finish it first.'], 403);
            }

            $workout = Workout::create([
                'guest_code' => request()->query()['guest-code'],
                'owner_is_guest' => true,
                'start_date_time' => new \DateTime($request->start_date_time),
                'locker_number' => $request->locker_number,
                'training_id' => $request->training_id,
            ]);

            return $workout;
        }

        throw new AuthorizationException('');
    }

    public function update(UpdateWorkoutRequest $request, Workout $workout): Workout|JsonResponse
    {
        if (auth()->user()) {
            if ($workout->user_id == auth()->user()->id) {
                $workout->end_date_time = new \DateTime($request->end_date_time);
                $workout->save();

                return $workout;
            }
        } else if (isset(request()->query()['guest-code'])) {
            if ($workout->guest_code === request()->query()['guest-code']) {
                $workout->end_date_time = new \DateTime($request->end_date_time);
                $workout->save();

                return $workout;
            }
        }

        return response()->json(['error' => 'Forbidden'], 403);
    }

    public function markAllWorkoutExercisesAsFinished(Workout $workout): JsonResponse
    {
        $training_id = $workout->training_id;

        if (auth()->user()) {
            if ($workout->user_id == auth()->user()->id) {
                Exercise::where('training_id', $training_id)->update(['completed' => true]);

                return response()->json();
            }
        } else if (isset(request()->query()['guest-code'])) {
            if ($workout->guest_code === request()->query()['guest-code']) {
                Exercise::where('training_id', $training_id)->update(['completed' => true]);

                return response()->json();
            }
        }

        return response()->json(['error' => 'Forbidden'], 403);
    }

    public function isAuthorized(Workout $workout): bool
    {
        if (auth()->user()) {
            if ($workout->user_id !== auth()->user()->id) {
                throw new AuthorizationException('');
            }
        } else if (isset(request()->query()['guest-code'])) {
            if (request()->query()['guest-code'] !== $workout->guest_code) {
                throw new AuthorizationException('');
            }
        } else {
            throw new AuthorizationException('');
        }

        return true;
    }
}
