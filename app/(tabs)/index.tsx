import ProductCard from '@/src/components/ProductCard';
import { Product, products } from '@/src/data/products';
import React from 'react';
import { FlatList } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function HomeScreen() {
  const renderItem = ({ item }: { item: Product }) => (
    <ProductCard {...item} />
  );

  return (
    <SafeAreaView>
      <FlatList
        data={products}
        renderItem={renderItem}
        keyExtractor={(item) => item.id.toString()}
      />
    </SafeAreaView>
  );
}
