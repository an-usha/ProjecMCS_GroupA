import { Menu } from "antd";
import { Link } from "react-router-dom";

import {
  PieChartOutlined,
  UserOutlined
} from "@ant-design/icons";

import { useSelector } from "react-redux";

const { SubMenu } = Menu;

function SideBar() {
  const { userInfo } = useSelector((state) => state.auth);
  return (
    <Menu theme="light" defaultSelectedKeys={["1"]} mode="inline">
      <Menu.Item key="1" icon={<PieChartOutlined />}>
        <Link to={"/"}>Dashboard</Link>
      </Menu.Item>
      <SubMenu key="sub6" icon={<UserOutlined />} title="User Info">
        <Menu.Item key="15">
          <Link to={"/userDetails"}>User Details</Link>
        </Menu.Item>
        </SubMenu>
    </Menu>
  );
}

export default SideBar;
