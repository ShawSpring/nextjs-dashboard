'use server';

import { z } from 'zod';
import { sql } from '@vercel/postgres';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

const InvoiceSchema = z
  .object({
    id: z.string(),
    customerId: z.string(),
    amount: z.coerce.number(), // coerce 将字符串转换为数字
    status: z.enum(['pending', 'paid']),
    date: z.string(),
  })
  .omit({ id: true, date: true });

export async function createInvoice(formdata: FormData) {
  //   const rawFormData = {
  //     customerId: formdata.get('customerId'),
  //     amount: formdata.get('amount'),
  //     status: formdata.get('status'),
  //   };
  //* 从键值对列表entries转换为对象
  const rawFormData = Object.fromEntries(formdata.entries());
  //   for (let key in rawFormData) {
  //     console.log(key, rawFormData[key], typeof rawFormData[key]);
  //   }
  const { customerId, amount, status } = InvoiceSchema.parse(rawFormData);
  const amountInCents = amount * 100; // 以分为单位存储进数据库，可以避免浮点数精度问题
  const date = new Date().toISOString().split('T')[0];
  //   console.log(customerId, amountInCents, status, date);

  try {
    await sql`INSERT INTO INVOICES (customer_id,amount,status,date) 
  VALUES (${customerId},${amountInCents},${status},${date})`;
  } catch (error) {
    return {
      message: 'Database Error: failed to create invoice.',
    };
  }
  //& 清楚路由缓存，重新验证，即向服务器请求数据来验证，刷新数据来显示
  revalidatePath('/dashboard/invoices');
  redirect('/dashboard/invoices');
}

export async function updateInvoice(id: string, formdata: FormData) {
  const { customerId, amount, status } = InvoiceSchema.parse({
    customerId: formdata.get('customerId'),
    amount: formdata.get('amount'),
    status: formdata.get('status'),
  });
  const amountInCents = amount * 100;

  try {
    await sql`UPDATE invoices SET 
    customer_id = ${customerId}, amount = ${amountInCents}, status = ${status}  
    WHERE id = ${id}`;
  } catch (error) {
    return {
      message: 'Database Error: failed to update invoice.',
    };
  }
  revalidatePath('/dashboard/invoices');
  redirect('/dashboard/invoices');
}

export async function deleteInvoice(id: string) {
  //todo: 仅供测试，待会删除
  // throw new Error('failed to create invoice.');
  try {
    await sql`DELETE FROM invoices WHERE id = ${id}`;
  } catch (error) {
    return {
      message: 'Database Error: failed to delete invoice.',
    };
  }
  revalidatePath('/dashboard/invoices');
  //& 不需要redirect,本来就在/dashboard/invoices
}
