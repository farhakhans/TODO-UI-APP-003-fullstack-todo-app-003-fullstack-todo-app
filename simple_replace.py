# Simple replacement script
file_path = r'D:\DocuBook-Chatbot folder\TODO-UI-APP-003-fullstack-todo-app-003-fullstack-todo-app\backend\src\api\ai_agent.py'

with open(file_path, 'r', encoding='utf-8') as f:
    content = f.read()

# The exact text to replace (with proper indentation)
old_text = '            rec["recommendation"] = f\'High priority task "{task["title"]}" detected. Consider moving this up in your queue.\''

# The replacement text
new_text = '            rec["recommendation"] = \'High priority task "\' + task["title"] + \'" detected. Consider moving this up in your queue.\''

# Perform the replacement
content = content.replace(old_text, new_text)

# Write the file back
with open(file_path, 'w', encoding='utf-8') as f:
    f.write(content)

print("Replacement completed!")