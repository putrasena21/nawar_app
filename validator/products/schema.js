const schema = {
  name: 'string|required',
  price: 'string|required',
  description: 'string|required',
  category: 'string|required',
  user_id: 'number|optional'
};

module.exports = schema;
