# 供應商安全平台（SIEM/XDR）能力評估問題清單

**開場白**
「您好，我們正在評估貴公司的安全解決方案，希望深入了解其功能、彈性、成本和支援模式。以下是我們關心的一些核心問題，請您詳細說明。」

-----

### 第一部分：人工智能、機器學習與大型語言模型 (AI, ML & LLM)

1.  **AI 助理的整合模式**：貴平台的生成式 AI 功能（例如 AI 助理）是如何整合的？它是一個開箱即用的原生功能，還是提供一個框架讓客戶自行整合外部 LLM（例如 Ollama、OpenAI、Bedrock）？
2.  **AI 的實際應用場景**：除了自然語言查詢外，貴平台的 AI/LLM 功能具體支援哪些 SOC 分析師的日常工作流程？例如，它能否自動生成警報摘要、將第三方 SIEM 的查詢語法轉換為貴平台的格式，或是在調查過程中提供假設性分析？
3.  **機器學習模型的透明度與客製化**：平台使用了哪些具體的機器學習演算法（例如，隨機切割森林、線性回歸等）來進行異常偵測？客戶是否可以查看、微調這些模型的參數，或創建自己的客製化 ML 偵測模型？

-----

### 第二部分：用戶與實體行為分析 (UEBA) 及進階威脅偵測

1.  **UEBA 引擎的架構**：貴平台的 UEBA 功能是原生內建於核心引擎，還是作為一個需要額外購買和部署的附加模組/產品？
2.  **「攻擊發現」的技術實現**：報告中提及的「攻擊發現」(Attack Discovery) 或類似的威脅關聯功能，其技術底層是如何運作的？它如何自動將多個低信度的異常行為或警報，關聯成一個具有攻擊鏈上下文的高信度「威脅」或「事件」？
3.  **核心安全能力**：針對特定的攻擊，例如勒索軟體 (Ransomware) 或內部威脅 (Insider Threat)，平台有哪些專門的偵測和應對機制？

-----

### 第三部分：靈活性、客製化與數據導入

1.  **客製化數據源的導入**：當面對一個沒有預建整合 (pre-built integration) 的客製化應用日誌時，將其數據導入並正規化 (normalize) 到通用結構 (schema) 的完整流程是怎樣的？
2.  **導入流程的自動化能力**：貴平台是否提供類似 Elastic「Automatic Import」的 AI 驅動功能，可以透過分析日誌樣本來自動生成解析規則和數據映射的 pipeline？如果沒有，是否有其他工具或方法來簡化這個過程？
3.  **架構開放性**：平台的架構是否開放？是否提供豐富的 API，以便我們進行二次開發或與內部系統整合？

-----

### 第四部分：安全編排、自動化與回應 (SOAR)

1.  **LLM 整合與應用**：貴公司的 SOAR 平台是否整合了大型語言模型 (LLM)？它具體應用在哪些場景來輔助資安分析師（例如：自動生成事件摘要、輔助生成劇本、提供應對建議）？
2.  **易用性**：我們能否在沒有程式設計背景的情況下，透過拖拉點選的方式建立或修改自動化劇本 (Playbook)？
3.  **投資回報率 (ROI) 衡量**：平台如何幫助我們衡量自動化的投資回報率？例如，它能否具體追蹤「平均應對時間 (MTTR)」的改善、或因自動化而節省的人力工時？

-----

### 第五部分：第三方整合 (以 Palo Alto Cortex XSOAR 為例)

1.  **官方支援**：貴公司是否在 Cortex XSOAR Marketplace 上提供由官方開發和維護的內容包 (Content Pack)？
2.  **數據雙向同步**：與 XSOAR 的整合是否支援雙向通訊？除了將警報從 SIEM 發送到 XSOAR，是否可以透過 XSOAR 的劇本更新 SIEM 中的警報狀態、指派負責人或添加備註？
3.  **事件豐富化深度**：整合是否支援自動化地用 SIEM 內的數據來豐富 XSOAR 中的事件？例如，能否自動查詢並附加上相關的資產信息、用戶身份、或原始日誌？
4.  **事故鏡像 (Incident Mirroring)**：整合是否支援在 SIEM 和 XSOAR 之間實現完整的「事故鏡像」，確保兩邊的狀態、評論和負責人等資訊能保持同步更新？

-----

### 第六部分：誤報管理與調校

1.  **誤報抑制機制**：除了基於時間的警報節流 (throttling)，平台還提供哪些機制來抑制已知的誤報？例如，是否支援基於特定欄位組合（如特定用戶在特定主機上的特定操作）的動態抑制規則？
2.  **調校的靈活性與權限**：警報規則的調校工作是否必須由管理員完成？還是說，平台提供了一個框架，允許第一線的分析師在無需後端權限的情況下，安全地對規則進行微調或暫時抑制？
3.  **基於機器學習的調校**：平台是否利用機器學習來輔助減少誤報？例如，透過分析分析師與警報的互動行為，來自動建議調整規則的閾值或條件？

-----

### 第七部分：架構、授權與總體擁有成本 (TCO)

1.  **核心授權模式**：貴平台的授權模式主要是基於哪些指標計算的？（例如，每日數據導入量 (GB/day)、節點資源使用量、Agent 數量，還是其他指標？）
2.  **功能與授權等級的關聯**：我們所關注的核心進階功能（如 AI 助理、UEBA、ML 異常偵測），是包含在標準授權中，還是需要購買特定的高階訂閱方案或獨立的附加產品？
3.  **隱性成本分析**：除了軟體授權費用，根據貴公司對典型企業部署的觀察，我們還應該將哪些「隱性成本」納入 TCO 考量？（例如：部署和維護所需的人力資源技能與數量、底層硬件/雲端基礎設施的規格要求、客製化整合的開發成本等。）

-----

**總結與建議**
「非常感謝您的詳細解答。最後，我們希望能安排一次產品的現場演示 (Live Demo)，並在演示中展示如何應對我們提出的一兩個具體安全場景。同時，我們也希望有機會進行概念驗證 (PoC) 測試。」

\<br\>

-----

\<br\>

# Vendor Assessment Questionnaire for Security Platforms (SIEM/XDR) v2

**Opening Statement**
"Hello, we are currently evaluating your security solution and would like to gain a deeper understanding of its capabilities, flexibility, and cost structure. Please provide detailed answers to the following questions."

-----

### Part 1: AI, Machine Learning & Large Language Models (AI, ML & LLM)

1.  **AI Assistant Integration Model**: How is your platform's generative AI functionality (e.g., AI Assistant) integrated? Is it a native, out-of-the-box feature, or does it provide a framework for customers to integrate their own external LLMs (e.g., Ollama, OpenAI, Bedrock)?
2.  **Practical AI Use Cases**: Beyond natural language querying, what specific daily workflows for SOC analysts does your AI/LLM functionality support? For example, can it automatically generate alert summaries, translate query syntax from third-party SIEMs into your platform's format, or provide hypothesis analysis during an investigation?
3.  **ML Model Transparency & Customization**: What specific machine learning algorithms (e.g., Isolation Forest, Linear Regression) does the platform use for anomaly detection? Can customers view and fine-tune the parameters of these models, or create their own custom ML detection models?

-----

### Part 2: User and Entity Behavior Analytics (UEBA) & Advanced Threat Detection

1.  **UEBA Engine Architecture**: Is the UEBA functionality natively built into the core engine, or is it an add-on module/product that requires separate purchase and deployment?
2.  **"Attack Discovery" Technology**: How does the underlying technology for "Attack Discovery" or similar threat correlation features work? How does it automatically correlate multiple low-fidelity anomalies or alerts into a single high-fidelity "threat" or "incident" with attack chain context?
3.  **Core Security Capabilities**: What specific detection and response mechanisms does the platform have for advanced threats like ransomware or insider threats?

-----

### Part 3: Flexibility, Customization & Data Ingestion

1.  **Custom Data Source Onboarding**: What is the complete process for onboarding and normalizing data from a custom application log that has no pre-built integration into your common schema?
2.  **Automated Ingestion Capabilities**: Does your platform offer an AI-driven feature similar to Elastic's "Automatic Import" that can auto-generate parsing rules and data mapping pipelines by analyzing log samples? If not, what other tools or methods are available to simplify this process?
3.  **Architectural Openness**: How open is the platform's architecture? Do you provide a comprehensive set of APIs for custom development and integration with our in-house systems?

-----

### Part 4: Security Orchestration, Automation, & Response (SOAR)

1.  **LLM Integration & Application**: Does your SOAR platform integrate with Large Language Models (LLMs)? In which specific scenarios is it applied to assist security analysts (e.g., automated incident summarization, playbook generation assistance, response recommendations)?
2.  **Ease of Use**: Can our team create or modify automation playbooks using a low-code/no-code interface, or is a programming background required?
3.  **Return on Investment (ROI) Measurement**: How does the platform help us measure the ROI of automation? For instance, can it specifically track metrics like improvements in Mean Time to Respond (MTTR) or the man-hours saved through automated processes?

-----

### Part 5: 3rd Party Integration (Example: Palo Alto Cortex XSOAR)

1.  **Official Support**: Do you provide an officially developed and maintained Content Pack on the Cortex XSOAR Marketplace?
2.  **Bidirectional Data Sync**: Does the integration support bidirectional communication? Besides sending alerts from your SIEM to XSOAR, can XSOAR playbooks update alert status, assignees, or add comments back into your SIEM?
3.  **Incident Enrichment Depth**: Does the integration support automated enrichment of incidents in XSOAR with data from your SIEM? For example, can it automatically query and attach relevant asset information, user identity, or raw logs?
4.  **Incident Mirroring**: Does the integration support full "incident mirroring" between your SIEM and XSOAR, ensuring that status, comments, and assignees remain synchronized on both platforms?

-----

### Part 6: False Positive Management & Tuning

1.  **Suppression Mechanisms**: Beyond time-based alert throttling, what other mechanisms does the platform provide to suppress known false positives? For example, does it support dynamic suppression rules based on a combination of specific fields (e.g., a specific user performing a specific action on a specific host)?
2.  **Tuning Flexibility & Permissions**: Must alert rule tuning be performed by an administrator? Or does the platform provide a framework that allows frontline analysts to safely fine-tune or temporarily suppress rules without backend permissions?
3.  **ML-Assisted Tuning**: Does the platform leverage machine learning to help reduce false positives? For example, by analyzing analyst interactions with alerts to automatically suggest adjustments to rule thresholds or conditions?

-----

### Part 7: Architecture, Licensing & Total Cost of Ownership (TCO)

1.  **Core Licensing Model**: What are the primary metrics used to calculate your platform's license cost? (e.g., daily data ingest in GB/day, node resource consumption, number of agents, or other metrics?)
2.  **Feature-to-License-Tier Mapping**: Are the core advanced features we are interested in (e.g., AI Assistant, UEBA, ML Anomaly Detection) included in the standard license, or do they require specific high-tier subscriptions or separate add-on products?
3.  **Hidden Cost Analysis**: Beyond software licensing fees, what "hidden costs" should we factor into our TCO consideration, based on your observation of typical enterprise deployments? (e.g., required skill sets and headcount for deployment and maintenance, underlying hardware/cloud infrastructure specifications, custom integration development costs, etc.)

-----

**Closing Statement & Next Steps**
"Thank you for your detailed responses. As a next step, we would like to schedule a live demonstration where you can walk us through one or two of our specific security use cases. We would also like to discuss the possibility of a Proof of Concept (PoC) trial."
