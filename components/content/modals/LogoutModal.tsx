import React, { useState } from "react";
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
} from "react-native";
import { logout } from "@/lib/appwrite";
import { useGlobalContext } from "@/lib/global-provider";
import { router } from "expo-router";
import { ROUTES } from "@/lib/constants/paths";

export default function LogoutModal({ visible, onClose }: { visible: boolean; onClose: () => void }) {
  const { refetch } = useGlobalContext();
  const [loading, setLoading] = useState(false);

  const handleConfirm = async () => {
    setLoading(true);
    try {
      const result = await logout();
      if (result) {
        refetch();
        router.replace(ROUTES.SIGN_IN);
      } else {
        alert("Failed to logout");
      }
    } catch (err) {
      alert("Something went wrong");
      console.error("Something went wrong", err);
    } finally {
      setLoading(false);
      onClose();
    }
  };

  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.overlay}>
        <View style={styles.box}>
          <Text style={styles.title}>Confirm Logout</Text>
          <Text style={styles.message}>Are you sure you want to logout?</Text>

          {loading ? (
            <ActivityIndicator size="large" color="red" style={{ marginTop: 20 }} />
          ) : (
            <View style={styles.buttons}>
              <TouchableOpacity onPress={onClose} style={[styles.btn, styles.cancel]}>
                <Text style={styles.btnText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={handleConfirm} style={[styles.btn, styles.ok]}>
                <Text style={[styles.btnText, { color: "white" }]}>Logout</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  box: {
    backgroundColor: "white",
    padding: 20,
    borderRadius: 18,
    width: "80%",
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 8,
    textAlign: "center",
  },
  message: {
    fontSize: 15,
    textAlign: "center",
    marginBottom: 20,
  },
  buttons: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  btn: {
    flex: 1,
    padding: 12,
    borderRadius: 30,
    alignItems: "center",
    marginHorizontal: 5,
  },
  cancel: {
    backgroundColor: "#eee",
  },
  ok: {
    backgroundColor: "black",
  },
  btnText: {
    fontSize: 16,
    fontWeight: "600",
  },
});
