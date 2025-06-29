import { Button } from '@/components/ui/button'
import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen text-center p-4">
      <h1 className="text-6xl font-bold text-primary">404</h1>
      <p className="text-2xl font-semibold mt-4">Page Not Found</p>
      <p className="mt-2 text-muted-foreground">Sorry, we couldn't find the page you were looking for.</p>
      <Button asChild className="mt-6">
        <Link href="/">Return to Homepage</Link>
      </Button>
    </div>
  )
}
