document.addEventListener('DOMContentLoaded', () => {
    
    async function initializeApp() {
        // 讀取索引檔，並增加錯誤處理
        let pagesManifest = [];
        try {
            const manifestResponse = await fetch('manifest.json');
            if (!manifestResponse.ok) throw new Error(`無法讀取 manifest.json: ${manifestResponse.statusText}`);
            pagesManifest = await manifestResponse.json();
        } catch (error) {
            console.error("初始化失敗:", error);
            const htmlOutput = document.getElementById('html-output');
            htmlOutput.innerHTML = `<p class="text-red-400 font-bold">錯誤：無法載入 manifest.json。請檢查檔案是否存在且格式正確。</p>`;
            return; // 中斷執行
        }

        // 獲取所有需要的 DOM 元素
        const navLinksContainer = document.getElementById('nav-links-container');
        const searchInput = document.getElementById('search-input');
        const contentTitle = document.getElementById('content-title');
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

            currentPageIndex = index;
            contentTitle.textContent = pageInfo.title;

            try {
                const contentResponse = await fetch(pageInfo.file);
                if (!contentResponse.ok) throw new Error(`HTTP error! status: ${contentResponse.status}`);
                const markdownContent = await contentResponse.text();
                
                const html = converter.makeHtml(markdownContent);
                htmlOutput.innerHTML = html;

                htmlOutput.classList.remove('leading-normal', 'leading-relaxed', 'leading-loose');
                htmlOutput.classList.add(currentLeadingClass);
                
                // 觸發淡入動畫
                htmlOutput.classList.remove('content-fade-in');
                void htmlOutput.offsetWidth; // 強制重繪
                htmlOutput.classList.add('content-fade-in');

                // 更新相關 UI
                renderNavLinks(searchInput.value);
                renderCodeButton();
            } catch (error) {
                htmlOutput.innerHTML = `<p class="text-red-400">無法載入內容檔案：${pageInfo.file}</p>`;
                console.error('Error fetching markdown:', error);
            }
        }

        // 根據頁面資訊，渲染「檢視程式碼」按鈕
        function renderCodeButton() {
            const pageInfo = pagesManifest[currentPageIndex];
            codeButtonContainer.innerHTML = ''; // 清空容器

            if (pageInfo && pageInfo.codeFile) {
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

        // 渲染側邊欄導航連結
        function renderNavLinks(filter = '') {
            navLinksContainer.innerHTML = '';
            const lowerCaseFilter = filter.toLowerCase();

            pagesManifest.forEach((pageInfo, index) => {
                if (pageInfo.title.toLowerCase().includes(lowerCaseFilter)) {
                    const button = document.createElement('button');
                    button.textContent = pageInfo.title;
                    button.className = 'nav-link';
                    
                    if (index === currentPageIndex) {
                        button.classList.add('active');
                    }
                    
                    button.addEventListener('click', () => {
                        renderContent(index);
                    });
                    
                    navLinksContainer.appendChild(button);
                }
            });
        }
        
        // 更新行距按鈕的樣式
        function updateLhButtonStates() {
            lineHeightControls.querySelectorAll('.lh-btn').forEach(btn => {
                btn.classList.toggle('active', btn.dataset.leading === currentLeadingClass);
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

        // 綁定搜尋框事件
        searchInput.addEventListener('input', (e) => {
            renderNavLinks(e.target.value);
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
        renderNavLinks();
        renderContent(currentPageIndex);
    }

    initializeApp();
});
