export function SiteFooter() {
  return (
    <footer className="border-t bg-background py-6">
      <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
        &copy; {new Date().getFullYear()} Ecom Store. Built with Next.js.
      </div>
    </footer>
  );
}
