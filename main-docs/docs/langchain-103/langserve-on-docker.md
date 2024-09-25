---
sidebar_position: 3
---

# LangServe on Docker

This guide covers setting up a development environment for LangChain using Docker, with a focus on LangServe. By the end of this section, you'll have a functional test environment for LangChain and understand how to use Docker for LangChain development.

## Why Use Docker for LangChain?

Using Docker with LangChain offers several advantages:

- Easy dependency management
- Consistent development environment
- Simplified deployment and testing
- Enhanced collaboration
- Improved maintenance and scaling

## Setting Up the Environment

### Clone the Repository

1. Ensure Git is installed on your system.
2. Clone the repository and create a development branch:

```bash
git clone https://github.com/colinmcnamara/austin_langchain
git checkout -b <yourname-dev-branch>
```

### Local Development with Docker

1. Navigate to the `LangChain_103/docker_dev/langserve` directory in the cloned repository.
2. Review and edit the included Dockerfile if necessary.
3. Build the Docker image:

```bash
docker build -t langserve_lab .
```

4. Run the Docker container:

```bash
docker run -p 8080:8080 -it --rm --env-file ~/.env langserve_lab 
```

5. Access the server at http://localhost:8080

## Working with LangServe

### Adding a New App

1. Create a new LangChain app:

```bash
langchain app add research-assistant
```

2. Edit the `app/server.py` file to configure your new app.

3. Rebuild the Docker image:

```bash
docker build -t langserve_lab .
```

4. Stop the existing container:

```bash
docker stop container_id_or_name
```

5. Start a new container with the updated image:

```bash
docker run -p 8080:8080 -it --rm --env-file ~/.env langserve_lab 
```

6. Access your new app at http://localhost:8080/research-assistant/playground

## Docker Best Practices for LangChain Development

1. **Use tags for versioning**: This helps manage different versions of your LangChain applications.

2. **Mount volumes for live updates**:
   ```bash
   docker run -p 8080:8080 -v $(pwd):/usr/src/app langserve_lab
   ```
   This allows you to make changes to your code without rebuilding the image.

3. **Automate with Docker Compose**: For more complex setups involving multiple services.

4. **Regular cleanup**: Use `docker system prune` to remove unused images and free up space.

## Sharing Your LangChain Docker Image

### Pushing to Docker Hub

1. Log in to Docker Hub:
   ```bash
   docker login
   ```

2. Tag your image:
   ```bash
   docker tag langserve_lab yourusername/langserve_lab:latest
   ```

3. Push the image:
   ```bash
   docker push yourusername/langserve_lab:latest
   ```

### Pulling and Running a Shared Image

To use a shared LangChain Docker image:

1. Pull the image:
   ```bash
   docker pull yourusername/langserve_lab:latest
   ```

2. Run a container from the image:
   ```bash
   docker run -p 8080:8080 -it --rm --env-file ~/.env yourusername/langserve_lab:latest
   ```

## Conclusion

Using Docker with LangChain and LangServe provides a robust and flexible development environment. It simplifies dependency management, ensures consistency across different systems, and makes it easy to share and deploy your LangChain applications.

In the next section, we'll explore more advanced LangChain concepts and how to implement them in your Dockerized environment.