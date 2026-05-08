<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Database\Factories\UserFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Attributes\Hidden;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\MorphMany;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Fortify\TwoFactorAuthenticatable;
use Laravel\Sanctum\HasApiTokens;
use Spatie\Permission\Traits\HasRoles;

#[Fillable(['company_id', 'preferred_branch_id', 'name', 'email', 'phone_number', 'phone_verified_at', 'password', 'force_password_change', 'status', 'suspended_at', 'suspended_reason', 'last_login_at', 'social_id', 'social_provider', 'social_avatar', 'profile_picture_path'])]
#[Hidden(['password', 'remember_token', 'two_factor_recovery_codes', 'two_factor_secret'])]
class User extends Authenticatable
{
    /** @use HasFactory<UserFactory> */
    use HasApiTokens, HasFactory, HasRoles, Notifiable, TwoFactorAuthenticatable;

    protected $appends = ['profile_picture_url'];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'company_id' => 'integer',
            'preferred_branch_id' => 'integer',
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

    public function company(): BelongsTo
    {
        return $this->belongsTo(Company::class);
    }

    public function preferredBranch(): BelongsTo
    {
        return $this->belongsTo(Branch::class, 'preferred_branch_id');
    }

    public function branches(): BelongsToMany
    {
        return $this->belongsToMany(Branch::class)
            ->withPivot('is_primary')
            ->withTimestamps();
    }

    /**
     * @return array<int, int>
     */
    public function availableBranchIds(): array
    {
        return $this->branches()
            ->pluck('branches.id')
            ->all();
    }

    public function defaultBranchId(): ?int
    {
        $primaryBranchId = $this->branches()
            ->wherePivot('is_primary', true)
            ->value('branches.id');

        if ($primaryBranchId !== null) {
            return (int) $primaryBranchId;
        }

        if ($this->preferred_branch_id !== null) {
            return (int) $this->preferred_branch_id;
        }

        $firstBranchId = $this->branches()
            ->orderBy('branches.name')
            ->value('branches.id');

        return $firstBranchId === null ? null : (int) $firstBranchId;
    }

    /**
     * @param  array<int, array{is_primary: bool}>  $branches
     */
    public function syncBranches(array $branches): void
    {
        $this->branches()->sync($branches);
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
