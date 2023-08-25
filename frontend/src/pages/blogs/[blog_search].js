import react from 'react'
import { useRouter } from 'next/router'

const Post = () => {
  const router = useRouter()
  const { blog_search } = router.query

  return <p>Post: {blog_search}</p>
}

export default Post

// Now this slug will be sent as HTTP request to the backend.