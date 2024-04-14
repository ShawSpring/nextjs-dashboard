import { sql, createClient } from '@vercel/postgres';
import dotenv from 'dotenv';
dotenv.config({
  path: '.env',
});

// client是一次连接，多次查询，记得关闭连接, 而sql是直接查询
async function getUsers() {
  console.log(process.env.POSTGRES_DATABASE);
  const client = createClient({
    query_timeout: 1000,
    database: process.env.POSTGRES_DATABASE,
  });
  await client.connect();
  const { rows } =
    await client.sql`SELECT * FROM customers WHERE name='Evil Rabbit'`;
  console.log(rows);
  const res = await client.sql`SELECT * from revenue`;
  console.log(res.rows);
  await client.end();
}
getUsers();

let n = 1;
const timer = setInterval(() => {
  console.log('tick ', n++);
  if (n > 30) clearInterval(timer);
}, 1000);
