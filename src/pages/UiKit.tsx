import { Badge, Button, Card, Input, StarRating } from '../components'

// Developer page to preview the shared components: open /ui-kit
export default function UiKit() {
  return (
    <div className="mx-auto max-w-4xl space-y-10 px-6 py-12">
      <header>
        <h1 className="text-3xl">FixLink UI kit</h1>
        <p className="mt-2">Reusable components from Issue #3.</p>
      </header>

      <section className="space-y-3">
        <h2 className="text-xl">Buttons</h2>
        <div className="flex flex-wrap items-center gap-3">
          <Button>Book Now</Button>
          <Button variant="gradient">Ask the AI Assistant</Button>
          <Button variant="outline">Request a Quote</Button>
          <Button size="sm">Small</Button>
          <Button size="lg">Large</Button>
          <Button disabled>Disabled</Button>
        </div>
      </section>

      <section className="space-y-3">
        <h2 className="text-xl">Badges</h2>
        <div className="flex flex-wrap gap-2">
          <Badge variant="verified">Verified</Badge>
          <Badge variant="pending">Pending</Badge>
          <Badge variant="accepted">Accepted</Badge>
          <Badge variant="completed">Completed</Badge>
          <Badge variant="cancelled">Cancelled</Badge>
          <Badge variant="ai">AI recommended</Badge>
          <Badge>Plumbing</Badge>
        </div>
      </section>

      <section className="space-y-3">
        <h2 className="text-xl">Star rating</h2>
        <div className="flex flex-col gap-2">
          <StarRating rating={4.8} reviewCount={126} />
          <StarRating rating={3.2} size="md" />
        </div>
      </section>

      <section className="space-y-3">
        <h2 className="text-xl">Inputs</h2>
        <div className="grid gap-4 md:grid-cols-2">
          <Input label="Full name" placeholder="Thabo Mokoena" />
          <Input label="Phone number" placeholder="+27 82 123 4567" hint="We'll only use this for bookings." />
          <Input label="Email" type="email" defaultValue="thabo@" error="Enter a valid email address." />
        </div>
      </section>

      <section className="space-y-3">
        <h2 className="text-xl">Card</h2>
        <Card className="max-w-sm space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-lg">Sipho's Plumbing</h3>
            <Badge variant="verified">Verified</Badge>
          </div>
          <StarRating rating={4.9} reviewCount={87} />
          <p className="text-sm">Soweto, Johannesburg · From R350</p>
          <Button fullWidth>View Profile</Button>
        </Card>
      </section>
    </div>
  )
}
