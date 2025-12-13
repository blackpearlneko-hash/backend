const express = require("express");
const router = express.Router();
const welcomePage = require("../Schema/welcomeSchema")

router.post("/welcometext", async (req,res)=>{
    try{
        const {welcome} = req.body;
        let data = await welcomePage.findOne();

        if (data){
            data.welcome = welcome;
            await data.save();

        }
        else {
            await welcomePage.create({ welcome});
        }

        res.status(200).json({
            success : true,
            message: "Welcome text saved successfully",
            data        })

    }catch (e) {
        res.status(500).json(
            {
                sucess: false,
                message: e.message
            }
        )

    }
})


router.get("/welcometextget", async (req, res)=>{
    try{
        const data = await welcomePage.findOne();
        res.status(200).json({
            success: true, data
        })
    }catch (e) {
        res.status(500).json({
            success: false,
            message: e.message
        })

    }
})

module.exports = router;