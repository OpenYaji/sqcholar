// FaceVerification.jsx - New component for face verification
import { useEffect, useRef, useState } from "react";
import * as faceapi from "face-api.js";

const FaceVerification = ({ studentId, onSuccess, onCancel }) => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [loading, setLoading] = useState(true);
  const [loadingMessage, setLoadingMessage] = useState("Loading face recognition models...");
  const [verificationStatus, setVerificationStatus] = useState("waiting"); // waiting, verifying, success, failed
  const [emailSent, setEmailSent] = useState(false);
  const [countdown, setCountdown] = useState(null);

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
            const stream = await navigator.mediaDevices.getUserMedia({ video: true });
            if (videoRef.current) {
              videoRef.current.srcObject = stream;
            }
          } catch (err) {
            console.error("Error accessing webcam:", err);
            setLoadingMessage("Could not access webcam. Please enable camera access.");
            setTimeout(() => {
              setVerificationStatus("failed");
              setLoadingMessage("Face verification unavailable. Try email verification.");
            }, 2000);
            return;
          }
        } else {
          setLoadingMessage("Camera access not supported in this browser.");
          setTimeout(() => {
            setVerificationStatus("failed");
            setLoadingMessage("Face verification unavailable. Try email verification.");
          }, 2000);
          return;
        }
        
        setLoading(false);
      } catch (err) {
        console.error("Error loading models:", err);
        setLoadingMessage("Failed to load face recognition. Try email verification.");
        setTimeout(() => {
          setVerificationStatus("failed");
          setLoadingMessage("Face verification unavailable. Try email verification.");
        }, 2000);
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

  // Capture the image and verify face
  const captureAndVerify = async () => {
    setVerificationStatus("verifying");
    setLoadingMessage("Verifying your identity...");
    
    try {
      // Detect face in current video frame
      const detections = await faceapi.detectSingleFace(
        videoRef.current, 
        new faceapi.TinyFaceDetectorOptions()
      ).withFaceLandmarks().withFaceDescriptor();
      
      if (!detections) {
        setVerificationStatus("failed");
        setLoadingMessage("No face detected. Please ensure your face is visible.");
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
        setVerificationStatus("success");
        setLoadingMessage("Identity verified! Redirecting...");
        setTimeout(() => onSuccess(), 1500);
      } else {
        setVerificationStatus("failed");
        setLoadingMessage("Face verification failed. Try email verification instead.");
      }
    } catch (error) {
      console.error("Error during face verification:", error);
      setVerificationStatus("failed");
      setLoadingMessage("An error occurred during verification. Try email verification.");
    }
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
        setLoadingMessage("Failed to send verification email. Please try again.");
      }
    } catch (error) {
      console.error("Error sending verification email:", error);
      setLoadingMessage("Error sending verification email. Please try again later.");
    }
  };

  return (
    <div className="max-w-md w-full mx-auto bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
      <h2 className="text-xl font-bold text-center text-gray-800 dark:text-white mb-4">Face Verification</h2>
      
      {loading || verificationStatus === "verifying" ? (
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-300">{loadingMessage}</p>
        </div>
      ) : verificationStatus === "waiting" ? (
        <div className="text-center">
          <div className="relative mx-auto mb-4 bg-gray-200 rounded-lg overflow-hidden w-64 h-48">
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
            Please look at the camera for face verification
          </p>
        </div>
      ) : verificationStatus === "success" ? (
        <div className="text-center py-8">
          <div className="h-12 w-12 rounded-full bg-green-500 flex items-center justify-center mx-auto mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <p className="text-gray-600 dark:text-gray-300">{loadingMessage}</p>
        </div>
      ) : (
        <div className="text-center py-4">
          <div className="h-12 w-12 rounded-full bg-red-500 flex items-center justify-center mx-auto mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>
          <p className="text-gray-600 dark:text-gray-300 mb-6">{loadingMessage}</p>
          
          {!emailSent ? (
            <div>
              <button
                onClick={sendEmailVerification}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md mb-3"
              >
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
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                Check your email for verification link
              </p>
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