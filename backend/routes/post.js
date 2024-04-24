import express from 'express';
import Post from '../models/post.js';
import authenticateToken from '../middleware.js';

const router = express.Router();

router.get('/', async (req, res) => { // http://localhost:4000/post
    try {

        const posts = await Post.find();

        res.status(200).json(posts);

    } catch (error) {

        console.error(error);

        res.status(500).json({ error: 'Internal Server Error' });

    }
});

router.post('/create', authenticateToken , async (req, res) => { // http://localhost:4000/post/create
    const { content, media } = req.body;
    const user = req.user.id;
    const name = req.user.name;

    try {
        var newPost;

        if (!media) {
            newPost = await Post.create({ user, content, authname: name });
        }
        else if (!content) {
            newPost = await Post.create({ user, media, authname: name });
        }
        else if (media){
            newPost = await Post.create({ user, content, media, authname: name });
        }

        res.status(201).json(newPost);

    } catch (error) {

        console.error(error);

        res.status(500).json({ error: 'Internal Server Error' });

    }
});

router.post('/byUserId', async (req, res) => { // http://localhost:4000/post/byuserid

    const { userId } = req.body;

    try {

        const userPosts = await Post.find({ user: userId });

        res.status(200).json(userPosts);

    } catch (error) {

        console.error(error);

        res.status(500).json({ error: 'Internal Server Error' });

    }
});

router.post('/byId', async (req, res) => { // http://localhost:4000/post/byid

    const { postId } = req.body;

    try {

        const post = await Post.findById(postId);

        res.status(200).json(post);

    } catch (error) {

        console.error(error);

        res.status(500).json({ error: 'Internal Server Error' });

    }
});

router.post('/delete', async (req, res) => { // http://localhost:4000/post/delete

    const { postId } = req.body;

    try {

        const deletedPost = await Post.findByIdAndDelete(postId);

        if (!deletedPost) {
            return res.status(404).json({ error: 'Post not found' });
        }

        res.status(200).json({ message: 'Post deleted successfully' });

    } catch (error) {

        console.error(error);

        res.status(500).json({ error: 'Internal Server Error' });
        
    }
});


export default router;
