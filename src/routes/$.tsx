import { createFileRoute, notFound } from "@tanstack/react-router";
import { noindexHeaders, notFoundHead } from "@/lib/site";

export const Route = createFileRoute("/$")({
  loader: () => {
    throw notFound();
  },
  head: ({ params }) => {
    const splat = params._splat ?? "";
    return notFoundHead(
      splat ? `/${splat}` : "/",
      "Page not found",
      "That address is not a CabinVolt page.",
    );
  },
  headers: () => noindexHeaders(),
});
