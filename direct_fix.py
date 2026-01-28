#!/usr/bin/env python3
"""
Direct replacement script for the problematic line in ai_agent.py
"""

def fix_line():
    file_path = r'D:\DocuBook-Chatbot folder\TODO-UI-APP-003-fullstack-todo-app-003-fullstack-todo-app\backend\src\api\ai_agent.py'
    
    # Read the file as a single string
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Print the exact representation of the problematic line
    print("Current content around the problematic area:")
    start_idx = content.find('f\'High priority task "{task["title"]}" detected. Consider moving this up in your queue.')
    if start_idx != -1:
        # Extract a portion around the found text
        start_context = max(0, start_idx - 50)
        end_context = min(len(content), start_idx + 100)
        print(repr(content[start_context:end_context]))
    
    # Replace the exact string as found by findstr
    # From the findstr output: "            rec[\"recommendation\"] = f'High priority task \"{task[\"title\"]}\" detected. Consider moving this up in your queue.'"
    old_string = '            rec["recommendation"] = f\'High priority task "{task["title"]}" detected. Consider moving this up in your queue.\''
    new_string = '            rec["recommendation"] = \'High priority task "\' + task["title"] + \'" detected. Consider moving this up in your queue.\''
    
    print(f"Attempting to replace: {repr(old_string)}")
    print(f"With: {repr(new_string)}")
    
    if old_string in content:
        print("Match found! Replacing...")
        content = content.replace(old_string, new_string)
        print("Replacement successful!")
    else:
        print("No exact match found. Let me try to find similar patterns...")
        # Look for lines that contain the pattern
        lines = content.split('\n')
        for i, line in enumerate(lines):
            if 'f\'High priority task' in line and 'detected. Consider moving this up in your queue' in line:
                print(f"Found similar pattern at line {i+1}: {repr(line)}")
                # Replace this specific line
                lines[i] = line.replace(
                    'f\'High priority task "{task["title"]}" detected. Consider moving this up in your queue.\'',
                    '\'High priority task "\' + task["title"] + \'" detected. Consider moving this up in your queue.\''
                )
                content = '\n'.join(lines)
                print("Fixed the line!")
                break
    
    # Write the content back
    with open(file_path, 'w', encoding='utf-8') as f:
        f.write(content)
    
    print("Done!")

if __name__ == "__main__":
    fix_line()