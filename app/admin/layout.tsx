import { redirect } from 'next/navigation';
import { requireAdmin } from '@/lib/authorization/auth';
import Link from 'next/link';
import { LogoWithText } from '@/components/branding/Logo';

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await requireAdmin();
  
  return (
    <html lang="en" className="antialiased">
      <head>
        <title>Admin | revamped.in</title>
        <meta name="robots" content="noindex, nofollow" />
      </head>
      <body className="bg-charcoal-50 min-h-screen flex flex-col">
        <header className="bg-charcoal-900 border-b border-charcoal-800">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              <Link href="/admin" className="flex items-center gap-2" aria-label="Admin dashboard">
                <LogoWithText size="lg" className="text-white" />
              </Link>
              <nav className="flex items-center gap-6" aria-label="Admin navigation">
                <Link href="/admin" className="text-sm font-medium text-charcoal-300 hover:text-white transition-colors">
                  Dashboard
                </Link>
                <Link href="/admin/exams" className="text-sm font-medium text-charcoal-300 hover:text-white transition-colors">
                  Exams
                </Link>
                <Link href="/admin/audit" className="text-sm font-medium text-charcoal-300 hover:text-white transition-colors">
                  Audit Log
                </Link>
                <form action="/admin/logout" method="POST">
                  <button type="submit" className="text-sm font-medium text-charcoal-300 hover:text-white transition-colors bg-transparent border-none p-0 cursor-pointer">
                    Logout
                  </button>
                </form>
              </nav>
            </div>
          </div>
        </header>
        <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
          {children}
        </main>
        <footer className="border-t border-charcoal-200 bg-white py-6">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-sm text-charcoal-500">
            revamped.in Admin Panel — Internal use only
          </div>
        </footer>
      </body>
    </html>
  );
}