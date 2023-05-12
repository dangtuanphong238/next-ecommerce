import '@/styles/globals.css'
import { SessionProvider } from "next-auth/react"

export default function App({ Component, pageProps: { session, ...pageProps } }) {
  return (
    <SessionProvider session={session}  basePath='/next-ecommerce-admin-7gkw.vercel.app/api/auth'>
      <Component {...pageProps} />
    </SessionProvider>
  )
}