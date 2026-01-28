#!/usr/bin/env python3
"""
Targeted fix for the specific problematic line in ai_agent.py
"""

def fix_specific_line():
    file_path = r'D:\DocuBook-Chatbot folder\TODO-UI-APP-003-fullstack-todo-app-003-fullstack-todo-app\backend\src\api\ai_agent.py'
    
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Target the exact problematic line with proper indentation
    old_line = '            rec["recommendation"] = f\'High priority task "{task["title"]}" detected. Consider moving this up in your queue.\''
    new_line = '            rec["recommendation"] = \'High priority task "\' + task["title"] + \'" detected. Consider moving this up in your queue.\''
    
    if old_line in content:
        print("Found the target line, replacing...")
        content = content.replace(old_line, new_line)
        print("Replacement done.")
    else:
        print("Target line not found. Let me check the exact content:")
        # Find lines containing the problematic pattern
        lines = content.split('\n')
        for i, line in enumerate(lines):
            if 'f\'High priority task "{task["title"]}" detected' in line:
                print(f"Found at line {i+1}: {repr(line)}")
    
    # Write the content back
    with open(file_path, 'w', encoding='utf-8') as f:
        f.write(content)
    
    print("Finished processing ai_agent.py")

if __name__ == "__main__":
    fix_specific_line()