<!-- scenarios/3_support_mass.md -->
# Scenario 3: Support Mass Attack - SMS Phishing

## Attack Overview
Target: IT Support Staff
Method: SMS phishing (smishing) with fake ticket escalation
Goal: Compromise support credentials and remote access tools

## Attack Flow
1. Attacker sends SMS to support staff phones
2. Claims critical ticket escalation requiring immediate attention
3. Directs to fake support portal
4. Captures support credentials
5. Records preferred remote support tool
6. Enables attacker to impersonate support staff

## Attack Vector Details
- SMS bypasses corporate email filters
- Mobile devices often lack phishing protection
- Support staff have elevated privileges
- Remote tool selection indicates attack path

## Compromise Potential
- Support credentials grant broad system access
- Knowledge of remote tools enables follow-on attacks
- Can impersonate support to other employees
- Access to ticketing system reveals internal issues

## Defense Recommendations
- Never click SMS links claiming to be IT
- Use corporate app for ticket management
- Implement MDM with anti-phishing on mobile
- Require MFA for all support tools
- Train support staff on smishing awareness
- Establish out-of-band verification for urgent tickets

## Lab Simulation Notes
SMS phishing targets the "always on" culture of support staff. The urgency of an SLA breach pressures victims to act without verification.