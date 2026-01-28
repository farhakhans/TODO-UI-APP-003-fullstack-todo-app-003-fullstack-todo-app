import codecs

# Open the file with explicit encoding and mode
file_path = r'D:\DocuBook-Chatbot folder\TODO-UI-APP-003-fullstack-todo-app-003-fullstack-todo-app\backend\src\api\ai_agent.py'

# Read the entire file
with codecs.open(file_path, 'r', encoding='utf-8') as f:
    content = f.read()

# Replace the problematic line - need to include the indentation
old_line = '            rec["recommendation"] = f\'High priority task "{task["title"]}" detected. Consider moving this up in your queue.\''
new_line = '            rec["recommendation"] = \'High priority task "\' + task["title"] + \'" detected. Consider moving this up in your queue.\''

if old_line in content:
    content = content.replace(old_line, new_line)
    print("Found and replaced the problematic line")
else:
    print("Could not find the exact line to replace")
    # Let's try to find the exact line content
    lines = content.split('\n')
    for i, line in enumerate(lines):
        if 'f\'High priority task "{task["title"]}" detected. Consider moving this up in your queue' in line:
            print(f"Found at line {i+1}: {repr(line)}")
            # Replace this specific line
            lines[i] = '            rec["recommendation"] = \'High priority task "\' + task["title"] + \'" detected. Consider moving this up in your queue.\''
            content = '\n'.join(lines)
            print("Fixed the line!")
            break

# Write the file back
with codecs.open(file_path, 'w', encoding='utf-8') as f:
    f.write(content)

print("File updated")