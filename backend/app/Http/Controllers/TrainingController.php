<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreTrainingRequest;
use App\Http\Requests\UpdateTrainingRequest;
use App\Models\Training;
use Illuminate\Auth\Access\AuthorizationException;
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
        if (auth()->user()) {
            $training = new Training();
            $training->user_id = auth()->user()->id;
            $training->name = $request->name;
            $training->owner_is_guest = false;
            $training->save();

            return $training;
        } else if (isset(request()->query()['guest-code'])) {
            $training = new Training();
            $training->owner_is_guest = true;
            $training->name = $request->name;
            $training->guest_code = request()->query()['guest-code'];
            $training->save();

            return $training;
        }

        throw new BadRequestHttpException('');
    }

    /**
     * Display the specified resource.
     *
     * @param Training $training
     * @return \Illuminate\Http\Response
     */
    public function show(Training $training)
    {
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
        if (auth()->user()) {
            $training->name = $request->name;
            $training->save();

            return $training;
        } else if (isset(request()->query()['guest-code'])) {
            if ($training->guest_code === request()->query()['guest-code']) {
                $training->name = $request->name;
                $training->save();

                return $training;
            }
        }

        throw new NotFoundHttpException('');
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\Models\Training  $training
     * @return \Illuminate\Http\Response
     */
    public function destroy(Training $training)
    {
        if (auth()->user()) {
            $training->delete();

            return ['success'];
        } else if (isset(request()->query()['guest-code'])) {
            if ($training->guest_code === request()->query()['guest-code']) {

                $training->delete();

                return ['success'];
            }
        }

        throw new NotFoundHttpException('');
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
