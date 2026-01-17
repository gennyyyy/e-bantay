const fs = require('fs');
try {
    const content = fs.readFileSync('lint.json', 'utf16le');
    // Find JSON array
    const start = content.indexOf('[');
    const end = content.lastIndexOf(']');

    if (start === -1 || end === -1) {
        throw new Error("Could not find JSON array in file");
    }

    const jsonContent = content.substring(start, end + 1);
    const results = JSON.parse(jsonContent);

    fs.writeFileSync('errors.txt', ''); // Clear file
    results.forEach(result => {
        if (result.errorCount > 0 || result.warningCount > 0) {
            fs.appendFileSync('errors.txt', `\nFile: ${result.filePath}\n`);
            result.messages.forEach(msg => {
                fs.appendFileSync('errors.txt', `  ${msg.line}:${msg.column} [${msg.severity === 2 ? 'Error' : 'Warning'}] ${msg.message} (${msg.ruleId})\n`);
            });
        }
    });
} catch (e) {
    console.error("Error parsing JSON:", e.message);
    // console.log("Content start:", content.substring(0, 100)); // Debug if needed
}
