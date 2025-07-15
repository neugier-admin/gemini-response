好的，完全明白你的設定。這是一個非常典型的場景：PostgreSQL 將日誌寫入特定目錄的檔案中，而我們需要設定 rsyslog 來監控這些檔案，並將日誌內容轉發出去。

針對你的情況（日誌路徑：`/opt/wdts/pqsql/15/data/pg_log/`，檔名格式：`postgresql-yyyy-mm-dd.log`），你需要使用 rsyslog 的 `imfile` 模組（Input Module for Files）。

以下是完整的設定步驟和設定檔範例：

### 步驟 1：建立 rsyslog 的 PostgreSQL 設定檔

最佳實踐是在 `/etc/rsyslog.d/` 目錄下為 PostgreSQL 建立一個獨立的設定檔。這樣可以避免搞亂主設定檔 `/etc/rsyslog.conf`。

執行以下指令來建立設定檔：

```bash
sudo nano /etc/rsyslog.d/60-postgres.conf
```

然後，將下面的設定內容複製並貼到這個檔案中。

### 步驟 2：貼上設定內容

```conf
# /etc/rsyslog.d/60-postgres.conf

# --- 1. 載入 imfile 模組 ---
# 確保 imfile 模組被載入。在現代 rsyslog 版本中，
# 第一次使用 input() 指令時會自動載入。
# module(load="imfile") # 如果需要，可以取消註解

# --- 2. 設定要監控的檔案 ---
# 建立一個新的 input 來監控 PostgreSQL 的日誌檔案
input(type="imfile"
      # 指定要監控的檔案路徑和檔名模式
      # * 萬用字元會匹配所有日期格式的日誌檔
      File="/opt/wdts/pqsql/15/data/pg_log/postgresql-*.log"
      
      # 為來自這些檔案的日誌訊息設定一個固定的標籤 (tag)
      # 這對於後續的篩選和轉發至關重要
      Tag="postgres:"
      
      # 設定嚴重性級別
      Severity="info"
      
      # 設定設施 (facility)
      Facility="local0"
)

# --- 3. 設定轉發規則 ---
# 根據上面設定的 Tag 來篩選日誌，並將它們轉發到你的 SIEM
# 這裡使用 RainerScript 語法，這是目前推薦的方式

# 轉發到你的主 SIEM 伺服器 (使用 TCP)
if $programname == 'postgres' then {
    action(type="omfwd"
           Target="your-primary-siem.example.com"
           Port="514"
           Protocol="tcp"
          )
}

# (可選) 如果你想同時發送到第二個目的地，只需再加一個規則
# if $programname == 'postgres' then {
#     action(type="omfwd"
#            Target="your-backup-logger.internal"
#            Port="1514"
#            Protocol="tcp"
#           )
# }

# (可選) 如果你也想在本地儲存一份 (除了 PostgreSQL 自己寫入的之外)
# if $programname == 'postgres' then {
#     action(type="omfile"
#            File="/var/log/postgres-forwarded.log"
#           )
# }
```

### 步驟 3：檢查權限問題 (非常重要！)

rsyslog 服務通常是以 `syslog` 或 `rsyslog` 使用者身份運行的。這個使用者**必須要有權限**讀取 PostgreSQL 的日誌目錄和檔案。

1.  **檢查 `pg_log` 目錄的權限**：

    ```bash
    ls -ld /opt/wdts/pqsql/15/data/pg_log/
    ```

2.  **檢查日誌檔案的權限**：

    ```bash
    ls -l /opt/wdts/pqsql/15/data/pg_log/postgresql-*.log
    ```

    你需要確保 `syslog` 使用者（或使用者組）有讀取 (`r`) 和執行 (`x` for directory) 的權限。一個常見的解決方法是將 `syslog` 使用者加入到擁有 `pg_log` 目錄的群組中（例如 `postgres` 群組）。

    ```bash
    # 將 syslog 使用者加入到 postgres 群組
    sudo usermod -a -G postgres syslog
    ```

    然後重新啟動 rsyslog 服務。

### 步驟 4：重新啟動 rsyslog 服務

儲存好設定檔後，執行以下指令來讓設定生效：

```bash
sudo systemctl restart rsyslog
```

然後檢查其狀態以確保沒有錯誤：

```bash
sudo systemctl status rsyslog
```

現在，rsyslog 就會開始監控 `/opt/wdts/pqsql/15/data/pg_log/` 目錄下的 `postgresql-*.log` 檔案。當有新的日誌寫入時，rsyslog 會讀取它，並根據你設定的規則將其轉發到 `your-primary-siem.example.com`。
