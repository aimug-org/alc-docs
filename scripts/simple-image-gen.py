import replicate
import os
import logging
from dotenv import load_dotenv
import requests
import argparse

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

# Load environment variables
load_dotenv()

# Constants
REPLICATE_API_TOKEN = os.getenv("REPLICATE_API_TOKEN")
if not REPLICATE_API_TOKEN:
    raise ValueError("REPLICATE API token not found in environment variables")

MODELS = {
    "flux": {
        "owner": "black-forest-labs",
        "name": "flux-dev",
        "version": "latest"
    },
    "flux-pro": {
        "owner": "black-forest-labs",
        "name": "flux-1.1-pro-ultra",
        "version": "8a89b0ab59a1d2e14ad3c8ef10a47a3a84ec2813"
    }
}

def generate_and_save_image(filepath: str, model_key: str, description: str) -> bool:
    """Generate image using Replicate API and save directly to file"""
    try:
        # Ensure directory exists
        os.makedirs(os.path.dirname(filepath), exist_ok=True)
        
        # Get model info
        model_info = MODELS[model_key]
        
        # Run prediction with model-specific parameters
        model_path = f"{model_info['owner']}/{model_info['name']}"
        
        output = replicate.run(
            model_path,
            input={
                "prompt": description,
                "width": 1200,
                "height": 630,
                "num_outputs": 1,
                "guidance": 7.5,
                "prompt_strength": 0.8,
                "num_inference_steps": 50,
                "output_format": "png",
                "output_quality": 90
            }
        )
        
        # Get the output URL and download the image
        image_url = output[0] if isinstance(output, list) else output
        response = requests.get(image_url)
        if response.status_code != 200:
            raise Exception(f"Failed to download image. Status: {response.status_code}")
            
        with open(filepath, "wb") as file:
            file.write(response.content)
        
        return True
    except Exception as e:
        logger.error(f"Error generating image: {str(e)}")
        return False

def main():
    parser = argparse.ArgumentParser(description='Generate image from description')
    parser.add_argument('--model', choices=['flux', 'flux-pro'], default='flux',
                      help='Model to use for generation')
    parser.add_argument('--output', type=str, required=True,
                      help='Output path for the generated image')
    parser.add_argument('--description', type=str, required=True,
                      help='Image description/prompt')
    
    args = parser.parse_args()
    
    if generate_and_save_image(args.output, args.model, args.description):
        logger.info(f"Successfully generated image at {args.output}")
    else:
        logger.error(f"Failed to generate image at {args.output}")

if __name__ == "__main__":
    main()
