import ProductCard from '@/src/components/ProductCard';
import { Product, products } from '@/src/data/products';
import { useRouter } from 'expo-router';
import React from 'react';
import { FlatList, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useSearch, WasteRisk, SortBy } from '@/src/hooks/useSearch';
import { colors } from '@/src/theme/colors';

export default function ProductsScreen() {
  const router = useRouter();
  const { searchQuery, setSearchQuery, selectedRisk, setSelectedRisk, sortBy, setSortBy, filteredProducts } = useSearch(products);

  const renderItem = ({ item }: { item: Product }) => (
    <ProductCard {...item} id={item.id} onPress={() => router.push({ pathname: '/product/[id]', params: { id: item.id } })} />
  );

  const riskFilters: { label: string; value: WasteRisk | null }[] = [
    { label: 'Tous', value: null },
    { label: 'Faible', value: 'low' },
    { label: 'Moyen', value: 'medium' },
    { label: 'Élevé', value: 'high' },
  ];

  const sortOptions: { label: string; value: SortBy }[] = [
    { label: 'Défaut', value: null },
    { label: 'Nom', value: 'name' },
    { label: 'Prix', value: 'price' },
    { label: 'Expiration', value: 'expiryDate' },
    { label: 'Risque', value: 'risk' },
  ];

  return (
    <SafeAreaView style={styles.container}>
      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Rechercher un produit..."
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholderTextColor="#7F8C8D"
        />
      </View>

      {/* Risk Filters */}
      <View style={styles.filtersContainer}>
        {riskFilters.map((filter) => (
          <TouchableOpacity
            key={filter.label}
            style={[
              styles.filterChip,
              selectedRisk === filter.value && styles.filterChipActive,
            ]}
            onPress={() => setSelectedRisk(filter.value)}
          >
            <Text
              style={[
                styles.filterChipText,
                selectedRisk === filter.value && styles.filterChipTextActive,
              ]}
            >
              {filter.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Sort Options */}
      <View style={styles.sortContainer}>
        <Text style={styles.sortLabel}>Trier par:</Text>
        <View style={styles.sortButtons}>
          {sortOptions.map((option) => (
            <TouchableOpacity
              key={option.label}
              style={[
                styles.sortButton,
                sortBy === option.value && styles.sortButtonActive,
              ]}
              onPress={() => setSortBy(option.value)}
            >
              <Text
                style={[
                  styles.sortButtonText,
                  sortBy === option.value && styles.sortButtonTextActive,
                ]}
              >
                {option.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <FlatList
        data={filteredProducts}
        renderItem={renderItem}
        keyExtractor={(item) => item.id.toString()}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyTitle}>Aucun produit trouvé</Text>
            <Text style={styles.emptySubtitle}>
              {searchQuery || selectedRisk
                ? 'Essayez de modifier vos critères de recherche.'
                : 'Ajoutez des produits pour les voir ici.'}
            </Text>
          </View>
        }
        contentContainerStyle={filteredProducts.length === 0 ? styles.emptyListContent : undefined}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  searchContainer: {
    padding: 12,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  searchInput: {
    backgroundColor: '#F5F5F5',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: '#2C3E50',
  },
  filtersContainer: {
    flexDirection: 'row',
    padding: 12,
    backgroundColor: 'white',
    gap: 8,
    marginBottom: 4,
  },
  filterChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#E0E0E0',
  },
  filterChipActive: {
    backgroundColor: colors.primary || '#27AE60',
  },
  filterChipText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#7F8C8D',
  },
  filterChipTextActive: {
    color: 'white',
  },
  sortContainer: {
    padding: 12,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  sortLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#2C3E50',
    marginBottom: 8,
  },
  sortButtons: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  sortButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: '#F5F5F5',
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  sortButtonActive: {
    backgroundColor: colors.primary || '#27AE60',
    borderColor: colors.primary || '#27AE60',
  },
  sortButtonText: {
    fontSize: 13,
    fontWeight: '500',
    color: '#7F8C8D',
  },
  sortButtonTextActive: {
    color: 'white',
  },
  emptyListContent: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 24,
  },
  emptyContainer: {
    alignItems: 'center',
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 14,
    opacity: 0.7,
    textAlign: 'center',
  },
});
