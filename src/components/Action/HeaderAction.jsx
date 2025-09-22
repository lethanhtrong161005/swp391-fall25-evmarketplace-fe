import React from "react";
import { Button, Dropdown, Menu } from "antd";
import { UserOutlined } from "@ant-design/icons";

const HeaderAction = ({ isLoggedIn = false, user }) => {


  if (isLoggedIn) {
    const menuItems = [
      {key:"infouser", label: "Hồ sơ", path: "/infouser"},
      {key:"logout", label: "Đăng xuất", path: "/logout"}
    ];

    return (
      <div style={{display:"flex", gap:"8px"}}>
        <Button>Đăng tin</Button>
        <Dropdown
        menu = {{
          items: menuItems,
        }}
        placement="bottomRight"
        trigger={["click"]}
        >
          <Button icon={<UserOutlined/>} type="text">Hồ sơ</Button>
        </Dropdown>
      </div>
    )
};

return (
  <div style={{display:"flex", gap:"8px"}}>
    <Button>Đăng tin</Button>
    <Button type="primary">Đăng nhập</Button>
  </div>
)
}

export default HeaderAction;
