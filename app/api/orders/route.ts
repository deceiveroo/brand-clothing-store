import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth'; // ← правильный импорт
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const session = await auth(); // ← используйте auth() напрямую
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const orders = await prisma.order.findMany({
      where: { userId: session.user.id },
      include: {
        items: {
          include: {
            product: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json(orders);
  } catch (error) {
    console.error('Orders fetch error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}