import { auth } from "@clerk/nextjs";
import prismadb from "./prismadb";
import { MAX_FREE_COUNTS } from "@/constants";

export const increaseApiLimit = async () => {
  const { userId } = auth();
  //if user is not available break code or return
  if (!userId) {
    return false;
  }

  // Find user if its all ready exist in modal
  const userApiLimit = await prismadb.userApiLimit.findUnique({
    where: {
      userId: userId,
    },
  });

  // If user all ready exist in modal then increase the limit else  we will create new user limits
  if (userApiLimit) {
    await prismadb.userApiLimit.update({
      where: { userId: userId },
      data: { count: userApiLimit.count + 1 }, //increase the count
    });
  } else {
    await prismadb.userApiLimit.create({
      data: { userId: userId, count: 1 }, //create new user limits
    });
  }
};
// Check Whether current user reached the api limit or not
export const isApiLimitReached = async () => {
  const { userId } = auth();

  //if user is not available break code or return
  if (!userId) {
    return false;
  }

  // Else Fetch user api limits
  const userApiLimit = await prismadb.userApiLimit.findUnique({
    where: {
      userId: userId,
    },
  });

  if (!userApiLimit || userApiLimit.count < MAX_FREE_COUNTS) {
    return true;
  } else {
    return false;
  }
};
