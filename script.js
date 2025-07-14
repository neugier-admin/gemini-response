// 等待整個 HTML 文件載入完成後才執行
document.addEventListener('DOMContentLoaded', () => {
    
    // --- 主要的初始化函式 ---
    async function initializeApp() {
        // 使用 fetch API 讀取 JSON 檔案
        // await 會暫停函式的執行，直到 Promise 被解析 (即檔案讀取完成)
        const response = await fetch('content.json');
        const markdownPages = await response.json();

        // 獲取所有需要的 DOM 元素
        const tabsContainer = document.getElementById('tabs-container');
        const htmlOutput = document.getElementById('html-output');
        const lineHeightControls = document.getElementById('line-height-controls');
        
        let currentPageIndex = 0;
        let currentLeadingClass = 'leading-relaxed'; // 預設行距

        // 初始化 Showdown 轉換器
        const converter = new showdown.Converter({
            tables: true,
            strikethrough: true,
            tasklists: true,
            simpleLineBreaks: true,
        });

        // --- 所有功能函式 ---

        // 渲染內容的函式
        function renderContent(index) {
            const page = markdownPages[index];
            if (!page) return;

            const html = converter.makeHtml(page.content.trim());
            htmlOutput.innerHTML = html;

            // 應用當前選定的行距
            htmlOutput.classList.remove('leading-normal', 'leading-relaxed', 'leading-loose');
            htmlOutput.classList.add(currentLeadingClass);
            
            // 添加動畫效果
            htmlOutput.classList.remove('content-fade-in');
            void htmlOutput.offsetWidth; // 觸發重繪
            htmlOutput.classList.add('content-fade-in');
        }

        // 渲染分頁按鈕的函式
        function renderTabs() {
            tabsContainer.innerHTML = ''; // 清空現有按鈕
            markdownPages.forEach((page, index) => {
                const isActive = index === currentPageIndex;
                const button = document.createElement('button');
                button.textContent = page.title;
                
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
        
        // 更新行距按鈕狀態的函式
        function updateLhButtonStates() {
            lineHeightControls.querySelectorAll('.lh-btn').forEach(btn => {
                if (btn.dataset.leading === currentLeadingClass) {
                    btn.classList.add('bg-blue-500', 'text-white', 'active-lh');
                } else {
                    btn.classList.remove('bg-blue-500', 'text-white', 'active-lh');
                }
            });
        }
        
        // 為行距按鈕綁定事件
        lineHeightControls.querySelectorAll('.lh-btn').forEach(button => {
            button.addEventListener('click', () => {
                htmlOutput.classList.remove('leading-normal', 'leading-relaxed', 'leading-loose');
                currentLeadingClass = button.dataset.leading;
                htmlOutput.classList.add(currentLeadingClass);
                updateLhButtonStates();
            });
        });

        // --- 程式進入點 ---
        updateLhButtonStates(); // 初始化行距按鈕狀態
        renderTabs();
        renderContent(currentPageIndex);
    }

    // 呼叫初始化函式
    initializeApp();
});
