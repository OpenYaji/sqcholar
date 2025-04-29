import express from "express";
import mysql from "mysql2/promise";
import cors from "cors";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import nodemailer from "nodemailer";
import crypto from "crypto";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 5000;

app.use(cors({
  origin: "http://localhost:5173", // Allow frontend dev server
  credentials: true
}));

app.use(express.json());

// MySQL connection config
const db = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "",
  database: "portal",
});

// In-memory token storage (in production you'd use Redis or database)
const verificationTokens = new Map();

// Create a directory for storing student face images if it doesn't exist
const studentFacesDir = path.join(__dirname, 'student_faces');
if (!fs.existsSync(studentFacesDir)) {
  fs.mkdirSync(studentFacesDir, { recursive: true });
}

// Configure nodemailer
const transporter = nodemailer.createTransport({
  service: 'gmail', 
  auth: {
    user: 'johnreybisnarcalipes@gmail.com',
    pass: 'uiki gwsq zkeg oxhj' 
  }
});

// Login route
app.post('/login', async (req, res) => {
  const { studentId, password } = req.body;

  if (!studentId || !password) {
    return res.status(400).json({ message: "Missing credentials" });
  }

  try {
    const [rows] = await db.query("SELECT * FROM students WHERE student_id = ?", [studentId]);

    if (rows.length === 0) {
      return res.status(404).json({ message: "Student not found" });
    }

    const student = rows[0];

    // Plain text password check
    if (student.password !== password) {
      return res.status(401).json({ message: "Incorrect password" });
    }

    // Remove password before sending user data
    const { password: _, ...userData } = student;

    return res.status(200).json({
      message: "Login successful",
      userData,
    });
  } catch (err) {
    console.error("Login error:", err);
    return res.status(500).json({ message: "Server error" });
  }
});

// Face verification endpoint
app.post('/verify-face/:studentId', async (req, res) => {
  const { studentId } = req.params;
  const { faceDescriptor } = req.body;
  
  if (!faceDescriptor) {
    return res.status(400).json({ message: "Missing face descriptor" });
  }
  
  try {
    // First, check if we have a face record for this student
    const [rows] = await db.query(
      "SELECT face_data FROM students WHERE student_id = ?",
      [studentId]
    );
    
    if (rows.length === 0) {
      return res.status(404).json({ message: "Student not found" });
    }
    
    const student = rows[0];
    
    // If no face data is stored yet, store this as the reference face
    if (!student.face_data) {
      try {
        await db.query(
          "UPDATE students SET face_data = ? WHERE student_id = ?",
          [JSON.stringify(faceDescriptor), studentId]
        );
        
        return res.status(200).json({ 
          verified: true, 
          message: "Face registered successfully" 
        });
      } catch (error) {
        console.error("Error storing face data:", error);
        return res.status(500).json({ 
          verified: false, 
          message: "Error storing face data" 
        });
      }
    }
    
    // If we have face data, compare with the stored one
    const storedFaceDescriptor = JSON.parse(student.face_data);
    
    // Calculate Euclidean distance between face descriptors
    const distance = calculateFaceDistance(faceDescriptor, storedFaceDescriptor);
    
    // A distance < 0.6 is usually considered a match
    const isMatch = distance < 0.6;
    
    return res.status(200).json({
      verified: isMatch,
      message: isMatch ? "Face verified successfully" : "Face verification failed",
      similarity: 1 - distance // Convert distance to similarity score (0-1)
    });
    
  } catch (err) {
    console.error("Face verification error:", err);
    return res.status(500).json({ 
      verified: false, 
      message: "Server error during face verification" 
    });
  }
});

// Calculate Euclidean distance between two face descriptors
function calculateFaceDistance(descriptor1, descriptor2) {
  return Math.sqrt(
    descriptor1.reduce((sum, value, i) => {
      return sum + Math.pow(value - descriptor2[i], 2);
    }, 0)
  );
}

// Send verification email
app.post('/send-verification-email/:studentId', async (req, res) => {
  const { studentId } = req.params;
  
  try {
    // Get student email
    const [rows] = await db.query(
      "SELECT email FROM students WHERE student_id = ?",
      [studentId]
    );
    
    if (rows.length === 0) {
      return res.status(404).json({ 
        success: false,
        message: "Student not found" 
      });
    }
    
    const { email } = rows[0];
    
    // Generate verification token
    const token = crypto.randomBytes(32).toString('hex');
    
    // Store token with expiration (15 minutes)
    verificationTokens.set(token, {
      studentId,
      expires: Date.now() + 15 * 60 * 1000 // 15 minutes
    });
    
    // Create verification link
    const verificationLink = `http://localhost:5173/verify-email?token=${token}`;
    
    // Send email
    const mailOptions = {
      from: '"QCU Student Portal" <noreply@qcu.edu.ph>',
      to: email,
      subject: 'QCU Portal Login Verification',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background-color: #003366; padding: 20px; text-align: center;">
            <h1 style="color: white; margin: 0;">QCU Student Portal</h1>
          </div>
          <div style="padding: 20px; border: 1px solid #ddd; border-top: none;">
            <p>Hello Student,</p>
            <p>We received a login request for your QCU Student Portal account. For security purposes, please click the button below to verify your identity:</p>
            <div style="text-align: center; margin: 30px 0;">
              <a href="${verificationLink}" style="background-color: #0056b3; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; font-weight: bold;">Verify Login</a>
            </div>
            <p>If you did not request this login, please ignore this email or contact support.</p>
            <p>This verification link will expire in 15 minutes.</p>
            <p>Thank you,<br>QCU Student Portal Team</p>
          </div>
          <div style="background-color: #f5f5f5; padding: 15px; text-align: center; font-size: 12px; color: #666;">
            &copy; 2025 Quezon City University. All rights reserved.
          </div>
        </div>
      `
    };
    
    await transporter.sendMail(mailOptions);
    
    return res.status(200).json({
      success: true,
      message: "Verification email sent",
      email: email.replace(/(.{2})(.*)@(.*)/, "$1****@$3") // Mask email for privacy
    });
    
  } catch (err) {
    console.error("Error sending verification email:", err);
    return res.status(500).json({
      success: false,
      message: "Server error sending verification email"
    });
  }
});

// Verify email token endpoint
app.get('/verify-email-token/:token', async (req, res) => {
  const { token } = req.params;
  
  // Check if token exists and is not expired
  const tokenData = verificationTokens.get(token);
  
  if (!tokenData || tokenData.expires < Date.now()) {
    return res.status(400).json({
      verified: false,
      message: tokenData ? "Token expired" : "Invalid token"
    });
  }
  
  try {
    // Get student data
    const [rows] = await db.query(
      "SELECT * FROM students WHERE student_id = ?",
      [tokenData.studentId]
    );
    
    if (rows.length === 0) {
      return res.status(404).json({
        verified: false,
        message: "Student not found"
      });
    }
    
    // Remove password before sending user data
    const { password: _, ...userData } = rows[0];
    
    // Remove token
    verificationTokens.delete(token);
    
    return res.status(200).json({
      verified: true,
      message: "Email verification successful",
      userData
    });
    
  } catch (err) {
    console.error("Email verification error:", err);
    return res.status(500).json({
      verified: false,
      message: "Server error during email verification"
    });
  }
});

// Get current grades for a specific student
// Get current grades for a specific student
app.get('/current-grades/:studentId', async (req, res) => {
  const { studentId } = req.params;

  try {
    const [rows] = await db.query(
      "SELECT subject_code, subject_title, units, midterm, finals, final_grade, remarks, instructor FROM current_grades WHERE student_id = ?",
      [studentId]
    );
    return res.status(200).json(rows);
  } catch (err) {
    console.error("Error fetching current grades:", err);
    return res.status(500).json({ message: "Server error fetching current grades" });
  }
});

// Upload student face data (for admin use)
app.post('/upload-face-data/:studentId', async (req, res) => {
  const { studentId } = req.params;
  const { faceDescriptor } = req.body;
  
  if (!faceDescriptor) {
    return res.status(400).json({ message: "Missing face descriptor" });
  }
  
  try {
    await db.query(
      "UPDATE students SET face_data = ? WHERE student_id = ?",
      [JSON.stringify(faceDescriptor), studentId]
    );
    
    return res.status(200).json({ 
      success: true, 
      message: "Face data uploaded successfully" 
    });
  } catch (err) {
    console.error("Error uploading face data:", err);
    return res.status(500).json({ 
      success: false, 
      message: "Server error uploading face data" 
    });
  }
});

// Create email verification page component (for frontend to handle tokens)
app.get('/verify-email', (req, res) => {
  const { token } = req.query;
  
  // This would be handled by the frontend router, but we'll provide a simple HTML response
  res.send(`
    <!DOCTYPE html>
    <html>
    <head>
      <title>Email Verification - QCU Portal</title>
      <meta http-equiv="refresh" content="0;URL='http://localhost:5173/email-verification?token=${token}'">
    </head>
    <body>
      <p>Redirecting to verification page...</p>
    </body>
    </html>
  `);
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});