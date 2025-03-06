import Blog from './blog.model';
import { IBlog } from './blog.interface';

class BlogService {
  async createBlog(blogData: IBlog) {
    const blog = new Blog(blogData);
    return await blog.save();
  }

  async getBlogs() {
    return await Blog.find();
  }

  async getBlogById(id: string) {
    return await Blog.findById(id);
  }

  async updateBlog(id: string, blogData: IBlog) {
    return await Blog.findByIdAndUpdate(id, blogData, { new: true });
  }

  async deleteBlog(id: string) {
    return await Blog.deleteOne({ _id: id });
  }
}

export default new BlogService();
