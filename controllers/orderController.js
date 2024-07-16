import orderModel from "../models/ordermodel.js";

import userModel from "../models/userModel.js";




// Placing user order from frontend
const placeOrder = async (req, res) => {

    const frontend_url = "http://localhost:5174"

    //! Stripe Payment
    // try {
    //     const newOrder = new orderModel({
    //         userId: req.body.userId,
    //         items: req.body.items,
    //         amount: req.body.amount,
    //         address: req.body.address
    //     })
    //     await newOrder.save();
    //     await userModel.findByIdAndUpdate(req.body.userId, { cartData: {} });

    //     const line_items = req.body.items.map((item) => ({
    //         price_data: {
    //             currency: "Npr",
    //             product_data: {
    //                 name: item.name
    //             },
    //             unit_amount: item.price * 200
    //         },
    //         quantity: item.quantity
    //     }))
    //     line_items.push({
    //         price_data: {
    //             currency: "Npr",
    //             product_data: {
    //                 name: "Delivery Charges"
    //             },
    //             unit_amount: 2 * 200
    //         },
    //         quantity: 1
    //     })

    //     const session = await khalti.checkout.session.create({
    //         line_items: line_items,
    //         mode: 'payment',
    //         success_url: `${frontend_url}/verify?success=true&orderId=${newOrder._id}`,
    //         cancel_url: `${frontend_url}/verify?success=false&orderId=${newOrder._id}`,
    //     })

    //     res.json({ success: true, session_url: session_url })

    // } catch (error) {
    //     console.log(error);
    //     res.json({ success: false, message: "Error" })
    // }

    //! Esewa Integration
    try {
        console.log(req.body);
        const order = await orderService.save(req.body);
        const signature = this.createSignature(
            `total_amount=${order.amount},transaction_uuid=${order_.id},product_code=EPAYTEST`
        );

        const formtData = {
            amount: order.amount,
            failure_url: 'http://localhost:5173',
            product_delivery_charge: "0",
            product_service_charge: "0",
            product_code: "PAYTEST",
            signature: signature,
            signed_field_names: "total_amount,transaction_uuid,product_code",
            successurl: "https://localhost:5005/api/esewa/success",
            tax_amount: "0",
            total_amount: order.amount,
            transaction_uuid: order_.id,
        };
        res.json({ message: "Order Created Successfully", order, formData })
    }
    catch (err) {
        return res.status(400).json({ error: err?.message || "No Orders Found" });
    }
}


const verifyOrder = async (req, res) => {
    const { orderId, success } = req.body;
    try {
        if (success == "true") {
            await orderModel.findByIdAndUpdate(orderId, { payment: true });
            res.json({ success: true, message: "Paid" })
        }
        else {
            await orderModel.findByIdAndDelete(orderId);
            res.json({ success: false, message: "Not Paid" })
        }
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Error" })
    }
}

// user order for frontend
const userOrders = async (req, res) => {
    try {
        const orders = await orderModel.find({ userId: req.body.userId })
        res.json({ success: true, data: orders })
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Error" })
    }
}

// listing orders for admin pannel
const listOrders = async (req, res) => {
    try {
        const orders = await orderModel.find({});
        res.json({ success: true, data: orders })
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Error" })
    }
}

// api for uptdating status
const uptdateStatus = async (req, res) => {
    try {
        await orderModel.findByIdAndUpdate(req.body.orderId, { status: req.body.status })
        res.json({ success: true, message: "Status Uptdated" })
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Error" })
    }
}

export { placeOrder, verifyOrder, userOrders, listOrders, uptdateStatus }