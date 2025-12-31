# Alumni Registration System - Database Schema Reference

This document provides the complete database schema for the Alumni Registration System using MySQL/PostgreSQL with Django ORM.

---

## Database Tables Overview

1. [users](#1-users-table) - Admin user accounts
2. [membership_applications](#2-membership_applications-table) - All application records
3. [members](#3-members-table) - Approved members
4. [provinces](#4-provinces-table) - Philippine provinces
5. [cities](#5-cities-table) - Philippine cities/municipalities
6. [barangays](#6-barangays-table) - Philippine barangays
7. [degree_programs](#7-degree_programs-table) - UP Cebu degree programs

---

## 1. users Table

Admin accounts for the system.

| Column Name | Data Type | Constraints | Description |
|------------|-----------|-------------|-------------|
| id | INTEGER | PRIMARY KEY, AUTO_INCREMENT | Unique identifier |
| email | VARCHAR(255) | UNIQUE, NOT NULL | Admin email |
| password | VARCHAR(255) | NOT NULL | Hashed password |
| first_name | VARCHAR(100) | NOT NULL | First name |
| last_name | VARCHAR(100) | NOT NULL | Last name |
| role | VARCHAR(50) | NOT NULL, DEFAULT 'admin' | User role |
| is_active | BOOLEAN | NOT NULL, DEFAULT TRUE | Account status |
| created_at | TIMESTAMP | NOT NULL, DEFAULT CURRENT_TIMESTAMP | Creation timestamp |
| updated_at | TIMESTAMP | NOT NULL, DEFAULT CURRENT_TIMESTAMP ON UPDATE | Last update timestamp |

### Indexes
- `idx_users_email` on `email`

### Seeder Data
```sql
INSERT INTO users (email, password, first_name, last_name, role) VALUES
('admin@upcebu.edu.ph', 'hashed_password_here', 'Admin', 'User', 'admin'),
('verifier@upcebu.edu.ph', 'hashed_password_here', 'Alumni', 'Verifier', 'admin'),
('treasurer@upcebu.edu.ph', 'hashaded_password_here', 'Payment', 'Processor', 'admin');
```

---

## 2. membership_applications Table

All membership applications with 2-step verification tracking.

| Column Name | Data Type | Constraints | Description |
|------------|-----------|-------------|-------------|
| id | INTEGER | PRIMARY KEY, AUTO_INCREMENT | Unique identifier |
| **Personal Details** | | | |
| title | VARCHAR(10) | NOT NULL | Mr., Ms., Mrs., Dr. |
| first_name | VARCHAR(100) | NOT NULL | First name |
| last_name | VARCHAR(100) | NOT NULL | Last name |
| suffix | VARCHAR(20) | NULL | Jr., Sr., III, etc. |
| maiden_name | VARCHAR(100) | NULL | Maiden name |
| date_of_birth | DATE | NOT NULL | Date of birth |
| email | VARCHAR(255) | UNIQUE, NOT NULL | Email address |
| mobile_number | VARCHAR(15) | NOT NULL | Philippine mobile number |
| current_address | TEXT | NOT NULL | Street address |
| province | VARCHAR(100) | NOT NULL | Province |
| city | VARCHAR(100) | NOT NULL | City/Municipality |
| barangay | VARCHAR(100) | NOT NULL | Barangay |
| **Academic Status** | | | |
| degree_program | VARCHAR(200) | NOT NULL | Degree program |
| year_graduated | VARCHAR(4) | NOT NULL | Graduation year (YYYY) |
| student_number | VARCHAR(20) | NULL | UP student number |
| **Professional** | | | |
| current_employer | VARCHAR(200) | NULL | Current employer |
| job_title | VARCHAR(100) | NULL | Job title |
| industry | VARCHAR(100) | NULL | Industry |
| **Membership** | | | |
| payment_method | VARCHAR(20) | NOT NULL | 'gcash', 'bank', or 'cash' |
| **Status Tracking** | | | |
| status | VARCHAR(50) | NOT NULL, DEFAULT 'pending_alumni_verification' | Application status |
| date_applied | TIMESTAMP | NOT NULL, DEFAULT CURRENT_TIMESTAMP | Application date |
| **Alumni Verification (Step 1)** | | | |
| alumni_verified_at | TIMESTAMP | NULL | When verified as alumni |
| alumni_verified_by | INTEGER | NULL, FOREIGN KEY → users(id) | Admin who verified |
| alumni_verification_notes | TEXT | NULL | Verification notes |
| **Payment Verification (Step 2)** | | | |
| payment_verified_at | TIMESTAMP | NULL | When payment verified |
| payment_verified_by | INTEGER | NULL, FOREIGN KEY → users(id) | Admin who verified payment |
| payment_verification_notes | TEXT | NULL | Payment notes |
| **Approval** | | | |
| approved_at | TIMESTAMP | NULL | When fully approved |
| approved_by | INTEGER | NULL, FOREIGN KEY → users(id) | Admin who approved |
| **Rejection** | | | |
| rejected_at | TIMESTAMP | NULL | When rejected |
| rejected_by | INTEGER | NULL, FOREIGN KEY → users(id) | Admin who rejected |
| rejection_stage | VARCHAR(30) | NULL | 'alumni_verification' or 'payment_verification' |
| rejection_reason | TEXT | NULL | Rejection reason |
| **Metadata** | | | |
| created_at | TIMESTAMP | NOT NULL, DEFAULT CURRENT_TIMESTAMP | Record creation |
| updated_at | TIMESTAMP | NOT NULL, DEFAULT CURRENT_TIMESTAMP ON UPDATE | Last update |

### Status Values
- `pending_alumni_verification` - Waiting for Step 1
- `pending_payment_verification` - Passed Step 1, waiting for Step 2
- `approved` - Fully approved, member created
- `rejected` - Rejected at either step

### Indexes
- `idx_applications_status` on `status`
- `idx_applications_email` on `email`
- `idx_applications_date_applied` on `date_applied`
- `idx_applications_rejection_stage` on `rejection_stage`

### Seeder Data
```sql
INSERT INTO membership_applications (
  title, first_name, last_name, date_of_birth, email, mobile_number,
  current_address, province, city, barangay,
  degree_program, year_graduated, student_number,
  current_employer, job_title, industry,
  payment_method, status
) VALUES
-- Pending Alumni Verification
('Mr.', 'Juan', 'Dela Cruz', '1998-06-15', 'juan.delacruz@gmail.com', '09171234567',
 '123 Sample St., Subdivision', 'Cebu', 'Cebu City', 'Lahug',
 'BS Computer Science', '2020', '2016-12345',
 'Tech Company Inc.', 'Software Engineer', 'Technology',
 'gcash', 'pending_alumni_verification'),

('Ms.', 'Maria', 'Santos', '1999-03-22', 'maria.santos@gmail.com', '09187654321',
 '456 Example Ave.', 'Cebu', 'Mandaue', 'Banilad',
 'BS Biology', '2019', '2015-67890',
 NULL, NULL, NULL,
 'bank', 'pending_alumni_verification'),

-- Pending Payment Verification (already verified as alumni)
('Ms.', 'Elena', 'Rodriguez', '1997-11-08', 'elena.rodriguez@gmail.com', '09161234567',
 '789 Test Road', 'Cebu', 'Cebu City', 'Apas',
 'BS Mathematics', '2015', '2011-11111',
 'Tech Corp', 'Data Analyst', 'Technology',
 'gcash', 'pending_payment_verification'),

-- Rejected
('Mr.', 'Roberto', 'Cruz', '1995-08-19', 'roberto.cruz@gmail.com', '09198765432',
 '321 Demo St.', 'Cebu', 'Cebu City', 'Lahug',
 'BS Engineering', '2018', NULL,
 'Construction Co.', 'Engineer', 'Construction',
 'cash', 'rejected');

-- Update the rejected record with rejection details
UPDATE membership_applications 
SET rejected_at = NOW(), 
    rejected_by = 1,
    rejection_stage = 'alumni_verification',
    rejection_reason = 'Name not found in alumni records'
WHERE email = 'roberto.cruz@gmail.com';

-- Update payment verification record with alumni verification data
UPDATE membership_applications 
SET alumni_verified_at = DATE_SUB(NOW(), INTERVAL 5 DAY),
    alumni_verified_by = 1,
    alumni_verification_notes = 'Verified via student records'
WHERE email = 'elena.rodriguez@gmail.com';
```

---

## 3. members Table

Approved members only (after passing both verification steps).

| Column Name | Data Type | Constraints | Description |
|------------|-----------|-------------|-------------|
| id | INTEGER | PRIMARY KEY, AUTO_INCREMENT | Unique identifier |
| application_id | INTEGER | UNIQUE, NOT NULL, FOREIGN KEY → membership_applications(id) | Source application |
| member_since | DATE | NOT NULL | Membership start date |
| is_active | BOOLEAN | NOT NULL, DEFAULT TRUE | Membership status |
| created_at | TIMESTAMP | NOT NULL, DEFAULT CURRENT_TIMESTAMP | Record creation |
| updated_at | TIMESTAMP | NOT NULL, DEFAULT CURRENT_TIMESTAMP ON UPDATE | Last update |

### Indexes
- `idx_members_application_id` on `application_id`
- `idx_members_member_since` on `member_since`

### Seeder Data
```sql
-- First, approve some applications
UPDATE membership_applications 
SET status = 'approved',
    payment_verified_at = NOW(),
    payment_verified_by = 1,
    approved_at = NOW(),
    approved_by = 1
WHERE email IN ('ana.garcia@gmail.com', 'carlos.mercado@gmail.com', 'rosa.fernandez@gmail.com');

-- Then create member records
INSERT INTO members (application_id, member_since, is_active)
SELECT id, DATE(approved_at), TRUE
FROM membership_applications
WHERE status = 'approved' AND email IN ('ana.garcia@gmail.com', 'carlos.mercado@gmail.com', 'rosa.fernandez@gmail.com');
```

---

## 4. provinces Table

Philippine provinces for address selection.

| Column Name | Data Type | Constraints | Description |
|------------|-----------|-------------|-------------|
| id | INTEGER | PRIMARY KEY, AUTO_INCREMENT | Unique identifier |
| code | VARCHAR(50) | UNIQUE, NOT NULL | Province code |
| name | VARCHAR(100) | NOT NULL | Province name |
| created_at | TIMESTAMP | NOT NULL, DEFAULT CURRENT_TIMESTAMP | Record creation |

### Indexes
- `idx_provinces_code` on `code`

### Seeder Data
```sql
INSERT INTO provinces (code, name) VALUES
('cebu', 'Cebu'),
('manila', 'Metro Manila'),
('davao', 'Davao del Sur'),
('bohol', 'Bohol'),
('negros_oriental', 'Negros Oriental'),
('leyte', 'Leyte'),
('samar', 'Samar');
```

---

## 5. cities Table

Philippine cities/municipalities.

| Column Name | Data Type | Constraints | Description |
|------------|-----------|-------------|-------------|
| id | INTEGER | PRIMARY KEY, AUTO_INCREMENT | Unique identifier |
| province_id | INTEGER | NOT NULL, FOREIGN KEY → provinces(id) | Parent province |
| code | VARCHAR(50) | UNIQUE, NOT NULL | City code |
| name | VARCHAR(100) | NOT NULL | City name |
| created_at | TIMESTAMP | NOT NULL, DEFAULT CURRENT_TIMESTAMP | Record creation |

### Indexes
- `idx_cities_province_id` on `province_id`
- `idx_cities_code` on `code`

### Seeder Data
```sql
INSERT INTO cities (province_id, code, name) VALUES
-- Cebu cities
(1, 'cebu-city', 'Cebu City'),
(1, 'mandaue', 'Mandaue City'),
(1, 'lapu-lapu', 'Lapu-Lapu City'),
(1, 'talisay', 'Talisay City'),
-- Manila cities
(2, 'manila', 'Manila'),
(2, 'quezon-city', 'Quezon City'),
(2, 'makati', 'Makati City');
```

---

## 6. barangays Table

Philippine barangays.

| Column Name | Data Type | Constraints | Description |
|------------|-----------|-------------|-------------|
| id | INTEGER | PRIMARY KEY, AUTO_INCREMENT | Unique identifier |
| city_id | INTEGER | NOT NULL, FOREIGN KEY → cities(id) | Parent city |
| code | VARCHAR(50) | UNIQUE, NOT NULL | Barangay code |
| name | VARCHAR(100) | NOT NULL | Barangay name |
| created_at | TIMESTAMP | NOT NULL, DEFAULT CURRENT_TIMESTAMP | Record creation |

### Indexes
- `idx_barangays_city_id` on `city_id`
- `idx_barangays_code` on `code`

### Seeder Data
```sql
INSERT INTO barangays (city_id, code, name) VALUES
-- Cebu City barangays
(1, 'lahug', 'Barangay Lahug'),
(1, 'apas', 'Barangay Apas'),
(1, 'banilad', 'Barangay Banilad'),
(1, 'guadalupe', 'Barangay Guadalupe'),
(1, 'mabolo', 'Barangay Mabolo'),
-- Mandaue City barangays
(2, 'centro', 'Barangay Centro'),
(2, 'basak', 'Barangay Basak');
```

---

## 7. degree_programs Table

UP Cebu degree programs for validation.

| Column Name | Data Type | Constraints | Description |
|------------|-----------|-------------|-------------|
| id | INTEGER | PRIMARY KEY, AUTO_INCREMENT | Unique identifier |
| code | VARCHAR(50) | UNIQUE, NOT NULL | Program code |
| name | VARCHAR(200) | NOT NULL | Program name |
| is_active | BOOLEAN | NOT NULL, DEFAULT TRUE | Currently offered |
| created_at | TIMESTAMP | NOT NULL, DEFAULT CURRENT_TIMESTAMP | Record creation |

### Indexes
- `idx_degree_programs_code` on `code`
- `idx_degree_programs_is_active` on `is_active`

### Seeder Data
```sql
INSERT INTO degree_programs (code, name, is_active) VALUES
('bs-computer-science', 'BS Computer Science', TRUE),
('bs-biology', 'BS Biology', TRUE),
('bs-mathematics', 'BS Mathematics', TRUE),
('bs-chemistry', 'BS Chemistry', TRUE),
('bs-physics', 'BS Physics', TRUE),
('bs-economics', 'BS Economics', TRUE),
('bs-accountancy', 'BS Accountancy', TRUE),
('bs-management', 'BS Management', TRUE),
('bs-nursing', 'BS Nursing', TRUE),
('bs-psychology', 'BS Psychology', TRUE),
('ba-communication', 'BA Communication', TRUE),
('ba-political-science', 'BA Political Science', TRUE),
('bs-architecture', 'BS Architecture', TRUE),
('bs-engineering', 'BS Engineering', TRUE);
```

---

## Relationships Diagram

```
users (1) ----< (Many) membership_applications
  |                          |
  |                          | (1:1)
  |                          v
  |                     members
  
provinces (1) ----< (Many) cities
cities (1) ----< (Many) barangays
```

---

## Complete Seeder SQL Script

```sql
-- 1. Create admin users
INSERT INTO users (email, password, first_name, last_name, role) VALUES
('admin@upcebu.edu.ph', '$2b$12$example_hashed_password', 'Admin', 'User', 'admin'),
('verifier@upcebu.edu.ph', '$2b$12$example_hashed_password', 'Alumni', 'Verifier', 'admin'),
('treasurer@upcebu.edu.ph', '$2b$12$example_hashed_password', 'Payment', 'Processor', 'admin');

-- 2. Populate provinces
INSERT INTO provinces (code, name) VALUES
('cebu', 'Cebu'),
('manila', 'Metro Manila'),
('davao', 'Davao del Sur'),
('bohol', 'Bohol');

-- 3. Populate cities
INSERT INTO cities (province_id, code, name) 
SELECT p.id, 'cebu-city', 'Cebu City' FROM provinces p WHERE p.code = 'cebu'
UNION ALL
SELECT p.id, 'mandaue', 'Mandaue City' FROM provinces p WHERE p.code = 'cebu'
UNION ALL
SELECT p.id, 'manila', 'Manila' FROM provinces p WHERE p.code = 'manila';

-- 4. Populate barangays
INSERT INTO barangays (city_id, code, name)
SELECT c.id, 'lahug', 'Barangay Lahug' FROM cities c WHERE c.code = 'cebu-city'
UNION ALL
SELECT c.id, 'apas', 'Barangay Apas' FROM cities c WHERE c.code = 'cebu-city'
UNION ALL
SELECT c.id, 'banilad', 'Barangay Banilad' FROM cities c WHERE c.code = 'cebu-city';

-- 5. Populate degree programs
INSERT INTO degree_programs (code, name, is_active) VALUES
('bs-computer-science', 'BS Computer Science', TRUE),
('bs-biology', 'BS Biology', TRUE),
('bs-mathematics', 'BS Mathematics', TRUE),
('bs-nursing', 'BS Nursing', TRUE);

-- 6. Create sample applications (various statuses)
-- Applications will be created via the registration form API
```

---

## Django Models Reference

For Django implementation, use these model definitions:

```python
from django.db import models
from django.contrib.auth.models import AbstractUser

class User(AbstractUser):
    email = models.EmailField(unique=True)
    role = models.CharField(max_length=50, default='admin')
    
    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['first_name', 'last_name']

class MembershipApplication(models.Model):
    STATUS_CHOICES = [
        ('pending_alumni_verification', 'Pending Alumni Verification'),
        ('pending_payment_verification', 'Pending Payment Verification'),
        ('approved', 'Approved'),
        ('rejected', 'Rejected'),
    ]
    
    # Personal Details
    title = models.CharField(max_length=10)
    first_name = models.CharField(max_length=100)
    last_name = models.CharField(max_length=100)
    # ... (add all fields as per schema)
    
    status = models.CharField(max_length=50, choices=STATUS_CHOICES, 
                              default='pending_alumni_verification')
    
    class Meta:
        db_table = 'membership_applications'
        indexes = [
            models.Index(fields=['status']),
            models.Index(fields=['email']),
        ]
```

---

## Notes

- All `created_at` and `updated_at` fields use `CURRENT_TIMESTAMP`
- Foreign keys include `ON DELETE` constraints (PROTECT for users, CASCADE for applications)
- Email fields are lowercase and validated
- Mobile numbers follow Philippine format validation
- Passwords are hashed using bcrypt (Django default)
- Status transitions are enforced at application level
