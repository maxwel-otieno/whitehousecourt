const { Form, Link, useActionData, useCatch, useTransition } = require("@remix-run/react");
const { redirect } = require("@remix-run/node");
const { useRef, useEffect } = require("react");
const { createHouse, getHouses } = require("../models/house.server");
const { createTenant, getTenants } = require("../models/tenant.server");
const { badRequest, validateDate, validateEmail, validateHouseNumber, validateName, validateNationalId, validatePassword, validatePhone, validatePlotNumber, validateVehicleRegistration } = require("../utils");
const { ArrowLeftIcon } = require("@heroicons/react/outline");
const { createUser } = require("../models/user.server");

// TODO: Add toasts for user feedback
// TODO: Make sure passwords don't match

export function meta() {
    return {
        title: 'Register | White House Court',
        description: 'Register as a White House Court tenant'
    };
}

export async function loader() {

    return null;
}

export async function action({ request }) {
    const formData = await request.formData();
    const name = formData.get('name');
    const phone = formData.get('phone');
    const email = formData.get('email');
    const password = formData.get('password');
    const confirmPassword = formData.get('confirmPassword');
    const nationalId = formData.get('nationalId');
    const plotNo = formData.get('plotNo');
    const houseNo = formData.get('houseNo');
    const date = formData.get('date');
    const vehicleRegistration = formData.get('vehicleRegistration');

    // const safariomRegex = /^(?:254|\+254|0)?([71](?:(?:0[0-8])|(?:[12][0-9])|(?:9[0-9])|(?:4[0-3])|(?:4[68]))[0-9]{6})$/;

    // const airtelRegex = /^(?:254|\+254|0)?(7(?:(?:3[0-9])|(?:5[0-6])|(?:8[0-2])|(?:8[6-9]))[0-9]{6})$/;

    // const telkomRegex = /^(?:254|\+254|0)?(77[0-9][0-9]{6})$/;

    // const res = phone.match(telkomRegex);

    // console.log({ res });

    const fields = {
        name,
        phone,
        email,
        nationalId,
        plotNo,
        houseNo,
        date,
        vehicleRegistration
    };

    const fieldErrors = {
        name: validateName(name),
        phone: validatePhone(phone),
        email: validateEmail(email),
        password: validatePassword(password),
        confirmPassword: validatePassword(confirmPassword),
        nationalId: validateNationalId(nationalId),
        plotNo: validatePlotNumber(Number(plotNo)),
        houseNo: validateHouseNumber(houseNo),
        moveInDate: validateDate(date),
        vehicleRegistration: validateVehicleRegistration(vehicleRegistration)
    };


    // // Return errors if any
    if (Object.values(fieldErrors).some(Boolean)) {
        return badRequest({ fields, fieldErrors });
    }

    if (password !== confirmPassword) {
        console.log({ match: password === confirmPassword });
        return badRequest({
            fields, fieldErrors: {
                confirmPassword: 'Password does not match',
            }
        });
    }

    const moveInDate = new Date(date).toISOString();

    const tenant = await createTenant(name, phone, email, Number(nationalId), moveInDate, vehicleRegistration);

    const tenantId = tenant.id;

    // console.log({ user });
    const res = await createHouse(Number(plotNo), houseNo, tenantId);

    const user = await createUser(email, password);
    // console.log({ res });

    return redirect('/success');
}

export default function Register() {
    const actionData = useActionData();
    const transition = useTransition();

    const nameRef = useRef(null);
    const phoneRef = useRef(null);
    const emailRef = useRef(null);
    const nationalIdRef = useRef(null);
    const plotNoRef = useRef(null);
    const houseNoRef = useRef(null);
    const dateRef = useRef(null);
    const vehicleRegRef = useRef(null);
    const passwordRef = useRef(null);
    const confirmPasswordRef = useRef(null);

    useEffect(() => {
        nameRef.current?.focus();

        if (actionData?.fieldErrors.name) {
            nameRef.current?.focus();
        } else if (actionData?.fieldErrors.phone) {
            phoneRef.current?.focus();
        } else if (actionData?.fieldErrors.nationalId) {
            nationalIdRef.current?.focus();
        } else if (actionData?.fieldErrors.plotNo) {
            plotNoRef.current?.focus();
        } else if (actionData?.fieldErrors.houseNo) {
            houseNoRef.current?.focus();
        } else if (actionData?.fieldErrors.moveInDate) {
            dateRef.current?.focus();
        } else if (actionData?.fieldErrors.vehicleRegistration) {
            vehicleRegRef.current?.focus();
        } else if (actionData?.fieldErrors.email) {
            emailRef.current?.focus();
        } else if (actionData?.fieldErrors.password) {
            passwordRef.current?.focus();
        } else if (actionData?.fieldErrors.confirmPassword) {
            confirmPasswordRef.current?.focus();
        }
    }, [actionData]);

    return (
        <main className="w-4/5 lg:max-w-4xl mx-auto py-10 space-y-2">
            <h1 className="font-bold text-2xl lg:text-4xl lg:text-center">White House Court</h1>
            <h2 className="font-semibold text-xl lg:text-2xl lg:text-center">Tenant registration form</h2>
            <p className="text-light-black lg:text-center">Fill in the details below to register as a tenant of White House court</p>
            <p className="text-light-black lg:text-center"><em>(Fields marked with * are compulsory)</em></p>
            <Form method="post" replace>
                <fieldset className="">
                    <h3 className="font-semibold text-lg">Personal information</h3>
                    <div className="grid lg:grid-cols-2 gap-1 lg:gap-4 mt-2">
                        <div>
                            <label htmlFor="name" className="text-black">
                                Full name *
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
                            <label htmlFor="phone" className="text-black">
                                Phone *
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
                            <label htmlFor="nationalId" className="text-black">
                                National Id *
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
                            <label htmlFor="plotNo" className="text-black">
                                Plot number *
                            </label>
                            <input
                                ref={plotNoRef}
                                type="number"
                                name="plotNo"
                                id="plotNo"
                                defaultValue={actionData?.fields.salary}
                                className={`block w-full px-3 py-2 border rounded text-black focus:border-none focus:outline-none focus:ring-2 focus:ring-blue-500 ${actionData?.fieldErrors.plotNo ? 'border-red-700' : 'border-gray-400'}`}
                            />
                            {
                                actionData?.fieldErrors.plotNo
                                    ? (<span className="pt-1 text-red-700 text-sm" id="email-error">
                                        {actionData.fieldErrors.plotNo}
                                    </span>)
                                    : <>&nbsp;</>
                            }
                        </div>
                        <div>
                            <label htmlFor="houseNo" className="text-black">
                                House number *
                            </label>
                            <input
                                ref={houseNoRef}
                                type="text"
                                name="houseNo"
                                id="houseNo"
                                defaultValue={actionData?.fields.houseNo}
                                className={`block w-full px-3 py-2 border rounded text-black focus:border-none focus:outline-none focus:ring-2 focus:ring-blue-500 ${actionData?.fieldErrors.houseNo ? 'border-red-700' : 'border-gray-400'}`}
                            />
                            {
                                actionData?.fieldErrors.houseNo
                                    ? (<span className="pt-1 text-red-700 text-sm" id="email-error">
                                        {actionData.fieldErrors.houseNo}
                                    </span>)
                                    : <>&nbsp;</>
                            }
                        </div>
                        <div>
                            <label htmlFor="date" className="text-black">
                                Move in date
                            </label>
                            <input
                                ref={dateRef}
                                type="date"
                                name="date"
                                id="date"
                                defaultValue={actionData?.fields.moveInDate}
                                className={`block w-full px-3 py-2 border rounded text-black focus:border-none focus:outline-none focus:ring-2 focus:ring-blue-500 ${actionData?.fieldErrors.moveInDate ? 'border-red-700' : 'border-gray-400'}`}
                            />
                            {
                                actionData?.fieldErrors.moveInDate
                                    ? (<span className="pt-1 text-red-700 text-sm" id="email-error">
                                        {actionData.fieldErrors.moveInDate}
                                    </span>)
                                    : <>&nbsp;</>
                            }
                        </div>
                        <div>
                            <label htmlFor="vehicleRegistration" className="text-black">
                                Vehicle registration
                            </label>
                            <input
                                ref={vehicleRegRef}
                                type="text"
                                name="vehicleRegistration"
                                id="vehicleRegistration"
                                defaultValue={actionData?.fields.vehicleRegistration}
                                className={`block w-full px-3 py-2 border rounded text-black focus:border-none focus:outline-none focus:ring-2 focus:ring-blue-500 ${actionData?.fieldErrors.vehicleRegistration ? 'border-red-700' : 'border-gray-400'}`}
                            />
                            {
                                actionData?.fieldErrors.vehicleRegistration
                                    ? (<span className="pt-1 text-red-700 text-sm" id="email-error">
                                        {actionData.fieldErrors.vehicleRegistration}
                                    </span>)
                                    : <>&nbsp;</>
                            }
                        </div>
                    </div>
                    <h3 className="font-semibold text-lg">Account information</h3>
                    <em>This info will be used to log in to the White House app</em>
                    <div className="grid lg:grid-cols-2 gap-1 lg:gap-4 mt-2">
                        <div>
                            <label htmlFor="email" className="text-black">
                                Email *
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
                            <label htmlFor="password" className="text-black">
                                Password *
                            </label>
                            <input
                                ref={passwordRef}
                                type="password"
                                name="password"
                                id="password"
                                // defaultValue={actionData?.fields.password}
                                className={`block w-full px-3 py-2 border rounded text-black focus:border-none focus:outline-none focus:ring-2 focus:ring-blue-500 ${actionData?.fieldErrors.password ? 'border-red-700' : 'border-gray-400'}`}
                            />
                            {
                                actionData?.fieldErrors.password
                                    ? (<span className="pt-1 text-red-700 text-sm" id="email-error">
                                        {actionData.fieldErrors.password}
                                    </span>)
                                    : <>&nbsp;</>
                            }
                        </div>
                        <div>
                            <label htmlFor="confirmPassword" className="text-black">
                                Confirm password *
                            </label>
                            <input
                                ref={confirmPasswordRef}
                                type="password"
                                name="confirmPassword"
                                id="confirmPassword"
                                // defaultValue={actionData?.fields.vehicleRegistration}
                                className={`block w-full px-3 py-2 border rounded text-black focus:border-none focus:outline-none focus:ring-2 focus:ring-blue-500 ${actionData?.fieldErrors.confirmPassword ? 'border-red-700' : 'border-gray-400'}`}
                            />
                            {
                                actionData?.fieldErrors.confirmPassword
                                    ? (<span className="pt-1 text-red-700 text-sm" id="email-error">
                                        {actionData.fieldErrors.confirmPassword}
                                    </span>)
                                    : <>&nbsp;</>
                            }
                        </div>
                    </div>
                    <button type="submit" className="lg:mt-1 lg:col-span-2 bg-blue-600 px-6 py-2 text-white text-center w-full lg:w-1/2 justify-self-center rounded focus:border-none focus:outline-none focus:ring-2 focus:ring-blue-500">
                        {transition.submission ? 'Registering...' : 'Register'}
                    </button>
                </fieldset>
            </Form>
        </main>
    )
}

export function CatchBoundary() {
    const caught = useCatch();

    return (
        <div className="w-full h-screen grid place-items-center">
            <div>
                <div className="w-72 h-72 lg:w-80 lg:h-80">
                    <img src="/bad-request.svg" alt="" className="w-full h-full" />
                </div>
                <div className="flex flex-col items-center gap-1">
                    <h1 className="font-bold text-6xl">Error</h1>
                    <p>Status: {caught.status}</p>
                    <pre className="text-lg">
                        <code className="font-bold">
                            {caught.data}
                        </code>
                    </pre>
                    <Link to="/register" className="text-blue-500 underline hover:text-blue-700">
                        <ArrowLeftIcon className="w-5 h-5 inline" /> Back to form
                    </Link>
                </div>
            </div>
        </div>
    );
}

export function ErrorBoundary({ error }) {
    return (
        <div>
            <h1>Error</h1>
            <p>{error.message}</p>
            <p>The stack trace is:</p>
            <pre>{error.stack}</pre>
        </div>
    )
}