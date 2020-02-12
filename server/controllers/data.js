let users = [];
let messages = [];

const addUser = ({ id, class_id, user_id }) => {
	// const index = users.findIndex(user => user.user_id === user_id);

	// if (index !== -1) {
	// 	users.splice(index, 1);
	// }

	const user = { id, class_id, user_id };
	users.push(user);
	return { user };
};

const removeUser = id => {
	const index = users.findIndex(user => user.id === id);

	if (index !== -1) {
		return users.splice(index, 1);
	}
};

module.exports = { users, addUser, removeUser };
