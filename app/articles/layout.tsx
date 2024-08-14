import Appreadcrumb from "@/components/ui/nav/app-breadcrumb";
import appLogo from "../../assets/app_logo.png";
import Image from "next/image";

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="w-full flex flex-col h-screen">
      <div className="flex px-10 items-center">
        <Image
          src={appLogo}
          alt="App Logo"
          className="dark:invert"
          width={50}
          priority
        />
        <Appreadcrumb
          homeElement={"Home"}
          separator={<span> | </span>}
          activeClasses="text-gray-500"
          containerClasses="flex py-5"
          listClasses="hover:underline mx-2 font-bold"
          capitalizeLinks
        />
      </div>
      <section className="self-center w-full h-full px-10">{children}</section>
    </div>
  );
}
