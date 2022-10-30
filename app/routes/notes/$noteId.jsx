const { json, redirect } = require("@remix-run/node");
const { Form, useCatch, useLoaderData } = require("@remix-run/react");
const invariant = require("tiny-invariant");

const { deleteNote } = require("~/models/note.server");
const { getNote } = require("~/models/note.server");
const { requireUserId } = require("~/session.server");

export async function loader({ request, params }) {
  const userId = await requireUserId(request);
  invariant(params.noteId, "noteId not found");

  const note = await getNote({ userId, id: params.noteId });
  if (!note) {
    throw new Response("Not Found", { status: 404 });
  }
  return json({ note });
}

export async function action({ request, params }) {
  const userId = await requireUserId(request);
  invariant(params.noteId, "noteId not found");

  await deleteNote({ userId, id: params.noteId });

  return redirect("/notes");
}

export default function NoteDetailsPage() {
  const data = useLoaderData();

  return (
    <div>
      <h3 className="text-2xl font-bold">{data.note.title}</h3>

      <p className="py-6">{data.note.body}</p>

      <hr className="my-4" />

      <Form method="post">
        <button
          type="submit"
          className="rounded bg-blue-500  py-2 px-4 text-white hover:bg-blue-600 focus:bg-blue-400"
        >
          Delete
        </button>
      </Form>
    </div>
  );
}

export function ErrorBoundary({ error }) {
  console.error(error);

  return <div>An unexpected error occurred: {error.message}</div>;
}

export function CatchBoundary() {
  const caught = useCatch();

  if (caught.status === 404) {
    return <div>Note not found</div>;
  }

  throw new Error(`Unexpected caught response with status: ${caught.status}`);
}
