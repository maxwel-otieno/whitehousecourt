const { Form, useActionData, useTransition } = require("@remix-run/react");
const { redirect } = require("@remix-run/server-runtime");
const { getTenantByEmail } = require("../../models/tenant.server");
const { createTenantPayment } = require("../../models/year.server");
const { getSession, getUser, sessionStorage } = require("../../session.server");
const { badRequest, validateAmount } = require("../../utils");

export async function action({ request }) {
    const user = await getUser(request);
    const userEmail = user.email;
    const tenant = await getTenantByEmail(userEmail);
    const tenantId = tenant.id;
    const formData = await request.formData();
    const amount = formData.get('amount');
    const fieldErrors = {
        amount: validateAmount(amount)
    }

    // Return errors if any
    if (Object.values(fieldErrors).some(Boolean)) {
        return badRequest({ fieldErrors });
    }

    const res = await createTenantPayment(tenantId, amount);
    console.log({ res });
    const session = await getSession(request);
    session.flash("success", true);

    return redirect('/user', {
        headers: {
            "Set-Cookie": await sessionStorage.commitSession(session)
        }
    });
}

export default function Payment() {
    const actionData = useActionData();
    const transition = useTransition();
    return (
        <div className="max-w-md mx-auto space-y-4 mt-32">
            <Form method="post" className="">
                <div>
                    <label htmlFor="amount">Enter amount</label>
                    <input
                        type="number"
                        name="amount"
                        className={`mt-1 block w-full px-3 py-2 border  rounded text-black focus:border-none focus:outline-none focus:ring-2 focus:ring-blue-500 ${actionData?.fieldErrors.name ? 'border-red-700' : 'border-gray-400'}`}
                    />
                    <button type="submit" className="bg-blue-600 mt-3 px-6 py-2 text-white text-center w-full rounded focus:border-none focus:outline-none focus:ring-2 focus:ring-blue-500">
                        {transition.submission ? 'Processing...' : 'Pay'}
                    </button>
                </div>
            </Form>
            <p className="text-gray-500 italic">
                Excess payments will be used to clear arrears.The earliest arrears will be cleared first.
            </p>
        </div>
    )
}