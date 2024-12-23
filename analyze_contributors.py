import subprocess
import json
import requests
import os
import yaml
import re
from collections import defaultdict
from datetime import datetime
from pathlib import Path
from dotenv import load_dotenv

# Load environment variables from current directory
env_path = Path('.env')
if env_path.exists():
    load_dotenv(env_path)
    print(f"Loaded .env file from: {env_path.absolute()}")
else:
    print(f"No .env file found at: {env_path.absolute()}")

# Debug: Print environment variables (without exposing token value)
print("Environment variables loaded:")
print("GITHUB_TOKEN present:", "GITHUB_TOKEN" in os.environ)
if "GITHUB_TOKEN" not in os.environ:
    print("Warning: GITHUB_TOKEN not found in environment variables")

# Map of email addresses to GitHub usernames (for non-noreply addresses)
EMAIL_TO_GITHUB = {
    'colin@2cups.com': 'colinmcnamara',
    'rickp1795@gmail.com': 'RPirruccio',
    'jimmy00784@gmail.com': 'lalanikarim',
    'scott@askinosie.com': 'saskinosie',
    'saurabhlal193@gmail.com': 'saurabhlalsaxena'
}

def get_git_log():
    try:
        # Set environment variable to disable git pager
        env = os.environ.copy()
        env["GIT_PAGER"] = ""
        
        # Get git log with specific format and no pagination
        cmd = ["git", "log", "--pretty=format:%h|%ae|%ad|%s", "--date=short"]
        result = subprocess.run(
            cmd,
            capture_output=True,
            text=True,
            env=env,
            cwd="/Users/colinmcnamara/Code/austin_langchain"
        )
        
        if result.stdout:
            return [line for line in result.stdout.strip().split('\n') if line]
        return []
    except subprocess.CalledProcessError as e:
        print(f"Error getting git log: {e}")
        return []

def parse_git_log(log_entries):
    # Dictionary to store commits by month
    monthly_commits = defaultdict(list)
    
    for entry in log_entries:
        if not entry:
            continue
        
        try:
            hash_id, email, date, subject = entry.split('|')
            # Convert date string to datetime
            commit_date = datetime.strptime(date, '%Y-%m-%d')
            month_key = f"{commit_date.strftime('%B')} {commit_date.year}"
            
            monthly_commits[month_key].append({
                'hash': hash_id,
                'email': email,
                'date': date,
                'subject': subject
            })
        except ValueError as e:
            print(f"Error parsing log entry: {e}")
            continue
    
    return monthly_commits

def get_github_username(email):
    # Extract username from GitHub noreply email
    if 'users.noreply.github.com' in email:
        return email.split('@')[0]
    return None

def extract_social_links(bio):
    """Extract social media links from GitHub bio"""
    social_links = {}
    
    # Common patterns for social links
    patterns = {
        'linkedin': r'linkedin\.com/in/([a-zA-Z0-9-]+)',
        'twitter': r'twitter\.com/([a-zA-Z0-9_]+)',
        'x': r'x\.com/([a-zA-Z0-9_]+)',
        'website': r'https?://(?:www\.)?([a-zA-Z0-9.-]+\.[a-zA-Z]{2,}(?:/\S*)?)',
        'medium': r'medium\.com/@?([a-zA-Z0-9_.-]+)',
    }
    
    if bio:
        for platform, pattern in patterns.items():
            match = re.search(pattern, bio, re.IGNORECASE)
            if match:
                if platform == 'website':
                    social_links[platform] = f"https://{match.group(1)}"
                else:
                    social_links[platform] = match.group(1)
    
    return social_links

def get_github_profile(username):
    if not username:
        return None
        
    url = f"https://api.github.com/users/{username}"
    headers = {
        'Accept': 'application/vnd.github.v3+json'
    }
    github_token = os.getenv('GITHUB_TOKEN')
    if github_token:
        # Debug token format (without exposing the actual token)
        print(f"Token format check: starts with 'ghp_': {github_token.startswith('ghp_')}")
        print(f"Token length: {len(github_token)}")
        
        # Always use 'token' format for GitHub API
        headers['Authorization'] = f"token {github_token}"
        
        # Debug output
        print(f"\nMaking request for {username}:")
        print(f"URL: {url}")
        print("Headers:", {k: '***' if k == 'Authorization' else v for k, v in headers.items()})
        
    try:
        response = requests.get(url, headers=headers)
        if response.status_code == 200:
            profile = response.json()
            
            # Extract additional social links from bio
            social_links = extract_social_links(profile.get('bio', ''))
            
            # Add social links to profile
            profile['social_links'] = social_links
            
            return profile
        else:
            print(f"Error fetching profile for {username}: {response.status_code}")
            if response.status_code == 401:
                print("Response headers:", dict(response.headers))
                print("Response body:", response.text)
            return None
    except requests.RequestException as e:
        print(f"Request error: {e}")
        return None

def get_github_username_from_email(email):
    # First check our manual mapping
    if email in EMAIL_TO_GITHUB:
        return EMAIL_TO_GITHUB[email]
    
    # Then check if it's a GitHub noreply address
    if 'users.noreply.github.com' in email:
        return email.split('@')[0]
    
    return None

def generate_author_entry(email, profile, commits):
    """Generate an author entry in the Docusaurus authors.yml format"""
    username = get_github_username_from_email(email)
    if not username or not profile:
        return None
        
    # Extract relevant information from profile
    name = profile.get('name', username)
    bio = profile.get('bio', '')
    
    # Generate description based on commits
    lab_contributions = []
    for commit in commits:
        if any(keyword in commit['subject'].lower() for keyword in ['lab', 'tutorial', 'notebook']):
            lab_contributions.append(commit['subject'])
    
    # Create a more specific description based on actual contributions
    description = bio + "\n\n" if bio else ""
    description += "Key Contributions to Austin LangChain AIMUG:\n\n"

    # Analyze contributions to create specific categories
    contributions = {
        'langchain': [],
        'rag': [],
        'langgraph': [],
        'ollama': [],
        'streamlit': [],
        'colab': [],
        'infrastructure': []
    }

    for contrib in set(lab_contributions):
        subject = contrib.lower()
        if 'rag' in subject:
            contributions['rag'].append(contrib)
        elif 'langgraph' in subject:
            contributions['langgraph'].append(contrib)
        elif 'ollama' in subject:
            contributions['ollama'].append(contrib)
        elif 'streamlit' in subject:
            contributions['streamlit'].append(contrib)
        elif 'colab' in subject:
            contributions['colab'].append(contrib)
        elif any(word in subject for word in ['lab', 'notebook', 'tutorial']):
            contributions['langchain'].append(contrib)
        else:
            contributions['infrastructure'].append(contrib)

    # Create personalized descriptions based on actual contributions
    contributor_specialties = {
        'colinmcnamara': {
            'intro': "Core maintainer and founder of Austin LangChain AIMUG. Established the project's foundation and learning path structure from LangChain 101 through advanced implementations.",
            'highlights': [
                "Created the initial LangServe and Streamlit integration labs",
                "Developed the LangGraph introduction and customer support tutorials",
                "Implemented Neo4j graph database integration examples",
                "Pioneered the Google Colab integration strategy for accessible learning"
            ]
        },
        'RPirruccio': {
            'intro': "Enterprise architecture specialist focusing on production-ready implementations and Docker containerization.",
            'highlights': [
                "Developed the LangGraph Manufacturing BOM Analyzer",
                "Created the RAG implementation with Google Drive integration",
                "Built the AI Data Scientist report writer using LangGraph",
                "Authored comprehensive Docker deployment tutorials"
            ]
        },
        'lalanikarim': {
            'intro': "Local LLM and voice integration expert, specializing in Ollama implementations and WebRTC technologies.",
            'highlights': [
                "Created the WebRTC AI voice chat implementation",
                "Developed Ollama and Bakllava integration tutorials",
                "Built the Mistral chatbot implementation",
                "Pioneered local LLM deployment strategies"
            ]
        },
        'saskinosie': {
            'intro': "Data science specialist focusing on practical AI applications in data analysis and automation.",
            'highlights': [
                "Created the Pandas DataFrame Agent tutorial series",
                "Developed AI-powered data scientist implementations",
                "Built practical examples for business analytics",
                "Authored comprehensive data processing guides"
            ]
        },
        'saurabhlalsaxena': {
            'intro': "Advanced RAG architect specializing in sophisticated search and retrieval implementations.",
            'highlights': [
                "Created the Perplexity Clone implementation",
                "Developed advanced RAG architectures",
                "Built complex document processing systems",
                "Implemented efficient search strategies"
            ]
        }
    }

    if username in contributor_specialties:
        specialty = contributor_specialties[username]
        description += specialty['intro'] + "\n\n"
        description += "Notable Contributions:\n"
        for highlight in specialty['highlights']:
            description += f"• {highlight}\n"
        description += "\n"

    # Add specific contribution areas
    if contributions['langchain']:
        description += "LangChain Development:\n"
        description += "• Created foundational tutorials and labs for LangChain implementation\n"
        description += "• Developed practical examples for real-world applications\n\n"

    if contributions['rag']:
        description += "RAG Implementations:\n"
        description += "• Built advanced retrieval-augmented generation systems\n"
        description += "• Integrated RAG with various data sources and storage solutions\n\n"

    if contributions['langgraph']:
        description += "LangGraph Projects:\n"
        description += "• Developed complex LangGraph applications\n"
        description += "• Created tutorials for graph-based AI implementations\n\n"

    if contributions['ollama']:
        description += "Ollama Integration:\n"
        description += "• Implemented local LLM solutions using Ollama\n"
        description += "• Created guides for efficient model deployment\n\n"

    if contributions['streamlit']:
        description += "Streamlit Applications:\n"
        description += "• Built interactive web interfaces for AI applications\n"
        description += "• Created user-friendly demonstration platforms\n\n"

    if contributions['colab']:
        description += "Google Colab Integration:\n"
        description += "• Enhanced accessibility through Colab integration\n"
        description += "• Maintained cross-platform compatibility\n\n"
    
    # Create author entry
    author_entry = {
        username: {
            'name': name,
            'title': f"Contributor - Austin LangChain AIMUG",
            'url': profile.get('html_url', f'https://github.com/{username}'),
            'image_url': f'https://github.com/{username}.png',
            'page': True,
            'description': description.strip(),
            'socials': {
                'github': username
            }
        }
    }
    
    # Add social links
    if profile.get('twitter_username'):
        author_entry[username]['socials']['x'] = profile['twitter_username']
    if profile.get('blog'):
        author_entry[username]['socials']['website'] = profile['blog']
    
    # Add social links extracted from bio
    if profile.get('social_links'):
        for platform, value in profile['social_links'].items():
            if platform not in author_entry[username]['socials']:
                author_entry[username]['socials'][platform] = value
    
    return author_entry

def update_authors_file(new_authors):
    """Update the authors.yml file with new contributors"""
    authors_file = Path('/Users/colinmcnamara/Code/alc-docs/main-docs/blog/authors.yml')
    
    # Read existing authors
    if authors_file.exists():
        with open(authors_file) as f:
            existing_authors = yaml.safe_load(f) or {}
    else:
        existing_authors = {}
    
    # Merge new authors with existing ones
    updated_authors = {**existing_authors, **new_authors}
    
    # Write back to file
    with open(authors_file, 'w') as f:
        yaml.dump(updated_authors, f, sort_keys=False, allow_unicode=True)

def analyze_labs_by_month(monthly_commits):
    print("\nLabs Analysis by Month:")
    print("=" * 80)
    
    lab_related_commits = defaultdict(list)
    
    # Keywords that indicate lab-related commits
    lab_keywords = ['lab', 'tutorial', 'notebook', 'workshop']
    
    for month, commits in monthly_commits.items():
        for commit in commits:
            subject = commit['subject'].lower()
            if any(keyword in subject for keyword in lab_keywords):
                lab_related_commits[month].append(commit)
    
    # Print analysis
    for month in sorted(lab_related_commits.keys()):
        commits = lab_related_commits[month]
        if commits:
            print(f"\n{month}:")
            print("-" * 40)
            
            # Group by contributor
            contributors = defaultdict(list)
            for commit in commits:
                contributors[commit['email']].append(commit)
            
            for email, commits in contributors.items():
                print(f"\nContributor: {email}")
                print(f"Number of lab-related commits: {len(commits)}")
                print("Lab Contributions:")
                for commit in commits:
                    print(f"  {commit['date']} - {commit['subject']} ({commit['hash']})")

def main():
    print("Analyzing Git Repository and Generating Author Profiles...")
    
    # Get git log entries
    log_entries = get_git_log()
    if not log_entries:
        print("No git log entries found")
        return
        
    # Parse log entries by month
    monthly_commits = parse_git_log(log_entries)
    
    # Analyze labs by month
    analyze_labs_by_month(monthly_commits)
    
    # Track unique contributors
    unique_contributors = set()
    for commits in monthly_commits.values():
        for commit in commits:
            unique_contributors.add(commit['email'])
    
    # Track all commits by email
    all_commits_by_email = defaultdict(list)
    
    # Analyze GitHub profiles and generate author entries
    print("\nGenerating Author Profiles:")
    print("=" * 80)
    
    new_authors = {}
    
    for email in unique_contributors:
        username = get_github_username_from_email(email)
        if username:
            profile = get_github_profile(username)
            if profile:
                print(f"\nGenerating profile for {username}...")
                
                # Get all commits for this email
                commits = []
                for month_commits in monthly_commits.values():
                    for commit in month_commits:
                        if commit['email'] == email:
                            commits.append(commit)
                
                author_entry = generate_author_entry(email, profile, commits)
                if author_entry:
                    new_authors.update(author_entry)
    
    # Update authors.yml file
    if new_authors:
        print("\nUpdating authors.yml file...")
        update_authors_file(new_authors)
        print("Authors file updated successfully!")

if __name__ == "__main__":
    main()
