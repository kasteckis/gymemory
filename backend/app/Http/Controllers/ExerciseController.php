<?php

namespace App\Http\Controllers;

use App\Http\Requests\CompleteExerciseRequest;
use App\Http\Requests\StoreExerciseRequest;
use App\Http\Requests\UpdateExerciseRequest;
use App\Models\Exercise;
use App\Models\Training;
use Illuminate\Auth\Access\AuthorizationException;
use Illuminate\Support\Facades\DB;

class ExerciseController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index(Training $training)
    {
        if (auth()->user()) {
            return DB::table('exercises')
                ->select(['exercises.id', 'exercises.name', 'exercises.count', 'exercises.created_at', 'exercises.updated_at'])
                ->join('trainings', 'exercises.training_id', '=', 'trainings.id')
                ->where('exercises.deleted_at', '=', null)
                ->where('trainings.user_id', '=', auth()->user()->id)
                ->where('trainings.id', '=', $training->id)
                ->get();
        } else if (isset(request()->query()['guest-code'])) {
            return DB::table('exercises')
                ->select(['exercises.id', 'exercises.name', 'exercises.count', 'exercises.created_at', 'exercises.updated_at'])
                ->join('trainings', 'exercises.training_id', '=', 'trainings.id')
                ->where('exercises.deleted_at', '=', null)
                ->where('trainings.guest_code', '=', request()->query()['guest-code'])
                ->where('trainings.id', '=', $training->id)
                ->get();
        }

        return [];
    }

    public function exercisesByWorkout(string $workout)
    {
        if (auth()->user()) {
            return Exercise::
                select([
                    'exercises.id',
                    'exercises.name',
                    'exercises.count',
                    'exercises.created_at',
                    'exercises.updated_at',
                    'exercises.training_id',
                    'exercises.completed'
                ])
                ->join('trainings', 'exercises.training_id', '=', 'trainings.id')
                ->join('workouts', 'workouts.training_id', '=', 'trainings.id')
                ->where('trainings.user_id', '=', auth()->user()->id)
                ->where('workouts.id', '=', $workout)
                ->get()
            ;
        } else if (isset(request()->query()['guest-code'])) {
            return Exercise::
                select([
                    'exercises.id',
                    'exercises.name',
                    'exercises.count',
                    'exercises.created_at',
                    'exercises.updated_at',
                    'exercises.training_id',
                    'exercises.completed'
                ])
                ->join('trainings', 'exercises.training_id', '=', 'trainings.id')
                ->join('workouts', 'workouts.training_id', '=', 'trainings.id')
                ->where('trainings.guest_code', '=', request()->query()['guest-code'])
                ->where('workouts.id', '=', $workout)
                ->get()
            ;
        }

        return [];
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \App\Http\Requests\StoreExerciseRequest  $request
     * @return \Illuminate\Http\Response
     */
    public function store(StoreExerciseRequest $request)
    {
        $training = Training::find($request->training_id);

        $this->isAuthorized($training);

        $exercise = new Exercise;
        $exercise->name = $request->name;
        $exercise->count = $request->count;
        $exercise->training_id = $request->training_id;
        $exercise->save();

        return $exercise;
    }

    /**
     * Display the specified resource.
     *
     * @param  \App\Models\Exercise  $exercise
     * @return \Illuminate\Http\Response
     */
    public function show(Exercise $exercise)
    {
        $training = Training::find($exercise->training_id);

        $this->isAuthorized($training);

        return $exercise;
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \App\Http\Requests\UpdateExerciseRequest  $request
     * @param  \App\Models\Exercise  $exercise
     * @return \Illuminate\Http\Response
     */
    public function update(UpdateExerciseRequest $request, Exercise $exercise)
    {
        $training = Training::find($exercise->training_id);

        $this->isAuthorized($training);

        $exercise->name = $request->name;
        $exercise->count = $request->count;
        $exercise->save();

        return $exercise;
    }

    public function completeExercise(CompleteExerciseRequest $request, Exercise $exercise)
    {
        $training = Training::find($exercise->training_id);

        $this->isAuthorized($training);

        $exercise->completed = $request->completed;

        $exercise->save();

        return $exercise;
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\Models\Exercise  $exercise
     * @return \Illuminate\Http\Response
     */
    public function destroy(Exercise $exercise)
    {
        $training = Training::find($exercise->training_id);

        $this->isAuthorized($training);

        $exercise->delete();

        return ['success'];
    }

    public function isAuthorized(Training $training): bool
    {
        if (auth()->user()) {
            if ($training->user_id !== auth()->user()->id) {
                throw new AuthorizationException('');
            }
        } else if (isset(request()->query()['guest-code'])) {
            if (request()->query()['guest-code'] !== $training->guest_code) {
                throw new AuthorizationException('');
            }
        } else {
            throw new AuthorizationException('');
        }

        return true;
    }
}
