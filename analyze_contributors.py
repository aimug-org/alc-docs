import yaml
import json
from datetime import datetime
import re
import os
from pathlib import Path

def load_authors():
    """Load author information from authors.yml"""
    with open('main-docs/blog/authors.yml', 'r') as file:
        return yaml.safe_load(file)

def load_events():
    """Load event information from meetup_events_detailed.txt"""
    with open('meetup_events_detailed.txt', 'r') as file:
        return json.load(file)

def extract_lab_info(event):
    """Extract lab information from event description"""
    description = event.get('description', '')
    lab_info = []
    
    # Clean up HTML tags and extract key lab information
    clean_description = re.sub(r'<[^>]+>', '', description)
    
    # Extract What to Expect section
    what_to_expect = re.search(r'What to Expect(.*?)(?=###|$)', clean_description, re.DOTALL)
    if what_to_expect:
        content = what_to_expect.group(1).strip()
        lab_info.append("### What to Expect")
        # Split content into paragraphs
        paragraphs = content.split('To actively participate')
        if len(paragraphs) > 0:
            lab_info.append(paragraphs[0].strip())
        
        # Extract requirements
        if len(paragraphs) > 1:
            lab_info.append("\n### Requirements")
            requirements = re.findall(r'\* ([^*\n]+)', paragraphs[1])
            for req in requirements:
                if "perfectly fine" in req:
                    # Split this into two separate points
                    lab_info.append(f"- If you prefer to attend the lecture and soak in the concepts without participating in the lab, that's perfectly fine too!")
                    lab_info.append("- This event is part of our multi-part lecture and lab series designed to equip you with the skills to set up your own AI microservices centered around LangChain.")
                else:
                    lab_info.append(f"- {req.strip()}")
    
    return lab_info

def find_markdown_files():
    """Find all markdown files in the docs directory and sort by date"""
    docs_dir = Path('main-docs/docs')
    markdown_files = []
    
    for path in docs_dir.rglob('*.md'):
        # Skip index files
        if path.name == 'index.md':
            continue
            
        # Extract date from path (assuming format: docs/MMM-YYYY/file.md)
        try:
            date_str = None
            parts = path.parts
            for part in parts:
                if re.match(r'\d{3,4}-\d{4}', part):  # Matches MMM-YYYY or MMMM-YYYY
                    date_str = part
                    break
            
            if date_str:
                # Convert month name to number
                month_str, year_str = date_str.split('-')
                month = int(month_str)
                year = int(year_str)
                date = datetime(year, month, 1)
                
                markdown_files.append((date, path))
        except (ValueError, IndexError):
            print(f"Warning: Could not extract date from {path}")
            continue
    
    # Sort by date
    markdown_files.sort(key=lambda x: x[0])
    return markdown_files

def match_event_to_file(file_path, events):
    """Match a markdown file to its corresponding event"""
    # Extract the month and year from the file path
    path_str = str(file_path)
    date_match = re.search(r'/(\d{3,4})-(\d{4})/', path_str)
    if not date_match:
        return None
        
    month = int(date_match.group(1))
    year = int(date_match.group(2))
    
    # Get the file name without extension
    file_name = file_path.stem.lower()
    
    # Look for matching events
    matching_events = []
    for event in events:
        event_date = datetime.strptime(event['date'], '%Y-%m-%d')
        if event_date.year == year and event_date.month == month:
            # Check if event title or description contains keywords from file name
            keywords = file_name.replace('-', ' ').split()
            event_text = (event.get('name', '') + ' ' + event.get('description', '')).lower()
            if any(keyword in event_text for keyword in keywords):
                matching_events.append(event)
    
    # Return the most relevant event (for now, just the first match)
    return matching_events[0] if matching_events else None

def match_author_to_event(event, authors):
    """Match event presenter to author information"""
    description = event.get('description', '').lower()
    name = event.get('name', '').lower()
    
    # Look for presenter patterns in description
    presenter_patterns = [
        r'presented by[:\s]+([^\n]+)',
        r'presenter[:\s]+([^\n]+)',
        r'with ([^,\n]+)',
        r'join ([^,\n]+) for',
        r'by ([^,\n]+)'
    ]
    
    # Try to find presenter name in description
    for pattern in presenter_patterns:
        matches = re.finditer(pattern, description, re.IGNORECASE)
        for match in matches:
            presenter_text = match.group(1).lower()
            # Check each author
            for author_id, author_info in authors.items():
                author_name = author_info['name'].lower()
                if author_name in presenter_text:
                    return author_id, author_info
    
    # If no match found in description patterns, check if any author name appears in description or title
    for author_id, author_info in authors.items():
        author_name = author_info['name'].lower()
        if author_name in description or author_name in name:
            return author_id, author_info
    
    # Default to Colin McNamara for older content
    for author_id, author_info in authors.items():
        if author_info['name'].lower() == 'colin mcnamara':
            return author_id, author_info
    
    return None

def update_markdown_with_presenter(markdown_path, author_info, lab_info):
    """Update markdown file with presenter information and lab details"""
    with open(markdown_path, 'r') as file:
        content = file.read()
    
    # Extract the technical content (everything after first section)
    tech_content = ""
    first_section = content.split('##')[1] if '##' in content else ""
    if first_section:
        tech_content = '##'.join(content.split('##')[2:])
    
    # Create presenter section
    presenter_section = f"""## Presenter
**{author_info['name']}** is {author_info['description'].split('\n\n')[0]}

> "Our focus is really low-stress learning and sharing. We're not trying to be experts. We're all learning. This is a fast-moving project. We are here to connect with other early adopters of AI middleware, and specifically, focused around the LangChain project."

Connect with {author_info['name'].split()[0]}:"""
    
    # Add social links
    if 'socials' in author_info:
        for platform, handle in author_info['socials'].items():
            if platform == 'github':
                presenter_section += f"\n- GitHub: [@{handle}](https://github.com/{handle})"
            elif platform == 'linkedin':
                presenter_section += f"\n- LinkedIn: [{handle}](https://www.linkedin.com/in/{handle})"
            elif platform == 'x':
                presenter_section += f"\n- Twitter: [@{handle}](https://twitter.com/{handle})"
            elif platform == 'website':
                presenter_section += f"\n- Website: [{handle}]({handle})"
    
    # Add workshop details if available
    workshop_section = ""
    if lab_info:
        workshop_section = "\n\n## Workshop Details"
        current_section = None
        for info in lab_info:
            if info.startswith('###'):
                workshop_section += f"\n\n{info}"
            elif info.startswith('-'):
                workshop_section += f"\n{info}"
            else:
                workshop_section += f"\n{info}"
    
    # Get the title
    title = content.split('\n', 1)[0] if content else "# Untitled"
    
    # Combine everything
    updated_content = f"""{title}

{presenter_section}
{workshop_section}

{tech_content}"""
    
    # Clean up any multiple blank lines
    updated_content = re.sub(r'\n{3,}', '\n\n', updated_content)
    
    with open(markdown_path, 'w') as file:
        file.write(updated_content)

def main():
    # Load data
    authors = load_authors()
    events = load_events()
    
    # Find all markdown files sorted by date
    markdown_files = find_markdown_files()
    
    print(f"Found {len(markdown_files)} markdown files to process")
    
    # Process each file
    for date, file_path in markdown_files:
        print(f"\nProcessing {file_path} from {date.strftime('%B %Y')}")
        
        # Match file to event
        event = match_event_to_file(file_path, events)
        if event:
            print(f"Found matching event: {event['name']}")
            
            # Extract lab information
            lab_info = extract_lab_info(event)
            
            # Match author
            author_match = match_author_to_event(event, authors)
            if author_match:
                author_id, author_info = author_match
                # Update markdown file
                update_markdown_with_presenter(file_path, author_info, lab_info)
                print(f"Updated {file_path} with presenter information for {author_info['name']}")
                
                if lab_info:
                    print("\nIncluded workshop details:")
                    for info in lab_info:
                        print(info)
            else:
                print(f"Could not find matching author for event: {event['name']}")
        else:
            print(f"Could not find matching event for {file_path}")

if __name__ == "__main__":
    main()
