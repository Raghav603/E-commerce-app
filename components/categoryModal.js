import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  TouchableWithoutFeedback,
  StyleSheet,
  ScrollView,
} from 'react-native';

function getLabel(item) {
  if (typeof item === 'string') return item.replace(/-/g, ' ');
  return item?.name ?? 'Category';
}

function getSlug(item) {
  if (typeof item === 'string') return item;
  return item?.slug ?? item?.name?.toLowerCase() ?? '';
}

export default function CategoryModal({
  visible,
  onClose,
  categories,
  selectedCategory, // string slug
  onApply,
  theme,
}) {

  const isDark = theme === 'dark';
  const bgColor = isDark ? '#1A1A1A' : '#FFFFFF';
  const textColor = isDark ? '#FFFFFF' : '#333333';
  const borderColor = isDark ? '#333333' : '#E0E0E0';
  const activeColor = '#90248A';

  const [tempSelected, setTempSelected] = useState([]); // Array state

  // selectedCategory can be a string slug OR an array of slugs
  useEffect(() => {
    if (!visible) return;
    if (!selectedCategory || selectedCategory.length === 0) {
      setTempSelected([]);
    } else if (Array.isArray(selectedCategory)) {
      setTempSelected(selectedCategory);
    } else {
      setTempSelected([selectedCategory]);
    }
  }, [visible, selectedCategory]);



  const handleToggle = (slug) => {
    // 👈 Add or remove from the array
    setTempSelected((prev) =>
      prev.includes(slug) ? prev.filter((c) => c !== slug) : [...prev, slug]
    );
  };

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <TouchableOpacity style={styles.modalOverlay} activeOpacity={1} onPress={onClose}>
        <TouchableWithoutFeedback>
          <View style={[styles.modalContent, { backgroundColor: bgColor, maxHeight: '80%' }]}>
            <View style={[styles.modalHeader, { borderBottomColor: borderColor }]}>
            <View style={styles.titleRow}>
              <Text style={[styles.modalTitle, { color: textColor }]}>CATEGORIES</Text>
              {tempSelected.length > 0 && (
                <View style={[styles.countBadge, { backgroundColor: activeColor }]}>
                  <Text style={styles.countBadgeText}>{tempSelected.length}</Text>
                </View>
              )}
            </View>
              <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                <Text style={[styles.closeIcon, { color: textColor }]}>✕</Text>
              </TouchableOpacity>
            </View>

            <ScrollView contentContainerStyle={styles.scrollList}>
              {categories.map((item, index) => {
                const label = getLabel(item);
                const slug = getSlug(item);
                const isSelected = tempSelected.includes(slug); // 👈 Check array

                return (
                  <TouchableOpacity key={index} style={styles.optionRow} onPress={() => handleToggle(slug)}>
                    <Text style={[styles.optionText, { color: textColor }]}>{label}</Text>
                    
                    {/* 👈 Checkbox UI */}
                    <View style={[
                        styles.checkbox,
                        { borderColor: isSelected ? activeColor : '#757575' },
                        isSelected && { backgroundColor: activeColor },
                      ]}
                    >
                      {isSelected && <Text style={styles.checkmarkIcon}>✓</Text>}
                    </View>
                  </TouchableOpacity>
                );
              })}
            </ScrollView>

            <View style={[styles.modalFooter, { borderTopColor: borderColor }]}>
              <TouchableOpacity style={styles.clearButton} onPress={() => setTempSelected([])}>
                <Text style={[styles.clearButtonText, { color: textColor }]}>Clear All</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.applyButton, { backgroundColor: activeColor }]}
                onPress={() => onApply(tempSelected)}
              >
                <Text style={styles.applyButtonText}>Apply</Text>
              </TouchableOpacity>

            </View>
          </View>
        </TouchableWithoutFeedback>
      </TouchableOpacity>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0, 0, 0, 0.5)', justifyContent: 'flex-end' },
  modalContent: { borderTopLeftRadius: 16, borderTopRightRadius: 16, overflow: 'hidden' },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, paddingVertical: 16, borderBottomWidth: 1 },
  titleRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  modalTitle: { fontSize: 14, fontWeight: '700', letterSpacing: 1 },
  countBadge: { borderRadius: 10, minWidth: 20, height: 20, paddingHorizontal: 6, justifyContent: 'center', alignItems: 'center' },
  countBadgeText: { color: '#fff', fontSize: 11, fontWeight: '800' },
  closeButton: { padding: 4 },
  closeIcon: { fontSize: 18, fontWeight: '600' },
  scrollList: { paddingBottom: 20 },
  optionRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 16, paddingHorizontal: 20 },
  optionText: { fontSize: 15, fontWeight: '400', textTransform: 'capitalize' },
  
  // ─── Checkbox Styles ───
  checkbox: { width: 22, height: 22, borderRadius: 4, borderWidth: 2, justifyContent: 'center', alignItems: 'center' },
  checkmarkIcon: { color: '#FFF', fontSize: 14, fontWeight: 'bold', marginTop: -2 },

  modalFooter: { flexDirection: 'row', padding: 16, borderTopWidth: 1, justifyContent: 'space-between', alignItems: 'center' },
  clearButton: { flex: 1, paddingVertical: 12, alignItems: 'center' },
  clearButtonText: { fontSize: 15, fontWeight: '600' },
  applyButton: { flex: 1, paddingVertical: 12, alignItems: 'center', borderRadius: 8, marginLeft: 10 },
  applyButtonText: { color: '#FFF', fontSize: 15, fontWeight: '700' },
});