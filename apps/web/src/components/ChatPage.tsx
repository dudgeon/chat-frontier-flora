import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useAuth } from '../contexts/AuthContext';

interface ChatPageProps {
  showProfileMenu?: boolean;
  onToggleProfileMenu?: () => void;
}

export const ChatPage: React.FC<ChatPageProps> = ({
  showProfileMenu = false,
  onToggleProfileMenu
}) => {
  const { user, signOut } = useAuth();

  const handleLogout = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <View style={styles.container}>
      {/* Main Chat Area */}
      <View style={styles.chatContainer}>
        <View style={styles.header}>
          <Text style={styles.title}>Frontier.Family</Text>
          <TouchableOpacity
            style={styles.profileButton}
            onPress={onToggleProfileMenu}
            testID="profile-menu-toggle"
          >
            <Text style={styles.profileButtonText}>☰</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.comingSoonContainer}>
          <Text style={styles.comingSoonTitle}>Chat Feature Coming Soon!</Text>
          <Text style={styles.comingSoonText}>
            We're working hard to bring you an amazing chat experience.
          </Text>
          <Text style={styles.userWelcome}>
            Welcome, {user?.email || 'User'}!
          </Text>
        </View>
      </View>

      {/* Profile Menu - Right Sidebar */}
      {showProfileMenu && (
        <>
          {/* Overlay for mobile */}
          <TouchableOpacity
            style={styles.overlay}
            onPress={onToggleProfileMenu}
            testID="profile-menu-overlay"
          />

          {/* Profile Menu */}
          <View style={styles.profileMenu} testID="profile-menu">
            <View style={styles.profileHeader}>
              <Text style={styles.profileTitle}>Profile</Text>
              <TouchableOpacity
                onPress={onToggleProfileMenu}
                style={styles.closeButton}
                testID="profile-menu-close"
              >
                <Text style={styles.closeButtonText}>×</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.profileContent}>
              <View style={styles.userInfo}>
                <Text style={styles.userEmail}>{user?.email}</Text>
                <Text style={styles.userLabel}>Email</Text>
              </View>

              <View style={styles.menuSection}>
                <Text style={styles.sectionTitle}>Account</Text>
                <TouchableOpacity style={styles.menuItem}>
                  <Text style={styles.menuItemText}>Settings</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.menuItem}>
                  <Text style={styles.menuItemText}>Preferences</Text>
                </TouchableOpacity>
              </View>

              <View style={styles.menuSection}>
                <TouchableOpacity
                  style={[styles.menuItem, styles.logoutButton]}
                  onPress={handleLogout}
                  testID="logout-button"
                >
                  <Text style={styles.logoutText}>Sign Out</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: '#f5f5f5',
  },
  chatContainer: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
    backgroundColor: '#ffffff',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333333',
  },
  profileButton: {
    padding: 8,
    borderRadius: 4,
    backgroundColor: '#f0f0f0',
  },
  profileButtonText: {
    fontSize: 18,
    color: '#666666',
  },
  comingSoonContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  comingSoonTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#0056b3',
    marginBottom: 16,
    textAlign: 'center',
  },
  comingSoonText: {
    fontSize: 16,
    color: '#666666',
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 24,
  },
  userWelcome: {
    fontSize: 14,
    color: '#888888',
    textAlign: 'center',
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    zIndex: 1,
  },
  profileMenu: {
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    width: 300,
    backgroundColor: '#ffffff',
    borderLeftWidth: 1,
    borderLeftColor: '#e0e0e0',
    zIndex: 2,
    shadowColor: '#000',
    shadowOffset: { width: -2, height: 0 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  profileHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  profileTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333333',
  },
  closeButton: {
    padding: 4,
  },
  closeButtonText: {
    fontSize: 24,
    color: '#666666',
  },
  profileContent: {
    flex: 1,
    padding: 16,
  },
  userInfo: {
    marginBottom: 24,
    padding: 16,
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
  },
  userEmail: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333333',
    marginBottom: 4,
  },
  userLabel: {
    fontSize: 12,
    color: '#666666',
    textTransform: 'uppercase',
  },
  menuSection: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666666',
    marginBottom: 12,
    textTransform: 'uppercase',
  },
  menuItem: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 6,
    marginBottom: 4,
  },
  menuItemText: {
    fontSize: 16,
    color: '#333333',
  },
  logoutButton: {
    backgroundColor: '#dc3545',
    marginTop: 16,
  },
  logoutText: {
    fontSize: 16,
    color: '#ffffff',
    fontWeight: '500',
    textAlign: 'center',
  },
});
