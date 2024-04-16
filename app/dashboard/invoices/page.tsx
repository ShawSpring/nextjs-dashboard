import Pagination from '@/app/ui/invoices/pagination';
import Search from '@/app/ui/search';
import Table from '@/app/ui/invoices/table';
import { CreateInvoice } from '@/app/ui/invoices/buttons';
import { lusitana } from '@/app/ui/fonts';
import { InvoicesTableSkeleton } from '@/app/ui/skeletons';
import { Suspense } from 'react';

import { fetchInvoicesPages } from '@/app/lib/data';

//* Page是特殊组件，他接收两个props, params和searchParams, 路由参数和查询参数
//* 所以<Search/> 只是使用Router修改了url, Page再次渲染时，会自动从url里提取searchParams
export default async function Page({
  searchParams,
}: {
  searchParams?: {
    query?: string;
    currentPage?: number;
  };
}) {
  const query = searchParams?.query || '';
  const currentPage = Number(searchParams?.currentPage) || 1;

  const totalPages = await fetchInvoicesPages(query);
  return (
    <div className="w-full">
      <div className="flex w-full items-center justify-between">
        <h1 className={`${lusitana.className} text-2xl`}>Invoices</h1>
      </div>
      <div className="mt-4 flex items-center justify-between gap-2 md:mt-8">
        {/* <Search /> 是client component, 使用useSearchParams hook */}
        <Search placeholder="Search invoices..." />
        <CreateInvoice />
      </div>
      {/* <Table/> 是server component，使用searchParams props */}
      <Suspense key={query + currentPage} fallback={<InvoicesTableSkeleton />}>
        <Table query={query} currentPage={currentPage} />
      </Suspense>
      <div className="mt-5 flex w-full justify-center">
        <Pagination totalPages={totalPages} />
      </div>
    </div>
  );
}
