<?php

namespace App\Http\Services;

use App\Http\Requests\UpdateExerciseRequest;
use App\Models\Exercise;

class ExerciseSyncService
{
    public static function syncOtherExerciseCounts(Exercise $exercise, string $newCount)
    {
        $otherExercisesWithSameName = [];

        if (auth()->user()) {
            $otherExercisesWithSameName = Exercise::join('trainings', 'exercises.training_id', '=', 'trainings.id')
                ->where('trainings.user_id', '=', auth()->user()->id)
                ->where('exercises.name', '=', $exercise->name)
                ->where('exercises.id', '!=', $exercise->id)
                ->select('exercises.*')
                ->get();
        } else if (isset(request()->query()['guest-code'])) {
            $otherExercisesWithSameName = Exercise::join('trainings', 'exercises.training_id', '=', 'trainings.id')
                ->where('trainings.guest_code', '=', request()->query()['guest-code'])
                ->where('exercises.name', '=', $exercise->name)
                ->where('exercises.id', '!=', $exercise->id)
                ->select('exercises.*')
                ->get();
        }

        foreach ($otherExercisesWithSameName as $otherExercise) {
            $otherExercise->count = $newCount;
            $otherExercise->save();
        }
    }
}
