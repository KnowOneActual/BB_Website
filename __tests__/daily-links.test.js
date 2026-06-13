/**
 * Unit tests for Daily Links Hub functionality
 */

describe('Daily Links Hub', () => {
  let mockData;
  let searchInput;
  let clearBtn;
  const originalFetch = global.fetch;

  beforeEach(() => {
    // Reset JSDOM DOM
    document.body.innerHTML = `
      <main>
        <div class="relative max-w-2xl mx-auto">
          <i id="search-icon"></i>
          <input type="text" id="search-input" />
          <div id="shortcut-badge"><kbd>/</kbd></div>
          <button id="clear-search-btn" class="hidden"></button>
        </div>
        <div id="category-pills"></div>
        <div id="links-container">
          <div class="animate-pulse">Loading links...</div>
        </div>
      </main>
    `;

    searchInput = document.getElementById('search-input');
    clearBtn = document.getElementById('clear-search-btn');

    // Sample mock JSON data
    mockData = {
      categories: [
        {
          name: 'Category A',
          links: [
            {
              name: 'Link Alpha',
              url: 'https://alpha.com',
              icon: 'fa-solid fa-alpha-icon',
              pinned: true,
            },
            {
              name: 'Link Beta',
              url: 'https://beta.com',
              icon: 'fa-solid fa-beta-icon',
            },
          ],
        },
        {
          name: 'Category B',
          links: [
            {
              name: 'Link Gamma',
              url: 'https://gamma.com',
              icon: 'svg',
              svg: '<svg><path d="M0 0h24v24H0z"/></svg>',
            },
          ],
        },
      ],
    };

    // Mock fetch
    global.fetch = jest.fn().mockImplementation(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve(mockData),
      }),
    );

    // Reset module registry so each test loads clean code
    jest.resetModules();
  });

  afterEach(() => {
    global.fetch = originalFetch;
    document.body.innerHTML = '';
    jest.restoreAllMocks();
  });

  // Helper to load and initialize script
  async function initHub() {
    jest.isolateModules(() => {
      require('../js/daily-links.js');
    });
    // Trigger DOMContentLoaded
    document.dispatchEvent(new Event('DOMContentLoaded'));
    // Wait for async microtasks (fetch resolving) to complete
    await new Promise((resolve) => setTimeout(resolve, 0));
  }

  test('should load links data and render categories, links, and pills', async () => {
    await initHub();

    // Verify fetch was called
    expect(global.fetch).toHaveBeenCalledWith('data/daily-links.json');

    // Verify pills rendering: All, Quick Access, Category A, Category B
    const pills = document.querySelectorAll('.pill-btn');
    expect(pills.length).toBe(4);
    expect(pills[0].textContent).toBe('All');
    expect(pills[1].textContent).toBe('Quick Access');
    expect(pills[2].textContent).toBe('Category A');
    expect(pills[3].textContent).toBe('Category B');

    // Verify All is active by default
    expect(pills[0].classList.contains('active')).toBe(true);

    // Verify categories rendered in links-container
    // 1st category should be Quick Access (pinned links render first under 'All')
    // 2nd category should be Category A
    // 3rd category should be Category B
    const headings = document.querySelectorAll('#links-container h2');
    expect(headings.length).toBe(3);
    expect(headings[0].textContent).toBe('Quick Access');
    expect(headings[1].textContent).toBe('Category A');
    expect(headings[2].textContent).toBe('Category B');

    // Check link Alpha in Quick Access
    const cards = document.querySelectorAll('.card-link');
    // Cards: Link Alpha (Quick Access), Link Alpha (Category A), Link Beta (Category A), Link Gamma (Category B) -> 4 cards
    expect(cards.length).toBe(4);
    expect(cards[0].href).toBe('https://alpha.com/');
    expect(cards[0].textContent).toContain('Link Alpha');
  });

  test('should filter links based on search query', async () => {
    await initHub();

    // Type query "Beta" into search input
    searchInput.value = 'Beta';
    searchInput.dispatchEvent(new Event('input'));

    // Wait for render to update
    await new Promise((resolve) => setTimeout(resolve, 0));

    // Category headings should only include Category A (which has Beta)
    const headings = document.querySelectorAll('#links-container h2');
    expect(headings.length).toBe(1);
    expect(headings[0].textContent).toBe('Category A');

    // Should only render Link Beta card
    const cards = document.querySelectorAll('.card-link');
    expect(cards.length).toBe(1);
    expect(cards[0].textContent).toContain('Link Beta');
    expect(cards[0].querySelector('.highlight').textContent).toBe('Beta');

    // Clear search button should be visible
    expect(clearBtn.classList.contains('hidden')).toBe(false);
  });

  test('should show empty state when search matches nothing', async () => {
    await initHub();

    searchInput.value = 'xyz';
    searchInput.dispatchEvent(new Event('input'));
    await new Promise((resolve) => setTimeout(resolve, 0));

    // No categories rendered
    expect(document.querySelectorAll('#links-container h2').length).toBe(0);

    // Empty state message rendered
    const container = document.getElementById('links-container');
    expect(container.textContent).toContain('No matches found');
    expect(container.textContent).toContain('We couldn\'t find any links matching "xyz".');

    // Click "Clear Search" in the empty state
    const clearBtnInEmpty = container.querySelector('button');
    expect(clearBtnInEmpty).not.toBeNull();
    clearBtnInEmpty.click();

    await new Promise((resolve) => setTimeout(resolve, 0));
    // Input is cleared and all links restored
    expect(searchInput.value).toBe('');
    expect(document.querySelectorAll('#links-container h2').length).toBe(3);
  });

  test('should filter categories when pill is clicked', async () => {
    await initHub();

    const pills = document.querySelectorAll('.pill-btn');
    const pillCategoryB = pills[3]; // Category B pill

    // Click Category B pill
    pillCategoryB.click();
    await new Promise((resolve) => setTimeout(resolve, 0));

    // Category B pill should be active
    expect(pillCategoryB.classList.contains('active')).toBe(true);
    expect(pills[0].classList.contains('active')).toBe(false);

    // Only Category B should render
    const headings = document.querySelectorAll('#links-container h2');
    expect(headings.length).toBe(1);
    expect(headings[0].textContent).toBe('Category B');

    // Only Link Gamma card should render
    const cards = document.querySelectorAll('.card-link');
    expect(cards.length).toBe(1);
    expect(cards[0].textContent).toContain('Link Gamma');
  });

  test('should clear search query when clear button is clicked', async () => {
    await initHub();

    searchInput.value = 'Alpha';
    searchInput.dispatchEvent(new Event('input'));
    await new Promise((resolve) => setTimeout(resolve, 0));

    expect(clearBtn.classList.contains('hidden')).toBe(false);

    // Click clear button
    clearBtn.click();
    await new Promise((resolve) => setTimeout(resolve, 0));

    expect(searchInput.value).toBe('');
    expect(clearBtn.classList.contains('hidden')).toBe(true);
    expect(document.querySelectorAll('#links-container h2').length).toBe(3);
  });

  test('should handle keyboard shortcuts to focus and clear search input', async () => {
    await initHub();

    // Mock searchInput focus
    const focusMock = jest.spyOn(searchInput, 'focus');
    const selectMock = jest.spyOn(searchInput, 'select');

    // Press '/' key
    document.dispatchEvent(new KeyboardEvent('keydown', { key: '/' }));
    expect(focusMock).toHaveBeenCalled();
    expect(selectMock).toHaveBeenCalled();

    focusMock.mockClear();
    selectMock.mockClear();

    // Press Ctrl+K
    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'k', ctrlKey: true }));
    expect(focusMock).toHaveBeenCalled();
    expect(selectMock).toHaveBeenCalled();

    // Mock searchInput blur
    const blurMock = jest.spyOn(searchInput, 'blur');

    // Focus input and press Escape
    searchInput.value = 'test';
    searchInput.focus();
    searchInput.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }));

    expect(searchInput.value).toBe('');
    expect(blurMock).toHaveBeenCalled();
  });

  test('should sanitize SVG icon from script tags and inline events', async () => {
    // Add malicious SVG to mock data
    mockData.categories[0].links.push({
      name: 'Malicious Link',
      url: 'https://evil.com',
      icon: 'svg',
      svg: '<svg><script>alert("evil")</script><g onclick="runEvil()"><circle r="5"/></g></svg>',
    });

    await initHub();

    // Gamma + Malicious = 5 cards total (Alpha in Quick Access, Alpha in Cat A, Beta in Cat A, Gamma in Cat B, Malicious in Cat A)
    const cards = document.querySelectorAll('.card-link');
    // Find Malicious card
    const maliciousCard = Array.from(cards).find((c) => c.textContent.includes('Malicious Link'));
    expect(maliciousCard).toBeDefined();

    const svg = maliciousCard.querySelector('svg');
    expect(svg).not.toBeNull();
    // Script tag should be removed
    expect(svg.querySelector('script')).toBeNull();
    // onclick attribute should be removed
    const group = svg.querySelector('g');
    expect(group.getAttribute('onclick')).toBeNull();
  });
});
