'use client';

import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, ShoppingBag } from 'lucide-react';
import Link from 'next/link';

interface Order {
  id: string;
  total: number;
  status: string;
  items: Array<{
    id: string;
    quantity: number;
    price: number;
    product: {
      id: string;
      name: string;
      images: string[];
    };
  }>;
}

export default function SuccessPage() {
  const searchParams = useSearchParams();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const orderId = searchParams?.get('orderId'); // ← ДОБАВЬТЕ ?.
    if (orderId) {
      fetchOrder(orderId);
    } else {
      setLoading(false);
    }
  }, [searchParams]);

  const fetchOrder = async (orderId: string) => {
    try {
      // В демо-режиме просто создаем фейковый заказ
      setOrder({
        id: orderId,
        total: 129.99,
        status: 'completed',
        items: [
          {
            id: '1',
            quantity: 1,
            price: 129.99,
            product: {
              id: 'demo-1',
              name: 'Демо-товар',
              images: ['/demo-product.jpg']
            }
          }
        ]
      });
    } catch (error) {
      console.error('Error fetching order:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-green-50 pt-24 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500 mx-auto"></div>
          <p className="mt-4 text-slate-600">Загружаем информацию о заказе...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-green-50 pt-24">
      <div className="container mx-auto px-6 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-2xl mx-auto text-center"
        >
          <CheckCircle className="w-20 h-20 text-green-500 mx-auto mb-6" />
          <h1 className="text-4xl font-bold text-slate-900 mb-4">
            Заказ успешно создан!
          </h1>
          <p className="text-xl text-slate-600 mb-8">
            ✅ Это демо-версия магазина. В реальном приложении здесь была бы оплата.
          </p>

          {order && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="bg-white rounded-2xl p-6 shadow-lg border border-green-200 mb-8"
            >
              <h2 className="text-2xl font-semibold text-slate-900 mb-4">
                Информация о заказе
              </h2>
              <div className="text-left space-y-3">
                <p><strong>Номер заказа:</strong> #{order.id}</p>
                <p><strong>Статус:</strong> <span className="text-green-600">Завершен</span></p>
                <p><strong>Сумма:</strong> ${order.total}</p>
                <p><strong>Товары:</strong> {order.items.length} шт.</p>
              </div>
            </motion.div>
          )}

          <div className="flex gap-4 justify-center">
            <Link
              href="/shop"
              className="px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-xl font-semibold flex items-center gap-2"
            >
              <ShoppingBag className="w-5 h-5" />
              Продолжить покупки
            </Link>
            <Link
              href="/orders"
              className="px-6 py-3 border border-slate-300 text-slate-700 rounded-xl font-semibold hover:bg-slate-50 transition-colors"
            >
              Мои заказы
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
}