<?php

namespace App\Http\DTO;

interface ResponseDTOInterface
{
    public function toJson(): array;
}
