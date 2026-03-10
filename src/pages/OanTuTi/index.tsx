import React, { useState } from "react";
import { Card, Button, List, Typography } from "antd";

type Choice = "Kéo" | "Búa" | "Bao";

interface HistoryItem {
  player: Choice;
  computer: Choice;
  result: string;
}

const choices: Choice[] = ["Kéo", "Búa", "Bao"];

const getResult = (player: Choice, computer: Choice) => {
  if (player === computer) return "Hòa";

  if (
    (player === "Kéo" && computer === "Bao") ||
    (player === "Búa" && computer === "Kéo") ||
    (player === "Bao" && computer === "Búa")
  ) {
    return "Bạn thắng";
  }

  return "Bạn thua";
};

const OanTuTi = () => {
  const [history, setHistory] = useState<HistoryItem[]>([]);

  const playGame = (playerChoice: Choice) => {
    const computerChoice =
      choices[Math.floor(Math.random() * choices.length)];

    const result = getResult(playerChoice, computerChoice);

    const newRound = {
      player: playerChoice,
      computer: computerChoice,
      result,
    };

    setHistory([newRound, ...history]);
  };

  return (
    <Card title="Trò chơi Oẳn Tù Tì">
      <div style={{ marginBottom: 20 }}>
        <Button onClick={() => playGame("Kéo")} style={{ marginRight: 10 }}>
          Kéo
        </Button>

        <Button onClick={() => playGame("Búa")} style={{ marginRight: 10 }}>
          Búa
        </Button>

        <Button onClick={() => playGame("Bao")}>
          Bao
        </Button>
      </div>

      <Typography.Title level={4}>Lịch sử ván đấu</Typography.Title>

      <List
        bordered
        dataSource={history}
        renderItem={(item, index) => (
          <List.Item>
            Ván {history.length - index}: Bạn chọn {item.player} | Máy chọn{" "}
            {item.computer} → <b>{item.result}</b>
          </List.Item>
        )}
      />
    </Card>
  );
};

export default OanTuTi;