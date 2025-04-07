import React from "react";

function Spinner({size=6}) {
  return (
    <div className=" flex items-center justify-center w-full">
      <div className={`border-4 border-primary border-t-white border-r-white rounded-full w-${size} h-${size} animate-spin `} />
    </div>
  );
}

export default Spinner;
