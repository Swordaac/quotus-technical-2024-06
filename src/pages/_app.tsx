import '@/styles/globals.css'
import type { AppProps } from 'next/app'
import { ChakraProvider } from '@chakra-ui/react'
import App from '@/components/pages/App'

export default function NextApp({ Component, pageProps }: AppProps) {
  return (
    <ChakraProvider>
      <App>
        <Component {...pageProps} />
      </App>
    </ChakraProvider>
  )
}
