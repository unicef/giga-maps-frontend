import { Button } from '~/ui/components/shadcn/button'

export default function PageNotFound() {
  return (
    <div style={{ width: '100%', height: '100%', color: '#000', justifyContent: 'center', alignItems: 'center', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <h1>404</h1>
      <p>Page Not Found</p>
      {/* Test shadcn Button integration */}
      <Button variant="default" asChild>
        <a href="/map">Go to home</a>
      </Button>
      <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1rem' }}>
        <Button variant="secondary">Secondary</Button>
        <Button variant="outline">Outline</Button>
        <Button variant="ghost">Ghost</Button>
        <Button variant="destructive">Destructive</Button>
      </div>
    </div>)
}