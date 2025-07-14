document.addEventListener('DOMContentLoaded', () => {
    
    async function initializeApp() {
        const manifestResponse = await fetch('manifest.json');
        const pagesManifest = await manifestResponse.json();

        const tabsContainer = document.getElementById('tabs-container');
        const htmlOutput = document.getElementById('html-output');
        const lineHeightControls = document.getElementById('line-height-controls');
        
        let currentPageIndex = 0;
        let currentLeadingClass = 'leading-relaxed';

        const converter = new showdown.Converter({
            tables: true,
            strikethrough: true,
            tasklists: true,
            simpleLineBreaks: true,
        });

        async function renderContent(index) {
            const pageInfo = pagesManifest[index];
            if (!pageInfo) return;

            try {
                const contentResponse = await fetch(pageInfo.file);
                if (!contentResponse.ok) {
                    throw new Error(`HTTP error! status: ${contentResponse.status}`);
                }
                const markdownContent = await contentResponse.text();
                
                const html = converter.makeHtml(markdownContent);
                htmlOutput.innerHTML = html;

                htmlOutput.classList.remove('leading-normal', 'leading-relaxed', 'leading-loose');
                htmlOutput.classList.add(currentLeadingClass);
                
                htmlOutput.classList.remove('content-fade-in');
                void htmlOutput.offsetWidth;
                htmlOutput.classList.add('content-fade-in');
            } catch (error) {
                htmlOutput.innerHTML = `<p class="text-red-400">無法載入內容檔案：${pageInfo.file}</p><p class="text-gray-400 text-sm">請檢查檔案路徑是否正確，以及檔案是否已上傳至伺服器。</p>`;
                console.error('Error fetching markdown:', error);
            }
        }

        function renderTabs() {
            tabsContainer.innerHTML = '';
            pagesManifest.forEach((pageInfo, index) => {
                const isActive = index === currentPageIndex;
                const button = document.createElement('button');
                button.textContent = pageInfo.title;
                
                button.className = `py-3 px-4 text-sm font-medium border-b-2 transition-colors duration-200 ease-in-out focus:outline-none ${
                    isActive 
                    ? 'border-blue-400 text-white' 
                    : 'border-transparent text-gray-400 hover:text-gray-200'
                }`;
                
                button.addEventListener('click', () => {
                    currentPageIndex = index;
                    renderTabs();
                    renderContent(index);
                });
                
                tabsContainer.appendChild(button);
            });
        }
        
        function updateLhButtonStates() {
            lineHeightControls.querySelectorAll('.lh-btn').forEach(btn => {
                if (btn.dataset.leading === currentLeadingClass) {
                    btn.classList.add('bg-blue-500', 'text-white', 'active-lh');
                } else {
                    btn.classList.remove('bg-blue-500', 'text-white', 'active-lh');
                }
            });
        }
        
        lineHeightControls.querySelectorAll('.lh-btn').forEach(button => {
            button.addEventListener('click', () => {
                htmlOutput.classList.remove('leading-normal', 'leading-relaxed', 'leading-loose');
                currentLeadingClass = button.dataset.leading;
                htmlOutput.classList.add(currentLeadingClass);
                updateLhButtonStates();
            });
        });

        updateLhButtonStates();
        renderTabs();
        renderContent(currentPageIndex);
    }

    initializeApp();
});
