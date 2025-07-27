"use client";

import {
  EmbeddedCheckout,
  EmbeddedCheckoutProvider,
} from "@stripe/react-stripe-js";
import { getClientSessionSecret } from "../actions/stripe";
import { stripeClientPromise } from "../stripeClient";

export function StripeCheckoutForm({
  product,
  user,
}: {
  product: {
    id: string;
    name: string;
    description: string;
    priceInDollars: number;
    imageUrl: string;
  };
  user: {
    id: string;
    email: string;
  };
}) {
  return (
    <EmbeddedCheckoutProvider
      stripe={stripeClientPromise}
      options={{
        fetchClientSecret: getClientSessionSecret.bind(null, { product, user }),
      }}
    >
      <EmbeddedCheckout></EmbeddedCheckout>
    </EmbeddedCheckoutProvider>
  );
}
