<!-- scenarios/2_hr_harvest.md -->
# Scenario 2: HR Data Harvest Attack

## Attack Overview
Target: All employees
Method: Fake HR policy update notification
Goal: Harvest employee PII (Personally Identifiable Information)

## Attack Flow
1. Attacker spoofs HR email address
2. Claims policy updates require immediate review
3. Directs employees to fake HR portal
4. Captures extensive personal data:
   - Full name and employee ID
   - Corporate credentials
   - SSN (last 4 digits)
   - Date of birth
   - Home address
   - Phone number

## Data Exfiltrated
- 9+ data points per victim
- Valid corporate credentials
- Personal information for identity theft
- Internal employee ID structure

## Impact
- Identity theft risk for employees
- Corporate account compromise
- Potential for further social engineering
- Regulatory compliance violations (GDPR, CCPA)

## Defense Recommendations
- Digital signing of HR communications
- Internal-only HR portal (VPN required)
- Data classification training
- Annual security awareness on HR phishing
- Monitor for bulk policy acknowledgment requests

## Lab Simulation Notes
This attack demonstrates how attackers can harvest extensive PII under the guise of legitimate business processes. The data captured enables both corporate and personal identity theft.