import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import "highcharts/modules/exporting";
import "highcharts/modules/export-data";
import "highcharts/modules/offline-exporting";

function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-12">
      <p className="report-muted font-medium">No respondent left</p>
    </div>
  );
}

export default function SingleSelectChart({ hasData = true, chartData, baseText, questionText, categories, totalRespondents, }: { questionId: string; hasData?: boolean; chartData: any[]; categories: string[]; baseText: string; questionText: string; totalRespondents: number }) {
  if (!hasData) return <EmptyState />;

  const options: Highcharts.Options = {
    chart: {
      type: "column",
      height: 300,
      backgroundColor: "transparent",
    },
    title: { text: undefined },
    xAxis: {
      categories: categories,
      labels: {
        autoRotation: [-0, -0],
        style: { fontSize: "10px", color: "#8f92c8" },
      },
      lineColor: "#e7e4fb",
      tickColor: "#e7e4fb",
    },
    yAxis: {
      title: {
        text: "",
        style: { fontSize: "12px", color: "#8f92c8" },
      },
      labels: { style: { fontSize: "12px", color: "#8f92c8" } },
      gridLineColor: "#f0eefc",
    },
    plotOptions: {
      column: {
        borderWidth: 0,
        borderRadius: 4,
        pointPadding: 0.1,
        groupPadding: 0.1,
        dataLabels: {
          enabled: true,
          format: "{y}%",
          style: {
            fontSize: "11px",
            fontWeight: "600",
            color: "#252b59",
          },
        },
      },
    },
    series: chartData,
    legend: { enabled: chartData.length > 1 },
    credits: { enabled: false },
    tooltip: {
      formatter: function () {
        return `<b>${this.x}</b><br/>
                        ${this.series.name}: <b>${this.y}%</b><br/>
                        Count: <b>${Math.round(
          ((this.y as number) / 100) * totalRespondents
        )}</b>`;
      },
      backgroundColor: "#ffffff",
      borderColor: "#e7e4fb",
      borderRadius: 8,
      shadow: true,
    },
    exporting: {
      enabled: true,
      buttons: {
        contextButton: {
          menuItems: [
            "downloadPNG",
            "downloadJPEG",
            "downloadSVG",
            "downloadPDF",
            "printChart",
          ],
        },
      },
    },
  };

  return (
    <div className="mt-4">
      <HighchartsReact highcharts={Highcharts} options={options} />
      <div className="report-muted mt-4 space-y-1 text-sm">
        <p>{baseText}</p>
        <p>{questionText}</p>
      </div>
    </div>
  );
}
