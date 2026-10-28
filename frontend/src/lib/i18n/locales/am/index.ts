import { auth } from "./auth";
import { common } from "./common";
import { errors } from "./errors";
import { layout } from "./layout";
import { legal } from "./legal";
import { marketing } from "./marketing";
import { notifications } from "./notifications";
import { product } from "./product";
import { settings } from "./settings";
import { validation } from "./validation";
import { dashboard } from "./dashboard";
import { reservation } from "./reservation";
import { inventory } from "./inventory";

export const am = {
  common,
  validation,
  errors,
  auth,
  layout,
  settings,
  notifications,
  marketing,
  legal,
  product,
  dashboard,
  reservation,
  inventory,
} as const;
