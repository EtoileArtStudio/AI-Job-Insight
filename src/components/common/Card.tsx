import React from 'react';
import './Card.css';

/**
 * Card UIコンポーネント
 * 
 * 視覚的な区切りを提供し、コンテンツをグループ化するためのカードコンポーネント。
 * 
 * @param title - カードのタイトル（オプション）
 * @param children - カード内に表示するコンテンツ
 * @param className - 追加のCSSクラス名
 */
interface CardProps {
  title?: string;
  children: React.ReactNode;
  className?: string;
}

const Card: React.FC<CardProps> = ({ title, children, className = '' }) => {
  return (
    <div className={`card ${className}`}>
      {title && <div className="card-header">{title}</div>}
      <div className="card-body">{children}</div>
    </div>
  );
};

export default Card;
