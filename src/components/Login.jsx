import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {login as authLogin} from '../store/authSlice'
import { Button, Input, Logo} from './index'
import { useDispatch } from 'react-redux'
import authService from '../appwrite/auth'
import {useForm} from 'react-hook-form'

const Login = () => {
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const {register, handleSubmit} = useForm()
    const[error, setError] = useState('')

    const login = async (data) => {
        setError('')  // clean error
        try{
            const session = await authService.login(data)
            if(session){
                const userData = await authService.getCurrentUser();
                if(userData){
                    dispatch(authLogin(userData))
                    navigate('/')
                }
            }
        }
        catch(error){
            setError(error.message)
        }
    }


  return (
    <div className='w-full flex items-center justify-center p-10 min-h-[62vh]'>
      <div className='mx-auto w-full max-w-lg bg-gray-100 rounded-xl p-10 border border-black/10'>
        <div className='mb-2 flex justify-center'>
            <span className='inline-block w-full max-w-[100px]'>
                <Logo width='100%'/>
            </span>
        </div>
        <h2 className='text-center text-2xl font-bold leading-tight'>Sign in to your account</h2>
        <p className='mt-2 text-center text-base text-black/60'>
            Don&apos; have any account?&nbsp;
            <Link to='/signup' className='font-medium transition-all duration-200 hover:underline'>Sign Up</Link>
        </p>

        {error && (
            <p className='text-red-500 text-center mt-8'>{error}</p>
        )}

        <form onSubmit={handleSubmit(login)} className='mt-8'>
            <div className='space-y-2'>
                <Input
                label='Email: '
                placeholder = 'Enter your email'
                type='email'
                {...register('email', {  // 'email' is key
                    required : true,
                    validate : {
                        matchPattern : (value) => /^([\w\.\-_]+)?\w+@[\w-_]+(\.\w+){1,}$/.test(value) || 'Email address must be a valid address',
                    }
                })} 
                />

                <Input
                label='Password: '
                placeholder='Enter your password'
                type='password'
                {...register('password',  {  // 'password' is key
                    required : true,
                })}/>

                <Button
                type='submit'
                className='w-full'>
                    Sign in
                </Button>
            </div>
        </form>

      </div>
    </div>
  )
}

export default Login
