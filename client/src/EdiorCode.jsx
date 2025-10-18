import { useRef, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { io } from "socket.io-client";
import Editor from "@monaco-editor/react";
import { useAuth } from "./AuthContext";

const socket = io("http://localhost:3000");

const EdiorCode = () => {
  const { userName } = useAuth();
  const [code, setCode] = useState("");
  const [output, setOutput] = useState("");
  const [connected, setConnected] = useState(false);
  const [language, setLanguage] = useState("python");
  const editorRef = useRef(null);
  const [roomId, setRoomId] = useState("");
  const suppressChange = useRef(false);

  useEffect(() => {
    socket.on("connect", () => {
      console.log("🟢 Socket connected");
    });

    socket.on("sync-code", (data) => {
      setCode(data.code);
      setLanguage(data.language);
      setOutput(data.output);
      if (editorRef.current) editorRef.current.setValue(data.code);
    });

    socket.on("language-change", (newLang) => {
      if (newLang !== language) setLanguage(newLang);
    });

    socket.on("run-code", ({ output, status }) => {
      setOutput(`${output}\n\nStatus: ${status}`);
    });

    socket.on("user-joined", ({ username, socketId }) => {
      toast.success(`${username} joined the room (${socketId})`);
    });

    socket.on("code-change", (newCode) => {
      if (!editorRef.current) return;
      const currentCode = editorRef.current.getValue();
      if (newCode !== currentCode) {
        suppressChange.current = true;
        editorRef.current.setValue(newCode);
        setCode(newCode);
        setTimeout(() => (suppressChange.current = false), 50);
      }
    });

    return () => {
      socket.off("sync-code");
      socket.off("code-change");
      socket.off("language-change");
      socket.off("run-code");
      socket.off("user-joined");
    };
  }, [language]);

  const handleJoin = () => {
    if (!roomId) {
      alert("Room ID is required");
      return;
    }
    socket.emit("join-room", roomId, userName);
    setConnected(true);
  };

  const handleRunCode = () => {
    if (!code) return;
    socket.emit("run-code", roomId);
  };

  const handleLanguageChange = (e) => {
    const newLang = e.target.value;
    setLanguage(newLang);
    socket.emit("language-change", roomId, newLang);
  };

  const handleEditorChange = (newCode) => {
    if (suppressChange.current) return;
    setCode(newCode);
    socket.emit("code-change", roomId, newCode);
  };
  const handleLeave = ()=>{
    socket.emit("leave-room",roomId)
    setConnected(false)
    setRoomId("")
  }
  return (
    <div className="min-h-[80vh] w-full flex flex-col gap-2">
      {!connected ? (
        <div className="mx-auto max-w-md w-full flex flex-col gap-4 my-auto px-4 bg-white py-6">
          <input
            type="text"
            value={roomId}
            onChange={(e) => setRoomId(e.target.value)}
            placeholder="Enter Room ID"
            className="bg-gray-100 py-2 px-2 rounded-lg"
          />
          <button
            onClick={handleJoin}
            className="py-2 bg-black/65 hover:bg-black text-white rounded-lg font-bold"
          >
            Join Room
          </button>
        </div>
      ) : (
        <>
          <div className="flex justify-between items-center mb-2">
            <select
              value={language}
              onChange={handleLanguageChange}
              className="px-2 py-1 border rounded"
            >
              <option value="python">Python</option>
              <option value="javascript">JavaScript</option>
              <option value="java">Java</option>
              <option value="c">C</option>
              <option value="cpp">C++</option>
            </select>
            <button
              onClick={handleRunCode}
              className="px-4 py-1 bg-green-500 text-white rounded"
            >
              RUN CODE
            </button >
             
            <button onClick={handleLeave}  className="px-4 py-1 bg-red-500 text-white rounded">Leave Room</button>
          </div>

          <Editor
            height="400px"
            language={language}
            value={code}
            theme="vs-dark"
            onChange={handleEditorChange}
            onMount={(editor) => (editorRef.current = editor)}
            options={{
              minimap: { enabled: false },
              fontSize: 16,
              automaticLayout: true,
            }}
          />

          <div className="mt-2 p-4 bg-white rounded shadow max-h-40 overflow-y-auto">
            <strong>Output:</strong>
            <pre>{output}</pre>
          </div>
        </>
      )}
    </div>
  );
};

export default EdiorCode;
