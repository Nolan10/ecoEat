import ProductCard from '@/src/components/ProductCard';
import { Product, products } from '@/src/data/products';
import { useRouter } from 'expo-router';
import React from 'react';
import { FlatList, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function ProductsScreen() {
  const router = useRouter();

  const renderItem = ({ item }: { item: Product }) => (
    <ProductCard {...item} id={item.id} onPress={() => router.push({ pathname: '/product/[id]', params: { id: item.id } })} />
  );

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={products}
        renderItem={renderItem}
        keyExtractor={(item) => item.id.toString()}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyTitle}>Aucun produit disponible</Text>
            <Text style={styles.emptySubtitle}>Ajoutez des produits pour les voir ici.</Text>
          </View>
        }
        contentContainerStyle={products.length === 0 ? styles.emptyListContent : undefined}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
