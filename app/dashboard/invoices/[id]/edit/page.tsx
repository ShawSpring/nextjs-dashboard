import Breadcrumbs from '@/app/ui/invoices/breadcrumbs';
import Form from '@/app/ui/invoices/edit-form';
import { fetchInvoiceById, fetchCustomers } from '@/app/lib/data';
import { notFound } from 'next/navigation';

async function Page({ params }: { params: { id: string } }) {
  const invoiceId = params.id;

  const [invoice, customers] = await Promise.all([
    fetchInvoiceById(invoiceId),
    fetchCustomers(),
  ]);
  console.log('invoice:', invoice);
  if (!invoice) {
    notFound();
  }
  return (
    <main>
      <Breadcrumbs
        breadcrumbs={[
          { label: 'Invoice', href: '/dashboard/invoices' },
          {
            label: 'Edit',
            active: true,
            href: `/dashboard/invoices/${invoiceId}/edit`,
          },
        ]}
      />
      <Form invoice={invoice} customers={customers} />
    </main>
  );
}

export default Page;
