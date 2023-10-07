import Joi from "joi";

export default Joi.object({
    productId: Joi.string().uuid(),
    count: Joi.number().min(0),
    product: Joi.object({
        id: Joi.string().uuid().required(),
        title: Joi.string().required(),
        description: Joi.string().required(),
        price: Joi.number().required()
    })
})
    .with('product', 'count')
    .with('productId', 'count')
    .xor('productId', 'product')