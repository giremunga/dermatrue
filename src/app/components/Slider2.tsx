"use client"

import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Play, ArrowRight, Star, Users, Award, Sparkles } from 'lucide-react';

export default function Slider2() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  const slides = [
    {
      id: 1,
      title: "Transform Your Skin Journey",
      subtitle: "Advanced AI-Powered Dermatology",
      description: "Join thousands who've revolutionized their skincare routine with personalized treatments and expert guidance.",
      cta: "Start Your Analysis",
      ctaSecondary: "Watch Demo",
      bgGradient: "from-blue-600 via-purple-600 to-pink-500",
      stats: [
        { label: "Happy Clients", value: "50K+" },
        { label: "Success Rate", value: "94%" },
        { label: "Treatments", value: "200+" }
      ],
      features: ["AI Skin Analysis", "Personalized Plans", "Expert Consultation"]
    },
    {
      id: 2,
      title: "Professional Dermatology Care",
      subtitle: "Trusted by Skin Experts Worldwide",
      description: "Connect with certified dermatologists and access cutting-edge treatments tailored to your unique skin needs.",
      cta: "Book Consultation",
      ctaSecondary: "View Treatments",
      bgGradient: "from-emerald-500 via-teal-500 to-cyan-500",
      stats: [
        { label: "Dermatologists", value: "500+" },
        { label: "Countries", value: "25+" },
        { label: "Reviews", value: "4.9/5" }
      ],
      features: ["Certified Experts", "Global Reach", "Premium Care"]
    },
    {
      id: 3,
      title: "Your Skin, Our Science",
      subtitle: "Evidence-Based Solutions",
      description: "Experience the future of skincare with our research-backed treatments and innovative technology platform.",
      cta: "Explore Science",
      ctaSecondary: "Research Hub",
      bgGradient: "from-orange-500 via-red-500 to-pink-500",
      stats: [
        { label: "Research Papers", value: "1000+" },
        { label: "Skin Conditions", value: "150+" },
        { label: "Accuracy", value: "96%" }
      ],
      features: ["Clinical Research", "Advanced Analytics", "Proven Results"]
    }
  ];

  useEffect(() => {
    if (!isAutoPlaying) return;
    
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [isAutoPlaying, slides.length]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const goToSlide = (index) => {
    setCurrentSlide(index);
  };

  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Background Slides */}
      {slides.map((slide, index) => (
        <div
          key={slide.id}
          className={`absolute inset-0 transition-all duration-1000 ease-in-out ${
            index === currentSlide 
              ? 'opacity-100 scale-100' 
              : 'opacity-0 scale-105'
          }`}
        >
          <div className={`absolute inset-0 bg-gradient-to-br ${slide.bgGradient}`} />
          <div className="absolute inset-0 bg-black/20" />
          
          {/* Animated Background Elements */}
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute -top-40 -right-40 w-80 h-80 bg-white/10 rounded-full blur-3xl animate-pulse" />
            <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-white/5 rounded-full blur-3xl animate-pulse delay-1000" />
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-white/5 rounded-full blur-2xl animate-ping" />
          </div>
        </div>
      ))}

      {/* Content */}
      <div className="relative z-10 min-h-screen flex items-center">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            
            {/* Left Content */}
            <div className="text-white space-y-8">
              {slides.map((slide, index) => (
                <div
                  key={slide.id}
                  className={`transition-all duration-700 ${
                    index === currentSlide 
                      ? 'opacity-100 translate-y-0' 
                      : 'opacity-0 translate-y-8'
                  }`}
                  style={{ display: index === currentSlide ? 'block' : 'none' }}
                >
                  <div className="space-y-6">
                    <div className="flex items-center space-x-2 text-sm">
                      <Sparkles className="w-4 h-4 text-yellow-300" />
                      <span className="text-yellow-300 font-medium">{slide.subtitle}</span>
                    </div>
                    
                    <h1 className="text-5xl lg:text-7xl font-bold leading-tight bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-200">
                      {slide.title}
                    </h1>
                    
                    <p className="text-xl text-gray-200 leading-relaxed max-w-lg">
                      {slide.description}
                    </p>

                    {/* Features */}
                    <div className="flex flex-wrap gap-3">
                      {slide.features.map((feature, idx) => (
                        <span
                          key={idx}
                          className="px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full text-sm font-medium border border-white/20"
                        >
                          {feature}
                        </span>
                      ))}
                    </div>

                    {/* CTA Buttons */}
                    <div className="flex flex-col sm:flex-row gap-4 pt-4">
                      <button className="group bg-white text-gray-900 px-8 py-4 rounded-full font-semibold text-lg hover:bg-gray-100 transition-all duration-300 flex items-center justify-center space-x-2 shadow-xl hover:shadow-2xl transform hover:-translate-y-1">
                        <span>{slide.cta}</span>
                        <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                      </button>
                      
                      <button className="group border-2 border-white/30 text-white px-8 py-4 rounded-full font-semibold text-lg hover:bg-white/10 transition-all duration-300 flex items-center justify-center space-x-2 backdrop-blur-sm">
                        <Play className="w-5 h-5" />
                        <span>{slide.ctaSecondary}</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Right Content - Stats */}
            <div className="text-white">
              {slides.map((slide, index) => (
                <div
                  key={slide.id}
                  className={`transition-all duration-700 delay-300 ${
                    index === currentSlide 
                      ? 'opacity-100 translate-x-0' 
                      : 'opacity-0 translate-x-8'
                  }`}
                  style={{ display: index === currentSlide ? 'block' : 'none' }}
                >
                  <div className="grid grid-cols-1 gap-8">
                    {slide.stats.map((stat, idx) => (
                      <div
                        key={idx}
                        className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20 hover:bg-white/15 transition-all duration-300 group"
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <div className="text-4xl font-bold text-white group-hover:scale-110 transition-transform">
                              {stat.value}
                            </div>
                            <div className="text-gray-300 font-medium mt-2">
                              {stat.label}
                            </div>
                          </div>
                          <div className="text-white/30">
                            {idx === 0 && <Users className="w-8 h-8" />}
                            {idx === 1 && <Star className="w-8 h-8" />}
                            {idx === 2 && <Award className="w-8 h-8" />}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Controls */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-20">
        <div className="flex items-center space-x-4">
          {/* Slide Indicators */}
          <div className="flex space-x-2">
            {slides.map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  index === currentSlide 
                    ? 'bg-white scale-125' 
                    : 'bg-white/40 hover:bg-white/60'
                }`}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Arrow Navigation */}
      <button
        onClick={prevSlide}
        onMouseEnter={() => setIsAutoPlaying(false)}
        onMouseLeave={() => setIsAutoPlaying(true)}
        className="absolute left-4 top-1/2 transform -translate-y-1/2 z-20 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full p-3 text-white hover:bg-white/20 transition-all duration-300 group"
      >
        <ChevronLeft className="w-6 h-6 group-hover:-translate-x-1 transition-transform" />
      </button>

      <button
        onClick={nextSlide}
        onMouseEnter={() => setIsAutoPlaying(false)}
        onMouseLeave={() => setIsAutoPlaying(true)}
        className="absolute right-4 top-1/2 transform -translate-y-1/2 z-20 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full p-3 text-white hover:bg-white/20 transition-all duration-300 group"
      >
        <ChevronRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
      </button>

      {/* Auto-play indicator */}
      <div className="absolute top-4 right-4 z-20">
        <button
          onClick={() => setIsAutoPlaying(!isAutoPlaying)}
          className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-full p-2 text-white hover:bg-white/20 transition-all duration-300"
        >
          <div className={`w-2 h-2 rounded-full ${isAutoPlaying ? 'bg-green-400' : 'bg-red-400'}`} />
        </button>
      </div>
    </div>
  );
}