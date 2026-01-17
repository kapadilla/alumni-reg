import type { RegistrationFormValues } from '~/types/registration';
import { toast } from 'vue-sonner';

/**
 * Builds FormData from registration form values for multipart submission
 */
export const buildRegistrationFormData = (value: RegistrationFormValues): FormData => {
    const formData = new FormData();

    // Add nested objects as JSON strings
    formData.append(
        'personalDetails',
        JSON.stringify({
            title: value.suffix || 'Mr.',
            firstName: value.firstName,
            lastName: value.lastName,
            suffix: value.suffix || '',
            maidenName: value.maidenName || '',
            dateOfBirth: value.dateOfBirth,
            email: value.email,
            mobileNumber: value.mobileNumber,
            currentAddress: value.currentAddress,
            province: value.province,
            city: value.city,
            barangay: value.barangay,
        })
    );

    formData.append(
        'academicStatus',
        JSON.stringify({
            degreeProgram: value.degreeProgram,
            yearGraduated: value.yearGraduated,
            studentNumber: value.studentNumber || '',
        })
    );

    formData.append(
        'professional',
        JSON.stringify({
            currentEmployer: value.currentEmployer || '',
            jobTitle: value.jobTitle || '',
            industry: value.industry || '',
            yearsOfExperience: value.yearsOfExperience || '',
        })
    );

    formData.append(
        'membership',
        JSON.stringify({
            paymentMethod: value.paymentMethod,
            dataPrivacyConsent: value.dataPrivacyConsent,
            gcashReferenceNumber: value.gcashReferenceNumber || '',
            bankName: value.bankName || '',
            bankAccountNumber: value.bankAccountNumber || '',
            bankReferenceNumber: value.bankReferenceNumber || '',
            bankSenderName: value.bankSenderName || '',
            cashPaymentDate: value.cashPaymentDate || '',
            cashReceivedBy: value.cashReceivedBy || '',
        })
    );

    formData.append(
        'mentorship',
        JSON.stringify({
            joinMentorshipProgram: value.joinMentorshipProgram || false,
            mentorshipAreas: value.mentorshipAreas || [],
            mentorshipAreasOther: value.mentorshipAreasOther || '',
            mentorshipAvailability: value.mentorshipAvailability || '',
            mentorshipFormat: value.mentorshipFormat || '',
            mentorshipIndustryTracks: value.mentorshipIndustryTracks || [],
            mentorshipIndustryTracksOther: value.mentorshipIndustryTracksOther || '',
        })
    );

    // Add file uploads
    if (value.gcashProofOfPayment) {
        formData.append('gcashProofOfPayment', value.gcashProofOfPayment);
    }
    if (value.bankProofOfPayment) {
        formData.append('bankProofOfPayment', value.bankProofOfPayment);
    }

    return formData;
};

export interface RegistrationSubmitResult {
    success: boolean;
    data?: {
        applicationId: string;
        status: string;
    };
    errors?: Record<string, unknown>;
    message?: string;
}

/**
 * Submits the registration form to the backend
 */
export const submitRegistrationForm = async (
    value: RegistrationFormValues
): Promise<RegistrationSubmitResult> => {
    const formData = buildRegistrationFormData(value);

    const response = await fetch(
        'http://localhost:8000/api/v1/registration/submit/',
        {
            method: 'POST',
            body: formData,
        }
    );

    return await response.json();
};

/**
 * Handles the form submission with toast notifications
 */
export const handleRegistrationSubmit = async (
    value: RegistrationFormValues
): Promise<boolean> => {
    console.log('Form submitted:', value);

    try {
        const result = await submitRegistrationForm(value);

        if (result.success && result.data) {
            toast.success('Registration submitted!', {
                description: `Application ID: ${result.data.applicationId}. Your application is now pending verification.`,
            });
            console.log('Success response:', result);
            return true;
        } else {
            console.error('Validation errors:', result.errors);

            // Build error message from validation errors
            let errorDescription = 'Please check your form and try again.';
            if (result.errors) {
                const errorMessages = Object.entries(result.errors)
                    .map(([field, error]) => {
                        if (typeof error === 'string') return `${field}: ${error}`;
                        return Object.entries(error as Record<string, string>)
                            .map(([subField, msg]) => `${subField}: ${msg}`)
                            .join(', ');
                    })
                    .join('; ');
                errorDescription = errorMessages;
            } else if (result.message) {
                errorDescription = result.message;
            }

            toast.error('Submission failed', {
                description: errorDescription,
            });
            return false;
        }
    } catch (error) {
        console.error('Submission error:', error);
        toast.error('Submission failed', {
            description: 'An unexpected error occurred. Please try again.',
        });
        return false;
    }
};
