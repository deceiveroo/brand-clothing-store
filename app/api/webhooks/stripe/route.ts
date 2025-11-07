import { NextRequest, NextResponse } from 'next/server';
import { headers } from 'next/headers';
import { stripe } from '../../../../../lib/stripe';
import { prisma } from '../../../../../lib/prisma';

export async function POST(request: NextRequest) {
  const body = await request.text();
  const signature = headers().get('stripe-signature')!;

  let event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (error) {
    console.error('Webhook signature verification failed:', error);
    return NextResponse.json(
      { error: 'Invalid signature' },
      { status: 400 }
    );
  }

  try {
    switch (event.type) {
      case 'checkout.session.completed':
        const session = event.data.object;
        
        // Найти заказ по Stripe session ID
        const order = await prisma.order.findFirst({
          where: { stripePaymentIntentId: session.id },
          include: { user: true },
        });

        if (order) {
          // Обновить статус заказа
          await prisma.order.update({
            where: { id: order.id },
            data: { status: 'completed' },
          });

          // Очистить корзину пользователя
          await prisma.cartItem.deleteMany({
            where: { userId: order.user.id },
          });

          // Здесь можно добавить отправку email подтверждения
          console.log(`Order ${order.id} completed successfully`);
        }
        break;

      case 'checkout.session.expired':
        const expiredSession = event.data.object;
        
        // Обновить статус заказа на "failed"
        await prisma.order.updateMany({
          where: { stripePaymentIntentId: expiredSession.id },
          data: { status: 'failed' },
        });
        break;

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('Webhook handler error:', error);
    return NextResponse.json(
      { error: 'Webhook handler failed' },
      { status: 500 }
    );
  }
}