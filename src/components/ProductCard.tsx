import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Pressable, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useAppContext } from '../context/AppContext';
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
  const { addFavorite, removeFavorite, isFavorite } = useAppContext();
  const favorite = isFavorite(id);

  const riskColor = {
    low: colors.success,
    medium: colors.warning,
    high: colors.danger
  }[wasteRisk] || colors.gray;

  const toggleFavorite = () => {
    if (favorite) removeFavorite(id);
    else addFavorite(id);
  };

  return (
    <TouchableOpacity
      style={[styles.card, { borderLeftColor: riskColor, borderLeftWidth: 4 }]}
      activeOpacity={0.7}
      onPress={onPress ?? (() => console.log('Pressed product id:', id))}
    >
      <View style={styles.headerRow}>
        <Text style={styles.name}>{name}</Text>
        <Pressable
          hitSlop={10}
          onPress={(e) => {
            // Prevent triggering the card navigation when tapping the heart
            // (PressEvent supports stopPropagation)
            if ('stopPropagation' in e && typeof e.stopPropagation === 'function') {
              e.stopPropagation();
            }
            toggleFavorite();
          }}
        >
          <Ionicons
            name={favorite ? 'heart' : 'heart-outline'}
            size={24}
            color={favorite ? colors.danger : colors.gray}
          />
        </Pressable>
      </View>
      <Text style={styles.price}>{price}€</Text>
      <Text style={styles.expiry}>Expire: {expiryDate}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: { backgroundColor: 'white', padding: 16, margin: 8, borderRadius: 8 },
  headerRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  name: { fontSize: 18, fontWeight: 'bold' },
  price: { color: '#27AE60', fontSize: 16 },
  expiry: { fontSize: 14, color: '#7F8C8D' }
});

export default ProductCard;