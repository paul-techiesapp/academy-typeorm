import { Router, Request, Response } from "express";
import { AppDataSource } from "../data-source";
import { Post } from "../entities/Post";
import { User } from "../entities/User";

export const postRouter = Router();

const postRepository = AppDataSource.getRepository(Post);
const userRepository = AppDataSource.getRepository(User);

// GET /posts — list all posts, EAGER LOADING the author (the "one" side).
// Approach 1: the declarative `relations` option → LEFT JOIN on users.
postRouter.get("/", async (_req: Request, res: Response) => {
  const posts = await postRepository.find({
    relations: { user: true },
    order: { createdAt: "DESC" },
  });
  res.json(posts);
});

// GET /posts/query — same eager load, but via the QueryBuilder.
// Approach 2: `leftJoinAndSelect` gives you fine-grained control (aliases,
// extra WHERE clauses, selecting only specific columns) that the `relations`
// shortcut can't express.
postRouter.get("/query", async (_req: Request, res: Response) => {
  const posts = await postRepository
    .createQueryBuilder("post")
    .leftJoinAndSelect("post.user", "user")
    .orderBy("post.createdAt", "DESC")
    .getMany();
  res.json(posts);
});

// GET /posts/:id — one post with its author eager-loaded.
postRouter.get("/:id", async (req: Request, res: Response) => {
  const post = await postRepository.findOne({
    where: { id: Number(req.params.id) },
    relations: { user: true },
  });
  if (!post) {
    return res.status(404).json({ message: "Post not found" });
  }
  res.json(post);
});

// POST /posts — create a post for an existing user.
// Body: { title, content, userId }
postRouter.post("/", async (req: Request, res: Response) => {
  const { title, content, userId } = req.body;

  // Verify the parent user exists before creating the child post.
  const user = await userRepository.findOneBy({ id: Number(userId) });
  if (!user) {
    return res.status(400).json({ message: "userId does not reference an existing user" });
  }

  const post = postRepository.create({ title, content, userId: user.id });
  const saved = await postRepository.save(post);
  res.status(201).json(saved);
});
