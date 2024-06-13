import * as React from "react";
import { useState, useEffect } from "react";
import StatisticsCard from "../StatisticsCard";
import { BarChart } from "@mui/x-charts/BarChart";
import Person from "../../images/person.svg";
import TotalDebts from "../../images/totaldebts.svg";
import Paid from "../../images/paid.svg";
import Unpaid from "../../images/unpaid.svg";


const Column = () => {
  const [chartWidth, setChartWidth] = useState(670); 
  const [chartHeight, setChartHeight] = useState(390); 
  

  useEffect(() => {
    const handleResize = () => {
      
      if (window.innerWidth < 768) {
        setChartWidth(400); 
        setChartHeight(300); 
      } else {
        setChartWidth(670); 
        setChartHeight(390); 
      }
    };

    window.addEventListener("resize", handleResize);
    handleResize();
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const dataset = [
    {
      seoul: 21,
      month: "Ocak",
    },
    {
      seoul: 28,
      month: "Şub",
    },
    {
      seoul: 41,
      month: "Mar",
    },
    {
      seoul: 73,
      month: "Nis",
    },
    {
      seoul: 99,
      month: "May",
    },
    {
      seoul: 144,
      month: "Haz",
    },
    {
      seoul: 319,
      month: "Tem",
    },
    {
      seoul: 249,
      month: "Ağu",
    },
    {
      seoul: 131,
      month: "Eyl",
    },
    {
      seoul: 55,
      month: "Eki",
    },
    {
      seoul: 48,
      month: "Kas",
    },
    {
      seoul: 25,
      month: "Ara",
    },
  ];


  return (
    <>
      <div className="px-5">
        <h1 className="text-4xl font-bold text-center mb-4">Gösterge Paneli</h1>

        <div className="statistics-section flex flex-col items-center justify-center mt-10">
          <h2 className="text-lg">
            Hoş geldin{" "}
            <span className="text-green-700 font-bold text-xl">admin</span>.
          </h2>
          <div className="statics-card grid xl:grid-cols-4 md:grid-cols-2 my-10 md:gap-10 gap-2">
            <StatisticsCard
              title={"Borçlu Kişiler"}
              amount={"7"}
              img={Person}
            />
            <StatisticsCard
              title={"Toplam Borç"}
              amount={"1706.23 ₺"}
              img={TotalDebts}
            />
            <StatisticsCard
              title={"Ödenen Borçlar"}
              amount={"2"}
              img={Paid}
            />
            <StatisticsCard
              title={"Ödenmeyen Borçlar"}
              amount={"33"}
              img={Unpaid}
            />
          </div>
        </div>
        <div className="flex justify-center my-12">
          <div className="w-full lg:w-2/4">
            <BarChart
              dataset={dataset}
              yAxis={[{ scaleType: "band", dataKey: "month" }]}
              series={[{ dataKey: "seoul", label: "Aylara Göre Borç Miktarı" }]}
              layout="horizontal"
              width={chartWidth}
              height={chartHeight} 
            />
          </div>
        </div>
      </div>
      
    </>
  );
};

export default Column;
