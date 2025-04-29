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
    database: "portal",
});

// Login route (as before)
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
        const [rows] = await db.query("SELECT * FROM students WHERE student_id = ?", [studentId]);

        if (rows.length === 0) {
            return res.status(404).json({ message: "Student not found" });
        }

        const student = rows[0];
        return res.status(200).json(student);
    } catch (err) {
        console.error("Error fetching student data:", err);
        return res.status(500).json({ message: "Server error fetching student data" });
    }
});

// Update student data by ID (for MyAccount component)
app.put('/student/update/:studentId', async (req, res) => {
    const { studentId } = req.params;
    const { email, phone, address, emergency_contact, emergency_phone } = req.body;

    try {
        const [result] = await db.query(
            "UPDATE students SET email = ?, phone = ?, address = ?, emergency_contact = ?, emergency_phone = ? WHERE student_id = ?",
            [email, phone, address, emergency_contact, emergency_phone, studentId]
        );

        if (result.affectedRows > 0) {
            return res.status(200).json({ message: "Student data updated successfully" });
        } else {
            return res.status(404).json({ message: "Student not found" });
        }
    } catch (err) {
        console.error("Error updating student data:", err);
        return res.status(500).json({ message: "Server error updating student data" });
    }
});

// Get current grades for a specific student (as before)
app.get('/current-grades/:studentId', async (req, res) => {
    const { studentId } = req.params;
    try {
        const [rows] = await db.query(
            "SELECT cg.subject_code, cg.subject_title, cg.units, cg.midterm, cg.finals, cg.final_grade, cg.remarks, i.instructor_name FROM current_grades cg JOIN instructor i ON cg.instructor_id = i.instructor_id WHERE cg.student_id = ?",
            [studentId]
        );
        return res.status(200).json(rows);
    } catch (err) {
        console.error("Error fetching current grades:", err);
        return res.status(500).json({ message: "Server error fetching current grades" });
    }
});

// Fetch the profile image for a student by their student_id (as before)
app.get('/profile-image/:studentId', async (req, res) => {
    const { studentId } = req.params;
    try {
        const [rows] = await db.query("SELECT face_data FROM students WHERE student_id = ?", [studentId]);

        if (rows.length === 0) {
            return res.status(404).json({ message: "Student not found" });
        }

        const profileImage = rows[0].face_data; // Assuming the image is stored as a URL or path
        return res.status(200).json({ profileImage });
    } catch (err) {
        console.error("Error fetching profile image:", err);
        return res.status(500).json({ message: "Server error fetching profile image" });
    }
});

// Get notifications for a student (updated)
app.get('/notifications/:studentId', async (req, res) => {
    const { studentId } = req.params;
    try {
        // Get all notifications for this student or all students
        const [notifications] = await db.query(
            "SELECT n.* FROM notifications n WHERE n.student_id = ? OR n.recipient_type = 'all' ORDER BY n.created_at DESC",
            [studentId]
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
            read: readNotificationIds.has(notification.id)
        }));

        return res.status(200).json(notificationsWithReadStatus);
    } catch (err) {
        console.error("Error fetching notifications:", err);
        return res.status(500).json({ message: "Server error fetching notifications" });
    }
});

// Mark a notification as read (as before)
app.put('/notifications/read/:notificationId', async (req, res) => {
    const { notificationId } = req.params;
    const { student_id } = req.body;
    try {
        await db.query(
            "INSERT INTO notification_reads (notification_id, student_id) VALUES (?, ?) ON DUPLICATE KEY UPDATE read_at = CURRENT_TIMESTAMP",
            [notificationId, student_id]
        );

        return res.status(200).json({ message: "Notification marked as read" });
    } catch (err) {
        console.error("Error marking notification as read:", err);
        return res.status(500).json({ message: "Server error" });
    }
});

// Mark all notifications as read for a student (as before)
app.put('/notifications/read-all', async (req, res) => {
    const { student_id } = req.body;
    try {
        const [notifications] = await db.query(
            "SELECT id FROM notifications WHERE student_id = ? OR recipient_type = 'all'",
            [student_id]
        );

        if (notifications.length > 0) {
            const values = notifications.map(notification => [notification.id, student_id]);
            await db.query(
                "INSERT INTO notification_reads (notification_id, student_id) VALUES ? ON DUPLICATE KEY UPDATE read_at = CURRENT_TIMESTAMP",
                [values]
            );
        }

        return res.status(200).json({ message: "All notifications marked as read" });
    } catch (err) {
        console.error("Error marking all notifications as read:", err);
        return res.status(500).json({ message: "Server error" });
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});