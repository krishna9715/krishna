const express = require("express");
const User = require("../models/User");
const router = express.Router();

const initializeUsers = async () => {
  const defaultUsers = [
    {
      emp_id: "EMP001",
      name: "Admin User",
      username: "admin",
      password: "admin123",
      role: "admin",
      profile_img: "",
      aadhar_photo: "",
      license_photo: "",
      driving_license_no: "",
      phone: "1234567890",
      email: "admin@example.com",
      address: "123 Admin St, Admin City, Admin Country",
    },
    {
      emp_id: "EMP002",
      name: "User One",
      username: "user1",
      password: "password1",
      role: "user",
      profile_img: "",
      aadhar_photo: "",
      license_photo: "",
      driving_license_no: "",
      phone: "9876543210",
      email: "user1@example.com",
      address: "456 User Ave, User City, User Country",
    },
  ];
  

  for (const user of defaultUsers) {
    const existingUser = await User.findOne({ username: user.username });
    if (!existingUser) {
      const newUser = new User(user); // Store the password directly, no hashing
      await newUser.save();
      console.log(`User ${user.username} added.`);
    }
  }
};
initializeUsers();

router.post("/login", async (req, res) => {
  const { username, password } = req.body;
  console.log("from server", req.body);

  try {
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(401).json({ message: "Invalid username or password" });
    }

    console.log("Stored password:", user.password); // Log the stored password

    // Direct comparison (no hashing needed)
    if (password !== user.password) {
      console.log("Password mismatch"); // Log if the passwords do not match
      return res.status(401).json({ message: "Invalid username or password" });
    }

    res.json({ message: "Login successful", user });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ message: "Server error", error });
  }
});

// Get all users
router.get("/", async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
});

// Get user profile by emp_id
router.get("/profile/:emp_id", async (req, res) => {
  try {
    const { emp_id } = req.params;
    const user = await User.findOne({ emp_id });
    if (!user) return res.status(404).json({ message: "User not found" });

    res.json(user);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
});

// Update user profile
router.put("/profile/:emp_id", async (req, res) => {
  try {
    const { emp_id } = req.params;
    const {
      name,
      phone,
      email,
      address,
      profile_img,
      aadhar_photo,
      license_photo,
      driving_license_no,
    } = req.body;

    console.log("from route", req.body);

    // Update user details including new fields
    const updatedUser = await User.findOneAndUpdate(
      { emp_id },
      {
        name,
        phone,
        email,
        address,
        profile_img,
        aadhar_photo,
        license_photo,
        driving_license_no,
      },
      { new: true }
    );

    if (!updatedUser)
      return res.status(404).json({ message: "User not found" });

    res.json({ message: "Profile updated successfully", user: updatedUser });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
});

router.post("/add-dealer", async (req, res) => {
  const { username, password, name } = req.body;

  try {
    // Validate input
    if (!username || !password || !name) {
      return res
        .status(400)
        .json({ message: "Username, password, and name are required" });
    }

    // Check if username already exists
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ message: "Username already exists" });
    }

    // Generate emp_id (this is just an example, modify it if needed)
    const empId = `EMP${Math.floor(Math.random() * 9000) + 1000}`; // Random EMP ID

    // Create a new user with default values (no password hashing)
    const newUser = new User({
      emp_id: empId,
      name: name,
      username,
      password: password, // Store the password directly (no hashing)
      role: "user", // Default role is 'user'
      address: "", // Default empty address
      phone: "", // Default empty phone
      email: "", // Default empty email
    });

    // Save the new user to the database
    await newUser.save();

    res
      .status(201)
      .json({ message: "Dealer added successfully", user: newUser });
  } catch (error) {
    console.error("Error adding dealer:", error);
    res.status(500).json({ message: "Server error", error });
  }
});



module.exports = router;
