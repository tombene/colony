const uuidv4 = require('uuid/v4');

/*
*	createUser
*	Creates a user.
*	@prop id {string}
*	@prop name {string}
*	@param {object} 
*		name {string}
*/
const createUser = ({name = "", socketId = null} = {})=>(
	{
		id:uuidv4(),
		name,
		socketId
		
	}
)


module.exports = {
	createUser
}