import { Study } from "../models/study";
import { uid } from "../models/study";

export async function generateUniquePrefixServerCode(): Promise<string> {
  let newPrefix = uid.rnd(3);
  let attempts = 0;

  // try to find a unique prefix (with a limit on attempts to prevent infinite loops)
  while (attempts < 10) {
    const existingStudy = await Study.findOne({ prefixServerCode: newPrefix });
    if (!existingStudy) break;

    newPrefix = uid.rnd(3);
    attempts++;
  }

  return newPrefix;
}
