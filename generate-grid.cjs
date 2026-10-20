const fs = require('fs');
const path = require('path');

// Your exact working directories
const photosDir = path.join(__dirname, 'content/Attachments');
const outputFile = path.join(__dirname, 'content/Featured/Photos.md');

if (fs.existsSync(photosDir)) {
  // Grab all image files from your Attachments folder
  const files = fs.readdirSync(photosDir).filter(file => /\.(png|jpg|jpeg|webp)$/i.test(file));

  // Build the grid HTML container
  let gridContent = '<div class="image-grid">\n\n';

  files.forEach(file => {
    // encodeURI safely handles spaces and special characters (turning spaces into %20)
    // so browsers load them correctly without throwing 404 / '?' errors
    const encodedFile = encodeURI(file);

    // Root-relative path pointing directly to your published Attachments folder
    gridContent += `![${file}](/Attachments/${encodedFile})\n`;
  });

  gridContent += '\n</div>';

  let fileData = '';

  if (fs.existsSync(outputFile)) {
    // Read the existing file so we don't overwrite your custom text or frontmatter
    fileData = fs.readFileSync(outputFile, 'utf8');

    // Look for an existing image-grid block
    const gridRegex = /<div class="image-grid">[\s\S]*?<\/div>/;

    if (gridRegex.test(fileData)) {
      // Replace only the old grid with the newly scanned list of photos
      fileData = fileData.replace(gridRegex, gridContent);
    } else {
      // If the grid div isn't there yet, append it to the bottom of the file
      fileData += `\n\n${gridContent}\n`;
    }
  } else {
    // If the file doesn't exist yet, create it fresh
    fileData = `---
title: Photos
---

${gridContent}
`;
  }

  // Save changes back to your portfolio markdown file
  fs.writeFileSync(outputFile, fileData, 'utf8');
  console.log(`✨ Successfully updated photo grid with ${files.length} photos!`);
} else {
  console.log(`⚠️ ERROR: Attachments folder not found at: ${photosDir}`);
}
