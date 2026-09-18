import crypto from "crypto";
import { InternalServerError } from "../utils/errors.js";

/**
 * Authenticates with Paymob to retrieve an authentication token.
 * @returns {Promise<string>} The authentication token.
 */
export const authenticatePaymob = async () => {
  try {
    const response = await fetch("https://accept.paymob.com/api/auth/tokens", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ api_key: process.env.PAYMOB_API_KEY }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Authentication failed");
    }

    const data = await response.json();
    return data.token;
  } catch (error) {
    console.error("Paymob Authentication Error:", error.message);
    throw new InternalServerError("Paymob Authentication Failed: " + error.message);
  }
};

/**
 * Registers the order on Paymob ecommerce.
 * @param {string} authToken - The Paymob authentication token.
 * @param {number} amountCents - Order total in cents.
 * @param {string} merchantOrderId - Database Order ID.
 * @param {Array} items - List of products in the order.
 * @returns {Promise<number>} The Paymob Order ID.
 */
export const createPaymobOrder = async (authToken, amountCents, merchantOrderId, items) => {
  try {
    const paymobItems = items.map(item => ({
      name: item.name || "Product",
      amount_cents: Math.round(item.price * 100),
      description: item.name || "Product description",
      quantity: item.quantity || 1,
    }));

    const response = await fetch("https://accept.paymob.com/api/ecommerce/orders", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        auth_token: authToken,
        delivery_needed: "false",
        amount_cents: Math.round(amountCents),
        currency: "EGP",
        merchant_order_id: merchantOrderId.toString(),
        items: paymobItems,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Order creation failed");
    }

    const data = await response.json();
    return data.id; // Paymob order ID
  } catch (error) {
    console.error("Paymob Order Creation Error:", error.message);
    throw new InternalServerError("Paymob Order Registration Failed: " + error.message);
  }
};

/**
 * Generates the payment token key from Paymob.
 * @param {string} authToken - The Paymob authentication token.
 * @param {number} amountCents - Order total in cents.
 * @param {number} paymobOrderId - The Paymob Order ID.
 * @param {Object} billingData - User billing info.
 * @returns {Promise<string>} The payment token key.
 */
export const generatePaymentKey = async (authToken, amountCents, paymobOrderId, billingData) => {
  try {
    const response = await fetch("https://accept.paymob.com/api/acceptance/payment_keys", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        auth_token: authToken,
        amount_cents: Math.round(amountCents),
        expiration: 3600, // 1 hour
        order_id: paymobOrderId,
        billing_data: {
          first_name: billingData.first_name || "NA",
          last_name: billingData.last_name || "NA",
          email: billingData.email || "NA",
          phone_number: billingData.phone_number || "NA",
          street: billingData.street || "NA",
          building: billingData.building || "NA",
          apartment: billingData.apartment || "NA",
          floor: billingData.floor || "NA",
          city: billingData.city || "NA",
          country: billingData.country || "EG",
          postal_code: billingData.postal_code || "NA",
        },
        integration_id: parseInt(process.env.PAYMOB_INTEGRATION_ID, 10),
        currency: "EGP",
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Payment key generation failed");
    }

    const data = await response.json();
    return data.token;
  } catch (error) {
    console.error("Paymob Payment Key Error:", error.message);
    throw new InternalServerError("Paymob Payment Key Generation Failed: " + error.message);
  }
};

/**
 * Verifies Paymob's transaction HMAC signature.
 * @param {string} hmacReceived - HMAC signature from query param.
 * @param {Object} transactionObj - The `obj` field inside Paymob webhook payload.
 * @param {string} secret - The PAYMOB_HMAC_SECRET.
 * @returns {boolean} True if HMAC signature is valid.
 */
export const verifyPaymobHmac = (hmacReceived, transactionObj, secret) => {
  if (!hmacReceived || !transactionObj || !secret) {
    return false;
  }

  // Concatenate transaction values in the strict order required by Paymob
  const concatenatedString = [
    transactionObj.amount_cents,
    transactionObj.created_at,
    transactionObj.currency,
    transactionObj.error_occured,
    transactionObj.has_parent_transaction,
    transactionObj.id,
    transactionObj.integration_id,
    transactionObj.is_3d_secure,
    transactionObj.is_auth,
    transactionObj.is_capture,
    transactionObj.is_refunded,
    transactionObj.is_standalone_payment,
    transactionObj.is_voided,
    transactionObj.order?.id || transactionObj.order,
    transactionObj.owner,
    transactionObj.pending,
    transactionObj.refunded_amount_cents,
    transactionObj.source_data?.pan,
    transactionObj.source_data?.sub_type,
    transactionObj.source_data?.type,
    transactionObj.success,
  ]
    .map(val => (val !== undefined && val !== null ? val.toString() : ""))
    .join("");

  const calculatedHmac = crypto
    .createHmac("sha512", secret)
    .update(concatenatedString)
    .digest("hex");

  try {
    return crypto.timingSafeEqual(
      Buffer.from(hmacReceived, "hex"),
      Buffer.from(calculatedHmac, "hex")
    );
  } catch (e) {
    return hmacReceived === calculatedHmac;
  }
};
