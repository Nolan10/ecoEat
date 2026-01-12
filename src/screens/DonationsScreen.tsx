import { Product, products } from '@/src/data/products';
import { colors } from '@/src/theme/colors';
import React, { useState } from 'react';
import { Alert, FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function DonationsScreen() {
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const toggleSelection = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const renderItem = ({ item }: { item: Product }) => {
    const isSelected = selectedIds.includes(item.id);
    
    return (
      <TouchableOpacity
        style={[styles.card, isSelected && styles.cardSelected]}
        activeOpacity={0.7}
        onPress={() => toggleSelection(item.id)}
      >
        <View style={styles.cardContent}>
          <View style={styles.checkbox}>
            {isSelected && <View style={styles.checkboxInner} />}
          </View>
          <View style={styles.productInfo}>
            <Text style={styles.name}>{item.name}</Text>
            <Text style={styles.price}>{item.price.toFixed(2)}€</Text>
            <Text style={styles.expiry}>Expire: {item.expiryDate}</Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  const selectedProducts = products.filter((p) => selectedIds.includes(p.id));
  const totalValue = selectedProducts.reduce((sum, p) => sum + p.price, 0);

  const confirmDonation = () => {
    if (selectedIds.length === 0) return;

    Alert.alert(
      'Merci',
      `Don confirmé pour ${selectedIds.length} produit(s).`,
      [{ text: 'OK', onPress: () => setSelectedIds([]) }]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Mes Dons</Text>
        <Text style={styles.headerSubtitle}>Sélectionnez les produits à donner</Text>
      </View>

      <FlatList
        data={products}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
      />

      <View style={styles.footer}>
        <View style={styles.summary}>
          <Text style={styles.summaryText}>
            {selectedIds.length} produit{selectedIds.length > 1 ? 's' : ''} sélectionné{selectedIds.length > 1 ? 's' : ''}
          </Text>
          <Text style={styles.summaryValue}>Valeur: {totalValue.toFixed(2)}€</Text>
        </View>
        <TouchableOpacity
          style={[styles.donateButton, selectedIds.length === 0 && styles.donateButtonDisabled]}
          disabled={selectedIds.length === 0}
          onPress={confirmDonation}
        >
          <Text style={styles.donateButtonText}>
            {selectedIds.length === 0 ? 'Sélectionnez des produits' : 'Confirmer le don'}
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white || '#F5F5F5',
  },
  header: {
    padding: 20,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2C3E50',
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#7F8C8D',
  },
  listContent: {
    padding: 8,
  },
  card: {
    backgroundColor: 'white',
    padding: 16,
    margin: 8,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: 'transparent',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  cardSelected: {
    borderColor: colors.primary || '#27AE60',
    backgroundColor: '#E8F8F5',
  },
  cardContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: colors.primary || '#27AE60',
    marginRight: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxInner: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: colors.primary || '#27AE60',
  },
  productInfo: {
    flex: 1,
  },
  name: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2C3E50',
    marginBottom: 2,
  },
  price: {
    color: '#27AE60',
    fontSize: 14,
    marginBottom: 2,
  },
  expiry: {
    fontSize: 12,
    color: '#7F8C8D',
  },
  footer: {
    backgroundColor: 'white',
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
  },
  summary: {
    marginBottom: 12,
  },
  summaryText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2C3E50',
    marginBottom: 4,
  },
  summaryValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#27AE60',
  },
  donateButton: {
    backgroundColor: colors.primary || '#27AE60',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  donateButtonDisabled: {
    backgroundColor: '#BDC3C7',
  },
  donateButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
