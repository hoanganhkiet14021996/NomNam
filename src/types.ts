export type MealType = 'breakfast' | 'lunch' | 'dinner' | 'snack'

/** Dinh dưỡng tổng (cho 1 log) hoặc trên 100g (cho 1 món trong DB). */
export interface Nutrients {
  kcal: number
  protein: number
  carbs: number
  fat: number
  fiber: number
}

export interface Serving {
  label: string
  grams: number
}

export type FoodCategory =
  | 'carb'
  | 'protein'
  | 'veg'
  | 'fruit'
  | 'dish'
  | 'dairy'
  | 'snack'
  | 'drink'
  | 'supplement'

export interface Food {
  id: string
  name: string
  emoji: string
  category: FoodCategory
  per100: Nutrients
  servings: Serving[]
  /** Khẩu phần mặc định (gram) khi mới chọn món. */
  defaultGrams: number
  /** Từ khoá tìm kiếm thêm (không dấu cũng được). */
  aliases?: string[]
  custom?: boolean
  updatedAt?: string
  deletedAt?: string | null
}

export type LogSource = 'db' | 'custom' | 'quick' | 'ai' | 'meal'

/** Một dòng nhật ký ăn. Lưu snapshot dinh dưỡng để sửa DB món không làm sai lịch sử. */
export interface FoodLog extends Nutrients {
  id: string
  date: string // YYYY-MM-DD theo giờ địa phương
  meal: MealType
  name: string
  emoji: string
  foodId: string | null
  /** 0 = không theo gram (quick add) */
  grams: number
  servingLabel: string | null
  source: LogSource
  createdAt: string
  updatedAt: string
  deletedAt: string | null
}

export type Intensity = 'light' | 'moderate' | 'vigorous'

export interface ActivityLog {
  id: string
  date: string
  activityId: string
  name: string
  emoji: string
  minutes: number
  intensity: Intensity
  met: number
  kcal: number
  /** true nếu người dùng tự nhập kcal (vd từ đồng hồ) */
  manual: boolean
  createdAt: string
  updatedAt: string
  deletedAt: string | null
}

export interface WeightLog {
  id: string
  date: string
  kg: number
  updatedAt: string
  deletedAt: string | null
}

export interface SavedMealItem extends Nutrients {
  name: string
  emoji: string
  foodId: string | null
  grams: number
  servingLabel: string | null
}

export interface SavedMeal {
  id: string
  name: string
  items: SavedMealItem[]
  updatedAt: string
  deletedAt: string | null
}

export type Sex = 'male' | 'female'
export type Goal = 'cut' | 'maintain' | 'bulk'

export interface Targets {
  kcal: number
  protein: number
  carbs: number
  fat: number
  fiber: number
}

export interface Profile {
  sex: Sex
  age: number
  heightCm: number
  weightKg: number
  /** Hệ số vận động hằng ngày KHÔNG gồm buổi tập (tránh tính 2 lần với tab Vận động). */
  neat: number
  goal: Goal
  proteinPerKg: number
  /** Mục tiêu người dùng tự đặt, ghi đè số tự tính. */
  overrides: Partial<Targets>
  /** % calo tập được cộng lại vào quỹ ngày (0–100). */
  exerciseEatBackPct: number
  updatedAt: string
}

export type ThemePref = 'system' | 'light' | 'dark'
/** Bảng màu (độc lập với sáng/tối). */
export type Palette = 'nomnam' | 'pink'

export interface Settings {
  theme: ThemePref
  palette: Palette
  geminiKey: string
  geminiModel: string
}

/** Vai trò của một thành phần trong bữa (AI nhận diện từ ảnh). */
export type FoodRole = 'carb' | 'protein' | 'veg' | 'fat' | 'sauce' | 'drink' | 'other'
export type CookingMethod = 'raw' | 'boiled' | 'steamed' | 'grilled' | 'fried' | 'stir_fried' | 'braised' | 'soup' | 'other'

/**
 * Món AI nhận ra nhưng chưa có trong bảng món → chờ research (agent food-researcher) rồi thêm vào DB.
 * Sync qua bảng Supabase `food_requests`.
 */
export interface FoodRequest {
  id: string
  name: string
  /** tên không dấu, dùng để gộp các lần gặp cùng món */
  nameKey: string
  emoji: string
  role: FoodRole
  /** loại cụ thể AI mô tả, vd "thịt heo ba chỉ" */
  kind: string
  cooking: CookingMethod
  /** ước lượng của AI (trên 100g) — chỉ để tham khảo khi research */
  per100: Nutrients
  /** gram lần gần nhất */
  grams: number
  timesSeen: number
  status: 'pending' | 'done' | 'dismissed'
  /** id món trong bảng sau khi đã bổ sung */
  foodId: string | null
  createdAt: string
  updatedAt: string
  deletedAt: string | null
}
