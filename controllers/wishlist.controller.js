const {User, Wishlist, Product} = require('../models');

// const responseHelper = require('../helpers/response.helper')

module.exports = {
    addWishlist : async (req,res) => {
        try {
            const {id_user, id_product} = req.body;

            const isUserExist = await User.findOne({
                where: {
                    id: id_user
                }
            })

            if(!isUserExist){
                return res.notFound();
            }

            const isProductExist = await Product.findOne({
                where: {
                    id: id_product
                }
            })

            if(!isProductExist) {
                return res.notFound();
            }

            if(!id_product || !id_user) {
                return res.badRequest('id_user and id_product is required!')
            }

            let new_wishlist = await Wishlist.create({
                id_user,
                id_product
            })

            return res.success("Success add product to wishlist", new_wishlist);
        }catch(err) {
            return res.serverError();
        }
    },

    getWishlist : async (req,res) => {
        try{
            let all = await Wishlist.findAll();

            return res.success('success get all wishlist', all);
        }catch(err){
            return res.serverError();
        }
    },

    getDetail : async (req,res) => {
        try{
            const id_wishlist = req.params.id;

            let detail = await Wishlist.findOne({
                where: {
                    id: id_wishlist
                },
                include: ['user', 'product']
            });

            if (!detail) {
                return res.notFound();
            }

            return res.success('success get detail wishlist', detail);
        }catch(err) {
            return res.serverError();
        }
    },

    updateWishlist : async (req,res) => {
        try{
            const id_wishlist = req.params.id;
            const {id_user, id_product} = req.body;

            const isUserExist = await User.findOne({
                where: {
                    id: id_user
                }
            })

            if(!isUserExist){
                return res.notFound();
            }

            let query = {
                where: {
                    id: id_wishlist
                }
            }

            let updated = await Wishlist.update({
                id_user,
                id_product
            }, query);

            return res.success('success change wishlist', updated)

        }catch(err){
            return res.serverError();
        }
    },

    deleteWishlist: async (req,res) => {
        try{
            const id_wishlist = req.params.id;

            const isWishlistExist = await Wishlist.findOne({
                where: {
                    id: id_wishlist
                }
            })

            if(!isWishlistExist){
                return res.notFound();
            } 

            let deleted = await Wishlist.destroy({
                where: {
                    id: id_wishlist
                }
            });

            return res.success('success delete wishlist', deleted)
        }catch(err){
            return res.serverError();
        }
    }
}