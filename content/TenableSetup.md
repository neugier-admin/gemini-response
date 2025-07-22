Here's a comprehensive guideline for setting up Tenable Core, based on the information you provided:

**Tenable Core Setup Guide**

This guide outlines the steps to initially configure your Tenable Core virtual machine, specifically focusing on network settings.

-----

**Part 1: Initial Login to Tenable Core**

1.  **Navigate to the Tenable Core URL:** Open your web browser and go to the URL of your Tenable Core virtual machine.
2.  **Login Page:** The Tenable Core login page will appear.
3.  **Enter User Name:** In the **User name** field, type `wizard`.
4.  **Enter Password:** In the **Password** field, type `admin`.
5.  **Log In:** Click the **Log In** button.

-----

**Part 2: Configuring Network Settings (IPv4 Manual Configuration)**

Once logged into Tenable Core, you will likely be presented with a command-line interface (CLI).

1.  **Accept Prompt:** Press the `y` key when prompted.

2.  **Access Configuration UI (if needed):** If the configuration prompt does not automatically appear, run the following command in the CLI to access the network configuration user interface:

    ```bash
    nmtui edit
    ```

3.  **List of Connections:** The "list of connections" page will appear.

4.  **Select Connection:** Use the arrow keys to select the network connection you wish to configure.

5.  **Edit Connection:** Press `Tab` to select `<Edit>` and then press `Enter`.

6.  **Edit Connection Window:** The "Edit Connection" window will appear.

7.  **IPv4 Configuration:** In the "IPv4 Configuration" row, press `Tab` to select `<Automatic>`.

8.  **Change to Manual:** Press `Enter`. From the drop-down box, select `<Manual>` and press `Enter`.

9.  **Show More Fields:** Press `Tab` to select `<Show>` and then press `Enter`. More configuration fields will become visible.

      * **Note:** When typing IP addresses, ensure they are in the format of four numbers separated by periods (e.g., `192.0.2.57`).

10. **Configure Addresses:** In the **Addresses** field, type the IPv4 IP address for your Tenable Core + Tenable Security Center deployment, followed by a forward slash and your netmask.

      * **Example:** `192.0.2.57/24`

11. **Configure Gateway:** In the **Gateway** field, type your gateway IP address.

      * **Example:** `192.0.2.177`

12. **Configure DNS Servers (Primary):** In the **DNS servers** field, type your primary DNS server IP address.

      * **Example:** `192.0.2.176`

13. **Add Additional DNS Servers (Optional):** If you have more DNS server IP addresses to add, follow these steps for each additional server:

      * Press `Tab` to select `<Add...>`.
      * Press `Enter`. An empty box will appear in the "DNS servers" row.
      * In the new row, type your second (or subsequent) DNS server IP address.
          * **Example:** `192.0.2.8`

14. **Require IPv4 Addressing:** Select the checkbox in the **Require IPv4 addressing for this connection** row.

-----

**Next Steps:**

After completing these network configurations, you will typically need to save the changes and activate the network connection. The specific prompts for saving and activating are not detailed in your provided text but are standard procedures in network configuration tools. Look for options like `<OK>`, `<Apply>`, or `<Activate>` within the `nmtui` interface. You may also need to reboot the Tenable Core VM for changes to take full effect.
