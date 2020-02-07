let users = [];
let concerns = [];
let messages = [];

const addUser = ({ id, class_id, user_id }) => {
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

module.exports = { users, concerns, messages, addUser, removeUser };
