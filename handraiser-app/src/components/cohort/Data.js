import { useState, useEffect } from 'react';
import Axios from 'axios';

export default function Data(id, concern, socket) {
	const [data, setData] = useState([]);

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
	}, [data, concern, id, socket]);

	return { data, setData };
}
