import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useRegistryStats } from '@/hooks/useRegistry';
import { activeChallenges } from '@/data/challenges';
import { CodeBenderPlaceholder } from '@/apps/codebender-profile/CodeBenderPlaceholder';

export function HomePage() {
  const stats = useRegistryStats();

  const statItems = [
    { label: 'Total Benders', value: stats.isLoading ? '—' : (stats.data?.totalBenders ?? '—') },
    { label: 'Skills Live', value: stats.isLoading ? '—' : (stats.data?.skillsLive ?? '—') },
    { label: 'Active Challenges', value: activeChallenges.length },
    { label: 'Open to Work', value: stats.isLoading ? '—' : (stats.data?.openToWork ?? '—') },
  ];

  const featureCards = [
    {
      title: 'Hall of Fame',
      description: 'Browse all 1,200 rank slots. Filter by discipline, rank, or activity.',
      href: '/hall-of-fame',
    },
    {
      title: 'Challenges',
      description: 'Weekly coding sprints. Earn XP and win ranks.',
      href: '/challenges',
    },
    {
      title: 'Stack Radar',
      description: 'See what the community is building with. Live tech pulse.',
      href: '/stack-radar',
    },
  ];

  return (
    <div className="flex flex-col">
      {/* Hero */}
      <section className="py-24 px-4 text-center">
        <h1 className="font-mono text-4xl md:text-6xl font-bold tracking-tight">
          The<span className="text-cyan-400">Last</span>CodeBender
        </h1>
        <p className="text-muted-foreground mt-4 max-w-xl mx-auto text-lg">
          Open source developer legacy. One per developer. Forever.
        </p>
        <div className="flex gap-4 justify-center mt-8 flex-wrap">
          <Button size="lg" variant="outline" asChild>
            <Link to="/hall-of-fame">Explore Benders</Link>
          </Button>
        </div>
      </section>

      {/* Stats Strip */}
      <section className="px-4 pb-16 max-w-7xl mx-auto w-full">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {statItems.map(({ label, value }) => (
            <div
              key={label}
              className="border border-border rounded-lg p-6 text-center"
            >
              <div className="font-mono text-3xl font-bold text-cyan-400">{String(value)}</div>
              <div className="text-muted-foreground text-sm mt-1">{label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Feature Cards */}
      <section className="px-4 pb-16 max-w-7xl mx-auto w-full">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {featureCards.map(({ title, description, href }) => (
            <Link key={href} to={href} className="cursor-pointer group">
              <Card className="h-full transition-colors group-hover:border-cyan-400/50">
                <CardHeader>
                  <CardTitle className="font-mono">{title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground text-sm">{description}</p>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </section>

      {/* CTA Banner */}
      <section className="border-t border-border py-16 text-center px-4">
        <h2 className="font-mono text-2xl md:text-3xl font-bold">Ready to bend code?</h2>
        <p className="text-muted-foreground mt-3 mb-6">
          Fork the repo, claim your rank, and join the legacy.
        </p>
        <main className="flex-1 overflow-y-auto scroll-smooth">
          <CodeBenderPlaceholder codeBenderName="AnyCodeBender" section="README" />
        </main>
       {/* <ForkRepositoryButton /> */}
      </section>
    </div>
  );
}
