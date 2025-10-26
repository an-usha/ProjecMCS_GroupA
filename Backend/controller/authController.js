const bcrypt = require("bcrypt");
const { pool } = require("../config/mysqldatabase");

// Register a new employee
const registerUser = async (req, res) => {
  const { employeename, password, created_by } = req.body;

  try {
    // Hash password with bcrypt
    const hashedPassword = await bcrypt.hash(password, 10);

    const sql = `INSERT INTO EmployeeList (employeename, password, created_by)
                 VALUES (?, ?, ?)`;

    await pool.execute(sql, [employeename, hashedPassword, created_by]);

    res.status(201).json({ status: true, message: "User registered successfully", });
  } catch (error) {
    console.error("Error registering user:", error);
    res.status(500).json({ status: false, message: "Failed to register user" });
  }
};

// Authenticate user against the database
const authenticateUser = async (employeename, password) => {
  const sql = `SELECT * FROM EmployeeList WHERE employeename = ? LIMIT 1`;
  const [rows] = await pool.execute(sql, [employeename]);

  if (rows.length === 0) return null; // User not found

  const user = rows[0];

  // Verify password using bcrypt
  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) return null;

  // Exclude password before returning user object
  const { password: pwd, ...userWithoutPassword } = user;
  return userWithoutPassword;
};

// Login user (no JWT)
const loginUser = async (req, res) => {
  const { employeename, password } = req.body;

  try {
    const user = await authenticateUser(employeename, password);
    if (!user) {
      return res.status(401).json({ status: false, message: "Invalid credentials" });
    }

    res.status(200).json({
      status: true,
      message: "Login successful",
      data: { EmployeeName: employeename },
    });
  } catch (error) {
    console.error("Error logging in:", error);
    res.status(500).json({ status: false, message: "Failed to login" });
  }
};

module.exports = { registerUser, loginUser };
