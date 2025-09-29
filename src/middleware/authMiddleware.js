require("dontenv").config();



const verifySecret = (req,res,next)=>{

    const key = req.headers["SHIPPING_SECRET_KEY"]

    const validkey = process.env.SHIPPING_SECRET_KEY

    if(!key){

        return res.status(403).json({ error: "SHIPPING_SECRET_KEY is missing or invalid" });

    }

    if (!validkey){
        return res.status(403).json({ error: "Failed to authenticate SHIPPING_SECRET_KEY" });
    }


    next();


}

module.exports = {verifySecret};
