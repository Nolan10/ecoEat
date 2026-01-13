// src/services/productsService.ts
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  orderBy,
  query,
  serverTimestamp,
  Timestamp,
  updateDoc,
  where
} from 'firebase/firestore';
import { db } from './firebase';

// Types et interfaces
export type WasteRisk = 'low' | 'medium' | 'high';

export interface Product {
  id: string;
  name: string;
  price: string; // Format "2.50€"
  expiryDate: string; // Format "YYYY-MM-DD"
  wasteRisk: WasteRisk;
  isDonation?: boolean;
  userId?: string;
  createdAt?: Timestamp;
  updatedAt?: Timestamp;
}

export interface ProductRequest {
  name: string;
  price: string;
  expiryDate: string;
  wasteRisk: WasteRisk;
  isDonation?: boolean;
}

const PRODUCTS_COLLECTION = 'products';
// CREATE - Créer un produit
export async function createProduct(product: ProductRequest, userId: string): Promise<Product> {
  if (!userId) {
    throw new Error('User ID requis');
  }

  try {
    // Si c'est un don, forcer le prix à "0€"
    const productData = {
      ...product,
      price: product.isDonation ? '0€' : product.price,
      isDonation: product.isDonation || false,
      userId: userId,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    };

    // Ajouter le document dans Firestore
    const productsRef = collection(db, PRODUCTS_COLLECTION);
    const docRef = await addDoc(productsRef, productData);

    // Retourner le produit avec son ID
    return {
      id: docRef.id,
      ...product,
      price: productData.price,
      isDonation: productData.isDonation,
      userId: userId,
    };
  } catch (error) {
    console.error('Error creating product:', error);
    throw new Error('Failed to create product');
  }
}

// READ - Récupérer tous les produits
export async function fetchProducts(): Promise<Product[]> {
  try {
    const productsRef = collection(db, PRODUCTS_COLLECTION);
    const querySnapshot = await getDocs(productsRef);

    const products: Product[] = [];
    querySnapshot.forEach((doc) => {
      products.push({
        id: doc.id,
        ...doc.data(),
      } as Product);
    });

    return products;
  } catch (error) {
    console.error('Error fetching products:', error);
    throw new Error('Failed to fetch products');
  }
}

// READ - Récupérer uniquement les produits en don
export async function fetchDonations(userId: string): Promise<Product[]> {
  if (!userId) {
    throw new Error('User ID requis');
  }

  try {
    const productsRef = collection(db, PRODUCTS_COLLECTION);

    // Query pour filtrer par userId et isDonation
    const donationsQuery = query(
      productsRef,
      where('userId', '==', userId),
      where('isDonation', '==', true),
      orderBy('createdAt', 'desc')
    );

    const querySnapshot = await getDocs(donationsQuery);

    const donations: Product[] = [];
    querySnapshot.forEach((doc) => {
      donations.push({
        id: doc.id,
        ...doc.data(),
      } as Product);
    });

    return donations;
  } catch (error) {
    console.error('Error fetching donations:', error);
    throw new Error('Failed to fetch donations');
  }
}

// UPDATE - Mettre à jour un produit
export async function updateProduct(id: string, updates: Partial<ProductRequest>): Promise<void> {
  try {
    const productRef = doc(db, PRODUCTS_COLLECTION, id);

    // Si on marque comme don, forcer le prix à "0€"
    const updatedData = {
      ...updates,
      ...(updates.isDonation !== undefined && updates.isDonation ? { price: '0€' } : {}),
      updatedAt: serverTimestamp(),
    };

    await updateDoc(productRef, updatedData);
  } catch (error) {
    console.error('Error updating product:', error);
    throw new Error('Failed to update product');
  }
}

// UPDATE - Marquer un produit comme don
export async function markProductAsDonation(productId: string, isDonation: boolean = true): Promise<void> {
  try {
    // Appeler updateProduct avec isDonation
    // Le prix sera automatiquement mis à "0€" si isDonation = true
    await updateProduct(productId, { isDonation });
  } catch (error) {
    console.error('Error marking product as donation:', error);
    throw new Error('Failed to mark product as donation');
  }
}

// DELETE - Supprimer un produit
export async function deleteProduct(id: string): Promise<void> {
  try {
    const productRef = doc(db, PRODUCTS_COLLECTION, id);
    await deleteDoc(productRef);
  } catch (error) {
    console.error('Error deleting product:', error);
    throw new Error('Failed to delete product');
  }
}
