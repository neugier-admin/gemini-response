好的，完全無問題。我哋將每一個步驟拆解到最詳細，包含具體嘅點擊位置同埋欄位填寫建議。

假設你已經準備好登入 Tenable 同 CyberArk PVWA 嘅管理員帳戶。

---

### 第一步：準備證書 (Certificate Preparation) - 極詳細版

呢一步嘅目標係產生兩個檔案：一個係俾 Tenable 用嘅 `.pfx`（包含私鑰），另一個係俾 CyberArk 識別用嘅 `.cer`（只有公鑰）。我哋以最常見嘅 **Microsoft Certificate Authority (CA)** 為例。

#### 1.1 透過網頁申請證書

1.  **打開瀏覽器**，前往你公司內部 Microsoft CA 嘅網頁伺服器。網址通常係：
    `http://<your-ca-server-ip-or-hostname>/certsrv/`
2.  **登入** 你的網域帳戶。
3.  在主頁面，點擊 **"Request a certificate"**。
4.  下一頁，點擊 **"advanced certificate request"**。
5.  在 "Certificate Template" 下拉菜單中，選擇一個允許 **"Client Authentication"** 且允許 **私鑰匯出** 的模板。通常模板名稱會包含 "User" 或 "Computer" 或 "Web Server"。如果你唔確定，請諮詢你嘅 PKI 管理員。
6.  **填寫證書申請資料**：
    * **Name:** 輸入一個有意義嘅名稱，呢個會成為證書嘅 **Common Name (CN)**。**呢個 CN 非常重要，CyberArk 會用佢嚟認證**。
        * *範例：* `tenable.scanner.prod`
    * **Key Options:**
        * 勾選 **"Mark key as exportable"**。**呢個係必須步驟**，如果唔勾選，你將無法匯出 `.pfx` 檔案。
        * Key Size 建議選擇 `2048` 或更高。
7.  點擊 **"Submit"** 提交申請。如果設定正確，CA 會簽發證書。
8.  點擊 **"Install this certificate"** 將證書安裝到你目前電腦嘅用戶證書庫。

#### 1.2 匯出包含私鑰的證書 (.pfx)

1.  喺 Windows，按 `Win + R`，輸入 `certmgr.msc` 並按 Enter，打開證書管理員。
2.  喺左邊導覽窗格，展開 `Personal` -> `Certificates`。
3.  喺右邊清單，搵到你啱啱申請嘅證書（根據 `Issued To` 欄位嘅 CN 識別）。
4.  右鍵點擊該證書 -> `All Tasks` -> `Export...`。
5.  **Certificate Export Wizard** 會啟動：
    * 第一頁，點擊 `Next`。
    * **Export Private Key:** 選擇 **"Yes, export the private key"**。點擊 `Next`。
    * **Export File Format:** 保持預設選項 (`Personal Information Exchange - PKCS #12 (.PFX)`)，並勾選 `Include all certificates in the certification path if possible`。點擊 `Next`。
    * **Security:** 勾選 `Password`，然後 **設定一個強度高嘅密碼**。**請務必記低呢個密碼**，因為喺 Tenable 設定時需要輸入。點擊 `Next`。
    * **File to Export:** 點擊 `Browse...`，選擇一個安全嘅位置儲存，並將檔案命名為例如 `Tenable_Client_Key.pfx`。點擊 `Next`。
    * 最後一頁，確認設定無誤後，點擊 `Finish`。你會收到「The export was successful.」嘅訊息。

#### 1.3 匯出只有公鑰的證書 (.cer)

1.  重複 **1.2** 嘅步驟 1 到 4。
2.  喺 **Certificate Export Wizard** 啟動後：
    * 第一頁，點擊 `Next`。
    * **Export Private Key:** 今次選擇 **"No, do not export the private key"**。點擊 `Next`。
    * **Export File Format:** 選擇 **"Base-64 encoded X.509 (.CER)"**。點擊 `Next`。
    * **File to Export:** 點擊 `Browse...`，將檔案命名為例如 `Tenable_Client_PublicKey.cer`。點擊 `Next`。
    * 點擊 `Finish` 完成匯出。

**到此，你手上應該有兩個檔案：`Tenable_Client_Key.pfx` 和 `Tenable_Client_PublicKey.cer`。第一步完成。**

---

### 第二步：設定 CyberArk (CyberArk Configuration) - 極詳細版

呢一步嘅目標係話俾 CyberArk 知：「有一個叫做『Tenable』嘅應用程式，佢會用特定 CN 嘅證書嚟同我溝通，請你信任佢，並俾佢攞密碼。」

#### 2.1 建立應用程式 ID (Application ID)

1.  用有管理權限嘅帳戶登入 **PVWA**。
2.  喺左邊菜單，點擊 **"Applications"** 圖標。
3.  喺右上角，點擊藍色嘅 **"Add Application"** 按鈕。
4.  **填寫基本資料**：
    * **Application Name:** 用一個標準化、有意義嘅名。
        * *範例：* `App-TenableScanner-Cert`
    * **Description:** 詳細描述用途。
        * *範例：* `Application ID for Tenable.sc scanners using certificate-based authentication.`
    * **Business owner information:** 根據公司政策填寫。
5.  點擊 **"Add"**。應用程式 ID 建立完成，你會被導向到佢嘅詳細設定頁面。

#### 2.2 設定認證方式 (Authentication Method)

1.  喺 App ID 嘅詳細頁面，你會見到幾個分頁 (`Details`, `Authentication`, `Allowed Machines` 等)。點擊 **"Authentication"** 分頁。
2.  你會見到唔同嘅認證方法。我哋關心嘅係 **"Certificate"**。
3.  喺 **"Certificate"** 認證方法下方，你會睇到一個屬性列表。我哋要設定嘅係：
    * **`Restrict to specific common name(s)`**: 點擊右邊嘅 `Add`。喺彈出嘅對話框中，輸入你喺第一步證書上設定嘅 **Common Name (CN)**。
        * *範例：* `tenable.scanner.prod`
    * **`Allow internal scripts to request credentials for this application ID`**: 確保呢個選項係 `Yes`。
4.  點擊頁面右下角嘅 **"Save"** 按鈕保存設定。

#### 2.3 設定允許的主機 (Allowed Machines)

1.  導航到 **"Allowed Machines"** 分頁。呢個係一個額外嘅安全層，限制邊啲機器可以用呢個 App ID。
2.  點擊 **"Add"**。
3.  喺 `Address` 欄位，輸入你 Tenable Scanner 嘅 IP 地址、主機名或 IP 範圍。建議用 IP 地址最準確。
4.  點擊 **"Save"**。

#### 2.4 授權存取金庫 (Grant Safe Permissions)

1.  喺左邊菜單，點擊 **"Policies"** -> **"Safes"**。
2.  搵到存放你掃描用帳戶嘅 Safe，點擊進入。
3.  喺 Safe 嘅詳細頁面，點擊左邊嘅 **"Members"** 部分。
4.  點擊右上角嘅 **"Add Member"** 按鈕。
5.  喺搜尋框，輸入你喺 **2.1** 建立嘅 App ID 名稱 (`App-TenableScanner-Cert`)，然後點擊搜尋。
6.  喺搜尋結果中選中你嘅 App ID，然後點擊 `Next`。
7.  **最重要嘅一步：分配權限**。勾選以下權限：
    * **`Retrieve accounts`** (必須)：允許 App ID 提取密碼。
    * **`List accounts`** (建議)：允許 App ID 查看 Safe 中嘅帳戶列表。
    * `View Safe Members` (可選，方便排錯)。
8.  點擊 **"Add"**。

**至此，CyberArk 已設定完成。佢已經準備好接受嚟自 Tenable 嘅證書認證請求。**

---

### 第三步：設定 Tenable (Tenable.sc / Tenable.io) - 極詳細版

呢一步嘅目標係喺 Tenable 建立一個新嘅 CyberArk 憑證設定，並上傳 `.pfx` 證書。

1.  **登入 Tenable.sc 或 Tenable.io**。
2.  **導航至憑證管理**：
    * **Tenable.sc:** `Scans` -> `Credentials`。
    * **Tenable.io:** `Settings` -> `Credentials`。
3.  點擊右上角嘅 **"+ Add Credential"** 按鈕。
4.  喺左邊嘅憑證類型清單，向下滾動到 **"Privilege Escalation"** 類別，然後選擇 **"CyberArk"**。
5.  **詳細填寫每一個欄位**：
    * **Name:** 俾佢一個清晰嘅名，以便喺掃描策略中選用。
        * *範例：* `CyberArk Credential (Cert Auth)`
    * **CyberArk Provider URL (CCP URL):** 填寫 CyberArk CCP 嘅完整 API 網址。
        * *格式：* `https://<ccp-server-hostname>/AIMWebService/api/Accounts`
        * *Pro-Tip:* 先喺瀏覽器試下開呢個網址，睇下會唔會見到 XML 或 JSON 嘅回應，以確認網址同網絡連線正確。
    * **Application ID:** 輸入你喺 CyberArk **2.1** 建立嘅 **App ID 名稱**。必須完全一致。
        * *範例：* `App-TenableScanner-Cert`
    * **Authentication Method:** **呢個係最關鍵嘅設定**。點擊下拉菜單，將預設嘅 `Username/Password` 改為 **`Client Certificate`**。
    * **Client Certificate:** 點擊 **"Choose File"**，然後上傳你喺 **1.2** 產生嘅 **`.pfx`** 檔案 (`Tenable_Client_Key.pfx`)。
    * **Certificate Password:** 輸入你喺匯出 `.pfx` 檔案時所設定嘅密碼。
    * **CA Certificate (Optional but Highly Recommended):** 如果你嘅 CCP 伺服器用緊內部 CA 簽發嘅 SSL 證書，Tenable 系統可能唔信任佢。你需要喺度上傳你公司嘅 Root CA 公鑰證書 (`.cer` 檔)，以解決 SSL/TLS 信任問題。
6.  仔細檢查所有資料無誤後，點擊右下角嘅 **"Save"** 按鈕。

---

### 第四步：驗證與除錯 (Verification & Debugging)

設定完成唔代表大功告成，必須驗證。

1.  **建立一個測試掃描策略**：
    * 建立一個新嘅 `Basic Network Scan` 策略。
    * **Targets:** 只填寫一部你確定可以登入嘅伺服器 IP。
    * **Credentials:** 選擇目標伺服器對應嘅憑證 (例如 `Windows` 或 `SSH`)。
    * **Privilege Escalation:** 喺下拉菜單中，選擇你喺第三步建立嘅 **`CyberArk Credential (Cert Auth)`**。
2.  **執行掃描並分析結果**：
    * 掃描完成後，查看結果。
    * 如果成功，你應該會睇到 Plugin ID **`19506 - Authentication Success`**。呢個插件證明 Tenable 成功透過 CyberArk 攞到密碼並登入咗目標。
    * 如果失敗，你可能會睇到 Plugin ID **`21745 - Authentication Failure`**。
3.  **除錯貼士**：
    * **SSL/TLS 錯誤:** 通常係 Tenable 唔信任 CCP 伺服器證書。請喺 Tenable 憑證設定中上傳 CA 證書。同時檢查防火牆有冇阻擋 `443` 端口。
    * **CyberArk 回應 401/403 (Unauthorized/Forbidden):**
        * 檢查 Tenable 中嘅 App ID 名稱同 CyberArk 中嘅係咪完全一樣。
        * 檢查證書 CN 同 CyberArk 中設定嘅係咪一樣。
        * 檢查 Tenable Scanner 嘅 IP 係咪喺 CyberArk App ID 嘅 "Allowed Machines" 列表入面。
    * **CyberArk 回應 500 (Internal Server Error) 或 "Account not found":**
        * 檢查 App ID 係咪已經被授權存取對應嘅 Safe (`Retrieve accounts` 權限)。
        * 確認你要攞嘅帳戶真係存在於該 Safe 之中。

希望呢個極詳細嘅指南可以幫到你順利完成設定！
