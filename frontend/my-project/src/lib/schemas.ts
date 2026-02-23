import { z } from "zod";

export const businessSchema = z.object({
  businessName: z.string().min(2, "Business name is required"),
  locationName: z.string().min(2, "Location name is required"),
  address: z.string().min(5, "Address is required"),
  phone: z.string().min(10, "Valid phone number is required"),
  zipCode: z.string().min(5, "Zip code is required"),
  email: z.string().email("Invalid email address").optional().or(z.string().length(0)),
  website: z.string().url("Invalid URL").optional().or(z.string().length(0)),
  googleMapsUrl: z.string().url("Invalid URL").optional().or(z.string().length(0)),
  notableLandmarks: z.string().optional(),
  attendantType: z.enum(["attendant", "nonAttendant", "partial", ""]).refine(val => val !== "", "Attendant type is required"),
});

const daySchema = z.object({
  open: z.string(),
  close: z.string(),
  is247: z.boolean().optional(),
});

export const hoursSchema = z.object({
  hours: z.object({
    Monday: daySchema,
    Tuesday: daySchema,
    Wednesday: daySchema,
    Thursday: daySchema,
    Friday: daySchema,
    Saturday: daySchema,
    Sunday: daySchema,
  }),
  timeZone: z.string().min(1, "Time zone is required"),
  lastWashTime: z.string().min(1, "Last wash time is required"),
});

export const servicesSchema = z.object({
  services: z.array(z.string()).min(1, "Select at least one service"),
  paymentMethods: z.array(z.string()).min(1, "Select at least one payment method"),
});

export const equipmentSchema = z.object({
  totalWashers: z.string().min(1, "Total washers is required"),
  totalDryers: z.string().optional(),
  washers: z.array(z.object({
    size: z.string().min(1, "Size is required"),
    price: z.string().min(1, "Price is required"),
    quantity: z.number().min(1, "Quantity must be at least 1"),
    payments: z.array(z.object({
      system: z.string().min(1, "System is required"),
      notes: z.string().optional(),
    })),
  })).min(1, "Add at least one washer type"),
  dryers: z.array(z.object({
    size: z.string().min(1, "Size is required"),
    price: z.string().min(1, "Price is required"),
    quantity: z.number().min(1, "Quantity must be at least 1"),
    payments: z.array(z.object({
      system: z.string().min(1, "System is required"),
      notes: z.string().optional(),
    })),
  })).min(1, "Add at least one dryer type"),
  amenities: z.array(z.string()),
});

export const settingsSchema = z.object({
  callHandlingStyle: z.string().min(1, "Call handling style is required"),
  forwardingEnabled: z.boolean(),
  forwardingNumber: z.string().optional(),
  languages: z.array(z.string()).min(1, "Select at least one language"),
  businessTone: z.string().min(1, "Business tone is required"),
  businessIntro: z.string().min(1, "Business intro is required"),
});

export const policiesSchema = z.object({
  lostFoundPolicy: z.string().min(1, "Policy is required"),
  refundPolicy: z.string().min(1, "Policy is required"),
  petPolicies: z.string().min(1, "Policy is required"),
  timeLimits: z.string().min(1, "Policy is required"),
});

export const questionsSchema = z.object({
  customQuestions: z.array(z.object({
    question: z.string().min(1, "Question is required"),
    answer: z.string().min(1, "Answer is required"),
  })),
});
