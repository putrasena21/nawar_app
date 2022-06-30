const schema = {
    name: {type: 'string'},
    email: {type: 'email'},
    password: {type: 'string', min: 8}
}

module.exports = schema; 