import React, { useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { BrowserRouter as Router, Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { LoginForm } from './components/auth/LoginForm';
import { SignUpForm } from './components/auth/SignUpForm';
import { ChatPage } from './components/ChatPage';
import { useAuth } from './contexts/AuthContext';
import '../global.css';

console.log('App starting with holistic auth routing...');

// ChatPage with profile menu state management
function ChatPageWithMenu() {
  const [showProfileMenu, setShowProfileMenu] = React.useState(false);
  
  console.log('Profile menu state:', showProfileMenu);
  
  return (
    <ChatPage
      showProfileMenu={showProfileMenu}
      onToggleProfileMenu={() => {
        console.log('Profile menu toggle clicked, current state:', showProfileMenu);
        setShowProfileMenu(!showProfileMenu);
      }}
    />
  );
}

// Holistic authentication router that monitors auth state globally
function AuthenticatedRoutes() {
  const auth = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  
  useEffect(() => {
    if (!auth) {
      console.log('🔄 Auth context still loading...');
      return;
    }
    
    const currentPath = location.pathname;
    const isAuthenticatedRoute = currentPath === '/chat';
    const isPublicRoute = currentPath === '/' || currentPath === '/login' || currentPath === '/signup';
    
    console.log('🔍 Auth routing check:', {
      currentPath,
      isAuthenticated: !!auth.user,
      isAuthenticatedRoute,
      isPublicRoute
    });
    
    if (!auth.user && isAuthenticatedRoute) {
      console.log('🔄 Unauthenticated user on protected route, redirecting to /');
      navigate('/', { replace: true });
    } else if (auth.user && isPublicRoute) {
      console.log('✅ Authenticated user on public route, redirecting to /chat');
      navigate('/chat', { replace: true });
    }
  }, [auth, auth?.user, location.pathname, navigate]);
  
  // Show loading while auth context initializes
  if (!auth) {
    return (
      <View style={styles.page}>
        <Text style={styles.text}>Loading...</Text>
      </View>
    );
  }
  
  return (
    <Routes>
      <Route path="/" element={<LoginPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/signup" element={<SignUpPage />} />
      <Route path="/chat" element={<ChatPageWithMenu />} />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}

function App() {
  console.log('App component rendering');

  return (
    <AuthProvider>
      <Router>
        <View style={styles.container}>
          <AuthenticatedRoutes />
        </View>
      </Router>
    </AuthProvider>
  );
}

function LoginPage() {
  return (
    <View style={styles.page}>
      <LoginForm />
    </View>
  );
}

function SignUpPage() {
  return (
    <View style={styles.page}>
      <SignUpForm />
    </View>
  );
}

function NotFoundPage() {
  return (
    <View style={styles.page}>
      <Text style={styles.text}>Page not found</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  page: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    fontSize: 18,
    color: '#333',
  },
});

export default App;