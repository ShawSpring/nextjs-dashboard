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
  function handleFetch() {
    fetch('/api/data')
      .then((res) => res.json())
      .then((res) => {
        console.log(res);
      })
      .catch((error) => {
        console.log('Fetch error: ', error);
      });
  }
  useEffect(() => {
    document.title = 'customers| Acme Dashboard';
  }, []);

  return (
    <div>
      <p>customers</p>
      <button
        onClick={handleFetch}
        className="rounded-md bg-cyan-500 px-1 py-2"
      >
        fetch
      </button>
    </div>
  );
}

export default Page;
