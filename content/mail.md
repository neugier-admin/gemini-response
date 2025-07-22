Subject: Explanation for Server Migration for Tenable Scanners

Hi Server Team,

I'm writing to explain why we need to migrate and set up multiple new servers for our Tenable scanners.

The primary reason is to ensure optimal performance and prevent potential network impact. **Tenable scanners require a dedicated instance in each zone.** If a scanner process attempts to span across different zones, it can lead to significant network strain and performance degradation.

By **distributing the scanners across various zones**, rather than centralizing them on a single machine, we can achieve greater efficiency and proactively avoid these potential network issues. This approach allows each scanner to operate within its designated zone, minimizing cross-zone traffic and ensuring smoother, more reliable scanning operations.

We believe this strategy will lead to a more robust and efficient scanning infrastructure overall.

Thanks for your understanding and support.

Best regards,

[Your Name]
