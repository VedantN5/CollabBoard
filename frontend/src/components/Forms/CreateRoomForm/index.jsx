import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Peer from "peerjs";

const CreateRoomForm = ({ uuid, socket, setUser, setMyPeer }) => {
  const [name, setName] = useState("");
  const [roomId, setRoomId] = useState(uuid());
  const navigate = useNavigate();

  const generateRoomCode = () => {
    setRoomId(uuid());
  };

  const copyRoomCode = () => {
    navigator.clipboard.writeText(roomId);
    alert("Room code copied!");
  };

  const handleRoomCreate = (e) => {
    e.preventDefault();

    if (!name.trim()) {
      alert("Please enter your name");
      return;
    }

    const myPeer = new Peer(undefined, {
      host: "localhost",
      port: 5001,
      path: "/",
      secure: false,
    });


    setMyPeer(myPeer);

    myPeer.on("open", (id) => {
      const roomData = {
        name,
        roomId,
        userId: id,
        host: true,
        presenter: true,
      };

      setUser(roomData);
      socket.emit("userJoined", roomData);
      navigate(`/${roomId}`);
    });

    myPeer.on("error", (err) => {
      console.error("Peer connection error:", err);
      myPeer.reconnect();
    });
  };

  return (
    <form className="form col-md-12 mt-5" onSubmit={handleRoomCreate}>
      <div className="form-group">
        <input
          type="text"
          className="form-control my-2"
          placeholder="Enter your name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </div>

      <div className="form-group d-flex align-items-center">
        <input
          type="text"
          className="form-control my-2"
          placeholder="Room Code"
          value={roomId}
          readOnly
        />
        <button
          type="button"
          onClick={generateRoomCode}
          className="btn btn-primary mx-1"
        >
          Generate
        </button>
        <button
          type="button"
          onClick={copyRoomCode}
          className="btn btn-danger"
        >
          Copy
        </button>
      </div>

      <button
        type="submit"
        className="mt-4 btn btn-primary btn-block form-control"
      >
        Generate Room
      </button>
    </form>
  );
};

export default CreateRoomForm;
