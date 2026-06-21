import { createItem, getItems } from '@/server/functions/items';
import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import { z } from 'zod';

export const runtime = 'edge';

const createItemSchema = z.object({
  userId: z.string().min(1),
  title: z.string().min(1).max(120),
  body: z.string().max(2000).optional(),
});

export async function GET(request: NextRequest) {
  const userId = request.nextUrl.searchParams.get('userId');

  if (!userId) {
    return NextResponse.json({ error: 'userId is required' }, { status: 400 });
  }

  try {
    const items = await getItems(userId);
    return NextResponse.json({ items });
  } catch (error) {
    console.error('Failed to fetch items:', error);
    return NextResponse.json({ error: 'Failed to fetch items' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const parseResult = createItemSchema.safeParse(await request.json());

  if (!parseResult.success) {
    return NextResponse.json(
      { error: 'Invalid request body', details: parseResult.error.flatten() },
      { status: 400 },
    );
  }

  try {
    await createItem(parseResult.data);
    return NextResponse.json({ success: true }, { status: 201 });
  } catch (error) {
    console.error('Failed to create item:', error);
    return NextResponse.json({ error: 'Failed to create item' }, { status: 500 });
  }
}
