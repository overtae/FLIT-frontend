import { format } from "date-fns";

export function formatDate(date = "", formatString = "yyyy-MM-dd HH:mm") {
  return format(new Date(date), formatString);
}
