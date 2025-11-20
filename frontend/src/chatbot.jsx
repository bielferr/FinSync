import { useState } from "react";
import "./chat.css";

export default function ChatBot() {
  const [mensagem, setMensagem] = useState("");
  const [historico, setHistorico] = useState([]);
  const [carregando, setCarregando] = useState(false);

  async function enviarMensagem() {
    if (!mensagem.trim()) return;

    const novaMensagem = { role: "user", content: mensagem };
    const novoHistorico = [...historico, novaMensagem];

    setHistorico(novoHistorico);
    setMensagem("");
    setCarregando(true);

    const res = await fetch("http://localhost:3001/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ mensagem, historico }),
    });

    const data = await res.json();

    const respostaBot = { role: "assistant", content: data.resposta };
    setHistorico([...novoHistorico, respostaBot]);
    setCarregando(false);
  }

  return (
    <div className="chat-container">
      <h2>Assistente Financeiro</h2>
      
      <div className="chat-window">
        {historico.map((msg, i) => (
          <div key={i} className={`msg ${msg.role}`}>
            {msg.content}
          </div>
        ))}

        {carregando && <div className="msg assistant">Digitando...</div>}
      </div>

      <div className="chat-input">
        <input
          value={mensagem}
          onChange={(e) => setMensagem(e.target.value)}
          placeholder="Digite sua pergunta financeira..."
        />
        <button onClick={enviarMensagem}>Enviar</button>
      </div>
    </div>
  );
}
