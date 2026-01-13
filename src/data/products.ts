// src/data/products.ts
export interface Product {
  id: string;
  name: string;
  price: number;
  expiryDate: string;
  wasteRisk: 'low' | 'medium' | 'high';
  isDonation?: boolean; // Champ pour marquer comme don
}

export const products: Product[] = [
  { id: '1', name: 'Pain Naan', price: 3.24, expiryDate: '2025-12-22', wasteRisk: 'medium' },
  { id: '2', name: 'Lait Coco', price: 2.89, expiryDate: '2025-12-15', wasteRisk: 'high' },
  { id: '3', name: 'Fromage Brie', price: 4.50, expiryDate: '2025-12-18', wasteRisk: 'high' },
  { id: '4', name: 'Yaourt Nature', price: 1.99, expiryDate: '2025-12-20', wasteRisk: 'medium' },
  { id: '5', name: 'Beurre Salé', price: 5.99, expiryDate: '2025-12-25', wasteRisk: 'low' },
  { id: '6', name: 'Mozzarella', price: 3.49, expiryDate: '2025-12-16', wasteRisk: 'high' },
  { id: '7', name: 'Œufs Bio', price: 4.20, expiryDate: '2025-12-19', wasteRisk: 'medium' },
  { id: '8', name: 'Pain Complet', price: 2.50, expiryDate: '2025-12-21', wasteRisk: 'medium' },
  { id: '9', name: 'Jambon Blanc', price: 6.99, expiryDate: '2025-12-17', wasteRisk: 'high' },
  { id: '10', name: 'Thon en Boîte', price: 2.20, expiryDate: '2025-12-30', wasteRisk: 'low' },
  { id: '11', name: 'Crème Fraîche', price: 2.49, expiryDate: '2025-12-14', wasteRisk: 'high' },
  { id: '12', name: 'Lait Entier', price: 1.79, expiryDate: '2025-12-12', wasteRisk: 'high' },
  { id: '13', name: 'Fromage Emmental', price: 5.20, expiryDate: '2025-12-23', wasteRisk: 'medium' },
  { id: '14', name: 'Charcuterie Variée', price: 7.50, expiryDate: '2025-12-16', wasteRisk: 'high' },
  { id: '15', name: 'Baguette Classique', price: 1.20, expiryDate: '2025-12-20', wasteRisk: 'medium' },
  { id: '16', name: 'Saumon Fumé', price: 8.99, expiryDate: '2025-12-13', wasteRisk: 'high' },
  { id: '17', name: 'Crème Épaisse', price: 3.50, expiryDate: '2025-12-15', wasteRisk: 'high' },
  { id: '18', name: 'Ricotta', price: 3.99, expiryDate: '2025-12-17', wasteRisk: 'medium' },
  { id: '19', name: 'Chèvre Frais', price: 4.99, expiryDate: '2025-12-19', wasteRisk: 'medium' },
  { id: '20', name: 'Filet de Poulet', price: 9.99, expiryDate: '2025-12-11', wasteRisk: 'high' },
];