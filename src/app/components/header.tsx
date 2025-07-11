// "use client"

// import { useState } from "react"
// import Link from "next/link"
// import { Button } from "@/app/components/Ui/button"
// import { Input } from "@/app/components/Ui/input"
// import { Badge } from "@/app/components/Ui/badge"
// import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/app/components/Ui/dropdown-menu"
// import { Search, ShoppingCart, User, Menu, Scan, Heart } from "lucide-react"
// import { useCart } from "@/app/components/cart-provider"

// export function Header() {
//   const [isMenuOpen, setIsMenuOpen] = useState(false)
//   const { items } = useCart()
//   const itemCount = items.reduce((sum, item) => sum + item.quantity, 0)

//   return (
//     <header className="sticky top-0 z-50 bg-white border-b shadow-sm">
//       <div className="container mx-auto px-4">
//         <div className="flex items-center justify-between h-16">
//           {/* Logo */}
//           <Link href="/" className="flex items-center space-x-2">
//             <div className="w-8 h-8 bg-gradient-to-br from-pink-500 to-purple-600 rounded-lg flex items-center justify-center">
//               <span className="text-white font-bold text-sm">DT</span>
//             </div>
//             <span className="text-xl font-bold text-gray-900">DermaTrue</span>
//           </Link>

//           {/* Search Bar - Desktop */}
//           <div className="hidden md:flex flex-1 max-w-md mx-8">
//             <div className="relative w-full">
//               <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
//               <Input placeholder="Search for products, brands..." className="pl-10 pr-4" />
//             </div>
//           </div>

//           {/* Navigation - Desktop */}
//           <nav className="hidden md:flex items-center space-x-6">
//             <Link href="/products" className="text-gray-700 hover:text-pink-600 font-medium">
//               Products
//             </Link>
//             <Link href="/brands" className="text-gray-700 hover:text-pink-600 font-medium">
//               Brands
//             </Link>
//             <Link href="/skin-analysis" className="text-gray-700 hover:text-pink-600 font-medium">
//               Skin Analysis
//             </Link>
//             <Link href="/verify" className="text-gray-700 hover:text-pink-600 font-medium flex items-center">
//               <Scan className="w-4 h-4 mr-1" />
//               Verify
//             </Link>
//           </nav>

//           {/* Actions */}
//           <div className="flex items-center space-x-4">
//             {/* Wishlist */}
//             <Button variant="ghost" size="icon" className="hidden md:flex">
//               <Heart className="w-5 h-5" />
//             </Button>

//             {/* Cart */}
//             <Link href="/cart">
//               <Button variant="ghost" size="icon" className="relative">
//                 <ShoppingCart className="w-5 h-5" />
//                 {itemCount > 0 && (
//                   <Badge className="absolute -top-2 -right-2 w-5 h-5 rounded-full p-0 flex items-center justify-center text-xs bg-pink-600">
//                     {itemCount}
//                   </Badge>
//                 )}
//               </Button>
//             </Link>

//             {/* User Menu */}
//             <DropdownMenu>
//               <DropdownMenuTrigger asChild>
//                 <Button variant="ghost" size="icon">
//                   <User className="w-5 h-5" />
//                 </Button>
//               </DropdownMenuTrigger>
//               <DropdownMenuContent align="end">
//                 <DropdownMenuItem>
//                   <Link href="/profile">My Profile</Link>
//                 </DropdownMenuItem>
//                 <DropdownMenuItem>
//                   <Link href="/orders">My Orders</Link>
//                 </DropdownMenuItem>
//                 <DropdownMenuItem>
//                   <Link href="/wishlist">Wishlist</Link>
//                 </DropdownMenuItem>
//                 <DropdownMenuItem>
//                   <Link href="/skin-profile">Skin Profile</Link>
//                 </DropdownMenuItem>
//                 <DropdownMenuItem>Sign Out</DropdownMenuItem>
//               </DropdownMenuContent>
//             </DropdownMenu>

//             {/* Mobile Menu */}
//             <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setIsMenuOpen(!isMenuOpen)}>
//               <Menu className="w-5 h-5" />
//             </Button>
//           </div>
//         </div>

//         {/* Mobile Menu */}
//         {isMenuOpen && (
//           <div className="md:hidden border-t py-4">
//             <div className="flex flex-col space-y-4">
//               <div className="relative">
//                 <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
//                 <Input placeholder="Search products..." className="pl-10 pr-4" />
//               </div>
//               <Link href="/products" className="text-gray-700 hover:text-pink-600 font-medium">
//                 Products
//               </Link>
//               <Link href="/brands" className="text-gray-700 hover:text-pink-600 font-medium">
//                 Brands
//               </Link>
//               <Link href="/skin-analysis" className="text-gray-700 hover:text-pink-600 font-medium">
//                 Skin Analysis
//               </Link>
//               <Link href="/verify" className="text-gray-700 hover:text-pink-600 font-medium flex items-center">
//                 <Scan className="w-4 h-4 mr-1" />
//                 Verify Product
//               </Link>
//             </div>
//           </div>
//         )}
//       </div>
//     </header>
//   )
// }
