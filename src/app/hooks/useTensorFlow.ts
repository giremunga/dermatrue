"use client"

import { useState, useEffect } from "react"
import * as tf from "@tensorflow/tfjs"
import * as faceLandmarksDetection from "@tensorflow-models/face-landmarks-detection"

export const useTensorFlow = () => {
  const [isLoading, setIsLoading] = useState(true)
  const [faceDetector, setFaceDetector] = useState<faceLandmarksDetection.FaceLandmarksDetector | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const initializeTensorFlow = async () => {
      try {
        setIsLoading(true)
        setError(null)

        // Initialize TensorFlow
        await tf.ready()
        console.log("TensorFlow.js initialized")

        // Load face detection model
        const model = faceLandmarksDetection.SupportedModels.MediaPipeFaceMesh
        const detectorConfig = {
          runtime: "tfjs" as const,
          refineLandmarks: true,
          maxFaces: 1,
        }

        const detector = await faceLandmarksDetection.createDetector(model, detectorConfig)
        setFaceDetector(detector)

        console.log("Face detection model loaded")
        setIsLoading(false)
      } catch (err) {
        console.error("Failed to initialize TensorFlow:", err)
        setError("Failed to load AI models. Please refresh the page and try again.")
        setIsLoading(false)
      }
    }

    initializeTensorFlow()
  }, [])

  return { isLoading, faceDetector, error }
}
