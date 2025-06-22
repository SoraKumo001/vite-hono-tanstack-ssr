import { Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { enableSSR } from "react-query-ssr";

interface Center {
  name: string;
  enName: string;
  officeName?: string;
  children?: string[];
  parent?: string;
  kana?: string;
}
interface Centers {
  [key: string]: Center;
}

const fetchCenters = (): Promise<Centers> =>
  fetch(`https://www.jma.go.jp/bosai/common/const/area.json`)
    .then((r) => r.json())
    .then(
      // Additional weights (500 ms)
      (r) =>
        new Promise((resolve) => setTimeout(() => resolve(r as Centers), 500))
    );

const Page = () => {
  const query = useQuery({
    ...enableSSR,
    queryKey: ["centers"],
    queryFn: () => fetchCenters(),
  });

  if (!query.data) return <div>loading</div>;
  return (
    <>
      <title>天気のエリア一覧</title>

      <div>
        {query.data &&
          Object.entries(query.data.offices).map(([code, { name }]) => (
            <div key={code}>
              <Link to={`/weather/${code}`}>{name}</Link>
            </div>
          ))}
      </div>
    </>
  );
};
export default Page;
