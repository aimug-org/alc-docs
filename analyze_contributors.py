import subprocess
import json
import requests
import os
import yaml
from collections import defaultdict
from datetime import datetime
from pathlib import Path

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

def get_github_profile(username):
    if not username:
        return None
        
    url = f"https://api.github.com/users/{username}"
    headers = {}
    if 'GITHUB_TOKEN' in os.environ:
        headers['Authorization'] = f"token {os.environ['GITHUB_TOKEN']}"
        
    try:
        response = requests.get(url, headers=headers)
        if response.status_code == 200:
            return response.json()
        else:
            print(f"Error fetching profile for {username}: {response.status_code}")
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
    
    description = bio + "\n\n" if bio else ""
    description += "Contributions to Austin LangChain AIMUG:\n"
    for contrib in set(lab_contributions):  # Use set to remove duplicates
        description += f"- {contrib}\n"
    
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
    
    # Add additional social links if available
    if profile.get('twitter_username'):
        author_entry[username]['socials']['x'] = profile['twitter_username']
    if profile.get('blog'):
        author_entry[username]['socials']['website'] = profile['blog']
    
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
