import { save, findById, getCount, getWhere, updateOne, deleteOrder } from '../services/order_services.js';
import axios from 'axios';
import crypto from 'crypto';
import { callKhalti } from './khalti_controller.js';
import "dotenv/config";

const BASE_URL = process.env.BASE_URL
// Define createSignature function
const createSignature = (message) => {
    const secret = "8gBm/:&EnhH.1/q"; //different in production
    // Create an HMAC-SHA256 hash
    const hmac = crypto.createHmac("sha256", secret);
    hmac.update(message);

    // Get the digest in base64 format
    const hashInBase64 = hmac.digest("base64");
    return hashInBase64;
};

export const getAllOrders = async (req, res) => {
    try {
        const orders = await getWhere();
        res.json(orders);
    } catch (err) {
        return res.status(400).json({ error: err?.message || "No Orders found" });
    }
};

export const createOrder = async (req, res) => {
    try {
        console.log(req.body);
        const order = await save(req.body);
        const signature = createSignature(
            `total_amount=${order.amount},transaction_uuid=${order._id},product_code=EPAYTEST`
        );
        if (order.payment_method === "esewa") {
            const formData = {
                amount: order.amount,
                failure_url: BASE_URL,
                product_delivery_charge: "0",
                product_service_charge: "0",
                product_code: "EPAYTEST",
                signature: signature,
                signed_field_names: "total_amount,transaction_uuid,product_code",
                success_url: `${BASE_URL}/api/esewa/success`,
                tax_amount: "0",
                total_amount: order.amount,
                transaction_uuid: order._id,
            };
            res.json({
                message: "Order Created Successfully",
                order,
                payment_method: "esewa",
                formData,
            });
        } else if (order.payment_method === "khalti") {
            const formData = {
                return_url: `${BASE_URL}/api/khalti/callback`,
                website_url: `${BASE_URL}`,
                amount: order.amount * 100, //paisa
                purchase_order_id: order._id,
                purchase_order_name: "test",
            };

            callKhalti(formData, req, res);
        }
    } catch (err) {
        return res.status(400).json({ "message": "Esewa", error: err?.message || "No Orders found" });
    }
};

export const updateOrderAfterPayment = async (req, res, next) => {
    try {
        console.log(req.body);
        const order = await findById(req.transaction_uuid);
        order.status = "paid";
        order.transaction_code = req.transaction_code;

        await save(order);
        res.redirect("https://fooddelivery-frontend-ten.vercel.app");
    } catch (err) {
        return res.status(400).json({ error: err?.message || "No Orders found" });
    }
};

export { createSignature };
