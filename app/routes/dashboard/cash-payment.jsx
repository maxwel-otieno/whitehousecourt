const { Form, Link, Outlet, useActionData, useCatch, useTransition } = require("@remix-run/react");
const algoliasearch = require("algoliasearch");
const algoliaStyles = require("instantsearch.css/themes/satellite.css");
const { useEffect, useRef } = require("react");
const { Highlight, Hits, InstantSearch, SearchBox } = require("react-instantsearch-hooks-web");
const Heading = require("../../components/Heading");
const { getTenant, getTenants } = require("../../models/tenant.server");

const searchClient = algoliasearch('KG5XNDOMR2', 'cfeaac376bb4e97c121d8056ba0dbb48');
const index = searchClient.initIndex('tenants');

export function meta() {
    return {
        title: 'Tenant cash payment | White House Court',
        // description: 'Register as a White House Court tenant'
    };
}

export function links() {
    return [
        {
            rel: "stylesheet",
            href: algoliaStyles
        }
    ];
}

export async function loader({ params }) {
    // const tenant = await getTenant(params.id);
    // console.log({ tenant });
    return null;
}
export async function action({ request }) {
    const formData = await request.formData();
    const action = formData.get('_action');

    const tenants = await getTenants();
    if (action === 'index') {
        try {
            await index.saveObjects(tenants, { autoGenerateObjectIDIfNotExist: true }).wait();
            // await index.search('').then(({ hits }) => console.log(hits[0]))

        } catch (error) {
            console.log(error);
        }

    }
    return null;
}
export default function CashPayment() {
    const transition = useTransition();
    const actionData = useActionData();
    const searchRef = useRef(null);

    useEffect(() => {
        searchRef.current?.focus
    }, []);
    return (
        <div className="space-y-4">
            {/* <Link to=".." className="text-black hover:underline hover:text-blue-500">
                <ArrowLeftIcon className="w-5 h-5 inline" /> Back to payroll menu
            </Link> */}
            <Heading title='Tenant cash payment' />
            <div className="grid grid-cols-2 gap-x-5 max-w-5xl pr-20">
                <div>
                    <h2 className=" text-light-black text-md mb-2">Select a tenant to record cash payment</h2>
                    <InstantSearch searchClient={searchClient} indexName="tenants">
                        <SearchBox ref={searchRef} />
                        <div className="max-h-96 overflow-y-scroll">

                            <Hits hitComponent={Hit} />
                        </div>
                    </InstantSearch>
                </div>
                <div className="w-full border border-slate-200 px-3 py-3 rounded-lg">
                    {/* Employee details */}
                    <Outlet />
                </div>
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
    );
}

function Hit({ hit }) {
    // console.log({ hit })
    return (
        <Link to={`${hit.id}`}>
            {/* <p className="text-light-black">
                <Highlight attribute="name" hit={hit} />
                <br />
                {hit.mobile}
            </p> */}
            <div className="text-light-black">
                <p>
                    <Highlight attribute="name" hit={hit} />
                </p>
                <p>Plot {hit.house.plotNumber} / House {hit.house.houseNumber}</p>
            </div>
        </Link>
    )
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
        </div>
    );
}