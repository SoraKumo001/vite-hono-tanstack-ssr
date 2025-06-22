import { useQuery } from "@tanstack/react-query";
import { createFileRoute, Link, useParams } from "@tanstack/react-router";
import { enableSSR } from "react-query-ssr";

export interface WeatherType {
  publishingOffice: string;
  reportDatetime: string;
  targetArea: string;
  headlineText: string;
  text: string;
}

/**
 * Data obtained from the JMA website.
 */
const fetchWeather = (id: number): Promise<WeatherType> =>
  fetch(
    `https://www.jma.go.jp/bosai/forecast/data/overview_forecast/${id}.json`
  )
    .then((r) => r.json())
    .then(
      // Additional weights (500 ms)
      (r) =>
        new Promise((resolve) =>
          setTimeout(() => resolve(r as WeatherType), 100)
        )
    );

/**
 * Components for displaying weather information
 */

const Page = () => {
  const { code } = useParams({ from: "/weather/$code" });
  const query = useQuery({
    ...enableSSR,
    queryKey: ["weather", code],
    queryFn: () => fetchWeather(code),
  });

  if (!query.data) return <div>loading</div>;
  const { targetArea, reportDatetime, headlineText, text } = query.data;
  return (
    <>
      <title>{`${targetArea} の天気`}</title>
      <Link className="btn btn-xs" to="../..">
        ⏪️Home
      </Link>
      <div
        className={
          "mt-2 rounded-lg relative " +
          (query.isFetching ? "bg-gray-200" : undefined)
        }
      >
        <div>
          {query.isFetching && (
            <div
              style={{
                position: "absolute",
                color: "white",
                top: "50%",
                left: "50%",
              }}
            >
              loading
            </div>
          )}
          <button
            className="btn btn-primary btn-sm"
            onClick={() => query.refetch()}
          >
            Reload
          </button>
          <h1 className="text-2xl">{targetArea}</h1>
          <div>
            {new Date(reportDatetime).toLocaleString("ja-JP", {
              timeZone: "JST",
            })}
          </div>
          <div>{headlineText}</div>
          <div className="whitespace-pre">{text}</div>
        </div>
      </div>
    </>
  );
};

export const Route = createFileRoute("/weather/$code")({
  component: Page,
});
