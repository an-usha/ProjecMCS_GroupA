import { useSelector } from "react-redux";
import { Image } from "antd";

function DashboardLayout() {
  const { userInfo } = useSelector((state) => state.auth);
  const base64Image = `data:image/png;base64,${userInfo.image}`;
  const imageUrl = `${process.env.PUBLIC_URL}/images/callCenterImage.png`;
  return (
    <>
      <h1>Welcome {userInfo.userName}!</h1>
      {
      (userInfo.image !== '')?<Image src={base64Image} alt="Base64 Image" />
      :
           <Image
           width={200} 
           src={imageUrl} 
           alt="Call center Image"
         />
      }
    </>
  );
}

export default DashboardLayout;
