import React from "react";

function ActivityIndicator({color}: {color?: string}) {
  return (
    <div className={`size-6 rounded-full border-2 ${color === "azul" ? "border-azul" : "border-white"} border-b-transparent animate-spin`}></div>
  );
}

export default ActivityIndicator;
