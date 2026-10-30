import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Alert, ScrollView } from 'react-native';
import { getDbConnection, addAuditLog } from '../services/database';

export default function AccountDetailScreen({ route, navigation }: any) {
  const { accountId } = route.params;
  const [account, setAccount] = useState<any>(null);
  const [notes, setNotes] = useState('');
  const [category, setCategory] = useState('');

  useEffect(() => {
    async function load() {
      const db = await getDbConnection();
      const acc: any = await db.getFirstAsync('SELECT * FROM accounts WHERE id = ?;', [accountId]);
      if (acc) {
        setAccount(acc);
        setNotes(acc.notes || '');
        setCategory(acc.category || '');
      }
    }
    load();
  }, [accountId]);

  const handleUpdate = async () => {
    try {
      const db = await getDbConnection();
      await db.runAsync(
        'UPDATE accounts SET notes = ?, category = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?;',
        [notes, category, accountId]
      );
      await addAuditLog('تعديل حساب', `تم تحديث بيانات الحساب: ${account.email}`);
      Alert.alert('نجاح', 'تم تحديث البيانات بنجاح');
    } catch (e) {
      console.error(e);
      Alert.alert('خطأ', 'فشل تحديث البيانات');
    }
  };

  if (!account) return <View style={styles.container}><Text>جاري التحميل...</Text></View>;

  return (
    <ScrollView style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.title}>{account.display_name}</Text>
        <Text style={styles.email}>{account.email}</Text>
        <Text style={styles.date}>تاريخ الإضافة: {account.created_at}</Text>
      </View>

      <Text style={styles.label}>التصنيف</Text>
      <TextInput
        style={styles.input}
        value={category}
        onChangeText={setCategory}
        textAlign="right"
      />

      <Text style={styles.label}>ملاحظات شخصية</Text>
      <TextInput
        style={[styles.input, styles.textArea]}
        value={notes}
        onChangeText={setNotes}
        multiline
        textAlign="right"
      />

      <TouchableOpacity style={styles.btn} onPress={handleUpdate}>
        <Text style={styles.btnText}>حفظ التعديلات</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F4F6F8', padding: 16 },
  card: { backgroundColor: '#FFF', padding: 16, borderRadius: 8, marginBottom: 20, alignItems: 'flex-end' },
  title: { fontSize: 18, fontWeight: 'bold', color: '#1F2937' },
  email: { fontSize: 14, color: '#6B7280', marginTop: 4 },
  date: { fontSize: 12, color: '#9CA3AF', marginTop: 8 },
  label: { fontSize: 14, fontWeight: 'bold', color: '#374151', marginBottom: 6, textAlign: 'right' },
  input: { backgroundColor: '#FFF', borderWidth: 1, borderColor: '#D1D5DB', borderRadius: 8, padding: 12, fontSize: 14, marginBottom: 16 },
  textArea: { height: 100, textAlignVertical: 'top' },
  btn: { backgroundColor: '#2563EB', padding: 14, borderRadius: 8, alignItems: 'center' },
  btnText: { color: '#FFF', fontWeight: 'bold', fontSize: 15 }
});
