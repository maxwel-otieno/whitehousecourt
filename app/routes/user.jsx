const { CashIcon, HomeIcon, UserCircleIcon } = require("@heroicons/react/outline");
const { Form, NavLink, Outlet } = require("@remix-run/react");
const { requireUser } = require("../session.server");

export async function loader({ request }) {
    const user = requireUser(request);
    return user;
}

export default function UserPage() {
    return (
        <div className="h-full divide-solid divide-y">

            <header className="flex py-[14px]">
                <div className="w-72 bg-[#F8F8F8] fixed z-10 flex justify-between px-3">
                    <span>Logo</span>
                    <span>Estate control</span>
                </div>
                <div className="px-6 relative z-10 ml-72 flex justify-end items-center w-full gap-x-12">
                    <span>{new Date().toLocaleDateString()}</span>
                    <Form action="/logout" method="post">
                        <button
                            type="submit"
                            className="rounded bg-slate-600 py-2 px-4 text-blue-100 hover:bg-blue-500 active:bg-blue-600"
                        >
                            Logout
                        </button>
                    </Form>
                </div>
                {/* <div className="border border-slate-200 w-72 h-44 absolute right-3 top-14">

                </div> */}
            </header>
            <main className="flex h-full">
                <div className="h-full fixed top-0 left-0 w-72 bg-[#F8F8F8] pt-20 pl-4">
                    <ul className="divide-solid divide-y border-t -mt-3">
                        <li className="h-12">
                            <NavLink
                                to="/user"
                                prefetch="intent"
                                className={({ isActive }) => isActive ? 'text-blue-600 bg-white  h-full pl-1 flex items-center' : 'h-full pl-1 flex items-center'}
                                end
                            >
                                <HomeIcon className="w-5 h-5 inline" /> <span className="ml-2">Home</span>
                            </NavLink>
                        </li>

                        <li className="h-12">
                            <NavLink
                                to="payment"
                                prefetch="intent"
                                className={({ isActive }) => isActive ? 'text-blue-600 bg-white  h-full pl-1 flex items-center' : 'h-full pl-1 flex items-center'}
                                end
                            >
                                <CashIcon className="w-5 h-5 inline" /> <span className="ml-2">Make payment</span>
                            </NavLink>
                        </li>
                    </ul>
                </div>
                <div className="flex-1 ml-72 px-6 pt-4">
                    <Outlet />
                </div>
            </main>
        </div>
    )
}