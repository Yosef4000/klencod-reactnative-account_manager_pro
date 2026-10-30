import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, RefreshControl } from 'react-native';
import { getDbConnection } from '../services/database';
import { useFocusEffect } from '@react-navigation/native';

export default function DashboardScreen({ navigation }: any) {
  const [accountCount, setAccountCount] = useState<number>(0);
  const [recentAccounts, setRecentAccounts] = useState<any[]>([]);
  const [refreshing, setRefreshing] = useState(false);

  const loadData = async () => {
    try {
      const db = await getDbConnection();
      const countRes: any = await db.getFirstAsync('SELECT COUNT(*) as total FROM accounts;');
      setAccountCount(countRes?.total || 0);

      const recentRes = await db.getAllAsync('SELECT * FROM accounts ORDER BY id DESC LIMIT 5;');
      setRecentAccounts(recentRes);
    } catch (e) {
      console.error(e);
    }
  };

  useFocusEffect(
    useCallback(() => {
      loadData();
    }, [])
  );

  const onRefresh = async () => {
    setRefreshing(true);
    await loadData();
    setRefreshing(false);
  };

  return (
    <ScrollView 
      style={styles.container}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
    >
      <View style={styles.header}>
        <Text style={styles.title}>مدير حساباتي</Text>
        <Text style={styles.subtitle}>إدارة آمنة ومحلية لحسابات Google المتعددة</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>إجمالي الحسابات المحفوظة</Text>
        <Text style={styles.countText}>{accountCount}</Text>
      </View>

      <View style={styles.actionsContainer}>
        <TouchableOpacity 
          style={styles.primaryButton}
          onPress={() => navigation.navigate('AddAccount')}
        >
          <Text style={styles.buttonText}>+ إضافة حساب Google جديد</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.secondaryButton}
          onPress={() => navigation.navigate('AccountsList')}
        >
          <Text style={styles.secondaryButtonText}>عرض قائمة الحسابات</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>آخر الحسابات المضافة</Text>
        {recentAccounts.length === 0 ? (
          <Text style={styles.emptyText}>لا توجد حسابات مضافة حتى الآن.</Text>
        ) : (
          recentAccounts.map((acc) => (
            <TouchableOpacity 
              key={acc.id} 
              style={styles.accountItem}
              onPress={() => navigation.navigate('AccountDetail', { accountId: acc.id })}
            >
              <Text style={styles.accName}>{acc.display_name}</Text>
              <Text style={styles.accEmail}>{acc.email}</Text>
            </TouchableOpacity>
          ))
        )}
      </View>

      <View style={styles.footerNav}>
        <TouchableOpacity onPress={() => navigation.navigate('PlatformLinks')}>
          <Text style={styles.linkText}>ربط التطبيقات والمنصات</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate('SecuritySettings')}>
          <Text style={styles.linkText}>إعدادات الأمان والتشفير</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F4F6F8', padding: 16 },
  header: { marginTop: 10, marginBottom: 16, alignItems: 'flex-end' },
  title: { fontSize: 24, fontWeight: 'bold', color: '#1F2937' },
  subtitle: { fontSize: 13, color: '#6B7280', marginTop: 4 },
  card: { backgroundColor: '#2563EB', padding: 20, borderRadius: 12, alignItems: 'center', marginBottom: 16 },
  cardTitle: { color: '#E0E7FF', fontSize: 14 },
  countText: { color: '#FFFFFF', fontSize: 36, fontWeight: 'bold', marginTop: 6 },
  actionsContainer: { marginBottom: 20, gap: 10 },
  primaryButton: { backgroundColor: '#10B981', padding: 14, borderRadius: 8, alignItems: 'center' },
  buttonText: { color: '#FFF', fontWeight: 'bold', fontSize: 15 },
  secondaryButton: { backgroundColor: '#FFFFFF', padding: 14, borderRadius: 8, alignItems: 'center', borderWidth: 1, borderColor: '#D1D5DB' },
  secondaryButtonText: { color: '#374151', fontWeight: 'bold', fontSize: 15 },
  section: { backgroundColor: '#FFF', padding: 16, borderRadius: 8, marginBottom: 16 },
  sectionTitle: { fontSize: 16, fontWeight: 'bold', marginBottom: 12, textAlign: 'right' },
  emptyText: { color: '#9CA3AF', textAlign: 'center', marginVertical: 10 },
  accountItem: { paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: '#F3F4F6', alignItems: 'flex-end' },
  accName: { fontWeight: 'bold', fontSize: 14, color: '#1F2937' },
  accEmail: { color: '#6B7280', fontSize: 12 },
  footerNav: { flexDirection: 'row-reverse', justifyContent: 'space-around', marginVertical: 20 },
  linkText: { color: '#2563EB', fontWeight: 'bold', fontSize: 13 }
});
