import type {
  PublicFormSettingsResponse,
  GcashAccount,
  BankAccount,
  CashPaymentDetails,
} from "~/types";

// Public form settings state (shared across components)
const publicFormSettings = ref<PublicFormSettingsResponse | null>(null);
const publicFormSettingsLoading = ref(false);
const publicFormSettingsFetched = ref(false);

export const usePublicFormSettings = () => {
  // Fetch public form settings (no auth required)
  const fetchPublicFormSettings =
    async (): Promise<PublicFormSettingsResponse | null> => {
      // Return cached data if already fetched
      if (publicFormSettingsFetched.value && publicFormSettings.value) {
        return publicFormSettings.value;
      }

      publicFormSettingsLoading.value = true;
      try {
        const response = await $fetch<{
          success: boolean;
          data?: PublicFormSettingsResponse;
        }>("/public/form-settings/", {
          baseURL: useRuntimeConfig().public.apiBaseUrl as string,
        });

        if (response.success && response.data) {
          publicFormSettings.value = response.data;
          publicFormSettingsFetched.value = true;
          return response.data;
        }
        return null;
      } catch (error) {
        console.error("Error fetching public form settings:", error);
        return null;
      } finally {
        publicFormSettingsLoading.value = false;
      }
    };

  // Helper to format membership fee
  const formatMembershipFee = (fee: number): string => {
    return new Intl.NumberFormat("en-PH", {
      style: "currency",
      currency: "PHP",
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    }).format(fee);
  };

  // Helper to get GCash accounts
  const getGcashAccounts = (): GcashAccount[] => {
    return publicFormSettings.value?.paymentMethods?.gcash?.accounts || [];
  };

  // Helper to get bank accounts
  const getBankAccounts = (): BankAccount[] => {
    return publicFormSettings.value?.paymentMethods?.bank?.accounts || [];
  };

  // Helper to get cash payment details
  const getCashPaymentDetails = (): CashPaymentDetails | null => {
    return publicFormSettings.value?.paymentMethods?.cash || null;
  };

  // Helper to format open days
  const formatOpenDays = (days: string[]): string => {
    if (!days || days.length === 0) return "";

    const dayLabels: Record<string, string> = {
      mon: "Monday",
      tue: "Tuesday",
      wed: "Wednesday",
      thu: "Thursday",
      fri: "Friday",
      sat: "Saturday",
      sun: "Sunday",
    };

    // Check if consecutive weekdays
    const weekdays = ["mon", "tue", "wed", "thu", "fri"];
    const weekend = ["sat", "sun"];

    const sortedDays = [...days].sort((a, b) => {
      const order = ["mon", "tue", "wed", "thu", "fri", "sat", "sun"];
      return order.indexOf(a) - order.indexOf(b);
    });

    // Check for "Monday - Friday"
    if (
      sortedDays.length === 5 &&
      weekdays.every((d) => sortedDays.includes(d))
    ) {
      return "Monday - Friday";
    }

    // Check for "Monday - Saturday"
    if (
      sortedDays.length === 6 &&
      weekdays.every((d) => sortedDays.includes(d)) &&
      sortedDays.includes("sat")
    ) {
      return "Monday - Saturday";
    }

    // Check for "Everyday"
    if (sortedDays.length === 7) {
      return "Everyday";
    }

    // Check for "Weekends"
    if (
      sortedDays.length === 2 &&
      weekend.every((d) => sortedDays.includes(d))
    ) {
      return "Weekends";
    }

    // Otherwise list them
    return sortedDays.map((d) => dayLabels[d] || d).join(", ");
  };

  // Get success message
  const getSuccessMessage = (): string => {
    return publicFormSettings.value?.successMessage || "";
  };

  // Get membership fee
  const getMembershipFee = (): number => {
    return publicFormSettings.value?.membershipFee || 1450;
  };

  return {
    publicFormSettings: readonly(publicFormSettings),
    loading: readonly(publicFormSettingsLoading),
    fetched: readonly(publicFormSettingsFetched),
    fetchPublicFormSettings,
    formatMembershipFee,
    getGcashAccounts,
    getBankAccounts,
    getCashPaymentDetails,
    formatOpenDays,
    getSuccessMessage,
    getMembershipFee,
  };
};
