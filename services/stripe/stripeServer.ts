import { env } from "@/data/env/serve";
import Stripe from "stripe";

export const stripeServerClient =  new Stripe(env.STRIPE_SECRET_KEY)