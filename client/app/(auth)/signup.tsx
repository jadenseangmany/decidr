import React, { useMemo, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Image,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

import { COLORS } from "@/constants/colors";
import AuthTextField from "@/components/AuthTextField";
import PrimaryButton from "@/components/PrimaryButton";

// ---- Mock API call (for showing purpose only) ----
async function fakeSignupApi(username: string, password: string, confirmPassword: string) {
  await new Promise((res) => setTimeout(res, 900));

  if (!username.trim() || !password || !confirmPassword) {
    throw new Error("Please fill in all fields.");
  }
  if (password.length < 4) {
    throw new Error("Password is too short (demo error).");
  }
  if (password !== confirmPassword) {
    throw new Error("Passwords do not match.");
  }

  return {
    token: "demo_signup_token_456",
    user: { username },
  };
}

export default function SignupScreen() {
  const router = useRouter();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showPw, setShowPw] = useState(false);
  const [showConfirmPw, setShowConfirmPw] = useState(false);

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const canSubmit = useMemo(() => {
    return username.trim().length > 0 && password.length > 0 && confirmPassword.length > 0 && !loading;
  }, [username, password, confirmPassword, loading]);

  const onSignup = async () => {
    setErrorMsg(null);
    setLoading(true);

    try {
      const result = await fakeSignupApi(username, password, confirmPassword);
      console.log("SIGNUP SUCCESS", result);

      // For demo: go to login after signup
      router.replace("/(auth)/login");
    } catch (err: any) {
      setErrorMsg(err?.message ?? "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const onSignupWithEmail = async () => {
    // Display/demo only
    console.log("SIGN UP WITH EMAIL (demo)");
  };

  return (
    <KeyboardAvoidingView style={styles.screen} behavior={Platform.OS === "ios" ? "padding" : undefined}>
      <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
        {/* Decorations */}
        <Image source={require("../../assets/signup/orange.png")} style={styles.orange} />
        <Image source={require("../../assets/signup/onion.png")} style={styles.onion} />

        <Text style={styles.title}>APP NAME</Text>

        <AuthTextField
          value={username}
          onChangeText={setUsername}
          placeholder="Type your username here..."
          iconName="person-circle-outline"
        />

        <AuthTextField
          value={password}
          onChangeText={setPassword}
          placeholder="Type your password here..."
          iconName="lock-closed-outline"
          secureTextEntry={!showPw}
          rightIconName={showPw ? "eye-off" : "eye"}
          onPressRightIcon={() => setShowPw((v) => !v)}
        />

        <AuthTextField
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          placeholder="Confirm your password"
          iconName="lock-closed-outline"
          secureTextEntry={!showConfirmPw}
          rightIconName={showConfirmPw ? "eye-off" : "eye"}
          onPressRightIcon={() => setShowConfirmPw((v) => !v)}
        />

        {errorMsg ? <Text style={styles.error}>{errorMsg}</Text> : null}

        <PrimaryButton title="Sign up" onPress={onSignup} disabled={!canSubmit} loading={loading} />

        {/* "Sign up with" button (display/demo only) */}
        <Pressable onPress={onSignupWithEmail} style={styles.secondaryBtn} disabled={loading}>
          <Text style={styles.secondaryText}>Sign up with</Text>
          <Ionicons name="mail" size={20} color="#000" />
        </Pressable>

        <View style={styles.bottomRow}>
          <Text style={styles.bottomText}>Already have an account? </Text>
          <Pressable onPress={() => router.replace("/(auth)/login")} hitSlop={10}>
            <Text style={styles.bottomLink}>Log in</Text>
          </Pressable>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: COLORS.background },

  container: {
    paddingTop: 110,
    paddingHorizontal: 22,
    paddingBottom: 40,
    backgroundColor: COLORS.background,
    alignItems: "center",
  },

  // NEW: Decorations
  orange: {
    position: "absolute",
    top: 24,
    right: 16,
    width: 92,
    height: 92,
    resizeMode: "contain",
  },
  onion: {
    position: "absolute",
    bottom: 18,
    left: 16,
    width: 92,
    height: 92,
    resizeMode: "contain",
  },

  title: {
    fontFamily: "KetchupManis",
    fontSize: 44,
    color: COLORS.text,
    marginBottom: 26,
    textAlign: "center",
    letterSpacing: 1,
  },

  error: {
    width: "100%",
    color: COLORS.error,
    marginBottom: 10,
    fontWeight: "700",
    paddingHorizontal: 6,
  },

  secondaryBtn: {
    width: "100%",
    height: 64,
    borderRadius: 12,
    marginTop: 14,
    backgroundColor: "#79C985",
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    gap: 10,
    shadowColor: "#000",
    shadowOpacity: 0.18,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 3,
    overflow: "hidden",
  },
  secondaryText: {
    fontSize: 18,
    fontWeight: "900",
    color: "#000",
  },

  bottomRow: {
    flexDirection: "row",
    marginTop: 14,
    alignItems: "center",
    justifyContent: "center",
  },
  bottomText: {
    fontSize: 14,
    color: "#000",
    fontWeight: "600",
  },
  bottomLink: {
    fontSize: 14,
    color: "#000",
    fontWeight: "900",
    textDecorationLine: "underline",
  },
});
