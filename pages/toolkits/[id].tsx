import { getToolkitData, getToolkitIds } from '../../lib/toolkits';
import Layout from '../../components/Layout';

export async function getStaticPaths() {
  const paths = getToolkitIds();
  return {
    paths,
    fallback: false,
  };
}

export async function getStaticProps({ params }) {
  const toolkitData = await getToolkitData(params.id);
  return {
    props: {
      toolkitData,
    },
  };
}

const ToolkitPage = ({ toolkitData }) => {
  return (
    <Layout>
      <div className='bg-white p-8 rounded-lg shadow'>
        <div className='prose max-w-none' dangerouslySetInnerHTML={{ __html: toolkitData.contentHtml }} />
      </div>
    </Layout>
  );
};

export default ToolkitPage;
