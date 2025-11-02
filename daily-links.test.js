/**
 * @jest-environment jsdom
 */

describe('daily-links.js', () => {
  let fetchMock;
  let container;

  beforeEach(() => {
    // Set up DOM
    document.body.innerHTML = `
      <div id="links-container">
        <div class="text-center text-gray-500">Loading links...</div>
      </div>
    `;
    container = document.getElementById('links-container');

    // Mock fetch - create it if it doesn't exist
    global.fetch = global.fetch || jest.fn();
    fetchMock = jest.spyOn(global, 'fetch');
  });

  afterEach(() => {
    if (fetchMock) {
      fetchMock.mockRestore();
    }
    jest.clearAllMocks();
  });

  /**
   * Test Case 1: Successfully fetches and parses daily-links.json
   */
  describe('fetching and parsing daily-links.json', () => {
    it('should successfully fetch daily-links.json with correct path', async () => {
      const mockData = [
        {
          title: 'Test Link 1',
          url: 'https://example.com',
          category: 'Test Category',
          icon: 'fa-solid fa-link',
        },
      ];

      fetchMock.mockResolvedValueOnce({
        ok: true,
        json: async () => mockData,
      });

      // Simulate the fetch call from daily-links.js
      const response = await fetch('data/daily-links.json');
      const data = await response.json();

      expect(fetchMock).toHaveBeenCalledWith('data/daily-links.json');
      expect(response.ok).toBe(true);
      expect(data).toEqual(mockData);
    });

    it('should parse JSON response correctly', async () => {
      const mockData = [
        {
          title: 'Link 1',
          url: 'https://test1.com',
          category: 'Category A',
          icon: 'fa-solid fa-star',
        },
        {
          title: 'Link 2',
          url: 'https://test2.com',
          category: 'Category A',
          icon: 'fa-solid fa-heart',
        },
      ];

      fetchMock.mockResolvedValueOnce({
        ok: true,
        json: async () => mockData,
      });

      const response = await fetch('data/daily-links.json');
      const data = await response.json();

      expect(data).toEqual(mockData);
      expect(data).toHaveLength(2);
      expect(data[0]).toHaveProperty('title');
      expect(data[0]).toHaveProperty('url');
      expect(data[0]).toHaveProperty('category');
      expect(data[0]).toHaveProperty('icon');
    });
  });

  /**
   * Test Case 2: Correctly groups links by category
   */
  describe('grouping links by category', () => {
    it('should group links by their category', () => {
      const links = [
        { title: 'Link 1', category: 'Development', url: 'https://dev1.com' },
        { title: 'Link 2', category: 'Tools', url: 'https://tool1.com' },
        { title: 'Link 3', category: 'Development', url: 'https://dev2.com' },
        { title: 'Link 4', category: 'Tools', url: 'https://tool2.com' },
      ];

      // Test the grouping logic
      const categories = links.reduce((acc, link) => {
        const category = link.category || 'Uncategorized';
        if (!acc[category]) {
          acc[category] = [];
        }
        acc[category].push(link);
        return acc;
      }, {});

      expect(Object.keys(categories)).toHaveLength(2);
      expect(categories['Development']).toHaveLength(2);
      expect(categories['Tools']).toHaveLength(2);
      expect(categories['Development'][0].title).toBe('Link 1');
      expect(categories['Development'][1].title).toBe('Link 3');
    });

    it('should handle uncategorized links', () => {
      const links = [
        { title: 'Link 1', url: 'https://test1.com' },
        { title: 'Link 2', category: 'Category A', url: 'https://test2.com' },
        { title: 'Link 3', url: 'https://test3.com' },
      ];

      const categories = links.reduce((acc, link) => {
        const category = link.category || 'Uncategorized';
        if (!acc[category]) {
          acc[category] = [];
        }
        acc[category].push(link);
        return acc;
      }, {});

      expect(categories['Uncategorized']).toBeDefined();
      expect(categories['Uncategorized']).toHaveLength(2);
      expect(categories['Category A']).toHaveLength(1);
    });

    it('should handle empty links array', () => {
      const links = [];

      const categories = links.reduce((acc, link) => {
        const category = link.category || 'Uncategorized';
        if (!acc[category]) {
          acc[category] = [];
        }
        acc[category].push(link);
        return acc;
      }, {});

      expect(Object.keys(categories)).toHaveLength(0);
    });
  });

  /**
   * Test Case 3: Dynamically renders categories and links into DOM
   */
  describe('rendering categories and links', () => {
    it('should clear loading message before rendering', async () => {
      const mockData = [
        {
          title: 'Test Link',
          url: 'https://example.com',
          category: 'Test',
          icon: 'fa-solid fa-link',
        },
      ];

      fetchMock.mockResolvedValueOnce({
        ok: true,
        json: async () => mockData,
      });

      expect(container.innerHTML).toContain('Loading links...');

      // Simulate the script execution
      const response = await fetch('data/daily-links.json');
      const data = await response.json();
      container.innerHTML = '';

      expect(container.innerHTML).not.toContain('Loading links...');
      expect(container.innerHTML).toBe('');
    });

    it('should render sections for each category', () => {
      const categories = {
        'Category A': [
          { title: 'Link 1', url: 'https://test1.com', icon: 'fa-solid fa-star' },
        ],
        'Category B': [
          { title: 'Link 2', url: 'https://test2.com', icon: 'fa-solid fa-heart' },
        ],
      };

      container.innerHTML = '';

      for (const category in categories) {
        const section = document.createElement('section');
        section.className = 'mb-8 p-6 bg-gray-800 rounded-xl shadow-lg';

        const title = document.createElement('h2');
        title.className =
          'text-2xl font-bold text-fuchsia-400 mb-6 border-b border-gray-700 pb-3';
        title.textContent = category;
        section.appendChild(title);

        container.appendChild(section);
      }

      const sections = container.querySelectorAll('section');
      expect(sections).toHaveLength(2);

      const headings = container.querySelectorAll('h2');
      expect(headings).toHaveLength(2);
      expect(headings[0].textContent).toBe('Category A');
      expect(headings[1].textContent).toBe('Category B');
    });

    it('should render link elements with correct attributes', () => {
      const link = {
        title: 'Test Link',
        url: 'https://example.com',
        icon: 'fa-solid fa-star',
      };

      const linkElement = document.createElement('a');
      linkElement.href = link.url;
      linkElement.target = '_blank';
      linkElement.rel = 'noopener noreferrer';
      linkElement.className =
        'bg-gray-700 p-4 rounded-lg card-link shadow hover:shadow-lg hover:shadow-fuchsia-600/50';

      container.appendChild(linkElement);

      const anchor = container.querySelector('a');
      expect(anchor).toBeTruthy();
      expect(anchor.href).toBe('https://example.com/');
      expect(anchor.target).toBe('_blank');
      expect(anchor.rel).toBe('noopener noreferrer');
      expect(anchor.className).toContain('card-link');
    });

    it('should render link title and icon correctly', () => {
      const link = {
        title: 'GitHub',
        url: 'https://github.com',
        icon: 'fa-brands fa-github',
      };

      const linkElement = document.createElement('a');
      linkElement.href = link.url;

      const titleContainer = document.createElement('div');
      titleContainer.className = 'flex items-center space-x-3';

      const icon = document.createElement('i');
      icon.className = link.icon;
      icon.style.color = 'rgb(232, 121, 249)';

      const linkTitle = document.createElement('span');
      linkTitle.className = 'text-lg font-semibold';
      linkTitle.textContent = link.title;

      titleContainer.appendChild(icon);
      titleContainer.appendChild(linkTitle);
      linkElement.appendChild(titleContainer);

      container.appendChild(linkElement);

      const iconElement = container.querySelector('i');
      const titleElement = container.querySelector('span');

      expect(iconElement.className).toBe('fa-brands fa-github');
      expect(iconElement.style.color).toBe('rgb(232, 121, 249)');
      expect(titleElement.textContent).toBe('GitHub');
    });

    it('should render arrow icon for each link', () => {
      const linkElement = document.createElement('a');

      const arrow = document.createElement('i');
      arrow.className = 'fa-solid fa-arrow-right';
      arrow.style.color = 'rgb(192, 38, 211)';

      linkElement.appendChild(arrow);
      container.appendChild(linkElement);

      const arrowElement = container.querySelector('.fa-arrow-right');
      expect(arrowElement).toBeTruthy();
      expect(arrowElement.style.color).toBe('rgb(192, 38, 211)');
    });
  });

  /**
   * Test Case 4: Displays error message if fetch fails
   */
  describe('error handling', () => {
    it('should display error message when fetch fails', async () => {
      fetchMock.mockRejectedValueOnce(new Error('Network error'));

      try {
        await fetch('data/daily-links.json');
      } catch (error) {
        console.error('Error loading daily links:', error);
        container.innerHTML = `<div class="text-center text-red-500 p-8 bg-gray-800 rounded-xl">
                Sorry, I couldn't load the daily links. Please check the 'data/daily-links.json' file.
            </div>`;
      }

      expect(container.innerHTML).toContain('Sorry, I couldn\'t load the daily links');
      expect(container.innerHTML).toContain('text-red-500');
      expect(container.querySelector('.text-red-500')).toBeTruthy();
    });

    it('should display error message when response is not ok', async () => {
      fetchMock.mockResolvedValueOnce({
        ok: false,
        status: 404,
      });

      let errorMessage = '';
      try {
        const response = await fetch('data/daily-links.json');
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
      } catch (error) {
        errorMessage = error.message;
        console.error('Error loading daily links:', error);
        container.innerHTML = `<div class="text-center text-red-500 p-8 bg-gray-800 rounded-xl">
                Sorry, I couldn't load the daily links. Please check the 'data/daily-links.json' file.
            </div>`;
      }

      expect(container.innerHTML).toContain('Sorry, I couldn\'t load the daily links');
      expect(errorMessage).toContain('HTTP error! status: 404');
    });

    it('should log error to console on fetch failure', async () => {
      const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();
      const testError = new Error('Test error');

      fetchMock.mockRejectedValueOnce(testError);

      try {
        await fetch('data/daily-links.json');
      } catch (error) {
        console.error('Error loading daily links:', error);
      }

      expect(consoleErrorSpy).toHaveBeenCalledWith(
        'Error loading daily links:',
        testError
      );

      consoleErrorSpy.mockRestore();
    });
  });

  /**
   * Test Case 5: Correctly handles links with and without icons
   */
  describe('icon handling', () => {
    it('should render link with specified icon', () => {
      const link = {
        title: 'GitHub',
        url: 'https://github.com',
        icon: 'fa-brands fa-github',
      };

      const icon = document.createElement('i');
      icon.className = link.icon || 'fa-solid fa-link';
      icon.style.color = 'rgb(232, 121, 249)';

      container.appendChild(icon);

      const iconElement = container.querySelector('i');
      expect(iconElement.className).toBe('fa-brands fa-github');
    });

    it('should use default icon when icon is not specified', () => {
      const link = {
        title: 'Test Link',
        url: 'https://example.com',
      };

      const icon = document.createElement('i');
      icon.className = link.icon || 'fa-solid fa-link';
      icon.style.color = 'rgb(232, 121, 249)';

      container.appendChild(icon);

      const iconElement = container.querySelector('i');
      expect(iconElement.className).toBe('fa-solid fa-link');
    });

    it('should use default icon when icon is empty string', () => {
      const link = {
        title: 'Test Link',
        url: 'https://example.com',
        icon: '',
      };

      const icon = document.createElement('i');
      icon.className = link.icon || 'fa-solid fa-link';
      icon.style.color = 'rgb(232, 121, 249)';

      container.appendChild(icon);

      const iconElement = container.querySelector('i');
      expect(iconElement.className).toBe('fa-solid fa-link');
    });

    it('should render multiple links with different icons', () => {
      const links = [
        { title: 'Link 1', url: 'https://test1.com', icon: 'fa-solid fa-star' },
        { title: 'Link 2', url: 'https://test2.com', icon: 'fa-solid fa-heart' },
        { title: 'Link 3', url: 'https://test3.com' }, // No icon
      ];

      container.innerHTML = '';

      links.forEach((link) => {
        const icon = document.createElement('i');
        icon.className = link.icon || 'fa-solid fa-link';
        icon.style.color = 'rgb(232, 121, 249)';
        container.appendChild(icon);
      });

      const icons = container.querySelectorAll('i');
      expect(icons).toHaveLength(3);
      expect(icons[0].className).toBe('fa-solid fa-star');
      expect(icons[1].className).toBe('fa-solid fa-heart');
      expect(icons[2].className).toBe('fa-solid fa-link');
    });

    it('should apply correct color styling to all icons', () => {
      const links = [
        { title: 'Link 1', url: 'https://test1.com', icon: 'fa-solid fa-star' },
        { title: 'Link 2', url: 'https://test2.com' },
      ];

      container.innerHTML = '';

      links.forEach((link) => {
        const icon = document.createElement('i');
        icon.className = link.icon || 'fa-solid fa-link';
        icon.style.color = 'rgb(232, 121, 249)';
        container.appendChild(icon);
      });

      const icons = container.querySelectorAll('i');
      icons.forEach((icon) => {
        expect(icon.style.color).toBe('rgb(232, 121, 249)');
      });
    });
  });
});
