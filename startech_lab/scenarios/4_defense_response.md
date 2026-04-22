<!-- scenarios/4_defense_response.md -->
# Scenario 4: Defense Response and Attack Mitigation

## Defense Activation Flow
1. IT Defender monitors dashboard for anomalies
2. Detects multiple credential submissions in short time
3. Identifies suspicious access patterns
4. Activates DEFENSE MODE
5. System blocks subsequent phishing attempts
6. Redirects victims to "Attack Blocked" page
7. Logs incident for post-mortem analysis

## Detection Triggers
- 3+ credential submissions within 5 minutes
- Multiple IP addresses submitting credentials
- Rapid page navigation patterns
- Unusual time-of-day access
- Mismatched user agent and expected device

## Defense Actions
- Block known phishing URLs
- Activate warning banners for suspicious links
- Alert security team
- Begin incident response process
- Preserve forensic evidence
- Initiate password reset for compromised accounts

## Incident Response Steps
1. Identification: Detect phishing campaign
2. Containment: Block phishing infrastructure
3. Eradication: Remove phishing emails
4. Recovery: Reset compromised credentials
5. Lessons Learned: Update training and controls

## Metrics for Success
- Mean time to detect (MTTD): 2 minutes
- Mean time to respond (MTTR): 30 seconds
- Credentials protected: All post-activation
- Attacks blocked: 1 successful defense

## Lab Simulation Notes
This scenario demonstrates the importance of active monitoring and rapid response. The defender's ability to detect and block attacks in real-time prevents credential theft.