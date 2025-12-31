# Alumni Registration System - Django API Endpoints Reference

This document provides a comprehensive reference for the API endpoints needed for the Alumni Registration System backend (Django). Use this as a guide when implementing your Django REST Framework views/serializers.

---

## Verification Workflow

The membership verification follows a strict 2-step process:

```
New Application → Pending Alumni Verification → Pending Payment Verification → Approved Member
                          ↓                              ↓
                      Rejected                       Rejected
```

**Step 1: Alumni Verification** - Admin manually verifies the applicant is a UP Cebu alumni
**Step 2: Payment Verification** - Admin verifies the membership payment was received

---

## Table of Contents

1. [Authentication Endpoints](#1-authentication-endpoints)
2. [Registration Endpoints](#2-registration-endpoints)
3. [Alumni Verification Endpoints (Step 1)](#3-alumni-verification-endpoints-step-1)
4. [Payment Verification Endpoints (Step 2)](#4-payment-verification-endpoints-step-2)
5. [Rejected Applicants Endpoints](#5-rejected-applicants-endpoints)
6. [Members Endpoints](#6-members-endpoints)
7. [Dashboard Endpoints](#7-dashboard-endpoints)
8. [Utility Endpoints](#8-utility-endpoints)
9. [Data Models Reference](#9-data-models-reference)

---

## 1. Authentication Endpoints

### 1.1 Admin Login

**Endpoint:** `POST /api/auth/login/`

**Description:** Authenticates an admin user and returns an authentication token.

**Request Body:**

| Field      | Type   | Required | Description           |
|------------|--------|----------|-----------------------|
| `email`    | string | Yes      | Admin's email address |
| `password` | string | Yes      | Admin's password      |

**Example Request:**
```json
{
  "email": "admin@example.com",
  "password": "securepassword123"
}
```

**Success Response (200 OK):**
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": 1,
      "email": "admin@example.com",
      "firstName": "Admin",
      "lastName": "User",
      "role": "admin"
    }
  }
}
```

---

### 1.2 Admin Logout

**Endpoint:** `POST /api/auth/logout/`

**Headers:** `Authorization: Bearer <token>`

**Success Response (200 OK):**
```json
{
  "success": true,
  "message": "Logged out successfully"
}
```

---

### 1.3 Verify Token

**Endpoint:** `GET /api/auth/verify/`

**Headers:** `Authorization: Bearer <token>`

**Success Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "valid": true,
    "user": { "id": 1, "email": "admin@example.com", "role": "admin" }
  }
}
```

---

## 2. Registration Endpoints

### 2.1 Submit Alumni Registration

**Endpoint:** `POST /api/registration/submit/`

**Description:** Submits a new alumni registration form. Creates an application with status `pending_alumni_verification`.

**Request Body:**

| Field                            | Type   | Required | Description                                    |
|----------------------------------|--------|----------|------------------------------------------------|
| `personalDetails.title`          | string | Yes      | Title (Mr., Ms., Mrs., Dr.)                    |
| `personalDetails.firstName`      | string | Yes      | First name (min 2 characters)                  |
| `personalDetails.lastName`       | string | Yes      | Last name (min 2 characters)                   |
| `personalDetails.suffix`         | string | No       | Name suffix (Jr., Sr., III, etc.)              |
| `personalDetails.maidenName`     | string | No       | Maiden name (for verification)                 |
| `personalDetails.dateOfBirth`    | string | Yes      | Date of birth (YYYY-MM-DD)                     |
| `personalDetails.email`          | string | Yes      | Email (must not end with @up.edu.ph)           |
| `personalDetails.mobileNumber`   | string | Yes      | Philippine mobile number                       |
| `personalDetails.currentAddress` | string | Yes      | Street address                                 |
| `personalDetails.province`       | string | Yes      | Province code                                  |
| `personalDetails.city`           | string | Yes      | City code                                      |
| `personalDetails.barangay`       | string | Yes      | Barangay code                                  |
| `academicStatus.degreeProgram`   | string | Yes      | Degree program                                 |
| `academicStatus.yearGraduated`   | string | Yes      | 4-digit year                                   |
| `academicStatus.studentNumber`   | string | No       | UP student number                              |
| `professional.currentEmployer`   | string | No       | Current employer                               |
| `professional.jobTitle`          | string | No       | Job title                                      |
| `professional.industry`          | string | No       | Industry                                       |
| `membership.paymentMethod`       | string | Yes      | `gcash`, `bank`, or `cash`                     |

**Success Response (201 Created):**
```json
{
  "success": true,
  "message": "Registration submitted successfully",
  "data": {
    "applicationId": 456,
    "status": "pending_alumni_verification",
    "submittedAt": "2025-12-20T00:15:00Z"
  }
}
```

---

### 2.2 Check Email Availability

**Endpoint:** `GET /api/registration/check-email/?email=<email>`

**Success Response (200 OK):**
```json
{
  "success": true,
  "data": { "available": true, "message": "Email is available" }
}
```

---

## 3. Alumni Verification Endpoints (Step 1)

### 3.1 List Pending Alumni Verifications

**Endpoint:** `GET /api/verification/alumni/`

**Description:** Retrieves applicants pending alumni verification.

**Headers:** `Authorization: Bearer <token>`

**Query Parameters:**

| Parameter   | Type    | Default | Description              |
|-------------|---------|---------|--------------------------|
| `page`      | integer | 1       | Page number              |
| `limit`     | integer | 20      | Records per page         |
| `search`    | string  | -       | Search by name or email  |

**Success Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "applicants": [
      {
        "id": 1,
        "name": "Juan Dela Cruz",
        "email": "juan.delacruz@example.com",
        "degree": "BS Computer Science",
        "yearGraduated": "2020",
        "studentNumber": "2016-12345",
        "dateApplied": "2025-11-25"
      }
    ],
    "pagination": {
      "currentPage": 1,
      "totalPages": 2,
      "totalItems": 12
    }
  }
}
```

---

### 3.2 Get Applicant Details (Alumni Verification)

**Endpoint:** `GET /api/verification/alumni/{id}/`

**Headers:** `Authorization: Bearer <token>`

**Success Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "status": "pending_alumni_verification",
    "dateApplied": "2025-11-25T10:30:00Z",
    "personalDetails": { ... },
    "academicStatus": { ... },
    "professional": { ... },
    "membership": { ... }
  }
}
```

---

### 3.3 Verify as Alumni

**Endpoint:** `POST /api/verification/alumni/{id}/verify/`

**Description:** Verifies the applicant is a UP Cebu alumni. Moves to `pending_payment_verification` status.

**Headers:** `Authorization: Bearer <token>`

**Request Body (Optional):**

| Field   | Type   | Required | Description  |
|---------|--------|----------|--------------|
| `notes` | string | No       | Admin notes  |

**Success Response (200 OK):**
```json
{
  "success": true,
  "message": "Applicant verified as alumni",
  "data": {
    "applicationId": 1,
    "status": "pending_payment_verification",
    "verifiedAt": "2025-12-20T00:45:00Z",
    "verifiedBy": "admin@example.com"
  }
}
```

---

### 3.4 Reject (Alumni Verification)

**Endpoint:** `POST /api/verification/alumni/{id}/reject/`

**Description:** Rejects the applicant during alumni verification stage.

**Headers:** `Authorization: Bearer <token>`

**Request Body:**

| Field    | Type   | Required | Description          |
|----------|--------|----------|----------------------|
| `reason` | string | Yes      | Reason for rejection |

**Example Request:**
```json
{
  "reason": "Name not found in alumni records"
}
```

**Success Response (200 OK):**
```json
{
  "success": true,
  "message": "Application rejected",
  "data": {
    "applicationId": 1,
    "status": "rejected",
    "rejectionStage": "alumni_verification",
    "rejectedAt": "2025-12-20T00:50:00Z",
    "reason": "Name not found in alumni records"
  }
}
```

---

### 3.5 Export Alumni Verification List

**Endpoint:** `GET /api/verification/alumni/export/`

**Headers:** `Authorization: Bearer <token>`

**Response:** CSV file download

---

## 4. Payment Verification Endpoints (Step 2)

### 4.1 List Pending Payment Verifications

**Endpoint:** `GET /api/verification/payment/`

**Description:** Retrieves applicants who passed alumni verification and are pending payment verification.

**Headers:** `Authorization: Bearer <token>`

**Query Parameters:** Same as Alumni Verification list

**Success Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "applicants": [
      {
        "id": 1,
        "name": "Elena Rodriguez",
        "email": "elena.rodriguez@example.com",
        "paymentMethod": "GCash",
        "amount": 5000,
        "alumniVerifiedDate": "2025-11-20"
      }
    ],
    "pagination": { ... }
  }
}
```

---

### 4.2 Get Applicant Details (Payment Verification)

**Endpoint:** `GET /api/verification/payment/{id}/`

**Headers:** `Authorization: Bearer <token>`

**Success Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "status": "pending_payment_verification",
    "alumniVerifiedAt": "2025-11-20T10:00:00Z",
    "paymentMethod": "GCash",
    "amount": 5000,
    "personalDetails": { ... },
    "academicStatus": { ... }
  }
}
```

---

### 4.3 Confirm Payment

**Endpoint:** `POST /api/verification/payment/{id}/confirm/`

**Description:** Confirms payment received. Creates member record with `approved` status.

**Headers:** `Authorization: Bearer <token>`

**Request Body (Optional):**

| Field   | Type   | Required | Description  |
|---------|--------|----------|--------------|
| `notes` | string | No       | Admin notes  |

**Success Response (200 OK):**
```json
{
  "success": true,
  "message": "Payment confirmed. Member approved.",
  "data": {
    "applicationId": 1,
    "memberId": 789,
    "status": "approved",
    "memberSince": "2025-12-20",
    "approvedAt": "2025-12-20T01:00:00Z"
  }
}
```

---

### 4.4 Reject (Payment Verification)

**Endpoint:** `POST /api/verification/payment/{id}/reject/`

**Description:** Rejects the applicant during payment verification stage.

**Headers:** `Authorization: Bearer <token>`

**Request Body:**

| Field    | Type   | Required | Description          |
|----------|--------|----------|----------------------|
| `reason` | string | Yes      | Reason for rejection |

**Example Request:**
```json
{
  "reason": "Payment not received after 30 days"
}
```

**Success Response (200 OK):**
```json
{
  "success": true,
  "message": "Application rejected",
  "data": {
    "applicationId": 1,
    "status": "rejected",
    "rejectionStage": "payment_verification",
    "rejectedAt": "2025-12-20T01:05:00Z",
    "reason": "Payment not received after 30 days"
  }
}
```

---

### 4.5 Export Payment Verification List

**Endpoint:** `GET /api/verification/payment/export/`

**Headers:** `Authorization: Bearer <token>`

**Response:** CSV file download

---

## 5. Rejected Applicants Endpoints

### 5.1 List Rejected Applicants

**Endpoint:** `GET /api/rejected/`

**Description:** Retrieves all rejected applicants from both verification stages.

**Headers:** `Authorization: Bearer <token>`

**Query Parameters:**

| Parameter        | Type   | Default | Description                                      |
|------------------|--------|---------|--------------------------------------------------|
| `page`           | integer| 1       | Page number                                      |
| `limit`          | integer| 20      | Records per page                                 |
| `search`         | string | -       | Search by name or email                          |
| `rejectionStage` | string | -       | Filter: `alumni_verification` or `payment_verification` |

**Success Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "applicants": [
      {
        "id": 1,
        "name": "Roberto Cruz",
        "email": "roberto.cruz@example.com",
        "rejectedAt": "2025-11-24",
        "rejectionStage": "Alumni Verification",
        "reason": "Name not found in alumni records"
      },
      {
        "id": 2,
        "name": "Linda Gomez",
        "email": "linda.gomez@example.com",
        "rejectedAt": "2025-11-23",
        "rejectionStage": "Payment Verification",
        "reason": "Payment not received after 30 days"
      }
    ],
    "pagination": { ... }
  }
}
```

---

### 5.2 Get Rejected Applicant Details

**Endpoint:** `GET /api/rejected/{id}/`

**Headers:** `Authorization: Bearer <token>`

**Success Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "status": "rejected",
    "rejectionStage": "alumni_verification",
    "rejectedAt": "2025-11-24T15:30:00Z",
    "rejectedBy": "admin@example.com",
    "reason": "Name not found in alumni records",
    "personalDetails": { ... },
    "academicStatus": { ... }
  }
}
```

---

### 5.3 Export Rejected Applicants

**Endpoint:** `GET /api/rejected/export/`

**Headers:** `Authorization: Bearer <token>`

**Response:** CSV file download

---

## 6. Members Endpoints

### 6.1 List Approved Members

**Endpoint:** `GET /api/members/`

**Headers:** `Authorization: Bearer <token>`

**Query Parameters:**

| Parameter        | Type    | Default     | Description                     |
|------------------|---------|-------------|---------------------------------|
| `page`           | integer | 1           | Page number                     |
| `limit`          | integer | 20          | Records per page                |
| `search`         | string  | -           | Search by name or email         |

**Success Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "members": [
      {
        "id": 1,
        "name": "Ana Garcia",
        "email": "ana.garcia@example.com",
        "degree": "BS Nursing",
        "yearGraduated": "2018",
        "memberSince": "2020-05-15"
      }
    ],
    "pagination": { ... }
  }
}
```

---

### 6.2 Get Member Details

**Endpoint:** `GET /api/members/{id}/`

### 6.3 Update Member

**Endpoint:** `PUT /api/members/{id}/`

### 6.4 Revoke Membership

**Endpoint:** `DELETE /api/members/{id}/`

### 6.5 Export Members

**Endpoint:** `GET /api/members/export/`

---

## 7. Dashboard Endpoints

### 8.1 Get Dashboard Statistics

**Endpoint:** `GET /api/dashboard/stats/`

**Headers:** `Authorization: Bearer <token>`

**Success Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "stats": [
      { "label": "Pending Alumni Verification", "count": 12 },
      { "label": "Pending Payment Verification", "count": 8 },
      { "label": "Approved Members", "count": 156 }
    ]
  }
}
```

---

### 7.2 Get Recent Activity

**Endpoint:** `GET /api/dashboard/activity/?limit=5`

**Headers:** `Authorization: Bearer <token>`

**Success Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "activities": [
      {
        "id": 1,
        "name": "Juan Dela Cruz",
        "email": "juan.delacruz@example.com",
        "status": "Pending",
        "type": "Alumni Verification",
        "date": "2025-11-25"
      },
      {
        "id": 2,
        "name": "Maria Santos",
        "email": "maria.santos@example.com",
        "status": "Verified",
        "type": "Payment Verification",
        "date": "2025-11-24"
      }
    ]
  }
}
```

---

## 8. Utility Endpoints

### 8.1 Get Provinces
**Endpoint:** `GET /api/utils/provinces/`

### 8.2 Get Cities
**Endpoint:** `GET /api/utils/cities/?province=<code>`

### 8.3 Get Barangays
**Endpoint:** `GET /api/utils/barangays/?city=<code>`

### 8.4 Get Degree Programs
**Endpoint:** `GET /api/utils/degree-programs/`

---

## 9. Data Models Reference

### Application Status Flow

```python
STATUS_CHOICES = [
    ('pending_alumni_verification', 'Pending Alumni Verification'),
    ('pending_payment_verification', 'Pending Payment Verification'),
    ('approved', 'Approved'),
    ('rejected', 'Rejected'),
]
```

### MembershipApplication Model

```python
class MembershipApplication(models.Model):
    # Applicant info (denormalized for quick access)
    first_name = models.CharField(max_length=100)
    last_name = models.CharField(max_length=100)
    email = models.EmailField(unique=True)
    
    # Full registration data stored as JSON
    registration_data = models.JSONField()
    
    # Status tracking
    status = models.CharField(max_length=30, choices=STATUS_CHOICES, 
                              default='pending_alumni_verification')
    date_applied = models.DateTimeField(auto_now_add=True)
    
    # Alumni verification
    alumni_verified_at = models.DateTimeField(null=True, blank=True)
    alumni_verified_by = models.ForeignKey(User, null=True, blank=True, 
                                           related_name='alumni_verifications')
    
    # Payment verification / Approval
    approved_at = models.DateTimeField(null=True, blank=True)
    approved_by = models.ForeignKey(User, null=True, blank=True,
                                    related_name='approvals')
    
    # Rejection
    rejected_at = models.DateTimeField(null=True, blank=True)
    rejected_by = models.ForeignKey(User, null=True, blank=True,
                                    related_name='rejections')
    rejection_stage = models.CharField(max_length=30, null=True, blank=True)
    rejection_reason = models.TextField(null=True, blank=True)
    
    # Notes
    admin_notes = models.TextField(blank=True)
```

### Member Model

```python
class Member(models.Model):
    application = models.OneToOneField(MembershipApplication, on_delete=models.CASCADE)
    member_since = models.DateField()
    is_active = models.BooleanField(default=True)
```

---

## Response Format Standards

### Success Response
```json
{ "success": true, "message": "...", "data": { ... } }
```

### Error Response
```json
{ "success": false, "message": "...", "errors": { "field": ["error"] } }
```

### HTTP Status Codes

| Code | Description                    |
|------|--------------------------------|
| 200  | Success                        |
| 201  | Created                        |
| 400  | Bad Request (validation error) |
| 401  | Unauthorized                   |
| 403  | Forbidden                      |
| 404  | Not Found                      |
| 500  | Server Error                   |

---

## CORS Configuration

```python
CORS_ALLOWED_ORIGINS = [
    "http://localhost:3000",
]
CORS_ALLOW_CREDENTIALS = True
```
