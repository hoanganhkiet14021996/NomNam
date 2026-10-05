/**
 * Calo tập (net) = (MET − 1) × cân nặng (kg) × giờ.
 * Trừ 1 MET vì phần nghỉ ngơi đã nằm trong BMR/TDEE nền → tránh tính 2 lần, chặt hơn.
 */
export function activityKcal(met: number, weightKg: number, minutes: number): number {
  if (met <= 1 || weightKg <= 0 || minutes <= 0) return 0
  return Math.round((met - 1) * weightKg * (minutes / 60))
}
