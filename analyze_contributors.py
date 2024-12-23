import subprocess
import json
import requests
import os
from collections import defaultdict
from datetime import datetime

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
    try:
        response = requests.get(url)
        if response.status_code == 200:
            return response.json()
        else:
            print(f"Error fetching profile for {username}: {response.status_code}")
            return None
    except requests.RequestException as e:
        print(f"Request error: {e}")
        return None

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
    print("Analyzing Git Repository...")
    
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
    
    # Analyze GitHub profiles
    print("\nGitHub Profile Analysis:")
    print("=" * 80)
    
    for email in unique_contributors:
        username = get_github_username(email)
        if username:
            profile = get_github_profile(username)
            if profile:
                print(f"\nProfile for {username}:")
                print(f"Name: {profile.get('name', 'N/A')}")
                print(f"Bio: {profile.get('bio', 'N/A')}")
                print(f"Location: {profile.get('location', 'N/A')}")
                print(f"Public repos: {profile.get('public_repos', 'N/A')}")
                print(f"Followers: {profile.get('followers', 'N/A')}")
                print(f"Following: {profile.get('following', 'N/A')}")

if __name__ == "__main__":
    main()
