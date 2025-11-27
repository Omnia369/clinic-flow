import { GetStaticProps } from 'next';
import Head from 'next/head';
import Link from 'next/link';
import { getSortedToolkitsData } from '../../lib/toolkits';

export default function Toolkits({
  allToolkitsData,
}: {
  allToolkitsData: {
    id: string;
    title: string;
    date: string;
  }[];
}) {
  return (
    <div>
      <Head>
        <title>Clinic Flow Toolkits</title>
      </Head>
      <section>
        <h2>Toolkits</h2>
        <ul>
          {allToolkitsData.map(({ id, title }) => (
            <li key={id}>
              <Link href={`/toolkits/${id}`}>
                <a>{title}</a>
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}

export const getStaticProps: GetStaticProps = async () => {
  const allToolkitsData = getSortedToolkitsData();
  return {
    props: {
      allToolkitsData,
    },
  };
};
