"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { loadStripe } from "@stripe/stripe-js";
import { Elements, PaymentElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { useAuth } from "@/app/providers";
import { Button, buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { checkout } from "@/lib/checkout";
import { STRIPE_PUBLISHABLE_KEY } from "@/lib/env";
import { Address, CheckoutResponse } from "@/types";
import { toast } from "sonner";

const stripePromise = loadStripe(STRIPE_PUBLISHABLE_KEY);

const emptyAddress: Address = {
  line1: "",
  line2: "",
  city: "",
  state: "",
  postalCode: "",
  country: "",
};

function AddressFields({
  value,
  onChange,
  idPrefix,
}: {
  value: Address;
  onChange: (address: Address) => void;
  idPrefix: string;
}) {
  const update = (field: keyof Address, fieldValue: string) => {
    onChange({ ...value, [field]: fieldValue });
  };

  return (
    <div className="grid gap-3">
      <div>
        <Label htmlFor={`${idPrefix}-line1`}>Address line 1</Label>
        <Input
          id={`${idPrefix}-line1`}
          value={value.line1}
          onChange={(e) => update("line1", e.target.value)}
          required
        />
      </div>
      <div>
        <Label htmlFor={`${idPrefix}-line2`}>Address line 2 (optional)</Label>
        <Input
          id={`${idPrefix}-line2`}
          value={value.line2 ?? ""}
          onChange={(e) => update("line2", e.target.value)}
        />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <Label htmlFor={`${idPrefix}-city`}>City</Label>
          <Input
            id={`${idPrefix}-city`}
            value={value.city}
            onChange={(e) => update("city", e.target.value)}
            required
          />
        </div>
        <div>
          <Label htmlFor={`${idPrefix}-state`}>State / Province</Label>
          <Input
            id={`${idPrefix}-state`}
            value={value.state}
            onChange={(e) => update("state", e.target.value)}
            required
          />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <Label htmlFor={`${idPrefix}-postalCode`}>Postal code</Label>
          <Input
            id={`${idPrefix}-postalCode`}
            value={value.postalCode}
            onChange={(e) => update("postalCode", e.target.value)}
            required
          />
        </div>
        <div>
          <Label htmlFor={`${idPrefix}-country`}>Country</Label>
          <Input
            id={`${idPrefix}-country`}
            value={value.country}
            onChange={(e) => update("country", e.target.value)}
            required
          />
        </div>
      </div>
    </div>
  );
}

function StripePaymentForm() {
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

function ManualPaymentConfirmation({ order }: { order: CheckoutResponse }) {
  const router = useRouter();

  return (
    <div className="space-y-4">
      <p className="text-sm text-muted-foreground">
        Your order has been placed. We accept manual payment methods (cash on
        delivery, bank transfer, etc.) — our team will reach out to confirm
        payment details.
      </p>
      <p className="text-sm font-medium">
        Order total: ${Number(order.total).toFixed(2)}
      </p>
      <Button className="w-full" onClick={() => router.push(`/orders/${order.orderId}`)}>
        View order
      </Button>
    </div>
  );
}

export default function CheckoutPage() {
  const { isLoggedIn, loading } = useAuth();
  const [shippingAddress, setShippingAddress] = useState<Address>(emptyAddress);
  const [billingAddress, setBillingAddress] = useState<Address>(emptyAddress);
  const [sameAsShipping, setSameAsShipping] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [order, setOrder] = useState<CheckoutResponse | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const result = await checkout({
        shippingAddress,
        billingAddress: sameAsShipping ? shippingAddress : billingAddress,
      });
      setOrder(result);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Checkout failed");
    } finally {
      setSubmitting(false);
    }
  };

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

  if (order) {
    return (
      <div className="container mx-auto max-w-xl px-4 py-8">
        <h1 className="mb-6 text-3xl font-bold">Checkout</h1>
        <Card>
          <CardHeader>
            <CardTitle>Payment</CardTitle>
          </CardHeader>
          <CardContent>
            {order.clientSecret ? (
              <Elements stripe={stripePromise} options={{ clientSecret: order.clientSecret }}>
                <StripePaymentForm />
              </Elements>
            ) : (
              <ManualPaymentConfirmation order={order} />
            )}
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto max-w-xl px-4 py-8">
      <h1 className="mb-6 text-3xl font-bold">Checkout</h1>
      <form onSubmit={handleSubmit} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Shipping address</CardTitle>
          </CardHeader>
          <CardContent>
            <AddressFields value={shippingAddress} onChange={setShippingAddress} idPrefix="shipping" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Billing address</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={sameAsShipping}
                onChange={(e) => setSameAsShipping(e.target.checked)}
              />
              Same as shipping address
            </label>
            {!sameAsShipping && (
              <AddressFields value={billingAddress} onChange={setBillingAddress} idPrefix="billing" />
            )}
          </CardContent>
        </Card>

        <Button type="submit" className="w-full" disabled={submitting}>
          {submitting ? "Placing order..." : "Place order"}
        </Button>
      </form>
    </div>
  );
}
