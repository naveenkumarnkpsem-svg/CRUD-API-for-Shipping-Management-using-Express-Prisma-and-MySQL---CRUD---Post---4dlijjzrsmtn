import dotenv from "dotenv";
dotenv.config();



const verifySecret = (req,res,next)=>{

    const key = req.headers["shipping_secret_key"] || req.headers["SHIPPING_SECRET_KEY"]

    const validkey = process.env.SHIPPING_SECRET_KEY

    if(!key){
        return res.status(403).json({ error: "SHIPPING_SECRET_KEY is missing or invalid" });
    }

    if (!validkey){
        return res.status(403).json({ error: "Failed to authenticate SHIPPING_SECRET_KEY" });
    }

    if (key !== validkey) {
        return res.status(403).json({ error: "SHIPPING_SECRET_KEY is missing or invalid" });
    }

    next();
}

export {verifySecret};
