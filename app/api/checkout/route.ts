import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { items } = await request.json();

    // Получаем полную информацию о продуктах
    const productIds = items.map((item: any) => item.productId);
    const products = await prisma.product.findMany({
      where: {
        id: { in: productIds },
      },
    });

    // Создаем заказ в базе данных
    const order = await prisma.order.create({
      data: {
        userId: session.user.id,
        total: items.reduce((sum: number, item: any) => {
          const product = products.find(p => p.id === item.productId);
          return sum + (product ? product.price * item.quantity : 0);
        }, 0),
        status: 'completed',
        items: {
          create: items.map((item: any) => {
            const product = products.find(p => p.id === item.productId);
            return {
              productId: item.productId,
              quantity: item.quantity,
              price: product ? product.price : 0,
            };
          }),
        },
      },
      include: {
        items: {
          include: {
            product: true,
          },
        },
      },
    });

    // Очищаем корзину пользователя
    await prisma.cartItem.deleteMany({
      where: { userId: session.user.id },
    });

    return NextResponse.json({ 
      success: true, 
      orderId: order.id,
      message: '✅ Демо-платеж успешно завершен! Заказ создан.',
      order: {
        id: order.id,
        total: order.total,
        status: order.status,
        items: order.items,
      }
    });
  } catch (error) {
    console.error('Checkout error:', error);
    return NextResponse.json(
      { error: 'Ошибка при создании заказа' },
      { status: 500 }
    );
  }
}