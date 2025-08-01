

### Part 1: AI Assistant & Large Language Models (LLM)

1.  **AI Integration Model**: Is the platform's AI assistant a native, out-of-the-box feature, or does it require us to integrate our own external LLMs (e.g., OpenAI)?
2.  **AI Application Scenarios**: Beyond natural language queries, what specific daily tasks for a SOC analyst can the AI assist with? For example, can it automatically summarize alerts, translate query syntaxes from other platforms, or provide threat analysis suggestions during an investigation?

---
### Part 2: User and Entity Behavior Analytics (UEBA) & Advanced Threat Detection

1.  **Machine Learning Models**: What specific machine learning models does the UEBA use? Can we view, tune, or create custom models?
2.  **UEBA Architecture**: Is the UEBA functionality natively built into the core engine, or is it an add-on module that requires separate purchase?
3.  **Attack Chain Correlation**: What is the underlying technology of the "Attack Discovery" feature? How does it automatically correlate multiple low-fidelity alerts into a single, high-fidelity attack incident with context?
4.  **Specific Threat Detection**: What dedicated detection and response mechanisms are in place for threats like Ransomware and Insider Threats?
5.  **False Positive Suppression**: Besides basic alert throttling, what advanced suppression methods are available? (e.g., can we create dynamic suppression rules based on a combination of a specific user, on a specific host, performing a specific action?)
6.  **Tuning Permissions**: Are administrator privileges required to tune alert rules? Or can frontline analysts safely fine-tune or temporarily suppress rules within a controlled framework?
7.  **AI-Assisted Tuning**: Does the platform use machine learning to help reduce false positives by analyzing analyst interactions and suggesting rule adjustments?

---
### Part 3: Flexibility, Customization & Data Ingestion

1.  **Custom Log Ingestion**: What is the end-to-end process for ingesting and normalizing a custom application log that doesn't have a pre-built template?
2.  **Automated Ingestion**: Does the platform have an AI-driven feature to automatically generate parsing rules by analyzing log samples?
3.  **Architecture Openness**: Is the platform's architecture open? Does it provide rich APIs for custom development or integration with our internal systems?

---
### Part 4: Security Orchestration, Automation and Response (SOAR)

1.  **SOAR & LLM Integration**: Is LLM integrated into the SOAR platform? In what specific scenarios does it assist analysts (e.g., auto-generating incident summaries, assisting with playbook creation, providing response recommendations)?
2.  **Ease of Use**: Can analysts without a programming background create or modify automation playbooks using a drag-and-drop interface?
3.  **ROI Measurement**: How does the platform help us measure the ROI of automation? For instance, can it track improvements in Mean Time to Respond (MTTR) or quantify man-hours saved?
4.  **Cortex XSOAR Integration**: Do you provide an officially developed and maintained content pack on the Cortex XSOAR Marketplace?
5.  **Bi-directional Sync**: Is the integration with XSOAR bi-directional? Can playbooks in XSOAR update alert status or assignees back in the SIEM?
6.  **Incident Enrichment**: Does the integration support automated incident enrichment in XSOAR using data from the SIEM (e.g., asset info, user identity, raw logs)?
7.  **Incident Mirroring**: Does the integration support full "incident mirroring" to ensure that status, comments, and assignees are kept in sync between the SIEM and XSOAR?
