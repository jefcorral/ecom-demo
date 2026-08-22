import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { FileQuestion } from "lucide-react";

export default function NotFound() {
  return (
    <div className="container mx-auto flex min-h-[60vh] items-center justify-center px-4 py-16">
      <Card className="w-full max-w-md border-muted shadow-lg">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-muted text-muted-foreground">
            <FileQuestion className="h-6 w-6" />
          </div>
          <CardTitle className="text-2xl font-bold tracking-tight">Page Not Found</CardTitle>
          <CardDescription className="mt-2 text-sm text-muted-foreground">
            {"Sorry, we couldn't find the page you are looking for. It might have been moved, deleted, or never existed."}
          </CardDescription>
        </CardHeader>
        <CardFooter className="flex justify-center gap-4">
          <Link href="/">
            <Button variant="default">Back to Homepage</Button>
          </Link>
          <Link href="/products">
            <Button variant="outline">Browse Products</Button>
          </Link>
        </CardFooter>
      </Card>
    </div>
  );
}
