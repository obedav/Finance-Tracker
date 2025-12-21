<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Budget extends Model
{
    use HasFactory, SoftDeletes;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'user_id',
        'category_id',
        'name',
        'amount',
        'period',
        'start_date',
        'end_date',
        'alert_threshold',
        'is_active',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'amount' => 'decimal:2',
            'start_date' => 'date',
            'end_date' => 'date',
            'is_active' => 'boolean',
        ];
    }

    /**
     * Get the user that owns the budget.
     */
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Get the category that the budget belongs to.
     */
    public function category()
    {
        return $this->belongsTo(Category::class);
    }

    /**
     * Scope a query to only include active budgets.
     */
    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }

    /**
     * Scope a query to filter by period.
     */
    public function scopePeriod($query, $period)
    {
        return $query->where('period', $period);
    }

    /**
     * Calculate budget progress.
     */
    public function calculateProgress()
    {
        $spent = $this->user
            ->transactions()
            ->where('type', 'EXPENSE')
            ->where('status', 'completed')
            ->whereBetween('date', [$this->start_date, $this->end_date ?? now()])
            ->when($this->category_id, function ($query) {
                return $query->where('category_id', $this->category_id);
            })
            ->sum('amount');

        $percentage = ($spent / $this->amount) * 100;

        return [
            'spent' => $spent,
            'remaining' => max(0, $this->amount - $spent),
            'percentage' => min(100, round($percentage, 2)),
            'is_exceeded' => $spent > $this->amount,
            'alert_triggered' => $percentage >= $this->alert_threshold,
        ];
    }
}
