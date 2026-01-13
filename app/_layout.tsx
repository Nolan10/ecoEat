import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack, useRouter, useSegments } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import { ActivityIndicator, View } from 'react-native';
import 'react-native-reanimated';

import { useColorScheme } from '@/hooks/use-color-scheme';
import { AppProvider } from '@/src/context/AppContext';
import { AuthProvider, useAuth } from '@/src/context/AuthContext';

export const unstable_settings = {
  anchor: '(tabs)',
};

function RootLayoutNav() {
  const { user, loading } = useAuth();
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    if (loading) return; // Attendre que l'état d'auth soit chargé

    const inAuthGroup = segments[0] === 'login' || segments[0] === 'register';

    // Routes publiques : ProductsScreen (index) et ProductDetailScreen
    // Routes protégées : DonationsScreen et ProfileScreen
    const isProtectedTab = segments[0] === '(tabs)' && (segments[1] === 'donations' || segments[1] === 'profile');

    const isPublicRoute =
      (segments[0] === '(tabs)' && !isProtectedTab) || // ProductsScreen (index) est public
      segments[0] === 'product' || // ProductDetailScreen est public
      inAuthGroup; // Login/Register sont publics par définition


    // Si non connecté et essaie d'accéder à une route privée → rediriger vers login
    if (!user && !isPublicRoute) {
      // Rediriger vers login seulement si on n'est pas déjà dessus (inAuthGroup gère déjà ça mais sécurité)
      router.replace('/login');
    }
    // Si connecté et sur page de login/register → rediriger vers l'app (accueil)
    else if (user && inAuthGroup) {
      router.replace('/(tabs)');
    }
  }, [user, loading, segments]);

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <Stack>
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen name="product/[id]" options={{ title: 'Détails du produit' }} />
      <Stack.Screen name="modal" options={{ presentation: 'modal', title: 'Modal' }} />
      <Stack.Screen name="login" options={{ headerShown: false }} />
      <Stack.Screen name="register" options={{ headerShown: false }} />
    </Stack>
  );
}

export default function RootLayout() {
  const colorScheme = useColorScheme();

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <AuthProvider>
        <AppProvider>
          <RootLayoutNav />
        </AppProvider>
      </AuthProvider>
      <StatusBar style="auto" />
    </ThemeProvider>
  );
}
