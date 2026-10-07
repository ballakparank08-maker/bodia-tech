import React, { useRef } from 'react';
import { ProductCategory } from '../types/index.ts';
import { Filter, ArrowUpDown, Check, Mail, Share2, MessageSquare, Heart, Terminal, ChevronLeft, ChevronRight } from 'lucide-react';

interface CatalogFilterBarProps {
  selectedCategory: ProductCategory;
  setSelectedCategory: (cat: ProductCategory) => void;
  inStockOnly: boolean;
  setInStockOnly: (val: boolean) => void;
  sortBy: 'featured' | 'price-asc' | 'price-desc' | 'stock' | 'vintage';
  setSortBy: (sort: 'featured' | 'price-asc' | 'price-desc' | 'stock' | 'vintage') => void;
  totalCount: number;
}

export const CatalogFilterBar: React.FC<CatalogFilterBarProps> = ({
  selectedCategory,
  setSelectedCategory,
  inStockOnly,
  setInStockOnly,
  sortBy,
  setSortBy,
  totalCount,
}) => {
  const categories: { id: ProductCategory; label: string; icon: React.ReactNode }[] = [
    { id: 'all', label: 'All Inventory', icon: <Filter className="w-3.5 h-3.5" /> },
    { id: 'social', label: 'Social Networks', icon: <Share2 className="w-3.5 h-3.5" /> },
    { id: 'email', label: 'Email Services', icon: <Mail className="w-3.5 h-3.5" /> },
    { id: 'messaging', label: 'Messaging Apps', icon: <MessageSquare className="w-3.5 h-3.5" /> },
    { id: 'dating', label: 'Dating & Lifestyle', icon: <Heart className="w-3.5 h-3.5" /> },
    { id: 'developer', label: 'Developer & Cloud', icon: <Terminal className="w-3.5 h-3.5" /> },
  ];

  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const scrollAmount = 250;
      scrollRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  return (
    <div className="bg-slate-900/80 backdrop-blur-md border-y border-slate-800/80 py-3.5 px-4 sm:px-6">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        {/* Category tabs */}
        <div className="flex items-center w-full md:flex-1 min-w-0 md:mr-4">
          <button 
            onClick={() => scroll('left')}
            className="hidden md:flex bg-slate-900 border border-slate-800/80 hover:border-slate-600 text-slate-400 hover:text-white w-8 h-8 rounded-full items-center justify-center cursor-pointer flex-shrink-0 mr-2 shadow-sm transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          
          <div ref={scrollRef} className="flex items-center gap-1.5 overflow-x-auto w-full pb-1 md:pb-0 scrollbar-none scroll-smooth">
            {categories.map((cat) => {
              const active = selectedCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition cursor-pointer ${
                    active
                      ? 'bg-gradient-to-r from-rose-600 to-amber-500 text-white shadow-[0_0_10px_rgba(225,29,72,0.4)]'
                      : 'bg-slate-900 text-slate-300 hover:text-white hover:bg-slate-800 border border-slate-800/80'
                  }`}
                >
                  {cat.icon}
                  {cat.label}
                </button>
              );
            })}
          </div>

          <button 
            onClick={() => scroll('right')}
            className="hidden md:flex bg-slate-900 border border-slate-800/80 hover:border-slate-600 text-slate-400 hover:text-white w-8 h-8 rounded-full items-center justify-center cursor-pointer flex-shrink-0 ml-2 shadow-sm transition-colors"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {/* Right controls: In-stock toggle & Sort selector */}
        <div className="flex items-center justify-between md:justify-end gap-3 sm:gap-4 w-full md:w-auto text-xs">
          {/* In Stock only switch */}
          <label className="flex items-center gap-2 cursor-pointer select-none text-slate-400 hover:text-white transition-colors group">
            <input
              type="checkbox"
              checked={inStockOnly}
              onChange={(e) => setInStockOnly(e.target.checked)}
              className="sr-only"
            />
            <div
              className={`w-4 h-4 rounded flex items-center justify-center border transition-colors ${
                inStockOnly
                  ? 'bg-emerald-500/20 border-emerald-500/50 text-emerald-400'
                  : 'bg-slate-900 border-slate-700 text-transparent group-hover:border-slate-600'
              }`}
            >
              <Check className="w-3 h-3 stroke-[3]" />
            </div>
            <span className="font-medium">In-Stock</span>
          </label>

          <div className="hidden sm:block w-px h-5 bg-slate-700/50"></div>

          {/* Sort dropdown */}
          <div className="flex items-center gap-1.5 bg-slate-900 border border-slate-700/60 hover:border-slate-600 rounded-lg px-3 py-1.5 text-slate-300 transition-colors shadow-sm">
            <ArrowUpDown className="w-3.5 h-3.5 text-slate-400" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="bg-transparent text-white outline-none cursor-pointer text-xs pr-1 font-medium"
            >
              <option value="featured" className="bg-slate-900">Sort: Featured</option>
              <option value="price-asc" className="bg-slate-900">Price: Low to High</option>
              <option value="price-desc" className="bg-slate-900">Price: High to Low</option>
              <option value="stock" className="bg-slate-900">Stock: Highest</option>
              <option value="vintage" className="bg-slate-900">Vintage: Oldest</option>
            </select>
          </div>

          <div className="hidden lg:block w-px h-5 bg-slate-700/50"></div>

          <div className="text-slate-400 text-xs hidden lg:flex items-center bg-slate-900/40 px-3 py-1.5 rounded-lg border border-slate-800/40">
            Found <strong className="text-white font-mono mx-1">{totalCount}</strong> items
          </div>
        </div>
      </div>
    </div>
  );
};
