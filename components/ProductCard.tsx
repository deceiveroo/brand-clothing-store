'use client';

import { motion } from 'framer-motion';
import { ShoppingCart, Heart } from 'lucide-react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  images: string; // Теперь это строка, а не массив
  category: string;
  featured: boolean;
}

interface ProductCardProps {
  product: Product;
  viewMode: 'grid' | 'list';
  index: number;
}

export default function ProductCard({ product, viewMode, index }: ProductCardProps) {
  const { data: session } = useSession();
  const router = useRouter();

  // Получаем URL изображения (images теперь строка)
  const imageUrl = product.images || '/placeholder-product.jpg';

  const handleAddToCart = async () => {
  if (!session) {
    router.push('/auth/signin');
    return;
  }

  try {
    const res = await fetch('/api/cart', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        productId: product.id,
        quantity: 1,
      }),
    });

    if (res.ok) {
      toast.success('Добавлено в корзину!');
    } else {
      toast.error('Ошибка при добавлении в корзину');
    }
  } catch (error) {
    toast.error('Произошла ошибка');
  }
};

  if (viewMode === 'list') {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: index * 0.1 }}
        className="bg-white rounded-2xl p-6 shadow-lg border border-white/20 backdrop-blur-sm hover:shadow-xl transition-all"
      >
        <div className="flex gap-6">
          <img
            src={imageUrl}
            alt={product.name}
            className="w-32 h-32 object-cover rounded-xl"
          />
          <div className="flex-1">
            <h3 className="text-xl font-semibold text-slate-900 mb-2">
              {product.name}
            </h3>
            <p className="text-slate-600 mb-4 line-clamp-2">
              {product.description}
            </p>
            <div className="flex items-center justify-between">
              <span className="text-2xl font-bold text-slate-900">
                ${product.price}
              </span>
              <div className="flex gap-2">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="p-3 border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors"
                >
                  <Heart className="w-5 h-5" />
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleAddToCart}
                  className="p-3 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-xl shadow-lg hover:shadow-xl transition-all"
                >
                  <ShoppingCart className="w-5 h-5" />
                </motion.button>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: index * 0.1 }}
      whileHover={{ y: -8 }}
      className="bg-white rounded-2xl p-6 shadow-lg border border-white/20 backdrop-blur-sm hover:shadow-xl transition-all group"
    >
      <div className="aspect-square mb-4 bg-slate-100 rounded-xl overflow-hidden relative">
        <img
          src={imageUrl}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
        />
        {product.featured && (
          <span className="absolute top-3 left-3 bg-rose-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
            Featured
          </span>
        )}
      </div>
      <h3 className="text-lg font-semibold text-slate-900 mb-2">
        {product.name}
      </h3>
      <p className="text-slate-600 mb-4 line-clamp-2">
        {product.description}
      </p>
      <div className="flex items-center justify-between">
        <span className="text-2xl font-bold text-slate-900">
          ${product.price}
        </span>
        <div className="flex gap-2">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="p-3 border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors"
          >
            <Heart className="w-5 h-5" />
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleAddToCart}
            className="p-3 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-xl shadow-lg hover:shadow-xl transition-all"
          >
            <ShoppingCart className="w-5 h-5" />
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
}