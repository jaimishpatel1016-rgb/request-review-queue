import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function Page() {
  return (
    <div className="flex min-h-svh flex-col items-center justify-center gap-6 p-6">
      <Button variant="outline" className="mb-4">
        <Link href="/requests">
          Go to Requests
        </Link>
      </Button>
    </div>
  )
}
