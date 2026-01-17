# Registration Form Fields Reference

This document serves as a reference for backend endpoint development and database schema design.

---

## Overview

| Section | Required Fields | Optional Fields | Conditional Fields |
|---------|-----------------|-----------------|-------------------|
| Personal Information | 10 | 4 | 0 |
| Academic Status | 1 | 2 | 0 |
| Professional Information | 0 | 4 | 0 |
| Mentorship Program | 0 | 1 | 6 |
| Membership Payment | 1 | 1 | 10 |
| Data Privacy | 1 | 0 | 0 |

---

## 1. Personal Information

### Required Fields

| Field Name | Data Type | Validation | Max Length | Notes |
|------------|-----------|------------|------------|-------|
| `firstName` | `string` | Min 2 chars | - | As shown in official records |
| `lastName` | `string` | Min 2 chars | - | As shown in official records |
| `dateOfBirth` | `string` (date) | Required, format: YYYY-MM-DD | - | Date input |
| `email` | `string` | Valid email format | - | Personal email (not UP email) |
| `mobileNumber` | `string` | Regex: `^09\d{9}$` | 11 | Philippine mobile format |
| `currentAddress` | `string` | Min 5 chars | - | Unit, Street, Subdivision |
| `province` | `string` | Required | - | Name from PSGC API |
| `city` | `string` | Required | - | Name from PSGC API |
| `barangay` | `string` | Required | - | Name from PSGC API |
| `zipCode` | `string` | Regex: `^\d{4}$` | 4 | 4-digit zip code |

### Optional Fields

| Field Name | Data Type | Validation | Max Length | Notes |
|------------|-----------|------------|------------|-------|
| `middleName` | `string` | None | - | Leave blank if none |
| `suffix` | `string` | None | - | e.g., Jr., Sr., III |
| `maidenName` | `string` | None | - | Surname at graduation if different |

---

## 2. Academic Status

### Required Fields

| Field Name | Data Type | Validation | Max Length | Notes |
|------------|-----------|------------|------------|-------|
| `degreeProgram` | `string` | Min 2 chars | - | e.g., BS Computer Science |

### Optional Fields

| Field Name | Data Type | Validation | Max Length | Notes |
|------------|-----------|------------|------------|-------|
| `yearGraduated` | `string` | Regex: `^\d{4}$`, Range: 1970 to current year | 4 | Leave blank if not yet graduated |
| `studentNumber` | `string` | None | - | e.g., 2016-12345 |

---

## 3. Professional Information

### Optional Fields

| Field Name | Data Type | Validation | Max Length | Notes |
|------------|-----------|------------|------------|-------|
| `currentEmployer` | `string` | None | - | Company/Organization name |
| `jobTitle` | `string` | None | - | Current position |
| `industry` | `string` | None | - | Industry sector |
| `yearsOfExperience` | `string` | None | - | Number input (stored as string) |

---

## 4. Mentorship Program

### Optional Fields (Always)

| Field Name | Data Type | Validation | Default | Notes |
|------------|-----------|------------|---------|-------|
| `joinMentorshipProgram` | `boolean` | None | `false` | Opt-in checkbox |

### Conditional Fields (Required when `joinMentorshipProgram === true`)

| Field Name | Data Type | Validation | Notes |
|------------|-----------|------------|-------|
| `mentorshipAreas` | `string[]` | Min 1 selection | Multi-select chips |
| `mentorshipAreasOther` | `string` | **Required if** `mentorshipAreas` includes `'other'` | Free text |
| `mentorshipIndustryTracks` | `string[]` | Min 1 selection | Multi-select chips |
| `mentorshipIndustryTracksOther` | `string` | **Required if** `mentorshipIndustryTracks` includes `'other'` | Free text |
| `mentorshipFormat` | `string` | Required | Enum selection |
| `mentorshipAvailability` | `string` | Required | Hours per month (number input) |

#### Mentorship Areas Options
| Value | Label |
|-------|-------|
| `career-advancement` | Career Advancement |
| `leadership-management` | Leadership & Management |
| `business-corporate` | Business & Corporate Skills |
| `finance-operations` | Finance & Operations |
| `technology-innovation` | Technology & Innovation |
| `hr-workplace` | HR & Workplace Skills |
| `entrepreneurship` | Entrepreneurship |
| `other` | Other (specify) |

#### Industry Tracks Options
| Value | Label |
|-------|-------|
| `it-software` | IT & Software |
| `banking-finance` | Banking & Finance |
| `marketing-advertising` | Marketing & Advertising |
| `engineering` | Engineering |
| `healthcare` | Healthcare |
| `real-estate` | Real Estate |
| `supply-chain` | Supply Chain |
| `government-public` | Government / Public Sector |
| `other` | Other (specify) |

#### Mentorship Format Options
| Value | Label |
|-------|-------|
| `one-on-one` | 1-on-1 Mentorship |
| `group` | Group Mentorship |
| `both` | Either format works |

---

## 5. Membership Payment

### Required Fields

| Field Name | Data Type | Validation | Default | Notes |
|------------|-----------|------------|---------|-------|
| `paymentMethod` | `string` | Required, Enum | `'gcash'` | Payment method selection |

#### Payment Method Options
| Value | Label | Description |
|-------|-------|-------------|
| `gcash` | GCash | Pay via GCash |
| `bank` | Bank Transfer | Direct bank deposit |
| `cash` | Cash | In-person payment |

### Conditional Fields (Based on `paymentMethod`)

#### When `paymentMethod === 'gcash'`

| Field Name | Data Type | Validation | Notes |
|------------|-----------|------------|-------|
| `gcashReferenceNumber` | `string` | **Required** | 13-digit reference number |
| `gcashProofOfPayment` | `File` | **Required**, Accept: `image/*` | Screenshot of transaction |

#### When `paymentMethod === 'bank'`

| Field Name | Data Type | Validation | Max Length | Notes |
|------------|-----------|------------|------------|-------|
| `bankSenderName` | `string` | **Required** | - | Account holder name |
| `bankName` | `string` | **Required** | - | e.g., BDO, BPI, Metrobank |
| `bankAccountNumber` | `string` | **Required** | 4 | Last 4 digits of account |
| `bankReferenceNumber` | `string` | **Required** | - | Reference/Transaction number |
| `bankProofOfPayment` | `File` | **Required**, Accept: `image/*,.pdf` | Screenshot or deposit slip |

#### When `paymentMethod === 'cash'`

| Field Name | Data Type | Validation | Notes |
|------------|-----------|------------|-------|
| `cashPaymentDate` | `string` (date) | **Required** | Date of in-person payment |
| `cashReceivedBy` | `string` | **Required** | Staff member name |

### Optional Fields (All Payment Methods)

| Field Name | Data Type | Validation | Notes |
|------------|-----------|------------|-------|
| `paymentNotes` | `string` | None | Additional payment verification info |

---

## 6. Data Privacy

### Required Fields

| Field Name | Data Type | Validation | Notes |
|------------|-----------|------------|-------|
| `dataPrivacyConsent` | `boolean` | Must be `true` | Consent checkbox |

---

## Database Schema Recommendations

### Primary Table: `membership_applications`

```sql
-- Personal Information
first_name          VARCHAR(100)    NOT NULL
last_name           VARCHAR(100)    NOT NULL
middle_name         VARCHAR(100)    NULL
suffix              VARCHAR(20)     NULL
maiden_name         VARCHAR(100)    NULL
date_of_birth       DATE            NOT NULL
email               VARCHAR(255)    NOT NULL UNIQUE
mobile_number       VARCHAR(11)     NOT NULL
current_address     TEXT            NOT NULL
province            VARCHAR(100)    NOT NULL
city                VARCHAR(100)    NOT NULL
barangay            VARCHAR(100)    NOT NULL
zip_code            CHAR(4)         NOT NULL

-- Academic Status
degree_program      VARCHAR(255)    NOT NULL
year_graduated      CHAR(4)         NULL
student_number      VARCHAR(50)     NULL

-- Professional Information
current_employer    VARCHAR(255)    NULL
job_title           VARCHAR(255)    NULL
industry            VARCHAR(255)    NULL
years_of_experience INTEGER         NULL

-- Mentorship Program
join_mentorship_program BOOLEAN     DEFAULT FALSE
mentorship_areas        JSONB       NULL  -- Array of strings
mentorship_areas_other  TEXT        NULL
mentorship_industry_tracks JSONB    NULL  -- Array of strings
mentorship_industry_tracks_other TEXT NULL
mentorship_format       VARCHAR(50) NULL  -- Enum
mentorship_availability INTEGER     NULL  -- Hours per month

-- Membership Payment
payment_method              VARCHAR(20)  NOT NULL  -- Enum: 'gcash', 'bank', 'cash'
gcash_reference_number      VARCHAR(50)  NULL
gcash_proof_of_payment      VARCHAR(255) NULL  -- File path/URL
bank_sender_name            VARCHAR(255) NULL
bank_name                   VARCHAR(100) NULL
bank_account_number         CHAR(4)      NULL
bank_reference_number       VARCHAR(100) NULL
bank_proof_of_payment       VARCHAR(255) NULL  -- File path/URL
cash_payment_date           DATE         NULL
cash_received_by            VARCHAR(255) NULL
payment_notes               TEXT         NULL

-- Data Privacy
data_privacy_consent        BOOLEAN      NOT NULL DEFAULT FALSE

-- Metadata
created_at                  TIMESTAMP    NOT NULL DEFAULT NOW()
updated_at                  TIMESTAMP    NOT NULL DEFAULT NOW()
status                      VARCHAR(50)  DEFAULT 'pending'
```

---

## API Request Payload Structure

```json
{
  "personalDetails": {
    "firstName": "string",
    "lastName": "string",
    "middleName": "string | null",
    "suffix": "string | null",
    "maidenName": "string | null",
    "dateOfBirth": "YYYY-MM-DD",
    "email": "string",
    "mobileNumber": "string",
    "currentAddress": "string",
    "province": "string",
    "city": "string",
    "barangay": "string",
    "zipCode": "string"
  },
  "academicStatus": {
    "degreeProgram": "string",
    "yearGraduated": "string | null",
    "studentNumber": "string | null"
  },
  "professional": {
    "currentEmployer": "string | null",
    "jobTitle": "string | null",
    "industry": "string | null",
    "yearsOfExperience": "string | null"
  },
  "mentorship": {
    "joinMentorshipProgram": "boolean",
    "mentorshipAreas": "string[]",
    "mentorshipAreasOther": "string | null",
    "mentorshipIndustryTracks": "string[]",
    "mentorshipIndustryTracksOther": "string | null",
    "mentorshipFormat": "string | null",
    "mentorshipAvailability": "string | null"
  },
  "membership": {
    "paymentMethod": "'gcash' | 'bank' | 'cash'",
    "gcashReferenceNumber": "string | null",
    "bankSenderName": "string | null",
    "bankName": "string | null",
    "bankAccountNumber": "string | null",
    "bankReferenceNumber": "string | null",
    "cashPaymentDate": "string | null",
    "cashReceivedBy": "string | null",
    "paymentNotes": "string | null",
    "dataPrivacyConsent": "boolean"
  },
  "gcashProofOfPayment": "File | null",
  "bankProofOfPayment": "File | null"
}
```

> [!NOTE]
> The API request uses `multipart/form-data` for file uploads. Nested objects should be JSON-stringified.

---

## Validation Summary

### Conditional Validation Rules

| Condition | Fields Become Required |
|-----------|----------------------|
| `paymentMethod === 'gcash'` | `gcashReferenceNumber`, `gcashProofOfPayment` |
| `paymentMethod === 'bank'` | `bankSenderName`, `bankName`, `bankAccountNumber`, `bankReferenceNumber`, `bankProofOfPayment` |
| `paymentMethod === 'cash'` | `cashPaymentDate`, `cashReceivedBy` |
| `joinMentorshipProgram === true` | `mentorshipAreas`, `mentorshipIndustryTracks`, `mentorshipFormat`, `mentorshipAvailability` |
| `mentorshipAreas.includes('other')` | `mentorshipAreasOther` |
| `mentorshipIndustryTracks.includes('other')` | `mentorshipIndustryTracksOther` |
