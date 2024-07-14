import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
    {
        payment_method: {
            type: String,
            required: true,
            default: "esewa",
        },
        transaction_code: String,
        amount: {
            type: Number,
            required: true,
        },
        products: [
            {
                product: {
                    type: String,
                    required: true,
                    default: "Test",
                },
                quantity: {
                    type: Number,
                    required: true,
                    default: 1,
                },
            },
        ],
        status: {
            type: String,
            required: true,
            enum: ["created", "paid", "shipping", "delivered"],
            default: "created",
        },
        address: String,
    },
    {
        timestamps: true,
    }
);

const Order = mongoose.model("Order", orderSchema);

export default Order;
