import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useAuth } from '../contexts/AuthContext';

// Design system constants for consistent styling
const designSystem = {
  colors: {
    white: '#ffffff',
    gray50: '#f8f9fa',
    gray100: '#f5f5f5',
    gray200: '#e0e0e0',
    gray300: '#f0f0f0',
    gray500: '#666666',
    gray600: '#888888',
    gray700: '#333333',
    blue600: '#0056b3',
    red600: '#dc3545',
    overlayDark: 'rgba(0, 0, 0, 0.5)',
  },
  spacing: {
    1: 4,
    2: 8,
    3: 12,
    4: 16,
    6: 24,
    8: 32,
  },
  text: {
    xs: 12,
    sm: 14,
    base: 16,
    lg: 18,
    xl: 20,
    '2xl': 24,
  },
  radius: {
    sm: 4,
    md: 6,
    lg: 8,
  },

};

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
    <View style={{
      flex: 1,
      flexDirection: 'row',
      backgroundColor: designSystem.colors.gray100,
    }} testID="chat-page">
      {/* Main Chat Area */}
      <View style={{
        flex: 1,
        backgroundColor: designSystem.colors.white,
      }}>
        <View style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: 16,
          borderBottomWidth: 1,
          borderBottomColor: designSystem.colors.gray200,
          backgroundColor: designSystem.colors.white,
        }}>
          <Text style={{
            fontSize: 20,
            fontWeight: 'bold' as const,
            color: designSystem.colors.gray700,
          }}>Frontier.Family</Text>
          <TouchableOpacity
            style={{
              padding: 8,
              borderRadius: 4,
              backgroundColor: designSystem.colors.gray300,
            }}
            onPress={onToggleProfileMenu}
            testID="profile-menu-button"
            accessibilityRole="button"
            accessibilityLabel="Open user profile menu"
            accessibilityHint="Opens the profile menu with account settings and logout option"
            aria-label="User profile menu"
            aria-expanded={showProfileMenu}
            aria-haspopup="menu"
          >
            <Text style={{
              fontSize: 18,
              color: designSystem.colors.gray500,
            }}>👤</Text>
          </TouchableOpacity>
        </View>

        <View style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          padding: 32,
        }}>
          <Text style={{
            fontSize: 24,
            fontWeight: 'bold' as const,
            color: designSystem.colors.blue600,
            marginBottom: 16,
            textAlign: 'center' as const,
          }}>Chat Feature Coming Soon!</Text>
          <Text style={{
            fontSize: 16,
            color: designSystem.colors.gray500,
            textAlign: 'center' as const,
            marginBottom: 24,
            lineHeight: 24,
          }}>
            We're working hard to bring you an amazing chat experience.
          </Text>
          <Text style={{
            fontSize: 14,
            color: designSystem.colors.gray600,
            textAlign: 'center' as const,
          }}>
            Welcome, {user?.email || 'User'}!
          </Text>
        </View>
      </View>

      {/* Profile Menu - Right Sidebar */}
      {showProfileMenu && (
        <>
          {/* Overlay for mobile */}
          <TouchableOpacity
            style={{
              position: 'absolute' as const,
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: designSystem.colors.overlayDark,
              zIndex: 1,
            }}
            onPress={onToggleProfileMenu}
            testID="profile-menu-overlay"
          />

          {/* Profile Menu */}
          <View
            className="shadow-sm"
            style={{
              position: 'absolute' as const,
              top: 0,
              right: 0,
              bottom: 0,
              width: 300,
              backgroundColor: designSystem.colors.white,
              borderLeftWidth: 1,
              borderLeftColor: designSystem.colors.gray200,
              zIndex: 2,
            }}
            testID="profile-menu"
          >
            <View style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: 16,
              borderBottomWidth: 1,
              borderBottomColor: designSystem.colors.gray200,
            }}>
              <Text style={{
                fontSize: 18,
                fontWeight: 'bold' as const,
                color: designSystem.colors.gray700,
              }}>Profile</Text>
              <TouchableOpacity
                onPress={onToggleProfileMenu}
                style={{
                  padding: 4,
                }}
                testID="profile-menu-close"
              >
                <Text style={{
                  fontSize: 24,
                  color: designSystem.colors.gray500,
                }}>×</Text>
              </TouchableOpacity>
            </View>

            <View style={{
              flex: 1,
              padding: 16,
            }}>
              <View style={{
                marginBottom: 24,
                padding: 16,
                backgroundColor: designSystem.colors.gray50,
                borderRadius: 8,
              }}>
                <Text style={{
                  fontSize: 16,
                  fontWeight: '500' as const,
                  color: designSystem.colors.gray700,
                  marginBottom: 4,
                }}>{user?.email}</Text>
                <Text style={{
                  fontSize: 12,
                  color: designSystem.colors.gray500,
                  textTransform: 'uppercase' as const,
                }}>Email</Text>
              </View>

              <View style={{
                marginBottom: 24,
              }}>
                <Text style={{
                  fontSize: 14,
                  fontWeight: '600' as const,
                  color: designSystem.colors.gray500,
                  marginBottom: 12,
                  textTransform: 'uppercase' as const,
                }}>Account</Text>
                <TouchableOpacity style={{
                  paddingVertical: 12,
                  paddingHorizontal: 16,
                  borderRadius: 6,
                  marginBottom: 4,
                }}>
                  <Text style={{
                    fontSize: 16,
                    color: designSystem.colors.gray700,
                  }}>Settings</Text>
                </TouchableOpacity>
                <TouchableOpacity style={{
                  paddingVertical: 12,
                  paddingHorizontal: 16,
                  borderRadius: 6,
                  marginBottom: 4,
                }}>
                  <Text style={{
                    fontSize: 16,
                    color: designSystem.colors.gray700,
                  }}>Preferences</Text>
                </TouchableOpacity>
              </View>

              <View style={{
                marginBottom: 24,
              }}>
                <TouchableOpacity
                  style={{
                    paddingVertical: 12,
                    paddingHorizontal: 16,
                    borderRadius: 6,
                    marginBottom: 4,
                    backgroundColor: designSystem.colors.red600,
                    marginTop: 16,
                  }}
                  onPress={handleLogout}
                  testID="logout-button"
                >
                  <Text style={{
                    fontSize: 16,
                    color: designSystem.colors.white,
                    fontWeight: '500' as const,
                    textAlign: 'center' as const,
                  }}>Sign Out</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </>
      )}
    </View>
  );
};


