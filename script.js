document.addEventListener('DOMContentLoaded', () => {
    
    async function initializeApp() {
        // 讀取索引檔
        const manifestResponse = await fetch('manifest.json');
        const pagesManifest = await manifestResponse.json();

        // 獲取所有需要的 DOM 元素
        const tabsContainer = document.getElementById('tabs-container');
        const htmlOutput = document.getElementById('html-output');
        const lineHeightControls = document.getElementById('line-height-controls');
        const codeButtonContainer = document.getElementById('code-button-container');
        
        // Modal 相關元素
        const codeModal = document.getElementById('code-modal');
        const modalTitle = document.getElementById('modal-title');
        const modalCodeContent = document.getElementById('modal-code-content');
        const modalCloseBtn = document.getElementById('modal-close-btn');
        
        // 狀態變數
        let currentPageIndex = 0;
        let currentLeadingClass = 'leading-relaxed';

        // 初始化 Markdown 轉換器
        const converter = new showdown.Converter({
            tables: true,
            strikethrough: true,
            tasklists: true,
            simpleLineBreaks: true,
        });

        // 渲染 Markdown 內容
        async function renderContent(index) {
            const pageInfo = pagesManifest[index];
            if (!pageInfo) return;

            try {
                const contentResponse = await fetch(pageInfo.file);
                if (!contentResponse.ok) throw new Error(`HTTP error! status: ${contentResponse.status}`);
                const markdownContent = await contentResponse.text();
                
                const html = converter.makeHtml(markdownContent);
                htmlOutput.innerHTML = html;

                htmlOutput.classList.remove('leading-normal', 'leading-relaxed', 'leading-loose');
                htmlOutput.classList.add(currentLeadingClass);
                
                htmlOutput.classList.remove('content-fade-in');
                void htmlOutput.offsetWidth;
                htmlOutput.classList.add('content-fade-in');
            } catch (error) {
                htmlOutput.innerHTML = `<p class="text-red-400">無法載入內容檔案：${pageInfo.file}</p>`;
                console.error('Error fetching markdown:', error);
            }
        }

        // 根據頁面資訊，渲染「檢視程式碼」按鈕
        function renderCodeButton(index) {
            const pageInfo = pagesManifest[index];
            codeButtonContainer.innerHTML = ''; // 清空容器

            if (pageInfo.codeFile) {
                const button = document.createElement('button');
                button.textContent = '檢視程式碼';
                button.className = 'code-btn';
                
                button.addEventListener('click', async () => {
                    try {
                        const codeResponse = await fetch(pageInfo.codeFile);
                        if (!codeResponse.ok) throw new Error(`HTTP error! status: ${codeResponse.status}`);
                        const codeText = await codeResponse.text();
                        
                        modalTitle.textContent = `檢視程式碼：${pageInfo.codeFile}`;
                        modalCodeContent.textContent = codeText;
                        codeModal.classList.remove('hidden');
                    } catch (error) {
                        alert(`無法載入程式碼檔案：${pageInfo.codeFile}`);
                        console.error('Error fetching code file:', error);
                    }
                });
                
                codeButtonContainer.appendChild(button);
            }
        }

        // 渲染所有分頁標籤
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
                    renderCodeButton(index); // 切換分頁時更新程式碼按鈕
                });
                
                tabsContainer.appendChild(button);
            });
        }
        
        // 更新行距按鈕的樣式
        function updateLhButtonStates() {
            lineHeightControls.querySelectorAll('.lh-btn').forEach(btn => {
                btn.classList.toggle('bg-blue-500', btn.dataset.leading === currentLeadingClass);
                btn.classList.toggle('text-white', btn.dataset.leading === currentLeadingClass);
                btn.classList.toggle('active-lh', btn.dataset.leading === currentLeadingClass);
            });
        }
        
        // 綁定行距按鈕事件
        lineHeightControls.querySelectorAll('.lh-btn').forEach(button => {
            button.addEventListener('click', () => {
                htmlOutput.classList.remove('leading-normal', 'leading-relaxed', 'leading-loose');
                currentLeadingClass = button.dataset.leading;
                htmlOutput.classList.add(currentLeadingClass);
                updateLhButtonStates();
            });
        });

        // 關閉 Modal 的邏輯
        function closeModal() {
            codeModal.classList.add('hidden');
        }
        modalCloseBtn.addEventListener('click', closeModal);
        codeModal.addEventListener('click', (event) => {
            if (event.target === codeModal) { // 僅當點擊背景時關閉
                closeModal();
            }
        });

        // --- 程式進入點 ---
        updateLhButtonStates();
        renderTabs();
        renderContent(currentPageIndex);
        renderCodeButton(currentPageIndex); // 初始載入時也要檢查程式碼按鈕
    }

    initializeApp();
});
