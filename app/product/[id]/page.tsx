'use client';

import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { ShoppingCart, Heart, Star, Truck, Shield, RotateCcw } from 'lucide-react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import ProductViewer3D from '@/components/ProductViewer3D';

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  images: string;
  category: string;
  featured: boolean;
  inStock: boolean;
  createdAt: string;
}

export default function ProductPage() {
  const params = useParams();
  const { data: session } = useSession();
  const router = useRouter();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    if (params?.id) { // ← ДОБАВЬТЕ ПРОВЕРКУ params?.id
      fetchProduct();
    }
  }, [params?.id]); // ← ИСПОЛЬЗУЙТЕ params?.id

  const fetchProduct = async () => {
    try {
      const res = await fetch(`/api/products/${params?.id}`); // ← ДОБАВЬТЕ ?.
      if (res.ok) {
        const data = await res.json();
        setProduct(data);
      } else {
        router.push('/shop');
      }
    } catch (error) {
      console.error('Failed to fetch product:', error);
      router.push('/shop');
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = async () => {
    if (!session) {
      router.push('/auth/signin');
      return;
    }

    if (!product) return; // ← ДОБАВЬТЕ ПРОВЕРКУ product

    try {
      const res = await fetch('/api/cart', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productId: product.id,
          quantity: quantity,
        }),
      });

      if (res.ok) {
        toast.success('Added to cart!');
      } else {
        toast.error('Failed to add to cart');
      }
    } catch (error) {
      toast.error('An error occurred');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 pt-24 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-500"></div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 pt-24 flex items-center justify-center">
        <div className="text-center">
          <p className="text-xl text-slate-600">Product not found</p>
          <button
            onClick={() => router.push('/shop')}
            className="mt-4 px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-full font-semibold"
          >
            Back to Shop
          </button>
        </div>
      </div>
    );
  }

  // Преобразуем строку images в массив (если нужно)
  const imageArray = product.images ? [product.images] : ['/placeholder-product.jpg'];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 pt-24">
      <div className="container mx-auto px-6 py-8">
        <div className="grid lg:grid-cols-2 gap-12">
          {/* Product Images */}
          <div className="space-y-6">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="aspect-square bg-white rounded-2xl p-8 shadow-lg border border-white/20 backdrop-blur-sm"
            >
              <img
                src={imageArray[selectedImage]}
                alt={product.name}
                className="w-full h-full object-contain"
              />
            </motion.div>
            
            {/* Thumbnail Gallery */}
            <div className="flex gap-4">
              {imageArray.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={`w-20 h-20 bg-white rounded-xl border-2 ${
                    selectedImage === index
                      ? 'border-cyan-500'
                      : 'border-transparent'
                  }`}
                >
                  <img
                    src={image}
                    alt={`${product.name} ${index + 1}`}
                    className="w-full h-full object-cover rounded-lg"
                  />
                </button>
              ))}
            </div>

            {/* 3D Viewer for certain products */}
            {(product.category === 'outerwear' || product.category === 'footwear') && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="mt-8"
              >
                <ProductViewer3D
                  productType={product.category === 'outerwear' ? 'jacket' : 'sneaker'}
                  className="h-64"
                />
              </motion.div>
            )}
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <div className="flex items-center gap-2 mb-4">
                {product.featured && (
                  <span className="bg-rose-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                    Featured
                  </span>
                )}
                <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                  product.inStock
                    ? 'bg-green-100 text-green-800'
                    : 'bg-red-100 text-red-800'
                }`}>
                  {product.inStock ? 'In Stock' : 'Out of Stock'}
                </span>
              </div>
              
              <h1 className="text-4xl font-bold text-slate-900 mb-4">
                {product.name}
              </h1>
              
              <div className="flex items-center gap-2 mb-6">
                <div className="flex text-amber-400">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className="w-5 h-5 fill-current"
                    />
                  ))}
                </div>
                <span className="text-slate-600">(42 reviews)</span>
              </div>

              <p className="text-3xl font-bold text-slate-900 mb-6">
                ${product.price}
              </p>

              <p className="text-slate-600 leading-relaxed mb-8">
                {product.description}
              </p>
            </motion.div>

            {/* Quantity Selector */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="flex items-center gap-4 mb-6"
            >
              <span className="text-slate-700 font-medium">Quantity:</span>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-10 h-10 rounded-full border border-slate-300 flex items-center justify-center hover:bg-slate-50"
                >
                  -
                </button>
                <span className="w-12 text-center font-semibold">{quantity}</span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="w-10 h-10 rounded-full border border-slate-300 flex items-center justify-center hover:bg-slate-50"
                >
                  +
                </button>
              </div>
            </motion.div>

            {/* Action Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="flex gap-4 mb-8"
            >
              <button
                onClick={handleAddToCart}
                disabled={!product.inStock}
                className="flex-1 py-4 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                <ShoppingCart className="w-5 h-5" />
                Add to Cart
              </button>
              
              <button className="p-4 border border-slate-300 rounded-xl hover:bg-slate-50 transition-colors">
                <Heart className="w-6 h-6 text-slate-600" />
              </button>
            </motion.div>

            {/* Features */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="grid grid-cols-2 gap-4 py-6 border-t border-slate-200"
            >
              <div className="flex items-center gap-3">
                <Truck className="w-6 h-6 text-cyan-500" />
                <div>
                  <div className="font-semibold text-slate-900">Free Shipping</div>
                  <div className="text-sm text-slate-600">Worldwide</div>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <Shield className="w-6 h-6 text-cyan-500" />
                <div>
                  <div className="font-semibold text-slate-900">2-Year Warranty</div>
                  <div className="text-sm text-slate-600">Full coverage</div>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <RotateCcw className="w-6 h-6 text-cyan-500" />
                <div>
                  <div className="font-semibold text-slate-900">Easy Returns</div>
                  <div className="text-sm text-slate-600">30 days</div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}