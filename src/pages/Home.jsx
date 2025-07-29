import React, {useEffect, useState} from 'react'
import appwriteService from '../appwrite/config'
import { Container, PostCard } from '../components'
import { useSelector } from 'react-redux'

const Home = () => {
    const [posts , setPosts] = useState([])
    const authStatus = useSelector(state => state.auth.status)

    useEffect(() => {
        appwriteService.getPosts().then((posts) => {
            if(posts){
                setPosts(posts.documents)
            }
        })
    }, [])
    
  if(posts.length === 0){
    const message = authStatus? 'No posts' : 'Login to read posts'
    return (
        <div className='w-full py-8 mt-4 text-center min-h-[60vh] flex justify-center items-center'>
            <Container>
            <div className='flex flex-wrap'>
                <div className='p-2 w-full'>
                    <h1 className='text-4xl font-bold hover:text-gray-500'>
                        {message}
                    </h1>
                </div>
            </div>
            </Container>
        </div>
    )
  }
  else{
    return (
        <div className='w-full py-8'>
            <Container>
                <div className='flex flex-wrap min-h-[60vh]'>
                    {posts.map((post) => (
                        <div className='p-2 w-1/4' key={post.$id}>
                            <PostCard {...post} />
                        </div>
                    ))}
                </div>
            </Container>
        </div>
    )
  }
}

export default Home
