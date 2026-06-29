'use server';

import sgMail from '@sendgrid/mail';

import { isBlockedCountry } from '@/shared/config/blocked-countries';
import {
  BASE_CURRENCY,
  convertFromBase,
  type CurrencyCode,
  formatPrice,
} from '@/shared/config/currencies';
import {
  EMAIL_FROM,
  FROM_EMAIL,
  SENDGRID_API_KEY,
  SERVER_URL,
  SITE_URL,
} from '@/shared/config/env';

import type { CheckoutFormSchema } from '../model/schema';
import type { CartItem } from '../model/types';
import { checkOrderBlocked } from './check-blocked';
import { syncOrderToZoho } from './zoho/sync-order';

import { login } from '@/core/user/api/login';
import { credentialsBody } from '@/featured/email-letters/credentials-body';
import { orderConfirmBody } from '@/featured/email-letters/order-confirm-body';

sgMail.setApiKey(SENDGRID_API_KEY);

type OrderMeta = {
  utmSource?: string | null;
  coupon?: string | null;
  /**
   * Skip the browser auto-login after creating a new customer. Set for
   * server-to-server orders (e.g. the external-order endpoint) where there is
   * no browser session to attach the auth cookies to.
   */
  skipAutoLogin?: boolean;
  /** FingerprintJS Pro device visitor ID captured at checkout (fraud signal). */
  deviceFingerprint?: string | null;
};

export const postOrder = async (
  data: CheckoutFormSchema,
  total: number,
  cart: CartItem[],
  currency: CurrencyCode = BASE_CURRENCY,
  meta: OrderMeta = {}
) => {
  console.log('Cart items received:', cart);
  console.log(
    'Cart item IDs:',
    cart.map((item) => ({ id: item.id, name: item.name }))
  );

  // Hard block: never create an order for a restricted country, even if the
  // client-side check was bypassed.
  if (isBlockedCountry(data.country)) {
    throw new Error('Orders are not available for the selected country.');
  }

  // Hard block: silently reject orders whose email/IP is on the Google Sheets
  // block list, even if the client-side check was bypassed. Fails open.
  if (await checkOrderBlocked(data.email)) {
    throw new Error('Orders are not available at this time.');
  }

  // Customer-facing emails (registration credentials + order confirmation) are
  // only sent for organic orders. If the order carries any utm_source, suppress
  // every email sent to the customer.
  const hasUtmSource = Boolean(meta.utmSource && meta.utmSource.trim());

  let userId = null;
  let authUser = null;
  const existingUser = await fetchUserByEmail(data.email);

  if (existingUser) {
    userId = existingUser.id;
  } else {
    const password = Math.random().toString(36).slice(-8);

    const newUser = await createUser(data, password);

    console.log('newUser', newUser);

    userId = newUser.doc.id;

    // Automatically sign the new customer in so they stay logged in after
    // ordering. Skipped for server-to-server orders (no browser to receive the
    // cookies — see meta.skipAutoLogin).
    if (!meta.skipAutoLogin) {
      try {
        const loginResult = await login({ email: data.email, password });
        if (loginResult.success) {
          authUser = loginResult.user;
        }
      } catch (error) {
        console.error('Auto-login after order failed:', error);
      }
    }

    // Send the new customer their login credentials. Skipped for orders that
    // carry a utm_source (see hasUtmSource).
    if (!hasUtmSource) {
      try {
        await sgMail.send({
          to: data.email,
          from: EMAIL_FROM,
          subject: 'Your Moddle 3D account is ready',
          html: credentialsBody({
            username: data.firstName,
            email: data.email,
            password,
            loginUrl: `${SITE_URL}/login`,
          }),
        });
      } catch (error) {
        console.error('Failed to send credentials email:', error);
      }
    }
  }

  const items = await Promise.all(
    cart.map(async (item) => {
      try {
        const productDetails = await validateAndGetProductDetails(item.id);

        if (!productDetails) {
          throw new Error(`Product with ID ${item.id} not found`);
        }

        const { fileurl, filename } = await getFileUrlForProduct(item.id);

        return {
          product: productDetails.id,
          quantity: item.quantity,
          price: item.price,
          file_url: fileurl,
          file_name: filename,
        };
      } catch (error) {
        console.error(`Error processing item ${item.id}:`, error);
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        throw new Error(`Invalid product: ${item.id} - ${errorMessage}`);
      }
    })
  );

  const orderNumber = `MDL_${Math.floor(Math.random() * 900000) + 100000}`;

  const convertedTotal = convertFromBase(total, currency);
  const formattedTotal = formatPrice(total, currency);

  // Coupon / UTM aren't dedicated CMS fields yet, so attach them to orderNotes.
  const orderNotes = [
    data.orderNotes || '',
    meta.coupon ? `Coupon: ${meta.coupon}\n` : '',
    meta.utmSource ? `UTM Source: ${meta.utmSource}\n` : '',
    meta.deviceFingerprint ? `Device Fingerprint: ${meta.deviceFingerprint}\n` : '',
  ]
    .filter(Boolean)
    .join('\n');

  const orderData = {
    orderNumber,
    user: userId,
    items: items.map((item) => ({
      product: item.product,
      quantity: item.quantity,
      price: item.price,
      file_url: item.file_url,
      file_name: item.file_name,
    })),
    total: convertedTotal,
    currency,
    status: 'pending',
    paymentMethod: 'bank_transfer',
    billingAddress: {
      address1: data.address1,
      address2: data.address2,
      city: data.city,
      zip: data.zip,
      country: data.country,
    },
    orderNotes,
  };

  if (!userId) {
    throw new Error('User ID is required to create an order');
  }

  if (!items || items.length === 0) {
    throw new Error('Order must contain at least one item');
  }

  console.log('Sending order data:', JSON.stringify(orderData, null, 2));

  const response = await fetch(`${SERVER_URL}/api/orders`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(orderData),
  });

  const adminMsg = {
    to: FROM_EMAIL,
    from: EMAIL_FROM,
    subject: `New Order Received - ${orderNumber}`,
    html: `
    <p>New Order Received - ${orderNumber}</p>
    <p>User: ${data.firstName} ${data.lastName}</p>
    <p>Email: ${data.email}</p>
    <p>Phone: ${data.phone}</p>
    <p>Address: ${data.address1}, ${data.address2}, ${data.city}, ${data.zip}, ${data.country}</p>
    <p>Order Notes: ${data.orderNotes}</p>
    <p>Total: ${formattedTotal} (${currency})</p>
    <p>Items: ${cart.map((item) => item.name).join(', ')}</p>
    ${meta.coupon ? `<p>Coupon: ${meta.coupon}</p>` : ''}
    ${meta.utmSource ? `<p>UTM Source: ${meta.utmSource}</p>` : ''}
    `,
  };

  const userMsg = {
    to: data.email,
    from: EMAIL_FROM,
    subject: `Your Order is On! Let’s Get This Party Started – ${orderNumber}`,
    html: orderConfirmBody({
      username: data.firstName,
      orderNumber,
      description: cart.map((item) => item.name).join(', '),
      total: formattedTotal,
      orderDate: new Date().toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      }),
    }),
  };

  if (!response.ok) {
    console.error(`Order creation failed with status: ${response.status}`);
    const errorText = await response.text();
    console.error('Error response:', errorText);
    throw new Error(`Failed to create order: ${response.status} - ${errorText}`);
  }

  // Send confirmation emails only after the order was successfully created.
  // A failing email should never break a paid order, so each send is isolated.
  // The customer confirmation is suppressed for orders carrying a utm_source.
  if (!hasUtmSource) {
    try {
      await sgMail.send(userMsg);
    } catch (error) {
      console.error('Failed to send order confirmation email to customer:', error);
    }
  }

  try {
    await sgMail.send(adminMsg);
  } catch (error) {
    console.error('Failed to send order notification email to admin:', error);
  }

  // Push the order into Zoho CRM. Isolated so a Zoho failure never breaks a
  // successfully placed order.
  try {
    await syncOrderToZoho({
      data,
      cart,
      total,
      currency,
      orderNumber,
      utmSource: meta.utmSource,
      coupon: meta.coupon,
      deviceFingerprint: meta.deviceFingerprint,
    });
  } catch (error) {
    console.error('Failed to sync order to Zoho CRM:', error);
  }

  const order = await response.json();

  return { ...order, authUser };
};

export const fetchUserByEmail = async (email: string) => {
  const response = await fetch(`${SERVER_URL}/api/users?where[email][equals]=${email}`);

  if (!response.ok) {
    console.error(`Failed to fetch user by email: ${response.status}`);
    return null;
  }

  const data = await response.json();
  return data.docs && data.docs.length > 0 ? data.docs[0] : null;
};

export const createUser = async (data: CheckoutFormSchema, password: string) => {
  const userData = {
    email: data.email,
    firstName: data.firstName,
    lastName: data.lastName,
    phone: data.phone,
    password: password,
  };

  console.log('Creating user with data:', JSON.stringify(userData, null, 2));

  const response = await fetch(`${SERVER_URL}/api/users`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(userData),
  });

  if (!response.ok) {
    console.error(`Failed to create user: ${response.status}`);
    const errorText = await response.text();
    console.error('User creation error:', errorText);
    throw new Error(`Failed to create user: ${response.status} - ${errorText}`);
  }

  return response.json();
};

const validateAndGetProductDetails = async (productId: string | number) => {
  try {
    console.log(`Validating product ID: "${productId}" (type: ${typeof productId})`);

    // Convert to string and sanitize the product ID - remove any extra spaces or invalid characters
    const sanitizedProductId = String(productId).trim();
    console.log(`Sanitized product ID: "${sanitizedProductId}"`);

    // Encode the product ID to handle special characters
    const encodedProductId = encodeURIComponent(sanitizedProductId);
    const url = `${SERVER_URL}/api/products/${encodedProductId}`;

    console.log('Validating product details from:', url);

    const res = await fetch(url);

    if (!res.ok) {
      console.error(`HTTP error! status: ${res.status} for product id: ${productId}`);

      // If the direct ID lookup fails, try to search by title
      console.log('Trying to search by title as fallback...');
      const searchUrl = `${SERVER_URL}/api/products?where[title][equals]=${encodeURIComponent(sanitizedProductId)}`;
      console.log('Searching by title:', searchUrl);

      const searchRes = await fetch(searchUrl);

      if (!searchRes.ok) {
        return null;
      }

      const searchData = await searchRes.json();

      if (!searchData.docs || searchData.docs.length === 0) {
        return null;
      }

      const productData = searchData.docs[0];
      console.log('Found product by title search:', productData);

      return {
        id: productData.id,
        title: productData.title,
        price: productData.price,
      };
    }

    const productData = await res.json();
    console.log('Found product by ID:', productData);

    return {
      id: productData.id,
      title: productData.title,
      price: productData.price,
    };
  } catch (error) {
    console.error(`Error validating product ${productId}:`, error);
    return null;
  }
};

const getFileUrlForProduct = async (productId: string | number) => {
  // Convert to string and sanitize the product ID - remove any extra spaces or invalid characters
  const sanitizedProductId = String(productId).trim();

  // Encode the product ID to handle special characters
  const encodedProductId = encodeURIComponent(sanitizedProductId);
  const url = `${SERVER_URL}/api/products/${encodedProductId}`;

  console.log('Fetching product details from:', url);

  const res = await fetch(url);

  if (!res.ok) {
    console.error(`HTTP error! status: ${res.status} for product id: ${sanitizedProductId}`);

    // If the direct ID lookup fails, try to search by title
    console.log('Trying to search by title as fallback...');
    const searchUrl = `${SERVER_URL}/api/products?where[title][equals]=${encodeURIComponent(sanitizedProductId)}`;
    console.log('Searching by title:', searchUrl);

    const searchRes = await fetch(searchUrl);

    if (!searchRes.ok) {
      throw new Error(`Failed to fetch product details for product id: ${sanitizedProductId}`);
    }

    const searchData = await searchRes.json();

    if (!searchData.docs || searchData.docs.length === 0) {
      throw new Error(`Product not found: ${sanitizedProductId}`);
    }

    const productData = searchData.docs[0];
    console.log('Found product by title search:', productData);

    const fileurl =
      productData?.filesurl && productData.filesurl.length > 0
        ? productData.filesurl[0].fileurl
        : null;

    const filename =
      productData?.filesurl && productData.filesurl.length > 0
        ? productData.filesurl[0].filename
        : null;

    return { fileurl, filename };
  }

  const productData = await res.json();

  console.log('productData', productData);

  const fileurl =
    productData?.filesurl && productData.filesurl.length > 0
      ? productData.filesurl[0].fileurl
      : null;

  const filename =
    productData?.filesurl && productData.filesurl.length > 0
      ? productData.filesurl[0].filename
      : null;

  return { fileurl, filename };
};
