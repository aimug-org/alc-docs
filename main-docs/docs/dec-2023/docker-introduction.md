---
sidebar_position: 2
---

# Docker Introduction

In this section, we'll introduce Docker and its relevance to LangChain applications. We'll go through a simple example of containerizing a Python script using Docker.

## Why Docker for LangChain?

Docker is particularly beneficial for developers building applications with LangChain because:

- It ensures consistent behavior across different environments.
- It enhances reproducibility - others can replicate your exact setup and results.
- It simplifies sharing code and running labs efficiently.

## Key Docker Concepts

1. **Dockerfile**: A blueprint for building a Docker image, containing instructions for setting up the environment.
2. **Docker Image**: A static snapshot of the Dockerfile's instructions, bundling the application code with all necessary components.
3. **Docker Container**: A runnable instance of an image, providing an isolated environment for the application.
4. **Docker Compose**: A tool for defining and running multi-container Docker applications (useful for more complex setups).

## Getting Started with Docker

### Installation

Docker Desktop is the recommended way to get started. It provides a user-friendly interface and bundles everything you need. Visit [Docker Desktop](https://www.docker.com/products/docker-desktop/) for installation instructions.

### Hello World Example

Let's create a simple Python script and containerize it using Docker.

#### Step 1: Create a Python Script

Create a file named `hello.py` with the following content:

```python
# hello.py
print("Hello from Docker!")
```

#### Step 2: Write the Dockerfile

Create a `Dockerfile` in the same directory:

```dockerfile
# Dockerfile
FROM python:3.8-slim
COPY hello.py /app/
WORKDIR /app
CMD ["python", "hello.py"]
```

This Dockerfile:
- Uses Python 3.8 slim as the base image
- Copies our script into the container
- Sets the working directory
- Specifies the command to run our script

#### Step 3: Build the Docker Image

Open a terminal, navigate to your project directory, and run:

```shell
docker build -t hello-world-image .
```

This command builds a Docker image tagged as `hello-world-image`.

#### Step 4: Run the Docker Container

After the build completes, run the container:

```shell
docker run hello-world-image
```

You should see the output: `Hello from Docker!`

## Next Steps

Now that you understand the basics of Docker, we'll explore how to use it with LangChain applications in the next section, focusing on LangServe deployment using Docker.

## Additional Resources

- [Docker Documentation](https://docs.docker.com/guides/get-started/)
- [Dockerfile Reference](https://docs.docker.com/engine/reference/builder/)
- [Docker Build Command](https://docs.docker.com/engine/reference/commandline/build/)
- [Docker Run Command](https://docs.docker.com/engine/reference/commandline/run/)