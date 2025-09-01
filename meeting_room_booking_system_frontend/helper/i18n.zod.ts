// 临时解决 zod 弃用 setErrorMap https://github.com/aiji42/zod-i18n/issues/222#issuecomment-3007821219

import type { $ZodErrorMap } from "zod/v4/core";

import i18next, { type i18n } from "i18next";
import en from "zod/v4/locales/zh-CN";

const defaultErrorMap = en().localeError;

const jsonStringifyReplacer = (_: string, value: any): any => {
  if (typeof value === "bigint") {
    return value.toString();
  }

  return value;
};

function joinValues<T extends any[]>(array: T, separator = " | "): string {
  return array
    .map((val) => (typeof val === "string" ? `'${val}'` : val))
    .join(separator);
}

const isRecord = (value: unknown): value is Record<string, unknown> => {
  if (typeof value !== "object" || value === null) return false;

  for (const key in value) {
    if (!Object.prototype.hasOwnProperty.call(value, key)) return false;
  }

  return true;
};

const getKeyAndValues = (
  param: unknown,
  defaultKey: string,
): {
  values: Record<string, unknown>;
  key: string;
} => {
  if (typeof param === "string") return { key: param, values: {} };

  if (isRecord(param)) {
    const key =
      "key" in param && typeof param["key"] === "string"
        ? param["key"]
        : defaultKey;
    const values =
      "values" in param && isRecord(param["values"]) ? param["values"] : {};

    return { key, values };
  }

  return { key: defaultKey, values: {} };
};

export type MakeZodI18nMap = (option?: ZodI18nMapOption) => $ZodErrorMap;

export type ZodI18nMapOption = {
  t?: i18n["t"];
  ns?: string | readonly string[];
  handlePath?: HandlePathOption | false;
};

export type HandlePathOption = {
  context?: string;
  ns?: string | readonly string[];
  keyPrefix?: string;
};

const defaultNs = "zod";

const parsedType = (data: any): string => {
  const t = typeof data;

  switch (t) {
    case "number": {
      return Number.isNaN(data) ? "NaN" : "number";
    }
    case "object": {
      if (Array.isArray(data)) {
        return "array";
      }
      if (data === null) {
        return "null";
      }

      if (
        Object.getPrototypeOf(data) !== Object.prototype &&
        data.constructor
      ) {
        return data.constructor.name;
      }
    }
  }

  return t;
};

export const makeZodI18nMap: MakeZodI18nMap = (option) => (issue) => {
  const { t, ns, handlePath } = {
    t: i18next.t as any as (...args: any[]) => any,
    ns: defaultNs,
    ...option,
    handlePath:
      option?.handlePath !== false
        ? {
            context: "with_path",
            ns: option?.ns ?? defaultNs,
            keyPrefix: undefined,
            ...option?.handlePath,
          }
        : null,
  };

  let message: string;
  const errorMsg = defaultErrorMap(issue);

  message = (typeof errorMsg === "string" ? errorMsg : errorMsg?.message) ?? "";

  const path =
    (issue.path?.length ?? 0) > 0 && !!handlePath
      ? {
          context: handlePath.context,
          path: t(
            [handlePath.keyPrefix, issue.path?.join(".")]
              .filter(Boolean)
              .join("."),
            {
              ns: handlePath.ns,
              defaultValue: issue.path?.join("."),
            },
          ),
        }
      : {};

  switch (issue.code) {
    case "invalid_type":
      if (issue.input === undefined) {
        message = t("errors.invalid_type_received_undefined", {
          ns,
          defaultValue: message,
          ...path,
        });
      } else if (issue.input === null) {
        message = t("errors.invalid_type_received_null", {
          ns,
          defaultValue: message,
          ...path,
        });
      } else {
        const parsed = parsedType(issue.input).toLocaleLowerCase();

        message = t("errors.invalid_type", {
          expected: t(`types.${issue.expected}`, {
            defaultValue: issue.expected,
            ns,
          }),
          received: t(`types.${parsed}`, {
            defaultValue: parsed,
            ns,
          }),
          ns,
          defaultValue: message,
          ...path,
        });
      }
      break;
    case "invalid_value":
      message = t("errors.invalid_value", {
        values: joinValues(issue.values, "|"),
        count: issue.values.length,
        expected: JSON.stringify(issue.values, jsonStringifyReplacer),
        ns,
        defaultValue: message,
        ...path,
      });
      break;
    case "unrecognized_keys":
      message = t("errors.unrecognized_keys", {
        keys: joinValues(issue.keys, ", "),
        count: issue.keys.length,
        ns,
        defaultValue: message,
        ...path,
      });
      break;
    case "invalid_union":
      message = t("errors.invalid_union", {
        ns,
        defaultValue: message,
        ...path,
      });
      break;
    case "invalid_key":
      message = t("errors.invalid_key", {
        count: Array.isArray(issue["keys"]) ? issue["keys"].length : 0,
        keys: Array.isArray(issue["keys"])
          ? joinValues(issue["keys"], ", ")
          : String(issue["keys"]),
        ns,
        defaultValue: message,
        ...path,
      });
      break;
    case "invalid_element":
      message = t("errors.invalid_element", {
        origin: issue.origin,
        ns,
        defaultValue: message,
        ...path,
      });
      break;
    case "too_small": {
      const minimum =
        issue.origin === "date"
          ? new Date(issue.minimum as number)
          : issue.minimum;

      message = t(
        `errors.too_small.${issue.origin}.${issue.inclusive ? "inclusive" : "not_inclusive"}`,
        {
          minimum,
          count: typeof minimum === "number" ? minimum : undefined,
          ns,
          defaultValue: message,
          ...path,
        },
      );
      break;
    }
    case "too_big": {
      const maximum =
        issue.origin === "date"
          ? new Date(issue.maximum as number)
          : issue.maximum;

      message = t(
        `errors.too_big.${issue.origin}.${issue.inclusive ? "inclusive" : "not_inclusive"}`,
        {
          maximum,
          count: typeof maximum === "number" ? maximum : undefined,
          ns,
          defaultValue: message,
          ...path,
        },
      );
      break;
    }
    case "invalid_format":
      if (issue.format === "starts_with") {
        message = t("errors.invalid_format.startsWith", {
          startsWith: issue["prefix"],
          ns,
          defaultValue: message,
          ...path,
        });
      } else if (issue.format === "ends_with") {
        message = t("errors.invalid_format.endsWith", {
          endsWith: issue["suffix"],
          ns,
          defaultValue: message,
          ...path,
        });
      } else if (issue.format === "includes") {
        message = t("errors.invalid_format.includes", {
          includes: issue["includes"],
          ns,
          defaultValue: message,
          ...path,
        });
      } else if (issue.format === "regex") {
        message = t("errors.invalid_format.regex", {
          pattern: issue.pattern,
          ns,
          defaultValue: message,
          ...path,
        });
      } else {
        message = t("errors.invalid_format.generic", {
          format: t(`validations.${issue.format}`, {
            defaultValue: issue.format,
            ns,
          }),
          ns,
          defaultValue: message,
          ...path,
        });
      }
      break;

    case "custom": {
      const { key, values } = getKeyAndValues(
        issue.params?.["i18n"],
        "errors.custom",
      );

      message = t(key, {
        ...values,
        ns,
        defaultValue: message,
        ...path,
      });
      break;
    }
    case "not_multiple_of":
      message = t("errors.not_multiple_of", {
        multipleOf: issue["multipleOf"],
        ns,
        defaultValue: message,
        ...path,
      });
      break;
    default:
  }

  return { message };
};
