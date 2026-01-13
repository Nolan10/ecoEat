import {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signOut
} from 'firebase/auth';
import { auth } from './firebase';

// Interface AuthUser simplifiée pour l'application
export interface AuthUser {
    id: string;
    email: string;
}

/**
 * Créer un nouveau compte utilisateur
 * 
 * Sécurité : Firebase hash automatiquement le mot de passe (bcrypt)
 * Le mot de passe n'est jamais stocké en clair
 */
export async function register(email: string, password: string): Promise<AuthUser> {
    try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        return {
            id: user.uid,
            email: user.email || '',
        };
    } catch (error) {
        console.error('Erreur lors de l\'inscription:', error);
        throw error;
    }
}

/**
 * Se connecter avec email/password
 * 
 * Sécurité : Firebase génère automatiquement un token JWT sécurisé
 * Le token est utilisé pour authentifier les requêtes Firestore
 */
export async function login(email: string, password: string): Promise<AuthUser> {
    try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        return {
            id: user.uid,
            email: user.email || '',
        };
    } catch (error) {
        console.error('Erreur lors de la connexion:', error);
        throw error;
    }
}

/**
 * Se déconnecter
 * 
 * Sécurité : Invalide le token JWT et déconnecte la session
 */
export async function logout(): Promise<void> {
    try {
        await signOut(auth);
    } catch (error) {
        console.error('Erreur lors de la déconnexion:', error);
        throw error;
    }
}
