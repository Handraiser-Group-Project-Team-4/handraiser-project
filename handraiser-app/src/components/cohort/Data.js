import { useState, useEffect, useMemo } from 'react';
import Axios from 'axios';
import jwtToken from '../tools/jwtToken';

export default function Data(id) {
	const [data, setData] = useState([]);
	const [isTrue, setIsTrue] = useState(false);
	const userObj = jwtToken();
	useEffect(() => {
		if (id) {
			Axios({
				method: 'get',
				url: `/api/concern/${id}`,
				headers: {
					Authorization: 'Bearer ' + sessionStorage.getItem('accessToken')
				}
			})
				.then(res => {
					setData(res.data);
					let isNull = false;
					res.data.map(student => {
						if (userObj.user_id === student.student_id) {
							isNull = true;
						}
						return isNull;
					});
					setIsTrue(isNull);
				})
				.catch(err => console.log(err));
		}
	}, [id, isTrue, userObj.user_id]);

	const handleData = useMemo(() => ({ data, setData }), [data, setData]);

	return { handleData, isTrue, setIsTrue };
}
