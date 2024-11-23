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
  const { isLoading, error, data } = db.useQuery({ dump: {} });

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
      tx.dump[id()].update({ text: "Hello, World!", createdAt: Date.now() })
    );
  }

  const d = dump[0]; // get the first dump

  return <DumpEditor key={d.id} dump={d} />;
}

function editDump(dump: Dump) {
  db.transact(tx.dump[dump.id].update(dump));
}

function DumpEditor({ dump }: { dump: Dump }) {
  return (
    <MDEditor
      value={dump.text}
      fullscreen={true}
      extraCommands={[]}
      onChange={(value) => editDump({ ...dump, text: value ?? "" })}
    />
  );
}
export default App;
