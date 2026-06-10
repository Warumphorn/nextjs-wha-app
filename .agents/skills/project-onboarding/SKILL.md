---
name: project-onboarding
description: Use when a new developer asks about setup project. how to get started,what tech stack is used, and any gotchas that they should be aware of.
orientation: "project onboarding"
compatibility: Use Node.js 22+
license: MIT
metadata: 
  author: "Warumphorn klomkloam"
  version: "1.0.0"
---

#First-time project onboarding

```bash
# 1. Install dependencies
[] npm install

# 2. Install Deps
[] cp .env.example .env

# 3. Pull DB Schema (Prisma ORM)
[] npx prisma db pull

# 4. Generate Prisma Client
[] npx prisma generate

# 5. Check lint
[] npm run lint

```


## Gotchas
- ต้องติดตั้งและปิด Docker Desktop ไว้  
- อย่าลืม .env ด้วย

## Output
-ถ้าถามการ Setup ให้ตอบเป็นรูปแบบของตาราง และอ่านง่าย
