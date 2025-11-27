import { GetStaticProps, GetStaticPaths } from 'next';
import Head from 'next/head';
import { getAllToolkitIds, getToolkitData } from '../../lib/toolkits';
import { ParsedUrlQuery } from 'querystring';

interface IParams extends ParsedUrlQuery {
  id: string;
}

export default function Toolkit({
  toolkitData,
}: {
  toolkitData: {
    title: string;
    contentHtml: string;
  };
}) {
  return (
    <div>
      <Head>
        <title>{toolkitData.title}</title>
      </Head>
      <article>
        <h1>{toolkitData.title}</h1>
        <div dangerouslySetInnerHTML={{ __html: toolkitData.contentHtml }} />
      </article>
    </div>
  );
}

export const getStaticPaths: GetStaticPaths = async () => {
  const paths = getAllToolkitIds();
  return {
    paths,
    fallback: false,
  };
};

export const getStaticProps: GetStaticProps = async (context) => {
  const { id } = context.params as IParams;
  const toolkitData = await getToolkitData(id);
  return {
    props: {
      toolkitData,
    },
  };
};
