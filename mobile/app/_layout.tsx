import { ClerkProvider } from "@clerk/clerk-expo"
import { Stack } from "expo-router"
import "../global.css"
import { tokenCache } from "@clerk/clerk-expo/token-cache"
export default function RootLayout() {
  return (
    <ClerkProvider tokenCache={tokenCache}>
      <Stack />;
    </ClerkProvider>
  )
}
