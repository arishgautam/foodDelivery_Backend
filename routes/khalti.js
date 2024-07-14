import express from 'express'
import { updateOrderAfterPayment } from '../controllers/order_controller.js';
import { handleKhaltiCallback } from '../controllers/khalti_controller.js';

var router = express.Router();

router.get("/callback", handleKhaltiCallback, updateOrderAfterPayment);

export default router;