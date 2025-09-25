
import React from 'react'
import batteriesData from "../../../data/BatteriesData"
import BatteryList from './BatteryList';
const Battery = () => {
  return (
   <div style={{ minHeight: "100vh"}}>
      <main style={{ padding: "40px 40px", width:"maxWidth", margin: "0 auto" }}>
        <BatteryList batteries={batteriesData} />
      </main>
    </div>
  )
}

export default Battery;
