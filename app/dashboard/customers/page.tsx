'use client';
import { useEffect } from 'react';
//* client中 不能使用 Metadata, 改用js手动设置
// import { Metadata } from 'next';
// export const metadata: Metadata = {
//   title: 'customers', // 自动嵌入模板中 template: '%s | Acme Dashboard',
// };
import Head from 'next/head';
function Page() {
  //const [data, setData] = useState([]);

  useEffect(() => {
    document.title = 'customers| Acme Dashboard';
  }, []);

  return (
    <div>
      <p>customers</p>
      <button
        onClick={() => {
          console.log('click customers');
        }}
        className="rounded-md bg-cyan-500 px-1 py-2"
      >
        fetch
      </button>
    </div>
  );
}

export default Page;
