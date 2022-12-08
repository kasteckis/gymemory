<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

class UserController extends Controller
{
    public function register(Request $request): JsonResponse
    {
        $content = request(['email', 'password', 'name']);

        User::create([
            'name' => $content['name'],
            'email' => $content['email'],
            'password' => Hash::make($content['password']),
            'register_ip' => $request->ip(),
            'last_login_ip' => 'never logged in',
        ]);

        $credentials = request(['email', 'password']);

        $token = auth()->attempt($credentials);

        auth()->factory()->setTTL(10080);

        return response()->json([
            'access_token' => $token,
            'token_type' => 'bearer',
            'expires_in' => auth()->factory()->getTTL() * 60
        ]);
    }
}
