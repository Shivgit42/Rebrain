import mongoose from "mongoose";
import dotenv from "dotenv";
import bcrypt from "bcrypt";
import { UserModel, TagModel, ContentModel } from "./db";

dotenv.config();

async function seed() {
  if (!process.env.MONGODB_URL) {
    console.error("MONGODB_URL not set in .env - aborting.");
    process.exit(1);
  }

  await mongoose.connect(process.env.MONGODB_URL);
  console.log("✅ Connected to MongoDB");

  const demoUsername = process.env.DEMO_USERNAME || "demo";
  let demoUser = await UserModel.findOne({ username: demoUsername });

  if (!demoUser) {
    const hashedPassword = await bcrypt.hash("demo-password", 10);
    demoUser = await UserModel.create({
      username: demoUsername,
      password: hashedPassword,
    });
    console.log("Created demo user:", demoUsername);
  } else {
    console.log("Demo user exists:", demoUsername);
  }

  const demoContents = [
    {
      title: "tweet",
      link: "https://x.com/superSaiyanSkai/status/1948307961157206419",
      type: "twitter",
      tags: ["brainrot"],
    },
    {
      title: "jwt",
      link: "https://www.youtube.com/watch?v=xrj3zzaqODw",
      type: "youtube",
      tags: ["jwt", "tokens"],
    },
    {
      title: "Tailwind with vite guide",
      link: "https://tailwindcss.com/docs/installation/using-vite",
      type: "link",
      tags: ["tailwind", "vite"],
    },
    {
      title: "Tech Market",
      link: "https://x.com/Vikasifications/status/1948716485486186983",
      type: "twitter",
      tags: ["tech"],
    },
    {
      title: "roadmap",
      link: "https://x.com/pankajkumar_dev/status/1952240582249603455",
      type: "twitter",
      tags: ["roadmap"],
    },
    {
      title: "gate coding",
      link: "https://www.youtube.com/watch?v=Kj9nmjvf6wk",
      type: "youtube",
      tags: ["gate", "coding", "competitive"],
    },
    {
      title: "doc ex",
      link: "https://www.princexml.com/samples/",
      type: "document",
      tags: ["example"],
    },
    {
      title: "LLM",
      link: "https://www.youtube.com/watch?v=zjkBMFhNj_g",
      type: "youtube",
      tags: ["llm", "ml", "ai"],
    },
    {
      title: "Tailwind with vite guide",
      link: "https://tailwindcss.com/docs/installation/using-vite",
      type: "link",
      tags: ["tailwind", "vite"],
    },
  ];

  for (const item of demoContents) {
    const exists = await ContentModel.findOne({
      title: item.title,
      userId: demoUser._id,
    });
    if (exists) {
      console.log("Skipping existing content:", item.title);
      continue;
    }

    const tagIds = await Promise.all(
      item.tags.map(async (t) => {
        let tag = await TagModel.findOne({ title: t });
        if (!tag) tag = await TagModel.create({ title: t });
        return tag._id;
      })
    );

    await ContentModel.create({
      title: item.title,
      link: item.link,
      type: item.type,
      tags: tagIds,
      userId: demoUser._id,
    });

    console.log("Created demo content:", item.title);
  }

  console.log("✅ Seeding complete");
  await mongoose.disconnect();
  process.exit(0);
}

seed().catch((err) => {
  console.error("Seed failed:", err);
  process.exit(1);
});
