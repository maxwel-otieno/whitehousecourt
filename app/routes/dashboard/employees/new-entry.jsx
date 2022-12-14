const { Form, Link, useActionData, useTransition } = require("@remix-run/react");
const { json, redirect } = require("@remix-run/node");
const { useState } = require("react");
const { Dialog } = require("@reach/dialog");
const { VisuallyHidden } = require("@reach/visually-hidden");
const Heading = require("../../../components/Heading");
const { ArrowLeftIcon } = require("@heroicons/react/outline");
const { badRequest, validateEmail, validateName, validateNationalId, validatePhone, validateAmount } = require("../../../utils");
const { createEmployee } = require("../../../models/employee.server");
const { useRef } = require("react");
const { useEffect } = require("react");

export async function action({ request }) {
    // const formData = Object.fromEntries(await request.formData());
    const formData = await request.formData();

    const name = formData.get('name');
    const phone = formData.get('phone');
    const nationalId = formData.get('nationalId');
    const email = formData.get('email');
    const salary = formData.get('salary');

    const fields = {
        name: name,
        phone: phone,
        nationalId: nationalId,
        email: email,
        salary: salary,
    };

    const fieldErrors = {
        name: validateName(name),
        phone: validatePhone(phone),
        nationalId: validateNationalId(nationalId),
        email: validateEmail(email),
        salary: validateAmount(salary),
    };

    // Return errors if any

    if (Object.values(fieldErrors).some(Boolean)) {
        return badRequest({ fields, fieldErrors });
    }

    // Create new employee
    const employee = await createEmployee(name, phone, email, nationalId, salary);
    console.log({ employee });

    return redirect('/dashboard/employees');
}

export default function NewEntry() {
    const actionData = useActionData();
    const transition = useTransition();

    const nameRef = useRef(null);
    const phoneRef = useRef(null);
    const nationalIdRef = useRef(null);
    const emailRef = useRef(null);
    const salaryRef = useRef(null);

    const [showDialog, setShowDialog] = useState(true);

    function open() {
        setShowDialog(true);
    }

    function close() {
        setShowDialog(false);
    }
    useEffect(() => {
        nameRef.current?.focus();

        // Focus the first field with an error
        if (actionData?.fieldErrors.name) {
            nameRef.current?.focus();
        }
        else if (actionData?.fieldErrors.phone) {
            phoneRef.current?.focus();
        }
        else if (actionData?.fieldErrors.nationalId) {
            nationalIdRef.current?.focus();
        }
        else if (actionData?.fieldErrors.email) {
            emailRef.current?.focus();
        }
        else if (actionData?.fieldErrors.salary) {
            salaryRef.current?.focus();
        }
    }, [actionData]);
    return (
        <div className=" mx-auto space-y-4">
            <Link to=".." className="text-black hover:underline hover:text-blue-500">
                <ArrowLeftIcon className="w-5 h-5 inline" /> Back to employees
            </Link>
            <Heading title='Add Employee' />
            <p className="text-light-black">Enter employee details below</p>
            <Form method="post" className="w-4/5 lg:max-w-5xl">
                <fieldset className="grid lg:grid-cols-2 gap-4">
                    <div>
                        <label htmlFor="name" className="text-light-black">
                            Name
                        </label>
                        <input
                            ref={nameRef}
                            type="text"
                            name="name"
                            id="name"
                            defaultValue={actionData?.fields.name}
                            className={`block w-full px-3 py-2 border  rounded text-black focus:border-none focus:outline-none focus:ring-2 focus:ring-blue-500 ${actionData?.fieldErrors.name ? 'border-red-700' : 'border-gray-400'}`}
                        />
                        {
                            actionData?.fieldErrors.name
                                ? (<span className="pt-1 text-red-700 inline text-sm" id="email-error">
                                    {actionData.fieldErrors.name}
                                </span>)
                                : <>&nbsp;</>
                        }

                    </div>
                    <div>
                        <label htmlFor="phone" className="text-light-black">
                            Phone
                        </label>
                        <input
                            ref={phoneRef}
                            type="text"
                            name="phone"
                            id="phone"
                            defaultValue={actionData?.fields.phone}
                            className={`block w-full px-3 py-2 border rounded text-black focus:border-none focus:outline-none focus:ring-2 focus:ring-blue-500 ${actionData?.fieldErrors.phone ? 'border-red-700' : 'border-gray-400'}`}
                        />
                        {
                            actionData?.fieldErrors.phone
                                ? (<span className="pt-1 text-red-700 text-sm" id="email-error">
                                    {actionData.fieldErrors.phone}
                                </span>)
                                : <>&nbsp;</>
                        }
                    </div>
                    <div>
                        <label htmlFor="nationalId" className="text-light-black">
                            National Id
                        </label>
                        <input
                            ref={nationalIdRef}
                            type="number"
                            name="nationalId"
                            id="nationalId"
                            defaultValue={actionData?.fields.nationalId}
                            className={`block w-full px-3 py-2 border rounded text-black focus:border-none focus:outline-none focus:ring-2 focus:ring-blue-500 ${actionData?.fieldErrors.nationalId ? 'border-red-700' : 'border-gray-400'}`}
                        />
                        {
                            actionData?.fieldErrors.nationalId
                                ? (<span className="pt-1 text-red-700 text-sm" id="email-error">
                                    {actionData.fieldErrors.nationalId}
                                </span>)
                                : <>&nbsp;</>
                        }
                    </div>
                    <div>
                        <label htmlFor="email" className="text-light-black">
                            Email
                        </label>
                        <input
                            ref={emailRef}
                            type="email"
                            name="email"
                            id="email"
                            defaultValue={actionData?.fields.email}
                            className={`block w-full px-3 py-2 border rounded text-black invalid:border-pink-500 invalid:text-pink-600 focus:border-none focus:outline-none focus:ring-2 focus:ring-blue-500 ${actionData?.fieldErrors.email ? 'border-red-700' : 'border-gray-400'}`}
                        />
                        {
                            actionData?.fieldErrors.email
                                ? (<span className="pt-1 text-red-700 text-sm" id="email-error">
                                    {actionData.fieldErrors.email}
                                </span>)
                                : <>&nbsp;</>
                        }
                    </div>
                    <div>
                        <label htmlFor="salary" className="text-light-black">
                            Salary
                        </label>
                        <input
                            ref={salaryRef}
                            type="text"
                            name="salary"
                            id="salary"
                            defaultValue={actionData?.fields.salary}
                            className={`block w-full px-3 py-2 border rounded text-black focus:border-none focus:outline-none focus:ring-2 focus:ring-blue-500 ${actionData?.fieldErrors.salary ? 'border-red-700' : 'border-gray-400'}`}
                        />
                        {
                            actionData?.fieldErrors.salary
                                ? (<span className="pt-1 text-red-700 text-sm" id="email-error">
                                    {actionData.fieldErrors.salary}
                                </span>)
                                : <>&nbsp;</>
                        }
                    </div>
                    <button type="submit" className="lg:col-span-2 bg-blue-600 px-6 py-2 text-white text-center w-full lg:w-1/2 justify-self-center rounded focus:border-none focus:outline-none focus:ring-2 focus:ring-blue-500">
                        {transition.submission ? 'Adding...' : 'Add'}
                    </button>
                </fieldset>
            </Form>

        </div>
    )
}