"use client"

import Link from "next/link"
import { useState } from "react"

const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen)
  }

  return (
    <nav className="bg-white shadow-md border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-2">
              <div className="bg-gradient-to-r from-pink-500 to-purple-600 text-white font-bold text-xl px-3 py-1 rounded-lg">
                DQ
              </div>
              <span className="text-2xl font-bold text-gray-800">DermaQea</span>
            </Link>
          </div>

          {/* Navigation Links - Desktop */}
          <div className="hidden md:flex items-center space-x-8">
            <Link
              href="/products"
              className="flex items-center space-x-1 text-gray-700 hover:text-pink-600 font-medium transition-colors duration-200"
            >
              <span>Products</span>
            </Link>

            <Link
              href="/analysis"
              className="flex items-center space-x-1 text-gray-700 hover:text-pink-600 font-medium transition-colors duration-200"
            >
              <span>Skin Analysis</span>
            </Link>

            <Link
              href="/verify"
              className="flex items-center space-x-2 text-gray-700 hover:text-pink-600 font-medium transition-colors duration-200"
            >
              <span>Verify with</span>
              <span className="text-lg">📱</span>
              <span>Scan</span>
            </Link>
            <Link
              href="/auth"
              className="bg-gradient-to-r from-pink-500 to-purple-600 text-white font-medium py-2 px-6 rounded-full hover:from-pink-600 hover:to-purple-700 transition-all duration-200 transform hover:scale-105"
            >
              Sign In
            </Link>

            <Link
              href="/profile"
              className="flex items-center space-x-2 text-gray-700 hover:text-pink-600 font-medium transition-colors duration-200"
            >
              <span className="text-lg">👤</span>
              <span>Profile</span>
            </Link>
            <Link href="/about"
            className="flex items-center space-x-2 text-gray-700 hover:text-pink-600 font-medium transition-colors duration-200"
            ><span className="text-lg">about us </span>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              onClick={toggleMobileMenu}
              className="text-gray-700 hover:text-pink-600 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:ring-offset-2 rounded-md p-2"
              aria-label="Toggle mobile menu"
            >
              <svg
                className={`h-6 w-6 transform transition-transform duration-200 ${isMobileMenuOpen ? "rotate-90" : ""}`}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                {isMobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <div
          className={`md:hidden transition-all duration-300 ease-in-out ${isMobileMenuOpen ? "max-h-64 opacity-100" : "max-h-0 opacity-0 overflow-hidden"}`}
        >
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 border-t border-gray-200 mt-2">
            <Link
              href="/products"
              className="block px-3 py-2 text-gray-700 hover:text-pink-600 hover:bg-pink-50 font-medium transition-colors duration-200 rounded-md"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Products
            </Link>

            <Link
              href="/skin-analysis"
              className="block px-3 py-2 text-gray-700 hover:text-pink-600 hover:bg-pink-50 font-medium transition-colors duration-200 rounded-md"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Skin Analysis
            </Link>

            <Link
              href="/verify"
              className="flex items-center space-x-2 px-3 py-2 text-gray-700 hover:text-pink-600 hover:bg-pink-50 font-medium transition-colors duration-200 rounded-md"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <span>Verify with</span>
              <span className="text-lg">📱</span>
              <span>Scan</span>
            </Link>

            <Link
              href="/profile"
              className="flex items-center space-x-2 px-3 py-2 text-gray-700 hover:text-pink-600 hover:bg-pink-50 font-medium transition-colors duration-200 rounded-md"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <span className="text-lg">👤</span>
              <span>Profile</span>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  )
}

export default Navbar
