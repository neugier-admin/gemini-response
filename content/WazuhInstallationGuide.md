# Wazuh Windows Agent Management Guide

This guide provides instructions for installing, uninstalling, and troubleshooting the Wazuh agent on Windows operating systems using PowerShell.

---

## 1.1 Introduction

The Wazuh agent is a single, lightweight component that runs on monitored systems to collect security and operational data. It communicates with the Wazuh manager, sending data in near real-time for analysis and threat detection.

This document outlines the standard procedures for managing the agent lifecycle on Windows endpoints.

#### **Prerequisites**

* **MSI Installer:** You have downloaded the official Wazuh Windows agent MSI installer file.
* **Administrator Privileges:** You have administrative rights on the target Windows machine to perform installation and service management tasks.
* **Manager IP Address:** You know the IP address or DNS name of the Wazuh Manager that the agent will report to.
* **Network Connectivity:** The target machine can reach the Wazuh Manager on port 1514/TCP (for agent communication) and 1515/TCP (for agent registration).

---

## 1.2 Install

This section covers the installation of the Wazuh agent using a PowerShell script for automation.

#### **Step 1: Prepare the PowerShell Script**

1.  Use a text editor to create a new file named `install-wazuh.ps1`.
2.  Copy and paste the PowerShell script from the accompanying script artifact into this file.
3.  Place the `install-wazuh.ps1` script in the **same directory** as the downloaded Wazuh agent MSI file.
4.  **Crucially, edit the script** and update the `$wazuhManagerIP` and `$msiFileName` variables to match your environment.

#### **Step 2: Execute the Installation Script**

1.  Open a PowerShell terminal with **Administrator privileges**.
2.  Navigate to the directory containing the script and MSI file.
    ```powershell
    cd "C:\path\to\your\folder"
    ```
3.  Adjust the execution policy for the current process to allow the script to run.
    ```powershell
    Set-ExecutionPolicy -ExecutionPolicy Bypass -Scope Process
    ```
4.  Execute the script.
    ```powershell
    .\install-wazuh.ps1
    ```

#### **Step 3: Verify the Installation**

1.  **Service Status:** Open the Services console (`services.msc`) and verify that the "Wazuh" service is installed and in the "Running" state.
2.  **Manager Dashboard:** Log in to your Wazuh Manager's web interface. Navigate to the "Agents" section and check if the new agent appears and shows an "Active" status. This may take a few minutes.

---

## 1.3 Uninstall

You can uninstall the Wazuh agent using the command line or the Control Panel.

#### **Method 1: Using PowerShell (Recommended)**

1.  Open PowerShell with **Administrator privileges**.
2.  Run the following command. This will silently uninstall the agent.
    ```powershell
    (Get-WmiObject -Class Win32_Product -Filter "Name='Wazuh Agent'").Uninstall()
    ```
3.  After the command completes, the service will be removed.

#### **Method 2: Using Windows Control Panel**

1.  Open **Control Panel**.
2.  Go to **Programs > Programs and Features**.
3.  Find "Wazuh Agent" in the list.
4.  Select it and click **Uninstall**. Follow the on-screen prompts to complete the removal.

---

## 1.4 Troubleshoots

This section covers common issues that may arise during or after installation.

#### **Issue: Agent Does Not Appear in Manager**

* **Network Connectivity:** Ensure the agent machine can reach the Wazuh Manager's IP on TCP ports 1514 and 1515. Use `Test-NetConnection -ComputerName <Manager_IP> -Port 1514`.
* **Incorrect Manager IP:** Double-check that the manager's IP address was correctly set during installation. You can verify this in the agent's configuration file: `C:\Program Files (x86)\ossec-agent\ossec.conf`.
* **Firewall Rules:** Check for any firewalls (Windows Firewall or network firewalls) between the agent and the manager that might be blocking the connection.

#### **Issue: Wazuh Service Fails to Start**

* **Check Logs:** The primary source for troubleshooting is the agent's log file located at `C:\Program Files (x86)\ossec-agent\ossec.log`. Open this file in a text editor and look for any `ERROR` or `CRITICAL` messages.
* **Configuration Error:** An invalid `ossec.conf` file can prevent the service from starting. Look for syntax errors in the log file.

#### **Issue: Script fails with "not recognized as the name of a cmdlet"**

* **Wrong Directory:** This error means PowerShell cannot find the `install-wazuh.ps1` file. Ensure you have used the `cd` command to navigate into the exact folder where you saved the script.
* **File Name Mismatch:** Use the `dir` or `ls` command to list files in your current directory and verify the script's name is spelled correctly.
