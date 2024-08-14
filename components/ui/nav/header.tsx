import Image from "next/image";
import appLogo from "../../../assets/app_logo.png";

export default function Header() {
  return (
    <nav className="flex flex-col items-start justify-start gap-3 w-full max-w-5xl">
      <div className="z-10  items-center justify-start lg:flex gap-2">
        <Image
          src={appLogo}
          alt="App Logo"
          className="dark:invert"
          width={60}
          height={20}
          priority
        />
        <h1 className="text-2xl">Empower your learning with AI</h1>
      </div>
      <h3 className="text-lg">
        Achieve your goals faster with our AI-powered platform. Enjoy
        interactive lessons, smart assessments, and data-driven insights to
        optimize your learning experience.
      </h3>
    </nav>
  );
}
