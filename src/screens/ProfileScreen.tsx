import { useAppContext } from '@/src/context/AppContext';
import { useProducts } from '@/src/hooks/useProducts';
import { colors } from '@/src/theme/colors';
import React from 'react';
import { Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function ProfileScreen() {
  const { favorites } = useAppContext();
  const { products } = useProducts();
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        {/* Avatar Section */}
        <View style={styles.avatarSection}>
          <Image
            source={require('../../assets/images/photo_profil_2005.jpg')}
            style={styles.avatarImage}
            accessibilityLabel="Photo de profil"
            resizeMode="cover"
          />
          <Text style={styles.name}>Nolan TESSIER</Text>
          <Text style={styles.email}>nolan.tessier@example.com</Text>
        </View>

        {/* Statistics Section */}
        <View style={styles.statsSection}>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{products.length}</Text>
            <Text style={styles.statLabel}>Produits</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{favorites.length}</Text>
            <Text style={styles.statLabel}>Favoris</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statValue}>45€</Text>
            <Text style={styles.statLabel}>Économisé</Text>
          </View>
        </View>

        {/* Favorites Section (optional) */}
        {favorites.length > 0 && (
          <View style={styles.favoritesSection}>
            <Text style={styles.favoritesSectionTitle}>Mes Favoris</Text>
            {favorites.slice(0, 5).map((id) => {
              const product = products.find((p) => p.id === id);
              return product ? (
                <View key={id} style={styles.favoriteItem}>
                  <Text style={styles.favoriteItemName}>{product.name}</Text>
                  <Text style={styles.favoriteItemPrice}>{product.price}</Text>
                </View>
              ) : null;
            })}
            {favorites.length > 5 && (
              <Text style={styles.favoritesMore}>+ {favorites.length - 5} autre(s)</Text>
            )}
          </View>
        )}

        {/* Menu Section */}
        <View style={styles.menuSection}>
          <TouchableOpacity style={styles.menuItem}>
            <Text style={styles.menuText}>Mes produits</Text>
            <Text style={styles.menuArrow}>›</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.menuItem}>
            <Text style={styles.menuText}>Historique des dons</Text>
            <Text style={styles.menuArrow}>›</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.menuItem}>
            <Text style={styles.menuText}>Paramètres</Text>
            <Text style={styles.menuArrow}>›</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.menuItem}>
            <Text style={styles.menuText}>Aide et support</Text>
            <Text style={styles.menuArrow}>›</Text>
          </TouchableOpacity>
        </View>

        {/* Logout Button */}
        <TouchableOpacity
          style={styles.logoutButton}
          onPress={() => console.log('Déconnexion')}
        >
          <Text style={styles.logoutText}>Déconnexion</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white || '#F5F5F5',
  },
  avatarSection: {
    alignItems: 'center',
    padding: 30,
    backgroundColor: 'white',
    marginBottom: 20,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: colors.primary || '#27AE60',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  avatarImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 16,
    overflow: 'hidden',
  },
  avatarText: {
    fontSize: 36,
    fontWeight: 'bold',
    color: 'white',
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2C3E50',
    marginBottom: 4,
  },
  email: {
    fontSize: 14,
    color: '#7F8C8D',
  },
  statsSection: {
    flexDirection: 'row',
    backgroundColor: 'white',
    padding: 20,
    marginBottom: 20,
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.primary || '#27AE60',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#7F8C8D',
    textAlign: 'center',
  },
  statDivider: {
    width: 1,
    height: 40,
    backgroundColor: '#E0E0E0',
  },
  menuSection: {
    backgroundColor: 'white',
    marginBottom: 20,
  },
  menuItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  menuText: {
    fontSize: 16,
    color: '#2C3E50',
  },
  menuArrow: {
    fontSize: 24,
    color: '#BDC3C7',
    fontWeight: '300',
  },
  logoutButton: {
    backgroundColor: 'white',
    margin: 20,
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#E74C3C',
  },
  logoutText: {
    color: '#E74C3C',
    fontSize: 16,
    fontWeight: 'bold',
  },
  favoritesSection: {
    backgroundColor: 'white',
    padding: 20,
    marginBottom: 20,
  },
  favoritesSectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2C3E50',
    marginBottom: 12,
  },
  favoriteItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  favoriteItemName: {
    fontSize: 14,
    color: '#2C3E50',
  },
  favoriteItemPrice: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.primary || '#27AE60',
  },
  favoritesMore: {
    marginTop: 8,
    fontSize: 12,
    color: '#7F8C8D',
    fontStyle: 'italic',
  },
});
