import { useState } from "react";
import { toast } from "react-toastify";

import { useAuthValues } from "@/contexts/contextAuth";

import { API_BASE_URL, API_VERSION } from "@/libs/constants";

import { IPayment } from "@/interfaces/IPayment";

const usePayment = () => {
  const { accessToken } = useAuthValues();
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const fetchPaymentSettings = async () => {
    setIsLoading(true);

    const response = await fetch(
      `${API_BASE_URL}/${API_VERSION}/admin/payment-gateways`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    if (response.ok) {
      setIsLoading(false);
      if (response) {
        const data = (await response.json()) as IPayment;
        return data;
      }
    }
    setIsLoading(false);
    return null;
  };

  const updatePaymentSettingsPaypal = async (
    paypalClientId?: string,
    paypalClientSecret?: string
  ) => {
    setIsLoading(true);

    const response = await fetch(
      `${API_BASE_URL}/${API_VERSION}/admin/payment-gateways`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({
          paypalClientId,
          paypalClientSecret,
        }),
      }
    );

    if (response.ok) {
      setIsLoading(false);
      const data = (await response.json()) as IPayment;
      return data;
    } else {
      if (response.status == 500) {
        toast.error("Error occured on updating the payment gateway settings.");
      } else {
        const data = await response.json();
        toast.error(data.message);
      }
    }

    setIsLoading(false);
    return null;
  };

  const updatePaymentSettingsStripe = async (
    stripePublicApiKey?: string,
    stripeSecretKey?: string
  ) => {
    setIsLoading(true);

    const response = await fetch(
      `${API_BASE_URL}/${API_VERSION}/admin/payment-gateways`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({
          stripePublicApiKey,
          stripeSecretKey,
        }),
      }
    );

    if (response.ok) {
      setIsLoading(false);
      const data = (await response.json()) as IPayment;
      return data;
    } else {
      if (response.status == 500) {
        toast.error("Error occured on updating the payment gateway settings.");
      } else {
        const data = await response.json();
        toast.error(data.message);
      }
    }

    setIsLoading(false);
    return null;
  };

  return {
    isLoading,
    fetchPaymentSettings,
    updatePaymentSettingsStripe,
    updatePaymentSettingsPaypal,
  };
};
export default usePayment;
