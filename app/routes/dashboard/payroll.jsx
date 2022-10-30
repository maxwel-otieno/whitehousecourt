const { Outlet } = require("@remix-run/react");
const Heading = require("../../components/Heading");

export default function Payroll() {
    return (
        <div>
            <Outlet />
        </div>
    )
}