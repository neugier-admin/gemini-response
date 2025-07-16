Understood. I have updated the email draft to include the network port requirements for the Wazuh server.

Here is the revised version:

***

**Subject:** Request for Virtual Machine Setup for Security Solution POC

**Dear [Recipient Name/IT Department],**

I hope this email finds you well.

We are preparing for a Proof of Concept (POC) to test the Wazuh security platform. To proceed, we require a testing environment with three virtual machines.

Could you please assist us by setting up the following VMs with the specifications listed below?

**Overall Requirements:**

**VM 1: Wazuh Server**
* **Purpose:** To host the Wazuh Manager, Indexer, and Dashboard.
* **OS:** Linux (We will provide an OVA file for this installation).
* **Hardware:**
    * **CPU:** 8 Cores
    * **RAM:** 16 GB
    * **Storage:** 100 GB

**VM 2: Linux Test Server**
* **Purpose:** To test the Wazuh agent and rsyslog forwarding.
* **OS:** Please use the primary Linux OS version that is standard in your environment.
* **Hardware:**
    * **CPU:** 2 Cores
    * **RAM:** 4 GB
    * **Storage:** 50 GB

**VM 3: Windows Test Server**
* **Purpose:** To test the Wazuh agent and Windows Event Log forwarding.
* **OS:** Windows Server (a standard build).
* **Hardware:**
    * **CPU:** 2 Cores
    * **RAM:** 4 GB
    * **Storage:** 50 GB

---

**Network Requirements:**

For **VM 1 (Wazuh Server)**, please ensure the following inbound ports are allowed through the firewall:
* **TCP/UDP 1514:** For Wazuh agent registration and communication.
* **TCP 1515:** For the agent enrollment process.
* **UDP 514:** For receiving syslog data.

---

Once the VMs are provisioned with the specified network access, please let us know. We can then provide the OVA file for the Wazuh server and begin our testing.

Thank you for your support. Please let me know if you have any questions.

Best regards,

**[Your Name]**
**[Your Title]**
