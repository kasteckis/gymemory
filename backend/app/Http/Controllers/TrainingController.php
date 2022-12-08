<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreTrainingRequest;
use App\Http\Requests\UpdateTrainingRequest;
use App\Models\Training;
use Symfony\Component\HttpKernel\Exception\BadRequestHttpException;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;

class TrainingController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        if (auth()->user()) {
            return Training::where('user_id', auth()->user()->id)->get();
        } else if (isset(request()->query()['guest-code'])) {
            return Training::where('guest_code', request()->query()['guest-code'])->get();
        }

        throw new BadRequestHttpException('');
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \App\Http\Requests\StoreTrainingRequest  $request
     * @return \Illuminate\Http\Response
     */
    public function store(StoreTrainingRequest $request)
    {
        $training = new Training();
        $training->user_id = auth()->user()->id;
        $training->name = $request->name;
        $training->description = $request->description;
        $training->save();

        return $training;
    }

    /**
     * Display the specified resource.
     *
     * @param int $id
     * @return \Illuminate\Http\Response
     */
    public function show(int $id)
    {
        $training = Training::find($id);

        if (auth()->user()) {
            if ($training->user_id === auth()->user()->id) {
                return $training;
            }
        } else if (isset(request()->query()['guest-code'])) {
            if ($training->guest_code === request()->query()['guest-code']) {
                return $training;
            }
        }

        throw new NotFoundHttpException('');
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \App\Http\Requests\UpdateTrainingRequest  $request
     * @param  \App\Models\Training  $training
     * @return \Illuminate\Http\Response
     */
    public function update(UpdateTrainingRequest $request, Training $training)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\Models\Training  $training
     * @return \Illuminate\Http\Response
     */
    public function destroy(Training $training)
    {
        //
    }
}
