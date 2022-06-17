const { Products, Products_Img } = require('../models');
const { imagekit } = require('../lib/imagekit');
const { validateProduct } = require('../validator/products');

module.exports = {
    createProduct: async (req, res) => {
        try {
            const { name, price, description, category, user_id} = req.body;
            validateProduct(req.body);

            const newProduct = await Products.create({
                name, price, description, category, user_id
            })

            const productImg = req.files.map(async (file) => {
                const imageUrl = file.buffer.toString('base64');
                const fileName = Date.now() + '-' + file.originalname;
                const uploadImage = await imagekit.upload({
                    file: imageUrl,
                    fileName
                });
                const image = await Products_Img.create({
                    products_id: newProduct.id,
                    image: fileName,
                    url: uploadImage.url
                });
                return image;
            });

            return res.created('Success add data product!', newProduct);
        } catch (err) {
            return res.serverError(err.message);
        }
    },

    getAllProduct: async (req, res) => {
        try {
            let products = await Products.findAll();
            return res.success('Success get all data product!', products);
        } catch (err) {
            return res.serverError(err.message);
        }
    },

    getProductById: async (req, res) => {
        try {
            const products_id = req.params.id;
            const product = await Products.findOne({ where: { id: products_id}, 
                include: 'productImg' ,
                attributes: {exclude :['updatedAt', 'createdAt']}
            });
            if (!product) {
                return res.notFound('Product not found');
            }
            return res.success('Success get data product!', product);
        } catch (err) {
            return res.serverError(err.message);
        }
    },

    // updateProductById: async (req, res) => {
    //     try {
    //         const products_id = req.params.id;
    //         const { name, price, description, category, user_id} = req.body;
    //         validateProduct(req.body);

    //         const product = await Products.findOne({ where: { id: products_id } });
    //         if (!product) {
    //             return res.notFound('Product not found');
    //         }

    //         const updateProduct = await product.update({
    //             name, price, description, category, user_id
    //         });

    //         const productImg = req.files.map(async (file) => {
    //             const imageUrl = file.buffer.toString('base64');
    //             const fileName = Date.now() + '-' + file.originalname;
    //             const uploadImage = await imagekit.updateFileDetails({
    //                 file: imageUrl,
    //                 fileName
    //             });

    //             const image = await Products_Img.update({
    //                 products_id: updateProduct.id,
    //                 image: fileName,
    //                 url: uploadImage.url
    //             });
    //             return image;
    //         });

    //         return res.success('Success update data product!', updateProduct);
            
    //     } catch (err) {
    //         return res.serverError(err.message);
    //     }
    // }
}