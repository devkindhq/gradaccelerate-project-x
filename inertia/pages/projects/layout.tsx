import { Head } from '@inertiajs/react';
import { Link } from '@inertiajs/react';
import { ReactNode } from 'react';

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <>
      <Head>
        <title>Race Track</title>
      </Head>
      <nav className="bg-[#2C2C2E] p-4">
        <div className="max-w-4xl mx-auto flex justify-between items-center">
          <Link href="/" className="text-white text-xl font-bold">
            Race Track
          </Link>
          <div className="space-x-4">
            <Link href="/notes" className="text-white hover:text-gray-400">
              Notes
            </Link>
            <Link href="/todos" className="text-white hover:text-gray-400">
              Todos
            </Link>
            <Link href="/projects" className="text-white hover:text-gray-400">
              Projects
            </Link>
          </div>
        </div>
      </nav>
      <main>{children}</main>
    </>
  );
}