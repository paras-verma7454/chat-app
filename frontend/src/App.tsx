import { useEffect, useRef, useState } from "react"


function App() {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([]);
  // @ts-ignore
  const wsRef = useRef(); 
  useEffect(() => {
    const ws = new WebSocket('ws://localhost:8080');
    wsRef.current = ws; 
    ws.onopen = () => {
      ws.send(JSON.stringify({
        type: "join",
        payload:{
          roomId:"red"
        }
      }))
      console.log('WebSocket Client Connected'); 
    };
    ws.onmessage = (event) => {
      console.log('message received');
      // @ts-ignore
      setMessages((prev) => [...prev, event.data]);
    };
    return () => {
      ws.close();
      console.log('WebSocket Client Disconnected');
    }
    
  }, [])


   function send(){
      console.log('message send');
      // @ts-ignore
        wsRef.current.send(JSON.stringify({
          type:"chat",
          payload:{
            message:input
          }
        }));
      
    
  }
 

  return (
    <>
    <div className="flex  justify-center items-center h-screen -mt-10">

    
      <div className="flex flex-col h-[70vh] justify-between ">
        <div className="bg-red-200 w-full rounded-md h-full scroll-auto overflow-y-scroll">
          {messages.map((message, index) => (
            <div key={index} className="flex flex-col w-fit">
            <span className="bg-white p-2 px-4 ml-4 m-2 rounded-md">

              {message}
            </span>
            </div>
          ))}
        </div>
        <div className="flex bg-white border-2 w-fit justify-between rounded-md p-1">
          <input type="text" onChange={(e) => setInput(e.target.value)} className="border-none w-[60vw] border-black outline-none hover:border-none" />
          <button className="bg-blue-500 px-4 py-2 text-white rounded cursor-pointer" onClick={send}>
            Send
          </button>
        </div>
      </div>
      </div>
    </>
  )
}

export default App
