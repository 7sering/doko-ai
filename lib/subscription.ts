import { auth } from "@clerk/nextjs";
import prismadb from "./prismadb";
import { Select } from "@radix-ui/react-select";

const DAY_IN_MS = 86_400_000;

export const checkSubscription = async () => {
  const { userId } = auth();

  if (!userId) {
    return false;
  }

  // Find the user subscription
  const userSubscription = await prismadb.userSubcription.findUnique({
    where: {
      userId: userId,
    },
    select: {
      stripeSubscriptionId: true,
      stripeCurrentPeriodEnd: true,
      stripeCustomerId: true,
      stripePriceId: true,
    },
  });

  // If there is no subscription, return false

  if (!userSubscription) {
    return false;
  }

  // If the subscription is valid, & not expired 
  const isValid =
    userSubscription.stripePriceId &&
    userSubscription.stripeCurrentPeriodEnd?.getTime()! + DAY_IN_MS >
      Date.now();

  return !!isValid;
};
