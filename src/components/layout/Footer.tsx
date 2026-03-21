import { Link } from 'react-router-dom';

const GITHUB_URL = 'https://github.com/suleigolden/the-last-code-bender';

export function Footer() {
  return (
    <footer className="border-t border-border">
      <div className="max-w-7xl mx-auto px-4 py-12 grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Brand */}
        <div className="flex flex-col gap-3">
          <span className="font-mono font-bold text-lg">
            The<span className="text-cyan-400">Last</span>CodeBender
          </span>
          <p className="text-muted-foreground text-sm">
            Open source developer legacy. 1,200 ranks. One per developer. Forever.
          </p>
        </div>

        {/* Pages */}
        <div className="flex flex-col gap-3">
          <h3 className="font-semibold text-sm">Pages</h3>
          <nav className="flex flex-col gap-2">
            {[
              { label: 'Hall of Fame', href: '/hall-of-fame' },
              { label: 'Challenges', href: '/challenges' },
              { label: 'Stack Radar', href: '/stack-radar' },
              { label: 'Recruit', href: '/recruit' },
            ].map(({ label, href }) => (
              <Link
                key={href}
                to={href}
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                {label}
              </Link>
            ))}
          </nav>
        </div>

        {/* Project */}
        <div className="flex flex-col gap-3">
          <h3 className="font-semibold text-sm">Project</h3>
          <nav className="flex flex-col gap-2">
            <a
              href={GITHUB_URL}
              target="_blank"
              rel="noreferrer"
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              GitHub Repo
            </a>
            <a
              href={`${GITHUB_URL}/blob/main/CONTRIBUTING.md`}
              target="_blank"
              rel="noreferrer"
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              Contribute
            </a>
            <a
              href={GITHUB_URL}
              target="_blank"
              rel="noreferrer"
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              Planning Doc
            </a>
          </nav>
        </div>
      </div>

      <div className="border-t border-border py-4 text-center text-muted-foreground text-sm">
        Open source · MIT licence · Built by the community
      </div>
    </footer>
  );
}
