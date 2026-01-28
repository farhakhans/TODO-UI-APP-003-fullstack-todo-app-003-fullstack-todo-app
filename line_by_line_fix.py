#!/usr/bin/env python3
"""
Line-by-line replacement script to fix problematic f-strings in ai_agent.py
"""

def fix_f_strings():
    file_path = r'D:\DocuBook-Chatbot folder\TODO-UI-APP-003-fullstack-todo-app-003-fullstack-todo-app\backend\src\api\ai_agent.py'
    
    with open(file_path, 'r', encoding='utf-8') as f:
        lines = f.readlines()
    
    # Define the exact strings to replace
    target_line_1 = '            rec["recommendation"] = f\'High priority task "{task["title"]}" detected. Consider moving this up in your queue.\'\n'
    replacement_line_1 = '            rec["recommendation"] = \'High priority task "\' + task["title"] + \'" detected. Consider moving this up in your queue.\'\n'
    
    target_line_2 = '            rec["recommendation"] = f\'Consider scheduling "{task["title"]}" for later today or tomorrow.\'\n'
    replacement_line_2 = '            rec["recommendation"] = \'Consider scheduling "\' + task["title"] + \'" for later today or tomorrow.\'\n'
    
    target_line_3 = '            rec["recommendation"] = f\'"{task["title"]}" is a low priority task. You can defer this if needed.\'\n'
    replacement_line_3 = '            rec["recommendation"] = \'"\' + task["title"] + \'" is a low priority task. You can defer this if needed.\'\n'
    
    # Replace the lines
    new_lines = []
    for line in lines:
        if line == target_line_1:
            new_lines.append(replacement_line_1)
        elif line == target_line_2:
            new_lines.append(replacement_line_2)
        elif line == target_line_3:
            new_lines.append(replacement_line_3)
        else:
            new_lines.append(line)
    
    # Write the fixed content back to the file
    with open(file_path, 'w', encoding='utf-8') as f:
        f.writelines(new_lines)
    
    print("Fixed problematic f-strings in ai_agent.py")

if __name__ == "__main__":
    fix_f_strings()