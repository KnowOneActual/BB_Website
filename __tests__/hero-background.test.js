/**
 * Unit tests for hero background animation implementation
 * Tests verify that the Three.js animation has been replaced with CSS gradient animation
 */

describe('Hero Background Animation', () => {
  let mockDocument;

  beforeEach(() => {
    // Set up a clean DOM before each test
    document.body.innerHTML = '';
  });

  afterEach(() => {
    // Clean up after each test
    document.body.innerHTML = '';
  });

  describe('initializeThreeJsAnimation function', () => {
    test('should not be defined in script.js', () => {
      // Test case 1: The initializeThreeJsAnimation function is no longer defined or called
      const scriptModule = require('../script.js');
      expect(scriptModule.initializeThreeJsAnimation).toBeUndefined();
      expect(global.initializeThreeJsAnimation).toBeUndefined();
    });

    test('should not be called in the global scope', () => {
      // Verify that initializeThreeJsAnimation is not called anywhere
      const fs = require('fs');
      const path = require('path');
      const scriptPath = path.join(__dirname, '..', 'script.js');
      const scriptContent = fs.readFileSync(scriptPath, 'utf8');
      
      expect(scriptContent).not.toContain('initializeThreeJsAnimation()');
      expect(scriptContent).not.toContain('initializeThreeJsAnimation(');
    });
  });

  describe('#hero-background canvas element', () => {
    test('should not be present in the DOM', () => {
      // Test case 2: The #hero-background canvas element is not present in the DOM
      // Load the index.html content
      const fs = require('fs');
      const path = require('path');
      const htmlPath = path.join(__dirname, '..', 'index.html');
      const htmlContent = fs.readFileSync(htmlPath, 'utf8');
      
      // Set up the DOM with the HTML content
      document.body.innerHTML = htmlContent;
      
      // Check that #hero-background does not exist
      const heroBackground = document.querySelector('#hero-background');
      expect(heroBackground).toBeNull();
    });

    test('should not have any canvas elements with id="hero-background" in HTML', () => {
      const fs = require('fs');
      const path = require('path');
      const htmlPath = path.join(__dirname, '..', 'index.html');
      const htmlContent = fs.readFileSync(htmlPath, 'utf8');
      
      // Check raw HTML content for the canvas element
      expect(htmlContent).not.toMatch(/<canvas[^>]*id=["']hero-background["'][^>]*>/i);
      expect(htmlContent).not.toMatch(/id=["']hero-background["'][^>]*<canvas/i);
    });
  });

  describe('.bg-gradient-to-br CSS class', () => {
    test('should apply the gradient-flow animation', () => {
      // Test case 3: The .bg-gradient-to-br class applies the gradient-flow animation
      const fs = require('fs');
      const path = require('path');
      const cssPath = path.join(__dirname, '..', 'style.css');
      const cssContent = fs.readFileSync(cssPath, 'utf8');
      
      // Find the custom .bg-gradient-to-br rule (not the Tailwind default)
      // Look for the section that includes the animation property
      const bgGradientPattern = /\.bg-gradient-to-br\s*\{[^}]*animation:\s*gradient-flow/i;
      expect(cssContent).toMatch(bgGradientPattern);
    });

    test('should have background-size property for animation effect', () => {
      const fs = require('fs');
      const path = require('path');
      const cssPath = path.join(__dirname, '..', 'style.css');
      const cssContent = fs.readFileSync(cssPath, 'utf8');
      
      // The custom .bg-gradient-to-br should have background-size: 200% 200%
      // to make the gradient larger than the container for animation
      const customBgGradientSection = cssContent.match(
        /\/\*.*Animated Gradient.*\*\/[\s\S]*?\.bg-gradient-to-br\s*\{[\s\S]*?\}/i
      );
      
      expect(customBgGradientSection).not.toBeNull();
      if (customBgGradientSection) {
        expect(customBgGradientSection[0]).toMatch(/background-size:\s*200%\s+200%/i);
      }
    });

    test('should specify animation timing and iteration', () => {
      const fs = require('fs');
      const path = require('path');
      const cssPath = path.join(__dirname, '..', 'style.css');
      const cssContent = fs.readFileSync(cssPath, 'utf8');
      
      // Check for the full animation declaration with timing
      const animationPattern = /animation:\s*gradient-flow\s+\d+s\s+ease\s+infinite/i;
      expect(cssContent).toMatch(animationPattern);
    });
  });

  describe('@keyframes gradient-flow', () => {
    test('should be defined in the CSS', () => {
      // Test case 4: The @keyframes gradient-flow rule is defined in the CSS
      const fs = require('fs');
      const path = require('path');
      const cssPath = path.join(__dirname, '..', 'style.css');
      const cssContent = fs.readFileSync(cssPath, 'utf8');
      
      // Check for @keyframes gradient-flow definition
      expect(cssContent).toMatch(/@keyframes\s+gradient-flow\s*\{/i);
    });

    test('should have 0% keyframe with initial position', () => {
      const fs = require('fs');
      const path = require('path');
      const cssPath = path.join(__dirname, '..', 'style.css');
      const cssContent = fs.readFileSync(cssPath, 'utf8');
      
      // Extract the gradient-flow keyframes block
      const keyframesMatch = cssContent.match(
        /@keyframes\s+gradient-flow\s*\{[\s\S]*?\n\}/i
      );
      
      expect(keyframesMatch).not.toBeNull();
      if (keyframesMatch) {
        const keyframesContent = keyframesMatch[0];
        expect(keyframesContent).toMatch(/0%\s*\{[\s\S]*?background-position:\s*0%\s+50%/i);
      }
    });

    test('should have 50% keyframe with moved position', () => {
      const fs = require('fs');
      const path = require('path');
      const cssPath = path.join(__dirname, '..', 'style.css');
      const cssContent = fs.readFileSync(cssPath, 'utf8');
      
      const keyframesMatch = cssContent.match(
        /@keyframes\s+gradient-flow\s*\{[\s\S]*?\n\}/i
      );
      
      expect(keyframesMatch).not.toBeNull();
      if (keyframesMatch) {
        const keyframesContent = keyframesMatch[0];
        expect(keyframesContent).toMatch(/50%\s*\{[\s\S]*?background-position:\s*100%\s+50%/i);
      }
    });

    test('should have 100% keyframe returning to initial position', () => {
      const fs = require('fs');
      const path = require('path');
      const cssPath = path.join(__dirname, '..', 'style.css');
      const cssContent = fs.readFileSync(cssPath, 'utf8');
      
      const keyframesMatch = cssContent.match(
        /@keyframes\s+gradient-flow\s*\{[\s\S]*?\n\}/i
      );
      
      expect(keyframesMatch).not.toBeNull();
      if (keyframesMatch) {
        const keyframesContent = keyframesMatch[0];
        expect(keyframesContent).toMatch(/100%\s*\{[\s\S]*?background-position:\s*0%\s+50%/i);
      }
    });

    test('should create a smooth looping animation', () => {
      const fs = require('fs');
      const path = require('path');
      const cssPath = path.join(__dirname, '..', 'style.css');
      const cssContent = fs.readFileSync(cssPath, 'utf8');
      
      const keyframesMatch = cssContent.match(
        /@keyframes\s+gradient-flow\s*\{[\s\S]*?\n\}/i
      );
      
      expect(keyframesMatch).not.toBeNull();
      if (keyframesMatch) {
        const keyframesContent = keyframesMatch[0];
        
        // Verify all three keyframes exist
        expect(keyframesContent).toMatch(/0%\s*\{/);
        expect(keyframesContent).toMatch(/50%\s*\{/);
        expect(keyframesContent).toMatch(/100%\s*\{/);
        
        // Verify the positions create a loop (0% and 100% should be the same)
        const positions = [];
        const positionMatches = keyframesContent.matchAll(/background-position:\s*(\d+)%\s+(\d+)%/gi);
        
        for (const match of positionMatches) {
          positions.push(`${match[1]}% ${match[2]}%`);
        }
        
        // First and last positions should match for smooth looping
        expect(positions.length).toBeGreaterThanOrEqual(3);
        expect(positions[0]).toBe(positions[positions.length - 1]);
      }
    });
  });

  describe('Integration: CSS-based gradient animation', () => {
    test('should have removed Three.js dependency for hero background', () => {
      // Verify three.js is not being used for hero background
      const fs = require('fs');
      const path = require('path');
      const htmlPath = path.join(__dirname, '..', 'index.html');
      const htmlContent = fs.readFileSync(htmlPath, 'utf8');
      
      // If three.js is loaded, it should not be for the hero background
      // (it might be used elsewhere in the project)
      // The absence of #hero-background canvas is the key indicator
      const heroBackground = htmlContent.match(/<canvas[^>]*id=["']hero-background["']/i);
      expect(heroBackground).toBeNull();
    });

    test('should use pure CSS for animation performance', () => {
      const fs = require('fs');
      const path = require('path');
      const cssPath = path.join(__dirname, '..', 'style.css');
      const cssContent = fs.readFileSync(cssPath, 'utf8');
      
      // Verify the animation is CSS-based (uses @keyframes)
      const hasKeyframes = cssContent.includes('@keyframes gradient-flow');
      const hasCssAnimation = cssContent.match(/animation:\s*gradient-flow/i);
      
      expect(hasKeyframes).toBe(true);
      expect(hasCssAnimation).not.toBeNull();
    });
  });
});
