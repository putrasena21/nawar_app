const {Transaction, User, Product} = require('../models');
const jwt = require('jsonwebtoken');
const {JWT_SECRET_KEY} = process.env;

module.exports = {
    createTransaction : async (req,res) => {
        try{
            const token = req.headers.authorization.split(" ")[1];

            if(!token) {
                return res.unauthorized('Token is required!');
            }

            const decoded = jwt.verify(token, JWT_SECRET_KEY);

            const {id_product, price, approved} = req.body;

            const isUserExist = await User.findOne({
                where: {
                    id: decoded.id
                }
            })

            if(!isUserExist) {
                return res.notFound();
            }

            // const isProductExist = await Product.findOne({
            //     where: {
            //         id: id_product
            //     }
            // })

            // if(!isProductExist) {
            //     return res.notFound();
            // }

            if(!id_product || !price) {
                return res.badRequest('id_product and price is required')
            }

            let newTransaction = await Transaction.create({
                id_user : decoded.id,
                id_product,
                price,
                approved
            })

            return res.success("Success create transaction", newTransaction)
        }catch(err){
            return res.serverError();
        }
    },

    getAllTransaction : async (req,res) => {
        try{
            let all = await Transaction.findAll();

            return res.success('sucess get All transaction', all)
        }catch(err){
            return res.serverError();
        }
    },

    getDetailTransaction : async (req,res) => {
        try{
            const token = req.headers.authorization.split(" ")[1];

            if(!token) {
                return res.unauthorized("Token is required!")
            }

            const decoded =jwt.verify(token, JWT_SECRET_KEY);

            const data = await Transaction.findOne({
                where: {
                    id: decoded.id
                },
                include: 'buyer'    
            })

            const detailTransaction = {
                id_user: decoded.id,
                id_product: data.id_product,
                price: data.price,
                approved: data.approved,
                buyer: data.buyer
            }

            return res.success("success get detail transaction", detailTransaction)

        }catch(err){
            return res.serverError();
        }
    }
}