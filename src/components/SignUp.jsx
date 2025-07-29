import React,{useState} from 'react'
import authService from '../appwrite/auth'
import { Link, useNavigate } from 'react-router-dom'
import { login } from '../store/authSlice'
import {Button, Logo, Input} from './index'
import { useDispatch } from 'react-redux'
import { useForm } from 'react-hook-form'

const SignUp = ({}) => {
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const {register, handleSubmit} = useForm()
    const [error, setError] = useState('')

    const signUp = async (data) => {
        setError('')
        try{
            const account = await authService.createAccount(data)
            if(account){
                const userData =  await authService.getCurrentUser()
                if(userData){
                    dispatch(login(userData))
                    navigate('/')
                }
            }
        }
        catch(error){
            setError(error.message)
        }
    }
    
  return (
    <div className='w-full flex items-center justify-center'>
      <div className='mx-auto w-full max-w-lg bg-gray-100 rounded-xl p-10 border border-black/10'>
        <div className='mb-2 flex justify-center'>
            <span className='inline-block w-full max-w-[100px]'>
                <Logo width='100%'/>
            </span>
        </div>
        <h2 className='text-center text-2xl font-bold leading-tight'>Sign up to create account</h2>
        <p className='mt-2 text-center text-base text-black/60'>
            already have an account?&nbsp;
            <Link to='/login' className='font-medium transition-all duration-200 hover:underline'>Sign In</Link>
        </p>

        {error && 
        <p className='text-red-500 mt-8 text-center'>
            {error}
        </p>}

        <form onSubmit={handleSubmit(signUp)}>
            <div className='space-y-5'>
                <Input 
                label='Full Name: '
                placeholder = 'Enter your full name'
                {...register('name', {
                    required: true,
                })}
                />

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
                    minLength : 8, 
                })}/>

                <Button 
                type='submit'
                className='w-full'>
                    Create account
                </Button>
                
            </div>
        </form>
      </div>
    </div>
  )
}

export default SignUp
