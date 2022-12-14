const { PlusIcon } = require("@heroicons/react/outline");
const { Form, Link, useLoaderData } = require("@remix-run/react");
const { Dialog, DialogOverlay, DialogContent } = require("@reach/dialog");
const { VisuallyHidden } = require("@reach/visually-hidden");
const dialogStyles = require("@reach/dialog/styles.css");
const { useState } = require("react");
const TableHeader = require("../../../components/TableHeader");
const TableRow = require("../../../components/TableRow");
const Heading = require("../../../components/Heading");
const { getEmployees } = require("../../../models/employee.server");

export function links() {
    return [
        {
            rel: "stylesheet",
            href: dialogStyles
        }
    ];
}

export async function loader() {
    const employees = await getEmployees();
    return employees;
}

export async function action({ request }) {
    const formData = await request.formData();
    const confirm = formData.get('confirm');
    console.log({ confirm });
    return null;
}

export default function EmployeesIndex() {
    const data = useLoaderData();

    const tableHeadings = ['Employee ID', 'Name', 'Phone number', 'Email', , 'National Id', 'Salary'];
    const tableData = data.map((employee) => {
        return Object.values(employee).slice(1, 6)
    });

    tableData.forEach((employee, index) => employee.splice(0, 0, index + 1));
    console.log({ Employees: tableData });

    // Uncommented this
    const [showDialog, setShowDialog] = useState(false);

    function open() {
        setShowDialog(true);
    }

    function close() {
        setShowDialog(false);
    }
    return (
        <div className="space-y-5 max-w-5xl mx-auto">
            <Heading title='Employees' />
            <div className="flex justify-end">
                <Link to="new-entry" className=" rounded bg-blue-500  py-2 px-4 text-white hover:bg-blue-600 focus:bg-blue-400 inline-flex items-center gap-2">
                    <PlusIcon className="w-5 h-5 inline" /> Add employee
                </Link>
            </div>
            {
                tableData.length === 0
                    ? <div className="flex flex-col items-center">
                        <div className="w-40 h-40">
                            <img src="/space.svg" alt="A handcraft illustration of space" className="w-full h-full" />

                        </div>
                        <span className="text-center font-semibold">No employees yet</span>
                    </div>
                    : (
                        <table className="mt-2 border border-slate-400 border-collapse w-full table-auto">
                            <thead>
                                <TableHeader tableHeadings={tableHeadings} />
                            </thead>
                            <tbody>
                                {
                                    tableData.map((data, index) => (
                                        <TableRow tableData={data} key={index} />
                                    ))
                                }
                            </tbody>
                        </table>
                    )
            }

            {/* <Form method="post" id="delete">
                <input type="hidden" name="confirm" value="confirm" />
                <button
                    type="button"
                    className="px-6 py-3 bg-red-500"
                    onClick={open}
                >
                    Delete
                </button>
            </Form> */}
            {/* <Dialog isOpen={showDialog} onDismiss={close}>
                <button className="close-button" onClick={close}>
                    <VisuallyHidden>Close</VisuallyHidden>
                    <span aria-hidden>X</span>
                </button>
                <p>This is a dialog content</p>

                <button type="submit" form="delete">Delete</button>

            </Dialog> */}
        </div>
    );
}