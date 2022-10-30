const { redirect } = require("@remix-run/node");

const { logout } = require("~/session.server");

export async function action({ request }) {
  return logout(request);
}

export async function loader() {
  return redirect("/");
}
