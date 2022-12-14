const { Form, Link, useActionData, useCatch, useLoaderData, useTransition } = require("@remix-run/react");
const { json, redirect } = require("@remix-run/server-runtime");
const { useEffect, useRef } = require("react");
const { createAdvance } = require("../../../../models/advance.server");
const { getEmployee } = require("../../../../models/employee.server");
const { getSession, sessionStorage } = require("../../../../session.server");
const { badRequest, validateAmount } = require("../../../../utils");

// export function links() {
//     return [
//         {
//             rel: "stylesheet",
//             href: toastStyles
//         }
//     ];
// }

export async function loader({ request, params }) {
    const session = await getSession(request);
    const successStatus = session.get('success');
    // console.log({ successStatus });
    const id = params.id;
    const employee = await getEmployee(id);
    // console.log({ employee });
    return json({ employee }, {
        headers: {
            "Set-Cookie": await sessionStorage.commitSession(session)
        }
    });
}

export async function action({ request, params }) {
    const id = params.id;
    const formData = await request.formData();
    const amount = formData.get('amount');
    const fieldError = {
        amount: validateAmount(amount)
    }
    if (Object.values(fieldError).some(Boolean)) {
        return badRequest({
            amount: validateAmount(amount)
        });
    }

    // Get all advance values first
    const employee = await getEmployee(id);
    const employeeSalary = employee.salary;
    const employeeAdvances = employee.advance.map((advance) => {
        return advance.amount
    });

    let totalAdvance = 0;
    if (employeeAdvances.length > 0) {
        totalAdvance = employeeAdvances.reduce((prev, current) => prev + current);
    }
    // console.log({ totalAdvance });

    // Check if the advance is within limit
    if (amount + totalAdvance > 0.3 * employeeSalary) {
        throw new Response('Allowed amount exceeded!', {
            status: 400
        });
    }

    // Add advance to the employee advance field
    const advance = await createAdvance(id, Number(amount));
    // console.log({ advance });
    const session = await getSession(request);
    session.flash("success", true);

    return redirect('/dashboard/advances/new-entry', {
        headers: {
            "Set-Cookie": await sessionStorage.commitSession(session)
        }
    });

}

export default function AdvancePersonalDetails() {
    const data = useLoaderData();
    const actionData = useActionData();
    const transition = useTransition();

    const formRef = useRef(null);

    console.log({ data });
    // function success() {
    //     return toast.success('Success!', {
    //         position: toast.POSITION.BOTTOM_RIGHT
    //     });
    // }

    useEffect(() => {
        formRef.current?.reset();
    }, [transition.submission]);

    // useEffect(() => {
    //     if (data.successStatus === true) {
    //         success();
    //     }
    // }, [data.successStatus]);
    return (
        <div className="px-3 py-2 space-y-2">
            <h2 className="font-semibold">Employee details</h2>
            <div className="text-gray-800">
                <p>Name: &nbsp; <span className="text-light-black">{data.employee.name}</span></p>
                <p>Phone: &nbsp; <span className="text-light-black">{data.employee.mobile}</span></p>
                <p>National Id: &nbsp; <span className="text-light-black">{data.employee.nationalId}</span></p>
            </div>
            <Form method="post" ref={formRef}>
                <fieldset>
                    <label htmlFor="amount">Enter amount <i className="text-light-black">(Max limit Ksh 10000)</i></label>
                    <input
                        id="amount"
                        type="number"
                        name="amount"
                        className="block w-full px-3 py-2 border border-gray-400 rounded text-black focus:border-none focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    {
                        actionData?.amount
                            ? (<span className="pt-1 text-red-700 inline text-sm" id="email-error">
                                {actionData.amount}
                            </span>)
                            : <>&nbsp;</>
                    }
                    <button className="bg-blue-600 px-6 py-2 text-white text-center w-full rounded focus:border-none focus:outline-none focus:ring-2 focus:ring-blue-500">
                        {transition.submission ? 'Processing...' : 'Give advance'}
                    </button>
                </fieldset>
            </Form>
            {/* <ToastContainer /> */}
        </div>
    );
}

export function CatchBoundary() {
    const caught = useCatch();
    return (
        <div>
            <h1>Error!</h1>
            <pre>
                <code>
                    Status {caught.status}
                </code>
            </pre>
            <p>{caught.data}</p>
            <Link to="/dashboard/advances/new-entry" className="text-blue-500 underline">
                Try again
            </Link>
        </div>
    );
}