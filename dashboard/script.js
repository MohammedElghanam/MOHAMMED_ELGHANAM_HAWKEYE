
    // DOM Elements
    const sidebar = document.getElementById('sidebar');
    const openSidebarBtn = document.getElementById('open-sidebar');
    const closeSidebarBtn = document.getElementById('close-sidebar');
    const themeToggleBtn = document.getElementById('theme-toggle');
    const moonIcon = document.getElementById('moon-icon');
    const sunIcon = document.getElementById('sun-icon');
    const themeText = document.getElementById('theme-text');
    const searchInput = document.getElementById('search-input');
    const filterButtons = document.querySelectorAll('.filter-btn');
    const tabButtons = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');
    const loading = document.getElementById('loading');
    const dashboardContent = document.getElementById('dashboard-content');
    const totalIssuesEl = document.getElementById('total-issues');
    const affectedFilesEl = document.getElementById('affected-files');
    const highSeverityEl = document.getElementById('high-severity');
    const issuesCountEl = document.getElementById('issues-count');

    // Initialize
    document.addEventListener('DOMContentLoaded', () => {
      // Check for saved theme
      const savedTheme = localStorage.getItem('theme') || 'light';
      setTheme(savedTheme);
      
      // Load data using the provided fetch code
      fetch('hawkeye.report.json')
        .then(res => res.json())
        .then(data => {
            // Show dashboard content and hide loading
            loading.classList.add('hidden');
            dashboardContent.classList.remove('hidden');
            
            // Update stats
            totalIssuesEl.textContent = data.length;
            
            // Count unique files
            const uniqueFiles = new Set(data.map(item => item.file));
            affectedFilesEl.textContent = uniqueFiles.size;
            
            // Count high severity issues
            const highSeverity = data.filter(item => 
              item.issue && (
                item.issue.includes('security') || 
                item.issue.includes('leak') || 
                item.issue.includes('eval')
              )
            ).length;
            highSeverityEl.textContent = highSeverity;
            
            // Update issues count
            issuesCountEl.textContent = data.length;
            
            // Populate the table
            const reportBody = document.getElementById('reportBody');
            reportBody.innerHTML = ''; // Clear existing content
            
            data.forEach(item => {
                const row = document.createElement('tr');
                
                // Add severity class based on issue content
                let severityClass = '';
                if (item.issue) {
                  if (item.issue.includes('security') || item.issue.includes('leak') || item.issue.includes('eval')) {
                    severityClass = 'bg-red-50 dark:bg-red-900/20';
                  } else if (item.issue.includes('console.log') || item.issue.includes('performance')) {
                    severityClass = 'bg-yellow-50 dark:bg-yellow-900/20';
                  } else {
                    severityClass = 'bg-blue-50 dark:bg-blue-900/20';
                  }
                }
                
                row.className = `hover:bg-gray-50 dark:hover:bg-gray-800 ${severityClass}`;
                
                // Get file name from path
                const fileName = item.file ? item.file.split(/[/\\]/).pop() : 'Unknown';
                
                row.innerHTML = `
                  <td class="px-6 py-4 whitespace-nowrap">
                    <div class="flex items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="mr-2 text-gray-500 dark:text-gray-400">
                        <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"></path>
                        <polyline points="14 2 14 8 20 8"></polyline>
                      </svg>
                      <span title="${item.file}">${fileName}</span>
                    </div>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap">${item.line}</td>
                  <td class="px-6 py-4">${item.issue}</td>
                `;
                
                reportBody.appendChild(row);
            });
        })
        .catch(error => {
            console.error('Error loading data:', error);
            loading.classList.add('hidden');
            dashboardContent.classList.remove('hidden');
            
            // Show error message
            const reportBody = document.getElementById('reportBody');
            reportBody.innerHTML = `
              <tr>
                <td colspan="3" class="px-6 py-4 text-center text-red-500">
                  Failed to load data. Please check if hawkeye.report.json exists.
                </td>
              </tr>
            `;
        });
    });

    // Sidebar Toggle
    openSidebarBtn.addEventListener('click', () => {
      sidebar.classList.remove('-translate-x-full');
    });

    closeSidebarBtn.addEventListener('click', () => {
      sidebar.classList.add('-translate-x-full');
    });

    // Theme Toggle
    themeToggleBtn.addEventListener('click', () => {
      const currentTheme = document.documentElement.classList.contains('dark') ? 'dark' : 'light';
      const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
      setTheme(newTheme);
    });

    function setTheme(theme) {
      if (theme === 'dark') {
        document.documentElement.classList.add('dark');
        moonIcon.classList.add('hidden');
        sunIcon.classList.remove('hidden');
        themeText.textContent = 'Light Mode';
      } else {
        document.documentElement.classList.remove('dark');
        moonIcon.classList.remove('hidden');
        sunIcon.classList.add('hidden');
        themeText.textContent = 'Dark Mode';
      }
      localStorage.setItem('theme', theme);
    }

    // Search functionality
    searchInput.addEventListener('input', (e) => {
      const searchTerm = e.target.value.toLowerCase();
      const rows = document.querySelectorAll('#reportBody tr');
      
      rows.forEach(row => {
        const text = row.textContent.toLowerCase();
        if (text.includes(searchTerm)) {
          row.style.display = '';
        } else {
          row.style.display = 'none';
        }
      });
      
      // Update count
      const visibleRows = document.querySelectorAll('#reportBody tr:not([style*="display: none"])');
      issuesCountEl.textContent = visibleRows.length;
    });

    // Filter Buttons
    filterButtons.forEach(button => {
      button.addEventListener('click', () => {
        filterButtons.forEach(btn => btn.classList.remove('bg-gray-100', 'dark:bg-gray-700'));
        button.classList.add('bg-gray-100', 'dark:bg-gray-700');
        
        const filter = button.dataset.filter;
        const rows = document.querySelectorAll('#reportBody tr');
        
        rows.forEach(row => {
          if (filter === 'all') {
            row.style.display = '';
          } else if (filter === 'high' && row.classList.contains('bg-red-50')) {
            row.style.display = '';
          } else if (filter === 'medium' && row.classList.contains('bg-yellow-50')) {
            row.style.display = '';
          } else if (filter === 'low' && row.classList.contains('bg-blue-50')) {
            row.style.display = '';
          } else {
            row.style.display = 'none';
          }
        });
        
        // Update count and filter badge
        const visibleRows = document.querySelectorAll('#reportBody tr:not([style*="display: none"])');
        issuesCountEl.textContent = visibleRows.length;
        
        const filterBadge = document.getElementById('filter-badge');
        filterBadge.innerHTML = `
          <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="mr-1">
            <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"></polygon>
          </svg>
          ${filter === 'all' ? 'All Issues' : filter === 'high' ? 'High Severity' : filter === 'medium' ? 'Medium Severity' : 'Low Severity'}
        `;
      });
    });

    // Tab Buttons
    tabButtons.forEach(button => {
      button.addEventListener('click', () => {
        tabButtons.forEach(btn => {
          btn.classList.remove('border-blue-500', 'text-blue-600', 'dark:text-blue-400');
          btn.classList.add('border-transparent', 'text-gray-500');
        });
        
        button.classList.remove('border-transparent', 'text-gray-500');
        button.classList.add('border-blue-500', 'text-blue-600', 'dark:text-blue-400');
        
        const tabId = button.id.replace('tab-', '');
        
        tabContents.forEach(content => {
          content.classList.add('hidden');
        });
        
        document.getElementById(`tab-content-${tabId}`).classList.remove('hidden');
      });
    });