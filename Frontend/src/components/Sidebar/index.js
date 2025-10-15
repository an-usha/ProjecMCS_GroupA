import { Menu } from "antd";
import { Link } from "react-router-dom";

import {
  DesktopOutlined,
  PieChartOutlined,
  FileOutlined,
  TeamOutlined,
  UserOutlined,
  BankOutlined,
  MobileOutlined,
  CreditCardOutlined,
  SettingOutlined,
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
      {/* <Menu.Item key="2" icon={<DesktopOutlined />}>
        <Link to={'/createAudit'}>Create Audit Request</Link>
      </Menu.Item> */}
      {/* <Menu.Item key="3" icon={<DesktopOutlined />}>
        <Link to={'/info'}>Option 2</Link>
      </Menu.Item> */}
      <SubMenu key="sub1" icon={<UserOutlined />} title="Finacle CBS">
        <Menu.Item key="4">
          <Link to={"/checkAccountBalance"}>Check Balance</Link>
        </Menu.Item>
        <Menu.Item key="5">
          <Link to={"/miniStatement"}>Mini Statement</Link>
        </Menu.Item>
        <Menu.Item key="6">
          <Link to={"/viewStatement"}>Full Statement</Link>
        </Menu.Item>
        <Menu.Item key="7">
          <Link to={"/kycDetail"}>KYC Detail</Link>
        </Menu.Item>
        <Menu.Item key="8">
          <Link to={"/lienAccount"}>Account Lein</Link>
        </Menu.Item>
        {/* <Menu.Item key="7">User 3</Menu.Item> */}
      </SubMenu>
      <SubMenu key="sub2" icon={<CreditCardOutlined />} title="CCMS">
        <Menu.Item key="9">
          <Link to={"/blockDebitCard"}>Block Debit Card</Link>
        </Menu.Item>
      </SubMenu>
      <SubMenu key="sub3" icon={<MobileOutlined />} title="Bank XP">
        <Menu.Item key="10">
          <Link to={"/bankXP"}>Mobile Banking</Link>{" "}
        </Menu.Item>
      </SubMenu>
      <SubMenu key="sub4" icon={<PieChartOutlined />} title="Reports">
        <Menu.Item key="11">
          <Link to={"/leinAccountReport"}>Account Lein </Link>{" "}
        </Menu.Item>
        <Menu.Item key="12">
          <Link to={"/cardBlockReport"}>Card Block </Link>{" "}
        </Menu.Item>
      </SubMenu>
      <SubMenu key="sub7" icon={<UserOutlined />} title="Customer Detail">
        <Menu.Item key="16">
          <Link to={"/customerDetail"}>View Details</Link>
        </Menu.Item>
      </SubMenu>
      <SubMenu key="sub5" icon={<PieChartOutlined />} title="Call Center">
        <Menu.Item key="13">
        <Link to={"/missedCallList"}>Missed Calls</Link>
        </Menu.Item>
        <Menu.Item key="14">
        <Link to={"/missedCallRemarks"}>Provide Remarks</Link>
        </Menu.Item>
      </SubMenu>
      { userInfo!== null && 
      (userInfo.departmentName === 'Digital Banking Unit' || userInfo.departmentName === 'Call Centre')?
      <SubMenu key="sub6" icon={<SettingOutlined />} title="Settings">
        <Menu.Item key="15">
          <Link to={"/userDetails"}>User Details</Link>
        </Menu.Item>
        </SubMenu>
        :''
}
    </Menu>
  );
}

export default SideBar;
