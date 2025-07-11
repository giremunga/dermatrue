"use client"

import { useState, useEffect, useRef } from "react"
import Image from "next/image"

interface SlideData {
  id: number
  title: string
  subtitle: string
  description: string
  image: string
  buttonText: string
  buttonLink: string
  bgColor: string
  accentColor: string
}

const slides: SlideData[] = [
  {
    id: 1,
    title: "AI-Powered Skin Analysis",
    subtitle: "Discover Your Perfect Routine",
    description:
      "Get personalized skincare recommendations based on advanced AI analysis of your skin type and concerns.",
    image: "/placeholder.svg?height=500&width=700",
    buttonText: "Start Analysis",
    buttonLink: "/skin-analysis",
    bgColor: "from-pink-500/10 via-purple-500/5 to-indigo-500/10",
    accentColor: "from-pink-500 to-purple-600",
  },
  {
    id: 2,
    title: "Authentic Products Only",
    subtitle: "QR Code Verification",
    description:
      "Every product comes with QR code verification to ensure you're getting 100% authentic skincare products.",
    image: "/placeholder.svg?height=500&width=700",
    buttonText: "Verify Products",
    buttonLink: "/verify",
    bgColor: "from-purple-500/10 via-indigo-500/5 to-blue-500/10",
    accentColor: "from-purple-500 to-indigo-600",
  },
  {
    id: 3,
    title: "Premium Beauty Collection",
    subtitle: "Curated for You",
    description:
      "Explore our carefully curated collection of premium skincare and beauty products from trusted brands.",
    image: "/placeholder.svg?height=500&width=700",
    buttonText: "Shop Now",
    buttonLink: "/products",
    bgColor: "from-indigo-500/10 via-blue-500/5 to-pink-500/10",
    accentColor: "from-indigo-500 to-pink-600",
  },
]

const HeroSlider = () => {
  const [currentSlide, setCurrentSlide] = useState(0)
  const [isTransitioning, setIsTransitioning] = useState(false)
  const [isAutoPlaying, setIsAutoPlaying] = useState(true)
  const [progress, setProgress] = useState(0)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)
  const progressRef = useRef<NodeJS.Timeout | null>(null)

  const startProgress = () => {
    setProgress(0)
    if (progressRef.current) clearInterval(progressRef.current)

    progressRef.current = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          return 0
        }
        return prev + 0.5
      })
    }, 25) // Update every 25ms for smooth progress
  }

  const resetAutoPlay = () => {
    if (intervalRef.current) clearInterval(intervalRef.current)
    if (progressRef.current) clearInterval(progressRef.current)

    if (isAutoPlaying) {
      startProgress()
      intervalRef.current = setInterval(() => {
        goToNextSlide()
      }, 5000)
    }
  }

  useEffect(() => {
    resetAutoPlay()
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current)
      if (progressRef.current) clearInterval(progressRef.current)
    }
  }, [isAutoPlaying, currentSlide])

  const goToNextSlide = () => {
    if (isTransitioning) return
    setIsTransitioning(true)
    setCurrentSlide((prev) => (prev + 1) % slides.length)
    setTimeout(() => setIsTransitioning(false), 800)
  }

  const goToPrevSlide = () => {
    if (isTransitioning) return
    setIsTransitioning(true)
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length)
    setTimeout(() => setIsTransitioning(false), 800)
  }

  const goToSlide = (index: number) => {
    if (isTransitioning || index === currentSlide) return
    setIsTransitioning(true)
    setCurrentSlide(index)
    setIsAutoPlaying(false)
    setTimeout(() => {
      setIsTransitioning(false)
      setIsAutoPlaying(true)
    }, 800)
  }

  return (
    <div className="relative h-screen overflow-hidden bg-gradient-to-br from-gray-50 to-purple-50">
      {/* Animated Background Layers */}
      <div className="absolute inset-0">
        {slides.map((slide, index) => (
          <div
            key={`bg-${slide.id}`}
            className={`absolute inset-0 transition-all duration-[1200ms] ease-[cubic-bezier(0.25,0.46,0.45,0.94)] ${
              index === currentSlide
                ? "opacity-100 scale-100"
                : index === (currentSlide - 1 + slides.length) % slides.length
                  ? "opacity-0 scale-110 blur-sm"
                  : "opacity-0 scale-95"
            }`}
          >
            <div className={`absolute inset-0 bg-gradient-to-br ${slide.bgColor}`} />
            {/* Floating Particles */}
            <div className="absolute inset-0 overflow-hidden">
              <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-pink-400/30 rounded-full animate-float-slow" />
              <div className="absolute top-3/4 right-1/4 w-3 h-3 bg-purple-400/20 rounded-full animate-float-medium" />
              <div className="absolute top-1/2 left-3/4 w-1 h-1 bg-indigo-400/40 rounded-full animate-float-fast" />
            </div>
          </div>
        ))}
      </div>

      {/* Main Content */}
      <div className="relative z-10 h-full flex items-center">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            {/* Text Content with Staggered Animations */}
            <div className="space-y-8">
              {slides.map((slide, index) => (
                <div
                  key={`content-${slide.id}`}
                  className={`transition-all duration-[800ms] ease-[cubic-bezier(0.25,0.46,0.45,0.94)] ${
                    index === currentSlide
                      ? "opacity-100 translate-x-0 translate-y-0"
                      : index < currentSlide
                        ? "opacity-0 -translate-x-12 translate-y-4"
                        : "opacity-0 translate-x-12 -translate-y-4"
                  }`}
                  style={{
                    display: Math.abs(index - currentSlide) <= 1 ? "block" : "none",
                  }}
                >
                  <div className="space-y-6">
                    {/* Subtitle with delay */}
                    <div
                      className={`transition-all duration-[600ms] ease-[cubic-bezier(0.25,0.46,0.45,0.94)] ${
                        index === currentSlide ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
                      }`}
                      style={{ transitionDelay: index === currentSlide ? "200ms" : "0ms" }}
                    >
                      <span
                        className={`inline-block bg-gradient-to-r ${slide.accentColor} bg-clip-text text-transparent text-sm font-bold tracking-wider uppercase`}
                      >
                        {slide.subtitle}
                      </span>
                    </div>

                    {/* Title with delay */}
                    <h1
                      className={`text-5xl md:text-6xl lg:text-7xl font-black text-gray-900 leading-tight transition-all duration-[700ms] ease-[cubic-bezier(0.25,0.46,0.45,0.94)] ${
                        index === currentSlide ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
                      }`}
                      style={{ transitionDelay: index === currentSlide ? "400ms" : "0ms" }}
                    >
                      {slide.title}
                    </h1>

                    {/* Description with delay */}
                    <p
                      className={`text-xl text-gray-600 leading-relaxed max-w-lg transition-all duration-[600ms] ease-[cubic-bezier(0.25,0.46,0.45,0.94)] ${
                        index === currentSlide ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
                      }`}
                      style={{ transitionDelay: index === currentSlide ? "600ms" : "0ms" }}
                    >
                      {slide.description}
                    </p>

                    {/* Button with delay */}
                    <div
                      className={`pt-4 transition-all duration-[600ms] ease-[cubic-bezier(0.25,0.46,0.45,0.94)] ${
                        index === currentSlide ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
                      }`}
                      style={{ transitionDelay: index === currentSlide ? "800ms" : "0ms" }}
                    >
                      <button
                        className={`group relative overflow-hidden bg-gradient-to-r ${slide.accentColor} text-white font-semibold py-4 px-10 rounded-full transition-all duration-500 hover:shadow-2xl hover:scale-105 transform-gpu`}
                      >
                        <span className="relative z-10 flex items-center space-x-3">
                          <span>{slide.buttonText}</span>
                          <svg
                            className="w-5 h-5 group-hover:translate-x-2 transition-transform duration-300"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M17 8l4 4m0 0l-4 4m4-4H3"
                            />
                          </svg>
                        </span>
                        <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Image Content with Advanced Parallax */}
            <div className="relative">
              <div className="relative h-[600px] w-full">
                {slides.map((slide, index) => (
                  <div
                    key={`image-${slide.id}`}
                    className={`absolute inset-0 transition-all duration-[1000ms] ease-[cubic-bezier(0.25,0.46,0.45,0.94)] ${
                      index === currentSlide
                        ? "opacity-100 scale-100 rotate-0 blur-0"
                        : index === (currentSlide - 1 + slides.length) % slides.length
                          ? "opacity-0 scale-110 rotate-2 blur-sm"
                          : index === (currentSlide + 1) % slides.length
                            ? "opacity-0 scale-90 -rotate-2 blur-sm"
                            : "opacity-0 scale-95 rotate-1 blur-md"
                    }`}
                  >
                    <div className="relative h-full w-full rounded-3xl overflow-hidden shadow-2xl">
                      <Image
                        src={slide.image || "/placeholder.svg"}
                        alt={slide.title}
                        fill
                        className="object-cover transition-transform duration-[1200ms] ease-out hover:scale-105"
                      />
                      <div
                        className={`absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent`}
                      />

                      {/* Floating Elements with Parallax */}
                      <div
                        className={`absolute -top-6 -right-6 w-24 h-24 bg-gradient-to-br ${slide.accentColor} rounded-full opacity-60 blur-xl transition-all duration-[1200ms] ${
                          index === currentSlide ? "animate-pulse scale-100" : "scale-0"
                        }`}
                      />
                      <div
                        className={`absolute -bottom-8 -left-8 w-20 h-20 bg-gradient-to-br from-white/40 to-white/10 rounded-full backdrop-blur-sm transition-all duration-[1000ms] ${
                          index === currentSlide ? "animate-bounce scale-100" : "scale-0"
                        }`}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced Navigation */}
      <button
        onClick={goToPrevSlide}
        disabled={isTransitioning}
        className="absolute left-6 top-1/2 -translate-y-1/2 z-20 bg-white/90 backdrop-blur-md hover:bg-white text-gray-800 p-4 rounded-full shadow-xl hover:shadow-2xl transition-all duration-300 group disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <svg
          className="w-6 h-6 group-hover:-translate-x-1 transition-transform duration-300"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
      </button>

      <button
        onClick={goToNextSlide}
        disabled={isTransitioning}
        className="absolute right-6 top-1/2 -translate-y-1/2 z-20 bg-white/90 backdrop-blur-md hover:bg-white text-gray-800 p-4 rounded-full shadow-xl hover:shadow-2xl transition-all duration-300 group disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <svg
          className="w-6 h-6 group-hover:translate-x-1 transition-transform duration-300"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </button>

      {/* Enhanced Indicators */}
      <div className="absolute bottom-12 left-1/2 -translate-x-1/2 z-20">
        <div className="flex space-x-4">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              disabled={isTransitioning}
              className={`relative transition-all duration-500 ease-[cubic-bezier(0.25,0.46,0.45,0.94)] ${
                index === currentSlide
                  ? "w-16 h-4 bg-gradient-to-r from-pink-500 to-purple-600 rounded-full"
                  : "w-4 h-4 bg-white/60 hover:bg-white/90 rounded-full"
              } disabled:cursor-not-allowed`}
            >
              {index === currentSlide && (
                <div
                  className="absolute inset-0 bg-gradient-to-r from-pink-600 to-purple-700 rounded-full transition-all duration-300"
                  style={{ width: `${progress}%` }}
                />
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Smooth Progress Bar */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-pink-100 to-purple-100">
        <div
          className="h-full bg-gradient-to-r from-pink-500 to-purple-600 transition-all duration-100 ease-linear"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  )
}

export default HeroSlider
