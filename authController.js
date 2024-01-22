// const User = require('./User.js').db_user
// const User = require('./Role.js').db_role
const User = require('./db.js')
const Rules = require('./db.js')

class authController {
    async registration(req, res) {
        try {
            
        } catch (error) {
            
        }
    }
    async login(req, res) {
try {
    
} catch (error) {
    
}
    }
    async getUsers(req, res) {
        try {
            const userRole = new Role()
            const adminRole = new Role({value: "ADMIN"})
            userRole.


            res.json('server is working')
        } catch (error) {
            
        }
    }
}

module.exports = new authController()