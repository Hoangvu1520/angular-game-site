<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;

class AuthController extends Controller
{
    public function register(Request $request)
    {
        $validated = $request->validate(["user_name" => "required|string|max:255", "email" => "required|string|email|unique:users,email"]);
        $user = User::create(["user_name" => $validated["name"], "email" => $validated["email"], "password" => Hash::make($validated["password"])]);

        //generate JWT
        $token = $user->createToken("auth_token")->plainTextToke;

        return response()->json(["success" => true, "user" => $user, "token" => $token]);
    }
}
