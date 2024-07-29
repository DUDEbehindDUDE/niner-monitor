export type TimeData = {
  status: "success";
  request_time: number;
  records: number;
  the_locations: TimeLocationData[];
};

export type TimeLocationData = {
  id: string;
  active: boolean;
  has_delivery_robots: boolean;
  has_food_lockers: boolean;
  is_delivery: boolean;
  is_delivery_only: boolean;
  is_dine_in: boolean;
  is_mobile: boolean;
  is_mobile_only: boolean;
  is_open_late: boolean;
  is_takeout: boolean;
  is_takeout_only: boolean;
  occupancy: "na" | string;
  pay_with_apple_pay: boolean;
  pay_with_cash: boolean;
  pay_with_cc: boolean;
  pay_with_dining_dollars: boolean;
  pay_with_google_pay: boolean;
  pay_with_meal_exchange: boolean;
  pay_with_meal_trade: boolean;
  pay_with_meal_swipe: boolean;
  pay_with_retail_swipe: boolean;
  pay_with_samsung_pay: boolean;
  pay_with_meal_plan: boolean;
  custom_payment_types: string[];
  name: string;
  sort_order: number;
  is_building: boolean;
  building_id: string;
  week: TimeLocationWeekDay[];
};

export type TimeLocationWeekDay = {
  day: number;
  date: string;
  status: "open" | "closed";
  hours: TimeLocationWeekDayHours[];
  has_special_hours: boolean;
  closed: boolean;
};

export type TimeLocationWeekDayHours = {
  start_hour: number;
  start_minutes: number;
  end_hour: number;
  end_minutes: number;
};
