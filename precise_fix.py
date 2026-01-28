#!/usr/bin/env python3
"""
Precise script to fix problematic f-strings in ai_agent.py
"""

def fix_f_strings():
    file_path = r'D:\DocuBook-Chatbot folder\TODO-UI-APP-003-fullstack-todo-app-003-fullstack-todo-app\backend\src\api\ai_agent.py'
    
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Replace using the exact text from the file
    old_text = '            rec["recommendation"] = f\'High priority task "{task["title"]}" detected. Consider moving this up in your queue.\''
    new_text = '            rec["recommendation"] = \'High priority task "\' + task["title"] + \'" detected. Consider moving this up in your queue.\''
    
    content = content.replace(old_text, new_text)
    
    # Also fix the other problematic lines
    old_text2 = '            rec["recommendation"] = f\'Consider scheduling "{task["title"]}" for later today or tomorrow.\''
    new_text2 = '            rec["recommendation"] = \'Consider scheduling "\' + task["title"] + \'" for later today or tomorrow.\''
    
    content = content.replace(old_text2, new_text2)
    
    old_text3 = '            rec["recommendation"] = f\'"{task["title"]}" is a low priority task. You can defer this if needed.\''
    new_text3 = '            rec["recommendation"] = \'"\' + task["title"] + \'" is a low priority task. You can defer this if needed.\''
    
    content = content.replace(old_text3, new_text3)
    
    # Write the fixed content back to the file
    with open(file_path, 'w', encoding='utf-8') as f:
        f.write(content)
    
    print("Fixed problematic f-strings in ai_agent.py")

if __name__ == "__main__":
    fix_f_strings()