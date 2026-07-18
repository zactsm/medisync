<?php
namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\{Hash, Http, Log};
use Illuminate\Support\Str;
use Inertia\Inertia;

class AuthController extends Controller
{
    public function show()
    {
        $patients = User::where('role', 'patient')->select('id', 'name', 'email')->get();
        $caregivers = User::where('role', 'caregiver')->select('id', 'name', 'email')->get();
        return Inertia::render('Auth', [
            'patients' => $patients,
            'caregivers' => $caregivers,
        ]);
    }

    public function sync(Request $request)
    {
        $token = $request->bearerToken() ?: $request->input('access_token');
        abort_unless($token, 401, 'Missing Supabase access token');
        $response = Http::withToken($token)->withHeaders(['apikey' => config('services.supabase.anon_key')])->get(rtrim(config('services.supabase.url'), '/').'/auth/v1/user');
        abort_unless($response->successful(), 401, 'Invalid Supabase session');
        $remote = $response->json();
        $email = $remote['email'] ?? null;
        abort_unless($email, 422, 'An email address is required');
        $user = User::firstOrCreate(['email' => $email], [
            'name' => $remote['user_metadata']['full_name'] ?? $remote['user_metadata']['name'] ?? 'MediSync User',
            'phone' => $remote['phone'] ?? null,
            'password' => Hash::make(Str::random(48)),
            'role' => 'patient',
            'ice_code' => 'ICE-'.strtoupper(Str::random(8)),
            'caregiver_sync_code' => 'MS-'.strtoupper(Str::random(8))
        ]);
        auth()->login($user); $request->session()->regenerate();
        return response()->json(['user' => $user]);
    }

    public function logout(Request $request) { auth()->logout(); $request->session()->invalidate(); $request->session()->regenerateToken(); return response()->json(['ok' => true]); }
}
