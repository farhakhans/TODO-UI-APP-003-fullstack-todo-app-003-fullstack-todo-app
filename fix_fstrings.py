#!/usr/bin/env python3
"""
Script to fix problematic f-strings in ai_agent.py
"""

def fix_f_strings():
    file_path = r'D:\DocuBook-Chatbot folder\TODO-UI-APP-003-fullstack-todo-app-003-fullstack-todo-app\backend\src\api\ai_agent.py'

    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()

    # Replace the problematic f-strings with string concatenation
    content = content.replace(
        'rec["recommendation"] = f\'High priority task "{task["title"]}" detected. Consider moving this up in your queue.\'',
        'rec["recommendation"] = \'High priority task "\' + task["title"] + \'" detected. Consider moving this up in your queue.\''
    )
    content = content.replace(
        'rec["recommendation"] = f\'Consider scheduling "{task["title"]}" for later today or tomorrow.\'',
        'rec["recommendation"] = \'Consider scheduling "\' + task["title"] + \'" for later today or tomorrow.\''
    )
    content = content.replace(
        'rec["recommendation"] = f\'"{task["title"]}" is a low priority task. You can defer this if needed.\'',
        'rec["recommendation"] = \'"\' + task["title"] + \'" is a low priority task. You can defer this if needed.\''
    )

    # Write the fixed content back to the file
    with open(file_path, 'w', encoding='utf-8') as f:
        f.write(content)

    print("Fixed problematic f-strings in ai_agent.py")

if __name__ == "__main__":
    fix_f_strings()