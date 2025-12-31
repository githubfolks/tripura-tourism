# Tripura Tourism - Admin App

## Login Credentials (Demo)

The system uses email-based role detection for demonstration purposes.

| Role | Email | Password |
|------|-------|----------|
| **Admin** | `admin@tripura.gov.in` | Any |
| **Asset Manager** | `manager@tripura.gov.in` | Any |
| **Staff** | `staff@tripura.gov.in` | Any |
| **Partner** | `partner@mmt.com` | Any |

### Role Logic
- Emails containing `manager` -> **Asset Manager**
- Emails containing `staff` -> **Staff**
- Emails containing `partner` -> **Partner**
- All other emails -> **Admin**
