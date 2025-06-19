import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import validator from "validator";
import userModel from "../models/userModel.js";
import doctorModel from "../models/doctorModel.js";
import appointmentModel from "../models/appointmentModel.js";
import { v2 as cloudinary } from 'cloudinary';
import stripe from "stripe";
import razorpay from 'razorpay';



const razorpayInstance = new razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// Register user
const registerUser = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        if (!name || !email || !password) {
            return res.json({ success: false, message: 'Missing Details' });
        }

        if (!validator.isEmail(email)) {
            return res.json({ success: false, message: "Please enter a valid email" });
        }

        if (password.length < 8) {
            return res.json({ success: false, message: "Please enter a strong password" });
        }

        const existingUser = await userModel.findOne({ email });
        if (existingUser) {
            return res.json({ success: false, message: "Email already exists" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await userModel.create({
            name,
            email,
            password: hashedPassword,
        });

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
        res.json({ success: true, token });

    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
};

// Login user
const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await userModel.findOne({ email });

        if (!user) {
            return res.json({ success: false, message: "User does not exist" });
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.json({ success: false, message: "Invalid credentials" });
        }

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
        res.json({ success: true, token });

    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
};

// Get profile
const getProfile = async (req, res) => {
    try {
        const userId = req.userId;
        const userData = await userModel.findById(userId).select('-password');
        res.json({ success: true, userData });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
};

// Update profile
const updateProfile = async (req, res) => {
    try {
        const userId = req.userId;
        const { name, phone, address, dob, gender } = req.body;
        const imageFile = req.file;

        if (!name || !phone || !dob || !gender) {
            return res.json({ success: false, message: "Data Missing" });
        }

        await userModel.findByIdAndUpdate(userId, {
            name,
            phone,
            address: JSON.parse(address || '{}'),
            dob,
            gender
        });

        if (imageFile) {
            const imageUpload = await cloudinary.uploader.upload(imageFile.path, { resource_type: "image" });
            const imageURL = imageUpload.secure_url;
            await userModel.findByIdAndUpdate(userId, { image: imageURL });
        }

        res.json({ success: true, message: 'Profile Updated' });

    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
};

// Book appointment
const bookAppointment = async (req, res) => {
    try {
        const userId = req.userId;
        const { docId, slotDate, slotTime } = req.body;

        const docData = await doctorModel.findById(docId).select("-password");

        if (!docData?.available) {
            return res.json({ success: false, message: 'Doctor Not Available' });
        }

        let slots_booked = docData.slots_booked;

        if (slots_booked[slotDate]?.includes(slotTime)) {
            return res.json({ success: false, message: 'Slot Not Available' });
        }

        if (!slots_booked[slotDate]) {
            slots_booked[slotDate] = [];
        }

        slots_booked[slotDate].push(slotTime);

        const userData = await userModel.findById(userId).select("-password");
        delete docData.slots_booked;

        const appointmentData = {
            userId,
            docId,
            userData,
            docData,
            amount: docData.fees,
            slotTime,
            slotDate,
            date: Date.now()
        };

        await new appointmentModel(appointmentData).save();
        await doctorModel.findByIdAndUpdate(docId, { slots_booked });

        res.json({ success: true, message: 'Appointment Booked' });

    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
};

// Cancel appointment
const cancelAppointment = async (req, res) => {
    try {
        const userId = req.userId;
        const { appointmentId } = req.body;

        const appointmentData = await appointmentModel.findById(appointmentId);

        if (!appointmentData || String(appointmentData.userId) !== String(userId)) {
            return res.json({ success: false, message: 'Unauthorized action' });
        }

        await appointmentModel.findByIdAndUpdate(appointmentId, { cancelled: true });

        const { docId, slotDate, slotTime } = appointmentData;
        const doctorData = await doctorModel.findById(docId);
        doctorData.slots_booked[slotDate] = doctorData.slots_booked[slotDate].filter(e => e !== slotTime);

        await doctorModel.findByIdAndUpdate(docId, { slots_booked: doctorData.slots_booked });

        res.json({ success: true, message: 'Appointment Cancelled' });

    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
};

// List appointments
const listAppointment = async (req, res) => {
    try {
        const userId = req.userId;
        const appointments = await appointmentModel.find({ userId });
        res.json({ success: true, appointments });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
};

// Razorpay payment
const paymentRazorpay = async (req, res) => {
    try {
        const { appointmentId } = req.body;
        const appointmentData = await appointmentModel.findById(appointmentId);

        if (!appointmentData || appointmentData.cancelled) {
            return res.json({ success: false, message: 'Appointment Cancelled or not found' });
        }

        const options = {
            amount: appointmentData.amount * 100,
            currency: process.env.CURRENCY,
            receipt: appointmentId,
        };

        const order = await razorpayInstance.orders.create(options);
        res.json({ success: true, order });

    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
};

// Razorpay verification
const verifyRazorpay = async (req, res) => {
    try {
        const { razorpay_order_id } = req.body;
        const orderInfo = await razorpayInstance.orders.fetch(razorpay_order_id);

        if (orderInfo.status === 'paid') {
            await appointmentModel.findByIdAndUpdate(orderInfo.receipt, { payment: true });
            res.json({ success: true, message: "Payment Successful" });
        } else {
            res.json({ success: false, message: 'Payment Failed' });
        }

    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
};

// Stripe payment
const paymentStripe = async (req, res) => {
    try {
        const { appointmentId } = req.body;
        const { origin } = req.headers;
        const appointmentData = await appointmentModel.findById(appointmentId);

        if (!appointmentData || appointmentData.cancelled) {
            return res.json({ success: false, message: 'Appointment Cancelled or not found' });
        }

        const line_items = [{
            price_data: {
                currency: process.env.CURRENCY.toLowerCase(),
                product_data: { name: "Appointment Fees" },
                unit_amount: appointmentData.amount * 100,
            },
            quantity: 1
        }];

        const session = await stripeInstance.checkout.sessions.create({
            success_url: `${origin}/verify?success=true&appointmentId=${appointmentData._id}`,
            cancel_url: `${origin}/verify?success=false&appointmentId=${appointmentData._id}`,
            line_items,
            mode: 'payment',
        });

        res.json({ success: true, session_url: session.url });

    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
};

// Stripe verify
const verifyStripe = async (req, res) => {
    try {
        const { appointmentId, success } = req.body;

        if (success === "true") {
            await appointmentModel.findByIdAndUpdate(appointmentId, { payment: true });
            return res.json({ success: true, message: 'Payment Successful' });
        }

        res.json({ success: false, message: 'Payment Failed' });

    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
};

export {
    loginUser,
    registerUser,
    getProfile,
    updateProfile,
    bookAppointment,
    listAppointment,
    cancelAppointment,
    paymentRazorpay,
    verifyRazorpay,
    paymentStripe,
    verifyStripe
};
