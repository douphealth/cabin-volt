import { createStart, createCsrfMiddleware, createMiddleware } from "@tanstack/react-start";

import { renderErrorPage } from "./lib/error-page";
import { cleanRequestPath } from "./lib/site";

const errorMiddleware = createMiddleware().server(async ({ next }) => {
  try {
    return await next();
  } catch (error) {
    if (error != null && typeof error === "object" && "statusCode" in error) {
      throw error;
    }
    console.error(error);
    return new Response(renderErrorPage(), {
      status: 500,
      headers: { "content-type": "text/html; charset=utf-8" },
    });
  }
});

// Start installs this automatically when src/start.ts is absent; defining the
// file opts out, so re-add it explicitly to keep server functions protected
// from cross-site requests.
const csrfMiddleware = createCsrfMiddleware({
  filter: (ctx) => ctx.handlerType === "serverFn",
});

// requestMiddleware runs on every request; functionMiddleware only on server functions, where
// client sendContext is unvalidated input. Append to these arrays, never replace them.
// Enabling Lovable Cloud adds functionMiddleware: [attachSupabaseAuth], the bearer token that
// requireSupabaseAuth server functions need. Add it by hand only if Lovable Cloud or a
// user-managed Supabase project is connected, no middleware here sets Authorization, and the
// project did not intentionally replace it.
const canonicalUrlMiddleware = createMiddleware().server(async ({ next, request, handlerType }) => {
  if (handlerType !== "router") return next();

  const url = new URL(request.url);
  const cleaned = cleanRequestPath(url.pathname, url.search);
  if (cleaned && (request.method === "GET" || request.method === "HEAD")) {
    return new Response(null, {
      status: 301,
      headers: { Location: new URL(cleaned, url.origin).toString() },
    });
  }

  const result = await next();
  if (result instanceof Response) return result;

  const isFile = /\.[a-z0-9]+$/i.test(url.pathname);
  const hasQuery = url.search.length > 1;
  const notFound = result.response.status === 404;
  if (notFound || (!isFile && hasQuery)) {
    const headers = new Headers(result.response.headers);
    headers.set("X-Robots-Tag", "noindex, follow");
    return {
      ...result,
      response: new Response(result.response.body, {
        status: result.response.status,
        statusText: result.response.statusText,
        headers,
      }),
    };
  }
  return result;
});

export const startInstance = createStart(() => ({
  requestMiddleware: [canonicalUrlMiddleware, errorMiddleware, csrfMiddleware],
}));
