import HttpError from "../types/errors";

import type { RequestHandler } from "express";
import { Role, type IUser } from "@seitz/shared";
import { User } from "../models";

export const isAuthenticated: RequestHandler = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  }
  next(new HttpError(401, "Unauthorized"));
};

export const isSuperAdmin: RequestHandler = (req, res, next) => {
  const user = req.user as IUser | undefined;
  const userRole = user?.role;
  if (userRole === Role.SuperAdmin) {
    return next();
  }

  next(
    new HttpError(403, `${Role.SuperAdmin} role is required for this action`)
  );
};

export const isUserManager: RequestHandler = (req, res, next) => {
  const user = req.user as IUser | undefined;
  const userRole = user?.role;
  if (userRole === Role.SuperAdmin || userRole === Role.UserManager) {
    return next();
  }

  next(
    new HttpError(
      403,
      `${Role.UserManager} role or higher is required for this action`
    )
  );
};

export const isStudyManager: RequestHandler = (req, res, next) => {
  const user = req.user as IUser | undefined;
  const userRole = user?.role;
  if (userRole === Role.SuperAdmin || userRole === Role.StudyManager) {
    return next();
  }

  next(
    new HttpError(
      403,
      `${Role.StudyManager} role or higher is required for this action`
    )
  );
};

export const roleUpdateIsValid: RequestHandler = async (req, res, next) => {
  const user = req.user as IUser | undefined;
  const userRole = user?.role;

  if (userRole !== Role.SuperAdmin && userRole !== Role.UserManager) {
    return next(
      new HttpError(
        403,
        `${Role.UserManager} role or higher is required for this action`
      )
    );
  }

  if (userRole == Role.SuperAdmin && req.params.id === user?._id?.toString()) {
    const superAdminCount = await User.countDocuments({
      role: Role.SuperAdmin,
    });
    if (superAdminCount === 1) {
      return next(new HttpError(403, "Cannot demote the only super admin"));
    }
  }

  if (userRole === Role.UserManager) {
    if (req.body.role === Role.SuperAdmin) {
      return next(new HttpError(403, "You cannot assign a super admin role"));
    }

    try {
      const userToBeAssigned = await User.findById(req.params.id);
      if (userToBeAssigned?.role === Role.SuperAdmin) {
        return next(new HttpError(403, "You cannot assign a super admin role"));
      }
    } catch (error) {
      return next(new HttpError(404, "User not found"));
    }
  }

  next();
};
