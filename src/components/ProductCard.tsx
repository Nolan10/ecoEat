import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Pressable, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useAppContext } from '../context/AppContext';
import { colors } from '../theme/colors';

interface ProductCardProps {
  id: string;
  name: string;
  price: string | number;
  expiryDate: string;
  wasteRisk: 'low' | 'medium' | 'high';
  isDonation?: boolean;
  onPress?: () => void;
}

// Fonction utilitaire pour formater le prix
const formatPrice = (price: string | number): string => {
  if (typeof price === 'string') {
    // Si c'est déjà une chaîne avec €, on la retourne telle quelle
    return price.includes('€') ? price : `${price}€`;
  }
  return `${price}€`;
};

const ProductCard: React.FC<ProductCardProps> = ({ id, name, price, expiryDate, wasteRisk, isDonation, onPress }) => {
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
      <View style={styles.bottomRow}>
        <View>
          <Text style={styles.price}>{isDonation ? 'Gratuit' : formatPrice(price)}</Text>
          <Text style={styles.expiry}>Expire: {expiryDate}</Text>
        </View>
        {isDonation && (
          <View style={styles.donationBadge}>
            <Ionicons name="gift" size={14} color={colors.success} />
            <Text style={styles.donationText}>En don</Text>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: { backgroundColor: 'white', padding: 16, margin: 8, borderRadius: 8 },
  headerRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  name: { fontSize: 18, fontWeight: 'bold' },
  bottomRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end', marginTop: 4 },
  price: { color: '#27AE60', fontSize: 16 },
  expiry: { fontSize: 14, color: '#7F8C8D' },
  donationBadge: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    backgroundColor: '#E8F5E9', 
    paddingHorizontal: 8, 
    paddingVertical: 4, 
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#27AE60',
  },
  donationText: { 
    marginLeft: 4, 
    fontSize: 12, 
    fontWeight: '600', 
    color: '#27AE60' 
  },
});

export default ProductCard;