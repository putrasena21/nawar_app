const {User} = require('../models')
module.exports = {
    redirect: async (req,res) => {
        try{
            const user_id = req.params.userId;

            const user = await User.findOne({
                where: {
                    id: user_id
                }
            })
            const link = `http://wa.me/${user.phone}`

            // window.open(link)
            res.redirect(link)
        }catch(err){
            return res.status(500).json({
                status: false,
                message: err.message,
                data: null
            });
        }
    }
}