import React, {useState, useEffect} from 'react'
import { Container, PostCard } from '../components'
import appwriteService from '../appwrite/config'

const AllPosts = () => {
    const [posts, setPosts ] = useState([])

    useEffect(() => {
    const fetchPosts = async () => {
      try {
        const result = await appwriteService.getPosts()
        if (result && result.documents) {
          setPosts(result.documents)
        } else {
          setPosts([])
        }
      } catch (error) {
        console.error('Failed to fetch posts:', error)
        setPosts([])
      }
    }

    fetchPosts()
  }, [])


  return (
    <div className='py-8'>
      <Container>
        <div className='flex flex-wrap min-h-[60vh]'>
            {posts.length>0 ? posts.map((post) => (
                <div className='p-2 w-1/4' key={post.$id}>
                    <PostCard {...post}/>
                </div>
            )) : (<div className='flex text-4xl justify-center font-bold items-center mx-auto'>
              No posts
            </div>)}
        </div>
      </Container>
    </div>
  )
}

export default AllPosts
