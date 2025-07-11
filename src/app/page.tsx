import "./globals.css"
//import Navbar from "@/app/components/Navbar"
import Slider from "@/app/components/HeroSlider"
import Slider2 from "@/app/components/Slider2"

export default function Page() {
  return (
    <div>
       <div className="min-h-screen">
      {/* Hero Slider Section */}
      
      <Slider2/>
      </div>

      
      <main className="flex min-h-screen flex-col items-center justify-center p-24">
        <div className="text-5xl font-bold">Welcome to DermaQea</div>
        <p className="mt-3 text-2xl">Get started by exploring our products or using our skin analysis tool.</p>
      </main>

    </div>
  )
}
