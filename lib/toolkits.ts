import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { remark } from 'remark';
import html from 'remark-html';

const toolkitsDirectory = path.join(process.cwd(), 'content/toolkits');

export function getSortedToolkitsData() {
  // Get file names under /content/toolkits
  const fileNames = fs.readdirSync(toolkitsDirectory);
  const allToolkitsData = fileNames.map((fileName) => {
    // Remove '.md' from file name to get id
    const id = fileName.replace(/\.md$/, '');

    // Read markdown file as string
    const fullPath = path.join(toolkitsDirectory, fileName);
    const fileContents = fs.readFileSync(fullPath, 'utf8');

    // Use gray-matter to parse the post metadata section
    const matterResult = matter(fileContents);

    // Combine the data with the id
    return {
      id,
      ...(matterResult.data as { title: string; date: string }),
    };
  });
  // Sort toolkits by title
  return allToolkitsData.sort((a, b) => {
    if (a.title < b.title) {
      return -1;
    } else {
      return 1;
    }
  });
}

export async function getToolkitData(id: string) {
  const fullPath = path.join(toolkitsDirectory, `${id}.md`);
  const fileContents = fs.readFileSync(fullPath, 'utf8');

  // Use gray-matter to parse the post metadata section
  const matterResult = matter(fileContents);

  // Use remark to convert markdown into HTML string
  const processedContent = await remark()
    .use(html)
    .process(matterResult.content);
  const contentHtml = processedContent.toString();

  // Combine the data with the id and contentHtml
  return {
    id,
    contentHtml,
    ...(matterResult.data as { title: string; date: string }),
  };
}

export function getAllToolkitIds() {
  const fileNames = fs.readdirSync(toolkitsDirectory);

  return fileNames.map((fileName) => {
    return {
      params: {
        id: fileName.replace(/\.md$/, ''),
      },
    };
  });
}
