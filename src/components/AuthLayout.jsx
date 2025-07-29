import React, {useState, useEffect} from 'react'
import {useSelector} from 'react-redux'
import { useNavigate } from 'react-router-dom'

const Protected = ({children, authentication = true, ...props}) => {
    const navigate = useNavigate()
    const [loader, setLoader] = useState(true)

    const authStatus = useSelector(state => state.auth.status)

    useEffect(() => {
        if(authentication && authStatus !== authentication){
            navigate('/login')
        }
        else if(!authentication && authStatus !== authentication ){
            navigate('/')
        }

        // if(authStatus === true){
        //   navigate('/')
        // }else if(authStatus === false){
        //   navigate('/login')
        // }

        setLoader(false);

    }, [authStatus, navigate, authentication])
    

  return loader? <h1>Loading...</h1> : <>{children}</>
}

export default Protected