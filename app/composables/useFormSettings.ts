import type {
  FormSettings,
  FormSettingsResponse,
  GcashAccount,
  BankAccount,
  CashPaymentDetails,
  PaymentSettings,
} from "~/types";

// Default values for form settings
const defaultCashPayment: CashPaymentDetails = {
  address: "",
  building: "",
  office: "",
  openDays: [],
  openHours: "",
};

const defaultPaymentSettings: PaymentSettings = {
  gcashAccounts: [],
  bankAccounts: [],
  cashPayment: { ...defaultCashPayment },
};

const defaultFormSettings: FormSettings = {
  membershipFee: 1450,
  paymentSettings: { ...defaultPaymentSettings },
  successMessage: "",
};

export const useFormSettings = () => {
  const { get, put } = useApi();

  // State
  const settings = ref<FormSettings>(structuredClone(defaultFormSettings));
  const loading = ref(false);
  const saving = ref(false);

  /**
   * Normalize settings to ensure all required fields have proper defaults.
   * This handles cases where the API returns null or partial data.
   */
  const normalizeSettings = (
    data: Partial<FormSettings> | null,
  ): FormSettings => {
    if (!data) {
      return structuredClone(defaultFormSettings);
    }

    // Normalize cash payment - ensure all fields exist
    const rawCashPayment = data.paymentSettings?.cashPayment;
    const normalizedCashPayment: CashPaymentDetails = {
      address: rawCashPayment?.address ?? "",
      building: rawCashPayment?.building ?? "",
      office: rawCashPayment?.office ?? "",
      openDays: Array.isArray(rawCashPayment?.openDays)
        ? rawCashPayment.openDays
        : [],
      openHours: rawCashPayment?.openHours ?? "",
    };

    // Normalize payment settings
    const normalizedPaymentSettings: PaymentSettings = {
      gcashAccounts: Array.isArray(data.paymentSettings?.gcashAccounts)
        ? data.paymentSettings.gcashAccounts
        : [],
      bankAccounts: Array.isArray(data.paymentSettings?.bankAccounts)
        ? data.paymentSettings.bankAccounts
        : [],
      cashPayment: normalizedCashPayment,
    };

    // Return fully normalized settings
    return {
      membershipFee: data.membershipFee ?? defaultFormSettings.membershipFee,
      paymentSettings: normalizedPaymentSettings,
      successMessage: data.successMessage ?? "",
    };
  };

  // Fetch settings from API (admin endpoint)
  const fetchSettings = async (): Promise<FormSettings> => {
    loading.value = true;
    try {
      const response = await get<FormSettingsResponse>("/admin/settings/form/");
      if (response.success && response.data) {
        const normalized = normalizeSettings(response.data.settings);
        settings.value = normalized;
        return normalized;
      }
      // If no settings exist yet, return defaults
      return structuredClone(defaultFormSettings);
    } catch {
      // Return defaults on error
      return structuredClone(defaultFormSettings);
    } finally {
      loading.value = false;
    }
  };

  // Save settings to API (admin endpoint - PUT)
  // Backend expects only non-empty fields to be included
  const saveSettings = async (newSettings: FormSettings): Promise<boolean> => {
    saving.value = true;
    try {
      // Build paymentSettings - only include non-empty arrays/objects
      const paymentSettings: Record<string, unknown> = {};

      // Only include gcashAccounts if there are accounts
      const gcashAccounts = newSettings.paymentSettings?.gcashAccounts?.filter(
        (acc) => acc.name && acc.number,
      );
      if (gcashAccounts && gcashAccounts.length > 0) {
        paymentSettings.gcashAccounts = gcashAccounts.map((acc) => ({
          name: acc.name,
          number: acc.number,
        }));
      }

      // Only include bankAccounts if there are accounts
      const bankAccounts = newSettings.paymentSettings?.bankAccounts?.filter(
        (acc) => acc.bankName && acc.accountName && acc.accountNumber,
      );
      if (bankAccounts && bankAccounts.length > 0) {
        paymentSettings.bankAccounts = bankAccounts.map((acc) => ({
          bankName: acc.bankName,
          accountName: acc.accountName,
          accountNumber: acc.accountNumber,
        }));
      }

      // Only include cashPayment if it has any data
      const cashPayment = newSettings.paymentSettings?.cashPayment;
      const hasCashData =
        cashPayment?.address ||
        cashPayment?.building ||
        cashPayment?.office ||
        (cashPayment?.openDays && cashPayment.openDays.length > 0) ||
        cashPayment?.openHours;

      if (hasCashData) {
        paymentSettings.cashPayment = {
          address: cashPayment?.address || "",
          building: cashPayment?.building || "",
          office: cashPayment?.office || "",
          openDays: cashPayment?.openDays || [],
          openHours: cashPayment?.openHours || "",
        };
      }

      // Build the final payload
      const payload: Record<string, unknown> = {
        membershipFee: Number(newSettings.membershipFee) || 1450,
        paymentSettings,
      };

      // Only include successMessage if it has content
      if (newSettings.successMessage) {
        payload.successMessage = newSettings.successMessage;
      }

      console.log(
        "Saving form settings payload:",
        JSON.stringify(payload, null, 2),
      );

      const response = await put<FormSettingsResponse>(
        "/admin/settings/form/",
        payload,
      );
      if (response.success && response.data) {
        settings.value = normalizeSettings(response.data.settings);
        return true;
      }
      console.error("Save settings response:", response);
      return false;
    } catch (error) {
      console.error("Save settings error:", error);
      return false;
    } finally {
      saving.value = false;
    }
  };

  // Helper to create empty GCash account
  const createEmptyGcashAccount = (): GcashAccount => ({
    name: "",
    number: "",
  });

  // Helper to create empty Bank account
  const createEmptyBankAccount = (): BankAccount => ({
    accountName: "",
    accountNumber: "",
    bankName: "",
  });

  // Helper to get default cash payment details
  const getDefaultCashPayment = (): CashPaymentDetails => ({
    ...defaultCashPayment,
  });

  return {
    settings,
    loading,
    saving,
    fetchSettings,
    saveSettings,
    createEmptyGcashAccount,
    createEmptyBankAccount,
    getDefaultCashPayment,
    defaultFormSettings,
  };
};
