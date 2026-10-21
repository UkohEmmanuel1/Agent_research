import './globals.css';
export const metadata = { title: 'Nexus Research', description: 'Evidence-grounded AI research agent' };
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body>{children}</body></html>;
}
