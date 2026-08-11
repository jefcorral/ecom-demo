"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { loadStripe } from "@stripe/stripe-js";
import { Elements, PaymentElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { useAuth } from "@/app/providers";
import { Button, buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { checkout } from "@/lib/checkout";
import { STRIPE_PUBLISHABLE_KEY } from "@/lib/env";
import { toast } from "sonner";

const stripePromise = loadStripe(STRIPE_PUBLISHABLE_KEY);

function CheckoutForm() {
  const stripe = useStripe();
  const elements = useElements();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!stripe || !elements) return;
    const { error, paymentIntent } = await stripe.confirmPayment({
      elements,
      confirmParams: { return_url: `${window.location.origin}/orders` },
      redirect: "if_required",
    });
    if (error) {
      toast.error(error.message ?? "Payment failed");
    } else if (paymentIntent?.status === "succeeded") {
      toast.success("Payment successful");
      router.push("/orders");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <PaymentElement />
      <Button type="submit" className="mt-4 w-full" disabled={!stripe}>
        Pay now
      </Button>
    </form>
  );
}

export default function CheckoutPage() {
  const { isLoggedIn, loading } = useAuth();
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [preparing, setPreparing] = useState(false);

  useEffect(() => {
    if (!isLoggedIn) return;
    setPreparing(true);
    checkout()
      .then((data) => setClientSecret(data.clientSecret))
      .catch((err) => {
        toast.error(err instanceof Error ? err.message : "Checkout failed");
      })
      .finally(() => setPreparing(false));
  }, [isLoggedIn]);

  if (loading) return null;

  if (!isLoggedIn) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-2xl font-bold">Please log in to checkout</h1>
        <Link href="/login" className={cn(buttonVariants(), "mt-4")}>
          Log in
        </Link>
      </div>
    );
  }

  if (preparing || !clientSecret) {
    return (
      <div className="container mx-auto max-w-xl px-4 py-8">
        <h1 className="mb-6 text-3xl font-bold">Checkout</h1>
        <p className="text-center text-muted-foreground">Preparing checkout...</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto max-w-xl px-4 py-8">
      <h1 className="mb-6 text-3xl font-bold">Checkout</h1>
      <Card>
        <CardHeader>
          <CardTitle>Payment details</CardTitle>
        </CardHeader>
        <CardContent>
          <Elements stripe={stripePromise} options={{ clientSecret }}>
            <CheckoutForm />
          </Elements>
        </CardContent>
      </Card>
    </div>
  );
}
