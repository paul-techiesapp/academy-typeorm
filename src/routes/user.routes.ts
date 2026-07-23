import { Router, Request, Response } from "express";
import { AppDataSource } from "../data-source";
import { User } from "../entities/User";

export const userRouter = Router();

// The repository is fully typed to `User` — you get autocomplete on every
// column and query method (findOneBy, save, create, etc.).
const userRepository = AppDataSource.getRepository(User);

// GET /users — list all users, EAGER LOADING each user's posts.
// `relations: { posts: true }` makes TypeORM emit a LEFT JOIN so every
// returned user arrives with its `posts` array already populated.
userRouter.get("/", async (_req: Request, res: Response) => {
  const users = await userRepository.find({
    relations: { posts: true },
  });
  res.json(users);
});

// GET /users/:id — fetch one user WITH posts eager-loaded.
userRouter.get("/:id", async (req: Request, res: Response) => {
  const user = await userRepository.findOne({
    where: { id: Number(req.params.id) },
    relations: { posts: true },
  });
  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }
  res.json(user);
});

// POST /users — create a user
userRouter.post("/", async (req: Request, res: Response) => {
  const { firstName, lastName, email } = req.body;
  const user = userRepository.create({ firstName, lastName, email });
  const saved = await userRepository.save(user);
  res.status(201).json(saved);
});

// PUT /users/:id — update a user
userRouter.put("/:id", async (req: Request, res: Response) => {
  const user = await userRepository.findOneBy({ id: Number(req.params.id) });
  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }
  userRepository.merge(user, req.body);
  const updated = await userRepository.save(user);
  res.json(updated);
});

// DELETE /users/:id — remove a user (posts cascade-delete at the DB level)
userRouter.delete("/:id", async (req: Request, res: Response) => {
  const result = await userRepository.delete({ id: Number(req.params.id) });
  if (result.affected === 0) {
    return res.status(404).json({ message: "User not found" });
  }
  res.status(204).send();
});
