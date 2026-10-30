import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

import DashboardScreen from '../screens/DashboardScreen';
import AddAccountScreen from '../screens/AddAccountScreen';
import AccountsListScreen from '../screens/AccountsListScreen';
import AccountDetailScreen from '../screens/AccountDetailScreen';
import PlatformLinksScreen from '../screens/PlatformLinksScreen';
import SecuritySettingsScreen from '../screens/SecuritySettingsScreen';

const Stack = createStackNavigator();

export default function AppNavigator() {
  return (
    <Stack.Navigator 
      initialRouteName="Dashboard"
      screenOptions={{ 
        headerTitleAlign: 'center',
        headerStyle: { backgroundColor: '#2563EB' },
        headerTintColor: '#fff',
        headerTitleStyle: { fontWeight: 'bold' }
      }}
    >
      <Stack.Screen name="Dashboard" component={DashboardScreen} options={{ title: 'مدير حساباتي' }} />
      <Stack.Screen name="AddAccount" component={AddAccountScreen} options={{ title: 'إضافة حساب جديد' }} />
      <Stack.Screen name="AccountsList" component={AccountsListScreen} options={{ title: 'قائمة الحسابات' }} />
      <Stack.Screen name="AccountDetail" component={AccountDetailScreen} options={{ title: 'تفاصيل الحساب' }} />
      <Stack.Screen name="PlatformLinks" component={PlatformLinksScreen} options={{ title: 'ربط التطبيقات والمنصات' }} />
      <Stack.Screen name="SecuritySettings" component={SecuritySettingsScreen} options={{ title: 'الأمان والخصوصية' }} />
    </Stack.Navigator>
  );
}
