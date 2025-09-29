import express from "express";
import {createShipping,cancelShipping,getShippings} from "../controllers/shippingController.js";
import {verifySecret}   from "../middleware/authMiddleware.js";

const router = express.Router()

router.post("/create",verifySecret,createShipping)

router.put("/cancel/:id",verifySecret,cancelShipping)

router.get("/get",verifySecret,getShippings)


export default router;

