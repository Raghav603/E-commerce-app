import React from 'react';
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  TouchableWithoutFeedback,
  StyleSheet,
} from 'react-native';

export default function SortModal({
  visible,
  onClose,
  selectedOption,
  onSelectOption,
  theme,
}) {
  const isDark = theme === 'dark';
  const bgColor = isDark ? '#1A1A1A' : '#FFFFFF';
  const textColor = isDark ? '#FFFFFF' : '#333333';
  const borderColor = isDark ? '#333333' : '#E0E0E0';
  const activeColor = '#90248A';

  const options = [
    'Relevance',
    'New Arrivals',
    'Price (High to Low)',
    'Price (Low to High)',
    'Ratings',
    'Discount',
  ];

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <TouchableOpacity
        style={styles.modalOverlay}
        activeOpacity={1}
        onPress={onClose}
      >
        <TouchableWithoutFeedback>
          <View style={[styles.modalContent, { backgroundColor: bgColor }]}>
            <View
              style={[
                styles.modalHeader,
                { borderBottomColor: borderColor },
              ]}
            >
              <Text style={[styles.modalTitle, { color: textColor }]}>SORT</Text>
              <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                <Text style={[styles.closeIcon, { color: textColor }]}>✕</Text>
              </TouchableOpacity>
            </View>

            {options.map((option) => {
              const isSelected = selectedOption === option;
              return (
                <TouchableOpacity
                  key={option}
                  style={styles.optionRow}
                  onPress={() => onSelectOption(option)}
                >
                  <Text style={[styles.optionText, { color: textColor }]}>
                    {option}
                  </Text>
                  <View
                    style={[
                      styles.radioButton,
                      { borderColor: isSelected ? activeColor : '#757575' },
                    ]}
                  >
                    {isSelected && (
                      <View
                        style={[
                          styles.radioInner,
                          { backgroundColor: activeColor },
                        ]}
                      />
                    )}
                  </View>
                </TouchableOpacity>
              );
            })}
          </View>
        </TouchableWithoutFeedback>
      </TouchableOpacity>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    overflow: 'hidden',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
  },
  modalTitle: {
    fontSize: 14,
    fontWeight: '700',
    letterSpacing: 1,
  },
  closeButton: { padding: 4 },
  closeIcon: { fontSize: 18, fontWeight: '600' },

  optionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 20,
  },
  optionText: {
    fontSize: 15,
    fontWeight: '400',
    textTransform: 'capitalize',
  },

  radioButton: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  radioInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
});

