import React, {useCallback, useEffect} from 'react'
import {Button, SelectField, Input,RTE } from '../index'
import { useForm } from 'react-hook-form'
import appwriteService from '../../appwrite/config'
import { useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'



const PostForm = ({post}) => {
    const navigate = useNavigate()
    const {register, handleSubmit, watch, setValue, control, getValues} = useForm({
        defaultValues : {
            title : post?.title || '',
            slug : post?.slug || '',
            content : post?.content || '',
            status : post?.status || 'active',
        }
    })

    const userData = useSelector(state => state.auth.userData)

    const submit = async (data) => {
    try {
        if (post) {
         const file = data.image?.[0] ? await appwriteService.uploadFile(data.image[0]) : null
         if (file && post.featuredImage) {
            await appwriteService.deleteFile(post.featuredImage)
        }

         const dbPost = await appwriteService.updatePost(post.$id, {
          ...data,
            featuredImage: file ? file.$id : post.featuredImage, // keep old image if no new uploaded
        })

        if (dbPost && dbPost.$id) {
            navigate(`/post/${dbPost.$id}`)
        } else {
            console.error('Update failed or no $id in response:', dbPost)
            }
        } 
    else {
        if (!userData) {
            console.error('User data missing, cannot create post')
            return
        }
      
         const file = data.image?.[0] ? await appwriteService.uploadFile(data.image[0]) : null
         if (!file) {
        console.error('Image upload failed or no file provided')
        return
        }

          data.featuredImage = file.$id
          const dbPost = await appwriteService.createPost({ ...data, userId: userData.$id })

        if (dbPost && dbPost.$id) {
            navigate(`/post/${dbPost.$id}`)
        } 
        else {
        console.error('Create failed or no $id in response:', dbPost)
          }
        }
    } 
    catch(error){
        console.error('Error submitting form: ', error)
        }
    }


    const slugTransform = useCallback((value) => {
            if(value && typeof value === 'string'){
                // const slug = value.toLowerCase().replace(/ /g, '-') 
                // setValue('slug', slug)
                // return slug
                return value
                .trim()
                .toLowerCase()
                .replace(/[^a-zA-Z\d\s]+/g, '-')
                .replace(/\s/g, "-");
            }
            else return ''
    }, [])

    useEffect(() => {
      const subscription = watch((value, {name}) => {
        if(name === 'title'){
            setValue('slug', slugTransform(value.title), {shouldValidate : true})
        }
      })

      return () => {subscription.unsubscribe()}
    }, [watch, slugTransform, setValue])
    

  return (
    <form onSubmit={handleSubmit(submit)} className='flex flex-wrap p-6'>
        <div className='w-2/3 px-2'>
            <Input
             label= 'Title: '
             placeholder = 'Title'
             className='mb-4'
             {...register('title', {
                required : true,
             })}  
            />

            <Input
             label= 'Slug: '
             placeholder = 'Slug'
             className='mb-4'
             {...register('slug', {
                required : true,
             })}  
             onInput = {(e) => {
                const value = e.currentTarget.value;
                const transformed = slugTransform(value)
                setValue('slug', transformed, {shouldValidate : true})
             }}
            />

            <RTE 
            label= 'Content: '
            name= 'content'
            control={control}
            />
        </div>

        <div className='w-1/3 px-2'>
            <Input
            label = 'Featured Image:'
            type='file'
            className='mb-4'
            accept = 'image/png, image/jpg, image/jpeg, image/gif'
            {...register('image' , {
                required : !post,
            })} 
            />

            {post && (
                <div className='w-full mb-4'>
                    <img 
                    src={appwriteService.filePreview(post.featuredImage)} 
                    alt={post.title}
                    className='rounded-lg'
                    />
                </div>
            )}

            <SelectField
            options = {['active', 'inactive']}
            label= 'Status'
            className='mb-4'
            {...register('status', {
                required : true,
            })}
            />

            <Button
            type='submit'
            bgColor= { post ? 'bg-green-500' : undefined} 
            className='w-full'
            >
                {post ? 'Update' : 'Submit'}
            </Button>
        </div>
    </form>
  )
}

export default PostForm
