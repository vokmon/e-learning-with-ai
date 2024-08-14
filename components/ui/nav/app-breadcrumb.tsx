"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Fragment, ReactNode } from "react";

type AppreadcrumbProps = {
  homeElement: ReactNode;
  separator: ReactNode;
  containerClasses?: string;
  listClasses?: string;
  activeClasses?: string;
  capitalizeLinks?: boolean;
};

const excludeLinks = ["articles", "assessment"];

export default function Appreadcrumb({
  homeElement,
  separator,
  containerClasses,
  listClasses,
  activeClasses,
  capitalizeLinks,
}: AppreadcrumbProps) {
  const paths = usePathname();

  const pathNames = paths.split("/").filter((path) => path);
  return (
    <div>
      <ul className={containerClasses}>
        <li className={listClasses}>
          <Link href={"/"}>{homeElement}</Link>
        </li>
        {pathNames.length > 0 && separator}
        {pathNames.map((link, index) => {
          let href = `/${pathNames.slice(0, index + 1).join("/")}`;
          let itemClasses =
            paths === href ? `${listClasses} ${activeClasses}` : listClasses;
          let itemLink = capitalizeLinks
            ? link[0].toUpperCase() + link.slice(1, link.length)
            : link;
          return (
            <Fragment key={index}>
              <li className={itemClasses}>
                {excludeLinks.includes(itemLink.toLocaleLowerCase()) ? (
                  <p className="cursor-auto">{itemLink}</p>
                ) : (
                  <Link href={href}>{itemLink}</Link>
                )}
              </li>
              {pathNames.length !== index + 1 && separator}
            </Fragment>
          );
        })}
      </ul>
    </div>
  );
}
