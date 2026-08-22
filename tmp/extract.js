const fs = require('fs');
const path = require('path');

function convertHtmlToReact(html) {
    // Extract the body content
    const bodyMatch = html.match(/<body[^>]*>([\s\S]*?)<\/body>/i);
    let content = bodyMatch ? bodyMatch[1] : html;
    
    // Convert class to className
    content = content.replace(/class=/g, 'className=');
    // Convert for to htmlFor
    content = content.replace(/for=/g, 'htmlFor=');
    // Convert tabindex to tabIndex
    content = content.replace(/tabindex=/g, 'tabIndex=');
    // Close unclosed tags (img, input, hr, br)
    content = content.replace(/<(img|input|hr|br|meta|link)([^>]*?)(?<!\/)>/gi, '<$1$2 />');
    // Fix inline styles - this is a basic regex, might not catch all edge cases
    content = content.replace(/style="([^"]+)"/g, (match, styleString) => {
        const styleObj = styleString.split(';').filter(Boolean).map(s => {
            const [key, value] = s.split(':').map(str => str.trim());
            if (!key) return '';
            // Convert kebab-case to camelCase
            const camelKey = key.replace(/-([a-z])/g, (g) => g[1].toUpperCase());
            return `"${camelKey}": "${value}"`;
        }).filter(Boolean).join(', ');
        return `style={{ ${styleObj} }}`;
    });
    // Remove comments
    content = content.replace(/<!--[\s\S]*?-->/g, '');
    
    return `import React from 'react';\n\nexport default function Component() {\n  return (\n    <>\n      ${content}\n    </>\n  );\n}\n`;
}

function processDirectory(sourceDir, targetDir, pageNameMap = {}) {
    if (!fs.existsSync(sourceDir)) return;
    if (!fs.existsSync(targetDir)) fs.mkdirSync(targetDir, { recursive: true });

    const entries = fs.readdirSync(sourceDir, { withFileTypes: true });
    
    for (const entry of entries) {
        if (entry.isDirectory()) {
            // Find code.html in subdirectories (like ParticipantUI)
            const htmlPath = path.join(sourceDir, entry.name, 'code.html');
            if (fs.existsSync(htmlPath)) {
                const html = fs.readFileSync(htmlPath, 'utf8');
                const reactCode = convertHtmlToReact(html);
                const componentName = pageNameMap[entry.name] || 
                    entry.name.split('_').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join('') + 'Page';
                
                const targetFilePath = path.join(targetDir, `${componentName}.tsx`);
                fs.writeFileSync(targetFilePath, reactCode);
                console.log(`Generated ${targetFilePath}`);
            }
        } else if (entry.name === 'code.html') {
            // Root code.html (like MainUI)
            const html = fs.readFileSync(path.join(sourceDir, entry.name), 'utf8');
            const reactCode = convertHtmlToReact(html);
            const componentName = pageNameMap['root'] || 'LandingPage';
            
            const targetFilePath = path.join(targetDir, `${componentName}.tsx`);
            fs.writeFileSync(targetFilePath, reactCode);
            console.log(`Generated ${targetFilePath}`);
        }
    }
}

// Ensure the target directories exist
const mainWebPages = path.join(__dirname, '../frontend/main-web/src/pages');
const judgePortalPages = path.join(__dirname, '../frontend/judge-portal/src/pages');
const adminPanelPages = path.join(__dirname, '../frontend/admin-panel/src/pages');

// Main Web - Main UI
processDirectory(path.join(__dirname, 'MainUI'), mainWebPages, { 'root': 'LandingPage' });

// Main Web - Participant UI
processDirectory(path.join(__dirname, 'ParticipantUI/stitch_hackathon_design_system_foundation'), mainWebPages);
processDirectory(path.join(__dirname, 'ParticipantUI'), mainWebPages); // In case it's flat

// Judge Portal
processDirectory(path.join(__dirname, 'JudgePortalUI/stitch_hackathon_design_system_foundation'), judgePortalPages);
processDirectory(path.join(__dirname, 'JudgePortalUI'), judgePortalPages);

// Admin Panel
processDirectory(path.join(__dirname, 'AdminUi/stitch_hackathon_design_system_foundation'), adminPanelPages);
processDirectory(path.join(__dirname, 'AdminUi'), adminPanelPages);

console.log('Extraction complete.');
