const { Link, useLoaderData } = require("@remix-run/react");
const Heading = require("../../../components/Heading");
const TableHeader = require("../../../components/TableHeader");
const TableRow = require("../../../components/TableRow");
const { getAdvances } = require("../../../models/advance.server");

export function meta() {
    return {
        title: 'Advances | White House Court',
        // description: 'Register as a White House Court tenant'
    };
}

export async function loader() {
    const advances = await getAdvances();
    const tableDataObj = advances.map((advance, index) => {
        let advanceObj = {};
        advanceObj.employeeId = index + 1;
        advanceObj.name = advance.Employee.name;
        advanceObj.phone = advance.Employee.mobile;
        advanceObj.amount = advance.amount;
        advanceObj.dateIssued = new Date(advance.createdAt).toLocaleDateString();

        return advanceObj;
    });
    const tableData = tableDataObj.map((advance) => {
        return Object.values(advance);
    });


    return tableData;
}

export default function Advances() {
    const data = useLoaderData();
    const tableHeadings = ['Employee ID', 'Name', 'Phone number', 'Amount', , 'Date Issued',];
    // console.log({ data });
    return (
        <div className="space-y-5 max-w-5xl mx-auto">
            <Heading title='Advances' />
            <div className="flex justify-end">
                <Link to="new-entry" className=" rounded bg-blue-500  py-2 px-4 text-white hover:bg-blue-600 focus:bg-blue-400 inline-flex items-center gap-2">
                    Give advance
                </Link>
            </div>
            {
                data.length === 0
                    ? <div className="flex flex-col items-center">
                        <div className="w-40 h-40">
                            <img src="/space.svg" alt="A handcraft illustration of space" className="w-full h-full" />

                        </div>
                        <span className="text-center font-semibold">No advances yet</span>
                    </div>
                    : (
                        <>
                            <table className="mt-2 border border-slate-400 border-collapse w-full table-auto">
                                <thead>
                                    <TableHeader tableHeadings={tableHeadings} />
                                </thead>
                                <tbody>
                                    {
                                        data.map((data, index) => (
                                            <TableRow tableData={data} key={index} />
                                        ))
                                    }
                                </tbody>
                            </table>
                        </>
                    )
            }
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