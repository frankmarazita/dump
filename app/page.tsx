"use client";

import { id, init, tx } from "@instantdb/react";

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
    return <div>Fetching data...</div>;
  }
  if (error) {
    return <div>Error fetching data: {error.message}</div>;
  }

  const { dump } = data;

  // if no dump exists, create one
  if (dump.length === 0) {
    db.transact(
      tx.dump[id()].update({ text: "Hello, World!", createdAt: Date.now() })
    );
  }

  return (
    <div style={styles.container}>
      <div style={styles.header}>dump</div>
      {dump.map((d) => (
        <DumpForm key={d.id} dump={d} />
      ))}
    </div>
  );
}

function editDump(dump: Dump) {
  db.transact(tx.dump[dump.id].update(dump));
}

function DumpForm({ dump }: { dump: Dump }) {
  // Text area for editing the dump text
  return (
    <textarea
      value={dump.text}
      style={styles.input}
      onChange={(e) => editDump({ ...dump, text: e.target.value })}
    />
  );
}

const styles: Record<string, React.CSSProperties> = {
  container: {
    boxSizing: "border-box",
    backgroundColor: "#fafafa",
    fontFamily: "code, monospace",
    height: "100vh",
    display: "flex",
    alignItems: "center",
    flexDirection: "column",
  },
  header: {
    letterSpacing: "2px",
    fontSize: "50px",
    color: "lightgray",
    marginBottom: "10px",
  },
  input: {
    backgroundColor: "transparent",
    fontFamily: "code, monospace",
    padding: "10px",
    fontStyle: "italic",
    height: "calc(100vh - 170px)",
    width: "80%",
  },
};

export default App;
