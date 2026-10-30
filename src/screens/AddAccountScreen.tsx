import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Alert, ScrollView } from 'react-native';
import { getDbConnection, addAuditLog } from '../services/database';

export default function AddAccountScreen({ navigation }: any) {
  const [displayName, setDisplayName] = useState('');
  const [email, setEmail] = useState('');
  const [category, setCategory] = useState('شخصي');
  const [notes, setNotes] = useState('');

  const handleSaveAccount = async () => {
    if (!displayName.trim() || !email.trim()) {
      Alert.alert('خطأ', 'يرجى إدخال اسم العرض والبريد الإلكتروني على الأقل.');
      return;
    }

    try {
      const db = await getDbConnection();
      await db.runAsync(
        `INSERT INTO accounts (display_name, email, category, notes) VALUES (?, ?, ?, ?);`,
        [displayName, email, category, notes]
      );
      await addAuditLog('إضافة حساب', `تمت إضافة الحساب: ${email}`);
      Alert.alert('نجاح', 'تم حفظ الحساب محليًا بنجاح!', [
        { text: 'حسناً', onPress: () => navigation.goBack() }
      ]);
    } catch (error: any) {
      console.error(error);
      Alert.alert('خطأ في الحفظ', 'قد يكون البريد الإلكتروني مسجلاً مسبقاً أو حدث خطأ في قاعدة البيانات.');
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.label}>الاسم المعروض</Text>
      <TextInput
        style={styles.input}
        placeholder="مثال: يوسف أحمد"
        value={displayName}
        onChangeText={setDisplayName}
        textAlign="right"
      />

      <Text style={styles.label}>البريد الإلكتروني (Google)</Text>
      <TextInput
        style={styles.input}
        placeholder="example@gmail.com"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
        textAlign="right"
      />

      <Text style={styles.label}>التصنيف</Text>
      <TextInput
        style={styles.input}
        placeholder="شخصي / عمل / دراسة"
        value={category}
        onChangeText={setCategory}
        textAlign="right"
      />

      <Text style={styles.label}>ملاحظات شخصية</Text>
      <TextInput
        style={[styles.input, styles.textArea]}
        placeholder="ملاحظات حول هذا الحساب..."
        value={notes}
        onChangeText={setNotes}
        multiline
        textAlign="right"
      />

      <TouchableOpacity style={styles.saveButton} onPress={handleSaveAccount}>
        <Text style={styles.saveButtonText}>حفظ الحساب محلياً</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F4F6F8', padding: 16 },
  label: { fontSize: 14, fontWeight: 'bold', color: '#374151', marginBottom: 6, textAlign: 'right' },
  input: { backgroundColor: '#FFF', borderWidth: 1, borderColor: '#D1D5DB', borderRadius: 8, padding: 12, fontSize: 14, marginBottom: 16 },
  textArea: { height: 100, textAlignVertical: 'top' },
  saveButton: { backgroundColor: '#2563EB', padding: 16, borderRadius: 8, alignItems: 'center', marginTop: 10 },
  saveButtonText: { color: '#FFF', fontSize: 16, fontWeight: 'bold' }
});
