---
name: docker-deploy
description: >
  Use this skill to build and run the Next.js app as a Docker container.
  Triggers on: "deploy with Docker", "docker build", "docker run",
  "containerize the app", "run in production", "build Docker image",
  or any request to deploy this project via Docker.
  Covers: multi-stage build, Prisma v7 generated client in Docker,
  environment variables, port mapping, and production run.
---


# Skill: Deploy Next.js Docker Application

## Objective

Deploy Next.js application as a Docker container with automatic version validation and zero-conf redeployment.

## Inputs

```json
{
  "image_name": "nextjs-wha-app",
  "version": "1.0.0",
  "container_name": "my-nextjs-wha-app",
  "env_file": ".env.production",
  "host_port": 4000,
  "container_port": 3000
}
```

## Workflow

### Step 1: Validate Docker Image

Check whether image exists:

```bash
docker image inspect nextjs-wha-app:1.0.0 >/dev/null 2>&1
```

If image does not exist:

```bash
docker build -t nextjs-wha-app:1.0.0 .
```

### Step 2: Verify Build Result

```bash
docker images nextjs-wha-app
```

Confirm version tag exists.

### Step 3: Check Existing Container

```bash
docker ps -a --filter "name=my-nextjs-wha-app"
```

If container exists:

```bash
docker stop my-nextjs-wha-app || true
docker rm my-nextjs-wha-app || true
```

### Step 4: Deploy

```bash
docker run \
  --restart=always \
  -d \
  --name my-nextjs-wha-app \
  --env-file .env.production \
  -p 4000:3000 \
  nextjs-wha-app:1.0.0
```

### Step 5: Health Validation

Verify container is running:

```bash
docker ps --filter "name=my-nextjs-wha-app"
```

Verify application responds:

```bash
curl http://localhost:4000
```

### Step 6: Deployment Success Criteria

Deployment is successful if:

* Docker container status = Up
* Port mapping = 4000:3000
* HTTP endpoint responds
* Restart policy = always

## Best Practices

1. Never run deployment without image validation.
2. Never overwrite a running container without stopping/removing it first.
3. Use explicit image tags instead of latest.
4. Always verify deployment after startup.
5. Always use restart policy.
6. Fail deployment immediately if build fails.
7. Keep .env.production outside Docker image.
8. Prefer semantic versions:

```text
1.0.0
1.0.1
1.1.0
2.0.0
```

## Auto Version Detection

Find latest local version:

```bash
docker images nextjs-wha-app --format "{{.Tag}}" | sort -V | tail -n 1
```

If requested version already exists:

```bash
docker image inspect nextjs-wha-app:<version>
```

Skip build and deploy directly.

Otherwise:

```bash
docker build -t nextjs-wha-app:<version> .
```

