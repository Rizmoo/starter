<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use App\Support\PermissionCatalog;
use App\Traits\HasRoles;
use Database\Factories\UserFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Attributes\Hidden;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\MorphMany;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Fortify\TwoFactorAuthenticatable;
use Laravel\Sanctum\HasApiTokens;

#[Fillable(['name', 'email', 'role_id', 'permissions', 'phone_number', 'phone_verified_at', 'password', 'force_password_change', 'status', 'suspended_at', 'suspended_reason', 'last_login_at', 'social_id', 'social_provider', 'social_avatar', 'profile_picture_path'])]
#[Hidden(['password', 'remember_token', 'two_factor_recovery_codes', 'two_factor_secret'])]
class User extends Authenticatable
{
    /** @use HasFactory<UserFactory> */
    use HasApiTokens, HasFactory, HasRoles, Notifiable, TwoFactorAuthenticatable;

    /**
     * @var list<string>
     */
    protected $with = ['role'];

    /**
     * @var list<string>
     */
    protected $appends = ['profile_picture_url', 'roles', 'is_admin', 'all_permissions'];

    /**
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'phone_verified_at' => 'datetime',
            'password' => 'hashed',
            'permissions' => 'array',
            'two_factor_confirmed_at' => 'datetime',
            'force_password_change' => 'boolean',
            'suspended_at' => 'datetime',
            'last_login_at' => 'datetime',
        ];
    }

    /**
     * Get the role that the user belongs to.
     */
    public function role(): BelongsTo
    {
        return $this->belongsTo(Role::class);
    }

    /**
     * Normalize permissions from an array or JSON string.
     *
     * @return list<string>
     */
    public static function normalizePermissions(mixed $permissions): array
    {
        return PermissionCatalog::normalize($permissions);
    }

    public function hasWildcardPermission(): bool
    {
        if (in_array('*', self::normalizePermissions($this->permissions), true)) {
            return true;
        }

        return $this->role !== null
            && in_array('*', self::normalizePermissions($this->role->permissions), true);
    }

    public function getIsAdminAttribute(): bool
    {
        return $this->isAdmin();
    }

    public function isAdmin(): bool
    {
        if ($this->hasWildcardPermission()) {
            return true;
        }

        if (! $this->role) {
            return false;
        }

        return in_array(strtolower((string) $this->role->name), ['admin', 'administrator'], true);
    }

    /**
     * Merged role + user permission list.
     *
     * @return list<string>
     */
    public function getAllPermissions(): array
    {
        $rolePermissions = self::normalizePermissions($this->role?->permissions ?? []);
        $userPermissions = self::normalizePermissions($this->permissions ?? []);

        return array_values(array_unique(array_merge($rolePermissions, $userPermissions)));
    }

    /**
     * @return list<string>
     */
    public function getAllPermissionsAttribute(): array
    {
        return $this->getAllPermissions();
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
