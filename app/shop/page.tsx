'use client';

import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Filter, Grid3X3, List, X, SlidersHorizontal } from 'lucide-react';
import ProductCard from '@/components/ProductCard';

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  images: string[];
  category: string;
  featured: boolean;
  inStock: boolean;
}

interface FilterState {
  categories: string[];
  priceRange: [number, number];
  inStock: boolean;
  featured: boolean;
}

export default function ShopPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [sortBy, setSortBy] = useState('name');
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState<FilterState>({
    categories: [],
    priceRange: [0, 500],
    inStock: true,
    featured: false,
  });

  // Получаем реальные данные из API
  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await fetch('/api/products');
      if (res.ok) {
        const data = await res.json();
        setProducts(data);
      }
    } catch (error) {
      console.error('Failed to fetch products:', error);
    }
  };

  // Мемоизированные отфильтрованные продукты
  const filteredProducts = useMemo(() => {
    let filtered = products.filter(product => {
      const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.description.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesCategory = filters.categories.length === 0 || 
        filters.categories.includes(product.category);
      
      const matchesPrice = product.price >= filters.priceRange[0] && 
        product.price <= filters.priceRange[1];
      
      const matchesStock = !filters.inStock || product.inStock;
      const matchesFeatured = !filters.featured || product.featured;

      return matchesSearch && matchesCategory && matchesPrice && matchesStock && matchesFeatured;
    });

    // Сортировка
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'price-low':
          return a.price - b.price;
        case 'price-high':
          return b.price - a.price;
        case 'featured':
          return (b.featured ? 1 : 0) - (a.featured ? 1 : 0);
        case 'newest':
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        case 'name':
        default:
          return a.name.localeCompare(b.name);
      }
    });

    return filtered;
  }, [products, searchTerm, filters, sortBy]);

  const categories = [
    { value: 'tops', label: 'Tops', count: products.filter(p => p.category === 'tops').length },
    { value: 'bottoms', label: 'Bottoms', count: products.filter(p => p.category === 'bottoms').length },
    { value: 'outerwear', label: 'Outerwear', count: products.filter(p => p.category === 'outerwear').length },
    { value: 'footwear', label: 'Footwear', count: products.filter(p => p.category === 'footwear').length },
    { value: 'accessories', label: 'Accessories', count: products.filter(p => p.category === 'accessories').length },
  ];

  const maxPrice = Math.max(...products.map(p => p.price), 500);

  const toggleCategory = (category: string) => {
    setFilters(prev => ({
      ...prev,
      categories: prev.categories.includes(category)
        ? prev.categories.filter(c => c !== category)
        : [...prev.categories, category]
    }));
  };

  const clearFilters = () => {
    setFilters({
      categories: [],
      priceRange: [0, maxPrice],
      inStock: true,
      featured: false,
    });
    setSearchTerm('');
  };

  const activeFilterCount = [
    filters.categories.length,
    filters.priceRange[1] < maxPrice ? 1 : 0,
    !filters.inStock ? 1 : 0,
    filters.featured ? 1 : 0,
  ].reduce((a, b) => a + b, 0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 pt-24">
      <div className="container mx-auto px-6 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-5xl font-bold text-slate-900 mb-4">Shop Collection</h1>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto">
            Discover our curated selection of premium clothing and accessories
          </p>
        </motion.div>

        {/* Controls Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-2xl p-6 shadow-lg border border-white/20 backdrop-blur-sm mb-8"
        >
          <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
            {/* Search */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
              />
            </div>

            {/* Filter Toggle */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2 px-4 py-3 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors"
            >
              <SlidersHorizontal className="w-5 h-5" />
              Filters
              {activeFilterCount > 0 && (
                <span className="bg-cyan-500 text-white text-xs rounded-full w-6 h-6 flex items-center justify-center">
                  {activeFilterCount}
                </span>
              )}
            </button>

            {/* Sort */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
            >
              <option value="name">Sort by Name</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="featured">Featured First</option>
              <option value="newest">Newest First</option>
            </select>

            {/* View Mode */}
            <div className="flex gap-2">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-3 rounded-xl ${
                  viewMode === 'grid'
                    ? 'bg-cyan-500 text-white'
                    : 'bg-slate-100 text-slate-600'
                }`}
              >
                <Grid3X3 className="w-5 h-5" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-3 rounded-xl ${
                  viewMode === 'list'
                    ? 'bg-cyan-500 text-white'
                    : 'bg-slate-100 text-slate-600'
                }`}
              >
                <List className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Advanced Filters */}
          <AnimatePresence>
            {showFilters && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="mt-6 pt-6 border-t border-slate-200"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {/* Categories */}
                  <div>
                    <h4 className="font-semibold text-slate-900 mb-3">Categories</h4>
                    <div className="space-y-2">
                      {categories.map(category => (
                        <label key={category.value} className="flex items-center justify-between">
                          <div className="flex items-center">
                            <input
                              type="checkbox"
                              checked={filters.categories.includes(category.value)}
                              onChange={() => toggleCategory(category.value)}
                              className="rounded border-slate-300 text-cyan-600 focus:ring-cyan-500"
                            />
                            <span className="ml-2 text-sm text-slate-700">{category.label}</span>
                          </div>
                          <span className="text-xs text-slate-500 bg-slate-100 px-2 py-1 rounded">
                            {category.count}
                          </span>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Price Range */}
                  <div>
                    <h4 className="font-semibold text-slate-900 mb-3">
                      Price Range: ${filters.priceRange[0]} - ${filters.priceRange[1]}
                    </h4>
                    <div className="space-y-4">
                      <input
                        type="range"
                        min="0"
                        max={maxPrice}
                        step="10"
                        value={filters.priceRange[1]}
                        onChange={(e) => setFilters(prev => ({
                          ...prev,
                          priceRange: [prev.priceRange[0], parseInt(e.target.value)]
                        }))}
                        className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer"
                      />
                      <div className="flex justify-between text-sm text-slate-600">
                        <span>$0</span>
                        <span>${maxPrice}</span>
                      </div>
                    </div>
                  </div>

                  {/* Availability */}
                  <div>
                    <h4 className="font-semibold text-slate-900 mb-3">Availability</h4>
                    <div className="space-y-2">
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          checked={filters.inStock}
                          onChange={(e) => setFilters(prev => ({ ...prev, inStock: e.target.checked }))}
                          className="rounded border-slate-300 text-cyan-600 focus:ring-cyan-500"
                        />
                        <span className="ml-2 text-sm text-slate-700">In Stock Only</span>
                      </label>
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          checked={filters.featured}
                          onChange={(e) => setFilters(prev => ({ ...prev, featured: e.target.checked }))}
                          className="rounded border-slate-300 text-cyan-600 focus:ring-cyan-500"
                        />
                        <span className="ml-2 text-sm text-slate-700">Featured Only</span>
                      </label>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex flex-col justify-end">
                    <button
                      onClick={clearFilters}
                      className="px-4 py-2 text-slate-600 hover:text-slate-800 transition-colors text-sm"
                    >
                      Clear All Filters
                    </button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Results Info */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex justify-between items-center mb-6"
        >
          <p className="text-slate-600">
            Showing {filteredProducts.length} of {products.length} products
          </p>
          {activeFilterCount > 0 && (
            <button
              onClick={clearFilters}
              className="flex items-center gap-1 text-sm text-cyan-600 hover:text-cyan-700"
            >
              <X className="w-4 h-4" />
              Clear filters
            </button>
          )}
        </motion.div>

        {/* Products Grid */}
        <motion.div
          layout
          className={`grid gap-6 ${
            viewMode === 'grid'
              ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'
              : 'grid-cols-1'
          }`}
        >
          <AnimatePresence mode="popLayout">
            {filteredProducts.map((product, index) => (
              <ProductCard
                key={product.id}
                product={product}
                viewMode={viewMode}
                index={index}
              />
            ))}
          </AnimatePresence>
        </motion.div>

        {filteredProducts.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <p className="text-xl text-slate-500">No products found matching your criteria</p>
            <button
              onClick={clearFilters}
              className="mt-4 px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-full font-semibold"
            >
              Clear Filters
            </button>
          </motion.div>
        )}
      </div>
    </div>
  );
}