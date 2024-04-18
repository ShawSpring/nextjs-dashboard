//import {useState} from 'react';
import { Metadata } from 'next';
export const metadata: Metadata = {
  title: 'customers', // 自动嵌入模板中 template: '%s | Acme Dashboard',
};

function page() {
  //const [data, setData] = useState([]);
  return (
    <>
      <p>customers</p>
    </>
  );
}

export default page;
