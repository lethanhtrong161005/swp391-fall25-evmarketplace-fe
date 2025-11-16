import React from "react";
import { Breadcrumb } from "antd";
import ChatPage from "@components/Chat/ChatPage/index";
import s from "./styles.module.scss";

/**
 * Chat page - Main chat interface page
 */
const Chat = () => {
  return (
    <div className={s.wrapper}>
      <div className={s.breadcrumb}>
        <Breadcrumb items={[{ title: "ReEV", href: "/" }, { title: "Tin nhắn" }]} />
      </div>
      <div className={s.content}>
        <ChatPage />
      </div>
    </div>
  );
};

export default Chat;

