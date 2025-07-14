# Wazuh Windows Agent Installation via PowerShell

This guide provides a high-level overview of the steps required to install the Wazuh agent on a Windows system using a PowerShell script.

**Prerequisites:**
* You have downloaded the Wazuh Windows agent MSI installer file.
* You have Administrator privileges on the target Windows machine.
* You know the IP address of your Wazuh Manager.

---

## Installation Steps

### Step 1: Prepare the PowerShell Script
1.  Download or copy the PowerShell script for installation.
2.  Save the script as a `.ps1` file (e.g., `install-wazuh.ps1`).
3.  Place the script in the same directory as the downloaded Wazuh agent MSI file.
4.  Edit the script and update the `$wazuhManagerIP` variable to point to your Wazuh Manager's IP address. If your MSI file has a different name, update the `$msiFileName` variable as well.

### Step 2: Execute the Script
1.  Open PowerShell with **Administrator privileges**.
2.  Navigate to the directory where you saved the script and the MSI file.
    ```powershell
    cd "C:\path\to\your\folder"
    ```
3.  Run the script. You may need to adjust your execution policy first.
    ```powershell
    # To allow the script to run in the current session
    Set-ExecutionPolicy -ExecutionPolicy Bypass -Scope Process

    # Execute the installation script
    .\install-wazuh.ps1
    ```

### Step 3: Verify the Agent Status
1.  Once the script finishes, the Wazuh agent service will be installed and started.
2.  You can verify that the service is running by opening `services.msc` and looking for the "Wazuh" service.
3.  Log in to your Wazuh Manager dashboard to see if the new agent has successfully registered and is reporting.
