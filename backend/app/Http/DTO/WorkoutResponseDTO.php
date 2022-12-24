<?php

namespace App\Http\DTO;

use App\Models\Workout;

class WorkoutResponseDTO implements ResponseDTOInterface
{
    public function __construct(private Workout $workout)
    {
    }

    public function toJson(): array
    {
        return [
            'id' => $this->workout->id,
            'training_id' => $this->workout->training_id,
            'user_id' => $this->workout->user_id,
            'guest_code' => $this->workout->guest_code,
            'owner_is_guest' => $this->workout->owner_is_guest,
            'start_date_time' => $this->workout->start_date_time ? (new \DateTime($this->workout->start_date_time))->format('Y-m-d H:i:s T') : null,
            'end_date_time' => $this->workout->end_date_time ? (new \DateTime($this->workout->end_date_time))->format('Y-m-d H:i:s T') : null,
            'locker_number' => $this->workout->locker_number,
        ];
    }
}
