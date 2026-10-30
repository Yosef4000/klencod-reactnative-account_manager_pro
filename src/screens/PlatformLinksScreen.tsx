import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, FlatList, TextInput, TouchableOpacity, Alert } from 'react-native';
import { getDbConnection, addAuditLog } from '../services/database';
import { useFocusEffect } from '@react-navigation/native';

export default function PlatformLinksScreen() {
  const [links, setLinks] = useState<any[]>([]);
  const [platformName, setPlatformName] = useState('');
  const [accountId, setAccountId] = useState('1');

  const loadLinks = async () => {
    try {
      const db = await getDbConnection();
      const res = await db.getAllAsync(`
        SELECT platform_links.*, accounts.email 
        FROM platform_links 
        JOIN accounts ON platform_links.account_id = accounts.id;
      `);
      setLinks(res);
    } catch (e) {
      console.error(e);
    }
  };

  useFocusEffect(
    useCallback(() => {
      loadLinks();
    }, [])
  );

  const handleAddLink = async () => {
    if (!platformName.trim()) {
      Alert.alert('خطأ', 'يرجى إدخال اسم المنصة أو التطبيق (مثل Oya Live)');
      return;
    }
    try {
      const db = await getDbConnection();
      await db.runAsync(
        'INSERT INTO platform_links (account_id, platform_name, local_status) VALUES (?, ?, ?);',
        [parseInt(accountId) || 1, platformName, 'مرتبط محلياً']
      );
      await addAuditLog('ربط منصة', `تم ربط المنصة: ${platformName}`);
      setPlatformName('');
      loadLinks();
      Alert.alert('نجاح', 'تم إضافة رابط المنصة بنجاح');
    } catch (e) {
      console.error(e);
      Alert.alert('خطأ', 'تأكد من وجود حساب مضاف برقم المعرف المحدد.');
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.headerTitle}>إضافة ارتباط بمنصة خارجية</Text>
        <TextInput
          style={styles.input}
          placeholder="معرف الحساب المحلي (ID)"
          value={accountId}
          onChangeText={setAccountId}
          keyboardType="numeric"
          textAlign="right"
        />
        <TextInput
          style={styles.input}
          placeholder="اسم المنصة (مثل Oya Live)"
          value={platformName}
          onChangeText={setPlatformName}
          textAlign="right"
        />
        <TouchableOpacity style={styles.btn} onPress={handleAddLink}>
          <Text style={styles.btnText}>إضافة الارتباط</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.listTitle}>المنصات المرتبطة محلياً:</Text>
      <FlatList
        data={links}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.itemCard}>
            <Text style={styles.platform}>{item.platform_name}</Text>
            <Text style={styles.accEmail}>الحساب: {item.email}</Text>
            <Text style={styles.status}>{item.local_status}</Text>
          </View>
        )}
        ListEmptyComponent={<Text style={styles.empty}>لا توجد روابط مسجلة.</Text>}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F4F6F8', padding: 16 },
  card: { backgroundColor: '#FFF', padding: 16, borderRadius: 8, marginBottom: 20 },
  headerTitle: { fontSize: 16, fontWeight: 'bold', marginBottom: 12, textAlign: 'right', color: '#1F2937' },
  input: { backgroundColor: '#F9FAFB', borderWidth: 1, borderColor: '#D1D5DB', borderRadius: 8, padding: 10, marginBottom: 12, fontSize: 14 },
  btn: { backgroundColor: '#10B981', padding: 12, borderRadius: 8, alignItems: 'center' },
  btnText: { color: '#FFF', fontWeight: 'bold', fontSize: 14 },
  listTitle: { fontSize: 15, fontWeight: 'bold', marginBottom: 10, textAlign: 'right', color: '#374151' },
  itemCard: { backgroundColor: '#FFF', padding: 12, borderRadius: 8, marginBottom: 8, alignItems: 'flex-end' },
  platform: { fontWeight: 'bold', fontSize: 15, color: '#1F2937' },
  accEmail: { fontSize: 12, color: '#6B7280', marginTop: 2 },
  status: { fontSize: 11, color: '#10B981', marginTop: 4 },
  empty: { textAlign: 'center', color: '#9CA3AF', marginTop: 20 }
});
