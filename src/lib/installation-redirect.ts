/** Both former installation URLs resolve directly to the canonical page. */
export const installationRedirect = () =>
  new Response(null, { status: 301, headers: { Location: "/installation" } });