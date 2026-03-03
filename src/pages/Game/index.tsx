import React, { useState } from 'react';
import { Card, InputNumber, Button, Typography, Space, Progress, message } from 'antd';

const { Title, Text } = Typography;

const Game: React.FC = () => {
  const [randomNumber, setRandomNumber] = useState<number>(
    Math.floor(Math.random() * 100) + 1,
  );

  const [inputValue, setInputValue] = useState<number | null>(null);
  const [attemptsLeft, setAttemptsLeft] = useState<number>(10);
  const [isGameOver, setIsGameOver] = useState<boolean>(false);

  const handleGuess = () => {
    if (inputValue === null || isGameOver) return;

    const remaining = attemptsLeft - 1;

    if (inputValue === randomNumber) {
      message.success('Chúc mừng! Bạn đã đoán đúng!');
      setIsGameOver(true);
      return;
    }

    if (remaining === 0) {
      message.error(`Bạn đã hết lượt! Số đúng là ${randomNumber}`);
      setAttemptsLeft(0);
      setIsGameOver(true);
      return;
    }

    if (inputValue < randomNumber) {
      message.info('Bạn đoán quá thấp!');
    } else {
      message.info('Bạn đoán quá cao!');
    }

    setAttemptsLeft(remaining);
  };

  const handleReset = () => {
    setRandomNumber(Math.floor(Math.random() * 100) + 1);
    setInputValue(null);
    setAttemptsLeft(10);
    setIsGameOver(false);
    message.destroy(); 
    message.info('Bắt đầu trò chơi mới!');
  };

  return (
    <Card style={{ maxWidth: 860, margin: '50px auto' }}>
      <Title level={3}>Trò chơi đoán số ngẫu nhiên</Title>

      <Text>Còn lại {attemptsLeft} lượt chơi</Text>

      <Progress
        percent={(attemptsLeft / 10) * 100}
        strokeColor={
            attemptsLeft > 6 ? '#52c41a' : attemptsLeft > 3 ? '#faad14' : '#ff4d4f'
        }
        showInfo={false}
        style={{ margin: '10px 0 20px 0' }}
        />

      <Space direction="vertical" style={{ width: '100%' }}>
        <InputNumber
          min={1}
          max={100}
          value={inputValue ?? undefined}
          onChange={(value) => setInputValue(value)}
          disabled={isGameOver}
          style={{ width: '100%' }}
          placeholder="Nhập số từ 1 đến 100"
        />

        <Button type="primary" onClick={handleGuess} disabled={isGameOver}>
          Dự đoán
        </Button>

        <Button onClick={handleReset}>
          Chơi lại
        </Button>
      </Space>
    </Card>
  );
};

export default Game;
