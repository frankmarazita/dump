"use client";

import { id, init, tx } from "@instantdb/react";
import MDEditor from "@uiw/react-md-editor";
import ClipLoader from "react-spinners/ClipLoader";

const APP_ID = "57079df8-619e-4250-a8c4-42db4a463cda";

type Dump = {
  id: string;
  text: string;
  createdAt: number;
};

type Schema = {
  dump: Dump;
};

const db = init<Schema>({ appId: APP_ID });

function App() {
  const pathname = window.location.pathname;
  const filepath = decodeURIComponent(pathname.substring(1));
  const parts = filepath.split("/");
  const title = parts[parts.length - 1];

  const { isLoading, error, data } = db.useQuery({
    dump: {
      $: {
        where: {
          filepath: filepath,
        },
      },
    },
  });

  if (isLoading) {
    return (
      <div
        style={
          {
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "100vh",
          } as React.CSSProperties
        }
      >
        <ClipLoader color="#000" speedMultiplier={3} />
      </div>
    );
  }

  if (error) {
    console.error(error);
    return <div>An error occurred!</div>;
  }

  const { dump } = data;

  // if no dump exists, create one
  if (dump.length === 0) {
    db.transact(
      tx.dump[id()].update({
        text: "",
        createdAt: Date.now(),
        filepath: filepath,
      })
    );
  }

  if (dump.length === 0) {
    return <div></div>;
  }

  const d = dump[0]; // get the first dump

  return <DumpEditor key={d.id} dump={d} title={title} />;
}

function editDump(dump: Dump) {
  db.transact(tx.dump[dump.id].update(dump));
}

function DumpEditor({ dump, title }: { dump: Dump; title: string }) {
  return (
    <div className="flex w-full flex-grow flex-col overflow-y-auto bg-[#0d1117] text-[#c9d1d9]">
      <h1 className="text-2xl font-bold p-4">{title || "DUMP"}</h1>
      <MDEditor
        className="flex-grow"
        value={dump.text}
        extraCommands={[]}
        onChange={(value) => editDump({ ...dump, text: value ?? "" })}
      />
    </div>
  );
}
export default App;
