import Stripe from "stripe";
import dotenv from "dotenv";
import BillingRepository from "./repository.js";
import UserRepository from "../users/repository.js";

dotenv.config();

const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
const stripe = stripeSecretKey ? new Stripe(stripeSecretKey) : null;
const TRIAL_PERIOD_DAYS = 0;

const relevantEvents = new Set([
  "product.created",
  "product.updated",
  "product.deleted",
  "price.created",
  "price.updated",
  "price.deleted",
  "checkout.session.completed",
  "customer.subscription.created",
  "customer.subscription.updated",
  "customer.subscription.deleted",
]);

function getStripeClient() {
  if (!stripe) {
    const error = new Error(
      "Stripe não configurado. Defina STRIPE_SECRET_KEY no ambiente.",
    );
    error.status = 500;
    throw error;
  }

  return stripe;
}

function getDomain() {
  return process.env.STRIPE_DOMAIN || "http://localhost:3000";
}

function buildWebhookEvent(rawBody, signature) {
  const stripeClient = getStripeClient();
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (webhookSecret) {
    try {
      return stripeClient.webhooks.constructEvent(
        rawBody,
        signature,
        webhookSecret,
      );
    } catch {
      const error = new Error("Assinatura do webhook Stripe inválida");
      error.status = 400;
      throw error;
    }
  }

  return JSON.parse(rawBody.toString("utf8"));
}

function toDateFromUnix(unixSeconds) {
  if (!unixSeconds) {
    return null;
  }

  return new Date(unixSeconds * 1000);
}

function toStripeId(value) {
  if (!value) {
    return null;
  }

  return typeof value === "string" ? value : value.id;
}

function wait(ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

async function upsertProductRecord(product) {
  await BillingRepository.upsertProduct({
    id: product.id,
    active: product.active,
    name: product.name,
    description: product.description ?? null,
    image: product.images?.[0] ?? null,
    metadata: product.metadata || {},
  });
}

async function upsertPriceRecord(price, retryCount = 0, maxRetries = 3) {
  try {
    await BillingRepository.upsertPrice({
      id: price.id,
      productId:
        typeof price.product === "string" ? price.product : price.product.id,
      active: price.active,
      currency: price.currency,
      type: price.type,
      unitAmount: price.unit_amount ?? null,
      interval: price.recurring?.interval ?? null,
      intervalCount: price.recurring?.interval_count ?? null,
      trialPeriodDays: price.recurring?.trial_period_days ?? TRIAL_PERIOD_DAYS,
      nickname: price.nickname ?? null,
      metadata: price.metadata || {},
    });
  } catch (error) {
    const errorMessage = String(error?.message || "");
    const isForeignKeyError = /foreign key/i.test(errorMessage);

    if (isForeignKeyError && retryCount < maxRetries) {
      await wait(1500);
      return upsertPriceRecord(price, retryCount + 1, maxRetries);
    }

    throw error;
  }
}

async function deleteProductRecord(product) {
  await BillingRepository.deleteProduct(product.id);
}

async function deletePriceRecord(price) {
  await BillingRepository.deletePrice(price.id);
}

async function manageSubscriptionStatusChange(
  subscriptionId,
  customerId,
  createAction = false,
) {
  if (!subscriptionId || !customerId) {
    const error = new Error(
      "Evento de assinatura sem subscriptionId/customerId válido.",
    );
    error.status = 400;
    throw error;
  }

  const subscription = await getStripeClient().subscriptions.retrieve(
    subscriptionId,
    {
      expand: ["items.data.price", "default_payment_method"],
    },
  );

  const user = await UserRepository.findByStripeCustomerId(customerId);
  const firstItem = subscription.items.data[0];
  const priceId = firstItem?.price?.id || null;

  await BillingRepository.upsertSubscription({
    id: subscription.id,
    userId: user?.id || null,
    customerId,
    priceId,
    status: subscription.status,
    cancelAtPeriodEnd: subscription.cancel_at_period_end,
    cancelAt: toDateFromUnix(subscription.cancel_at),
    canceledAt: toDateFromUnix(subscription.canceled_at),
    currentPeriodStart: toDateFromUnix(subscription.current_period_start),
    currentPeriodEnd: toDateFromUnix(subscription.current_period_end),
    trialStart: toDateFromUnix(subscription.trial_start),
    trialEnd: toDateFromUnix(subscription.trial_end),
    metadata: subscription.metadata || {},
  });

  if (createAction) {
    console.log(
      `[Stripe billing] assinatura criada/sincronizada ${subscription.id} para customer ${customerId}`,
    );
  }
}

async function syncCheckoutSessionToUser(session) {
  const userIdRaw = session.metadata?.userId || session.client_reference_id;
  const userId = userIdRaw ? Number(userIdRaw) : null;
  const customerId = toStripeId(session.customer);

  if (!userId || !customerId) {
    return;
  }

  await UserRepository.updateStripeBilling(userId, {
    stripeCustomerId: customerId,
  });
}

export default class BillingService {
  static async listProducts() {
    const products = await BillingRepository.listActiveProductsWithPrices();

    return products.map((product) => ({
      id: product.id,
      active: product.active,
      name: product.name,
      description: product.description,
      image: product.image,
      metadata: product.metadata,
      prices: (product.prices || []).map((price) => ({
        id: price.id,
        productId: price.productId,
        active: price.active,
        currency: price.currency,
        type: price.type,
        unitAmount: price.unitAmount,
        interval: price.interval,
        intervalCount: price.intervalCount,
        trialPeriodDays: price.trialPeriodDays,
        nickname: price.nickname,
        metadata: price.metadata,
      })),
    }));
  }

  static async listPrices(filters) {
    const prices = await BillingRepository.listPrices(filters);

    return prices.map((price) => ({
      id: price.id,
      productId: price.productId,
      active: price.active,
      currency: price.currency,
      type: price.type,
      unitAmount: price.unitAmount,
      interval: price.interval,
      intervalCount: price.intervalCount,
      trialPeriodDays: price.trialPeriodDays,
      nickname: price.nickname,
      metadata: price.metadata,
      product: price.product
        ? {
            id: price.product.id,
            name: price.product.name,
            active: price.product.active,
          }
        : null,
    }));
  }

  static async getMySubscription(userId) {
    const user = await UserRepository.findBillingById(userId);

    if (!user) {
      const error = new Error("Usuário não encontrado");
      error.status = 404;
      throw error;
    }

    const subscription =
      await BillingRepository.findLatestSubscriptionByUserId(userId);

    return {
      userId: user.id,
      email: user.email,
      customerId: user.stripeCustomerId,
      subscription: subscription
        ? {
            id: subscription.id,
            status: subscription.status,
            priceId: subscription.priceId,
            customerId: subscription.customerId,
            currentPeriodStart: subscription.currentPeriodStart,
            currentPeriodEnd: subscription.currentPeriodEnd,
            cancelAtPeriodEnd: subscription.cancelAtPeriodEnd,
            cancelAt: subscription.cancelAt,
            canceledAt: subscription.canceledAt,
            trialStart: subscription.trialStart,
            trialEnd: subscription.trialEnd,
            metadata: subscription.metadata,
            price: subscription.price
              ? {
                  id: subscription.price.id,
                  currency: subscription.price.currency,
                  unitAmount: subscription.price.unitAmount,
                  interval: subscription.price.interval,
                  intervalCount: subscription.price.intervalCount,
                  nickname: subscription.price.nickname,
                }
              : null,
          }
        : null,
    };
  }

  static async createCheckoutSession(data, userId) {
    const stripeClient = getStripeClient();

    const user = await UserRepository.findAuthById(userId);
    if (!user) {
      const error = new Error("Usuário não encontrado");
      error.status = 404;
      throw error;
    }

    const prices = await stripeClient.prices.list({
      lookup_keys: [data.lookupKey],
      expand: ["data.product"],
    });

    const selectedPrice = prices.data[0];
    if (!selectedPrice) {
      const error = new Error(
        "Preço Stripe não encontrado para o lookup key informado",
      );
      error.status = 404;
      throw error;
    }

    const successUrl =
      data.successUrl ||
      `${getDomain()}/?success=true&session_id={CHECKOUT_SESSION_ID}`;
    const cancelUrl = data.cancelUrl || `${getDomain()}/?canceled=true`;

    const session = await stripeClient.checkout.sessions.create({
      billing_address_collection: "auto",
      line_items: [
        {
          price: selectedPrice.id,
          quantity: data.quantity,
        },
      ],
      mode: data.mode,
      success_url: successUrl,
      cancel_url: cancelUrl,
      client_reference_id: String(userId),
      metadata: {
        userId: String(userId),
      },
    });

    return {
      sessionId: session.id,
      url: session.url,
    };
  }

  static async createPortalSession(sessionId, userId) {
    const stripeClient = getStripeClient();

    let customerId = null;

    if (sessionId) {
      const checkoutSession =
        await stripeClient.checkout.sessions.retrieve(sessionId);
      customerId = toStripeId(checkoutSession.customer);
    }

    if (!customerId && userId) {
      const user = await UserRepository.findAuthById(userId);
      customerId = user?.stripeCustomerId || null;
    }

    if (!customerId) {
      const error = new Error(
        "Customer Stripe não encontrado. Envie sessionId ou finalize um checkout primeiro.",
      );
      error.status = 400;
      throw error;
    }

    const portalSession = await stripeClient.billingPortal.sessions.create({
      customer: customerId,
      return_url: getDomain(),
    });

    return {
      url: portalSession.url,
    };
  }

  static async handleWebhook(rawBody, signature) {
    const event = buildWebhookEvent(rawBody, signature);

    if (!relevantEvents.has(event.type)) {
      const error = new Error(`Unsupported event type: ${event.type}`);
      error.status = 400;
      throw error;
    }

    let status = null;

    try {
      switch (event.type) {
        case "product.created":
        case "product.updated":
          await upsertProductRecord(event.data.object);
          break;
        case "product.deleted":
          await deleteProductRecord(event.data.object);
          break;
        case "price.created":
        case "price.updated":
          await upsertPriceRecord(event.data.object);
          break;
        case "price.deleted":
          await deletePriceRecord(event.data.object);
          break;
        case "checkout.session.completed": {
          const checkoutSession = event.data.object;
          await syncCheckoutSessionToUser(checkoutSession);

          if (
            checkoutSession.mode === "subscription" &&
            checkoutSession.subscription &&
            checkoutSession.customer
          ) {
            await manageSubscriptionStatusChange(
              toStripeId(checkoutSession.subscription),
              toStripeId(checkoutSession.customer),
              true,
            );
            status = "active";
          }
          break;
        }
        case "customer.subscription.created":
        case "customer.subscription.updated":
        case "customer.subscription.deleted": {
          const subscription = event.data.object;
          status = subscription.status;
          await manageSubscriptionStatusChange(
            subscription.id,
            toStripeId(subscription.customer),
            event.type === "customer.subscription.created",
          );
          break;
        }
        default:
          break;
      }
    } catch (error) {
      const wrappedError = new Error(
        "Webhook handler falhou. Verifique os logs do backend Node.",
        { cause: error },
      );
      wrappedError.status = 400;
      throw wrappedError;
    }

    return {
      received: true,
      eventType: event.type,
      status,
    };
  }
}
