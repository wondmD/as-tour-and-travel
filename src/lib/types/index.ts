/** Platform user roles (SRS §2.2). */
export type UserRole =
  | "traveler"
  | "admin"
  | "staff"
  | "support_agent"
  | "content_manager"
  | "partner";

export type BookingStatus =
  | "draft"
  | "pending"
  | "confirmed"
  | "completed"
  | "cancelled"
  | "refunded"
  | "failed";

export type PaymentStatus =
  | "pending"
  | "successful"
  | "failed"
  | "refunded"
  | "partially_refunded";

export type SupportTicketStatus =
  | "open"
  | "in_progress"
  | "waiting_customer"
  | "resolved"
  | "closed";

export type WishlistItemType = "tour" | "hotel" | "destination";

export interface User {
  id: string;
  email: string;
  phone: string;
  fullName: string;
  role: UserRole;
  avatarUrl?: string;
  emailVerified: boolean;
  createdAt: string;
  /** Partner org name when role is partner. */
  partnerName?: string;
}

export interface TravelerProfile {
  userId: string;
  nationality: string;
  preferredLanguage: "en" | "am" | "ar" | "fr" | "zh";
  dateOfBirth?: string;
  gender?: "female" | "male" | "other" | "prefer_not";
  emergencyContactName?: string;
  emergencyContactPhone?: string;
  passportNumber?: string;
  passportCountry?: string;
  passportExpiry?: string;
}

export interface SavedTraveler {
  id: string;
  userId: string;
  fullName: string;
  dateOfBirth: string;
  nationality: string;
  gender?: "female" | "male" | "other";
  relationship: string;
  passportNumber?: string;
}

export interface TourDeparture {
  id: string;
  tourId: string;
  date: string;
  capacity: number;
  seatsSold: number;
  priceUsd: number;
}

export interface TourProduct {
  id: string;
  slug: string;
  title: string;
  destination: string;
  durationDays: number;
  basePriceUsd: number;
  coverImage: string;
  status: "draft" | "published" | "archived";
  rating: number;
  reviewCount: number;
  category: string;
}

/** Operational budget for a tour over a defined period. */
export interface TourBudget {
  tourId: string;
  totalBudgetUsd: number;
  periodLabel: string;
  notes?: string;
  categories: TourBudgetCategory[];
}

export interface TourBudgetCategory {
  name: string;
  allocatedUsd: number;
}

export type TourExpenseCategory =
  | "accommodation"
  | "transport"
  | "guides"
  | "food"
  | "permits"
  | "marketing"
  | "equipment"
  | "insurance"
  | "other";

export interface TourExpense {
  id: string;
  tourId: string;
  departureId?: string;
  category: TourExpenseCategory;
  description: string;
  amountUsd: number;
  date: string;
  vendor?: string;
  status: "planned" | "paid" | "pending";
}

/** Booking-derived revenue line for a tour. */
export interface TourIncomeLine {
  id: string;
  bookingReference: string;
  departureDate: string;
  travelerCount: number;
  amountUsd: number;
  paymentStatus: PaymentStatus;
  bookingStatus: BookingStatus;
  createdAt: string;
}

export interface TourFinancialSummary {
  tourId: string;
  totalIncomeUsd: number;
  realizedIncomeUsd: number;
  projectedIncomeUsd: number;
  totalExpensesUsd: number;
  paidExpensesUsd: number;
  pendingExpensesUsd: number;
  budgetUsd: number;
  profitLossUsd: number;
  budgetRemainingUsd: number;
  profitMarginPercent: number;
  isProfit: boolean;
  isOverBudget: boolean;
  expensesByCategory: Record<TourExpenseCategory, number>;
  incomeByMonth: { month: string; amount: number }[];
}

export interface BookingTraveler {
  fullName: string;
  dateOfBirth?: string;
  nationality?: string;
}

export interface Booking {
  id: string;
  reference: string;
  userId: string;
  tourId: string;
  tourTitle: string;
  departureId: string;
  departureDate: string;
  travelers: BookingTraveler[];
  travelerCount: number;
  amountUsd: number;
  status: BookingStatus;
  paymentStatus: PaymentStatus;
  createdAt: string;
  specialRequests?: string;
  cancellationPolicy: string;
}

export interface Payment {
  id: string;
  bookingReference: string;
  userId: string;
  customerName: string;
  amountUsd: number;
  method: "chapa" | "stripe" | "telebirr" | "cbe_birr" | "manual";
  status: PaymentStatus;
  createdAt: string;
}

export interface WishlistItem {
  id: string;
  userId: string;
  type: WishlistItemType;
  itemId: string;
  title: string;
  subtitle: string;
  priceFromUsd?: number;
  imageUrl?: string;
  addedAt: string;
}

export interface TripPlan {
  id: string;
  userId: string;
  name: string;
  startDate?: string;
  endDate?: string;
  itemCount: number;
  status: "planning" | "active" | "completed";
}

export interface JournalEntry {
  id: string;
  userId: string;
  tripId?: string;
  title: string;
  body: string;
  location?: string;
  isPublic: boolean;
  createdAt: string;
  photoCount: number;
}

export interface AppNotification {
  id: string;
  userId: string;
  title: string;
  body: string;
  read: boolean;
  createdAt: string;
  category: "booking" | "payment" | "promo" | "reminder" | "system";
}

export interface NotificationPreferences {
  userId: string;
  emailBooking: boolean;
  emailPromo: boolean;
  smsReminder: boolean;
  pushEnabled: boolean;
}

export interface SupportTicket {
  id: string;
  reference: string;
  userId: string;
  customerName: string;
  subject: string;
  status: SupportTicketStatus;
  priority: "low" | "normal" | "high";
  assigneeId?: string;
  assigneeName?: string;
  createdAt: string;
  updatedAt: string;
  messageCount: number;
}

export interface SupportMessage {
  id: string;
  ticketId: string;
  authorName: string;
  authorRole: UserRole | "system";
  body: string;
  createdAt: string;
}

export interface Session {
  user: User;
  profile?: TravelerProfile;
}

export interface Destination {
  id: string;
  name: string;
  country: string;
  status: "published" | "draft";
  bestSeason: string;
  tourCount: number;
}

export interface Hotel {
  id: string;
  name: string;
  city: string;
  stars: number;
  partnerId?: string;
  partnerName?: string;
  status: "active" | "inactive" | "pending";
  roomTypes: number;
  avgRateUsd: number;
}

export interface HotelRoom {
  id: string;
  hotelId: string;
  name: string;
  rateUsd: number;
  available: number;
  total: number;
}

export interface TransportRoute {
  id: string;
  type: "flight" | "bus" | "private_car";
  origin: string;
  destination: string;
  operator: string;
  durationMinutes: number;
  priceFromUsd: number;
  status: "active" | "seasonal" | "inactive";
}

export interface AttractionTicket {
  id: string;
  name: string;
  location: string;
  category: "museum" | "park" | "event" | "monument";
  priceUsd: number;
  validDays: number;
  status: "active" | "sold_out" | "inactive";
}

export interface Promotion {
  id: string;
  code: string;
  title: string;
  discountPercent: number;
  validFrom: string;
  validUntil: string;
  uses: number;
  maxUses: number;
  status: "active" | "scheduled" | "expired";
}

export interface Review {
  id: string;
  tourId: string;
  tourTitle: string;
  authorName: string;
  rating: number;
  body: string;
  status: "pending" | "approved" | "rejected";
  createdAt: string;
}

export interface BlogPost {
  id: string;
  slug: string;
  title: string;
  author: string;
  status: "draft" | "published";
  publishedAt?: string;
  views: number;
}

export interface AppSettings {
  companyName: string;
  supportEmail: string;
  defaultCurrency: string;
  bookingHoldMinutes: number;
  cancellationGraceDays: number;
  enableStripe: boolean;
  enableChapa: boolean;
  enableTelebirr: boolean;
  maintenanceMode: boolean;
}
