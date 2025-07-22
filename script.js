document.addEventListener('DOMContentLoaded', () => {
    
    async function initializeApp() {
        // 讀取索引檔，並增加穩健的錯誤處理
        let pagesManifest = [];
        try {
            const manifestResponse = await fetch('manifest.json');
            if (!manifestResponse.ok) throw new Error(`無法讀取 manifest.json: ${manifestResponse.statusText}`);
            pagesManifest = await manifestResponse.json();
        } catch (error) {
            console.error("初始化失敗:", error);
            const htmlOutput = document.getElementById('html-output');
            if (htmlOutput) {
                htmlOutput.innerHTML = `<p class="text-red-400 font-bold">錯誤：無法載入 manifest.json。請檢查檔案是否存在且格式正確。</p>`;
            }
            return; // 中斷執行
        }

        // 獲取所有需要的 DOM 元素
        const navLinksContainer = document.getElementById('nav-links-container');
        const searchInput = document.getElementById('search-input');
        const contentTitle = document.getElementById('content-title');
        const htmlOutput = document.getElementById('html-output');
        const lineHeightControls = document.getElementById('line-height-controls');
        const codeButtonContainer = document.getElementById('code-button-container');
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

        // --- 核心功能函式 ---

        // 渲染主內容
        async function renderContent(index) {
            if (index < 0 || index >= pagesManifest.length) {
                console.error(`無效的頁面索引: ${index}`);
                return;
            }
            const pageInfo = pagesManifest[index];
            
            currentPageIndex = index;
            contentTitle.textContent = pageInfo.title;

            try {
                const contentResponse = await fetch(pageInfo.file);
                if (!contentResponse.ok) throw new Error(`HTTP 錯誤! 狀態: ${contentResponse.status}`);
                const markdownContent = await contentResponse.text();
                
                const html = converter.makeHtml(markdownContent);
                htmlOutput.innerHTML = html;
                
                // 應用樣式並觸發淡入動畫
                htmlOutput.className = `w-full p-6 md:p-10 prose prose-invert max-w-none content-fade-in ${currentLeadingClass}`;
                void htmlOutput.offsetWidth; // 強制重繪以觸發動畫

                updateActiveNavLink(); // 更新導航連結的啟用狀態
                renderCodeButton(); // 更新「檢視程式碼」按鈕
            } catch (error) {
                htmlOutput.innerHTML = `<p class="text-red-400">無法載入內容檔案：${pageInfo.file}</p>`;
                console.error('Error fetching markdown:', error);
            }
        }

        // 渲染側邊欄導航連結 (只在需要時，如搜尋)
        function renderNavLinks(filter = '') {
            navLinksContainer.innerHTML = '';
            const lowerCaseFilter = filter.toLowerCase();

            pagesManifest.forEach((pageInfo, index) => {
                if (pageInfo.title.toLowerCase().includes(lowerCaseFilter)) {
                    const button = document.createElement('button');
                    button.textContent = pageInfo.title;
                    button.className = 'nav-link';
                    button.dataset.index = index; // 儲存索引值，方便之後使用
                    
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

        // 只更新導航連結的啟用狀態，而不是重新渲染整個列表
        function updateActiveNavLink() {
            const links = navLinksContainer.querySelectorAll('.nav-link');
            links.forEach(link => {
                // 使用 '==' 比較，因為 dataset.index 是字串
                link.classList.toggle('active', link.dataset.index == currentPageIndex);
            });
        }

        // 渲染「檢視程式碼」按鈕
        function renderCodeButton() {
            const pageInfo = pagesManifest[currentPageIndex];
            codeButtonContainer.innerHTML = ''; // 先清空

            if (pageInfo && pageInfo.codeFile) {
                const button = document.createElement('button');
                button.textContent = '檢視程式碼';
                button.className = 'code-btn';
                
                button.addEventListener('click', async () => {
                    try {
                        const codeResponse = await fetch(pageInfo.codeFile);
                        if (!codeResponse.ok) throw new Error(`HTTP 錯誤! 狀態: ${codeResponse.status}`);
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

        // --- 事件監聽器與初始化設定 ---

        // 集中設定所有事件監聽器
        function setupEventListeners() {
            lineHeightControls.querySelectorAll('.lh-btn').forEach(button => {
                button.addEventListener('click', () => {
                    currentLeadingClass = button.dataset.leading;
                    htmlOutput.classList.remove('leading-normal', 'leading-relaxed', 'leading-loose');
                    htmlOutput.classList.add(currentLeadingClass);
                    updateLhButtonStates();
                });
            });

            searchInput.addEventListener('input', (e) => {
                renderNavLinks(e.target.value);
            });

            modalCloseBtn.addEventListener('click', () => codeModal.classList.add('hidden'));
            codeModal.addEventListener('click', (event) => {
                if (event.target === codeModal) codeModal.classList.add('hidden');
            });
        }

        // 更新行距按鈕的啟用狀態
        function updateLhButtonStates() {
            lineHeightControls.querySelectorAll('.lh-btn').forEach(btn => {
                btn.classList.toggle('active', btn.dataset.leading === currentLeadingClass);
            });
        }

        // --- 程式進入點 ---
        setupEventListeners();
        updateLhButtonStates();
        renderNavLinks(); // 初始載入一次導航連結
        renderContent(currentPageIndex); // 初始載入第一頁的內容
    }

    initializeApp();
});
