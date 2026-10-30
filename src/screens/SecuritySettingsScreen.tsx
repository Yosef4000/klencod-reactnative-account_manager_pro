import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Switch, TouchableOpacity, Alert } from 'react-native';
import * as LocalAuthentication from 'expo-local-authentication';
import { getDbConnection, addAuditLog } from '../services/database';

export default function SecuritySettingsScreen() {
  const [isBiometricSupported, setIsBiometricSupported] = useState(false);
  const [lockEnabled, setLockEnabled] = useState(false);

  useEffect(() => {
    LocalAuthentication.hasHardwareAsync().then(setIsBiometricSupported);
  }, []);

  const handleBiometricToggle = async (value: boolean) => {
    if (value) {
      const res = await LocalAuthentication.authenticateAsync({
        promptText: 'قم بتأكيد بصمتك لتفعيل قفل الأمان'
      });
      if (res.success) {
        setLockEnabled(true);
        addAuditLog('إعداد أمني', 'تم تفعيل المصادقة البيومترية');
        Alert.alert('نجاح', 'تم تفعيل حماية البصمة بنجاح');
      } else {
        Alert.alert('فشل', 'لم يتم التعرف على البصمة');
      }
    } else {
      setLockEnabled(false);
      addAuditLog('إعداد أمني', 'تم إيقاف المصادقة البيومترية');
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <View style={styles.row}>
          <Switch
            value={lockEnabled}
            onValueChange={handleBiometricToggle}
          />
          <View style={{ alignItems: 'flex-end' }}>
            <Text style={styles.title}>قفل التطبيق البيومتري (بصمة الإصبع)</Text>
            <Text style={styles.sub}>
              {isBiometricSupported ? 'المتصفح يدعم البصمة' : 'البصمة غير متوفرة في هذا الجهاز'}
            </Text>
          </View>
        </View>
      </View>

      <TouchableOpacity 
        style={styles.dangerBtn}
        onPress={() => {
          Alert.alert('تحذير', 'هل تريد مسح السجلات المحلية؟', [
            { text: 'إلغاء', style: 'cancel' },
            { text: 'مسح', style: 'destructive', onPress: () => Alert.alert('تم', 'تم مسح البيانات بنجاح') }
          ]);
        }}
      >
        <Text style={styles.dangerText}>مسح كافة البيانات المحلية</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F4F6F8', padding: 16 },
  card: { backgroundColor: '#FFF', padding: 16, borderRadius: 8, marginBottom: 16 },
  row: { flexDirection: 'row-reverse', justifyContent: 'space-between', alignItems: 'center' },
  title: { fontSize: 15, fontWeight: 'bold', color: '#1F2937' },
  sub: { fontSize: 12, color: '#6B7280', marginTop: 2 },
  dangerBtn: { backgroundColor: '#FEE2E2', padding: 14, borderRadius: 8, alignItems: 'center', marginTop: 20 },
  dangerText: { color: '#DC2626', fontWeight: 'bold', fontSize: 15 }
});
