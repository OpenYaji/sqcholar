import { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { Check, Loader, AlertTriangle } from "lucide-react";

const EmailVerification = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [verificationStatus, setVerificationStatus] = useState("verifying"); // verifying, success, failed
  const [message, setMessage] = useState("Verifying your email...");
  const [userData, setUserData] = useState(null);
  const token = searchParams.get("token");

  useEffect(() => {
    if (!token) {
      setVerificationStatus("failed");
      setMessage("Invalid verification link. No token provided.");
      return;
    }

    const verifyToken = async () => {
      try {
        const response = await fetch(`http://localhost:5000/verify-email-token/${token}`, {
          method: "GET",
        });

        const data = await response.json();

        if (data.verified) {
          setVerificationStatus("success");
          setMessage("Email verification successful! Redirecting to dashboard...");
          setUserData(data.userData);
          
          // Store authentication info in localStorage
          localStorage.setItem("qcu_authenticated", "true");
          localStorage.setItem("qcu_student_id", data.userData.student_id);
          localStorage.setItem("qcu_user_data", JSON.stringify(data.userData));
          
          // Redirect after short delay
          setTimeout(() => {
            navigate("/dashboard");
          }, 2000);
        } else {
          setVerificationStatus("failed");
          setMessage(data.message || "Email verification failed. Please try again.");
        }
      } catch (error) {
        console.error("Error verifying email token:", error);
        setVerificationStatus("failed");
        setMessage("An error occurred during verification. Please try again.");
      }
    };

    verifyToken();
  }, [token, navigate]);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8">
        <h1 className="text-2xl font-bold text-center text-gray-800 dark:text-white mb-6">
          QCU Email Verification
        </h1>
        
        <div className="text-center">
          {verificationStatus === "verifying" && (
            <div className="py-8">
              <Loader className="h-16 w-16 animate-spin text-blue-500 mx-auto mb-4" />
              <p className="text-gray-600 dark:text-gray-300">{message}</p>
            </div>
          )}
          
          {verificationStatus === "success" && (
            <div className="py-8">
              <div className="h-16 w-16 rounded-full bg-green-500 flex items-center justify-center mx-auto mb-4">
                <Check className="h-8 w-8 text-white" />
              </div>
              <p className="text-gray-700 dark:text-gray-200 font-medium text-lg mb-2">Verification Successful</p>
              <p className="text-gray-600 dark:text-gray-400 mb-4">{message}</p>
              {userData && (
                <div className="bg-gray-100 dark:bg-gray-700 rounded-lg p-4 text-left">
                  <p className="text-gray-800 dark:text-gray-200 font-medium">Welcome back, {userData.first_name} {userData.last_name}</p>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">{userData.course} - {userData.year_level}</p>
                </div>
              )}
            </div>
          )}
          
          {verificationStatus === "failed" && (
            <div className="py-8">
              <div className="h-16 w-16 rounded-full bg-red-500 flex items-center justify-center mx-auto mb-4">
                <AlertTriangle className="h-8 w-8 text-white" />
              </div>
              <p className="text-gray-700 dark:text-gray-200 font-medium text-lg mb-2">Verification Failed</p>
              <p className="text-red-600 dark:text-red-400 mb-6">{message}</p>
              <button
                onClick={() => navigate("/")}
                className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-6 rounded-md"
              >
                Back to Login
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default EmailVerification;