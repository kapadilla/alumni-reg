import { toast } from "vue-sonner";
import type {
    RegistrationSubmitResponse,
    EmailCheckResponse,
    RegistrationFormData,
} from "~/types";

export const useRegistration = () => {
    const { post, get } = useApi();

    const isSubmitting = ref(false);

    // Submit registration
    const submitRegistration = async (
        formData: RegistrationFormData,
    ): Promise<RegistrationSubmitResponse | null> => {
        isSubmitting.value = true;
        try {
            const response = await post<RegistrationSubmitResponse>(
                "/registration/submit/",
                formData,
            );

            if (response.success && response.data) {
                toast.success("Registration submitted!", {
                    description: "Your application has been received and is pending verification.",
                });
                return response.data;
            }
            else {
                // Handle validation errors
                if (response.errors) {
                    const errorMessages = Object.entries(response.errors)
                        .map(([field, error]) => {
                            if (typeof error === "string") return `${field}: ${error}`;
                            return Object.entries(error)
                                .map(([subField, msg]) => `${subField}: ${msg}`)
                                .join(", ");
                        })
                        .join("; ");
                    toast.error("Validation failed", { description: errorMessages });
                }
                else {
                    toast.error("Registration failed", {
                        description: response.message || "Please try again later.",
                    });
                }
                return null;
            }
        }
        catch {
            toast.error("Registration failed", {
                description: "An unexpected error occurred. Please try again.",
            });
            return null;
        }
        finally {
            isSubmitting.value = false;
        }
    };

    // Check email availability
    const checkEmailAvailability = async (
        email: string,
    ): Promise<{ available: boolean; message: string }> => {
        try {
            const response = await get<EmailCheckResponse>(
                "/registration/check-email/",
                { email },
            );

            if (response.success && response.data) {
                return response.data;
            }
            return { available: false, message: "Unable to check email" };
        }
        catch {
            return { available: false, message: "Unable to check email" };
        }
    };

    return {
        isSubmitting,
        submitRegistration,
        checkEmailAvailability,
    };
};
