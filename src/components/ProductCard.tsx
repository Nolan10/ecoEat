import React from 'react';
import { StyleSheet, Text, TouchableOpacity } from 'react-native';
import { colors } from '../theme/colors';

interface ProductCardProps {
  id: string;
  name: string;
  price: number;
  expiryDate: string;
  wasteRisk: 'low' | 'medium' | 'high';
  onPress?: () => void;
}

const ProductCard: React.FC<ProductCardProps> = ({ id, name, price, expiryDate, wasteRisk, onPress }) => {
  const riskColor = {
    low: colors.success,
    medium: colors.warning,
    high: colors.danger
  }[wasteRisk] || colors.gray;

  return (
    <TouchableOpacity
      style={[styles.card, { borderLeftColor: riskColor, borderLeftWidth: 4 }]}
      activeOpacity={0.7}
      onPress={onPress ?? (() => console.log('Pressed product id:', id))}
    >
      <Text style={styles.name}>{name}</Text>
      <Text style={styles.price}>{price}€</Text>
      <Text style={styles.expiry}>Expire: {expiryDate}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: { backgroundColor: 'white', padding: 16, margin: 8, borderRadius: 8 },
  name: { fontSize: 18, fontWeight: 'bold' },
  price: { color: '#27AE60', fontSize: 16 },
  expiry: { fontSize: 14, color: '#7F8C8D' }
});

export default ProductCard;