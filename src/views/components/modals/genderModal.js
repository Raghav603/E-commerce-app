import React, { useEffect, useState } from 'react';
import { View, Text, Modal, TouchableOpacity, StyleSheet } from 'react-native';

const GENDERS = ['Man', 'Woman', 'Boy', 'Girl'];

export default function GenderModal({ visible, onClose, selectedGender, onApply, theme }) {
  const isDark = theme === 'dark';
  const bgColor = isDark ? '#1A1A1A' : '#FFFFFF';
  const textColor = isDark ? '#FFFFFF' : '#333333';
  const borderColor = isDark ? '#333333' : '#E0E0E0';
  const activeColor = '#90248A';

  const [tempGender, setTempGender] = useState('');

  useEffect(() => {
    if (visible) setTempGender(selectedGender || '');
  }, [visible, selectedGender]);

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <View style={styles.modalOverlay}>
        <View style={[styles.modalContent, { backgroundColor: bgColor }]}>
          <View style={[styles.header, { borderBottomColor: borderColor }]}>
            <Text style={[styles.title, { color: textColor }]}>GENDER</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeBtn}><Text style={[styles.closeIcon, { color: textColor }]}>✕</Text></TouchableOpacity>
          </View>
          <View style={styles.list}>
            {GENDERS.map((gender) => {
              const isSelected = tempGender === gender;
              return (
                <TouchableOpacity key={gender} style={styles.optionRow} onPress={() => setTempGender(isSelected ? '' : gender)}>
                  <Text style={[styles.optionText, { color: textColor }]}>{gender}</Text>
                  <View style={[styles.radio, { borderColor: isSelected ? activeColor : '#757575' }]}>
                    {isSelected && <View style={[styles.radioInner, { backgroundColor: activeColor }]} />}
                  </View>
                </TouchableOpacity>
              );
            })}
          </View>
          <View style={[styles.footer, { borderTopColor: borderColor }]}>
            <TouchableOpacity style={styles.clearBtn} onPress={() => setTempGender('')}><Text style={[styles.clearText, { color: textColor }]}>Clear</Text></TouchableOpacity>
            <TouchableOpacity style={[styles.applyBtn, { backgroundColor: activeColor }]} onPress={() => onApply(tempGender)}><Text style={styles.applyText}>Apply</Text></TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
  modalContent: { borderTopLeftRadius: 16, borderTopRightRadius: 16 },
  header: { flexDirection: 'row', justifyContent: 'space-between', padding: 16, borderBottomWidth: 1 },
  title: { fontSize: 14, fontWeight: '700' },
  closeBtn: { padding: 4 },
  closeIcon: { fontSize: 18 },
  list: { padding: 16 },
  optionRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 14 },
  optionText: { fontSize: 15 },
  radio: { width: 20, height: 20, borderRadius: 10, borderWidth: 2, justifyContent: 'center', alignItems: 'center' },
  radioInner: { width: 10, height: 10, borderRadius: 5 },
  footer: { flexDirection: 'row', padding: 16, borderTopWidth: 1 },
  clearBtn: { flex: 1, alignItems: 'center', paddingVertical: 12 },
  clearText: { fontSize: 15, fontWeight: '600' },
  applyBtn: { flex: 1, alignItems: 'center', paddingVertical: 12, borderRadius: 8, marginLeft: 10 },
  applyText: { color: '#FFF', fontSize: 15, fontWeight: '700' },
});