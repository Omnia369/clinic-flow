import Link from 'next/link';
import { getToolkits } from '../../lib/toolkits';
import Layout from '../../components/Layout';

export async function getStaticProps() {
  const toolkits = getToolkits();
  return {
    props: {
      toolkits,
    },
  };
}

const ToolkitIndex = ({ toolkits }) => {
  return (
    <Layout>
      <div className='bg-white p-6 rounded-lg shadow'>
        <h1 className='text-3xl font-bold mb-6'>Toolkit of Toolkits</h1>
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
          {toolkits.map(({ id, title, promise }) => (
            <Link href={`/toolkits/${id}`} key={id}>
              <a className='block p-6 bg-gray-50 hover:bg-gray-100 rounded-lg border border-gray-200 transition'>
                <h2 className='text-xl font-semibold text-gray-800'>{title}</h2>
                <p className='mt-2 text-gray-600'>{promise}</p>
              </a>
            </Link>
          ))}
        </div>
      </div>
    </Layout>
  );
};

export default ToolkitIndex;
