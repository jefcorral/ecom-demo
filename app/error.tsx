"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertCircle } from "lucide-react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const router = useRouter();

  useEffect(() => {
    console.error("Global error boundary caught error:", error);
  }, [error]);

  return (
    <div className="container mx-auto flex min-h-[60vh] items-center justify-center px-4 py-16">
      <Card className="w-full max-w-md border-destructive/20 shadow-lg">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-destructive/10 text-destructive">
            <AlertCircle className="h-6 w-6" />
          </div>
          <CardTitle className="text-2xl font-bold tracking-tight">Something went wrong!</CardTitle>
          <CardDescription className="mt-2 text-sm text-muted-foreground">
            An unexpected error occurred while processing your request.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="rounded-md bg-muted p-4">
            <p className="font-mono text-xs text-destructive break-all">
              {error.message || "An unknown error occurred"}
            </p>
            {error.digest && (
              <p className="mt-2 font-mono text-[10px] text-muted-foreground">
                Digest: {error.digest}
              </p>
            )}
          </div>
        </CardContent>
        <CardFooter className="flex flex-col gap-2 sm:flex-row sm:justify-between">
          <Button
            variant="outline"
            className="w-full sm:w-auto"
            onClick={() => {
              router.push("/");
            }}
          >
            Go back home
          </Button>
          <Button
            className="w-full sm:w-auto"
            onClick={() => reset()}
          >
            Try again
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
