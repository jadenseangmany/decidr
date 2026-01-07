import React, { useMemo, useState } from "react";
import {
  View,
  Text,
  Pressable,
  StyleSheet,
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

import { COLORS } from "@/constants/colors";
import AuthTextField from "@/components/AuthTextField";
import PrimaryButton from "@/components/PrimaryButton";

// ---- Mock API call (for showing purpose only) ----
async function fakeLoginApi(username: string, password: string) {
  await new Promise((res) => setTimeout(res, 900));

  if (!username.trim() || !password) {
    throw new Error("Please enter both username and password.");
  }
  if (password.length < 4) {
    throw new Error("Password is too short (demo error).");
  }

  return {
    token: "demo_token_123",
    user: { username },
  };
}

export default function LoginScreen() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [showPw, setShowPw] = useState(false);

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const canSubmit = useMemo(() => {
    return username.trim().length > 0 && password.length > 0 && !loading;
  }, [username, password, loading]);

  const onSubmit = async () => {
    setErrorMsg(null);
    setLoading(true);

    try {
      const result = await fakeLoginApi(username, password);

      console.log("LOGIN SUCCESS", {
        result,
        rememberMe,
      });
    } catch (err: any) {
      setErrorMsg(err?.message ?? "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.screen}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
        {/* Decorations */}
        <Image source={require("../../assets/login/soymilk.png")} style={styles.soy} />
        <Image source={require("../../assets/login/grill.png")} style={styles.grill} />

        <Text style={styles.title}>App Name</Text>

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

        {/* Remember + Forgot */}
        <View style={styles.rowBetween}>
          <Pressable
            style={styles.rememberRow}
            onPress={() => setRememberMe((v) => !v)}
            hitSlop={10}
          >
            <View style={[styles.checkbox, rememberMe && styles.checkboxOn]}>
              {rememberMe && <Ionicons name="checkmark" size={16} color="#fff" />}
            </View>
            <Text style={styles.rememberText}>Remember me</Text>
          </Pressable>

          <Pressable onPress={() => console.log("Forgot password (demo)")} hitSlop={10}>
            <Text style={styles.link}>Forgot Password?</Text>
          </Pressable>
        </View>

        {/* Error message */}
        {errorMsg ? <Text style={styles.error}>{errorMsg}</Text> : null}

        {/* Login button */}
        <PrimaryButton
          title="Log in"
          onPress={onSubmit}
          disabled={!canSubmit}
          loading={loading}
          leftImage={require("../../assets/login/corn.png")}
          rightImage={require("../../assets/login/hambuger.png")}
        />

        {/* Sign up (display only) */}
        <View style={styles.signupRow}>
          <Text style={styles.signupText}>Don’t Have An Account? </Text>
          <Pressable onPress={() => console.log("Sign up (demo)")}>
            <Text style={styles.signupLink}>Sign up Here</Text>
          </Pressable>
        </View>

        {/* Bottom decoration */}
        <Image source={require("../../assets/login/noodle.png")} style={styles.noodle} />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: COLORS.background },

  container: {
    paddingTop: 90,
    paddingHorizontal: 22,
    paddingBottom: 24,
    backgroundColor: COLORS.background,
    alignItems: "center",
  },

  soy: {
    position: "absolute",
    top: 20,
    left: 18,
    width: 90,
    height: 90,
    resizeMode: "contain",
  },
  grill: {
    position: "absolute",
    top: 10,
    right: 0,
    width: 160,
    height: 120,
    resizeMode: "contain",
  },

  title: {
    fontFamily: "KetchupManis",
    fontSize: 44,
    color: COLORS.title,
    marginBottom: 26,
    textAlign: "center",
  },

  rowBetween: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 6,
    marginBottom: 10,
  },

  rememberRow: { flexDirection: "row", alignItems: "center", gap: 10 },
  checkbox: {
    width: 18,
    height: 18,
    borderWidth: 2,
    borderColor: COLORS.border,
    borderRadius: 4,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "transparent",
  },
  checkboxOn: { backgroundColor: COLORS.border },
  rememberText: { fontSize: 13, fontWeight: "800", color: COLORS.text },

  link: {
    fontSize: 13,
    fontWeight: "900",
    color: COLORS.text,
    textDecorationLine: "underline",
  },

  error: {
    width: "100%",
    color: COLORS.error,
    marginBottom: 8,
    fontWeight: "700",
    paddingHorizontal: 6,
  },

  signupRow: {
    flexDirection: "row",
    marginTop: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  signupText: { color: COLORS.text, fontSize: 13 },
  signupLink: {
    color: COLORS.text,
    fontSize: 13,
    fontWeight: "900",
    textDecorationLine: "underline",
  },

  noodle: {
    marginTop: 18,
    width: 290,
    height: 290,
    resizeMode: "contain",
  },
});
