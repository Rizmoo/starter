<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use App\Traits\HasFileBasedRoles;
use Database\Factories\UserFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Attributes\Hidden;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\MorphMany;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Fortify\TwoFactorAuthenticatable;
use Laravel\Sanctum\HasApiTokens;

#[Fillable(['name', 'email', 'role', 'phone_number', 'phone_verified_at', 'password', 'force_password_change', 'status', 'suspended_at', 'suspended_reason', 'last_login_at', 'social_id', 'social_provider', 'social_avatar', 'profile_picture_path'])]
#[Hidden(['password', 'remember_token', 'two_factor_recovery_codes', 'two_factor_secret'])]
class User extends Authenticatable
{
    /** @use HasFactory<UserFactory> */
    use HasApiTokens, HasFactory, HasFileBasedRoles, Notifiable, TwoFactorAuthenticatable;

    protected $appends = ['profile_picture_url'];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'phone_verified_at' => 'datetime',
            'password' => 'hashed',
            'two_factor_confirmed_at' => 'datetime',
            'force_password_change' => 'boolean',
            'suspended_at' => 'datetime',
            'last_login_at' => 'datetime',
        ];
    }

    public function getProfilePictureUrlAttribute(): ?string
    {
        return $this->profile_picture_path
            ? asset('storage/'.$this->profile_picture_path)
            : $this->social_avatar;
    }

    public function activities(): HasMany
    {
        return $this->hasMany(AuditLog::class, 'actor_id');
    }

    public function auditLogs(): MorphMany
    {
        return $this->morphMany(AuditLog::class, 'auditable');
    }
}
