import {prisma} from "../../db/config.js";


const createShipping = async (req,res)=>{
    try{

        const {userId,productId,count} = req.body;

        if(!userId || !productId || !count){
            return res.status(400).json({error: "All fields required"});
        }

        const shipping = await prisma.shipping.create({
            data:{
                userId,
                productId,
                count
            }


        })

        res.status(201).json({shipping})



    }

    catch(err){
        return res.status(500).json({error: "Internal server error"});
    }
}



const cancelShipping = async (req,res)=>{

    try{

        const {id} = req.params;

        if(!id){
            return res.status(400).json({error: "Missing shippingId"});
        }

        const shipping = await prisma.shipping.update({
            where:{
                id : parseInt(id)
            },

            data:{
                status:"cancelled"

            }
        })

        res.status(200).json({shipping})

    }

    catch(err){
        return res.status(500).json({error: "Internal server error "});
    }

}

const getShippings = async (req,res)=>{
    try{
        const {userId}= req.query;
        if (userId){
            const shippings = await prisma.shipping.findMany({
                where:{
                    userId: parseInt(userId)
                }

       
            });
            return res.status(200).json({shippings});
        }

        else{
            const shippings = await prisma.shipping.findMany();

            res.status(200).json({shippings})

        }

       
    }

    catch(err){
        return res.status(500).json({error: "Internal server error"});
    }
}


export {createShipping,cancelShipping,getShippings};