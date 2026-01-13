// src/hooks/useProducts.ts
import { useState, useEffect, useCallback } from 'react';
import { 
  fetchProducts,
  fetchDonations,
  createProduct as createProductService, 
  updateProduct as updateProductService,
  markProductAsDonation as markProductAsDonationService,
  deleteProduct as deleteProductService 
} from '@/src/services/productsService';
import type { Product, ProductRequest } from '@/src/services/productsService';

const TEMP_USER_ID = 'guest';

export function useProducts() {
  // États
  const [products, setProducts] = useState<Product[]>([]);
  const [donations, setDonations] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Charger tous les produits
  const loadProducts = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const fetchedProducts = await fetchProducts();
      setProducts(fetchedProducts);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load products';
      setError(errorMessage);
      console.error('Error loading products:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  // Charger les produits en don
  const loadDonations = useCallback(async () => {
    try {
      const fetchedDonations = await fetchDonations(TEMP_USER_ID);
      setDonations(fetchedDonations);
    } catch (err) {
      console.error('Error loading donations:', err);
      // Pas besoin de setError ici car c'est secondaire
    }
  }, []);

  // Créer un nouveau produit
  const createProduct = async (product: ProductRequest): Promise<Product> => {
    try {
      const newProduct = await createProductService(product);
      
      // Recharger les produits après création
      await loadProducts();
      
      // Si c'est un don, recharger aussi les donations
      if (product.isDonation) {
        await loadDonations();
      }
      
      return newProduct;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to create product';
      console.error('Error creating product:', err);
      throw new Error(errorMessage);
    }
  };

  // Mettre à jour un produit
  const updateProduct = async (id: string, updates: Partial<ProductRequest>): Promise<void> => {
    try {
      await updateProductService(id, updates);
      
      // Recharger les produits après modification
      await loadProducts();
      
      // Si isDonation a changé, recharger les donations
      if (updates.isDonation !== undefined) {
        await loadDonations();
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update product';
      console.error('Error updating product:', err);
      throw new Error(errorMessage);
    }
  };

  // Marquer/démarquer un produit comme don
  const markProductAsDonation = async (productId: string, isDonation: boolean = true): Promise<void> => {
    try {
      await markProductAsDonationService(productId, isDonation);
      
      // Recharger products ET donations car le statut don a changé
      await Promise.all([loadProducts(), loadDonations()]);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to mark product as donation';
      console.error('Error marking product as donation:', err);
      throw new Error(errorMessage);
    }
  };

  // Supprimer un produit
  const deleteProduct = async (id: string): Promise<void> => {
    try {
      await deleteProductService(id);
      
      // Recharger products ET donations après suppression
      await Promise.all([loadProducts(), loadDonations()]);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to delete product';
      console.error('Error deleting product:', err);
      throw new Error(errorMessage);
    }
  };

  // Recharger toutes les données (pull-to-refresh)
  const refetch = useCallback(async () => {
    await Promise.all([loadProducts(), loadDonations()]);
  }, [loadProducts, loadDonations]);

  // Charger les données au montage du composant
  useEffect(() => {
    loadProducts();
    loadDonations();
  }, [loadProducts, loadDonations]);

  // Interface retournée par le hook
  return { 
    products,
    donations,
    loading,
    error,
    refetch,
    createProduct,
    updateProduct,
    markProductAsDonation,
    deleteProduct,
  };
}
