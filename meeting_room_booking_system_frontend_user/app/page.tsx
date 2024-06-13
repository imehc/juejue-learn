import { cookies } from "next/headers";

export default function Home() {
  const cookieStore = cookies();

  // return (
  //   // TODO:
  //   <section className="flex flex-col items-center justify-center gap-4 py-8 md:py-10" />
  // );
  return cookieStore.getAll().map((cookie) => (
    <div key={cookie.name}>
      <p>Name: {cookie.name}</p>
      <p>Value: {cookie.value}</p>
    </div>
  ));
}
