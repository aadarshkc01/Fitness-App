import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

export default function Home() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="mx-auto max-w-6xl px-6">
        <nav className="flex items-center justify-between py-6">
          <Link to="/" className="flex items-center text-xl font-bold tracking-tight">
            <div
  className="h-8 w-8 mr-2 flex-shrink-0 bg-center bg-no-repeat bg-cover rounded-sm"
  style={{ backgroundImage: "url('/logo.svg')" }}
></div>
            Fitness App<span className="text-primary">.</span>
          </Link>
          <div className="flex items-center gap-4">
            <Link to="/login" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Log in
            </Link>
            <Button asChild>
              <Link to="/signup">Get started</Link>
            </Button>
          </div>
        </nav>

        <section className="grid grid-cols-1 lg:grid-cols-[1.15fr_0.85fr] gap-16 items-center py-24">
          <div>
            <h1 className="text-5xl lg:text-6xl font-bold tracking-tight leading-[1.05]">
              Training that adjusts to <span className="text-primary">you</span>, not a template.
            </h1>
            <p className="mt-6 max-w-md text-lg text-muted-foreground">
              A structured plan that progresses with every session you log — for people
              who can't justify paying for a personal trainer, but still want the same
              programming logic.
            </p>
            <Button asChild size="lg" className="mt-8">
              <Link to="/signup">Build your plan</Link>
            </Button>
          </div>

          <Card>
            <CardContent className="pt-6">
              <p className="text-xs font-mono text-muted-foreground mb-3">SESSION 12 — WEEK 3</p>
              <div className="flex justify-between py-3 border-b text-sm font-mono">
                <span>Back Squat</span><span>4×6 @ 82.5kg</span>
              </div>
              <div className="flex justify-between py-3 border-b text-sm font-mono">
                <span>Romanian Deadlift</span><span>3×10 @ 60kg</span>
              </div>
              <div className="flex justify-between py-3 text-sm">
                <span className="inline-flex items-center rounded-full bg-primary/10 px-2.5 py-1 text-xs font-mono font-medium text-primary">
                  +2.5kg from last week
                </span>
              </div>
            </CardContent>
          </Card>
        </section>

        <section className="grid grid-cols-1 md:grid-cols-3 gap-8 py-16">
          {[
            { title: 'Built from your intake', desc: 'Goals, equipment, injury history — the plan reflects your actual starting point.' },
            { title: 'Adjusts automatically', desc: 'Hit your reps cleanly, the next session progresses. No guessing.' },
            { title: 'Grounded coaching, not guesses', desc: 'Form guidance sourced from real training principles, not generic advice.' },
          ].map((f) => (
            <div key={f.title} className="border-t-2 border-primary pt-4">
              <h3 className="font-semibold text-lg mb-1">{f.title}</h3>
              <p className="text-sm text-muted-foreground">{f.desc}</p>
            </div>
          ))}
        </section>
      </div>
    </div>
  );
}
