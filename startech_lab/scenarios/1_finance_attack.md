<!-- scenarios/1_finance_attack.md -->
# Scenario 1: Finance Attack - Spear Phishing CFO

## Attack Overview
Target: Chief Financial Officer (CFO)
Method: Spear phishing email with fake invoice
Goal: Credential theft and financial compromise

## Attack Flow
1. Attacker researches CFO email address and typical vendors
2. Creates convincing invoice from "TechSolutions Inc."
3. Email sent with urgent payment required
4. CFO clicks link to fake banking portal
5. Credentials captured in logger.js
6. Attacker gains access to corporate banking

## Indicators of Compromise
- External email claiming to be vendor
- Urgency around payment
- Unusual login page URL
- Request for 2FA/token code

## Defense Recommendations
- Implement email authentication (SPF, DKIM, DMARC)
- Use external email warning banners
- Require MFA for all financial transactions
- Train executives on spear phishing awareness
- Implement out-of-band verification for wire transfers

## Detection Opportunities
- Monitor for emails with invoice-related keywords
- Alert on first-time vendor payment requests
- Track failed login attempts to banking portal
- Monitor for unusual login locations/times

## Lab Simulation Notes
This scenario demonstrates how targeted spear phishing can bypass traditional email filters. The CFO persona is specifically chosen due to their financial authority.