import React, { useState } from 'react';
import { useAuth } from '../src/contexts/AuthContext';
import { Redirect } from 'expo-router';
import { ChatPage } from '../src/components/ChatPage';

export default function Chat() {
  const { user, loading } = useAuth();
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return <Redirect href="/" />;
  }

  const handleToggleProfileMenu = () => {
    setShowProfileMenu(!showProfileMenu);
  };

  return (
    <ChatPage
      showProfileMenu={showProfileMenu}
      onToggleProfileMenu={handleToggleProfileMenu}
    />
  );
}