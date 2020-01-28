import React, {useState, useEffect} from 'react'
import axios from 'axios'
import { useHistory } from "react-router-dom";

export default function CohortList({mentor}) {
    const history = useHistory()
    const [cohorts, setCohorts] = useState([])
    const [isKey, setIsKey] = useState({
        key: "",
        open:false,
        classroomObj: {},
        error: false
    })
    
    useEffect(() => {
        axios({
            method: `get`,
            url: '/api/cohorts',
            headers: {
                Authorization: 'Bearer ' + localStorage.getItem('accessToken')
            }
        })
        .then(res => {
            // console.log(res)
            setCohorts(res.data)
        })
        .catch(err => {
            console.log(err)
        })
        
        return () => {  };
    }, [])


    const handleCohort = (x) => {
        // console.log(`clicked`, x)
        if(!mentor){
            axios({
                method:`get`,
                url:`/api/cohort-check/${x.class_id}?user_id=${localStorage.getItem('id')}`,
                headers: {
                    Authorization: 'Bearer ' + localStorage.getItem('accessToken')
                }
            })
            .then(res => {
                // console.log(res)
                if(res.data.length === 0)
                    setIsKey({...isKey, open: true, classroomObj: x})
                else{
                    history.push(`/cohort`);
                }
            })
            .catch(err => {
                console.log(err)
            })
        }
        else
            history.push(`/cohort-mentor-page`);
    }

    const handleSubmitKey = (isKey) => {
        const input_key = isKey.key;
        const class_id = isKey.classroomObj.class_id;

        axios({
            method:"post",
            url:`/api/submit-key`,
            data: {
                class_id,
                user_id: localStorage.getItem(`id`),
                input_key
            },
            headers: {
                Authorization: 'Bearer ' + localStorage.getItem('accessToken')
            }
        })
        .then(res => {
            // console.log(res)
            alert("Congrats you enter the correct Key!")
            history.push(`/cohort`);
        })
        .catch(err => {
            console.log(err)
            setIsKey({...isKey, error: true})
        })
    }

    return (
        <>
            {(isKey.open)&&
                <>
                    <h3>{isKey.classroomObj.class_title}</h3>
                    <input type="text" placeholder="Enter Class key here..." value={isKey.key} onChange={(e) => setIsKey({...isKey, key:e.target.value})}/>
                    {(isKey.error)&&<h5 style={{color:`red`, margin:`0`}}>Invalid Key!</h5>}
                    <div style={{display:`flex`}}>
                        <button onClick={() => handleSubmitKey(isKey)}>Submit</button>   
                        <button onClick={() => setIsKey({...isKey, open: false})}>Cancel</button> 
                    </div>   
                </>
            }
            <div style={{display:`flex`}}>
                {cohorts.map((x, i) => (
                    <div 
                        onClick={() => handleCohort(x)} 
                        key={i} 
                        style={{background:`white`, padding:`20px`, margin:`10px`, borderRadius:`5px`, cursor:`pointer`, width:`100%`}}
                    >
                        <h3>{x.class_title}</h3>
                        <p>{x.class_description}</p>
                    </div>
                ))}
            </div>
        </>
    )
}