import { configDotenv } from "dotenv";
configDotenv();

export const envList = {
  PORT: process.env.PORT,
  ROOT: process.env.ROOT,
  SECURE: process.env.SECURE,
  BACKEND_HOST: process.env.BACKEND_HOST,
  FRONTEND_HOST: process.env.FRONTEND_HOST,
  ACCESS_TOKEN_KEY: process.env.ACCESS_TOKEN_KEY,
  REFRESH_TOKEN_KEY: process.env.REFRESH_TOKEN_KEY,
  DB_STRING: process.env.DB_STRING,
  STRIPE_SECRET_KEY: process.env.STRIPE_SECRET_KEY,
  STRIPE_PUBLISHABLE_KEY: process.env.STRIPE_PUBLISHABLE_KEY,
  STRIPE_WEBHOOK_SECRET: process.env.STRIPE_WEBHOOK_SECRET,
  IMPACT_LINKS_PRICE_ID: process.env.IMPACT_LINKS_PRICE_ID,
};
