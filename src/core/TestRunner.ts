export class TestRunner {
  async runTests(code: Map<string, string>): Promise<boolean> {
    console.log('Running tests on generated code...');
    
    // Basic validation tests
    const hasIndex = code.has('index.html');
    const hasCSS = Array.from(code.keys()).some(path => path.endsWith('.css'));
    const hasJS = Array.from(code.keys()).some(path => path.endsWith('.js'));
    
    // Check for required files
    const requiredFiles = [
      'index.html',
      'app/assets/javascripts/application.js',
      'app/assets/stylesheets/application.css'
    ];
    
    const missingFiles = requiredFiles.filter(file => !code.has(file));
    
    if (missingFiles.length > 0) {
      console.error('Missing required files:', missingFiles);
      return false;
    }
    
    // Validate HTML
    const html = code.get('index.html') || '';
    const hasValidHTML = html.includes('<!DOCTYPE html>') && 
                        html.includes('<body>') && 
                        html.includes('</body>');
    
    if (!hasValidHTML) {
      console.error('Invalid HTML structure');
      return false;
    }
    
    // Validate JavaScript syntax (basic check)
    for (const [path, content] of code.entries()) {
      if (path.endsWith('.js')) {
        try {
          // Basic syntax check
          new Function(content);
        } catch (error) {
          console.error(`Syntax error in ${path}:`, error);
          return false;
        }
      }
    }
    
    console.log('All tests passed!');
    return true;
  }
}