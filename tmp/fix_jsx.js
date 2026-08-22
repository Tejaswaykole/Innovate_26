const fs = require('fs');
const path = require('path');

function processFile(filePath) {
    let content = fs.readFileSync(filePath, 'utf8');
    
    // Better script removal
    content = content.replace(/<script[\s\S]*?<\/script>/gi, '');
    // Better style removal
    content = content.replace(/<style[\s\S]*?<\/style>/gi, '');
    
    // Fix common SVG issues
    content = content.replace(/viewbox=/gi, 'viewBox=');
    content = content.replace(/fill-rule=/gi, 'fillRule=');
    content = content.replace(/clip-rule=/gi, 'clipRule=');
    content = content.replace(/stroke-width=/gi, 'strokeWidth=');
    content = content.replace(/stroke-linecap=/gi, 'strokeLinecap=');
    content = content.replace(/stroke-linejoin=/gi, 'strokeLinejoin=');
    content = content.replace(/stroke-miterlimit=/gi, 'strokeMiterlimit=');
    content = content.replace(/stroke-dasharray=/gi, 'strokeDasharray=');
    content = content.replace(/stroke-dashoffset=/gi, 'strokeDashoffset=');
    
    // Handlers
    content = content.replace(/onclick="[^"]*"/gi, '');
    content = content.replace(/onchange="[^"]*"/gi, '');
    content = content.replace(/onsubmit="[^"]*"/gi, '');
    
    // Ensure img, input, hr, br tags are closed if they were missed by the first script
    content = content.replace(/<(img|input|hr|br|meta|link)([^>]*?)(?<!\/)>/gi, '<$1$2 />');
    
    // Replace unescaped braces left in the text (but not the ones for style={{...}})
    // Actually, just removing the script tags usually fixes 99% of TS errors.
    
    fs.writeFileSync(filePath, content);
}

function reExtract() {
    const mainWebPages = path.join(__dirname, '../frontend/main-web/src/pages');
    const judgePortalPages = path.join(__dirname, '../frontend/judge-portal/src/pages');
    const adminPanelPages = path.join(__dirname, '../frontend/admin-panel/src/pages');

    const allDirs = [mainWebPages, judgePortalPages, adminPanelPages];
    for (const dir of allDirs) {
        if (fs.existsSync(dir)) {
            const files = fs.readdirSync(dir);
            for (const file of files) {
                if (file.endsWith('.tsx')) {
                    processFile(path.join(dir, file));
                }
            }
        }
    }
}

reExtract();
