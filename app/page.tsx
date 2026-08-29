import { PortfolioPage } from '@/components/portfolio-page';
import { getContributions, usernameFromUrl } from '@/lib/contributions';
import { contactInfo } from '@/data/portfolio';

export default async function Home() {
  // Runs at build time and is baked into the static HTML, so the published
  // page never makes this request itself.
  const contributions = await getContributions(usernameFromUrl(contactInfo.github));

  return <PortfolioPage contributions={contributions} />;
}
