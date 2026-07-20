import fs from 'fs';
import path from 'path';

const modulesDir = path.join(process.cwd(), 'MODULES');
const outputDir = path.join(process.cwd(), 'src', 'assets');
const outputFile = path.join(outputDir, 'default_modules.json');

const levels = ['ELEMENTARY', 'JUNIOR', 'SENIOR'];

const allModules = [];

levels.forEach((level) => {
  const levelDir = path.join(modulesDir, level);
  if (!fs.existsSync(levelDir)) {
    console.warn(`Directory not found: ${levelDir}`);
    return;
  }

  const files = fs.readdirSync(levelDir);
  files.forEach((file) => {
    const filePath = path.join(levelDir, file);
    const stat = fs.statSync(filePath);
    if (stat.isFile()) {
      const content = fs.readFileSync(filePath, 'utf-8');
      
      // Level mapping to lowercase for database levels
      const levelKey = level.toLowerCase();
      
      allModules.push({
        title: file.trim(),
        level: levelKey,
        content: content,
        isPublished: true,
      });
    }
  });
});

if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

fs.writeFileSync(outputFile, JSON.stringify(allModules, null, 2), 'utf-8');
console.log(`Parsed ${allModules.length} modules successfully. Saved to ${outputFile}`);
