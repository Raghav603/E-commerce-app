import React, { useContext } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TextInput, 
  TouchableOpacity, 
  ScrollView, 
  KeyboardAvoidingView, 
  Platform,
  ActivityIndicator,
  Image,
  Modal,
  Pressable
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { ThemeContext } from '../../navigation/AppNavigator';
import { useEditProfileViewModel } from '../../viewmodels/useEditProfileViewModel';

export default function EditProfileScreen({ navigation }) {
  const { resolvedTheme } = useContext(ThemeContext);
  
  // Bind ViewModel
  const { 
    name, setName, 
    email, setEmail, 
    phone, setPhone, 
    isLoading, handleSave, handleRemovePhoto,
    avatarUri, handleChoosePhoto,
    showActionSheet, setShowActionSheet
  } = useEditProfileViewModel(navigation);

  // Theming colors
  const isDark = resolvedTheme === 'dark';
  const c = {
    bg: isDark ? '#121212' : '#F7F8FA',
    card: isDark ? '#1C1C1E' : '#FFFFFF',
    text: isDark ? '#FFFFFF' : '#1A1A1A',
    subText: isDark ? '#A9A9A9' : '#777777',
    border: isDark ? '#333333' : '#E5E5E5',
    primary: '#5DB075',
    inputBg: isDark ? '#2C2C2E' : '#F2F2F7',
    danger: isDark ? '#CF6679' : '#B00020',
  };

  return (
    <View style={[styles.container, { backgroundColor: c.bg }]}>
      
      {/* ── HEADER ── */}
      <View style={[styles.header, { borderBottomColor: c.border, backgroundColor: c.card }]}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <Ionicons name="chevron-back" size={24} color={c.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: c.text }]}>Edit Profile</Text>
        <View style={styles.headerRight} /> {/* Empty view to balance center title */}
      </View>

      <KeyboardAvoidingView 
        style={{ flex: 1 }} 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView contentContainerStyle={styles.scrollContent}>
          
          {/* ── AVATAR EDIT ── */}
          <View style={styles.avatarSection}>
            <View style={[styles.avatarCircle, { backgroundColor: c.inputBg }]}>
              {avatarUri ? (
                <Image source={{ uri: avatarUri }} style={styles.avatarImage} />
              ) : (
                <Ionicons name="person" size={40} color={c.subText} />
              )}
              <TouchableOpacity style={[styles.editAvatarBadge, { backgroundColor: c.card, borderColor: c.border }]} onPress={() => setShowActionSheet(true)}>
                <Ionicons name="camera" size={16} color={c.text} />
              </TouchableOpacity>
            </View>
          </View>

          {/* ── FORM FIELDS ── */}
          <View style={[styles.formContainer, { backgroundColor: c.card, borderColor: c.border }]}>
            
            <View style={styles.inputGroup}>
              <Text style={[styles.label, { color: c.subText }]}>Full Name</Text>
              <TextInput
                style={[styles.input, { backgroundColor: c.inputBg, color: c.text }]}
                value={name}
                onChangeText={setName}
                placeholder="Enter your name"
                placeholderTextColor={c.subText}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={[styles.label, { color: c.subText }]}>Email Address</Text>
              <TextInput
                style={[styles.input, { backgroundColor: c.inputBg, color: c.text }]}
                value={email}
                onChangeText={setEmail}
                placeholder="Enter your email"
                placeholderTextColor={c.subText}
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={[styles.label, { color: c.subText }]}>Phone Number</Text>
              <TextInput
                style={[styles.input, { backgroundColor: c.inputBg, color: c.text }]}
                value={phone}
                onChangeText={setPhone}
                placeholder="Enter your phone number"
                placeholderTextColor={c.subText}
                keyboardType="phone-pad"
              />
            </View>

          </View>

        </ScrollView>
      </KeyboardAvoidingView>

      {/* ── SAVE BUTTON ── */}
      <View style={[styles.footer, { backgroundColor: c.card, borderTopColor: c.border }]}>
        <TouchableOpacity 
          style={[styles.saveBtn, { backgroundColor: c.primary }]} 
          onPress={handleSave}
          disabled={isLoading}
        >
          {isLoading ? (
            <ActivityIndicator color="#FFF" />
          ) : (
            <Text style={styles.saveBtnText}>Save Changes</Text>
          )}
        </TouchableOpacity>
      </View>

      {/* ── ACTION SHEET MODAL ── */}
      <Modal
        visible={showActionSheet}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowActionSheet(false)}
      >
        <Pressable style={styles.modalOverlay} onPress={() => setShowActionSheet(false)}>
          <View style={[styles.actionSheetContainer, { backgroundColor: c.card }]}>
            <Text style={[styles.actionSheetTitle, { color: c.text }]}>Change Profile Photo</Text>
            
            <TouchableOpacity style={styles.actionSheetButton} onPress={() => handleChoosePhoto('library')}>
              <Ionicons name="images-outline" size={22} color={c.primary} />
              <Text style={[styles.actionSheetButtonText, { color: c.primary }]}>Choose from Library</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.actionSheetButton} onPress={() => handleChoosePhoto('camera')}>
              <Ionicons name="camera-outline" size={22} color={c.primary} />
              <Text style={[styles.actionSheetButtonText, { color: c.primary }]}>Take Photo</Text>
            </TouchableOpacity>

            {/* Conditionally render remove photo option */}
            {avatarUri && (
              <TouchableOpacity style={styles.actionSheetButton} onPress={handleRemovePhoto}>
                <Ionicons name="trash-outline" size={22} color={c.danger} />
                <Text style={[styles.actionSheetButtonText, { color: c.danger }]}>Remove Photo</Text>
              </TouchableOpacity>
            )}

            <TouchableOpacity 
              style={[styles.actionSheetButton, { borderTopWidth: 1, borderColor: c.border, marginTop: 10, paddingTop: 15 }]} 
              onPress={() => setShowActionSheet(false)}
            >
              <Text style={[styles.actionSheetButtonText, { color: c.subText, fontWeight: 'bold' }]}>
                Cancel
              </Text>
            </TouchableOpacity>

          </View>
        </Pressable>
      </Modal>

    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    justifyContent: 'space-between', 
    paddingHorizontal: 16, 
    paddingVertical: 16, 
    borderBottomWidth: 1 
  },
  backBtn: { padding: 4 },
  headerTitle: { fontSize: 18, fontWeight: '700' },
  headerRight: { width: 32 }, // Balances the back button width
  
  scrollContent: { padding: 20 },
  
  avatarSection: { alignItems: 'center', marginVertical: 24 },
  avatarCircle: { 
    width: 100, 
    height: 100, 
    borderRadius: 50, 
    justifyContent: 'center', 
    alignItems: 'center',
    position: 'relative',
    overflow: 'hidden',
  },
  avatarImage: {
    width: '100%',
    height: '100%',
  },
  editAvatarBadge: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 32,
    height: 32,
    borderRadius: 16,
    borderWidth: 2,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },

  formContainer: {
    padding: 20,
    borderRadius: 16,
    borderWidth: 1,
  },
  inputGroup: { marginBottom: 20 },
  label: { fontSize: 13, fontWeight: '600', marginBottom: 8 },
  input: {
    height: 50,
    borderRadius: 10,
    paddingHorizontal: 16,
    fontSize: 15,
  },

  footer: {
    padding: 20,
    borderTopWidth: 1,
  },
  saveBtn: {
    height: 52,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  saveBtnText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '700',
  },

  // Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  actionSheetContainer: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    paddingBottom: 40, // For safe area
  },
  actionSheetTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },
  actionSheetButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
  },
  actionSheetButtonText: {
    fontSize: 18,
    marginLeft: 15,
  },
});