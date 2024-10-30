import { Link } from "@nextui-org/react";

export default function NotFound() {
  return (
    <div className="flex">
      <h1 className="flex items-center justify-center pr-5 mr-5 text-2xl font-medium align-top border-r border-solid">
        404
      </h1>
      <div>
        <h2 className="text-sm font-normal">This page could not be found.</h2>
        <Link className="text-sm font-normal" href="/">
          Home
        </Link>
      </div>
    </div>
  );
}
