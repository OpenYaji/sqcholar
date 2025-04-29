import { useEffect, useRef, useState } from "react";
import * as faceapi from "face-api.js";
import { Camera, RefreshCw, X, Mail, Check } from "lucide-react";

const FaceVerification = ({ studentId, onSuccess, onCancel }) => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [loading, setLoading] = useState(true);
  const [loadingMessage, setLoadingMessage] = useState("Loading face recognition models...");
  const [verificationStatus, setVerificationStatus] = useState("waiting"); // waiting, verifying, success, failed
  const [emailSent, setEmailSent] = useState(false);
  const [countdown, setCountdown] = useState(null);
  const [canRetry, setCanRetry] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [similarity, setSimilarity] = useState(null);

  useEffect(() => {
    // Load face-api models and start webcam
    const loadModelsAndStartVideo = async () => {
      setLoadingMessage("Loading face recognition models...");
      
      try {
        // Load models from public directory
        await Promise.all([
          faceapi.nets.tinyFaceDetector.loadFromUri('/models'),
          faceapi.nets.faceLandmark68Net.loadFromUri('/models'),
          faceapi.nets.faceRecognitionNet.loadFromUri('/models')
        ]);
        
        setLoadingMessage("Starting camera...");
        
        // Start webcam
        if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
          try {
            const stream = await navigator.mediaDevices.getUserMedia({ 
              video: { 
                facingMode: "user",
                width: { ideal: 640 },
                height: { ideal: 480 } 
              } 
            });
            
            if (videoRef.current) {
              videoRef.current.srcObject = stream;
            }
          } catch (err) {
            console.error("Error accessing webcam:", err);
            setErrorMessage(getWebcamErrorMessage(err));
            setVerificationStatus("failed");
            return;
          }
        } else {
          setErrorMessage("Camera access not supported in this browser.");
          setVerificationStatus("failed");
          return;
        }
        
        setLoading(false);
      } catch (err) {
        console.error("Error loading models:", err);
        setErrorMessage("Failed to load face recognition models. Please try another verification method.");
        setVerificationStatus("failed");
      }
    };

    loadModelsAndStartVideo();

    // Cleanup function to stop webcam
    return () => {
      if (videoRef.current && videoRef.current.srcObject) {
        const tracks = videoRef.current.srcObject.getTracks();
        tracks.forEach(track => track.stop());
      }
    };
  }, []);

  // Helper function to get more user-friendly webcam error messages
  const getWebcamErrorMessage = (error) => {
    if (error.name === "NotAllowedError" || error.name === "PermissionDeniedError") {
      return "Camera access denied. Please allow camera access and try again.";
    } else if (error.name === "NotFoundError" || error.name === "DevicesNotFoundError") {
      return "No camera found. Please connect a camera and try again.";
    } else if (error.name === "NotReadableError" || error.name === "TrackStartError") {
      return "Camera is in use by another application. Please close other applications using the camera.";
    } else if (error.name === "OverconstrainedError") {
      return "Camera cannot satisfy the requested constraints. Please try a different camera.";
    } else if (error.name === "TypeError") {
      return "No camera available or access denied.";
    }
    return "Could not access webcam. Please check your camera settings and try again.";
  };

  // Function to handle when video is playing
  const handleVideoPlay = async () => {
    if (!videoRef.current) return;
    
    const canvas = canvasRef.current;
    const displaySize = { width: videoRef.current.width, height: videoRef.current.height };
    faceapi.matchDimensions(canvas, displaySize);
    
    // Start a 3-second countdown
    let count = 3;
    setCountdown(count);
    
    const countdownInterval = setInterval(() => {
      count -= 1;
      setCountdown(count);
      
      if (count <= 0) {
        clearInterval(countdownInterval);
        captureAndVerify();
      }
    }, 1000);
  };

  // Basic liveness detection - checks for movements between frames
  const detectLiveness = async () => {
    // This is a simplified implementation
    // A real liveness detection would be more sophisticated
    
    // Take two face detections 300ms apart and compare them
    const detection1 = await faceapi.detectSingleFace(
      videoRef.current, 
      new faceapi.TinyFaceDetectorOptions()
    ).withFaceLandmarks();
    
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const detection2 = await faceapi.detectSingleFace(
      videoRef.current, 
      new faceapi.TinyFaceDetectorOptions()
    ).withFaceLandmarks();
    
    if (!detection1 || !detection2) return false;
    
    // Check for slight natural movements between frames
    const landmarks1 = detection1.landmarks.positions;
    const landmarks2 = detection2.landmarks.positions;
    
    let differenceSum = 0;
    for (let i = 0; i < landmarks1.length; i++) {
      const dx = landmarks1[i].x - landmarks2[i].x;
      const dy = landmarks1[i].y - landmarks2[i].y;
      differenceSum += Math.sqrt(dx * dx + dy * dy);
    }
    
    // Some small movement is expected for a live person due to natural movement
    const avgDifference = differenceSum / landmarks1.length;
    
    // Range for natural movement: not too still (potential photo) and not too much movement
    return avgDifference > 0.5 && avgDifference < 5;
  };

  // Capture the image and verify face
  const captureAndVerify = async () => {
    setVerificationStatus("verifying");
    setLoadingMessage("Verifying your identity...");
    
    try {
      // Check if the person is live (not a photo)
      const isLive = await detectLiveness();
      if (!isLive) {
        setVerificationStatus("failed");
        setErrorMessage("Liveness check failed. Please ensure you're not using a photo and try again.");
        setCanRetry(true);
        return;
      }
      
      // Detect face in current video frame
      const detections = await faceapi.detectSingleFace(
        videoRef.current, 
        new faceapi.TinyFaceDetectorOptions()
      ).withFaceLandmarks().withFaceDescriptor();
      
      if (!detections) {
        setVerificationStatus("failed");
        setErrorMessage("No face detected. Please ensure your face is clearly visible and well-lit.");
        setCanRetry(true);
        return;
      }
      
      // Draw face detection results on canvas
      const canvas = canvasRef.current;
      const displaySize = { width: videoRef.current.width, height: videoRef.current.height };
      const resizedDetections = faceapi.resizeResults(detections, displaySize);
      
      canvas.getContext('2d').clearRect(0, 0, canvas.width, canvas.height);
      faceapi.draw.drawDetections(canvas, resizedDetections);
      faceapi.draw.drawFaceLandmarks(canvas, resizedDetections);
      
      // Send face descriptor to backend for verification
      const faceDescriptor = detections.descriptor;
      const response = await fetch(`http://localhost:5000/verify-face/${studentId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ faceDescriptor: Array.from(faceDescriptor) }),
      });
      
      const data = await response.json();
      
      if (data.verified) {
        setSimilarity(data.similarity ? Math.round(data.similarity * 100) : null);
        setVerificationStatus("success");
        setLoadingMessage("Identity verified! Redirecting...");
        
        // If this is the first time this student is using face verification,
        // give them a little more time to see the success message
        const delay = data.message?.includes("registered") ? 2500 : 1500;
        setTimeout(() => onSuccess(), delay);
      } else {
        setErrorMessage("Face verification failed. Your face doesn't match our records.");
        setVerificationStatus("failed");
        setCanRetry(true);
      }
    } catch (error) {
      console.error("Error during face verification:", error);
      setErrorMessage("An error occurred during verification. Please try again or use email verification.");
      setVerificationStatus("failed");
      setCanRetry(true);
    }
  };

  // Reset and retry face verification
  const retryVerification = () => {
    setVerificationStatus("waiting");
    setErrorMessage("");
    setCanRetry(false);
    setCountdown(null);
  };

  // Send email verification
  const sendEmailVerification = async () => {
    setLoadingMessage("Sending email verification...");
    
    try {
      const response = await fetch(`http://localhost:5000/send-verification-email/${studentId}`, {
        method: 'POST',
      });
      
      const data = await response.json();
      
      if (data.success) {
        setEmailSent(true);
        setLoadingMessage(`Verification email sent to ${data.email}`);
      } else {
        setErrorMessage("Failed to send verification email. Please try again.");
      }
    } catch (error) {
      console.error("Error sending verification email:", error);
      setErrorMessage("Error sending verification email. Please try again later.");
    }
  };

  return (
    <div className="max-w-md w-full mx-auto bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
      <h2 className="text-xl font-bold text-center text-gray-800 dark:text-white mb-4">
        {verificationStatus === "success" ? "Verification Successful" : "Face Verification"}
      </h2>
      
      {loading ? (
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-300">{loadingMessage}</p>
        </div>
      ) : verificationStatus === "waiting" ? (
        <div className="text-center">
          <div className="relative mx-auto mb-4 bg-gray-200 dark:bg-gray-700 rounded-lg overflow-hidden w-64 h-48">
            <video
              ref={videoRef}
              width="320"
              height="240"
              autoPlay
              muted
              onPlay={handleVideoPlay}
              className="absolute inset-0 w-full h-full object-cover"
            />
            <canvas
              ref={canvasRef}
              width="320"
              height="240"
              className="absolute inset-0 w-full h-full"
            />
            {countdown !== null && (
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-6xl font-bold text-white bg-black bg-opacity-30 rounded-full w-20 h-20 flex items-center justify-center">
                  {countdown}
                </span>
              </div>
            )}
          </div>
          <p className="text-gray-600 dark:text-gray-300 mb-4">
            Please look directly at the camera and ensure your face is clearly visible
          </p>
          <div className="flex justify-center space-x-4">
            <Camera size={20} className="text-blue-500" />
            <span className="text-sm text-gray-500">Make sure you're in a well-lit area</span>
          </div>
        </div>
      ) : verificationStatus === "verifying" ? (
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-300">{loadingMessage}</p>
        </div>
      ) : verificationStatus === "success" ? (
        <div className="text-center py-8">
          <div className="h-16 w-16 rounded-full bg-green-500 flex items-center justify-center mx-auto mb-4">
            <Check size={32} className="text-white" />
          </div>
          <p className="text-gray-700 dark:text-gray-300 font-medium text-lg mb-2">Identity Confirmed</p>
          <p className="text-gray-600 dark:text-gray-400 mb-4">{loadingMessage}</p>
          {similarity && (
            <div className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
              Match confidence: {similarity}%
            </div>
          )}
        </div>
      ) : (
        <div className="text-center py-4">
          <div className="h-16 w-16 rounded-full bg-red-500 flex items-center justify-center mx-auto mb-4">
            <X size={32} className="text-white" />
          </div>
          <p className="text-gray-700 dark:text-gray-200 font-medium text-lg mb-2">Verification Failed</p>
          <p className="text-red-600 dark:text-red-400 mb-6">{errorMessage}</p>
          
          {canRetry && (
            <button
              onClick={retryVerification}
              className="w-full flex items-center justify-center bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md mb-3"
            >
              <RefreshCw size={18} className="mr-2" />
              Try Again
            </button>
          )}
          
          {!emailSent ? (
            <div>
              <button
                onClick={sendEmailVerification}
                className="w-full flex items-center justify-center bg-gray-700 hover:bg-gray-800 text-white font-medium py-2 px-4 rounded-md mb-3"
              >
                <Mail size={18} className="mr-2" />
                Send Email Verification
              </button>
              <button
                onClick={onCancel}
                className="w-full bg-gray-300 hover:bg-gray-400 text-gray-800 font-medium py-2 px-4 rounded-md"
              >
                Cancel
              </button>
            </div>
          ) : (
            <div>
              <div className="bg-blue-100 dark:bg-blue-900 border-l-4 border-blue-500 text-blue-700 dark:text-blue-300 p-4 mb-4">
                <p className="text-sm">
                  Check your email for verification link. If you don't see it, check your spam folder.
                </p>
              </div>
              <button
                onClick={onCancel}
                className="w-full bg-gray-300 hover:bg-gray-400 text-gray-800 font-medium py-2 px-4 rounded-md"
              >
                Back to Login
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default FaceVerification;