import { cookies } from "next/headers";

const getSession = () => {
  try {
    const response = cookies().get("session");
    return response;
  } catch (error) {
    console.log(error);
  }
};

export default getSession;
