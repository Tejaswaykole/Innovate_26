const fs = require('fs');
const path = require('path');
const dir = 'C:/Users/tejas/OneDrive/Desktop/Hackathon JTM/frontend/admin-panel/src/services';

fs.readdirSync(dir).forEach(file => {
  if (file.endsWith('.ts')) {
    const filePath = path.join(dir, file);
    let content = fs.readFileSync(filePath, 'utf8');
    if (content.includes("const API_BASE_URL = 'http://localhost:5000/api/v1';")) {
      content = content.replace("const API_BASE_URL = 'http://localhost:5000/api/v1';", "const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1';");
      fs.writeFileSync(filePath, content);
      console.log('Fixed ' + file);
    }
  }
});
