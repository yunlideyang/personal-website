import { useParams } from 'react-router-dom'
import BlogPostDetail from '../../components/BlogPostDetail/BlogPostDetail'

export default function BlogPost() {
    const { articleId } = useParams()
    return <BlogPostDetail articleId={articleId} />
}
