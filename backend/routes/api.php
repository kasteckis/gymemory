<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\TrainingController;
use App\Http\Controllers\UserController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/

Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});

Route::middleware('auth')->get('test', function () {
    return 'test back + ' . auth()->user()->id;
});

Route::post('register', [UserController::class, 'register']);

Route::get('trainings', [TrainingController::class, 'index']);
Route::post('training', [TrainingController::class, 'store']);
Route::get('training/{training}', [TrainingController::class, 'show']);
Route::put('training/{training}', [TrainingController::class, 'update']);
Route::delete('training/{training}', [TrainingController::class, 'destroy']);

Route::group([
    'middleware' => 'api',
    'prefix' => 'auth'
], function ($router) {
    Route::post('login', [AuthController::class, 'login']);
    Route::post('logout', [AuthController::class, 'logout']);
    Route::post('refresh', [AuthController::class, 'refresh']);
    Route::post('me', [AuthController::class, 'me']);
});
