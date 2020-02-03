import { useState, useEffect } from 'react';
import Axios from 'axios';
import jwtToken from '../tools/jwtToken';

export default function Data(id, socket) {
	const userObj = jwtToken();
	const [data, setData] = useState([]);
	const [isTrue, setIsTrue] = useState(false);

	useEffect(() => {
		Axios({
			method: 'get',
			url: `/api/concern/${id}`,
			headers: {
				Authorization: 'Bearer ' + sessionStorage.getItem('accessToken')
			}
		})
			.then(res => {
				setData(res.data);

				let val = false;
				res.data.map(student => {
					if (student.student_id === userObj.user_id) {
						val = true;
					}
					return val;
				});
				setIsTrue(val);

				socket.emit('join', res.data);
				socket.on('out', data => {
					setData(data);
				});
			})
			.catch(err => console.log(err));
		return () => {
			socket.emit('disconnect');
			socket.off();
		};
	}, [data, id, socket, isTrue, userObj.user_id]);

	return { data, setData, isTrue, setIsTrue };
}
