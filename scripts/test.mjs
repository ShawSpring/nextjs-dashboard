import { createClient, createPool } from '@vercel/postgres';
import dotenv from 'dotenv';
dotenv.config({
  path: '.env',
});

// client是一次连接，多次查询，记得关闭连接, 而sql是直接查询
async function getUsers() {
  console.log(process.env.POSTGRES_DATABASE);
  const client = createClient({
    query_timeout: 3000,
    database: process.env.POSTGRES_DATABASE,
  });
  await client.connect();
  const { rows } = await client.sql`SELECT * FROM users`;
  console.log(rows);
  const res = await client.sql`SELECT * from revenue`;
  console.log(res.rows);
  await client.end();
}
// getUsers();

async function getCustomers() {
  const pool = createPool();
  const sql = pool.sql.bind(pool);
  const res = await sql`SELECT * FROM customers WHERE name='Evil Rabbit'`;
  console.log(res.rows);
}

getCustomers();

let n = 1;
const timer = setInterval(() => {
  console.log('tick ', n++);
  if (n > 30) clearInterval(timer);
}, 1000);
