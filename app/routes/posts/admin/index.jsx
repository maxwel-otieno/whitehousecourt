const { Link } = require("@remix-run/react");
const { requireAdminUser } = require("../../../session.server");

export async function loader({ request }) {
    await requireAdminUser(request);
    return null;
}

export default function AdminIndex() {
    return (
        <div>
            <Link to="new" className="text-blue-600 underline">Create new post</Link>
        </div>
    )
}