//import {useState} from 'react';

import { unstable_noStore as noStore } from 'next/cache';
async function delay() {
  noStore();
  await new Promise((resolve) => setTimeout(resolve, 3000));
}
async function page() {
  await delay();
  return (
    <>
      <p>invoices</p>
    </>
  );
}

export default page;
