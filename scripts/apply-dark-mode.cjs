const fs = require('fs');
const path = require('path');

const srcDir = path.join(__dirname, '../src');

// List of replacements
const replacements = [
  // Backgrounds
  { regex: /bg-white(?![\w-])/g, replace: 'bg-white dark:bg-slate-800' },
  { regex: /bg-gray-50(?![\w-])/g, replace: 'bg-gray-50 dark:bg-slate-900' },
  { regex: /bg-gray-100(?![\w-])/g, replace: 'bg-gray-100 dark:bg-slate-700' },
  { regex: /bg-gray-200(?![\w-])/g, replace: 'bg-gray-200 dark:bg-slate-600' },
  { regex: /bg-slate-50(?![\w-])/g, replace: 'bg-slate-50 dark:bg-slate-900' },
  { regex: /bg-indigo-50(?![\w-])/g, replace: 'bg-indigo-50 dark:bg-indigo-900\/30' },
  { regex: /bg-emerald-50(?![\w-])/g, replace: 'bg-emerald-50 dark:bg-emerald-900\/30' },
  { regex: /bg-amber-50(?![\w-])/g, replace: 'bg-amber-50 dark:bg-amber-900\/30' },
  { regex: /bg-blue-50(?![\w-])/g, replace: 'bg-blue-50 dark:bg-blue-900\/30' },
  
  // Texts
  { regex: /text-gray-900(?![\w-])/g, replace: 'text-gray-900 dark:text-white' },
  { regex: /text-gray-800(?![\w-])/g, replace: 'text-gray-800 dark:text-slate-100' },
  { regex: /text-gray-700(?![\w-])/g, replace: 'text-gray-700 dark:text-slate-200' },
  { regex: /text-gray-600(?![\w-])/g, replace: 'text-gray-600 dark:text-slate-300' },
  { regex: /text-gray-500(?![\w-])/g, replace: 'text-gray-500 dark:text-slate-400' },
  { regex: /text-slate-900(?![\w-])/g, replace: 'text-slate-900 dark:text-white' },
  { regex: /text-slate-800(?![\w-])/g, replace: 'text-slate-800 dark:text-slate-100' },
  { regex: /text-slate-700(?![\w-])/g, replace: 'text-slate-700 dark:text-slate-200' },
  { regex: /text-slate-600(?![\w-])/g, replace: 'text-slate-600 dark:text-slate-300' },
  { regex: /text-slate-500(?![\w-])/g, replace: 'text-slate-500 dark:text-slate-400' },
  { regex: /text-indigo-900(?![\w-])/g, replace: 'text-indigo-900 dark:text-indigo-100' },
  { regex: /text-indigo-600(?![\w-])/g, replace: 'text-indigo-600 dark:text-indigo-400' },
  { regex: /text-emerald-900(?![\w-])/g, replace: 'text-emerald-900 dark:text-emerald-100' },
  { regex: /text-emerald-600(?![\w-])/g, replace: 'text-emerald-600 dark:text-emerald-400' },
  { regex: /text-amber-900(?![\w-])/g, replace: 'text-amber-900 dark:text-amber-100' },
  { regex: /text-amber-600(?![\w-])/g, replace: 'text-amber-600 dark:text-amber-400' },

  // Borders
  { regex: /border-gray-100(?![\w-])/g, replace: 'border-gray-100 dark:border-slate-700\/50' },
  { regex: /border-gray-200(?![\w-])/g, replace: 'border-gray-200 dark:border-slate-700' },
  { regex: /border-gray-300(?![\w-])/g, replace: 'border-gray-300 dark:border-slate-600' },
  { regex: /border-slate-200(?![\w-])/g, replace: 'border-slate-200 dark:border-slate-700' },
  { regex: /border-indigo-100(?![\w-])/g, replace: 'border-indigo-100 dark:border-indigo-800\/50' },
  { regex: /border-emerald-100(?![\w-])/g, replace: 'border-emerald-100 dark:border-emerald-800\/50' },
  { regex: /border-amber-100(?![\w-])/g, replace: 'border-amber-100 dark:border-amber-800\/50' },
];

function processDirectory(directory) {
  const files = fs.readdirSync(directory);
  
  for (const file of files) {
    const fullPath = path.join(directory, file);
    const stat = fs.statSync(fullPath);
    
    if (stat.isDirectory()) {
      processDirectory(fullPath);
    } else if (stat.isFile() && fullPath.endsWith('.tsx')) {
      let content = fs.readFileSync(fullPath, 'utf8');
      let modified = false;

      // Ensure we don't accidentally replace a class that already has a dark variant
      // So if it's "bg-white dark:bg-slate-800", the regex will match "bg-white".
      // We will do a simple pass first.
      
      for (const { regex, replace } of replacements) {
        if (regex.test(content)) {
          // Check if dark variant already follows (rudimentary)
          // Actually, let's just let it be replaced. We can fix double darks later.
          // Wait, string.replace(regex, replace) might create "bg-white dark:bg-slate-800 dark:bg-slate-800" if ran twice.
          // Let's use a replacer function that checks if 'dark:' is immediately after.
          
          content = content.replace(regex, (match, offset, string) => {
            const lookahead = string.slice(offset + match.length, offset + match.length + 5);
            if (lookahead === ' dark') {
              return match; // already handled
            }
            return replace;
          });
          modified = true;
        }
      }

      if (modified) {
        fs.writeFileSync(fullPath, content, 'utf8');
        console.log(`Updated: ${fullPath}`);
      }
    }
  }
}

console.log('Starting dark mode injection...');
processDirectory(srcDir);
console.log('Done.');
