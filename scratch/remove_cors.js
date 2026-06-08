const fs = require('fs');
const path = require('path');

const directory = path.join('c:', 'Users', 'ayush', 'FYC', 'backend', 'src', 'main', 'java', 'com', 'example', 'admin');

function walkDir(dir) {
    fs.readdirSync(dir).forEach(file => {
        let fullPath = path.join(dir, file);
        if (fs.statSync(fullPath).isDirectory()) {
            walkDir(fullPath);
        } else if (fullPath.endsWith('.java')) {
            let content = fs.readFileSync(fullPath, 'utf8');
            if (content.includes('CrossOrigin')) {
                // Remove import
                content = content.replace(/import org\.springframework\.web\.bind\.annotation\.CrossOrigin;\r?\n?/g, '');
                // Remove annotation
                content = content.replace(/@CrossOrigin\(.*?\)\r?\n?/g, '');
                content = content.replace(/@CrossOrigin\r?\n?/g, '');
                fs.writeFileSync(fullPath, content, 'utf8');
                console.log('Cleaned ' + fullPath);
            }
        }
    });
}

walkDir(directory);
