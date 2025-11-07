'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Minus, Plus, Trash2, ShoppingBag, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

interface CartItem {
  id: string;
  productId: string;
  quantity: number;
  product: {
    id: string;
    name: string;
    price: number;
    images: string;
  };
}

export default function CartPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin');
    } else if (status === 'authenticated') {
      fetchCart();
    }
  }, [status, router]);

  const fetchCart = async () => {
    try {
      const res = await fetch('/api/cart');
      if (res.ok) {
        const data = await res.json();
        setCartItems(data);
      }
    } catch (error) {
      console.error('Error fetching cart:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateQuantity = async (productId: string, newQuantity: number) => {
    if (newQuantity < 1) {
      removeItem(productId);
      return;
    }

    try {
      const res = await fetch('/api/cart', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId, quantity: newQuantity }),
      });

      if (res.ok) {
        fetchCart();
      }
    } catch (error) {
      console.error('Error updating cart:', error);
    }
  };

  const removeItem = async (productId: string) => {
    try {
      const res = await fetch('/api/cart', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId }),
      });

      if (res.ok) {
        fetchCart();
      }
    } catch (error) {
      console.error('Error removing item:', error);
    }
  };

  const handleCheckout = async () => {
    try {
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          items: cartItems.map(item => ({
            productId: item.productId,
            quantity: item.quantity,
            price: item.product.price
          }))
        }),
      });

      const data = await res.json();
      
      if (data.success) {
        router.push(`/success?orderId=${data.orderId}`);
      }
    } catch (error) {
      console.error('Checkout error:', error);
    }
  };

  const total = cartItems.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 pt-24 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-500 mx-auto"></div>
          <p className="mt-4 text-slate-600">Загрузка корзины...</p>
        </div>
      </div>
    );
  }

  if (!session) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 pt-24">
      <div className="container mx-auto px-6 py-8">
        <div className="flex items-center gap-4 mb-8">
          <Link
            href="/shop"
            className="p-2 text-slate-600 hover:text-slate-800 transition-colors"
          >
            <ArrowLeft className="w-6 h-6" />
          </Link>
          <h1 className="text-4xl font-bold text-slate-900">Корзина</h1>
        </div>
        
        {cartItems.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-12"
          >
            <ShoppingBag className="w-24 h-24 text-slate-300 mx-auto mb-4" />
            <p className="text-xl text-slate-600 mb-4">Корзина пуста</p>
            <Link
              href="/shop"
              className="px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-xl font-semibold inline-flex items-center gap-2"
            >
              <ShoppingBag className="w-5 h-5" />
              Начать покупки
            </Link>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              {cartItems.map((item, index) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white rounded-2xl p-6 shadow-lg border border-white/20 mb-4"
                >
                  <div className="flex gap-4">
                    <img
                      src={item.product.images || '/placeholder-product.jpg'}
                      alt={item.product.name}
                      className="w-20 h-20 object-cover rounded-lg"
                    />
                    <div className="flex-1">
                      <h3 className="font-semibold text-slate-900 text-lg">{item.product.name}</h3>
                      <p className="text-slate-600 text-sm mt-1">${item.product.price}</p>
                      
                      <div className="flex items-center gap-3 mt-4">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                            className="p-2 border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors"
                          >
                            <Minus className="w-4 h-4" />
                          </button>
                          <span className="font-medium w-8 text-center">{item.quantity}</span>
                          <button
                            onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                            className="p-2 border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors"
                          >
                            <Plus className="w-4 h-4" />
                          </button>
                        </div>
                        
                        <div className="ml-auto flex items-center gap-4">
                          <span className="font-semibold text-slate-900">
                            ${(item.product.price * item.quantity).toFixed(2)}
                          </span>
                          <button
                            onClick={() => removeItem(item.productId)}
                            className="p-2 text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
            
            <div className="lg:col-span-1">
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
                className="bg-white rounded-2xl p-6 shadow-lg border border-white/20 sticky top-24"
              >
                <h3 className="text-xl font-semibold text-slate-900 mb-4">Итого</h3>
                <div className="space-y-3 mb-6">
                  <div className="flex justify-between text-slate-600">
                    <span>Товары ({cartItems.reduce((sum, item) => sum + item.quantity, 0)} шт.)</span>
                    <span>${total.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-slate-600">
                    <span>Доставка</span>
                    <span>$0.00</span>
                  </div>
                  <div className="border-t pt-3">
                    <div className="flex justify-between font-semibold text-lg text-slate-900">
                      <span>Всего</span>
                      <span>${total.toFixed(2)}</span>
                    </div>
                  </div>
                </div>
                
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleCheckout}
                  className="w-full py-4 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl transition-all"
                >
                  Демо-оплата
                </motion.button>
                
                <p className="text-sm text-slate-500 text-center mt-4">
                  ⚠️ Это демо-версия. Реальной оплаты не будет.
                </p>
              </motion.div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}