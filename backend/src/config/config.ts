import "dotenv/config";

// import all env files
export default {
  PORT: process.env.PORT!,
  NODE_ENV: process.env.NODE_ENV,
  MONGO_URI: process.env.MONGO_URI!,
  FRONTEND_URL: process.env.FRONTEND_URL!,
  MASTER_URL: process.env.MASTER_URL!,
  JWT_ACCESS_SECRET: process.env.JWT_ACCESS_SECRET!,
  JWT_REFRESH_SECRET: process.env.JWT_REFRESH_SECRET!,
  JWT_ADMIN_ACCESS_SECRET: process.env.JWT_ADMIN_ACCESS_SECRET!,
  JWT_ADMIN_REFRESH_SECRET: process.env.JWT_ADMIN_REFRESH_SECRET!,
  
  // Google Maps API
  GOOGLE_MAPS_API_KEY: process.env.GOOGLE_MAPS_API_KEY!,
  
  // Stripe
  STRIPE_SECRET_KEY: process.env.STRIPE_SECRET_KEY!,
  STRIPE_PUBLISHABLE_KEY: process.env.STRIPE_PUBLISHABLE_KEY!,
  STRIPE_WEBHOOK_SECRET: process.env.STRIPE_WEBHOOK_SECRET!,
  
  // PayPal
  PAYPAL_CLIENT_ID: process.env.PAYPAL_CLIENT_ID!,
  PAYPAL_CLIENT_SECRET: process.env.PAYPAL_CLIENT_SECRET!,
  
  // Email
  SMTP_HOST: process.env.SMTP_HOST!,
  SMTP_PORT: process.env.SMTP_PORT!,
  SMTP_USER: process.env.SMTP_USER!,
  SMTP_PASS: process.env.SMTP_PASS!,
  SMTP_SECURE: process.env.SMTP_SECURE || "false",
  EMAIL_FROM: process.env.EMAIL_FROM!,
  
  // AWS
  AWS_REGION: process.env.AWS_REGION!,
  AWS_ACCESS_KEY_ID: process.env.AWS_ACCESS_KEY_ID!,
  AWS_SECRET_ACCESS_KEY: process.env.AWS_SECRET_ACCESS_KEY!,
  AWS_S3_BUCKET_NAME: process.env.AWS_S3_BUCKET_NAME!,
  
  // Redis (optional in production; use in-memory fallback if unset)
  REDIS_URL: process.env.REDIS_URL,
  
  // Cloudinary
  CLOUDINARY_CLOUD_NAME: process.env.CLOUDINARY_CLOUD_NAME!,
  CLOUDINARY_API_KEY: process.env.CLOUDINARY_API_KEY!,
  CLOUDINARY_API_SECRET: process.env.CLOUDINARY_API_SECRET!,
};
