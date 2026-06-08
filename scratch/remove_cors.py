import os
import re

directory = r'c:\Users\ayush\FYC\backend\src\main\java\com\example\admin'

for root, dirs, files in os.walk(directory):
    for file in files:
        if file.endswith('.java'):
            filepath = os.path.join(root, file)
            with open(filepath, 'r', encoding='utf-8') as f:
                content = f.read()
            
            # Check if there's CrossOrigin
            if 'CrossOrigin' in content:
                # Remove the import
                content = re.sub(r'import org\.springframework\.web\.bind\.annotation\.CrossOrigin;\n?', '', content)
                # Remove the annotation (handling attributes and multiline if present)
                content = re.sub(r'@CrossOrigin\s*\(.*?\)\n?', '', content)
                content = re.sub(r'@CrossOrigin\n?', '', content)
                
                with open(filepath, 'w', encoding='utf-8') as f:
                    f.write(content)
                print(f"Cleaned {filepath}")
