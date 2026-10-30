import { User } from "../models/user.model";
import { AppError } from "../utils/app-error";
import {
  getLoginCooldownMs,
  getRetryAfterSeconds,
} from "../utils/login-security";

export const checkLoginCooldown = (loginLockedUntil: Date | null): void => {
  if (!loginLockedUntil || loginLockedUntil.getTime() <= Date.now()) {
    return;
  }

  const retryAfterSeconds = getRetryAfterSeconds(loginLockedUntil);

  throw new AppError(
    `Too many failed login attempts. Please try again in ${retryAfterSeconds} seconds.`,
    429,
  );
};

export const registerFailedLogin = async (userId: string): Promise<never> => {
  const updatedUser = await User.findByIdAndUpdate(
    userId,
    [
      {
        $set: {
          failedLoginAttempts: {
            $add: ["$failedLoginAttempts", 1],
          },
        },
      },
      {
        $set: {
          loginLockedUntil: {
            $switch: {
              branches: [
                {
                  case: { $gte: ["$failedLoginAttempts", 8] },
                  then: {
                    $dateAdd: {
                      startDate: "$$NOW",
                      unit: "minute",
                      amount: 15,
                    },
                  },
                },
                {
                  case: { $eq: ["$failedLoginAttempts", 7] },
                  then: {
                    $dateAdd: {
                      startDate: "$$NOW",
                      unit: "minute",
                      amount: 5,
                    },
                  },
                },
                {
                  case: { $eq: ["$failedLoginAttempts", 6] },
                  then: {
                    $dateAdd: {
                      startDate: "$$NOW",
                      unit: "minute",
                      amount: 1,
                    },
                  },
                },
                {
                  case: { $eq: ["$failedLoginAttempts", 5] },
                  then: {
                    $dateAdd: {
                      startDate: "$$NOW",
                      unit: "second",
                      amount: 30,
                    },
                  },
                },
              ],
              default: null,
            },
          },
        },
      },
    ],
    { new: true },
  );

  if (!updatedUser) {
    throw new AppError("Invalid email or password", 401);
  }

  const cooldownMs = getLoginCooldownMs(updatedUser.failedLoginAttempts);

  if (cooldownMs > 0) {
    throw new AppError(
      `Too many failed login attempts. Please try again in ${Math.ceil(
        cooldownMs / 1000,
      )} seconds.`,
      429,
    );
  }

  throw new AppError("Invalid email or password", 401);
};

export const resetLoginSecurity = async (userId: string): Promise<void> => {
  await User.findByIdAndUpdate(userId, {
    $set: {
      failedLoginAttempts: 0,
      loginLockedUntil: null,
    },
  });
};
