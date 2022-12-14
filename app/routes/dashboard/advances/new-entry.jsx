const { ArrowLeftIcon } = require("@heroicons/react/outline");
const { Link, Outlet } = require("@remix-run/react");
const algoliasearch = require("algoliasearch");
const { Highlight, Hits, InstantSearch, SearchBox } = require("react-instantsearch-hooks-web");
const algoliaStyles = require("instantsearch.css/themes/satellite.css");
const Heading = require("../../../components/Heading");

// This works
const searchClient = algoliasearch('KG5XNDOMR2', '6f538d8d106d0b4e0d5be4d7bfd92f29');
// ---------------------------------------------------------------------------------------

// const searchClient = algoliasearch('KG5XNDOMR2', 'cfeaac376bb4e97c121d8056ba0dbb48');

export function links() {
    return [
        {
            rel: "stylesheet",
            href: algoliaStyles
        }
    ];
}
export async function loader() {
    // const employees = await getEmployees();
    // const index = searchClient.initIndex('employees');


    // const record = { objectId: 1, name: 'test_record' }

    // try {
    //     await index.saveObjects(employees, { autoGenerateObjectIDIfNotExist: true }).wait();
    //     await index.search('').then(({ hits }) => console.log(hits[0]))

    // } catch (error) {
    //     console.log(error);
    // }
    return null;
}
export default function Advance() {
    return (
        <div className="space-y-4">
            <Link to="/dashboard/advances" className="text-black hover:underline hover:text-blue-500">
                <ArrowLeftIcon className="w-5 h-5 inline" /> Back to advances
            </Link>
            <Heading title='Advance' />
            <div className="grid grid-cols-2 gap-x-5 max-w-5xl pr-20">
                <div>
                    <h2 className=" text-light-black text-md">Select an employee to issue an advance</h2>
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
            </div>
        </div>
    )
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