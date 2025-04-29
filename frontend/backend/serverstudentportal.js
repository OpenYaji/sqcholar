import express from "express";
import mysql from "mysql2/promise";
import cors from "cors";

const app = express();
const PORT = 5000;

app.use(cors({
    origin: "http://localhost:5173",
    credentials: true
}));
app.use(express.json());

const db = mysql.createPool({
    host: "localhost",
    user: "root",
    password: "",
    database: "StudentPortal",
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

        // **SECURITY WARNING: Plain text password! Use bcrypt for production.**
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

// Get student data by ID (for MyAccount component)
app.get('/student/:studentId', async (req, res) => {
    const { studentId } = req.params;
    try {
        // Join students and student_information tables
        const [rows] = await db.query(
            `SELECT s.*, si.* 
            FROM students s 
            LEFT JOIN student_information si ON s.student_id = si.student_id 
            WHERE s.student_id = ?`, 
            [studentId]
        );

        if (rows.length === 0) {
            return res.status(404).json({ message: "Student not found" });
        }

        const student = rows[0];
        // Remove password before sending
        const { password: _, ...studentData } = student;
        
        return res.status(200).json(studentData);
    } catch (err) {
        console.error("Error fetching student data:", err);
        return res.status(500).json({ message: "Server error fetching student data" });
    }
});

// Update student information
app.put('/student/update/:studentId', async (req, res) => {
    const { studentId } = req.params;
    const { 
        email, 
        phone, 
        address, 
        emergency_contact_name, 
        emergency_contact_relationship, 
        emergency_contact_phone 
    } = req.body;

    try {
        // Start a transaction
        await db.query("START TRANSACTION");

        // Update email in students table
        if (email) {
            await db.query(
                "UPDATE students SET email = ? WHERE student_id = ?",
                [email, studentId]
            );
        }

        // Update information in student_information table
        const [result] = await db.query(
            `UPDATE student_information 
            SET phone = ?, 
                address = ?, 
                emergency_contact_name = ?, 
                emergency_contact_relationship = ?, 
                emergency_contact_phone = ? 
            WHERE student_id = ?`,
            [phone, address, emergency_contact_name, emergency_contact_relationship, emergency_contact_phone, studentId]
        );

        await db.query("COMMIT");

        if (result.affectedRows > 0) {
            return res.status(200).json({ message: "Student data updated successfully" });
        } else {
            return res.status(404).json({ message: "Student information not found" });
        }
    } catch (err) {
        await db.query("ROLLBACK");
        console.error("Error updating student data:", err);
        return res.status(500).json({ message: "Server error updating student data" });
    }
});

// Get current grades for a specific student
app.get('/current-grades/:studentId', async (req, res) => {
    const { studentId } = req.params;
    try {
        const [rows] = await db.query(
            `SELECT cg.*, s.subject_title, i.instructor_name 
            FROM current_grades cg 
            JOIN subjects s ON cg.subject_code = s.subject_code
            JOIN instructors i ON cg.instructor_id = i.instructor_id 
            WHERE cg.student_id = ?`,
            [studentId]
        );
        return res.status(200).json(rows);
    } catch (err) {
        console.error("Error fetching current grades:", err);
        return res.status(500).json({ message: "Server error fetching current grades" });
    }
});

// Get past grades for a specific student
app.get('/past-grades/:studentId', async (req, res) => {
    const { studentId } = req.params;
    try {
        const [rows] = await db.query(
            "SELECT * FROM past_grades WHERE student_id = ? ORDER BY school_year DESC, semester DESC",
            [studentId]
        );
        return res.status(200).json(rows);
    } catch (err) {
        console.error("Error fetching past grades:", err);
        return res.status(500).json({ message: "Server error fetching past grades" });
    }
});

// Fetch the profile image for a student by their student_id
app.get('/profile-image/:studentId', async (req, res) => {
    const { studentId } = req.params;
    try {
        const [rows] = await db.query("SELECT profile_picture FROM students WHERE student_id = ?", [studentId]);

        if (rows.length === 0) {
            return res.status(404).json({ message: "Student not found" });
        }

        const profileImage = rows[0].profile_picture;
        return res.status(200).json({ profileImage });
    } catch (err) {
        console.error("Error fetching profile image:", err);
        return res.status(500).json({ message: "Server error fetching profile image" });
    }
});

// Get notifications for a student
app.get('/notifications/:studentId', async (req, res) => {
    const { studentId } = req.params;
    try {
        // Get all notifications for this student or all students
        const [notifications] = await db.query(
            `SELECT n.* FROM notifications n 
            WHERE n.student_id = ? 
            OR n.recipient_type = 'all' 
            OR (n.recipient_type = 'course' AND n.recipient_group = (
                SELECT course FROM student_information WHERE student_id = ?
            ))
            OR (n.recipient_type = 'year_level' AND n.recipient_group = (
                SELECT year_level FROM student_information WHERE student_id = ?
            ))
            ORDER BY n.created_at DESC`,
            [studentId, studentId, studentId]
        );

        // Get read status for these notifications
        const [readStatus] = await db.query(
            "SELECT notification_id FROM notification_reads WHERE student_id = ?",
            [studentId]
        );

        // Create a set of read notification IDs for faster lookup
        const readNotificationIds = new Set(readStatus.map(row => row.notification_id));

        // Add read status to each notification
        const notificationsWithReadStatus = notifications.map(notification => ({
            ...notification,
            read: readNotificationIds.has(notification.notification_id)
        }));

        return res.status(200).json(notificationsWithReadStatus);
    } catch (err) {
        console.error("Error fetching notifications:", err);
        return res.status(500).json({ message: "Server error fetching notifications" });
    }
});

// Mark a notification as read
app.put('/notifications/read/:notificationId', async (req, res) => {
    const { notificationId } = req.params;
    const { student_id } = req.body;
    try {
        await db.query(
            "INSERT INTO notification_reads (notification_id, student_id, read_at) VALUES (?, ?, CURRENT_TIMESTAMP) ON DUPLICATE KEY UPDATE read_at = CURRENT_TIMESTAMP",
            [notificationId, student_id]
        );

        return res.status(200).json({ message: "Notification marked as read" });
    } catch (err) {
        console.error("Error marking notification as read:", err);
        return res.status(500).json({ message: "Server error" });
    }
});

// Mark all notifications as read for a student
app.put('/notifications/read-all', async (req, res) => {
    const { student_id } = req.body;
    try {
        const [notifications] = await db.query(
            `SELECT notification_id FROM notifications 
            WHERE student_id = ? 
            OR recipient_type = 'all'
            OR (recipient_type = 'course' AND recipient_group = (
                SELECT course FROM student_information WHERE student_id = ?
            ))
            OR (recipient_type = 'year_level' AND recipient_group = (
                SELECT year_level FROM student_information WHERE student_id = ?
            ))`,
            [student_id, student_id, student_id]
        );

        if (notifications.length > 0) {
            const values = notifications.map(notification => [notification.notification_id, student_id]);
            await db.query(
                "INSERT INTO notification_reads (notification_id, student_id, read_at) VALUES ? ON DUPLICATE KEY UPDATE read_at = CURRENT_TIMESTAMP",
                [values]
            );
        }

        return res.status(200).json({ message: "All notifications marked as read" });
    } catch (err) {
        console.error("Error marking all notifications as read:", err);
        return res.status(500).json({ message: "Server error" });
    }
});

// Get payment history for a student
app.get('/payments/:studentId', async (req, res) => {
    const { studentId } = req.params;
    try {
        const [rows] = await db.query(
            "SELECT * FROM payments WHERE student_id = ? ORDER BY payment_date DESC",
            [studentId]
        );
        return res.status(200).json(rows);
    } catch (err) {
        console.error("Error fetching payment history:", err);
        return res.status(500).json({ message: "Server error fetching payment history" });
    }
});

// Get document requests for a student
app.get('/documents/:studentId', async (req, res) => {
    const { studentId } = req.params;
    try {
        const [rows] = await db.query(
            "SELECT * FROM documents WHERE student_id = ? ORDER BY request_date DESC",
            [studentId]
        );
        return res.status(200).json(rows);
    } catch (err) {
        console.error("Error fetching document requests:", err);
        return res.status(500).json({ message: "Server error fetching document requests" });
    }
});

// Create new document request
app.post('/documents/request', async (req, res) => {
    const { student_id, document_type, remarks } = req.body;
    try {
        const [result] = await db.query(
            "INSERT INTO documents (student_id, document_type, request_date, status, remarks) VALUES (?, ?, CURDATE(), 'Pending', ?)",
            [student_id, document_type, remarks]
        );
        
        return res.status(201).json({ 
            message: "Document request created successfully",
            docu_request_id: result.insertId
        });
    } catch (err) {
        console.error("Error creating document request:", err);
        return res.status(500).json({ message: "Server error creating document request" });
    }
});

// Get clearance status for a student
app.get('/clearance/:studentId', async (req, res) => {
    const { studentId } = req.params;
    try {
        const [rows] = await db.query(
            "SELECT * FROM clearance WHERE student_id = ? ORDER BY timestamp DESC LIMIT 1",
            [studentId]
        );
        
        if (rows.length === 0) {
            return res.status(404).json({ message: "No clearance record found" });
        }
        
        return res.status(200).json(rows[0]);
    } catch (err) {
        console.error("Error fetching clearance status:", err);
        return res.status(500).json({ message: "Server error fetching clearance status" });
    }
});

// Admin login route
app.post('/admin/login', async (req, res) => {
    const { username, password } = req.body;
    if (!username || !password) {
        return res.status(400).json({ message: "Missing credentials" });
    }
    try {
        const [rows] = await db.query("SELECT * FROM admins WHERE username = ?", [username]);

        if (rows.length === 0) {
            return res.status(404).json({ message: "Admin not found" });
        }

        const admin = rows[0];

        // **SECURITY WARNING: Plain text password! Use bcrypt for production.**
        if (admin.password !== password) {
            return res.status(401).json({ message: "Incorrect password" });
        }

        // Remove password before sending user data
        const { password: _, ...adminData } = admin;

        return res.status(200).json({
            message: "Login successful",
            adminData,
        });
    } catch (err) {
        console.error("Admin login error:", err);
        return res.status(500).json({ message: "Server error" });
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});