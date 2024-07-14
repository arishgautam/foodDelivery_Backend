import express from 'express'
import { handleEsewaSuccess } from '../controllers/esewa_controller.js';
import { updateOrderAfterPayment } from '../controllers/order_controller.js';
var router = express.Router();

router.get("/success", handleEsewaSuccess, updateOrderAfterPayment);

export default router;