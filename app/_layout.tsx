import { Stack } from 'expo-router';

export default function RootLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: '#F5F5F5' }, // Gris YANKAP pour transitions fluides
      }}
    >
      <Stack.Screen name="index" />
      <Stack.Screen name="presentation" />
      <Stack.Screen name="auth-choice" />
      <Stack.Screen name="authentication" />
      <Stack.Screen name="component-test" />
      <Stack.Screen name="(tabs)" />
      <Stack.Screen name="tontine-chat" />
      <Stack.Screen name="tontine-detail" />
    </Stack>
  );
}