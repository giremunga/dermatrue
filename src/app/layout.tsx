import type { Metadata } from "next"
import { Inter } from 'next/font/google'
import "./globals.css"
import Navbar from "@/app/components/Navbar"
import Footer from "@/app/components/Footer"


const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "DermaTrue - Authentic Skincare & Beauty Products",
  description:
    "Discover authentic skincare and beauty products with QR code verification. Get personalized recommendations based on your skin type.",
  keywords: "skincare, beauty, cosmetics, authentic products, QR verification, personalized recommendations",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        
          <Navbar/>
          <main>{children}</main>
          <Footer/>

         
        
      </body>
    </html>
  )
}