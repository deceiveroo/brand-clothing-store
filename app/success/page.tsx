'use client';

import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, ShoppingBag, Download } from 'lucide-react';
import Link from 'next/link';

export default function SuccessPage() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get('session_id');
  const [order, setOrder] = useState<any>(null);

  useEffect(() => {
    if (sessionId) {
      // In a real app, you would fetch order details from your API
      // For now, we'll use mock data
      setOrder({
        id: 'ORD_' + Math.random().toString(36).substr(2, 9).toUpperCase(),
        total: 159.98,
        items: [
          { name: 'Premium Cotton T-Shirt', quantity: 1, price: 29.99 },
          { name: 'Designer Hoodie', quantity: 1, price: 89.99 },
          { name: 'Shipping', quantity: 1, price: 0 },
          { name: 'Tax', quantity: 1, price: 15.99 },
        ],
      });
    }
  }, [sessionId]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-emerald-50 pt-24">
      <div className="container mx-auto px-6 py-12">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-2xl mx-auto text-center"
        >
          <CheckCircle className="w-24 h-24 text-emerald-500 mx-auto mb-6" />
          <h1 className="text-4xl font-bold text-slate-900 mb-4">
            Payment Successful!
          </h1>
          <p className="text-xl text-slate-600 mb-8">
            Thank you for your purchase. Your order has been confirmed and will be shipped soon.
          </p>

          {order && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="bg-white rounded-2xl p-8 shadow-lg border border-white/20 backdrop-blur-sm mb-8 text-left"
            >
              <h2 className="text-2xl font-bold text-slate-900 mb-6">
                Order Details
              </h2>
              
              <div className="space-y-4 mb-6">
                <div className="flex justify-between">
                  <span className="text-slate-600">Order Number:</span>
                  <span className="font-semibold">{order.id}</span>
                </div>
                
                {order.items.map((item: any, index: number) => (
                  <div key={index} className="flex justify-between">
                    <span className="text-slate-600">
                      {item.name} {item.quantity > 1 && `× ${item.quantity}`}
                    </span>
                    <span className="font-semibold">
                      ${(item.price * item.quantity).toFixed(2)}
                    </span>
                  </div>
                ))}
                
                <div className="border-t border-slate-200 pt-4">
                  <div className="flex justify-between text-lg font-semibold text-slate-900">
                    <span>Total</span>
                    <span>${order.total.toFixed(2)}</span>
                  </div>
                </div>
              </div>

              <button className="w-full flex items-center justify-center gap-2 px-6 py-3 border border-slate-200 rounded-xl text-slate-700 hover:bg-slate-50 transition-colors">
                <Download className="w-5 h-5" />
                Download Receipt
              </button>
            </motion.div>
          )}

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/shop"
              className="px-8 py-4 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-full font-semibold shadow-lg hover:shadow-xl transition-all flex items-center gap-2"
            >
              <ShoppingBag className="w-5 h-5" />
              Continue Shopping
            </Link>
            <Link
              href="/orders"
              className="px-8 py-4 border border-slate-300 text-slate-700 rounded-full font-semibold hover:bg-slate-50 transition-all"
            >
              View Orders
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
}