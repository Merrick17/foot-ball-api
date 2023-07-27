const User = require("../models/user.model");
const bcrypt = require("bcrypt");
const jwt = require('jsonwebtoken');
const createNewUser = async (req, res) => {
    try {
        const { firstName, lastName, password, email, address, dateOfBirth, role } =
            req.body;
        const existUser = await User.findOne({ email: email });
        if (!existUser) {
            const hash = await bcrypt.hash(password, 10);
            const newUser = new User({
                firstName: firstName,
                lastName: lastName,
                password: hash,
                email: email,
                address: address,
                dateOfBirth: dateOfBirth,
                role: role
            });
            const result = await newUser.save();
            res.json({
                success: true,
                result: result
            });
        } else {
            res.json({
                success: false,
                message: "Email existant !"
            });
        }
    } catch (error) {
        res.json({
            success: false,
            message: error.message
        });
    }
};

const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email: email });
        if (!user) {
            res.json({ success: false, message: "Email ou mot de passe incorrect" });
        } else {
            const verif = await bcrypt.compare(password, user.password);
            if (verif) {
                const token = jwt.sign({ user: user._id }, 'TOKEN_SECRET');
                res.json({ success: true, user: user, token: token });
            } else {
                res.json({
                    success: false,
                    message: "Email ou mot de passe incorrect"
                });
            }
        }
    } catch (error) {
        res.json({
            success: false,
            message: error.message
        });
    }
};
const getAllUsers = async (req, res) => {
    try {
        const users = await User.find();
        res.json({ success: true, users: users })
    } catch (error) {
        res.json({
            success: false,
            message: error.message
        });
    }
}
const updateUser = async (req, res) => {
    try {
        const { id } = req.params;
        const { firstName, lastName, password, email, address, dateOfBirth, role } = req.body;
        
        // Check if the user exists
        const user = await User.findById(id);
        if (!user) {
            return res.json({ success: false, message: "User not found" });
        }

        // Update the user properties
        user.firstName = firstName;
        user.lastName = lastName;
        user.address = address;
        user.dateOfBirth = dateOfBirth;
        user.role = role;

        // Check if the email is being changed and handle it accordingly
        if (email && email !== user.email) {
            const existUser = await User.findOne({ email: email });
            if (existUser) {
                return res.json({ success: false, message: "Email already exists" });
            }
            user.email = email;
        }

        // Check if the password is being changed and handle it accordingly
        if (password) {
            const hash = await bcrypt.hash(password, 10);
            user.password = hash;
        }

        // Save the updated user
        const result = await user.save();

        res.json({
            success: true,
            result: result
        });
    } catch (error) {
        res.json({
            success: false,
            message: error.message
        });
    }
};

// Delete user
const deleteUser = async (req, res) => {
    try {
        const { id } = req.params;
        
        // Check if the user exists
        const user = await User.findById(id);
        if (!user) {
            return res.json({ success: false, message: "User not found" });
        }

        // Delete the user
        await user.remove();

        res.json({
            success: true,
            message: "User deleted successfully"
        });
    } catch (error) {
        res.json({
            success: false,
            message: error.message
        });
    }
};

module.exports = { createNewUser, loginUser, getAllUsers, updateUser, deleteUser };

