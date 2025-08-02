// Test script to verify prompt library registration
const { PromptLibrary } = require('./app/lib/common/prompt-library.ts');

console.log('Available prompts:', PromptLibrary.getList());

// Test if our landing page prompts are registered
const guide = PromptLibrary.library['landing-page-guide'];
const generator = PromptLibrary.library['landing-page-generator'];

console.log('Landing Page Guide prompt:', guide ? '✅ Found' : '❌ Missing');
console.log('Landing Page Generator prompt:', generator ? '✅ Found' : '❌ Missing');

if (guide) {
  const guidePrompt = guide.get({
    cwd: '/tmp',
    allowedHtmlElements: [],
    modificationTagName: 'bolt'
  });
  console.log('Guide prompt preview:', guidePrompt.substring(0, 100) + '...');
}

if (generator) {
  const generatorPrompt = generator.get({
    cwd: '/tmp', 
    allowedHtmlElements: [],
    modificationTagName: 'bolt'
  });
  console.log('Generator prompt preview:', generatorPrompt.substring(0, 100) + '...');
}