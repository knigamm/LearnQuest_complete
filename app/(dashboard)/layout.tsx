import Navbar from "../components/navbar";

import { UserData } from "../util/types";
import getuserdetails from "../util/getuserdetails";

const Dashboardlayout = async ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  const userdata: UserData = await getuserdetails();

  return (
    <div className="h-full w-full">
      <div className="h-16 w-full fixed inset-y-0 z-40">
        <Navbar userdata={userdata} />
      </div>
      <div className="pt-[4rem] h-full z-10">{children}</div>
    </div>
  );
};

export default Dashboardlayout;
