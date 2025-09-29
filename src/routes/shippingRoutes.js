import express from "express";
import {createShipping,cancelShipping,getShippings} from "../controllers/shippingController";
import {verifySecret}   from "../middleware/authMiddleware";

const router = express.Router()

router.post("/create",verifySecret,createShipping)

router.put("/cancel/:id",verifySecret,cancelShipping)

router.get("/get",verifySecret,getShippings)


export default router;

