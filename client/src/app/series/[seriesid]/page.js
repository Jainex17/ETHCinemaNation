"use client";

import {SingleMovie} from "../../../components/SingleMovie/index";
import { usePathname } from "next/navigation";

const SingleSeries = () => {
  const router = usePathname();

  const [, seriesid] = router.split("/series/");

  return (
    <>
      <SingleMovie seriesid={seriesid} />
    </>
  );
};

export default SingleSeries;
