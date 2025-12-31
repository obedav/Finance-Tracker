<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Goal extends Model
{
    use HasFactory, SoftDeletes;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'user_id',
        'name',
        'description',
        'type',
        'target_amount',
        'current_amount',
        'target_date',
        'start_date',
        'status',
        'priority',
        'is_recurring',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'target_amount' => 'decimal:2',
            'current_amount' => 'decimal:2',
            'target_date' => 'date',
            'start_date' => 'date',
            'is_recurring' => 'boolean',
        ];
    }

    /**
     * The attributes that should have default values.
     *
     * @var array
     */
    protected $attributes = [
        'status' => 'active',
        'priority' => 'medium',
        'current_amount' => 0,
        'is_recurring' => false,
    ];

    /**
     * Get the user that owns the goal.
     */
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Get the contributions for the goal.
     */
    public function contributions()
    {
        return $this->hasMany(GoalContribution::class);
    }

    /**
     * Calculate the progress percentage for the goal.
     *
     * @return float
     */
    public function getProgressPercentageAttribute(): float
    {
        if ($this->target_amount <= 0) {
            return 0;
        }

        $percentage = ($this->current_amount / $this->target_amount) * 100;
        return min(round($percentage, 2), 100);
    }

    /**
     * Calculate the remaining amount to reach the goal.
     *
     * @return float
     */
    public function getRemainingAmountAttribute(): float
    {
        return max($this->target_amount - $this->current_amount, 0);
    }

    /**
     * Check if the goal is completed.
     *
     * @return bool
     */
    public function getIsCompletedAttribute(): bool
    {
        return $this->current_amount >= $this->target_amount;
    }

    /**
     * Scope a query to only include active goals.
     */
    public function scopeActive($query)
    {
        return $query->where('status', 'active');
    }

    /**
     * Scope a query to only include completed goals.
     */
    public function scopeCompleted($query)
    {
        return $query->where('status', 'completed');
    }

    /**
     * Scope a query to filter by type.
     */
    public function scopeOfType($query, $type)
    {
        return $query->where('type', $type);
    }

    /**
     * Scope a query to filter by priority.
     */
    public function scopeOfPriority($query, $priority)
    {
        return $query->where('priority', $priority);
    }

    /**
     * Scope a query to filter by status.
     */
    public function scopeOfStatus($query, $status)
    {
        return $query->where('status', $status);
    }
}
