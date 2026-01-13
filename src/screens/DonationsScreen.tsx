import { colors } from '@/src/theme/colors';
import React, { useState } from 'react';
import { Alert, FlatList, StyleSheet, Text, TouchableOpacity, View, Modal, TextInput, ScrollView, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useProducts } from '@/src/hooks/useProducts';
import type { Product, ProductRequest, WasteRisk } from '@/src/services/productsService';

export default function DonationsScreen() {
  const { products, loading, createProduct, updateProduct, deleteProduct, markProductAsDonation } = useProducts();
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  
  // États du formulaire
  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [formData, setFormData] = useState<ProductRequest>({
    name: '',
    price: '',
    expiryDate: '',
    wasteRisk: 'low',
    isDonation: false,
  });

  // Réinitialiser le formulaire
  const resetForm = () => {
    setFormData({
      name: '',
      price: '',
      expiryDate: '',
      wasteRisk: 'low',
      isDonation: false,
    });
    setEditingProduct(null);
    setShowModal(false);
  };

  // Ouvrir le formulaire en mode création
  const openCreateForm = () => {
    resetForm();
    setShowModal(true);
  };

  // Ouvrir le formulaire en mode édition
  const openEditForm = (product: Product) => {
    setFormData({
      name: product.name,
      price: product.price,
      expiryDate: product.expiryDate,
      wasteRisk: product.wasteRisk,
      isDonation: product.isDonation || false,
    });
    setEditingProduct(product);
    setShowModal(true);
  };

  // Soumettre le formulaire (création ou modification)
  const handleSubmit = async () => {
    // Validation
    if (!formData.name.trim() || !formData.price.trim() || !formData.expiryDate.trim()) {
      Alert.alert('Erreur', 'Veuillez remplir tous les champs obligatoires');
      return;
    }

    try {
      if (editingProduct) {
        // Mode édition
        await updateProduct(editingProduct.id, formData);
        Alert.alert('Succès', 'Produit modifié avec succès');
      } else {
        // Mode création
        await createProduct(formData);
        Alert.alert('Succès', 'Produit créé avec succès');
      }
      resetForm();
    } catch (error) {
      Alert.alert('Erreur', error instanceof Error ? error.message : 'Impossible de sauvegarder le produit');
    }
  };

  // Supprimer un produit
  const handleDelete = (product: Product) => {
    Alert.alert(
      'Confirmation',
      `Voulez-vous vraiment supprimer "${product.name}" ?`,
      [
        { text: 'Annuler', style: 'cancel' },
        {
          text: 'Supprimer',
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteProduct(product.id);
              Alert.alert('Succès', 'Produit supprimé');
            } catch (error) {
              console.error('Delete error:', error);
              Alert.alert('Erreur', 'Impossible de supprimer le produit');
            }
          },
        },
      ]
    );
  };

  // Marquer/démarquer comme don
  const handleToggleDonation = async (product: Product) => {
    const newStatus = !product.isDonation;
    try {
      await markProductAsDonation(product.id, newStatus);
      Alert.alert('Succès', newStatus ? 'Produit marqué comme don' : 'Produit retiré des dons');
    } catch (error) {
      console.error('Toggle donation error:', error);
      Alert.alert('Erreur', 'Impossible de modifier le statut');
    }
  };

  const toggleSelection = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const renderItem = ({ item }: { item: Product }) => {
    const isSelected = selectedIds.includes(item.id);
    
    return (
      <View style={styles.card}>
        <TouchableOpacity
          style={styles.cardContent}
          activeOpacity={0.7}
          onPress={() => toggleSelection(item.id)}
        >
          <View style={[styles.checkbox, isSelected && styles.checkboxSelected]}>
            {isSelected && <View style={styles.checkboxInner} />}
          </View>
          <View style={styles.productInfo}>
            <Text style={styles.name}>{item.name}</Text>
            <Text style={styles.price}>{item.isDonation ? 'Gratuit' : item.price}</Text>
            <Text style={styles.expiry}>Expire: {item.expiryDate}</Text>
            {item.isDonation && <Text style={styles.donationBadge}>🎁 En don</Text>}
          </View>
        </TouchableOpacity>
        
        {/* Boutons d'action */}
        <View style={styles.actions}>
          <TouchableOpacity 
            style={styles.actionButton} 
            onPress={() => openEditForm(item)}
          >
            <Text style={styles.actionButtonText}>✏️ Modifier</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.actionButton, item.isDonation && styles.actionButtonDonation]} 
            onPress={() => handleToggleDonation(item)}
          >
            <Text style={styles.actionButtonText}>🎁 {item.isDonation ? 'Retirer' : 'Don'}</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.actionButton, styles.actionButtonDelete]} 
            onPress={() => handleDelete(item)}
          >
            <Text style={styles.actionButtonText}>🗑️</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  const selectedProducts = products.filter((p) => selectedIds.includes(p.id));
  const totalValue = selectedProducts.reduce((sum, p) => {
    const price = p.isDonation ? 0 : parseFloat(p.price.replace('€', ''));
    return sum + price;
  }, 0);

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
        <Text style={styles.headerTitle}>Gestion des Produits</Text>
        <Text style={styles.headerSubtitle}>Créer, modifier et gérer les produits</Text>
      </View>

      {/* Bouton d'ajout */}
      <TouchableOpacity style={styles.addButton} onPress={openCreateForm}>
        <Text style={styles.addButtonText}>➕ Ajouter un produit</Text>
      </TouchableOpacity>

      {/* Indicateur de chargement */}
      {loading && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary || '#27AE60'} />
          <Text style={styles.loadingText}>Chargement...</Text>
        </View>
      )}

      {/* Liste des produits */}
      {!loading && (
        <FlatList
          data={products}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>Aucun produit disponible</Text>
              <Text style={styles.emptySubtext}>Ajoutez votre premier produit !</Text>
            </View>
          }
        />
      )}

      {/* Footer avec sélection */}
      {selectedIds.length > 0 && (
        <View style={styles.footer}>
          <View style={styles.summary}>
            <Text style={styles.summaryText}>
              {selectedIds.length} produit{selectedIds.length > 1 ? 's' : ''} sélectionné{selectedIds.length > 1 ? 's' : ''}
            </Text>
            <Text style={styles.summaryValue}>Valeur: {totalValue.toFixed(2)}€</Text>
          </View>
          <TouchableOpacity
            style={styles.donateButton}
            onPress={confirmDonation}
          >
            <Text style={styles.donateButtonText}>Confirmer le don</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Modal de formulaire */}
      <Modal
        visible={showModal}
        animationType="slide"
        transparent={true}
        onRequestClose={resetForm}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <ScrollView showsVerticalScrollIndicator={false}>
              <Text style={styles.modalTitle}>
                {editingProduct ? 'Modifier le produit' : 'Nouveau produit'}
              </Text>

              {/* Nom */}
              <Text style={styles.label}>Nom du produit *</Text>
              <TextInput
                style={styles.input}
                value={formData.name}
                onChangeText={(text) => setFormData({ ...formData, name: text })}
                placeholder="Ex: Tomates Bio"
              />

              {/* Prix */}
              <Text style={styles.label}>Prix *</Text>
              <TextInput
                style={styles.input}
                value={formData.price}
                onChangeText={(text) => setFormData({ ...formData, price: text })}
                placeholder="Ex: 3.50€"
                keyboardType="default"
              />

              {/* Date d'expiration */}
              <Text style={styles.label}>Date d&apos;expiration (YYYY-MM-DD) *</Text>
              <TextInput
                style={styles.input}
                value={formData.expiryDate}
                onChangeText={(text) => setFormData({ ...formData, expiryDate: text })}
                placeholder="Ex: 2026-01-20"
              />

              {/* Risque de gaspillage */}
              <Text style={styles.label}>Risque de gaspillage</Text>
              <View style={styles.riskButtons}>
                {(['low', 'medium', 'high'] as WasteRisk[]).map((risk) => (
                  <TouchableOpacity
                    key={risk}
                    style={[
                      styles.riskButton,
                      formData.wasteRisk === risk && styles.riskButtonActive,
                    ]}
                    onPress={() => setFormData({ ...formData, wasteRisk: risk })}
                  >
                    <Text style={styles.riskButtonText}>
                      {risk === 'low' ? 'Faible' : risk === 'medium' ? 'Moyen' : 'Élevé'}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

              {/* Marquer comme don */}
              <TouchableOpacity
                style={styles.checkboxRow}
                onPress={() => setFormData({ ...formData, isDonation: !formData.isDonation })}
              >
                <View style={[styles.checkbox, formData.isDonation && styles.checkboxSelected]}>
                  {formData.isDonation && <View style={styles.checkboxInner} />}
                </View>
                <Text style={styles.checkboxLabel}>Marquer comme don (gratuit)</Text>
              </TouchableOpacity>

              {/* Boutons d'action */}
              <View style={styles.modalActions}>
                <TouchableOpacity style={styles.cancelButton} onPress={resetForm}>
                  <Text style={styles.cancelButtonText}>Annuler</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
                  <Text style={styles.submitButtonText}>
                    {editingProduct ? 'Modifier' : 'Créer'}
                  </Text>
                </TouchableOpacity>
              </View>
            </ScrollView>
          </View>
        </View>
      </Modal>
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
  addButton: {
    backgroundColor: colors.primary || '#27AE60',
    margin: 12,
    padding: 14,
    borderRadius: 8,
    alignItems: 'center',
  },
  addButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#7F8C8D',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#7F8C8D',
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#BDC3C7',
  },
  actions: {
    flexDirection: 'row',
    marginTop: 12,
    gap: 8,
  },
  actionButton: {
    flex: 1,
    backgroundColor: '#ECF0F1',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 6,
    alignItems: 'center',
  },
  actionButtonDonation: {
    backgroundColor: '#E8F8F5',
  },
  actionButtonDelete: {
    backgroundColor: '#FFEBEE',
  },
  actionButtonText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#2C3E50',
  },
  donationBadge: {
    fontSize: 11,
    color: '#E74C3C',
    fontWeight: 'bold',
    marginTop: 4,
  },
  checkboxSelected: {
    backgroundColor: '#E8F8F5',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: 'white',
    width: '90%',
    maxHeight: '80%',
    borderRadius: 12,
    padding: 20,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#2C3E50',
    marginBottom: 20,
    textAlign: 'center',
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#2C3E50',
    marginBottom: 6,
    marginTop: 12,
  },
  input: {
    backgroundColor: '#F5F5F5',
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
  },
  riskButtons: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 8,
  },
  riskButton: {
    flex: 1,
    backgroundColor: '#F5F5F5',
    padding: 10,
    borderRadius: 8,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  riskButtonActive: {
    backgroundColor: '#E8F8F5',
    borderColor: colors.primary || '#27AE60',
  },
  riskButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#2C3E50',
  },
  checkboxRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 16,
  },
  checkboxLabel: {
    fontSize: 15,
    color: '#2C3E50',
    marginLeft: 8,
  },
  modalActions: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 24,
  },
  cancelButton: {
    flex: 1,
    backgroundColor: '#ECF0F1',
    padding: 14,
    borderRadius: 8,
    alignItems: 'center',
  },
  cancelButtonText: {
    color: '#7F8C8D',
    fontSize: 16,
    fontWeight: '600',
  },
  submitButton: {
    flex: 1,
    backgroundColor: colors.primary || '#27AE60',
    padding: 14,
    borderRadius: 8,
    alignItems: 'center',
  },
  submitButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
