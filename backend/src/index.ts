import express from "express";
import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import z, { string } from "zod";
import bcrypt, { hash } from "bcrypt";
import dotenv from "dotenv";
import { ContentModel, LinkModel, TagModel, UserModel } from "./db";
import { userMiddleware } from "./middleware/userMiddleware";
import { random } from "./utils/utils";
import cors from "cors";

dotenv.config();
const app = express();
app.use(express.json());
app.use(cors());

app.post("/api/v1/signup", async (req, res) => {
  //zod validation
  const userProfileSchema = z.object({
    username: z.string().min(1, { message: "username cannnot be empty" }),
    password: z.string().min(6),
  });

  const parsedData = userProfileSchema.safeParse(req.body);

  if (!parsedData.success) {
    return res
      .status(400)
      .json({ message: "Incorrect format", error: parsedData.error });
  }

  const { username, password } = parsedData.data;

  try {
    const exisitingUser = await UserModel.findOne({ username });

    if (exisitingUser) {
      return res.status(409).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await UserModel.create({
      username,
      password: hashedPassword,
    });

    res.json({ message: "User signed up" });
  } catch (err) {
    res.status(500).json({ message: "Error while signing up" });
  }
});

app.post("/api/v1/signin", async (req, res) => {
  //zod validation
  const userProfileSchema = z.object({
    username: z.string().min(1, { message: "username cannnot be empty" }),
    password: z.string().min(6),
  });

  const parsedData = userProfileSchema.safeParse(req.body);

  if (!parsedData.success) {
    return res
      .status(400)
      .json({ message: "Incorrect format", error: parsedData.error });
  }

  const { username, password } = parsedData.data;

  try {
    const user = await UserModel.findOne({ username });

    if (!user) {
      return res.status(401).json({
        message: "Incorrect Credentials!",
      });
    }
    const passwordMatch = await bcrypt.compare(password, user.password!);

    if (!passwordMatch) {
      return res.status(401).json({ message: "Invalid username or password" });
    }
    const token = jwt.sign(
      {
        id: user._id,
      },
      process.env.JWT_SECRET!
    );
    res.json({
      token,
    });
  } catch (e) {
    if (e instanceof Error) {
      res
        .status(500)
        .json({ message: "Error while signing in", error: e.message });
    } else {
      res.status(500).json({ message: "Unknown error" });
    }
  }
});

app.post("/api/v1/content", userMiddleware, async (req, res) => {
  //zod validation
  const contentRequiredBody = z.object({
    title: z.string().min(1, { message: "Title is required" }),
    link: z.url({ message: "Link must be a valid URL" }),
    type: z.enum(["twitter", "youtube", "document", "link", "tag"]),
    tags: z.array(z.string()),
  });

  const parsedData = contentRequiredBody.safeParse(req.body);

  if (!parsedData.success) {
    return res
      .status(400)
      .json({ message: "Invalid content input", error: parsedData.error });
  }

  const { title, link, type, tags } = parsedData.data;

  try {
    const tagIds = await Promise.all(
      tags.map(async (tagTitle) => {
        let tag = await TagModel.findOne({ title: tagTitle });

        if (!tag) {
          tag = await TagModel.create({ title: tagTitle });
        }

        return tag._id;
      })
    );

    const content = await ContentModel.create({
      title,
      link,
      tags: tagIds,
      type,

      userId: req.userId,
    });
    res.json({ message: "Content added", content });
  } catch (e) {
    console.error(e);
    res.status(500).json({ messsage: "Failed to add content" });
  }
});

app.get("/api/v1/content", userMiddleware, async (req, res) => {
  const userId = req.userId;

  try {
    const content = await ContentModel.find({
      userId,
    })
      .populate("userId", "username")
      .populate("tags", "title");
    res.json({ content });
  } catch (e) {
    console.error(e);
    res.status(500).json({ messsage: "Failed to load content" });
  }
});

app.delete("/api/v1/content/:id", userMiddleware, async (req, res) => {
  const contentId = req.params.id;

  try {
    await ContentModel.deleteOne({
      _id: contentId,
      userId: req.userId,
    });
    res.json({ message: "Deleted" });
  } catch (e) {
    console.error(e);
    res.status(401).json({ message: "Failed to delete content" });
  }
});

app.post("/api/v1/brain/share", userMiddleware, async (req, res) => {
  const { share } = req.body;

  try {
    if (share) {
      const existingLink = await LinkModel.findOne({
        userId: req.userId,
      });

      if (existingLink) {
        return res.json({ hash: existingLink.hash });
      }

      const hash = random(10);
      await LinkModel.create({
        userId: req.userId,
        hash,
      });
      res.json({ hash });
    } else {
      await LinkModel.deleteOne({
        userId: req.userId,
      });
      res.json({ message: "Link Removed" });
    }
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: "Failed to generate sharable link" });
  }
});

app.get("/api/v1/brain/:shareLink", async (req, res) => {
  const hash = req.params.shareLink;

  try {
    const link = await LinkModel.findOne({ hash });

    if (!link) {
      return res.status(404).json({ message: "invalid shared link" });
    }

    const content = await ContentModel.find({ userId: link.userId }).populate(
      "tags"
    );
    const user = await UserModel.findOne({ _id: link.userId });

    if (!user) {
      return res.status(404).json({ message: "user not found" });
    }

    res.json({
      username: user.username,
      content,
    });
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: "Failed to load content" });
  }
});

const port = process.env.PORT || 3000;

async function startServer() {
  try {
    await mongoose.connect(process.env.MONGODB_URL!);
    console.log("✅ Connected to MongoDB");
    app.listen(port, () => console.log(`Server is running on port ${port}`));
  } catch (e) {
    if (e instanceof Error) {
      console.error("error while starting server", e.message);
    } else {
      console.error("Unknown error", e);
    }
  }
}

startServer();
