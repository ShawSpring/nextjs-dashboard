'use server';

import { z } from 'zod';
import { sql } from '@vercel/postgres';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

const InvoiceSchema = z
  .object({
    id: z.string(),
    customerId: z.string({
      invalid_type_error: 'Please select a customer.',
    }),
    // coerce 将字符串转换为数字, 空字符串转换为 0
    amount: z.coerce
      .number()
      .gt(0, { message: 'Please enter an amount greater than 0.' }),
    status: z.enum(['pending', 'paid'], {
      invalid_type_error: 'Please select an invoice status',
    }),
    date: z.string(),
  })
  .omit({ id: true, date: true });

export type State = {
  errors?: {
    customerId?: string[];
    amount?: string[];
    status?: string[];
  };
  message?: string | null;
};

export async function createInvoice(
  prevState: State,
  formdata: FormData,
): Promise<State> {
  // const rawFormData = {
  //   customerId: formdata.get('customerId'),
  //   amount: formdata.get('amount'),
  //   status: formdata.get('status'),
  // };
  //* 从键值对列表entries转换为对象
  const rawFormData = Object.fromEntries(formdata.entries());
  const validatedFields = InvoiceSchema.safeParse(rawFormData);
  // console.log(validatedFields);
  if (!validatedFields.success) {
    //* 返回给state, 本函数已经被useFormState给包裹了
    return {
      message: 'Missing Fields. Failed to create invoice',
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }

  const { amount, customerId, status } = validatedFields.data;
  const amountInCents = amount * 100; // 以分为单位存储进数据库，可以避免浮点数精度问题
  const date = new Date().toISOString().split('T')[0];
  //   console.log(customerId, amountInCents, status, date);

  try {
    await sql`INSERT INTO INVOICES (customer_id,amount,status,date) 
  VALUES (${customerId},${amountInCents},${status},${date})`;
  } catch (error) {
    return {
      message: 'Database Error: Failed to create invoice.',
    };
  }
  //& 清楚路由缓存，重新验证，即向服务器请求数据来验证，刷新数据来显示
  revalidatePath('/dashboard/invoices');
  redirect('/dashboard/invoices');
}

export async function updateInvoice(
  id: string,
  prevState: State,
  formdata: FormData,
): Promise<State> {
  const validatedFields = InvoiceSchema.safeParse({
    customerId: formdata.get('customerId'),
    amount: formdata.get('amount'),
    status: formdata.get('status'),
  });
  if (!validatedFields.success) {
    return {
      message: 'Missing Fields. Failed to update invoice',
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }
  const { customerId, amount, status } = validatedFields.data;
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
