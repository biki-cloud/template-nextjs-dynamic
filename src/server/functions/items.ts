import { db } from '@/server/db';
import { itemTable } from '@/server/db/schema';
import { desc, eq } from 'drizzle-orm';

export const runtime = 'edge';

export const getItems = async (userId: string) => {
  'use server';

  return db
    .select()
    .from(itemTable)
    .where(eq(itemTable.userId, userId))
    .orderBy(desc(itemTable.createdAt));
};

export const createItem = async (input: {
  userId: string;
  title: string;
  body?: string;
}) => {
  'use server';

  return db.insert(itemTable).values({
    userId: input.userId,
    title: input.title,
    body: input.body ?? null,
  });
};
