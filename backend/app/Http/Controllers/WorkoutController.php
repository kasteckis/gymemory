<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreWorkoutRequest;
use App\Http\Requests\UpdateWorkoutRequest;
use App\Models\Exercise;
use App\Models\Training;
use App\Models\Workout;

class WorkoutController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        //
    }

    /**
     * Show the form for creating a new resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \App\Http\Requests\StoreWorkoutRequest  $request
     * @return \Illuminate\Http\Response
     */
    public function store(StoreWorkoutRequest $request)
    {
        // Todo check if there is an active workout, dont allow to create another one

        if (auth()->user()) {
            if (!Training::where('id', $request->training_id)->where('user_id', auth()->user()->id)->exists()) {
                return response()->json(['error' => 'This training does not belong to this user'], 403);
            }

            $workout = Workout::create([
                'user_id' => auth()->user()->id,
                'owner_is_guest' => false,
                'start_date_time' => new \DateTime($request->start_date_time),
                'locker_number' => $request->locker_number,
                'training_id' => $request->training_id,
            ]);

            return $workout;
        } else if (isset(request()->query()['guest-code'])) {
            if (!Training::where('id', $request->training_id)->where('guest_code', request()->query()['guest-code'])->exists()) {
                return response()->json(['error' => 'This training does not belong to this user'], 403);
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
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \App\Http\Requests\UpdateWorkoutRequest  $request
     * @param  \App\Models\Workout  $workout
     * @return \Illuminate\Http\Response
     */
    public function update(UpdateWorkoutRequest $request, Workout $workout)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\Models\Workout  $workout
     * @return \Illuminate\Http\Response
     */
    public function destroy(Workout $workout)
    {
        //
    }
}
