import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, FlatList, TextInput, TouchableOpacity, Alert } from 'react-native';
import { getDbConnection, addAuditLog } from '../services/database';
import { useFocusEffect } from '@react-navigation/native';

export default function AccountsListScreen({ navigation }: any) {
  const [accounts, setAccounts] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState('');

  const fetchAccounts = async () => {
    try {
      const db = await getDbConnection();
      let query = 'SELECT * FROM accounts';
      let params: any[] = [];
      if (searchQuery.trim()) {
        query += ' WHERE display_name LIKE ? OR email LIKE ? OR category LIKE ?';
        const likeQuery = `%${searchQuery}%`;
        params = [likeQuery, likeQuery, likeQuery];
      }
      query += ' ORDER BY id DESC;';
      const res = await db.getAllAsync(query, params);
      setAccounts(res);
    } catch (e) {
      console.error(e);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchAccounts();
    }, [searchQuery])
  );

  const handleDelete = (id: number, email: string) => {
    Alert.alert('تأكيد الحذف', `هل أنت متأكد من حذف الحساب ${email}؟`, [
      { text: 'إلغاء', style: 'cancel' },
      {
        text: 'حذف',
        style: 'destructive',
        onPress: async () => {
          try {
            const db = await getDbConnection();
            await db.runAsync('DELETE FROM accounts WHERE id = ?;', [id]);
            await addAuditLog('حذف حساب', `تم حذف الحساب: ${email}`);
            fetchAccounts();
          } catch (e) {
            console.error(e);
          }
        }
      }
    ]);
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.searchInput}
        placeholder="ابحث بالاسم، البريد أو التصنيف..."
        value={searchQuery}
        onChangeText={setSearchQuery}
        textAlign="right"
      />

      <FlatList
        data={accounts}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <TouchableOpacity 
              style={{ flex: 1 }}
              onPress={() => navigation.navigate('AccountDetail', { accountId: item.id })}
            >
              <Text style={styles.name}>{item.display_name}</Text>
              <Text style={styles.email}>{item.email}</Text>
              <Text style={styles.category}>التصنيف: {item.category}</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.deleteBtn}
              onPress={() => handleDelete(item.id, item.email)}
            >
              <Text style={styles.deleteText}>حذف</Text>
            </TouchableOpacity>
          </View>
        )}
        ListEmptyComponent={<Text style={styles.empty}>لا توجد حسابات مطابقة.</Text>}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F4F6F8', padding: 16 },
  searchInput: { backgroundColor: '#FFF', borderWidth: 1, borderColor: '#D1D5DB', borderRadius: 8, padding: 12, marginBottom: 16, fontSize: 14 },
  card: { backgroundColor: '#FFF', borderRadius: 8, padding: 16, marginBottom: 12, flexDirection: 'row-reverse', justifyContent: 'space-between', alignItems: 'center', shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 2, elevation: 2 },
  name: { fontSize: 16, fontWeight: 'bold', color: '#1F2937', textAlign: 'right' },
  email: { fontSize: 13, color: '#6B7280', textAlign: 'right', marginTop: 2 },
  category: { fontSize: 11, color: '#2563EB', textAlign: 'right', marginTop: 4 },
  deleteBtn: { backgroundColor: '#FEE2E2', paddingHorizontal: 12, paddingVertical: 8, borderRadius: 6 },
  deleteText: { color: '#DC2626', fontSize: 12, fontWeight: 'bold' },
  empty: { textAlign: 'center', color: '#9CA3AF', marginTop: 40 }
});
