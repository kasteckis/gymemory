<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreTrainingRequest;
use App\Http\Requests\UpdateTrainingRequest;
use App\Models\Exercise;
use App\Models\Training;
use App\Models\Workout;
use Illuminate\Auth\Access\AuthorizationException;
use Illuminate\Database\Eloquent\Collection;
use Symfony\Component\HttpKernel\Exception\BadRequestHttpException;

class TrainingController extends Controller
{
    public function index(): Collection
    {
        if (auth()->user()) {
            $trainings = Training::where('user_id', auth()->user()->id)->get();

            foreach ($trainings as $training) {
                $exercisesCount = Exercise::
                join('trainings', 'exercises.training_id', '=', 'trainings.id')
                    ->where('training_id', $training->id)
                    ->where('trainings.user_id', auth()->user()->id)
                    ->count();

                $training['exercises'] = $exercisesCount;
            }

            return $trainings;
        } else if (isset(request()->query()['guest-code'])) {
            $trainings = Training::where('guest_code', request()->query()['guest-code'])->get();

            foreach ($trainings as $training) {
                $exercisesCount = Exercise::
                    join('trainings', 'exercises.training_id', '=', 'trainings.id')
                    ->where('training_id', $training->id)
                    ->where('trainings.guest_code', request()->query()['guest-code'])
                    ->count();

                $training['exercises'] = $exercisesCount;
            }

            return $trainings;
        }

        return [];
    }

    public function store(StoreTrainingRequest $request): Training
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

    public function show(Training $training): Training
    {
        $this->isAuthorized($training);

        return $training;
    }

    public function update(UpdateTrainingRequest $request, Training $training): Training
    {
        $this->isAuthorized($training);

        $training->name = $request->name;
        $training->save();

        return $training;
    }

    public function destroy(Training $training): array
    {
        $this->isAuthorized($training);

        // Check if workout exists, if it does, also delete that workouts.
        Workout::where('training_id', $training->id)->delete();

        $training->delete();

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
