"use client"

import { useState, useRef, useEffect, useCallback } from "react"

interface CaptureMode {
  id: string
  name: string
  description: string
  icon: string
  instructions: string[]
}

interface AnalysisResult {
  skinType: string
  concerns: string[]
  recommendations: string[]
  confidence: number
  skinHealth: number
}

const SkinAnalysisPage = () => {
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [isLoading, setIsLoading] = useState(false) // Set to false initially as TF is commented out
  const [isCameraActive, setIsCameraActive] = useState(false)
  const [currentMode, setCurrentMode] = useState("face")
  const [capturedImages, setCapturedImages] = useState<string[]>([])
  const [analysisProgress, setAnalysisProgress] = useState(0)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [analysisResults, setAnalysisResults] = useState<AnalysisResult | null>(null)
  const [faceDetector, setFaceDetector] = useState<any>(null) // Will remain null if TF is commented out
  const [stream, setStream] = useState<MediaStream | null>(null)
  const [faceDetected, setFaceDetected] = useState(false)
  const [tfError, setTfError] = useState<string | null>(null) // Will remain null if TF is commented out
  const [cameraError, setCameraError] = useState<string>("")
  const [debugInfo, setDebugInfo] = useState<string[]>([])

  // Add debug logging
  const addDebugLog = (message: string) => {
    console.log(`[Camera Debug]: ${message}`)
    setDebugInfo(prev => [...prev.slice(-5), `${new Date().toLocaleTimeString()}: ${message}`]) // Keep last 5 logs
  }

  const captureModes: CaptureMode[] = [
    {
      id: "face",
      name: "Full Face",
      description: "Capture your entire face for overall skin analysis",
      icon: "😊",
      instructions: [
        "Position your face in the center of the frame",
        "Ensure good lighting from the front",
        "Keep your face straight and relaxed",
        "Remove glasses if possible",
      ],
    },
    {
      id: "forehead",
      name: "Forehead Close-up",
      description: "Focus on forehead area for texture and pore analysis",
      icon: "🧠",
      instructions: [
        "Move closer to capture forehead details",
        "Ensure the forehead fills most of the frame",
        "Use natural lighting",
        "Keep the camera steady",
      ],
    },
    {
      id: "cheek",
      name: "Cheek Analysis",
      description: "Capture cheek area for pigmentation and texture",
      icon: "😌",
      instructions: [
        "Turn slightly to show cheek profile",
        "Focus on one cheek at a time",
        "Ensure even lighting",
        "Capture both left and right cheeks",
      ],
    },
    {
      id: "eye",
      name: "Eye Area",
      description: "Analyze under-eye area and fine lines",
      icon: "👁️",
      instructions: [
        "Focus on the eye and surrounding area",
        "Keep eyes open and relaxed",
        "Capture both eye areas",
        "Avoid shadows from eyebrows",
      ],
    },
  ]

  // Initialize TensorFlow and face detection model
  useEffect(() => {
    const initializeTensorFlow = async () => {
      try {
        setIsLoading(true)
        setTfError(null)
        addDebugLog("Starting TensorFlow initialization...")

        // --- TEMPORARILY COMMENTING OUT TENSORFLOW INITIALIZATION ---
        // This allows us to debug camera display issues without waiting for TF models.
        // Uncomment this block when you want to re-enable AI analysis.
        /*
        const tf = await import("@tensorflow/tfjs")
        const faceLandmarksDetection = await import("@tensorflow-models/face-landmarks-detection")

        await tf.ready()
        addDebugLog("TensorFlow.js initialized successfully")

        const model = faceLandmarksDetection.SupportedModels.MediaPipeFaceMesh
        const detectorConfig = {
          runtime: "tfjs" as const,
          refineLandmarks: true,
        }

        const detector = await faceLandmarksDetection.createDetector(model, detectorConfig)
        setFaceDetector(detector)
        addDebugLog("Face detection model loaded successfully")
        */
        // --- END TEMPORARY COMMENT OUT ---

        // For now, just set loading to false and faceDetector to null
        setIsLoading(false)
        setFaceDetector(null); // Ensure faceDetector is null if TF is skipped
        addDebugLog("TensorFlow initialization skipped for debugging camera.")

      } catch (error) {
        console.error("Failed to initialize TensorFlow:", error)
        addDebugLog(`TensorFlow initialization failed: ${error}`)
        setTfError("Failed to load AI models. Please ensure you have a stable internet connection and try refreshing the page.")
        setIsLoading(false)
      }
    }

    if (typeof window !== "undefined") {
      initializeTensorFlow()
    }
  }, [])

  // Periodic debug check for video element state
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (isCameraActive && videoRef.current) {
      addDebugLog("Starting periodic video state check...");
      interval = setInterval(() => {
        if (videoRef.current) {
          addDebugLog(`[Periodic Check] ReadyState: ${videoRef.current.readyState}, Paused: ${videoRef.current.paused}, Ended: ${videoRef.current.ended}, CurrentTime: ${videoRef.current.currentTime.toFixed(2)}`);
        }
      }, 1000); // Log every second
    } else {
      addDebugLog("Stopping periodic video state check.");
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isCameraActive]);

  // Check camera permissions and devices
  const checkCameraSupport = async () => {
    try {
      addDebugLog("Checking camera support...")
      
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error("Camera API not supported in this browser")
      }

      const devices = await navigator.mediaDevices.enumerateDevices()
      const videoDevices = devices.filter(device => device.kind === 'videoinput')
      addDebugLog(`Found ${videoDevices.length} video devices`)

      const permissionStatus = await navigator.permissions.query({ name: 'camera' as PermissionName })
      addDebugLog(`Camera permission status: ${permissionStatus.state}`)

      return { supported: true, devices: videoDevices, permission: permissionStatus.state }
    } catch (error) {
      addDebugLog(`Camera support check failed: ${error}`)
      return { supported: false, error }
    }
  }

  // Start camera with comprehensive error handling
  const startCamera = async () => {
    try {
      setCameraError("")
      addDebugLog("Attempting to start camera...")
      
      if (stream) {
        addDebugLog("Stopping existing stream...")
        stream.getTracks().forEach((track) => {
          addDebugLog(`Stopping track: ${track.label}`)
          track.stop()
        })
        setStream(null)
      }

      const supportCheck = await checkCameraSupport()
      if (!supportCheck.supported) {
        throw new Error(`Camera not supported: ${supportCheck.error}`)
      }

      addDebugLog("Requesting camera access...")
      
      const constraints = {
        video: {
          width: { ideal: 1280, min: 640 },
          height: { ideal: 720, min: 480 },
          facingMode: "user"
        },
        audio: false
      }

      const mediaStream = await navigator.mediaDevices.getUserMedia(constraints)
      addDebugLog("Camera stream obtained successfully")
      
      const videoTracks = mediaStream.getVideoTracks()
      if (videoTracks.length > 0) {
        const track = videoTracks[0]
        addDebugLog(`Video track: ${track.label}, enabled: ${track.enabled}, readyState: ${track.readyState}`)
        
        const settings = track.getSettings()
        addDebugLog(`Video settings: ${settings.width}x${settings.height}`)
      }

      if (videoRef.current) {
        addDebugLog("Setting video source object...")
        videoRef.current.srcObject = mediaStream
        setStream(mediaStream)
        
        // Clear previous event listeners to prevent duplicates
        videoRef.current.onloadedmetadata = null;
        videoRef.current.onplaying = null;
        videoRef.current.onerror = null;

        videoRef.current.onloadedmetadata = () => {
          addDebugLog("Video metadata loaded. Attempting to play.")
          if (videoRef.current) {
            videoRef.current.play()
              .then(() => {
                addDebugLog("Video play promise resolved.")
                // Set canvas dimensions
                if (canvasRef.current && videoRef.current) {
                  canvasRef.current.width = videoRef.current.videoWidth
                  canvasRef.current.height = videoRef.current.videoHeight
                  addDebugLog(`Canvas dimensions set: ${canvasRef.current.width}x${canvasRef.current.height}`)
                }
              })
              .catch((playError) => {
                addDebugLog(`Video play error: ${playError.name} - ${playError.message}`)
                setCameraError(`Failed to start video playback: ${playError.message}. Check browser console for details.`)
              })
          }
        }

        videoRef.current.onplaying = () => {
          addDebugLog("Video is actually playing (onplaying event fired).")
          setIsCameraActive(true)
          setCameraError("") // Clear any previous camera errors once playing
          if (faceDetector) { // Only attempt face detection if faceDetector is loaded
            addDebugLog("Starting face detection loop.")
            detectFaces();
          } else {
            addDebugLog("Face detector not available, skipping detection loop.")
            setFaceDetected(true); // Assume face is "detected" for UI purposes if no detector
          }
        }

        videoRef.current.onerror = (event) => {
          const target = event.target as HTMLVideoElement;
          let errorMsg = "Unknown video error";
          if (target && target.error) {
            switch (target.error.code) {
              case target.error.MEDIA_ERR_ABORTED: errorMsg = "Video playback aborted."; break;
              case target.error.MEDIA_ERR_NETWORK: errorMsg = "Network error during video playback."; break;
              case target.error.MEDIA_ERR_DECODE: errorMsg = "Video decoding error."; break;
              case target.error.MEDIA_ERR_SRC_NOT_SUPPORTED: errorMsg = "Video source not supported."; break;
              default: errorMsg = `Media error code: ${target.error.code}`;
            }
          }
          addDebugLog(`Video element error: ${errorMsg}`);
          setCameraError(`Video playback error: ${errorMsg}. This might indicate a hardware or driver issue.`);
          setIsCameraActive(false); // Ensure camera is marked inactive on error
        };

        // Fallback to set camera active if onplaying doesn't fire (e.g., due to browser quirks)
        setTimeout(() => {
          if (videoRef.current && videoRef.current.readyState >= HTMLMediaElement.HAVE_FUTURE_DATA && !isCameraActive) {
            addDebugLog("Fallback: onplaying event did not fire, forcing camera active.")
            setIsCameraActive(true);
            setCameraError("Camera started, but video playback event was delayed. If you see a black screen, try refreshing.")
            if (faceDetector) {
              detectFaces();
            } else {
              setFaceDetected(true); // Assume face is "detected" for UI purposes if no detector
            }
          } else if (!videoRef.current || videoRef.current.paused || videoRef.current.ended) {
            addDebugLog("Fallback check: Video is still not playing after timeout.")
            if (!cameraError) { // Only set generic error if no specific error already
              setCameraError("Camera stream obtained but video is not playing. Try refreshing or checking browser settings.")
            }
          }
        }, 2000); // 2 second timeout
      }
    } catch (error: any) {
      addDebugLog(`Camera access error: ${error.name} - ${error.message}`)
      let errorMessage = "Camera access failed: "
      
      switch (error.name) {
        case 'NotAllowedError':
          errorMessage += "Permission denied. Please allow camera access and refresh the page."
          break
        case 'NotFoundError':
          errorMessage += "No camera found on this device."
          break
        case 'NotReadableError':
          errorMessage += "Camera is being used by another application. Please close other apps using the camera."
          break
        case 'OverconstrainedError':
          errorMessage += "Camera doesn't support the requested settings."
          break
        case 'SecurityError':
          errorMessage += "Camera access blocked due to security restrictions (e.g., not on HTTPS)."
          break
        default:
          errorMessage += error.message || "Unknown error occurred."
      }
      
      setCameraError(errorMessage)
      setIsCameraActive(false) // Ensure camera is marked inactive on error
    }
  }

  // Stop camera
  const stopCamera = () => {
    addDebugLog("Stopping camera...")
    if (stream) {
      stream.getTracks().forEach((track) => {
        addDebugLog(`Stopping track: ${track.label}`)
        track.stop()
      })
      setStream(null)
    }
    
    if (videoRef.current) {
      videoRef.current.srcObject = null
    }
    
    setIsCameraActive(false)
    setFaceDetected(false)
    setCameraError("")
    addDebugLog("Camera stopped")
  }

  // Face detection loop
  const detectFaces = useCallback(async () => {
    // If faceDetector is null (because TF is commented out), skip detection
    if (!videoRef.current || !canvasRef.current || !faceDetector || !isCameraActive) {
      return
    }

    try {
      const faces = await faceDetector.estimateFaces(videoRef.current)
      const canvas = canvasRef.current
      const ctx = canvas.getContext("2d")

      if (!ctx) return

      // Clear canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      if (faces.length > 0) {
        setFaceDetected(true)

        // Draw simple face detection rectangle
        ctx.strokeStyle = "#10B981"
        ctx.lineWidth = 3
        
        // Draw a rectangle around the detected area
        const padding = 50
        ctx.strokeRect(padding, padding, canvas.width - (padding * 2), canvas.height - (padding * 2))

        // Draw capture area based on mode
        drawCaptureArea(ctx, currentMode)
      } else {
        setFaceDetected(false)
      }

      // Continue detection loop
      if (isCameraActive) {
        requestAnimationFrame(detectFaces)
      }
    } catch (error) {
      console.error("Face detection error:", error)
      addDebugLog(`Face detection loop error: ${error}`)
    }
  }, [faceDetector, isCameraActive, currentMode])

  // Draw capture area overlay
  const drawCaptureArea = (ctx: CanvasRenderingContext2D, mode: string) => {
    ctx.strokeStyle = "#F59E0B"
    ctx.lineWidth = 3
    ctx.setLineDash([10, 5])

    const centerX = ctx.canvas.width / 2
    const centerY = ctx.canvas.height / 2

    switch (mode) {
      case "face":
        ctx.strokeRect(centerX - 150, centerY - 200, 300, 400)
        break
      case "forehead":
        ctx.strokeRect(centerX - 150, centerY - 200, 300, 100)
        break
      case "cheek":
        ctx.strokeRect(centerX - 100, centerY - 50, 200, 150)
        break
      case "eye":
        ctx.strokeRect(centerX - 120, centerY - 100, 240, 80)
        break
    }

    ctx.setLineDash([])
  }

  // Capture photo
  const capturePhoto = () => {
    if (!videoRef.current) {
      addDebugLog("Cannot capture photo - video not available")
      return
    }

    addDebugLog("Capturing photo...")
    const canvas = document.createElement("canvas")
    const ctx = canvas.getContext("2d")

    if (!ctx) return

    canvas.width = videoRef.current.videoWidth
    canvas.height = videoRef.current.videoHeight

    // Draw the video frame to canvas
    ctx.drawImage(videoRef.current, 0, 0)

    const imageData = canvas.toDataURL("image/jpeg", 0.8)
    setCapturedImages((prev) => [...prev, imageData])
    addDebugLog("Photo captured successfully")
  }

  // Start AI analysis (mock implementation for frontend-only)
  const startAnalysis = async () => {
    if (capturedImages.length === 0) {
      alert("Please capture at least one photo before starting analysis.")
      return
    }

    setIsAnalyzing(true)
    setAnalysisProgress(0)

    // Simulate AI processing with progress updates
    const steps = [
      "Preprocessing images...",
      "Detecting skin features...",
      "Analyzing skin texture...",
      "Identifying concerns...",
      "Generating recommendations...",
      "Finalizing results...",
    ]

    for (let i = 0; i < steps.length; i++) {
      await new Promise((resolve) => setTimeout(resolve, 1500))
      setAnalysisProgress(((i + 1) / steps.length) * 100)
    }

    // Mock analysis results (replace with real API call when backend is ready)
    const mockResults: AnalysisResult = {
      skinType: "Combination",
      concerns: ["Mild Acne", "Uneven Skin Tone", "Large Pores"],
      recommendations: [
        "Use a gentle cleanser twice daily",
        "Apply niacinamide serum for pore control",
        "Use sunscreen daily (SPF 30+)",
        "Consider retinol for texture improvement",
        "Hydrate with a lightweight moisturizer",
      ],
      confidence: 87,
      skinHealth: 72,
    }

    setAnalysisResults(mockResults)
    setIsAnalyzing(false)
  }

  // Reset analysis
  const resetAnalysis = () => {
    setCapturedImages([])
    setAnalysisResults(null)
    setAnalysisProgress(0)
    setIsAnalyzing(false)
  }

  // This useEffect is now only relevant if faceDetector is NOT null (i.e., TF is enabled)
  // If TF is commented out, faceDetector will be null, and detectFaces won't run.
  // The UI will show "Position Your Face" but won't actively detect.
  useEffect(() => {
    if (isCameraActive && faceDetector) {
      detectFaces()
    }
  }, [isCameraActive, faceDetector, detectFaces])

  // If TensorFlow initialization is commented out, isLoading will be false immediately.
  // This block will only show if you uncomment TensorFlow and it's still loading.
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-indigo-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-pink-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Initializing AI Models</h2>
          <p className="text-gray-600">Loading TensorFlow.js and face detection models...</p>
        </div>
      </div>
    )
  }

  // If TensorFlow initialization is commented out, tfError will be null.
  // This block will only show if you uncomment TensorFlow and it fails to load.
  if (tfError) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-indigo-50 flex items-center justify-center">
        <div className="text-center max-w-md">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-2xl">⚠️</span>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">AI Models Failed to Load</h2>
          <p className="text-gray-600 mb-4">{tfError}</p>
          <button
            onClick={() => window.location.reload()}
            className="bg-gradient-to-r from-pink-500 to-purple-600 text-white font-medium py-3 px-6 rounded-xl hover:from-pink-600 hover:to-purple-700 transition-all duration-300"
          >
            Retry
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-indigo-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-gray-900 mb-4">
            AI Skin{" "}
            <span className="bg-gradient-to-r from-pink-500 to-purple-600 bg-clip-text text-transparent">Analysis</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Advanced AI-powered skin analysis using computer vision and machine learning to provide personalized
            skincare recommendations.
          </p>
        </div>
        </div>

        {/* Debug Panel - Remove this in production */}
        {debugInfo.length > 0 && (
          <div className="mb-6 bg-gray-100 rounded-lg p-4">
            <h3 className="font-semibold text-gray-800 mb-2">Debug Log:</h3>
            <div className="text-sm text-gray-600 space-y-1 max-h-32 overflow-y-auto">
              {debugInfo.map((log, index) => (
                <div key={index} className="font-mono">{log}</div>
              ))}
            </div>
          </div>
        )}

        {!analysisResults ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Camera Interface */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-3xl shadow-xl overflow-hidden">
                <div className="p-6 border-b border-gray-200">
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">Camera Interface</h2>
                  <p className="text-gray-600">
                    Position yourself according to the selected capture mode and take photos for analysis.
                  </p>
                </div>

                <div className="relative">
                  {isCameraActive ? (
                    <div className="relative bg-black">
                      <video
                        ref={videoRef}
                        autoPlay
                        playsInline
                        muted
                        width={1280} // Explicit width
                        height={720} // Explicit height
                        className="w-full h-auto" // Changed from h-96 object-cover
                        style={{
                          transform: 'scaleX(-1)',
                          backgroundColor: '#000',
                          maxWidth: '100%', // Ensure it fits within its container
                          display: 'block' // Ensure it behaves as a block element
                        }}
                      />
                      <canvas
                        ref={canvasRef}
                        className="absolute inset-0 w-full h-96 pointer-events-none"
                        style={{
                          transform: 'scaleX(-1)',
                          mixBlendMode: "screen"
                        }}
                      />

                      {/* Camera Status Overlay */}
                      <div className="absolute top-4 left-4 z-10">
                        <div
                          className={`flex items-center space-x-2 px-3 py-2 rounded-full backdrop-blur-sm ${
                            faceDetected ? "bg-green-500/80 text-white" : "bg-red-500/80 text-white"
                          }`}
                        >
                          <div
                            className={`w-2 h-2 rounded-full ${faceDetected ? "bg-white animate-pulse" : "bg-white"}`}
                          />
                          <span className="text-sm font-medium">
                            {faceDetected ? "Face Detected" : "Position Your Face"}
                          </span>
                        </div>
                      </div>

                      {/* Capture Button */}
                      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 z-10">
                        <button
                          onClick={capturePhoto}
                          className="w-16 h-16 bg-white/90 backdrop-blur-sm rounded-full shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center group hover:bg-white"
                        >
                          <div className="w-12 h-12 bg-gradient-to-r from-pink-500 to-purple-600 rounded-full group-hover:scale-110 transition-transform duration-300 flex items-center justify-center">
                            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
                              />
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"
                              />
                            </svg>
                          </div>
                        </button>
                      </div>

                      {/* Stop Camera Button */}
                      <button
                        onClick={stopCamera}
                        className="absolute top-4 right-4 bg-red-500/80 backdrop-blur-sm text-white p-2 rounded-full hover:bg-red-600/90 transition-colors duration-300 z-10"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                  ) : (
                    <div className="h-96 bg-gray-900 flex items-center justify-center">
                      <div className="text-center text-white">
                        <svg
                          className="w-16 h-16 mx-auto mb-4 opacity-50"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
                          />
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"
                          />
                        </svg>
                        <h3 className="text-xl font-semibold mb-2">Camera Not Active</h3>
                        <p className="text-gray-300 mb-4">Start your camera to begin skin analysis</p>
                        <button
                          onClick={startCamera}
                          className="bg-gradient-to-r from-pink-500 to-purple-600 text-white font-medium py-3 px-6 rounded-xl hover:from-pink-600 hover:to-purple-700 transition-all duration-300 transform hover:scale-105"
                        >
                          Start Camera
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Camera Error Display */}
                  {cameraError && (
                    <div className="absolute inset-0 bg-red-50 flex items-center justify-center z-20">
                      <div className="text-center p-6 max-w-md">
                        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                          <span className="text-2xl">⚠️</span>
                        </div>
                        <h3 className="text-lg font-semibold text-red-800 mb-2">Camera Error</h3>
                        <p className="text-red-600 mb-4 text-sm">{cameraError}</p>
                        <div className="space-y-2">
                          <button
                            onClick={startCamera}
                            className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors duration-300 mr-2"
                          >
                            Try Again
                          </button>
                          <button
                            onClick={() => window.location.reload()}
                            className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition-colors duration-300"
                          >
                            Refresh Page
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Captured Images */}
                {capturedImages.length > 0 && (
                  <div className="p-6 border-t border-gray-200">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">
                      Captured Images ({capturedImages.length})
                    </h3>
                    <div className="grid grid-cols-4 gap-4">
                      {capturedImages.map((image, index) => (
                        <div key={index} className="relative group">
                          <img
                            src={image || "/placeholder.svg"}
                            alt={`Captured ${index + 1}`}
                            className="w-full h-20 object-cover rounded-lg"
                          />
                          <button
                            onClick={() => setCapturedImages((prev) => prev.filter((_, i) => i !== index))}
                            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                          >
                            ×
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Controls Panel */}
            <div className="space-y-6">
              {/* Capture Modes */}
              <div className="bg-white rounded-3xl shadow-xl p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-4">Capture Modes</h3>
                <div className="space-y-3">
                  {captureModes.map((mode) => (
                    <button
                      key={mode.id}
                      onClick={() => setCurrentMode(mode.id)}
                      className={`w-full text-left p-4 rounded-xl transition-all duration-300 ${
                        currentMode === mode.id
                          ? "bg-gradient-to-r from-pink-500 to-purple-600 text-white"
                          : "bg-gray-50 hover:bg-gray-100 text-gray-900"
                      }`}
                    >
                      <div className="flex items-center space-x-3">
                        <span className="text-2xl">{mode.icon}</span>
                        <div>
                          <h4 className="font-semibold">{mode.name}</h4>
                          <p className={`text-sm ${currentMode === mode.id ? "text-purple-100" : "text-gray-600"}`}>
                            {mode.description}
                          </p>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Instructions */}
              <div className="bg-white rounded-3xl shadow-xl p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-4">Instructions</h3>
                <div className="space-y-2">
                  {captureModes
                    .find((mode) => mode.id === currentMode)
                    ?.instructions.map((instruction, index) => (
                      <div key={index} className="flex items-start space-x-3">
                        <div className="w-6 h-6 bg-gradient-to-r from-pink-500 to-purple-600 rounded-full flex items-center justify-center text-white text-sm font-bold mt-0.5">
                          {index + 1}
                        </div>
                        <p className="text-gray-700">{instruction}</p>
                      </div>
                    ))}
                </div>
              </div>

              {/* Analysis Controls */}
              <div className="bg-white rounded-3xl shadow-xl p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-4">Analysis</h3>

                {isAnalyzing ? (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-700">Processing...</span>
                      <span className="text-sm font-medium text-purple-600">{Math.round(analysisProgress)}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-gradient-to-r from-pink-500 to-purple-600 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${analysisProgress}%` }}
                      />
                    </div>
                    <p className="text-sm text-gray-600 text-center">AI is analyzing your skin images...</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <button
                      onClick={startAnalysis}
                      disabled={capturedImages.length === 0}
                      className="w-full bg-gradient-to-r from-pink-500 to-purple-600 text-white font-semibold py-3 px-6 rounded-xl hover:from-pink-600 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                    >
                      Start AI Analysis
                    </button>

                    {capturedImages.length > 0 && (
                      <button
                        onClick={resetAnalysis}
                        className="w-full border-2 border-gray-300 text-gray-700 font-medium py-3 px-6 rounded-xl hover:bg-gray-50 transition-all duration-300"
                      >
                        Reset & Start Over
                      </button>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        ) : (
          /* Analysis Results */
          <div className="bg-white rounded-3xl shadow-xl overflow-hidden">
            <div className="bg-gradient-to-r from-pink-500 to-purple-600 p-8 text-white">
              <h2 className="text-3xl font-bold mb-2">Your Skin Analysis Results</h2>
              <p className="text-purple-100">
                Based on AI analysis of {capturedImages.length} captured image{capturedImages.length !== 1 ? "s" : ""}
              </p>
            </div>

            <div className="p-8">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {/* Skin Type */}
                <div className="text-center">
                  <div className="w-20 h-20 bg-gradient-to-r from-pink-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-3xl text-white">✨</span>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">Skin Type</h3>
                  <p className="text-2xl font-semibold text-purple-600">{analysisResults.skinType}</p>
                </div>

                {/* Confidence Score */}
                <div className="text-center">
                  <div className="w-20 h-20 bg-gradient-to-r from-green-500 to-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-3xl text-white">🎯</span>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">Confidence</h3>
                  <p className="text-2xl font-semibold text-green-600">{analysisResults.confidence}%</p>
                </div>

                {/* Skin Health */}
                <div className="text-center">
                  <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-3xl text-white">💎</span>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">Skin Health</h3>
                  <p className="text-2xl font-semibold text-blue-600">{analysisResults.skinHealth}/100</p>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-12">
                {/* Concerns */}
                <div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-6">Identified Concerns</h3>
                  <div className="space-y-3">
                    {analysisResults.concerns.map((concern, index) => (
                      <div key={index} className="flex items-center space-x-3 p-3 bg-red-50 rounded-lg">
                        <div className="w-2 h-2 bg-red-500 rounded-full" />
                        <span className="text-gray-800 font-medium">{concern}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Recommendations */}
                <div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-6">Recommendations</h3>
                <div className="space-y-3">
                  {analysisResults.recommendations.map((recommendation, index) => (
                    <div key={index} className="flex items-start space-x-3 p-3 bg-green-50 rounded-lg">
                      <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center text-white text-sm font-bold mt-0.5">
                        {index + 1}
                      </div>
                      <span className="text-gray-800">{recommendation}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="mt-12 text-center">
              <button
                onClick={resetAnalysis}
                className="bg-gradient-to-r from-pink-500 to-purple-600 text-white font-semibold py-3 px-8 rounded-xl hover:from-pink-600 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 mr-4"
              >
                Start New Analysis
              </button>
              <button className="border-2 border-purple-600 text-purple-600 font-semibold py-3 px-8 rounded-xl hover:bg-purple-50 transition-all duration-300">
                Save Results
              </button>
            </div>
          </div>
          )}
      </div>
    </div>
  )
}

export default SkinAnalysisPage
