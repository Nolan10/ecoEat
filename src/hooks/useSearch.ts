import { useMemo, useState } from 'react';
import { Product } from '@/src/data/products';

export type WasteRisk = 'low' | 'medium' | 'high';
export type SortBy = 'name' | 'price' | 'expiryDate' | 'risk' | null;

interface UseSearchResult {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  selectedRisk: WasteRisk | null;
  setSelectedRisk: (risk: WasteRisk | null) => void;
  sortBy: SortBy;
  setSortBy: (sort: SortBy) => void;
  filteredProducts: Product[];
}

export function useSearch(products: Product[]): UseSearchResult {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedRisk, setSelectedRisk] = useState<WasteRisk | null>(null);
  const [sortBy, setSortBy] = useState<SortBy>(null);

  const filteredProducts = useMemo(() => {
    let result = products;

    // Filter by search query (name)
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim();
      result = result.filter((product) =>
        product.name.toLowerCase().includes(query)
      );
    }

    // Filter by risk level
    if (selectedRisk) {
      result = result.filter((product) => product.wasteRisk === selectedRisk);
    }

    // Sort
    if (sortBy) {
      result = [...result].sort((a, b) => {
        switch (sortBy) {
          case 'name':
            return a.name.localeCompare(b.name);
          case 'price':
            return a.price - b.price;
          case 'expiryDate':
            return new Date(a.expiryDate).getTime() - new Date(b.expiryDate).getTime();
          case 'risk': {
            const riskOrder = { high: 0, medium: 1, low: 2 };
            return riskOrder[a.wasteRisk] - riskOrder[b.wasteRisk];
          }
          default:
            return 0;
        }
      });
    }

    return result;
  }, [products, searchQuery, selectedRisk, sortBy]);

  return {
    searchQuery,
    setSearchQuery,
    selectedRisk,
    setSelectedRisk,
    sortBy,
    setSortBy,
    filteredProducts,
  };
}
