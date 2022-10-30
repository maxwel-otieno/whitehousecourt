const { ArrowLeftIcon } = require("@heroicons/react/outline");
const { Link, Outlet, useTransition } = require("@remix-run/react");
const algoliasearch = require("algoliasearch");
const algoliaStyles = require("instantsearch.css/themes/satellite.css");
const { Highlight, Hits, InstantSearch, SearchBox }  = require("react-instantsearch-hooks-web");
const Heading = require("../../../components/Heading");
const { getEmployees } = require("../../../models/employee.server");

const searchClient = algoliasearch('KG5XNDOMR2', 'cfeaac376bb4e97c121d8056ba0dbb48');
const index = searchClient.initIndex('employees');

export async function action({ request }) {
    const formData = await request.formData();
    const action = formData.get('_action');

    const employees = await getEmployees();
    if (action === 'index') {
        try {
            await index.saveObjects(employees, { autoGenerateObjectIDIfNotExist: true }).wait();
            // await index.search('').then(({ hits }) => console.log(hits[0]))

        } catch (error) {
            console.log(error);
        }

    }
    return null;
}
export function links() {
    return [
        {
            rel: "stylesheet",
            href: algoliaStyles
        }
    ];
}

export default function PayInFull() {
    const transition = useTransition();
    return (
        <div className="space-y-4">
            <Link to="/dashboard/employee-payments" className="text-black hover:underline hover:text-blue-500">
                <ArrowLeftIcon className="w-5 h-5 inline" /> Back to employee payments
            </Link>
            <Heading title='Pay in full' />
            <div className="grid grid-cols-2 gap-x-5 max-w-5xl pr-20">
                <div>
                    <h2 className=" text-light-black text-md">Select an employee to pay in full</h2>
                    <InstantSearch searchClient={searchClient} indexName="employees">
                        <SearchBox />
                        <div className="max-h-96 overflow-y-scroll">

                            <Hits hitComponent={Hit} />
                        </div>
                    </InstantSearch>
                </div>
                <div className="w-full border border-slate-200 px-3 py-3 rounded-lg">
                    {/* Employee details */}
                    <Outlet />
                </div>
                {/* <Form method="post">
                    <input type="hidden" value="index" />
                    <button
                        type="sumbit"
                        name="_action"
                        value="index"
                        className="bg-blue-500 px-6 py-2 rounded text-white"
                    >
                        {transition.submission && transition.submission.formData.get('_action') === "index" ? 'Indexing...' : 'Index algolia'}
                    </button>
                </Form> */}
            </div>
        </div>
    );
}

function Hit({ hit }) {
    // console.log({ hit })
    return (
        <Link to={`${hit.id}`}>
            <p className="text-light-black">
                <Highlight attribute="name" hit={hit} />
                <br />
                {hit.mobile}
            </p>
        </Link>
    )
}