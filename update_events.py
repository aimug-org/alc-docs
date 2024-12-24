import json
from datetime import datetime
import yaml

def load_events():
    """Load event information from both event files"""
    # Load detailed events
    with open('meetup_events_detailed.txt', 'r') as file:
        detailed_events = json.load(file)
    
    # Load event names and dates
    with open('meetup_events.txt', 'r') as file:
        events_list = file.read().splitlines()
        # Split into names and dates
        event_names = events_list[:len(events_list)//2]
        event_dates = events_list[len(events_list)//2:]
    
    # Combine the information
    events = []
    for name, date, detailed in zip(event_names, event_dates, detailed_events):
        events.append({
            'name': name,
            'date': date.strip('"'),  # Remove quotes from date
            'description': detailed.get('description', '')
        })
    
    return sorted(events, key=lambda x: x['date'], reverse=True)

def format_event(event):
    """Format a single event for the markdown file"""
    date_obj = datetime.strptime(event['date'], '%Y-%m-%d')
    formatted_date = date_obj.strftime('%B %d, %Y')
    
    # Clean up description - convert HTML to Markdown
    description = event['description']
    # Convert HTML links to Markdown
    description = description.replace('<a href="', '[').replace('" class="linkified">', '](').replace('</a>', ')')
    description = description.replace('<p>', '').replace('</p>', '\n\n')
    description = description.replace('<br/>', '\n')
    # Convert HTML entities
    description = description.replace('&amp;', '&')
    description = description.strip()
    
    return f"""### {event['name'].strip('"')}
- **Date**: {formatted_date}
- **Description**: {description}
"""

def generate_events_page():
    """Generate the complete events.md page"""
    events = load_events()
    
    # Split events into upcoming and past
    today = datetime.now()
    upcoming_events = []
    past_events = []
    
    for event in events:
        event_date = datetime.strptime(event['date'], '%Y-%m-%d')
        if event_date >= today:
            upcoming_events.append(event)
        else:
            past_events.append(event)
    
    # Generate the markdown content
    content = """# Events

Welcome to the Austin LangChain Events page!

*Last updated: {}*

## Upcoming Events

""".format(datetime.now().strftime('%B %d, %Y'))

    # Add upcoming events
    if upcoming_events:
        for event in upcoming_events:
            content += format_event(event)
    else:
        content += "*No upcoming events scheduled. Check back soon!*\n\n"

    # Add past events
    content += "## Past Events\n\n"
    for event in past_events[:5]:  # Show only the 5 most recent past events
        content += format_event(event)
    
    content += """For a complete list of our past events, please visit our [Meetup page](https://www.meetup.com/austin-langchain-ai-group/events/past/).

## Regular Events

We host several regular events to keep our community engaged and connected:

### Monthly Mixer and Showcase (First Wednesday of Each Month)

#### 2025 Schedule:
- January 8, 2025 (Wednesday)
- February 5, 2025 (Wednesday)
- March 5, 2025 (Wednesday) - Branded as "Off SXSW"
- April 2, 2025 (Wednesday)
- May 7, 2025 (Wednesday)
- June 4, 2025 (Wednesday)
- July 2, 2025 (Wednesday)
- August 6, 2025 (Wednesday)
- September 3, 2025 (Wednesday)
- October 1, 2025 (Wednesday)
- November 5, 2025 (Wednesday)
- December 3, 2025 (Wednesday)

**Time**: Starts at 6:00 PM
**Location**: ACC - RGC 3000, 1218 West Avenue, Austin, TX
**After Party**: The Tavern, 922 W 12th Street, Austin, TX 78703 (next to the parking garage)

**Detailed Schedule for Monthly Mixer and Showcase:**
- 6:00 - 6:20 PM: Welcome Reception
- 6:20 - 6:40 PM: News and Updates
- 6:40 - 8:00 PM: Showcases and Panels with Q&A
  - 6:40 - 7:05 PM: First Showcase/Panel (20 minutes) + Q&A (10 minutes)
  - 7:05 - 7:30 PM: Second Showcase/Panel (20 minutes) + Q&A (10 minutes)
  - 7:30 - 7:55 PM: Third Showcase/Panel (20 minutes) + Q&A (10 minutes)
- 7:55 - 8:00 PM: Wrap-Up and Transition
- 8:00 - 8:30 PM: Head over to The Tavern for the after-party mixer

This event combines networking, learning, and showcasing. It's our primary monthly event where we come together to learn, share, and collaborate.

**Directions for ACC - RGC 3000**: It's the tan brick building on your left if you are going north on West Avenue between 12th and 13th streets. Go up the stairs to reach ACC RGC3000.

**Parking**: The parking garage is free, but please note that the metal doors shut and lock at 9 PM. If you plan to stay later for conversations after the event, we recommend parking your car for free on the street. Street parking is free after 6 PM.

### Mid-Month Happy Hour ("Hacky Hour") (Third Wednesday of Each Month)

#### 2025 Schedule:
- January 22, 2025 (Wednesday)
- February 19, 2025 (Wednesday)
- March 19, 2025 (Wednesday) - Branded as "Off SXSW"
- April 16, 2025 (Wednesday)
- May 21, 2025 (Wednesday)
- June 18, 2025 (Wednesday)
- July 16, 2025 (Wednesday)
- August 20, 2025 (Wednesday)
- September 17, 2025 (Wednesday)
- October 15, 2025 (Wednesday)
- November 19, 2025 (Wednesday)
- December 17, 2025 (Wednesday)

These social gatherings are a great way to network and connect with other community members in a relaxed setting. Check our [Meetup page](https://www.meetup.com/austin-langchain-ai-group/) for specific times and locations.

### Weekly Office Hours
- **When**: Every Tuesday at 2 PM Central
- **Where**: [Discord Meeting Room](https://discord.com/channels/1149779360178524272/1149779360967045170)

This is a great opportunity to ask questions, get help with your projects, or just chat with other community members.

### Weekly Community Calls
- **When**: Every Thursday at 2 PM Central
- **Where**: [https://meet.google.com/fsm-nawg-cng](https://meet.google.com/fsm-nawg-cng)

During these calls, we plan our events and then break into an open forum. Everyone is welcome to join and contribute ideas!

For more information on our regular events and other upcoming activities, please check our [Meetup page](https://www.meetup.com/austin-langchain-ai-group/events/).

If you have any questions or would like to propose an event, please reach out to us through our community channels:

- Website: [https://aimug.org](https://aimug.org)
- GitHub: [https://github.com/aimug-org/austin_langchain](https://github.com/aimug-org/austin_langchain)
- Twitter: [https://twitter.com/AustinLangChain](https://twitter.com/AustinLangChain)
- Discord: [https://discord.gg/JzWgadPFQd](https://discord.gg/JzWgadPFQd)
- YouTube: [https://www.youtube.com/channel/UC03IXA4KU6hOQ_3YPTbS0ig](https://www.youtube.com/channel/UC03IXA4KU6hOQ_3YPTbS0ig)"""

    # Write the content to the events.md file
    with open('main-docs/src/pages/events.md', 'w') as file:
        file.write(content)

if __name__ == "__main__":
    generate_events_page()
