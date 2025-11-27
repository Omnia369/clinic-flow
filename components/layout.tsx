import Head from 'next/head';
import Link from 'next/link';

export default function Layout({
  children,
  home,
}: {
  children: React.ReactNode;
  home?: boolean;
}) {
  return (
    <div className='max-w-2xl mx-auto px-4 py-10'>
      <Head>
        <link rel='icon' href='/favicon.ico' />
        <meta
          name='description'
          content='Clinic Flow - Automations for Chiropractors'
        />
        <meta name='og:title' content='Clinic Flow' />
      </Head>
      <header className='pb-8'>
        <h1 className='text-4xl font-bold'>
          <Link href='/'>
            <a>Clinic Flow</a>
          </Link>
        </h1>
      </header>
      <main>{children}</main>
      {!home && (
        <div className='pt-8'>
          <Link href='/toolkits'>
            <a>← Back to Toolkits</a>
          </Link>
        </div>
      )}
    </div>
  );
}
