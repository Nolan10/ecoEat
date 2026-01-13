import { useProducts } from '@/src/hooks/useProducts';
import { colors } from '@/src/theme/colors';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React from 'react';
import { ActivityIndicator, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function ProductDetailScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { products, loading } = useProducts();

  const product = products.find((p) => p.id === id);

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.errorContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={styles.loadingText}>Chargement...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (!product) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Produit non trouvé</Text>
          <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
            <Text style={styles.backButtonText}>Retour</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  const riskColor = {
    low: colors.success,
    medium: colors.warning,
    high: colors.danger
  }[product.wasteRisk] || colors.gray;

  const riskLabel = {
    low: 'Risque faible',
    medium: 'Risque moyen',
    high: 'Risque élevé'
  }[product.wasteRisk] || 'Risque inconnu';

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView}>
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
            <Text style={styles.backButtonText}>← Retour</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.content}>
          <Text style={styles.productName}>{product.name}</Text>

          <View style={styles.priceContainer}>
            <Text style={styles.price}>{product.isDonation ? 'Gratuit' : product.price}</Text>
          </View>

          <View style={styles.detailsContainer}>
            <Text style={styles.label}>Date d expiration</Text>
            <Text style={styles.value}>{product.expiryDate}</Text>
          </View>

          <View style={styles.detailsContainer}>
            <Text style={styles.label}>Risque de gaspillage</Text>
            <View style={[styles.badge, { backgroundColor: riskColor }]}>
              <Text style={styles.badgeText}>{riskLabel}</Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white || '#F5F5F5',
  },
  scrollView: {
    flex: 1,
  },
  header: {
    padding: 16,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  backButton: {
    paddingVertical: 8,
  },
  backButtonText: {
    color: colors.primary || '#2C3E50',
    fontSize: 16,
    fontWeight: '600',
  },
  content: {
    padding: 20,
  },
  productName: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#2C3E50',
    marginBottom: 16,
  },
  priceContainer: {
    marginBottom: 24,
  },
  price: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#27AE60',
  },
  detailsContainer: {
    marginBottom: 20,
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  label: {
    fontSize: 14,
    color: '#7F8C8D',
    marginBottom: 8,
    fontWeight: '600',
  },
  value: {
    fontSize: 18,
    color: '#2C3E50',
    fontWeight: '500',
  },
  badge: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    alignSelf: 'flex-start',
  },
  badgeText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 14,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    fontSize: 20,
    color: '#E74C3C',
    marginBottom: 20,
    fontWeight: '600',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: '#7F8C8D',
  },
});
