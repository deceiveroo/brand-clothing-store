'use client';

import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { ShoppingCart, Heart, Share2, Star, Truck, Shield, RotateCcw } from 'lucide-react';
import ProductViewer3D from '../../../components/ProductViewer3D';
import toast from 'react-hot-toast';

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  images: string[];
  category: string;
  featured: boolean;
  inStock: boolean;
  rating: number;
  reviewCount: number;
}

export default function ProductPage() {
  const params = useParams();
  const [product, setProduct] = useState<Product | null>(null);
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState('description');

  useEffect(() => {
    if (params.id) {
      fetchProduct();
    }
  }, [params.id]);

  const fetchProduct = async () => {
    // Mock data - in real app, fetch from API
    const mockProduct: Product = {
      id: params.id as string,
      name: 'Neo-Tech Smart Jacket',
      description: 'Revolutionary smart jacket with advanced temperature regulation, built-in LED lighting system, and smartphone integration. Made from sustainable materials with self-cleaning nanotechnology.',
      price: 299.99,
      images: ['/api/placeholder/800/800', '/api/placeholder/800/800', '/api/placeholder/800/800'],
      category: 'outerwear',
      featured: true,
      inStock: true,
      rating: 4.8,
      reviewCount: 142,
    };
    setProduct(mockProduct);
  };

  const handleAddToCart = async () => {
    if (!product) return;

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

  if (!product) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  const get3DModelType = () => {
    switch (product.category) {
      case 'outerwear': return 'jacket';
      case 'footwear': return 'sneaker';
      case 'accessories': return 'cap';
      default: return 'jacket';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 pt-24">
      <div className="container mx-auto px-6 py-8">
        <div className="grid lg:grid-cols-2 gap-12">
          {/* Product Images & 3D Viewer */}
          <div className="space-y-6">
            {/* 3D Viewer */}
            <ProductViewer3D 
              productType={get3DModelType()}
              className="h-96 lg:h-[500px]"
            />
            
            {/* Image Thumbnails */}
            <div className="flex gap-4 overflow-x-auto pb-4">
              {product.images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 ${
                    selectedImage === index ? 'border-cyan-500' : 'border-slate-200'
                  }`}
                >
                  <img
                    src={image}
                    alt={`${product.name} view ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
            >
              <h1 className="text-4xl lg:text-5xl font-bold text-slate-900 mb-4">
                {product.name}
              </h1>
              
              {/* Rating */}
              <div className="flex items-center gap-2 mb-4">
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-5 h-5 ${
                        i < Math.floor(product.rating)
                          ? 'text-amber-500 fill-amber-500'
                          : 'text-slate-300'
                      }`}
                    />
                  ))}
                </div>
                <span className="text-slate-600">
                  {product.rating} ({product.reviewCount} reviews)
                </span>
              </div>

              {/* Price */}
              <div className="text-4xl font-bold text-slate-900 mb-6">
                ${product.price}
              </div>

              {/* Description */}
              <p className="text-lg text-slate-600 mb-6 leading-relaxed">
                {product.description}
              </p>

              {/* Features */}
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="flex items-center gap-2 text-slate-600">
                  <Truck className="w-5 h-5" />
                  <span>Free Shipping</span>
                </div>
                <div className="flex items-center gap-2 text-slate-600">
                  <Shield className="w-5 h-5" />
                  <span>2-Year Warranty</span>
                </div>
                <div className="flex items-center gap-2 text-slate-600">
                  <RotateCcw className="w-5 h-5" />
                  <span>30-Day Returns</span>
                </div>
              </div>

              {/* Quantity & Add to Cart */}
              <div className="space-y-4">
                <div className="flex items-center gap-4">
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
                </div>

                <div className="flex gap-4">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleAddToCart}
                    className="flex-1 bg-gradient-to-r from-cyan-500 to-blue-600 text-white py-4 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2"
                  >
                    <ShoppingCart className="w-5 h-5" />
                    Add to Cart
                  </motion.button>
                  
                  <button className="p-4 border border-slate-300 rounded-xl hover:bg-slate-50 transition-colors">
                    <Heart className="w-5 h-5" />
                  </button>
                  
                  <button className="p-4 border border-slate-300 rounded-xl hover:bg-slate-50 transition-colors">
                    <Share2 className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </motion.div>

            {/* Product Details Tabs */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white rounded-2xl p-6 shadow-lg border border-white/20 backdrop-blur-sm"
            >
              <div className="border-b border-slate-200 mb-6">
                <nav className="flex gap-8">
                  {['description', 'specifications', 'reviews', 'shipping'].map((tab) => (
                    <button
                      key={tab}
                      onClick={() => setActiveTab(tab)}
                      className={`pb-4 px-2 font-medium capitalize border-b-2 transition-colors ${
                        activeTab === tab
                          ? 'border-cyan-500 text-cyan-600'
                          : 'border-transparent text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      {tab}
                    </button>
                  ))}
                </nav>
              </div>

              <div className="prose prose-slate max-w-none">
                {activeTab === 'description' && (
                  <div>
                    <p>Experience the future of fashion with our Neo-Tech Smart Jacket. Designed for the modern urban explorer, this jacket combines cutting-edge technology with sustainable materials.</p>
                    <ul className="mt-4 space-y-2">
                      <li>• Advanced temperature regulation system</li>
                      <li>• Built-in LED lighting with customizable patterns</li>
                      <li>• Smartphone app integration</li>
                      <li>• Self-cleaning nanotechnology</li>
                      <li>• Water and wind resistant</li>
                    </ul>
                  </div>
                )}
                
                {activeTab === 'specifications' && (
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <strong>Material:</strong> Smart Fabric Pro
                    </div>
                    <div>
                      <strong>Care:</strong> Machine wash cold
                    </div>
                    <div>
                      <strong>Weight:</strong> 850g
                    </div>
                    <div>
                      <strong>Battery:</strong> 48 hours
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}